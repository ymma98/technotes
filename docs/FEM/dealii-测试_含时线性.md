# dealii-测试_含时线性

## 弱格式

对应 Xiaoming He Chapter 4: Finite Elements for 2D second order parabolic and hyperbolic equation. 


$$
u_t - \nabla \cdot (c \nabla u) = f, \quad \text{in} \ \Omega \times [0, T],
$$

$$
u = g, \quad \text{on} \ \partial \Omega \times [0, T],
$$

$$
u = u_0, \quad \text{at} \ t = 0 \ \text{and in} \ \Omega.
$$

where $f(x, y, t)$ and $c(x, y, t)$ are given functions.

**To get the weak form**,

$$
\Rightarrow \ u_t v - \nabla \cdot (c \nabla u) v = f v \quad \text{in} \ \Omega
$$

$$
\Rightarrow \int_{\Omega} u_t v \, dx \, dy - \int_{\Omega} \nabla \cdot (c \nabla u) v \, dx \, dy = \int_{\Omega} f v \, dx \, dy
$$

$$
\int_{\Omega} u_t v \, dx \, dy + \int_{\Omega} c \nabla u \cdot \nabla v \, dx \, dy - \int_{\partial \Omega} (c \nabla u \cdot \hat{n}) v \, ds = \int_{\Omega} f v \, dx \, dy.
$$


Let $a(u, v) = \int_{\Omega} c \nabla u \cdot \nabla v \, dx \, dy$ and $(f, v) = \int_{\Omega} f v \, dx \, dy$.

Weak formulation: find $u \in H^1(0, T; H^1(\Omega))$ such that

$$
(u_t, v) + a(u, v) = (f, v)
$$

for any $v \in H^1_0(\Omega)$ (Dirichlet BC here).

Discretization: 

$$
(u_{ht}, v_h) + a(u_h, v_h) = (f, v_h)
$$

$$
\Leftrightarrow \int_{\Omega} u_{ht} v_h \, dx \, dy + \int_{\Omega} c \nabla u_h \cdot \nabla v_h \, dx \, dy = \int_{\Omega} f v_h \, dx \, dy
$$

$$
u_h(x, y, t) = \sum_{j=1}^{N_b} u_j(t) \varphi_j(x, y)
$$

Define the stiffness matrix

$$
A(t) = [a_{ij}]_{i,j=1}^{N_b} = \left[ \int_{\Omega} c \nabla \varphi_j \cdot \nabla \varphi_i \, dx \, dy \right]_{i,j=1}^{N_b}.
$$

Define the mass matrix

$$
M = [m_{ij}]_{i,j=1}^{N_b} = \left[ \int_{\Omega} \varphi_j \varphi_i \, dx \, dy \right]_{i,j=1}^{N_b}.
$$

Define the load vector

$$
\vec{b}(t) = [b_i]_{i=1}^{N_b} = \left[ \int_{\Omega} f \varphi_i \, dx \, dy \right]_{i=1}^{N_b}.
$$

Define the unknown vector

$$
\vec{X}(t) = [u_j(t)]_{j=1}^{N_b}.
$$

Then we obtain the system

$$
M \vec{X}'(t) + A(t) \vec{X}(t) = \vec{b}(t).
$$


## 时间离散

General $\theta$-scheme:

$$
\frac{y_{j+1} - y_j}{h} = \theta f(t_{j+1}, y_{j+1}) + (1 - \theta) f(t_j, y_j);
$$

- $\theta = 0$: forward Euler scheme;
- $\theta = 1$: backward Euler scheme;
- $\theta = \frac{1}{2}$: Crank-Nicolson scheme.

$$
\frac{M \vec{X}^{m+1} - \vec{X}^m}{\Delta t} + \theta A(t_{m+1}) \vec{X}^{m+1} + (1 - \theta) A(t_m) \vec{X}^m = \theta \vec{b}(t_{m+1}) + (1 - \theta) \vec{b}(t_m), \quad m = 0, \dots, M_m - 1.
$$



$$
\Rightarrow \left[ \frac{M}{\Delta t} + \theta A(t_{m+1}) \right] \vec{X}^{m+1} = \theta \vec{b}(t_{m+1}) + (1 - \theta) \vec{b}(t_m) + \frac{M}{\Delta t} \vec{X}^m - (1 - \theta) A(t_m) \vec{X}^m
$$


$$
\tilde{A}^{m+1} \vec{X}^{m+1} = \tilde{b}^{m+1}, \quad m = 0, \dots, M_m - 1,
$$

where

$$
\tilde{A}^{m+1} = \frac{M}{\Delta t} + \theta A(t_{m+1}),
$$

$$
\tilde{b}^{m+1} = \theta \vec{b}(t_{m+1}) + (1 - \theta) \vec{b}(t_m) + \left[ \frac{M}{\Delta t}  - (1 - \theta) A(t_m) \right] \vec{X}^m.
$$

## 具体的问题

 $\Omega = [0, 2] \times [0, 1]$:

$$
u_t - \nabla \cdot (2 \nabla u) = -3 e^{x + y + t}, \quad \text{on} \ \Omega \times [0, 1],
$$

$$
u(x, y, 0) = e^{x + y}, \quad \text{on} \ \partial \Omega,
$$

$$
u = e^{y + t} \quad \text{on} \ x = 0,
$$

$$
u = e^{2 + y + t} \quad \text{on} \ x = 2,
$$

$$
u = e^{x + t} \quad \text{on} \ y = 0,
$$

$$
u = e^{x + 1 + t} \quad \text{on} \ y = 1.
$$

The analytic solution of this problem is $u = e^{x + y + t}$.


## 我的dealii 实现

```cpp
#include <cmath>
#include <deal.II/base/quadrature_lib.h>
#include <deal.II/base/function.h>
#include <deal.II/base/parameter_handler.h>
#include <deal.II/base/function_parser.h>
#include <deal.II/base/function_lib.h>
#include <deal.II/base/utilities.h>
#include <deal.II/base/conditional_ostream.h>
#include <deal.II/base/tensor.h>
#include <deal.II/dofs/dof_tools.h>

#include <deal.II/lac/vector.h>
#include <deal.II/lac/dynamic_sparsity_pattern.h>
#include <deal.II/lac/affine_constraints.h>
#include <deal.II/lac/sparse_matrix.h>
#include <deal.II/lac/solver_cg.h>  
#include <deal.II/lac/precondition.h>

#include <deal.II/grid/tria.h>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_out.h>
#include <deal.II/grid/grid_refinement.h>
#include <deal.II/grid/grid_in.h>

#include <deal.II/dofs/dof_handler.h>
#include <deal.II/dofs/dof_tools.h>

#include <deal.II/fe/fe_values.h>
#include <deal.II/fe/fe_system.h>
#include <deal.II/fe/mapping_q1.h>
#include <deal.II/fe/fe_q.h>

#include <deal.II/numerics/data_out.h>
#include <deal.II/numerics/vector_tools.h>
#include <deal.II/numerics/solution_transfer.h>
#include <deal.II/numerics/matrix_tools.h>

#include <deal.II/lac/trilinos_sparse_matrix.h>
#include <deal.II/lac/trilinos_precondition.h>
#include <deal.II/lac/trilinos_solver.h>


#include <iomanip>
#include <ios>
#include <iostream>
#include <algorithm>
#include <sstream>
#include <string>

class LinearParabolicSolver {
    public: 
    LinearParabolicSolver(
        double xmin, double xmax, double ymin, double ymax,
        unsigned int mx, unsigned int my,
        unsigned int poly_degree,
        double time_step, double final_time, double theta, double coeff);
    void run();
    void create_uniform_rect_mesh();


    private:
    void setup_system();
    void assemble_system();
    void assemble_rhs();
    void output_results(const unsigned int time_step) const;
    void apply_boundary_conditions();
    void compute_error(const double time) const;
    double rhs_function(double x, double y, double t) const;

    const double xmin_, xmax_, ymin_, ymax_;
    const unsigned int mx_, my_;
    double time_;
    unsigned int pd_;
    const double time_step_;
    const double final_time_;
    const double theta_;
    const double coeff_;

    dealii::Triangulation<2> tria_;
    dealii::FE_Q<2> fe_;
    dealii::DoFHandler<2> dof_handler_;
    // type of basis function (poly_degree, linear, quadratic ... )
    // location of DoFs on the cell (vertices, edge, mid-point ...)
    // method to evaluate function and gradient values
    // u = Uj phi_j, phi_j is what for FE_Q (Q for quadrilateral-like shape)

    dealii::AffineConstraints<double> constraints_;

    dealii::SparseMatrix<double> system_matrix_;
    dealii::SparseMatrix<double> mass_matrix_;
    dealii::SparseMatrix<double> stiffness_matrix_;

    dealii::Vector<double> solution_;
    dealii::Vector<double> old_solution_;
    dealii::Vector<double> system_rhs_;
    dealii::Vector<double> load_vec_;
    dealii::Vector<double> old_load_vec_;

    dealii::SparsityPattern sparsity_pattern_;

};



LinearParabolicSolver::LinearParabolicSolver(
        double xmin, double xmax, double ymin, double ymax,
        unsigned int mx, unsigned int my,
        unsigned int poly_degree,
        double time_step, double final_time, double theta, double coeff)
    : xmin_(xmin), xmax_(xmax), ymin_(ymin), ymax_(ymax), mx_(mx), my_(my),
    pd_(poly_degree),
    time_step_(time_step),
    final_time_(final_time),
    theta_(theta),
    coeff_(coeff),
    fe_(pd_),
    dof_handler_(tria_)
    {
        time_ = 0.;
        create_uniform_rect_mesh();
        
    }

void LinearParabolicSolver::create_uniform_rect_mesh(){
  AssertThrow(xmin_ < xmax_ && ymin_ < ymax_,
              dealii::ExcMessage("invalid xmin_/xmax_/ymin_/ymax_"));
    const dealii::Point<2> p1(xmin_, ymin_);
    const dealii::Point<2> p2(xmax_, ymax_);
    const std::vector<unsigned int> ncells = {mx_, my_};
  
    dealii::GridGenerator::subdivided_hyper_rectangle(tria_, ncells, p1, p2);
  
    // label the boundaries,
    // boundary ids: x=xmin -> 0, y=ymin_ -> 1, x=xmax -> 2, y=ymax_ -> 3
    for (const auto &cell : tria_.active_cell_iterators()) {
      for (const auto f : cell->face_indices()) {
        if (cell->face(f)->at_boundary()) {
          const dealii::Point<2> c = cell->face(f)->center();
          const double x = c[0];
          const double y = c[1];
          double tol = 1.e-6;
          if (std::fabs(x - xmin_) < tol)
            cell->face(f)->set_boundary_id(0);
          else if (std::fabs(y - ymin_) < tol)
            cell->face(f)->set_boundary_id(1);
          else if (std::fabs(x - xmax_) < tol)
            cell->face(f)->set_boundary_id(2);
          else if (std::fabs(y - ymax_) < tol)
            cell->face(f)->set_boundary_id(3);
          else
            throw dealii::ExcMessage("invalid boundary face");
        }
      }
    }
}

class AnalyticSolution: public dealii::Function<2> {
    public:
        AnalyticSolution();
        virtual double value(const dealii::Point<2> &p,
        unsigned int component = 0) const override;

        virtual dealii::Tensor<1, 2>
        gradient(const dealii::Point<2> &p,
                 unsigned int component = 0) const override;

        void set_time(double time) override;

    private:
        double time_;
};

AnalyticSolution::AnalyticSolution() : dealii::Function<2>(1) {}

void AnalyticSolution::set_time(double time){
    time_ = time;
}

double AnalyticSolution::value(const dealii::Point<2> &p,
        unsigned int /*component*/) const {
    double x= p[0], y=p[1];
    return std::exp(x + y + time_);
}

dealii::Tensor<1, 2>
AnalyticSolution::gradient(const dealii::Point<2> &p,
                           unsigned int /*component*/) const
{
  const double val = std::exp(p[0] + p[1] + time_);
  return dealii::Tensor<1, 2>{{val, val}};
}

double LinearParabolicSolver::rhs_function(double x, double y, double t) const {
    return std::exp(x+y+t)*(-3.0);
}


void LinearParabolicSolver::apply_boundary_conditions() {
    constraints_.clear();
    // 在自适应网格细化（AMR）或不规则网格下，某些单元细化而邻居没细化，
    // 会产生“挂点”（hanging node）
    // 这些点的自由度不能独立，需要通过线性关系（约束）和相邻单元的节点
    // 绑定，否则会出现解不连续
    dealii::DoFTools::make_hanging_node_constraints(dof_handler_,
        constraints_);
    std::map<dealii::types::boundary_id, const dealii::Function<2> *>
        boundary_functions;
    AnalyticSolution ana_sol;
    ana_sol.set_time(time_);
    boundary_functions[0] = &ana_sol;
    boundary_functions[1] = &ana_sol;
    boundary_functions[2] = &ana_sol;
    boundary_functions[3] = &ana_sol;

    dealii::VectorTools::interpolate_boundary_values(dof_handler_,
                         boundary_functions,
                         constraints_);
    constraints_.close();
}

void LinearParabolicSolver::setup_system() {
    dof_handler_.distribute_dofs(fe_);

    apply_boundary_conditions();

    dealii::DynamicSparsityPattern dsp(dof_handler_.n_dofs());
    dealii::DoFTools::make_sparsity_pattern(dof_handler_, dsp,
            constraints_, /*keep_constrained_dofs=*/true);
    sparsity_pattern_.copy_from(dsp);

    system_matrix_.reinit(sparsity_pattern_);
    mass_matrix_.reinit(sparsity_pattern_);
    stiffness_matrix_.reinit(sparsity_pattern_);

    solution_.reinit(dof_handler_.n_dofs());
    old_solution_.reinit(dof_handler_.n_dofs());
    system_rhs_.reinit(dof_handler_.n_dofs());
    load_vec_.reinit(dof_handler_.n_dofs());
    old_load_vec_.reinit(dof_handler_.n_dofs());
}

void LinearParabolicSolver::assemble_system() {
    mass_matrix_ = 0.0;
    stiffness_matrix_ = 0.0;

    const dealii::QGauss<2> quadrature_formula(fe_.degree + 1);
    dealii::FEValues<2> fe_values(fe_, quadrature_formula,
                                  dealii::update_values |
                                  dealii::update_gradients |
                                  dealii::update_JxW_values);

    const unsigned int dofs_per_cell = fe_.dofs_per_cell;
    const unsigned int n_q_points = quadrature_formula.size();

    dealii::FullMatrix<double> cell_mass_matrix(dofs_per_cell, dofs_per_cell);
    dealii::FullMatrix<double> cell_stiffness_matrix(dofs_per_cell, dofs_per_cell);

    std::vector<dealii::types::global_dof_index> local_dof_indices(dofs_per_cell);

    for (const auto &cell: dof_handler_.active_cell_iterators()){
        cell_mass_matrix = 0.;
        cell_stiffness_matrix = 0.;
        fe_values.reinit(cell);

        for (unsigned int q = 0; q < n_q_points; ++q) {
            for (unsigned int i = 0; i < dofs_per_cell; ++i) {
                for (unsigned int j = 0; j < dofs_per_cell; ++j) {
                    // M_ij = integral(phi_i * phi_j * dx)
                    cell_mass_matrix(i, j) +=
                        fe_values.shape_value(i, q) *
                        fe_values.shape_value(j, q) *
                        fe_values.JxW(q);
                    // A_ij = integral(grad(phi_i) * grad(phi_j) * dx)
                    cell_stiffness_matrix(i, j) += coeff_ *
                        fe_values.shape_grad(i, q) *
                        fe_values.shape_grad(j, q) *
                        fe_values.JxW(q);
                }
            }
        }
        cell->get_dof_indices(local_dof_indices);
        mass_matrix_.add(local_dof_indices, cell_mass_matrix);
        stiffness_matrix_.add(local_dof_indices, cell_stiffness_matrix);
        // constraints_.distribute_local_to_global(cell_mass_matrix,
        //                                        local_dof_indices,
        //                                        mass_matrix_);
        // constraints_.distribute_local_to_global(cell_stiffness_matrix,
        //                                        local_dof_indices,
        //                                        stiffness_matrix_);
    }
}

void LinearParabolicSolver::assemble_rhs() {
    load_vec_ = 0.0;
    const dealii::QGauss<2> quadrature_formula(fe_.degree + 1);
    dealii::FEValues<2> fe_values(fe_, quadrature_formula,
                                  dealii::update_values |
                                  dealii::update_quadrature_points | 
                                  dealii::update_JxW_values);

    const unsigned int dofs_per_cell = fe_.dofs_per_cell;
    const unsigned int n_q_points = quadrature_formula.size();
    std::vector<dealii::types::global_dof_index> local_dof_indices(dofs_per_cell);

    dealii::Vector<double> cell_rhs(fe_.n_dofs_per_cell());

    for (const auto &cell: dof_handler_.active_cell_iterators()) {
        cell_rhs = 0.0;
        fe_values.reinit(cell);
        cell->get_dof_indices(local_dof_indices);

        for (unsigned int q = 0; q < n_q_points; ++q) {
            for (unsigned int i = 0; i < dofs_per_cell; ++i) {
                const dealii::Point<2> p = fe_values.quadrature_point(q);
                double rhs_value = rhs_function(p[0], p[1], time_);
                cell_rhs(i) += 
                    fe_values.shape_value(i, q) * rhs_value *
                    fe_values.JxW(q);
            }
        }
        load_vec_.add(local_dof_indices, cell_rhs);
        // constraints_.distribute_local_to_global(cell_rhs, local_dof_indices,
        //                                        load_vec_);
    }
}



// --- Postprocessor for Gradients ---
// --- Postprocessor for Gradients ---
class SolutionPostprocessor : public dealii::DataPostprocessor<2>
{
public:
  SolutionPostprocessor()
    : dealii::DataPostprocessor<2>()
  {}

  virtual void evaluate_scalar_field(
    const dealii::DataPostprocessorInputs::Scalar<2> &inputs,
    std::vector<dealii::Vector<double>> &computed_quantities) const override
  {
    const unsigned int n_evaluation_points = inputs.solution_values.size();
    Assert(computed_quantities.size() == n_evaluation_points,
           dealii::ExcInternalError());
    Assert(inputs.solution_gradients.size() == n_evaluation_points,
           dealii::ExcInternalError());

    for (unsigned int p = 0; p < n_evaluation_points; ++p)
      {
        // computed_quantities[p] 是一个包含3个标量输出的向量
        computed_quantities[p].reinit(3);
        computed_quantities[p](0) = inputs.solution_values[p];       // u (注意这里是标量)
        computed_quantities[p](1) = inputs.solution_gradients[p][0]; // du/dx
        computed_quantities[p](2) = inputs.solution_gradients[p][1]; // du/dy
      }
  }

  virtual std::vector<std::string> get_names() const override
  {
    return {"u", "grad_u_x", "grad_u_y"};
  }

  virtual std::vector<dealii::DataComponentInterpretation::DataComponentInterpretation>
  get_data_component_interpretation() const override
  {
    return {dealii::DataComponentInterpretation::component_is_scalar,
            dealii::DataComponentInterpretation::component_is_scalar,
            dealii::DataComponentInterpretation::component_is_scalar};
  }

  virtual dealii::UpdateFlags get_needed_update_flags() const override
  {
    return dealii::update_values | dealii::update_gradients;
  }
};

void LinearParabolicSolver::output_results(const unsigned int time_step) const {
    SolutionPostprocessor postprocessor;
    dealii::DataOut<2> data_out;
    data_out.attach_dof_handler(dof_handler_);
    data_out.add_data_vector(solution_, postprocessor);
    data_out.build_patches();
    std::ostringstream filename;
    filename << "solution-"  << std::setw(3) << std::setfill('0')
        << time_step << ".vtk";
    std::ofstream output(filename.str());
    data_out.write_vtk(output);
}

void LinearParabolicSolver::compute_error(const double time) const {
    AnalyticSolution ana_sol;
    ana_sol.set_time(time);
    dealii::Vector<double> difference_per_cell(tria_.n_active_cells());
    dealii::VectorTools::integrate_difference(dof_handler_,
                                       solution_,
                                       ana_sol,
                                       difference_per_cell,
                                       dealii::QGauss<2>(fe_.degree + 1),
                                       dealii::VectorTools::L2_norm);
    const double l2_error = dealii::VectorTools::compute_global_error(
            tria_, difference_per_cell,dealii::VectorTools::L2_norm);

    dealii::VectorTools::integrate_difference(dof_handler_,
                                       solution_,
                                       ana_sol,
                                       difference_per_cell,
                                       dealii::QGauss<2>(fe_.degree + 1),
                                       dealii::VectorTools::H1_seminorm);
    const double h1_error = dealii::VectorTools::compute_global_error(
            tria_, difference_per_cell,dealii::VectorTools::H1_seminorm);

    dealii::Vector<double> nodal_error(dof_handler_.n_dofs());
    dealii::VectorTools::interpolate(dof_handler_,
                                    ana_sol,
                                    nodal_error);
    nodal_error -= solution_;
    const double l_inf_error = nodal_error.linfty_norm();

    std::cout << "  Error L2 = " <<  l2_error
              << ", H1 seminorm = " << h1_error
              << ", L_inf = " << l_inf_error << std::endl;

}

void LinearParabolicSolver::run(){
    setup_system();

    std::cout<<"Number of DoFs: "<<dof_handler_.n_dofs()<<std::endl;


    // set initial condition
    AnalyticSolution ana_sol;
    ana_sol.set_time(time_);
    dealii::VectorTools::project(dof_handler_,
                                 constraints_,
                                 dealii::QGauss<2>(fe_.degree+1),
                                 ana_sol,
                                 old_solution_);
    constraints_.distribute(solution_);
    solution_ = old_solution_;
    assemble_system();
    assemble_rhs(); // calc load_vec_
    old_load_vec_ = load_vec_;


    output_results(0);

    dealii::Vector<double> tmp_vector_for_rhs;
    tmp_vector_for_rhs.reinit(dof_handler_.n_dofs());

    for (unsigned int time_step = 1;time_ < final_time_;++time_step) {
        time_ += time_step_;
        std::cout << "Time step: " << time_step
                  << ", Time: " << time_ << std::endl;


        apply_boundary_conditions();


        system_matrix_.copy_from(mass_matrix_);
        system_matrix_ *= 1.0 / time_step_;
        system_matrix_.add(theta_, stiffness_matrix_);

        assemble_rhs();

        system_rhs_ = load_vec_;
        system_rhs_ *= theta_;
        system_rhs_.add(1.0 - theta_, old_load_vec_);

        mass_matrix_.vmult(tmp_vector_for_rhs, old_solution_);
        tmp_vector_for_rhs *= 1.0 / time_step_;
        system_rhs_.add(1.0, tmp_vector_for_rhs);

        stiffness_matrix_.vmult(tmp_vector_for_rhs, old_solution_);
        system_rhs_.add(-1.0 * (1.0 - theta_), tmp_vector_for_rhs);

        constraints_.condense(system_matrix_, system_rhs_);


        dealii::SolverControl solver_control(1000, 1e-12);
        dealii::SolverCG<dealii::Vector<double>> solver(solver_control);
        dealii::PreconditionSSOR<dealii::SparseMatrix<double>> preconditioner;
        preconditioner.clear();
        preconditioner.initialize(system_matrix_, 1.2);

        solver.solve(system_matrix_, solution_,
                     system_rhs_, preconditioner);
        constraints_.distribute(solution_);


        old_load_vec_ = load_vec_;
        old_solution_ = solution_;
        if (time_step % 64 == 0) {
            output_results(time_step);
            compute_error(time_);
        }
    }

}


int main(int argc, char **argv){
    dealii::Utilities::MPI::MPI_InitFinalize mpi_init(argc, argv, 1);
    LinearParabolicSolver solver(0.0, // xmin
                                 2.0, // xmax,
                                 0.0, // ymin,
                                 1.0, // ymax,
                                 128, // mx,
                                 64, // my,
                                 1,  // poly_degree
                                 1./64., // time_step
                                 1.0, // final_time
                                 0.5, // theta
                                 2.0 // coeff
                                );

    solver.run();
    return 0;
}
```


以上程序的输出结果:




<!--stackedit_data:
eyJoaXN0b3J5IjpbOTIyODE1NzI5LDE5MDc0MjY5MDYsMTg2MD
EyOTE2OF19
-->