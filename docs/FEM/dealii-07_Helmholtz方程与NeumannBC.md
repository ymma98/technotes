# step-7, Helmholtz方程与NeumannBC

## 方程

 `VectorTools::integrate_difference()` 该函数计算给定连续函数与有限元在每个单元上的不同范数。当然，像任何其他积分一样，我们只能使用求积公式来评估这些范数；因此，选择合适的求积公式对于准确评估误差至关重要。特别是对于 $L_{\infty}$ 范数，我们仅在求积点上评估数值解和精确解的最大偏差。事实上，这通常也是对其他范数的良好建议：如果你的求积点恰巧选在误差较小的位置，由于超收敛，计算出的误差看起来比实际小得多，甚至可能会建议更高的收敛阶次。因此，我们将为这些误差范数的积分选择不同于线性系统组装的求积公式。

函数 `VectorTools::integrate_difference()` 在三角剖分的每个单元 $K$ 上评估所需的范数，并返回一个包含每个单元这些值的向量。通过这些局部值，我们可以获得全局误差。例如，如果向量 $e$ 包含所有单元 $K$ 的元素 $e_K$，并包含局部 $L_2$ 范数 $\|u - u_h\|_K$，那么

$$
E = \left( \sum_K e_K^2 \right)^{1/2}
$$

就是全局的 $L_2$ 误差 $E = \|u - u_h\|_{\Omega}$。

* Neumann BC: 会影响组装右端向量。


Helmholtz方程：

$$ -\Delta u + \alpha u = f, $$

在方形区域 $[-1, 1]^2$ 上，$\alpha = 1$，并附加Dirichlet边界条件：

$$ u = g_1 $$

在边界 $\Gamma$ 的一部分 $\Gamma_1$ 上，和Neumann条件：

$$ n \cdot \nabla u = g_2 $$

在其余部分 $\Gamma_2 = \Gamma \setminus \Gamma_1$ 。我们将使用 $\Gamma_1 = \Gamma \cap \{ \{ x = 1 \} \cup \{ y = 1 \} \}$。（我们称这个方程具有“良好符号”，因为算子 $-\Delta + \alpha I$（其中$I$为单位算子）和$\alpha > 0$是一个正定算子；带有“坏符号”的方程是 $-\Delta - \alpha u$，对于带有“坏符号”的方程，如果$\alpha > 0$较大，算子 $-\Delta - \alpha I$ 不是正定的，这会导致许多我们在这里无需讨论的问题。如果$\alpha$恰好是$-\Delta$的特征值，则算子也可能不可逆——即方程没有唯一解。）

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250119/image.5j4aimvnlc.webp){width=500px}

使用上述定义，我们可以陈述该方程的弱形式，公式如下：求解 $u \in H^1_g = \{ v \in H^1 : v|_{\Gamma_1} = g_1 \}$ 使得

$$ (\nabla v, \nabla u)_\Omega + (v, u)_\Gamma = (v, f)_\Omega + (v, g_2)_\Gamma $$

对所有测试函数 $v \in H^1_0 = \{ v \in H^1 : v|_{\Gamma_1} = 0 \}$。边界项 $(v, g_2)_{\Gamma_2}$ 是通过分部积分得到的，使用 $\partial_n u = g_2$ 在 $\Gamma_2$ 上，$v = 0$ 在 $\Gamma_1$ 上。我们用来构建全局矩阵和右端向量的单元矩阵和向量因此如下所示：

$$ A_{ij}^K = (\nabla \varphi_i, \nabla \varphi_j)_K + (\varphi_i, \varphi_j)_K, $$

$$ F^K_i = (\varphi_i, f)_K + (\varphi_i, g_2) \partial K \cap \Gamma_2. $$



## 构造解法

为了验证我们的数值解 $u_h$ 的收敛性，我们希望设置一个精确解 $u$, 选择一个函数

$$ \bar{u}(x) = \sum_{i=1}^{3} \exp\left( -\frac{|x - x_i|^2}{\sigma^2} \right), $$

其中，指数函数的中心点 $x_i$ 分别为 $x_1 = (-\frac{1}{2}, \frac{1}{2})$，$x_2 = (-\frac{1}{2}, -\frac{1}{2})$，$x_3 = (\frac{1}{2}, -\frac{1}{2})$，半宽度设为 $\sigma = \frac{1}{8}$。构造解法则告诉我们：选择

$$ f = -\Delta u + \bar{u}, $$

$$ g_1 = \bar{u}, $$

$$ g_2 = n \cdot \nabla \bar{u}, $$

通过这种特殊的选择，$f$、$g_1$、$g_2$，原问题的解必然是 $u = \bar{u}$。然后，这使我们能够计算数值解的误差。在下面的代码中，我们通过 `Solution` 类表示 $\bar{u}$，而其他类将用来表示 $u$ 在 $\Gamma_1 = g_1$ 上和 $n \cdot \nabla u|_{\Gamma_2} = g_2$。

> **注意**  
> 原则上，你可以为上面的函数 $\bar{u}$ 选择任何形式——这里我们仅仅选择了三个指数函数的和。在实践中，有两个考虑因素需要考虑：（i）函数必须足够简单，以便你能够轻松地计算其导数，例如为了确定 $f = -\Delta \bar{u} + \bar{u}$。由于指数的导数相对容易计算，上述选择满足了这一要求，而像 $\bar{u}(x) = \text{atan}(\|x\|)$ 这样的函数会更具挑战。（ii）你不希望 $\bar{u}$ 是一个低阶多项式。因为如果你选择足够高阶的有限元多项式，你可以用数值解 $u_h$ 精确表示这个 $\bar{u}$，使得误差为零，无论网格是粗还是细。验证这一点是有用的，但它不能让你验证误差在任意函数 $f$ 的一般情况下随着网格大小 $h$ 的收敛阶次。（iii）典型的有限元误差估计假设解是平滑的，即足够平滑的域、右端项 $f$ 和边界条件。（iv）你希望所选择的解，其变化可以在你考虑的网格上被解析。例如，如果你选择 $\bar{u}(x) = \sin(1000x_1)\sin(1000x_2)$，此时只有非常细的网格才能捕获这样的高频振荡。

我们选择的解 $\bar{u}$ 满足所有这些要求：（i）它相对容易微分；（ii）它不z是一个多项式；（iii）它是平滑的；（iv）它的长度尺度为 $\sigma = \frac{1}{8}$，在 $[-1, 1]^d$ 范围内相对容易用每个坐标方向上至少16个单元的网格来解析。


## 代码拆解

Neumann BC 的核心是，用到了 `FEFaceValues` 而不是 `FEValues`。修改的是 $\vec{b}$


```cpp
#include <deal.II/base/quadrature_lib.h>
#include <deal.II/base/function.h>
#include <deal.II/base/logstream.h>
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
#include <deal.II/fe/fe_q.h>
#include <deal.II/numerics/matrix_tools.h>
#include <deal.II/numerics/error_estimator.h>
#include <deal.II/numerics/data_out.h>

// 这里可以调用 Cuthill-McKee algorithm, 对 dof 进行重新编号, 可以使得稀疏
// 矩阵的排布更有利于计算 (朝着对角线更加集中)
#include <deal.II/dofs/dof_renumbering.h>
#include <deal.II/base/smartpointer.h>
#include <deal.II/numerics/vector_tools.h>
#include <deal.II/base/convergence_table.h>
// 求解 Neumann BC 需要 FEFaceValues class, 和 FEValues 在同一个class
#include <deal.II/fe/fe_values.h>

#include <array>
#include <fstream>
#include <iostream>

namespace Step7
{
  using namespace dealii;

  template <int dim>
  class SolutionBase
  {
  protected:
    static const std::array<Point<dim>, 3> source_centers;
    static const double                    width;
  };

  // 模板特化 (specialization)
  template <>
  const std::array<Point<1>, 3> SolutionBase<1>::source_centers = {
    {Point<1>(-1.0 / 3.0), Point<1>(0.0), Point<1>(+1.0 / 3.0)}};

  template <>
  const std::array<Point<2>, 3> SolutionBase<2>::source_centers = {
    {Point<2>(-0.5, +0.5), Point<2>(-0.5, -0.5), Point<2>(+0.5, -0.5)}};

  template <int dim>
  const double SolutionBase<dim>::width = 1. / 8.;


  template <int dim>
  class Solution : public Function<dim>, protected SolutionBase<dim>
  {
  public:
    virtual double value(const Point<dim>  &p,
                         const unsigned int component = 0) const override;

    virtual Tensor<1, dim>
    gradient(const Point<dim>  &p,
             const unsigned int component = 0) const override;
  };


  template <int dim>
  double Solution<dim>::value(const Point<dim> &p, const unsigned int) const
  {
    double return_value = 0;
    for (const auto &center : this->source_centers)
      {
        const Tensor<1, dim> x_minus_xi = p - center;
        return_value +=
          std::exp(-x_minus_xi.norm_square() / (this->width * this->width));
      }

    return return_value;
  }


  template <int dim>
  Tensor<1, dim> Solution<dim>::gradient(const Point<dim> &p,
                                         const unsigned int) const
  {
    Tensor<1, dim> return_value;

    for (const auto &center : this->source_centers)
      {
        const Tensor<1, dim> x_minus_xi = p - center;

        return_value +=
          (-2. / (this->width * this->width) *
           std::exp(-x_minus_xi.norm_square() / (this->width * this->width)) *
           x_minus_xi);
      }

    return return_value;
  }



  template <int dim>
  class RightHandSide : public Function<dim>, protected SolutionBase<dim>
  {
  public:
    virtual double value(const Point<dim>  &p,
                         const unsigned int component = 0) const override;
  };


  template <int dim>
  double RightHandSide<dim>::value(const Point<dim> &p,
                                   const unsigned int) const
  {
    double return_value = 0;
    for (const auto &center : this->source_centers)
      {
        const Tensor<1, dim> x_minus_xi = p - center;

        // The first contribution is the Laplacian:
        return_value +=
          ((2. * dim -
            4. * x_minus_xi.norm_square() / (this->width * this->width)) /
           (this->width * this->width) *
           std::exp(-x_minus_xi.norm_square() / (this->width * this->width)));
        // And the second is the solution itself:
        return_value +=
          std::exp(-x_minus_xi.norm_square() / (this->width * this->width));
      }

    return return_value;
  }


  template <int dim>
  class HelmholtzProblem
  {
  public:
    enum RefinementMode
    {
      global_refinement,
      adaptive_refinement
    };

    HelmholtzProblem(const FiniteElement<dim> &fe,
                     const RefinementMode      refinement_mode);

    void run();

  private:
    void setup_system();
    void assemble_system();
    void solve();
    void refine_grid();
    void process_solution(const unsigned int cycle);

    Triangulation<dim> triangulation;
    DoFHandler<dim>    dof_handler;

    SmartPointer<const FiniteElement<dim>> fe;

    AffineConstraints<double> hanging_node_constraints;

    SparsityPattern      sparsity_pattern;
    SparseMatrix<double> system_matrix;

    Vector<double> solution;
    Vector<double> system_rhs;

    const RefinementMode refinement_mode;

    ConvergenceTable convergence_table;
  };

  template <int dim>
  HelmholtzProblem<dim>::HelmholtzProblem(const FiniteElement<dim> &fe,
                                          const RefinementMode refinement_mode)
    : dof_handler(triangulation)
    , fe(&fe)
    , refinement_mode(refinement_mode)
  {}

  // Note, however, that when you renumber the degrees of freedom, you must do
  // so immediately after distributing them, since such things as hanging
  // nodes, the sparsity pattern etc. depend on the absolute numbers which are
  // altered by renumbering.
  template <int dim>
  void HelmholtzProblem<dim>::setup_system()
  {
    dof_handler.distribute_dofs(*fe);
    DoFRenumbering::Cuthill_McKee(dof_handler);

    hanging_node_constraints.clear();
    DoFTools::make_hanging_node_constraints(dof_handler,
                                            hanging_node_constraints);
    hanging_node_constraints.close();

    DynamicSparsityPattern dsp(dof_handler.n_dofs(), dof_handler.n_dofs());
    DoFTools::make_sparsity_pattern(dof_handler, dsp);
    hanging_node_constraints.condense(dsp);
    sparsity_pattern.copy_from(dsp);

    system_matrix.reinit(sparsity_pattern);

    solution.reinit(dof_handler.n_dofs());
    system_rhs.reinit(dof_handler.n_dofs());
  }


  template <int dim>
  void HelmholtzProblem<dim>::assemble_system()
  {
    QGauss<dim>     quadrature_formula(fe->degree + 1);
    QGauss<dim - 1> face_quadrature_formula(fe->degree + 1);

    const unsigned int n_q_points      = quadrature_formula.size();
    const unsigned int n_face_q_points = face_quadrature_formula.size();

    const unsigned int dofs_per_cell = fe->n_dofs_per_cell();

    FullMatrix<double> cell_matrix(dofs_per_cell, dofs_per_cell);
    Vector<double>     cell_rhs(dofs_per_cell);

    std::vector<types::global_dof_index> local_dof_indices(dofs_per_cell);

    FEValues<dim> fe_values(*fe,
                            quadrature_formula,
                            update_values | update_gradients |
                              update_quadrature_points | update_JxW_values);

    FEFaceValues<dim> fe_face_values(*fe,
                                     face_quadrature_formula,
                                     update_values | update_quadrature_points |
                                       update_normal_vectors |
                                       update_JxW_values);

    RightHandSide<dim>  right_hand_side;
    std::vector<double> rhs_values(n_q_points);

    Solution<dim> exact_solution;

    for (const auto &cell : dof_handler.active_cell_iterators())
      {
        cell_matrix = 0.;
        cell_rhs    = 0.;

        fe_values.reinit(cell);

        right_hand_side.value_list(fe_values.get_quadrature_points(),
                                   rhs_values);

        for (unsigned int q_point = 0; q_point < n_q_points; ++q_point)
          for (unsigned int i = 0; i < dofs_per_cell; ++i)
            {
              for (unsigned int j = 0; j < dofs_per_cell; ++j)
                // The first thing that has changed is the bilinear form. It
                // now contains the additional term from the Helmholtz
                // equation:
                cell_matrix(i, j) +=
                  ((fe_values.shape_grad(i, q_point) *     // grad phi_i(x_q)
                      fe_values.shape_grad(j, q_point)     // grad phi_j(x_q)
                    +                                      //
                    fe_values.shape_value(i, q_point) *    // phi_i(x_q)
                      fe_values.shape_value(j, q_point)) * // phi_j(x_q)
                   fe_values.JxW(q_point));                // dx


              cell_rhs(i) += (fe_values.shape_value(i, q_point) * // phi_i(x_q)
                              rhs_values[q_point] *               // f(x_q)
                              fe_values.JxW(q_point));            // dx
            }

        // Then there is that second term on the right hand side, the contour
        // integral. First we have to find out whether the intersection of the
        // faces of this cell with the boundary part Gamma2 is nonzero. To
        // this end, we loop over all faces and check whether its boundary
        // indicator equals <code>1</code>, which is the value that we have
        // assigned to that portions of the boundary composing Gamma2 in the
        // <code>run()</code> function further below. (The default value of
        // boundary indicators is <code>0</code>, so faces can only have an
        // indicator equal to <code>1</code> if we have explicitly set it.)
        for (const auto &face : cell->face_iterators())
          if (face->at_boundary() && (face->boundary_id() == 1))
            {
              // If we came into here, then we have found an external face
              // belonging to Gamma2. Next, we have to compute the values of
              // the shape functions and the other quantities which we will
              // need for the computation of the contour integral. This is
              // done using the <code>reinit</code> function which we already
              // know from the FEValue class:
              fe_face_values.reinit(cell, face);

              // And we can then perform the integration by using a loop over
              // all quadrature points.
              //
              // On each quadrature point, we first compute the value of the
              // normal derivative. We do so using the gradient of the exact
              // solution and the normal vector to the face at the present
              // quadrature point obtained from the
              // <code>fe_face_values</code> object. This is then used to
              // compute the additional contribution of this face to the right
              // hand side:
              for (unsigned int q_point = 0; q_point < n_face_q_points;
                   ++q_point)
                {
                  const double neumann_value =
                    (exact_solution.gradient(
                       fe_face_values.quadrature_point(q_point)) *
                     fe_face_values.normal_vector(q_point));

                  for (unsigned int i = 0; i < dofs_per_cell; ++i)
                    cell_rhs(i) +=
                      (fe_face_values.shape_value(i, q_point) * // phi_i(x_q)
                       neumann_value *                          // g(x_q)
                       fe_face_values.JxW(q_point));            // dx
                }
            }

        cell->get_dof_indices(local_dof_indices);
        for (unsigned int i = 0; i < dofs_per_cell; ++i)
          {
            for (unsigned int j = 0; j < dofs_per_cell; ++j)
              system_matrix.add(local_dof_indices[i],
                                local_dof_indices[j],
                                cell_matrix(i, j));

            system_rhs(local_dof_indices[i]) += cell_rhs(i);
          }
      }

    // Likewise, elimination and treatment of boundary values has been shown
    // previously.
    //
    // We note, however that now the boundary indicator for which we
    // interpolate boundary values (denoted by the second parameter to
    // <code>interpolate_boundary_values</code>) does not represent the whole
    // boundary any more. Rather, it is that portion of the boundary which we
    // have not assigned another indicator (see below). The degrees of freedom
    // at the boundary that do not belong to Gamma1 are therefore excluded
    // from the interpolation of boundary values, just as we want.
    hanging_node_constraints.condense(system_matrix);
    hanging_node_constraints.condense(system_rhs);

    std::map<types::global_dof_index, double> boundary_values;
    VectorTools::interpolate_boundary_values(dof_handler,
                                             0,
                                             Solution<dim>(),
                                             boundary_values);
    MatrixTools::apply_boundary_values(boundary_values,
                                       system_matrix,
                                       solution,
                                       system_rhs);
  }


  template <int dim>
  void HelmholtzProblem<dim>::solve()
  {
    SolverControl            solver_control(1000, 1e-12);
    SolverCG<Vector<double>> cg(solver_control);

    PreconditionSSOR<SparseMatrix<double>> preconditioner;
    preconditioner.initialize(system_matrix, 1.2);

    cg.solve(system_matrix, solution, system_rhs, preconditioner);

    hanging_node_constraints.distribute(solution);
  }

  template <int dim>
  void HelmholtzProblem<dim>::refine_grid()
  {
    switch (refinement_mode)
      {
        case global_refinement:
          {
            triangulation.refine_global(1);
            break;
          }

        case adaptive_refinement:
          {
            Vector<float> estimated_error_per_cell(
              triangulation.n_active_cells());

            KellyErrorEstimator<dim>::estimate(
              dof_handler,
              QGauss<dim - 1>(fe->degree + 1),
              std::map<types::boundary_id, const Function<dim> *>(),
              solution,
              estimated_error_per_cell);

            GridRefinement::refine_and_coarsen_fixed_number(
              triangulation, estimated_error_per_cell, 0.3, 0.03);

            triangulation.execute_coarsening_and_refinement();

            break;
          }

        default:
          {
            DEAL_II_ASSERT_UNREACHABLE();
          }
      }
  }


  // @sect4{HelmholtzProblem::process_solution}

  // Finally we want to process the solution after it has been computed. For
  // this, we integrate the error in various (semi-)norms, and we generate
  // tables that will later be used to display the convergence against the
  // continuous solution in a nice format.
  template <int dim>
  void HelmholtzProblem<dim>::process_solution(const unsigned int cycle)
  {
    // Our first task is to compute error norms. In order to integrate the
    // difference between computed numerical solution and the continuous
    // solution (described by the Solution class defined at the top of this
    // file), we first need a vector that will hold the norm of the error on
    // each cell. Since accuracy with 16 digits is not so important for these
    // quantities, we save some memory by using <code>float</code> instead of
    // <code>double</code> values.
    //
    // The next step is to use a function from the library which computes the
    // error in the L2 norm on each cell.  We have to pass it the DoF handler
    // object, the vector holding the nodal values of the numerical solution,
    // the continuous solution as a function object, the vector into which it
    // shall place the norm of the error on each cell, a quadrature rule by
    // which this norm shall be computed, and the type of norm to be
    // used. Here, we use a Gauss formula with three points in each space
    // direction, and compute the L2 norm.
    //
    // Finally, we want to get the global L2 norm. This can of course be
    // obtained by summing the squares of the norms on each cell, and taking
    // the square root of that value. This is equivalent to taking the l2
    // (lower case <code>l</code>) norm of the vector of norms on each cell:
    Vector<float> difference_per_cell(triangulation.n_active_cells());
    VectorTools::integrate_difference(dof_handler,
                                      solution,
                                      Solution<dim>(),
                                      difference_per_cell,
                                      QGauss<dim>(fe->degree + 1),
                                      VectorTools::L2_norm);
    const double L2_error =
      VectorTools::compute_global_error(triangulation,
                                        difference_per_cell,
                                        VectorTools::L2_norm);

    // By same procedure we get the H1 semi-norm. We re-use the
    // <code>difference_per_cell</code> vector since it is no longer used
    // after computing the <code>L2_error</code> variable above. The global
    // $H^1$ semi-norm error is then computed by taking the sum of squares
    // of the errors on each individual cell, and then the square root of
    // it -- an operation that is conveniently performed by
    // VectorTools::compute_global_error.
    VectorTools::integrate_difference(dof_handler,
                                      solution,
                                      Solution<dim>(),
                                      difference_per_cell,
                                      QGauss<dim>(fe->degree + 1),
                                      VectorTools::H1_seminorm);
    const double H1_error =
      VectorTools::compute_global_error(triangulation,
                                        difference_per_cell,
                                        VectorTools::H1_seminorm);

    // Finally, we compute the maximum norm. Of course, we can't actually
    // compute the true maximum of the error over *all* points in the domain,
    // but only the maximum over a finite set of evaluation points that, for
    // convenience, we will still call "quadrature points" and represent by
    // an object of type Quadrature even though we do not actually perform any
    // integration.
    //
    // There is then the question of what points precisely we want to evaluate
    // at. It turns out that the result we get depends quite sensitively on the
    // "quadrature" points being used. There is also the issue of
    // superconvergence: Finite element solutions are, on some meshes and for
    // polynomial degrees $k\ge 2$, particularly accurate at the node points as
    // well as at Gauss-Lobatto points, much more accurate than at randomly
    // chosen points. (See
    // @cite Li2019 and the discussion and references in Section 1.2 for more
    // information on this.) In other words, if we are interested in finding
    // the largest difference $u(\mathbf x)-u_h(\mathbf x)$, then we ought to
    // look at points $\mathbf x$ that are specifically not of this "special"
    // kind of points and we should specifically not use
    // `QGauss(fe->degree+1)` to define where we evaluate. Rather, we use a
    // special quadrature rule that is obtained by iterating the trapezoidal
    // rule by the degree of the finite element times two plus one in each space
    // direction. Note that the constructor of the QIterated class takes a
    // one-dimensional quadrature rule and a number that tells it how often it
    // shall repeat this rule in each space direction.
    //
    // Using this special quadrature rule, we can then try to find the maximal
    // error on each cell. Finally, we compute the global L infinity error
    // from the L infinity errors on each cell with a call to
    // VectorTools::compute_global_error.
    const QTrapezoid<1>  q_trapez;
    const QIterated<dim> q_iterated(q_trapez, fe->degree * 2 + 1);
    VectorTools::integrate_difference(dof_handler,
                                      solution,
                                      Solution<dim>(),
                                      difference_per_cell,
                                      q_iterated,
                                      VectorTools::Linfty_norm);
    const double Linfty_error =
      VectorTools::compute_global_error(triangulation,
                                        difference_per_cell,
                                        VectorTools::Linfty_norm);

    // After all these errors have been computed, we finally write some
    // output. In addition, we add the important data to the TableHandler by
    // specifying the key of the column and the value.  Note that it is not
    // necessary to define column keys beforehand -- it is sufficient to just
    // add values, and columns will be introduced into the table in the order
    // values are added the first time.
    const unsigned int n_active_cells = triangulation.n_active_cells();
    const unsigned int n_dofs         = dof_handler.n_dofs();

    std::cout << "Cycle " << cycle << ':' << std::endl
              << "   Number of active cells:       " << n_active_cells
              << std::endl
              << "   Number of degrees of freedom: " << n_dofs << std::endl;

    convergence_table.add_value("cycle", cycle);
    convergence_table.add_value("cells", n_active_cells);
    convergence_table.add_value("dofs", n_dofs);
    convergence_table.add_value("L2", L2_error);
    convergence_table.add_value("H1", H1_error);
    convergence_table.add_value("Linfty", Linfty_error);
  }


  template <int dim>
  void HelmholtzProblem<dim>::run()
  {
    const unsigned int n_cycles =
      (refinement_mode == global_refinement) ? 5 : 9;
    for (unsigned int cycle = 0; cycle < n_cycles; ++cycle)
      {
        if (cycle == 0)
          {
            GridGenerator::hyper_cube(triangulation, -1., 1.);
            triangulation.refine_global(3);

            for (const auto &cell : triangulation.cell_iterators())
              for (const auto &face : cell->face_iterators())
                {
                  const auto center = face->center();
                  if ((std::fabs(center[0] - (-1.0)) < 1e-12) ||
                      (std::fabs(center[1] - (-1.0)) < 1e-12))
                    face->set_boundary_id(1);
                }
          }
        else
          refine_grid();

        setup_system();

        assemble_system();
        solve();

        process_solution(cycle);
      }

    std::string vtk_filename;
    switch (refinement_mode)
      {
        case global_refinement:
          vtk_filename = "solution-global";
          break;
        case adaptive_refinement:
          vtk_filename = "solution-adaptive";
          break;
        default:
          DEAL_II_ASSERT_UNREACHABLE();
      }

    vtk_filename += "-q" + std::to_string(fe->degree);

    vtk_filename += ".vtk";
    std::ofstream output(vtk_filename);

    DataOut<dim> data_out;
    data_out.attach_dof_handler(dof_handler);
    data_out.add_data_vector(solution, "solution");

    data_out.build_patches(fe->degree);
    data_out.write_vtk(output);

    convergence_table.set_precision("L2", 3);
    convergence_table.set_precision("H1", 3);
    convergence_table.set_precision("Linfty", 3);

    convergence_table.set_scientific("L2", true);
    convergence_table.set_scientific("H1", true);
    convergence_table.set_scientific("Linfty", true);

    // For the output of a table into a LaTeX file, the default captions of
    // the columns are the keys given as argument to the
    // <code>add_value</code> functions. To have TeX captions that differ from
    // the default ones you can specify them by the following function calls.
    // Note, that `\\' is reduced to `\' by the compiler such that the real
    // TeX caption is, e.g., `$L^\infty$-error'.
    convergence_table.set_tex_caption("cells", "\\# cells");
    convergence_table.set_tex_caption("dofs", "\\# dofs");
    convergence_table.set_tex_caption("L2", "$L^2$-error");
    convergence_table.set_tex_caption("H1", "$H^1$-error");
    convergence_table.set_tex_caption("Linfty", "$L^\\infty$-error");

    // Finally, the default LaTeX format for each column of the table is `c'
    // (centered). To specify a different (e.g. `right') one, the following
    // function may be used:
    convergence_table.set_tex_format("cells", "r");
    convergence_table.set_tex_format("dofs", "r");

    // After this, we can finally write the table to the standard output
    // stream <code>std::cout</code> (after one extra empty line, to make
    // things look prettier). Note, that the output in text format is quite
    // simple and that captions may not be printed directly above the specific
    // columns.
    std::cout << std::endl;
    convergence_table.write_text(std::cout);

    // The table can also be written into a LaTeX file.  The (nicely)
    // formatted table can be viewed after calling `latex filename.tex` and
    // whatever output viewer you prefer, where filename is the name of the file
    // to which we will write output. We construct the file name in the same way
    // as before, but with a different prefix "error":
    std::string error_filename = "error";
    switch (refinement_mode)
      {
        case global_refinement:
          error_filename += "-global";
          break;
        case adaptive_refinement:
          error_filename += "-adaptive";
          break;
        default:
          DEAL_II_ASSERT_UNREACHABLE();
      }

    error_filename += "-q" + std::to_string(fe->degree);
    error_filename += ".tex";
    std::ofstream error_table_file(error_filename);

    convergence_table.write_tex(error_table_file);


    // @sect5{Further table manipulations}

    // In case of global refinement, it might be of interest to also output
    // the convergence rates. This may be done by the functionality the
    // ConvergenceTable offers over the regular TableHandler. However, we do
    // it only for global refinement, since for adaptive refinement the
    // determination of something like an order of convergence is somewhat
    // more involved. While we are at it, we also show a few other things that
    // can be done with tables.
    if (refinement_mode == global_refinement)
      {
        // The first thing is that one can group individual columns together
        // to form so-called super columns. Essentially, the columns remain
        // the same, but the ones that were grouped together will get a
        // caption running across all columns in a group. For example, let's
        // merge the "cycle" and "cells" columns into a super column named "n
        // cells":
        convergence_table.add_column_to_supercolumn("cycle", "n cells");
        convergence_table.add_column_to_supercolumn("cells", "n cells");

        // Next, it isn't necessary to always output all columns, or in the
        // order in which they were originally added during the run.
        // Selecting and re-ordering the columns works as follows (note that
        // this includes super columns):
        std::vector<std::string> new_order;
        new_order.emplace_back("n cells");
        new_order.emplace_back("H1");
        new_order.emplace_back("L2");
        convergence_table.set_column_order(new_order);

        // For everything that happened to the ConvergenceTable until this
        // point, it would have been sufficient to use a simple
        // TableHandler. Indeed, the ConvergenceTable is derived from the
        // TableHandler but it offers the additional functionality of
        // automatically evaluating convergence rates. For example, here is
        // how we can let the table compute reduction and convergence rates
        // (convergence rates are the binary logarithm of the reduction rate):
        convergence_table.evaluate_convergence_rates(
          "L2", ConvergenceTable::reduction_rate);
        convergence_table.evaluate_convergence_rates(
          "L2", ConvergenceTable::reduction_rate_log2);
        convergence_table.evaluate_convergence_rates(
          "H1", ConvergenceTable::reduction_rate);
        convergence_table.evaluate_convergence_rates(
          "H1", ConvergenceTable::reduction_rate_log2);
        // Each of these function calls produces an additional column that is
        // merged with the original column (in our example the `L2' and the
        // `H1' column) to a supercolumn.

        // Finally, we want to write this convergence chart again, first to
        // the screen and then, in LaTeX format, to disk. The filename is
        // again constructed as above.
        std::cout << std::endl;
        convergence_table.write_text(std::cout);

        std::string conv_filename = "convergence";
        switch (refinement_mode)
          {
            case global_refinement:
              conv_filename += "-global";
              break;
            case adaptive_refinement:
              conv_filename += "-adaptive";
              break;
            default:
              DEAL_II_ASSERT_UNREACHABLE();
          }
        conv_filename += "-q" + std::to_string(fe->degree);
        conv_filename += ".tex";

        std::ofstream table_file(conv_filename);
        convergence_table.write_tex(table_file);
      }
  }

  // The final step before going to <code>main()</code> is then to close the
  // namespace <code>Step7</code> into which we have put everything we needed
  // for this program:
} // namespace Step7

// @sect3{Main function}

// The main function is mostly as before. The only difference is that we solve
// three times, once for Q1 and adaptive refinement, once for Q1 elements and
// global refinement, and once for Q2 elements and global refinement.
//
// Since we instantiate several template classes below for two space
// dimensions, we make this more generic by declaring a constant at the
// beginning of the function denoting the number of space dimensions. If you
// want to run the program in 1d or 2d, you will then only have to change this
// one instance, rather than all uses below:
int main()
{
  const unsigned int dim = 2;

  try
    {
      using namespace dealii;
      using namespace Step7;

      // Now for the three calls to the main class. Each call is blocked into
      // curly braces in order to destroy the respective objects (i.e. the
      // finite element and the HelmholtzProblem object) at the end of the
      // block and before we go to the next run. This avoids conflicts with
      // variable names, and also makes sure that memory is released
      // immediately after one of the three runs has finished, and not only at
      // the end of the <code>try</code> block.
      {
        std::cout << "Solving with Q1 elements, adaptive refinement"
                  << std::endl
                  << "============================================="
                  << std::endl
                  << std::endl;

        FE_Q<dim>             fe(1);
        HelmholtzProblem<dim> helmholtz_problem_2d(
          fe, HelmholtzProblem<dim>::adaptive_refinement);

        helmholtz_problem_2d.run();

        std::cout << std::endl;
      }

      {
        std::cout << "Solving with Q1 elements, global refinement" << std::endl
                  << "===========================================" << std::endl
                  << std::endl;

        FE_Q<dim>             fe(1);
        HelmholtzProblem<dim> helmholtz_problem_2d(
          fe, HelmholtzProblem<dim>::global_refinement);

        helmholtz_problem_2d.run();

        std::cout << std::endl;
      }

      {
        std::cout << "Solving with Q2 elements, global refinement" << std::endl
                  << "===========================================" << std::endl
                  << std::endl;

        FE_Q<dim>             fe(2);
        HelmholtzProblem<dim> helmholtz_problem_2d(
          fe, HelmholtzProblem<dim>::global_refinement);

        helmholtz_problem_2d.run();

        std::cout << std::endl;
      }
      {
        std::cout << "Solving with Q2 elements, adaptive refinement"
                  << std::endl
                  << "===========================================" << std::endl
                  << std::endl;

        FE_Q<dim>             fe(2);
        HelmholtzProblem<dim> helmholtz_problem_2d(
          fe, HelmholtzProblem<dim>::adaptive_refinement);

        helmholtz_problem_2d.run();

        std::cout << std::endl;
      }
    }
  catch (std::exception &exc)
    {
      std::cerr << std::endl
                << std::endl
                << "----------------------------------------------------"
                << std::endl;
      std::cerr << "Exception on processing: " << std::endl
                << exc.what() << std::endl
                << "Aborting!" << std::endl
                << "----------------------------------------------------"
                << std::endl;
      return 1;
    }
  catch (...)
    {
      std::cerr << std::endl
                << std::endl
                << "----------------------------------------------------"
                << std::endl;
      std::cerr << "Unknown exception!" << std::endl
                << "Aborting!" << std::endl
                << "----------------------------------------------------"
                << std::endl;
      return 1;
    }

  return 0;
}
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbNjExMDIyMTc1LC0xOTk0MjgzNDE5LDE0ND
k0MDQ5MiwxMTAwNzk5NTg5LC05OTQ5MzQwMiwtOTUxNTUwOTIw
LC00MzQ5Nzk4MDQsMTc1NDYxNjY5M119
-->