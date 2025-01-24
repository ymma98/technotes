# step-15, 非线椭圆方程

* [step-15](https://www.dealii.org/current/doxygen/deal.II/step_15.html)

## 理论

There is no finite algorithm to find a root of a single general nonlinear equation:

$$ f(x) = 0 $$

All algorithms for this kind of problem are iterative:

- Start with an initial guess $x_0$
- Compute a sequence of iterates $\{ x_k \}$
- Hope (or prove) that $x_k \to x$ where $x$ is a root of $f(.)$

**Goal:** Choose $g(x)$ so that

$$ x_{k+1} = g(x_k) \quad \Longleftrightarrow \quad f(x) = 0 $$

**Examples:**

- "Picard iteration" (assume that $f(x) = p(x) x - h$):

  $$ g(x) = \frac{1}{p(x)} h \quad \Longrightarrow \quad p(x_k) x_{k+1} = h $$

- Pseudo-timestepping:

  $$ g(x) = x \pm \Delta \tau f(x) \quad \Longrightarrow \quad \frac{x_{k+1} - x_k}{\Delta \tau} = \pm f(x_k) $$

- Newton's method:

  $$ g(x) = x - \frac{f(x)}{f'(x)} \quad \Longrightarrow \quad x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)} $$


对于非线性的有限元，相当于求解线性系统 

$$
K(u) u = f
$$

定义残差:

$$
R(u) = K(u) u -f 
$$

我们的目标是求解 $R(u) = 0$。

假设 $u_{k}$ 是当前值, 对 $R(u)$ 在 $u_k$ 处进行泰勒展开, 展开到一阶,

$$
R(u) = R(u_k) + \frac{dR(u_k)}{du_k} (u-u_k) = 0
$$

令 $u_{k+1}$ 是 $R(u)=0$ 的解, $\delta u_k = u_{k+1} - u_k$ 有:

$$
R(u_{k}) + \frac{dR(u_k)}{du_k} \delta u_k = 0
$$

于是得到线性方程组:

$$
\frac{dR(u_k)}{du_k} \delta u_k = -R(u_k)
$$

其中,

$$
\frac{dR(u_k)}{du_k} \delta u_k = \frac{dR}{d\epsilon} = \lim_{\epsilon\rightarrow0} \frac{dR[u_k + \epsilon \delta u_k] - dR[u_k]}{\epsilon} = \frac{\partial R}{\partial u_k} \delta u_k+\frac{\partial R}{\partial \nabla u_k} \cdot \nabla \delta u_k
$$


### Picard iteration 

**Goal:** Solve

$$- \nabla \cdot \left( A \frac{\nabla u}{\sqrt{1 + |\nabla u|^2}} \right) = f \\
u=g \quad \text{on} \quad \partial\Omega
$$

**Picard iteration:** Repeatedly solve

$$
\left( \nabla \varphi, \frac{A \nabla u_{k+1}}{\sqrt{1 + |\nabla u_k|^2}} \right) = (\varphi, f), \quad \nabla \varphi \in H_0^1
$$

- Converges frequently
- Picard iteration typically converges rather slowly

### Pseudo-timestepping

**Pseudo-timestepping:** Iterate to $\tau \to \infty$ the equation
$$
\frac{\partial u(\tau)}{\partial \tau} - \nabla \cdot \left( A \frac{\nabla u(\tau)}{\sqrt{1 + |\nabla u(\tau)|^2}} \right) = f
$$

For example using the explicit Euler method:
$$
\frac{u_{k+1} - u_k}{\Delta \tau} - \nabla \cdot \left( A \frac{\nabla u_k}{\sqrt{1 + |\nabla u_k|^2}} \right) = f
$$

Semi-implicit Euler method
$$
\frac{u_{k+1} - u_k}{\Delta \tau} - \nabla \cdot \left( A \frac{\nabla u_{k+1}}{\sqrt{1 + |\nabla u_k|^2}} \right) = f
$$

- Pseudo-timestepping converges almost always
- Easy to implement (it's just a heat equation)
- With implicit method, can make time step larger + larger
- Often takes many, many time steps

### Newton's method

对于方程:

$$- \nabla \cdot \left( A \frac{\nabla u}{\sqrt{1 + |\nabla u|^2}} \right) = f$$

定义方程的残差为 $R(u)$: 

$$
R(u) = -\nabla \cdot \left( A \frac{\nabla u}{\sqrt{1 + |\nabla u|^2}} \right) -f
$$

此时相当于求解 $R(u) = 0$。对于非线性方程, 应用牛顿迭代, 相当于求解 


$$
\frac{dR(u_k)}{du_k} \delta u_k = -R(u_k)
$$

其中,

$$
\frac{dR(u_k)}{du_k} \delta u_k = \frac{dR}{d\epsilon} = \lim_{\epsilon\rightarrow0} \frac{dR[u_k + \epsilon \delta u_k] - dR[u_k]}{\epsilon} = \frac{\partial R}{\partial u_k} \delta u_k+\frac{\partial R}{\partial \nabla u_k} \nabla \delta u_k
$$


$$
 R.H.S = \frac{\partial R}{\partial u_k} \delta u_k+\frac{\partial R}{\partial \nabla u_k} \nabla \delta u = 0 -\nabla\cdot \left[ A \left(- \frac{\nabla u \cdot  \nabla\delta u_k}{1+|\nabla u|^{3/2}}\nabla u  + \frac{\nabla \delta u_k}{\sqrt{1+|\nabla u|^2}} \right)  \right]
$$


Here, this means:

$$- \nabla \cdot \left( \frac{A}{\sqrt{1 + |\nabla u_k|^2}} \nabla \delta u_k \right) + \nabla \cdot \left( \frac{A \nabla u_k \cdot \nabla \delta u_k}{(1 + |\nabla u_k|^2)^{3/2}} \nabla u_k \right) = f + \nabla \cdot \left( \frac{A}{\sqrt{1 + |\nabla u_k|^2}} \nabla u_k \right)$$

This is in fact a symmetric and positive definite problem.

## 弱格式

假设 test function 是 $\varphi$:

$$
\left( \nabla \varphi, \frac{1}{\left( 1 + |\nabla u^n|^2 \right)^{\frac{1}{2}}} \nabla \delta u^n \right) 
    - \left( \nabla \varphi, \frac{\nabla u^n \cdot \nabla \delta u^n}{\left( 1 + |\nabla u^n|^2 \right)^{\frac{3}{2}}} \nabla u^n \right) 
= - \left( \nabla \varphi, \frac{1}{\left( 1 + |\nabla u^n|^2 \right)^{\frac{1}{2}}} \nabla u^n \right).
$$

假设基函数为 $\{\varphi_0, \ldots, \varphi_{N-1}\}$, 有:

$$
\delta u^n = \sum_{j=0}^{N-1} \delta U_j^n \varphi_j.
$$

定义 $a_n := \frac{1}{\sqrt{1 + |\nabla u^n|^2}}$,  $n$ 是指第 n 次牛顿迭代, 有:

$$
\sum_{j=0}^{N-1} \left[ (\nabla \varphi_i, a_n \nabla \varphi_j) 
    - (\nabla u^n \cdot \nabla \varphi_i, a_n^3 \nabla u^n \cdot \nabla \varphi_j) \right] \delta U_j 
= - (\nabla \varphi_i, a_n \nabla u^n) \quad \forall i = 0, \ldots, N-1,
$$

where the solution $\delta u^n$ is given by the coefficients $\delta U_j^n$. This linear system of equations can be rewritten as:

$$
A^n \delta U^n = b^n,
$$

where the entries of the matrix $A^n$ are given by:

$$
A_{ij}^n := (\nabla \varphi_i, a_n \nabla \varphi_j) 
    - (\nabla u^n \cdot \nabla \varphi_i, a_n^3 \nabla u^n \cdot \nabla \varphi_j),
$$

and the right-hand side $b^n$ is given by:

$$
b_i^n := -(\nabla \varphi_i, a_n \nabla u^n).
$$


求解流程:

1. initial guess $u^0 \equiv 0$, 并且 $u^0$ 满足边界条件 $u=g$ (in the call to `AffineConstraints::distribute()`). Set $n = 0$. 上标是牛顿迭代的编号。

2. 计算$\delta u_n$. Compute the Newton update by solving the system 

$$
A^n \delta u^n = b^n
$$
with boundary condition $\delta u^n = 0$ on $\partial \Omega$ (第一步设置了正确的边界条件, 之后每一步 $\delta u^n$ 都设置在边界处为0，这样确保最后的边界条件是正确的).

4. 计算 $\alpha^n$. Compute a step length $\alpha^n$. In this program, we always set $\alpha^n = 0.1$. To make things easier to extend later on, this happens in a function of its own, namely in `MinimalSurfaceProblem::determine_step_length`.  (step-77 有更复杂的策略)

5. 计算 $u^{n+1}$. The new approximation of the solution is given by
$$
u^{n+1} = u^n + \alpha^n \delta u^n.
$$

6. 每五步更新一次网格. If $n$ is a multiple of 5 then refine the mesh, transfer the solution $u^{n+1}$ to the new mesh and set the values of $u^{n+1}$ in such a way that along the boundary we have $u^{n+1}_{|\partial \Omega} = g$. 

7. Set $n \leftarrow n + 1$ and go to step 2.

The testcase we solve is chosen as follows: We seek to find the solution of minimal surface over the unit disk 
$$
\Omega = \left\{ x : \|x\| < 1 \right\} \subset \mathbb{R}^2
$$
where the surface attains the values $u(x, y) \Big|_{\partial \Omega} = g(x, y) := \sin(2\pi(x + y))$ along the boundary.

## 代码拆解

记是不可能记住的。

```cpp
  #include <deal.II/base/quadrature_lib.h>
  #include <deal.II/base/function.h>
  #include <deal.II/base/utilities.h>

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
  #include <deal.II/fe/fe_q.h>

  #include <deal.II/numerics/vector_tools.h>
  #include <deal.II/numerics/data_out.h>
  #include <deal.II/numerics/error_estimator.h>

  #include <fstream>
  #include <iostream>
  // transfer solution from old mesh to a new one (adaptive mesh grid)
  #include <deal.II/numerics/solution_transfer.h>
```

### 设置solver框架

```cpp
  namespace Step15
  {
    using namespace dealii;
        template <int dim>
    class MinimalSurfaceProblem
    {
    public:
      MinimalSurfaceProblem();
      void run();

    private:
      void   setup_system();
      void   assemble_system();
      void   solve();
      void   refine_mesh();
      // 非线性迭代残差计算
      double compute_residual(const double alpha) const;
      double determine_step_length() const;
      void   output_results(const unsigned int refinement_cycle) const;

      Triangulation<dim> triangulation;

      DoFHandler<dim> dof_handler;
      const FE_Q<dim> fe;

      // 自适应网格会用到, zero_constraints -> \delta u_n
      //                 nonzero_constraints -> u_n
      AffineConstraints<double> zero_constraints;
      AffineConstraints<double> nonzero_constraints;

      SparsityPattern      sparsity_pattern;
      SparseMatrix<double> system_matrix;

      // u_n
      Vector<double> current_solution;
      // delta u_n
      Vector<double> newton_update;
      Vector<double> system_rhs;
    };
```

### 定义求解问题

* BC

```cpp
    template <int dim>
    class BoundaryValues : public Function<dim>
    {
    public:
      virtual double value(const Point<dim>  &p,
                           const unsigned int component = 0) const override;
    };

    template <int dim>
    double BoundaryValues<dim>::value(const Point<dim> &p,
                                      const unsigned int /*component*/) const
    {
      return std::sin(2 * numbers::PI * (p[0] + p[1]));
    }
```

### 设置求解器的构造函数与初始化函数

* 构造函数, 和之前的构造函数没有不同

```cpp
    template <int dim>
    MinimalSurfaceProblem<dim>::MinimalSurfaceProblem()
      : dof_handler(triangulation)
      , fe(2)
    {}
```


```cpp
    template <int dim>
    void MinimalSurfaceProblem<dim>::setup_system()
    {
      dof_handler.distribute_dofs(fe);
      // u_n
      current_solution.reinit(dof_handler.n_dofs());

	  // 从 .clear 到 .close 是自适应网格的固定流程
	  // 这里 clear 的作用是, 清除上个 system 的 constraint
      zero_constraints.clear();
      // 在 constraints 上增加边界条件的信息
      VectorTools::interpolate_boundary_values(dof_handler,
                                               0,
                                               Functions::ZeroFunction<dim>(),
                                               zero_constraints);
      DoFTools::make_hanging_node_constraints(dof_handler, zero_constraints);
      zero_constraints.close();

      nonzero_constraints.clear();
      VectorTools::interpolate_boundary_values(dof_handler,
                                               0,
                                               BoundaryValues<dim>(),
                                               nonzero_constraints);
      DoFTools::make_hanging_node_constraints(dof_handler, nonzero_constraints);
      nonzero_constraints.close();

	  // delta u_n
      newton_update.reinit(dof_handler.n_dofs());
      system_rhs.reinit(dof_handler.n_dofs());

      // keep_constrained_dofs = true (默认值), 是最安全可靠的做法
      DynamicSparsityPattern dsp(dof_handler.n_dofs());
      DoFTools::make_sparsity_pattern(dof_handler, dsp, zero_constraints);

      sparsity_pattern.copy_from(dsp);
      system_matrix.reinit(sparsity_pattern);
    }
```

### 矩阵组装

定义 $a_n := \frac{1}{\sqrt{1 + |\nabla u^n|^2}}$,  $n$ 是指第 n 次牛顿迭代, 有:

$$
\sum_{j=0}^{N-1} \left[ (\nabla \varphi_i, a_n \nabla \varphi_j) 
    - (\nabla u^n \cdot \nabla \varphi_i, a_n^3 \nabla u^n \cdot \nabla \varphi_j) \right] \delta U_j 
= - (\nabla \varphi_i, a_n \nabla u^n) \quad \forall i = 0, \ldots, N-1,
$$

```cpp
    template <int dim>
    void MinimalSurfaceProblem<dim>::assemble_system()
    {
      const QGauss<dim> quadrature_formula(fe.degree + 1);

      system_matrix = 0;
      system_rhs    = 0;

      FEValues<dim> fe_values(fe,
                              quadrature_formula,
                              update_gradients | update_quadrature_points |
                                update_JxW_values);

      const unsigned int dofs_per_cell = fe.n_dofs_per_cell();
      const unsigned int n_q_points    = quadrature_formula.size();

      FullMatrix<double> cell_matrix(dofs_per_cell, dofs_per_cell);
      Vector<double>     cell_rhs(dofs_per_cell);

      std::vector<Tensor<1, dim>> old_solution_gradients(n_q_points);

      std::vector<types::global_dof_index> local_dof_indices(dofs_per_cell);

      for (const auto &cell : dof_handler.active_cell_iterators())
        {
          cell_matrix = 0;
          cell_rhs    = 0;

          fe_values.reinit(cell);
          fe_values.get_function_gradients(current_solution,
                                           old_solution_gradients);
          for (unsigned int q = 0; q < n_q_points; ++q)
            {
              const double coeff =
                1.0 / std::sqrt(1 + old_solution_gradients[q] *
                                      old_solution_gradients[q]);

              for (unsigned int i = 0; i < dofs_per_cell; ++i)
                {
                  for (unsigned int j = 0; j < dofs_per_cell; ++j)
                    cell_matrix(i, j) +=
                      (((fe_values.shape_grad(i, q)      // ((\nabla \phi_i
                         * coeff                         //   * a_n
                         * fe_values.shape_grad(j, q))   //   * \nabla \phi_j)
                        -                                //  -
                        (fe_values.shape_grad(i, q)      //  (\nabla \phi_i
                         * coeff * coeff * coeff         //   * a_n^3
                         * (fe_values.shape_grad(j, q)   //   * (\nabla \phi_j
                            * old_solution_gradients[q]) //      * \nabla u_n)
                         * old_solution_gradients[q]))   //   * \nabla u_n)))
                       * fe_values.JxW(q));              // * dx

                  cell_rhs(i) -= (fe_values.shape_grad(i, q)  // \nabla \phi_i
                                  * coeff                     // * a_n
                                  * old_solution_gradients[q] // * \nabla u_n
                                  * fe_values.JxW(q));        // * dx
                }
            }

          cell->get_dof_indices(local_dof_indices);
          zero_constraints.distribute_local_to_global(
            cell_matrix, cell_rhs, local_dof_indices, system_matrix, system_rhs);
        }
    }
```

### 求解 $\delta u_n$

```cpp
    template <int dim>
    void MinimalSurfaceProblem<dim>::solve()
    {
      SolverControl            solver_control(system_rhs.size(),
                                   system_rhs.l2_norm() * 1e-6);
      SolverCG<Vector<double>> solver(solver_control);

      PreconditionSSOR<SparseMatrix<double>> preconditioner;
      preconditioner.initialize(system_matrix, 1.2);

      solver.solve(system_matrix, newton_update, system_rhs, preconditioner);

      zero_constraints.distribute(newton_update);

      const double alpha = determine_step_length();
      current_solution.add(alpha, newton_update);
    }
```


### 细化网格

```cpp
    template <int dim>
    void MinimalSurfaceProblem<dim>::refine_mesh()
    {
      Vector<float> estimated_error_per_cell(triangulation.n_active_cells());

      KellyErrorEstimator<dim>::estimate(
        dof_handler,
        QGauss<dim - 1>(fe.degree + 1),
        std::map<types::boundary_id, const Function<dim> *>(),
        current_solution,
        estimated_error_per_cell);

      GridRefinement::refine_and_coarsen_fixed_number(triangulation,
                                                      estimated_error_per_cell,
                                                      0.3,
                                                      0.03);
	                                                              triangulation.prepare_coarsening_and_refinement();
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk2ODA1ODg1MywtMTUwNDc3MDUyNSwtOD
E3MTM4NTQ3LC0yMDkzNzg0MTE0LDE5NDU3MTE1MDcsLTEwMDY0
NDQxMDAsMTI5NzkxMDkyNywxMDk2OTU0NzY4LDIwNzAxOTMyMD
gsLTE3MjY4Mzk3OTksMTM3OTAzMDI0NywtMTM5MTA0NTIwNywx
OTQ1NDQ0MjgxXX0=
-->