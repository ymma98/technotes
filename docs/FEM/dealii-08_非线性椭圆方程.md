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

1. initial guess $u^0 \equiv 0$, 并且 $u^0$ 满足边界条件 $u=g$  and modify it in such a way that the values of $u^0$ along the boundary equal the correct boundary values $g$ (this happens in the call to `AffineConstraints::distribute()`). Set $n = 0$.

2. Compute the Newton update by solving the system 
$$
A^n \delta u^n = b^n
$$
with boundary condition $\delta u^n = 0$ on $\partial \Omega$.

3. Compute a step length $\alpha^n$. In this program, we always set $\alpha^n = 0.1$. To make things easier to extend later on, this happens in a function of its own, namely in `MinimalSurfaceProblem::determine_step_length`.  (step-77 有更复杂的策略)

4. The new approximation of the solution is given by
$$
u^{n+1} = u^n + \alpha^n \delta u^n.
$$

5. If $n$ is a multiple of 5 then refine the mesh, transfer the solution $u^{n+1}$ to the new mesh and set the values of $u^{n+1}$ in such a way that along the boundary we have $u^{n+1}_{|\partial \Omega} = g$. Note that this isn't automatically guaranteed even though by construction we had that before mesh refinement $u^{n+1}_{|\partial \Omega} = g$ because mesh refinement adds new nodes to the mesh where we have to interpolate the old solution to the new nodes upon bringing the solution from the old to the new mesh. The values we choose by interpolation may be close to the exact boundary conditions but are, in general, nonetheless not the correct values.

6. Set $n \leftarrow n + 1$ and go to step 2.

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




<!--stackedit_data:
eyJoaXN0b3J5IjpbMTI3NzU3OTkzOSwxOTQ1NDQ0MjgxXX0=
-->