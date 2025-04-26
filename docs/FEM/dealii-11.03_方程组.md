# dealii-11.03_方程组

- `EulerEquations` 类：封装所有完全描述欧拉方程特性的内容，包括通量矩阵 $\mathbf{F}(\mathbf{W})$，数值通量 $\mathbf{F}(\mathbf{W}^+, \mathbf{W}^-, \mathbf{n})$，右端项 $\mathbf{G}(\mathbf{W})$，边界条件等等。

---


```cpp
  template <int dim>
  struct EulerEquations
  {

    static const unsigned int n_components             = dim + 2;
    static const unsigned int first_momentum_component = 0;
    static const unsigned int density_component        = dim;
    static const unsigned int energy_component         = dim + 1;

    static std::vector<std::string> component_names()
    {
      std::vector<std::string> names(dim, "momentum");
      names.emplace_back("density");
      names.emplace_back("energy_density");

      return names;
    }
	// 这个函数的作用是告诉 deal.II 的后处理模块（`DataOut` 等）
	// ——“我这个有限元解向量中的各个分量，应该被当作向量场的组成部分，
	// 还是被当作标量来处理” (生成 vtk 文件时有用)
    static std::vector<DataComponentInterpretation::DataComponentInterpretation>
    component_interpretation()
    {
      std::vector<DataComponentInterpretation::DataComponentInterpretation>
        data_component_interpretation(
          dim, DataComponentInterpretation::component_is_part_of_vector);
      data_component_interpretation.push_back(
        DataComponentInterpretation::component_is_scalar);
      data_component_interpretation.push_back(
        DataComponentInterpretation::component_is_scalar);

      return data_component_interpretation;
    }

    static const double gas_gamma;

    template <typename InputVector>
    static typename InputVector::value_type
    compute_kinetic_energy(const InputVector &W)
    {
      typename InputVector::value_type kinetic_energy = 0;
      for (unsigned int d = 0; d < dim; ++d)
        kinetic_energy +=
          W[first_momentum_component + d] * W[first_momentum_component + d];
      kinetic_energy *= 1. / (2 * W[density_component]);

      return kinetic_energy;
    }

    template <typename InputVector>
    static typename InputVector::value_type
    compute_pressure(const InputVector &W)
    {
      return ((gas_gamma - 1.0) *
              (W[energy_component] - compute_kinetic_energy(W)));
    }

    // 表示一个 n_components × dim 大小的二维数组
    template <typename InputVector>
    static void compute_flux_matrix(const InputVector &W,
                                    ndarray<typename InputVector::value_type,
                                            EulerEquations<dim>::n_components,
                                            dim>      &flux)
    {
      const typename InputVector::value_type pressure = compute_pressure(W);

      for (unsigned int d = 0; d < dim; ++d)
        {
          for (unsigned int e = 0; e < dim; ++e)
            flux[first_momentum_component + d][e] =
              W[first_momentum_component + d] *
              W[first_momentum_component + e] / W[density_component];

          flux[first_momentum_component + d][d] += pressure;
        }

      for (unsigned int d = 0; d < dim; ++d)
        flux[density_component][d] = W[first_momentum_component + d];

      for (unsigned int d = 0; d < dim; ++d)
        flux[energy_component][d] = W[first_momentum_component + d] /
                                    W[density_component] *
                                    (W[energy_component] + pressure);
    }

    template <typename InputVector>
    static void numerical_normal_flux(
      const Tensor<1, dim>                                       &normal,
      const InputVector                                          &Wplus,
      const InputVector                                          &Wminus,
      const double                                                alpha,
      std::array<typename InputVector::value_type, n_components> &normal_flux)
    {
      ndarray<typename InputVector::value_type,
              EulerEquations<dim>::n_components,
              dim>
        iflux, oflux;

      compute_flux_matrix(Wplus, iflux);
      compute_flux_matrix(Wminus, oflux);

      for (unsigned int di = 0; di < n_components; ++di)
        {
          normal_flux[di] = 0;
          for (unsigned int d = 0; d < dim; ++d)
            normal_flux[di] += 0.5 * (iflux[di][d] + oflux[di][d]) * normal[d];

          normal_flux[di] += 0.5 * alpha * (Wplus[di] - Wminus[di]);
        }
    }

    template <typename InputVector>
    static void compute_forcing_vector(
      const InputVector                                          &W,
      std::array<typename InputVector::value_type, n_components> &forcing)
    {
      const double gravity = -1.0;

      for (unsigned int c = 0; c < n_components; ++c)
        switch (c)
          {
            case first_momentum_component + dim - 1:
              forcing[c] = gravity * W[density_component];
              break;
            case energy_component:
              forcing[c] = gravity * W[first_momentum_component + dim - 1];
              break;
            default:
              forcing[c] = 0;
          }
    }

    enum BoundaryKind
    {
      inflow_boundary,
      outflow_boundary,
      no_penetration_boundary,
      pressure_boundary
    };

    template <typename DataVector>
    static void
    compute_Wminus(const std::array<BoundaryKind, n_components> &boundary_kind,
                   const Tensor<1, dim>                         &normal_vector,
                   const DataVector                             &Wplus,
                   const Vector<double> &boundary_values,
                   const DataVector     &Wminus)
    {
      for (unsigned int c = 0; c < n_components; ++c)
        switch (boundary_kind[c])
          {
            case inflow_boundary:
              {
                Wminus[c] = boundary_values(c);
                break;
              }

            case outflow_boundary:
              {
                Wminus[c] = Wplus[c];
                break;
              }

            case pressure_boundary:
              {
                const typename DataVector::value_type density =
                  (boundary_kind[density_component] == inflow_boundary ?
                     boundary_values(density_component) :
                     Wplus[density_component]);

                typename DataVector::value_type kinetic_energy = 0;
                for (unsigned int d = 0; d < dim; ++d)
                  if (boundary_kind[d] == inflow_boundary)
                    kinetic_energy += boundary_values(d) * boundary_values(d);
                  else
                    kinetic_energy += Wplus[d] * Wplus[d];
                kinetic_energy *= 1. / 2. / density;

                Wminus[c] =
                  boundary_values(c) / (gas_gamma - 1.0) + kinetic_energy;

                break;
              }

            case no_penetration_boundary:
              {
                typename DataVector::value_type vdotn = 0;
                for (unsigned int d = 0; d < dim; ++d)
                  {
                    vdotn += Wplus[d] * normal_vector[d];
                  }

                Wminus[c] = Wplus[c] - 2.0 * vdotn * normal_vector[c];
                break;
              }

            default:
              DEAL_II_NOT_IMPLEMENTED();
          }
    }

    static void
    compute_refinement_indicators(const DoFHandler<dim> &dof_handler,
                                  const Mapping<dim>    &mapping,
                                  const Vector<double>  &solution,
                                  Vector<double>        &refinement_indicators)
    {
      const unsigned int dofs_per_cell = dof_handler.get_fe().n_dofs_per_cell();
      std::vector<unsigned int> dofs(dofs_per_cell);

      const QMidpoint<dim> quadrature_formula;
      const UpdateFlags    update_flags = update_gradients;
      FEValues<dim>        fe_v(mapping,
                         dof_handler.get_fe(),
                         quadrature_formula,
                         update_flags);

      std::vector<std::vector<Tensor<1, dim>>> dU(
        1, std::vector<Tensor<1, dim>>(n_components));

      for (const auto &cell : dof_handler.active_cell_iterators())
        {
          const unsigned int cell_no = cell->active_cell_index();
          fe_v.reinit(cell);
          fe_v.get_function_gradients(solution, dU);

          refinement_indicators(cell_no) = std::log(
            1 + std::sqrt(dU[0][density_component] * dU[0][density_component]));
        }
    }

    class Postprocessor : public DataPostprocessor<dim>
    {
    public:
      Postprocessor(const bool do_schlieren_plot);

      virtual void evaluate_vector_field(
        const DataPostprocessorInputs::Vector<dim> &inputs,
        std::vector<Vector<double>> &computed_quantities) const override;

      virtual std::vector<std::string> get_names() const override;

      virtual std::vector<
        DataComponentInterpretation::DataComponentInterpretation>
      get_data_component_interpretation() const override;

      virtual UpdateFlags get_needed_update_flags() const override;

    private:
      const bool do_schlieren_plot;
    };
  };
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbODQxODk2OTQsMTEwOTc2NzI0Miw1Nzc2MD
c5NDAsLTIwMTQxMzczMDcsLTkxNDM0NTc1N119
-->