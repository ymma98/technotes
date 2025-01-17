# step-6, 自适应网格

## 步骤

- 在当前网格上求解PDE；
- 使用某些标准估算每个单元的误差；
- 标记那些误差较大的单元进行细化，标记那些误差较小的单元进行粗化，其他单元保持不变；
- 对标记的单元进行细化和粗化，以获得新的网格；
- 重复上述步骤，直到新网格上的误差足够小。

## 理论

理论上我们知道如果细化全局网格，误差将会按照下面的公式收敛为零：

$$
\| \nabla (u - u_h) \|_\Omega \leq C h^{p}_{\text{max}} \| \nabla^{p+1} u \|_\Omega,
$$

其中 $C$ 是与 $h$ 和 $u$ 无关的常数，$p$ 是使用的有限元的多项式阶数，$h_{\text{max}}$ 是最大单元的尺寸。那么，如果最大单元很重要，为什么我们要在某些区域内细化网格呢？

答案在于观察到上面的公式并不最优。实际上，更多的工作表明，以下的估计要更好（你应该将其与上述估计的平方进行比较）：

$$
\| (u - u_h) \|_\Omega^2 \leq C \sum_K h_K^{2p} \| \nabla^{p+1} u \|_K^2.
$$

这个公式表明，不需要将最大单元做得非常小，而是网格只需要在那些 $| \nabla^{p+1} u |$ 较大的地方做得小。 

当然，这个先验估计在实际中并不是非常有用，因为我们无法知道问题的精确解 $u$，因此无法直接计算 $\nabla^{p+1} u$。但这正是常见的做法，我们可以计算数值近似值 $\nabla^{p+1} u$，并且这些值可以通过之前计算得到。



$$
-\nabla \cdot a(\mathbf{x}) \nabla u(\mathbf{x}) = 1 \quad \text{in } \Omega,
$$

$$
u = 0 \quad \text{on } \partial \Omega.
$$

$$
a(\mathbf{x}) =
\begin{cases}
20 & \text{if } |\mathbf{x}| < 0.5, \\
1 & \text{otherwise.}
\end{cases}
$$

## 代码拆解

```bash
#include <deal.II/base/quadrature_lib.h>
#include <deal.II/dofs/dof_handler.h>
#include <deal.II/dofs/dof_tools.h>
#include <deal.II/fe/fe_q.h>
#include <deal.II/fe/fe_values.h>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_out.h>
#include <deal.II/grid/grid_refinement.h>
#include <deal.II/grid/tria.h>
#include <deal.II/lac/affine_constraints.h>
#include <deal.II/lac/dynamic_sparsity_pattern.h>
#include <deal.II/lac/full_matrix.h>
#include <deal.II/lac/precondition.h>
#include <deal.II/lac/solver_cg.h>
#include <deal.II/lac/sparse_matrix.h>
#include <deal.II/lac/vector.h>
#include <deal.II/numerics/data_out.h>
#include <deal.II/numerics/error_estimator.h>
#include <deal.II/numerics/vector_tools.h>

#include <fstream>
using namespace dealii;
template <int dim>
class Step6 {
   public:
    Step6();
    void run();

   private:
    void                      setup_system();
    void                      assemble_system();
    void                      solve();
    void                      refine_grid();
    void                      output_results(const unsigned int cycle) const;
    Triangulation<dim>        triangulation;
    FE_Q<dim>                 fe;
    DoFHandler<dim>           dof_handler;
    AffineConstraints<double> constraints;
    SparseMatrix<double>      system_matrix;
    SparsityPattern           sparsity_pattern;
    Vector<double>            solution;
    Vector<double>            system_rhs;
};
template <int dim>
double coefficient(const Point<dim> &p) {
    if (p.square() < 0.5 * 0.5)
        return 20;
    else
        return 1;
}
template <int dim>
Step6<dim>::Step6() : fe(2), dof_handler(triangulation) {}
template <int dim>
void Step6<dim>::setup_system() {
    dof_handler.distribute_dofs(fe);
    solution.reinit(dof_handler.n_dofs());
    system_rhs.reinit(dof_handler.n_dofs());
    constraints.clear();
    DoFTools::make_hanging_node_constraints(dof_handler, constraints);
    VectorTools::interpolate_boundary_values(
        dof_handler, 0, Functions::ZeroFunction<dim>(), constraints);
    constraints.close();
    DynamicSparsityPattern dsp(dof_handler.n_dofs());
    DoFTools::make_sparsity_pattern(dof_handler, dsp, constraints, false);
    sparsity_pattern.copy_from(dsp);
    system_matrix.reinit(sparsity_pattern);
}
template <int dim>
void Step6<dim>::assemble_system() {
    const QGauss<dim>  quadrature_formula(fe.degree + 1);
    FEValues<dim>      fe_values(fe, quadrature_formula,
                                 update_values | update_gradients |
                                     update_quadrature_points | update_JxW_values);
    const unsigned int dofs_per_cell = fe.n_dofs_per_cell();
    FullMatrix<double> cell_matrix(dofs_per_cell, dofs_per_cell);
    Vector<double>     cell_rhs(dofs_per_cell);
    std::vector<types::global_dof_index> local_dof_indices(dofs_per_cell);
    for (const auto &cell : dof_handler.active_cell_iterators()) {
        cell_matrix = 0;
        cell_rhs    = 0;
        fe_values.reinit(cell);
        for (const unsigned int q_index :
             fe_values.quadrature_point_indices()) {
            const double current_coefficient =
                coefficient(fe_values.quadrature_point(q_index));
            for (const unsigned int i : fe_values.dof_indices()) {
                for (const unsigned int j : fe_values.dof_indices())
                    cell_matrix(i, j) += (current_coefficient *
                                          fe_values.shape_grad(i, q_index) *
                                          fe_values.shape_grad(j, q_index) *
                                          fe_values.JxW(q_index));
                cell_rhs(i) += (1.0 * fe_values.shape_value(i, q_index) *
                                fe_values.JxW(q_index));
            }
        }
        cell->get_dof_indices(local_dof_indices);
        constraints.distribute_local_to_global(cell_matrix, cell_rhs,
                                               local_dof_indices, system_matrix,
                                               system_rhs);
    }
}
template <int dim>
void Step6<dim>::solve() {
    SolverControl                          solver_control(1000, 1e-12);
    SolverCG<Vector<double>>               solver(solver_control);
    PreconditionSSOR<SparseMatrix<double>> preconditioner;
    preconditioner.initialize(system_matrix, 1.2);
    solver.solve(system_matrix, solution, system_rhs, preconditioner);
    constraints.distribute(solution);
}
template <int dim>
void Step6<dim>::refine_grid() {
    Vector<float> estimated_error_per_cell(triangulation.n_active_cells());
    KellyErrorEstimator<dim>::estimate(dof_handler,
                                       QGauss<dim - 1>(fe.degree + 1), {},
                                       solution, estimated_error_per_cell);
    GridRefinement::refine_and_coarsen_fixed_number(
        triangulation, estimated_error_per_cell, 0.3, 0.03);
    triangulation.execute_coarsening_and_refinement();
}
template <int dim>
void Step6<dim>::output_results(const unsigned int cycle) const {
    {
        GridOut       grid_out;
        std::ofstream output("grid-" + std::to_string(cycle) + ".gnuplot");
        GridOutFlags::Gnuplot gnuplot_flags(false, 5);
        grid_out.set_flags(gnuplot_flags);
        MappingQ<dim> mapping(3);
        grid_out.write_gnuplot(triangulation, output, &mapping);
    }
    {
        DataOut<dim> data_out;
        data_out.attach_dof_handler(dof_handler);
        data_out.add_data_vector(solution, "solution");
        data_out.build_patches();
        std::ofstream output("solution-" + std::to_string(cycle) + ".vtu");
        data_out.write_vtu(output);
    }
}
template <int dim>
void Step6<dim>::run() {
    for (unsigned int cycle = 0; cycle < 8; ++cycle) {
        std::cout << "Cycle " << cycle << ':' << std::endl;
        if (cycle == 0) {
            GridGenerator::hyper_ball(triangulation);
            triangulation.refine_global(1);
        } else
            refine_grid();
        std::cout << "   Number of active cells:       "
                  << triangulation.n_active_cells() << std::endl;
        setup_system();
        std::cout << "   Number of degrees of freedom: " << dof_handler.n_dofs()
                  << std::endl;
        assemble_system();
        solve();
        output_results(cycle);
    }
}
int main() {
    try {
        Step6<2> laplace_problem_2d;
        laplace_problem_2d.run();
    } catch (std::exception &exc) {
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
    } catch (...) {
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
eyJoaXN0b3J5IjpbLTc0MzI5MjU4OSwtMTc3MjU5NzY3NywxOT
I4MzkzMzYsLTIwMDEwNjAzNDgsLTE0NjkyOTEzMTldfQ==
-->