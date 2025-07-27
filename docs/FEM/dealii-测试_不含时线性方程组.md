# dealii-测试_不含时线性方程组

## 弱格式

对应 Xiaoming He Chapter 5: Finite elements for 2D steady linear elasticity equation. 

原始方程:

$$
-\operatorname{div}\bigl(C\,\varepsilon(\vec{u})\bigr) = f
$$

其中 $C$ 是四阶矩阵, 上式可以写为

$$
-\partial_j\bigl(c_{ijkl}\,\varepsilon_{kl}\bigr) = f_i,\quad i = 1,\dots,d.
$$

$$
c_{ijkl} = \lambda\,\delta_{ij}\,\delta_{kl} \;+\; \mu\bigl(\delta_{ik}\,\delta_{jl} + \delta_{il}\,\delta_{jk}\bigr).
$$

$$
\varepsilon(\vec{u})_{kl} = \frac{1}{2}\bigl(\partial_k u_l + \partial_l u_k\bigr).
$$

经过简单的推导, $c_{ijkl}\,\varepsilon_{kl}$ 可以写为 $\sigma_{ij}$,

$$
-\nabla\!\cdot\sigma(\vec{u}) = f
$$

$$
\sigma_{ij}(u) = \lambda\,(\nabla\!\cdot \vec{u})\delta_{ij} + \mu (\partial_i u_j + \partial_j u_i)
$$

$$
\sigma(\vec{u})=
\begin{pmatrix}
\lambda\bigl(\frac{\partial u_1}{\partial x_1} + \frac{\partial u_2}{\partial x_2}\bigr) + 2\mu\,\frac{\partial u_1}{\partial x_1}
&
\mu\bigl(\frac{\partial u_1}{\partial x_2} + \frac{\partial u_2}{\partial x_1} \bigr)
\\[1ex]
\mu\bigl(\frac{\partial u_1}{\partial x_2} + \frac{\partial u_2}{\partial x_1}\bigr)
&
\lambda\bigl(\frac{\partial u_1}{\partial x_1} + \frac{\partial u_2}{\partial x_2}\bigr) + 2\mu\,\frac{\partial u_2}{\partial x_2}
\end{pmatrix}.
$$

将 $\vec{u}$ 乘以对应的 **test function $\vec{v}$,**

$$
-\int_{\Omega} \bigl(\nabla \cdot \sigma(\vec{u})\bigr)\cdot \vec{v} dV=
\int_{\Omega} \vec{f}\cdot \vec{v} dV
$$

代入公式: 

$$
\int_{\Omega} \bigl(\nabla \cdot \sigma(\vec{u})\bigr)\cdot \vec{v} \;dV=
\int_{\partial\Omega}\bigl(\sigma(\vec{u}) \vec{n}\bigr)\cdot \vec{v} dS-
\int_{\Omega}\sigma(\vec{u}):\nabla v dV
$$

其中$\vec{n} = (n_1,n_2)^t$ 垂直于 $\partial \Omega$, 有:


$$
\int_{\Omega}\sigma\bigl(\mathbf{u}\bigr)\colon\nabla\mathbf{v}\,dV-\;\int_{\partial\Omega}\bigl(\sigma(\mathbf{u})\,\mathbf{n}\bigr)\cdot\mathbf{v}\,ds=\;\int_{\Omega}\mathbf{f}\cdot\mathbf{v}\,dV
$$

$$
A : B \;=\;
\begin{pmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{pmatrix}
:
\begin{pmatrix}
b_{11} & b_{12} \\
b_{21} & b_{22}
\end{pmatrix}
\;=\;
a_{11}b_{11} + a_{12}b_{12} + a_{21}b_{21} + a_{22}b_{22}\,.
$$


$$
\nabla \mathbf{v}=
\begin{pmatrix}
\frac{\partial v_{1}}{\partial x_{1}} & \frac{\partial v_{1}}{\partial x_{2}} \\
\frac{\partial v_{2}}{\partial x_{1}} & \frac{\partial v_{2}}{\partial x_{2}}
\end{pmatrix}
$$

然后将弱格式表示为分量的形式 (这里只考虑 Dirichlet BC, 扔掉边界项), 

$$
\sigma\bigl(\mathbf{u}\bigr)\colon\nabla\mathbf{v}=\sigma_{kl}\nabla\vec{v}_{kl} = [\lambda \text{div}(\vec{u})\delta_{kl}+\mu (\partial_k u_l + \partial_l u_k)]\partial_l v_k 
$$

$$
a(\mathbf{u}, \mathbf{v})=
\sum_{k,l}
\bigl(\lambda\,\partial_l u_l,\;\partial_k v_k\bigr)_{\!\Omega}
\;+\;\sum_{k,l}
\bigl(\mu\,\partial_k u_l,\;\partial_k v_l\bigr)_{\!\Omega}
\;+\;\sum_{k,l}
\bigl(\mu\,\partial_k u_l,\;\partial_l v_k\bigr)_{\!\Omega}.
$$

**对于基函数, 有**

$$
\vec{\Phi}_i = \phi_{\text{base(i)}} \hat{e}_{comp(i)}
$$

其中 $i = 1,...,N$, 一共有 $N$ 个基函数。`base(i)` 有很复杂的表示方法, 我们完全不用关心, 由 dealii 自动处理. 于是:

$$
\vec{\Phi}_i = \phi_i \hat{e}_{comp(i)} \\
\vec{u} = U_j \vec{\Phi}_j \\
\vec{v}_i = \vec{\Phi}_i
$$

所以 

$$
a(\mathbf{u}, \mathbf{v})=
U_j\sum_{k,l}
\bigl(\lambda\,\partial_l (\vec{\Phi}_j)_l,\;\partial_k (\vec{\Phi}_i)_k\bigr)_{\!\Omega}
+U_j \sum_{k,l}
\bigl(\mu\,\partial_k (\vec{\Phi}_j)_l,\partial_k (\vec{\Phi}_i)_l\bigr)_{\!\Omega} + U_j \sum_{k,l}
\bigl(\mu\,\partial_k (\vec{\Phi}_j)_l,\partial_l (\vec{\Phi}_i)_k\bigr)_{\!\Omega}.
$$

因为第 $i$ 个基函数 $\vec{\Phi}_i$ 只有一个分量非0, 因此

$$
(\vec{\Phi}_i)_l = \phi_i \delta_{l,comp(i)}
$$

于是

$$
a(\mathbf{u}, \mathbf{v})=
U_j
\bigl(\lambda \partial_{comp(j)} \phi_j, \partial_{comp(i)} \phi_{i}\bigr)
+U_j \sum_{k,l}
\bigl(\mu \partial_k \phi_j \delta_{l,comp(j)},\partial_k \phi_i \delta_{l, comp(i)}\bigr)_{\Omega} + U_j \sum_{k,l}
\bigl(\mu \partial_k \phi_j \delta_{l,comp(j)},\partial_l \phi_i \delta_{k,comp(i)}\bigr)_{\Omega} \\
= U_j
\bigl(\lambda\,\partial_{comp(j)} \phi_j,\;\partial_{comp(i)} \phi_{i}\bigr)
+U_j \mu \delta_{comp(i),comp(j)}(\partial_k\phi_j, \partial_k \phi_i)+
U_j(\mu\partial_{comp(i)}\phi_j,\partial_{comp(j)}\phi_i)
$$

$$
\vec{f}\cdot\vec{v} = f_k v_k = f_k \phi_i \delta_{k,comp(i)} = f_{comp(i)}\phi_i
$$


## 测试算例

$\Omega = [0, 1] \times [0, 1]$: 

$$ -\nabla \cdot \sigma(\mathbf{u}) = \mathbf{f} \quad \text{on } \Omega, \\ u_1 = 0, u_2 = 0 \quad \text{on } \partial\Omega,$$ 

$$ \begin{align*} f_1 &= -(\lambda + 2\mu)(-\pi^2 \sin(\pi x) \sin(\pi y)) - (\lambda + \mu)((2x - 1)(2y - 1)) - \mu(-\pi^2 \sin(\pi x) \sin(\pi y)), \\ f_2 &= -(\lambda + 2\mu)(2x(x - 1)) - (\lambda + \mu)(\pi^2 \cos(\pi x) \cos(\pi y)) - \mu(2y(y - 1)). \end{align*} $$ 

$\lambda = 1$ and $\mu = 2$.

对应的解析解是 

$$
u_1 = \sin(\pi x) \sin(\pi y) \\
u_2 = x(x-1)y(y-1)
$$


<!--


$$
f_x(x, y) =
\begin{cases}
1.0 & \text{if } (x-0.5)^2 + y^2 < 0.2^2 \\
& \quad \text{or} \ (x+0.5)^2 + y^2 < 0.2^2 \\
0.0 & \text{otherwise}
\end{cases}
$$

$$
f_y(x, y) = \begin{cases} 1.0 & \text{if } x^2 + y^2 < 0.2^2 \\ 0.0 & \text{otherwise} \end{cases}
$$

-->


## dealii 实现

```cpp

#include <deal.II/base/quadrature_lib.h>
#include <deal.II/base/function.h>
#include <deal.II/base/tensor.h>

#include <deal.II/lac/vector.h>
#include <deal.II/lac/full_matrix.h>
#include <deal.II/lac/sparse_matrix.h>
#include <deal.II/lac/dynamic_sparsity_pattern.h>
#include <deal.II/lac/solver_cg.h>
#include <deal.II/lac/precondition.h>
#include <deal.II/lac/affine_constraints.h>

#include <deal.II/grid/tria.h>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_refinement.h>

#include <deal.II/dofs/dof_handler.h>
#include <deal.II/dofs/dof_tools.h>

#include <deal.II/fe/fe_values.h>

#include <deal.II/numerics/vector_tools.h>
#include <deal.II/numerics/matrix_tools.h>
#include <deal.II/numerics/data_out.h>
#include <deal.II/numerics/error_estimator.h>


#include <deal.II/fe/fe_system.h>
#include <deal.II/fe/fe_q.h>
#include <fstream>
#include <iostream>

template<int dim>
class ElasticProblem
{
    public:
        ElasticProblem(double h);
        void run();
        void compute_errors() const;

    private:
        void setup_system();
        void assemble_system();
        void solve();
        void output_results() const;

        dealii::Triangulation<dim> triangulation;
        dealii::DoFHandler<dim> dof_handler;

        dealii::FESystem<dim> fe;
        double h_;

        dealii::AffineConstraints<double> constraints;
        dealii::SparsityPattern sparsity_pattern;
        dealii::SparseMatrix<double> system_matrix;

        dealii::Vector<double> solution;
        dealii::Vector<double> system_rhs;
};

template <int dim>
class ExactSolution : public dealii::Function<dim>{
    public:
    ExactSolution(): dealii::Function<dim>(dim){}

    virtual void vector_value(const dealii::Point<dim> &p,
           dealii::Vector<double> &values) const override{
        Assert(values.size() == dim,
                dealii::ExcDimensionMismatch(values.size(), dim));
        const double x = p[0];
        const double y = p[1];
        const double pi = dealii::numbers::PI;
        values[0] = std::sin(pi*x)*std::sin(pi*y);
        values[1] = x * (x - 1.0) * y * (y - 1.0); 
    }

  virtual void
  vector_gradient(const dealii::Point<dim> &p,
                  std::vector<dealii::Tensor<1, dim>> &gradients) const override
  {
    Assert(gradients.size() == dim,
           dealii::ExcDimensionMismatch(gradients.size(), dim));

    const double x  = p[0];
    const double y  = p[1];
    const double pi = dealii::numbers::PI;

    // Gradient of u1: (∂u1/∂x, ∂u1/∂y)
    gradients[0][0] = pi * std::cos(pi * x) * std::sin(pi * y);
    gradients[0][1] = pi * std::sin(pi * x) * std::cos(pi * y);

    // Gradient of u2: (∂u2/∂x, ∂u2/∂y)
    gradients[1][0] = (2.0 * x - 1.0) * y * (y - 1.0);
    gradients[1][1] = x * (x - 1.0) * (2.0 * y - 1.0);
  }
};



template<int dim>
void right_hand_side(const std::vector<dealii::Point<dim>> &points,
                     std::vector<dealii::Tensor<1,dim>> &values){
    AssertDimension(values.size(), points.size());
    Assert(dim >= 2, dealii::ExcNotImplemented());

    const double lambda = 1.0;
    const double mu = 2.0;
    const double pi = dealii::numbers::PI;


    for (unsigned int point_n = 0; point_n < points.size(); ++point_n){
        // f1
        double x = points[point_n][0];
        double y = points[point_n][1];
        values[point_n][0] = - (lambda + 2. * mu) *
            (-pi * pi * std::sin(pi * x) * std::sin(pi * y))
                - (lambda + mu) * ((2. * x - 1.) * (2. * y - 1.))
                - mu * (-pi * pi * std::sin(pi * x) * std::sin(pi * y));
        values[point_n][1] = - (lambda + 2. * mu) * (2. * x * (x - 1.))
                - (lambda + mu) * (pi * pi * std::cos(pi * x) * std::cos(pi * y))
                - mu * (2. * y * (y - 1.));
    }
}


template <int dim>
ElasticProblem<dim>::ElasticProblem(double h)
  : dof_handler(triangulation)
  , fe(dealii::FE_Q<dim>(1),dim), h_(h)
{}


template <int dim>
void ElasticProblem<dim>::setup_system(){
  dof_handler.distribute_dofs(fe);
  solution.reinit(dof_handler.n_dofs());
  system_rhs.reinit(dof_handler.n_dofs());

  constraints.clear();
  dealii::DoFTools::make_hanging_node_constraints(dof_handler, constraints);
  dealii::VectorTools::interpolate_boundary_values(dof_handler,
                                           0,
                                           ExactSolution<dim>(),
                                           //dealii::Functions::ZeroFunction<dim>(dim),
                                           constraints);
  constraints.close();

  dealii::DynamicSparsityPattern dsp(dof_handler.n_dofs(), dof_handler.n_dofs());
  dealii::DoFTools::make_sparsity_pattern(dof_handler,
                                  dsp,
                                  constraints,
                                  /*keep_constrained_dofs = */ false);
  sparsity_pattern.copy_from(dsp);

  system_matrix.reinit(sparsity_pattern);
}

template <int dim>
void ElasticProblem<dim>::assemble_system(){
    dealii::QGauss<dim> quadrature_formula(fe.degree + 1);
    dealii::FEValues<dim> fe_values(fe,
                            quadrature_formula,
                            dealii::update_values | dealii::update_gradients |
                            dealii::update_quadrature_points | dealii::update_JxW_values);

    const unsigned int dofs_per_cell = fe.n_dofs_per_cell();
    const unsigned int n_q_points    = quadrature_formula.size();

    dealii::FullMatrix<double> cell_matrix(dofs_per_cell, dofs_per_cell);
    dealii::Vector<double>     cell_rhs(dofs_per_cell);

    std::vector<dealii::types::global_dof_index> local_dof_indices(dofs_per_cell);

    std::vector<double> lambda_values(n_q_points);
    std::vector<double> mu_values(n_q_points);

    dealii::Functions::ConstantFunction<dim> lambda(1.), mu(2.);

    std::vector<dealii::Tensor<1, dim>> rhs_values(n_q_points);

    for (const auto &cell: dof_handler.active_cell_iterators()){
        cell_matrix = 0;
        cell_rhs    = 0;
        fe_values.reinit(cell);
        lambda.value_list(fe_values.get_quadrature_points(), lambda_values);
        mu.value_list(fe_values.get_quadrature_points(), mu_values);
        right_hand_side(fe_values.get_quadrature_points(), rhs_values);

        for (const unsigned int i: fe_values.dof_indices()){
            const unsigned int component_i =
              fe.system_to_component_index(i).first;
            for (const unsigned int j : fe_values.dof_indices()){
                const unsigned int component_j =
                  fe.system_to_component_index(j).first;
                for (const unsigned int q_point :
                     fe_values.quadrature_point_indices()){
                        cell_matrix(i, j) +=
                            (
                            (fe_values.shape_grad(i,q_point)[component_i] *
                            fe_values.shape_grad(j,q_point)[component_j] *
                            lambda_values[q_point]) +
                            (fe_values.shape_grad(i,q_point)[component_j] *
                             fe_values.shape_grad(j,q_point)[component_i] *
                             mu_values[q_point]) +
                            ((component_i == component_j) ? 
                             (fe_values.shape_grad(i,q_point) *
                            fe_values.shape_grad(j,q_point) *
                            mu_values[q_point]) : 0.0)
                            ) * fe_values.JxW(q_point);

                }
            }
        }

        for (const unsigned int i : fe_values.dof_indices()){
            const unsigned int component_i =
              fe.system_to_component_index(i).first;
            for (const unsigned int q_point : fe_values.quadrature_point_indices()){
                cell_rhs(i) += fe_values.shape_value(i, q_point) *
                               rhs_values[q_point][component_i] *
                               fe_values.JxW(q_point);
            }
        }

        
        cell->get_dof_indices(local_dof_indices);
        constraints.distribute_local_to_global(
          cell_matrix, cell_rhs, local_dof_indices, system_matrix, system_rhs);
    }
}


template <int dim>
void ElasticProblem<dim>::solve()
{
    dealii::SolverControl            solver_control(1000, 1e-12);
    dealii::SolverCG<dealii::Vector<double>> cg(solver_control);

    dealii::PreconditionSSOR<dealii::SparseMatrix<double>> preconditioner;
    preconditioner.initialize(system_matrix, 1.2);

    cg.solve(system_matrix, solution, system_rhs, preconditioner);

    constraints.distribute(solution);
}


template <int dim>
void ElasticProblem<dim>::output_results() const{
    dealii::DataOut<dim> data_out;
    data_out.attach_dof_handler(dof_handler);

    std::vector<std::string> solution_names;
    switch (dim){
      case 1:
        solution_names.emplace_back("displacement");
        break;
      case 2:
        solution_names.emplace_back("x_displacement");
        solution_names.emplace_back("y_displacement");
        break;
      case 3:
        solution_names.emplace_back("x_displacement");
        solution_names.emplace_back("y_displacement");
        solution_names.emplace_back("z_displacement");
        break;
      default:
        DEAL_II_NOT_IMPLEMENTED();
    }

  data_out.add_data_vector(solution, solution_names);
  data_out.build_patches();

  std::ofstream output("solution.vtk");
  data_out.write_vtk(output);
}



template <int dim>
void ElasticProblem<dim>::run(){
    const dealii::Point<2> p1(0., 0.);
    const dealii::Point<2> p2(1., 1.);
    unsigned int mx = 1.0 / h_;
    unsigned int my = 1.0 / h_;
    const std::vector<unsigned int> ncells = {mx, my};

    dealii::GridGenerator::subdivided_hyper_rectangle(triangulation,
            ncells, p1, p2);


    setup_system();

    std::cout << "   Number of degrees of freedom: " << dof_handler.n_dofs()
              << std::endl;

    assemble_system();
    solve();
    output_results();
}

template <int dim>
void ElasticProblem<dim>::compute_errors() const
{
  const ExactSolution<dim> exact_solution;

  dealii::Vector<double> max_error_per_cell(triangulation.n_active_cells());
  dealii::VectorTools::integrate_difference(dof_handler,
                                            solution,
                                            exact_solution,
                                            max_error_per_cell,
                                            dealii::QGauss<dim>(fe.degree+2),
                                            dealii::VectorTools::Linfty_norm);
  const double L_infty_error =
    dealii::VectorTools::compute_global_error(triangulation,
                                              max_error_per_cell,
                                              dealii::VectorTools::Linfty_norm);

  dealii::Vector<double> L2_error_per_cell(triangulation.n_active_cells());
  dealii::VectorTools::integrate_difference(dof_handler,
                                            solution,
                                            exact_solution,
                                            L2_error_per_cell,
                                            dealii::QGauss<dim>(fe.degree + 2),
                                            dealii::VectorTools::L2_norm);
  const double L2_error =
    dealii::VectorTools::compute_global_error(triangulation,
                                              L2_error_per_cell,
                                              dealii::VectorTools::L2_norm);

  dealii::Vector<double> H1_error_per_cell(triangulation.n_active_cells());
  dealii::VectorTools::integrate_difference(dof_handler,
                                            solution,
                                            exact_solution,
                                            H1_error_per_cell,
                                            dealii::QGauss<dim>(fe.degree + 1),
                                            dealii::VectorTools::H1_seminorm);
  const double H1_error =
    dealii::VectorTools::compute_global_error(triangulation,
                                              H1_error_per_cell,
                                              dealii::VectorTools::H1_seminorm);
  
  std::cout << "   Errors:\n"
            << "   L-infinity error: " << L_infty_error << '\n'
            << "   L2 error:         " << L2_error << '\n'
            << "   H1 error:         " << H1_error << std::endl;
}





int main(){
    ElasticProblem<2> elestic_problem_2d(1./64.);
    elestic_problem_2d.run();
    elestic_problem_2d.compute_errors();
    return 0;
}
```


## benchmark

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250727/image.54y2b4hwns.webp){width=400px}

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250727/image.4n80mjhf6g.webp){width=400px}

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250727/image.99tnn8gjr7.webp){width=400px}

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250727/image.26ls7mcl6n.webp){width=400px}

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250727/image.1zikc6ts7e.webp){width=400px}
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTUwMDkwMzA5MywxNzIzNzg3MDYsLTE0Mj
gyMzU0MjEsMjAwNDQ1NDE0NywzMDg4Mjk4NzUsLTk5NTkxMzIy
MywxODU5OTY0OTM3LC0xNDA4NzA2OTYsLTI0NDE1NDI0Miw2Nj
E2NjMyNjcsMTc5ODY5MDkyMCwyMDc3NTkyNDE4LC0xMDQ2Mjkz
OTY0LC01MzQ0NDQ3NDMsMTg2MDg0NzcwNiwtNTM2NjAzMjAxLD
YxMTUxMTgyOCwtMTI1OTQ5OTA2NywtOTY5NjYwMDYzLC0xMzYy
MjAwOTg3XX0=
-->