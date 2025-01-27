# step-26, 含时方程

## 推导

考虑以下偏微分方程系统：
$$
\frac{\partial u(x,t)}{\partial t} \;-\; \Delta\,u(x,t) \;=\; f(x,t),
\quad \forall\, x \in \Omega,\; t \in (0, T),
$$

$$
u(x,0) \;=\; u_0(x), \quad \forall\, x \in \Omega,
$$

$$
u(x,t) \;=\; g(x,t), \quad \forall\, x \in \partial\Omega,\; t \in (0,T).
$$

我们的目标是使用 $\theta$-scheme 来离散时间，从而求解上述方程。具体做法如下：

$$
\frac{u^n(x) - u^{n-1}(x)}{k_n}
\;-\;
\bigl[(1-\theta)\,\Delta\,u^{n-1}(x) \;+\; \theta\,\Delta\,u^n(x)\bigr]
\;=\;
\bigl[(1-\theta)\,f(x,t_{n-1}) \;+\; \theta\,f(x,t_n)\bigr],
$$

其中

$$
k_n \;=\; t_n - t_{n-1}
$$

为时间步长。theta-格式推广了显式欧拉法（$\theta=0$）、隐式欧拉法（$\theta=1$）以及 Crank–Nicolson 法（$\theta=\tfrac12$）。由于后者具有最高的收敛阶数，我们在下面的程序中将使用 $\theta = \tfrac12$.

在这里，可以将 $u^{n-1}(x)$ 视为已知数据，因为它通常已被计算出来。现在，用

$$
u^n(x) \approx u_h^n(x) \;=\; \sum_{j} U_j^n\,\phi_j(x)
$$

替换 $u^n(x)$，并用测试函数 $\phi_i(x)$ 相乘，需要时进行分部积分。按上述过程，我们可以得到如下全离散形式：

$$
M\,U^n \;-\; M\,U^{n-1}
\;+\; k_n\,\Bigl[\,(1-\theta)\,A\,U^{n-1} \;+\; \theta\,A\,U^n\Bigr]
\;=\;
k_n\,\Bigl[\,(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr],
$$

其中 $M$ 称为质量矩阵，$A$ 称为刚度矩阵，源自对拉普拉斯算子的离散化。把所有已知量移到右侧后，我们在每个时间步需求解的线性系统是：

$$
\bigl(M + k_n\,\theta\,A\bigr)\,U^n
\;=\;
M\,U^{n-1}
\;-\; k_n\,(1-\theta)\,A\,U^{n-1}
\;+\;
k_n\,\Bigl[\,(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr].
$$

由于左端矩阵是对称且正定的，我们可以使用共轭梯度法（Conjugate Gradient）高效地求解该系统。

$$
\sum_{j}\,\bigl(M + k_n\,\theta\,A\bigr)_{ij}\,U_j^n
\;=\;
(\phi_i,\;u_h^{n-1})
\;-\;
k_n\,(1-\theta)\,\bigl(\nabla\phi_i,\;\nabla u_h^{n-1}\bigr)
\;+\;
k_n\,\Bigl[(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr].
$$

现在，设想在时间步 $n-1$ 与 $n$ 之间更换了网格。此时的问题是，用于 $u_h^n$ 和 $u_h^{n-1}$ 的基函数并不相同！这会影响右端的各项，$(\phi_i,\;u_h^{n-1})\;=\;\bigl(\phi_i^n,\;\phi_j^{n-1}\bigr)\,U_j^{n-1},\quad i=1,\dots,N_n.$，如果两个时间步中使用的网格相同，那么 $(\phi_i^n,\;\phi_j^{n-1})$ 就构成一个方形的质量矩阵 $M_{ij}$。然而，如果网格不同，这个矩阵通常是非方阵。

在实际中，通常不会这样做。更常见的做法是，每次适配网格时，将旧网格上的解插值到新网格上，以避免上述问题。也就是说，我们不直接求解上面的方程，而是转而求解

$$
\sum_{j}\,\bigl(M + k_n\,\theta\,A\bigr)_{ij}\,U_j^n
\;=\;
\bigl(\phi_i,\;I_h^n\,u_h^{n-1}\bigr)
\;-\;
k_n\,(1-\theta)\,\bigl(\nabla\phi_i,\;\nabla I_h^n\,u_h^{n-1}\bigr)
\;+\;
k_n\,\Bigl[(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr],
$$

其中 $I_h^n$ 是将解插值到时间步 $n$ 所用有限元空间的算子。

如果初始时刻已经得到节点系数 $U^0$，就可以开始上述迭代。这里，$U^0$ 通过将初值 $u_0(x)$ 插值到首次时间步使用的网格上获得。

## benchmark

常见错误:

* 将 $\theta$ 与 $(1-\theta)$ 搞混。
* 处理右端项时，比如忘记乘上 $k_n$ 或 $\theta$。
* 错误地处理边界条件，比如忘记乘上 $k_n$ 或 $\theta$，或者只在右端项而不是系统矩阵中施加非零边界值。


还有一种不太常见但也可能出现的问题是初始条件设置错误。不过，这往往可以通过输出第一次时间步的结果来发现。无论如何，为了确保代码正确性，最好有一套测试方案来分别验证这些不同的部分。具体而言：

* 用非零初始条件、但右端项和边界值都为零的情形来测试，并验证时间演化是否正确。
* 然后，用零初始条件和零边界值但非零右端项来测试，并再次检查正确性。
* 最后，用零初始条件和零右端项但非零边界值来测试。


这些听起来很复杂，但对于线性偏微分方程（无系数或系数恒定）来说，其实有一套相对成熟的测试流程，基于以下观察：如果将区域选为 $[0,1]^2$（或者作稍许修改选用矩形），那么精确解可以写成

$$
u(x,y,t) \;=\; a(t)\,\sin(n_x\pi x)\,\sin(n_y\pi y),
$$

其中 $n_x,\,n_y$ 为整数。当初始条件、右端项和边界值都类似地取成 $\sin(n_x\pi x)\sin(n_y\pi y)$ 时，这种形式成立。其原因在于 $\sin(n_x\pi x)\sin(n_y\pi y)$ 是拉普拉斯算子的特征函数，因此可以直接计算它在 $\partial_t$ 和 $-\Delta$ 下的行为。

* **设置非零初值$u_0$，以及 $f=0$和 $g=0$, 排除右端项和边界条件, 检查是否是 $k_n$ 项或 $\theta$ 出现问题**

例如，令
$$
u_0(x,y) \;=\; \sin(n_x\pi x)\,\sin(n_y\pi y),
\quad
f(x,y,t) \;=\; 0.
$$
带入 $u(x,y,t) = a(t)\,\sin(n_x\pi x)\,\sin(n_y\pi y)$ 后，有
$$
\bigl(\partial_t - \Delta\bigr)\,u(x,y,t)
\;=\;
\bigl(\partial_t - \Delta\bigr)\,\bigl[a(t)\,\sin(n_x\pi x)\,\sin(n_y\pi y)\bigr]
\;=\;
\bigl[a'(t) + (n_x^2 + n_y^2)\,\pi^2\,a(t)\bigr]\,
\sin(n_x\pi x)\,\sin(n_y\pi y).
$$

要使它等于 $f(x,y,t)=0$，必须满足

$$
a'(t) + (n_x^2 + n_y^2)\,\pi^2\,a(t) = 0,
$$

并由于初始条件 $a(0)=1$，将此方程对时间积分可得

$$
a(t) = e^{-(n_x^2 + n_y^2)\,\pi^2\,t}.
$$

换言之，如果初始条件是若干正弦函数之积，则解依旧保持该形状，并以已知的时间依赖衰减。这对在网格与时间步足够细时进行验证非常方便。

如果在时间积分方案中（例如对各项的 $\theta$ 或 $k$ 系数）出错，往往会导致解的时间衰减不准确。通过比较不同步长或网格尺寸时解在某一点的数值演化，可以检查衰减是否翻倍或减半。由于此测试中边界条件和右端项都为零，因此错误不太可能来自这两处。

* **设置$u_0=0$，以及$g=0$, 检查是否是右端项出现问题**

若确认时间积分器正确，可接着考虑右端项非零而初始条件为零的情形：$u_0(x,y) = 0$ 并 $f(x,y,t) = \sin(n_x\pi x)\sin(n_y\pi y)$。再次有
$$
\bigl(\partial_t - \Delta\bigr)\,u(x,y,t)
\;=\;
\bigl[a'(t) + (n_x^2 + n_y^2)\,\pi^2\,a(t)\bigr]\,
\sin(n_x\pi x)\,\sin(n_y\pi y).
$$
要使它等于 $f(x,y,t)$，需满足
$$
a'(t) + (n_x^2 + n_y^2)\,\pi^2\,a(t) = 1,
$$
并且初始条件 $a(0)=0$。对该方程做时间积分得到
$$
a(t) = \frac{1}{(n_x^2 + n_y^2)\,\pi^2}\,
\Bigl[\,1 - e^{-(n_x^2 + n_y^2)\,\pi^2\,t}\Bigr].
$$
同样，如果对右端项前的 $\theta$ 或 $k$ 系数处理错误，解的时间行为将不再准确，或者会收敛到错误的最大值，而不是
$$
\frac{1}{(n_x^2 + n_y^2)\,\pi^2}.
$$

在确认时间积分和右端项的处理均无问题后，我们可以使用类似思路来验证边界值的处理。

## 测试算例

在简单区域上用简单的右端项解热方程，通常会得到解快速变平滑且变化不大的结果。因此，这里我们选择在一个 L 形区域内求解热方程，边界条件与初始条件都为零，而右端项定义为

$$
f(x, t) =
\begin{cases}
\chi_1(x) & \text{if } 0 \leq t \leq 0.2\tau \text{ or } \tau \leq t \leq 1.2\tau \text{ or } 2\tau \leq t \leq 2.2\tau, \text{ etc.} \\
\chi_2(x) & \text{if } 0.5\tau \leq t \leq 0.7\tau \text{ or } 1.5\tau \leq t \leq 1.7\tau \text{ or } 2.5\tau \leq t \leq 2.7\tau, \text{ etc.} \\
0 & \text{otherwise.}
\end{cases}
$$

$$
\chi_1(x) =
\begin{cases}
1 & \text{if } x > 0.5 \text{ and } y > -0.5, \\
0 & \text{otherwise.}
\end{cases}
$$

$$
\chi_2(x) =
\begin{cases}
1 & \text{if } x > -0.5 \text{ and } y > 0.5, \\
0 & \text{otherwise.}
\end{cases}
$$


换言之，在每个长度为 $\tau$ 的周期里，右端项先在区域 1 上开启，然后关闭，再在区域 2 上开启，随后再次关闭。在结果部分中可以通过一个小动画直观地看到这一模式。

如果将热方程视为导体中随时间和空间变化的温度分布，那么上述测试用例对应一个 L 形区域，其边界温度始终保持在零，而在域的两个部分交替加热。加热时，这些位置的温度上升，随后向周围扩散并下降。这些初始条件的关键之处在于，解在时间（热源开关）和空间（凹角及边界、顶点等）都具有奇异性。





## 注释代码

```cpp
/*
  本程序与之前的示例程序（例如 step-6）类似，主要区别在于需要构建
  两个矩阵（质量矩阵和拉普拉斯矩阵），并分别保存当前和上一个时间步的
  解。我们还需要存储当前时间、时间步长以及当前所处的时间步编号。最后，
  成员变量中还有一个 theta 参数，用于在同一个程序中同时实现显式欧拉法、
  隐式欧拉法、Crank-Nicolson 法以及它们的一般化。

  函数方面需要注意的只有 refine_mesh，它带有最小和最大网格细化层数参数，
  这在程序介绍部分有说明。
*/

// 引入一系列需要用到的 deal.II 头文件（与之前示例类似）:
#include <deal.II/base/utilities.h>
#include <deal.II/base/quadrature_lib.h>
#include <deal.II/base/function.h>
#include <deal.II/base/logstream.h>
#include <deal.II/lac/vector.h>
#include <deal.II/lac/full_matrix.h>
#include <deal.II/lac/dynamic_sparsity_pattern.h>
#include <deal.II/lac/sparse_matrix.h>
#include <deal.II/lac/solver_cg.h>
#include <deal.II/lac/precondition.h>
#include <deal.II/lac/affine_constraints.h>
#include <deal.II/grid/tria.h>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_refinement.h>
#include <deal.II/grid/grid_out.h>
#include <deal.II/dofs/dof_handler.h>
#include <deal.II/dofs/dof_tools.h>
#include <deal.II/fe/fe_q.h>
#include <deal.II/fe/fe_values.h>
#include <deal.II/numerics/data_out.h>
#include <deal.II/numerics/vector_tools.h>
#include <deal.II/numerics/error_estimator.h>
#include <deal.II/numerics/solution_transfer.h>
#include <deal.II/numerics/matrix_tools.h>

#include <fstream>
#include <iostream>


// 通常我们会将所有内容置于一个命名空间中，并引入 dealii 命名空间:
namespace Step26
{
  using namespace dealii;


  // ## The HeatEquation class
  //
  // 这里声明了本程序的主要类。它与之前的示例程序类似：我们需要两个矩阵
  // (mass_matrix 和 laplace_matrix) 并保存当前和上一个时间步的解。
  // 我们还需要维护当前时间 (time)、时间步长 (time_step) 以及当前的
  // 时间步编号 (timestep_number)。theta 用于在一个程序中统一处理不同的
  // 时间离散方法 (显式欧拉、隐式欧拉、Crank-Nicolson 等)。
  //
  // 另外，refine_mesh 函数允许我们指定最小和最大的网格细化层数，这在前面
  // 的介绍里也有说明。
  template <int dim>
  class HeatEquation
  {
  public:
    HeatEquation();
    void run();

  private:
    void setup_system();
    void solve_time_step();
    void output_results() const;
    void refine_mesh(const unsigned int min_grid_level,
                     const unsigned int max_grid_level);

    Triangulation<dim> triangulation;
    FE_Q<dim>          fe;
    DoFHandler<dim>    dof_handler;

    AffineConstraints<double> constraints;

    SparsityPattern      sparsity_pattern;
    SparseMatrix<double> mass_matrix;
    SparseMatrix<double> laplace_matrix;
    SparseMatrix<double> system_matrix;

    Vector<double> solution;
    Vector<double> old_solution;
    Vector<double> system_rhs;

    double       time;
    double       time_step;
    unsigned int timestep_number;

    const double theta;
  };



  // ## Equation data
  //
  // 下列类和函数用于实现本程序的各种数据（例如右端项和边界值）。
  // 右端项与介绍部分最后的讨论一致。这里将边界值取为 0，如果需要可在
  // 代码里简单地更改。
  template <int dim>
  class RightHandSide : public Function<dim>
  {
  public:
    RightHandSide()
      : Function<dim>()
      , period(0.2)
    {}

    virtual double value(const Point<dim>  &p,
                         const unsigned int component = 0) const override;

  private:
    const double period;
  };



  template <int dim>
  double RightHandSide<dim>::value(const Point<dim>  &p,
                                   const unsigned int component) const
  {
    (void)component;
    AssertIndexRange(component, 1);
    Assert(dim == 2, ExcNotImplemented());

    const double time = this->get_time();
    const double point_within_period =
      (time / period - std::floor(time / period));

    if ((point_within_period >= 0.0) && (point_within_period <= 0.2))
      {
        if ((p[0] > 0.5) && (p[1] > -0.5))
          return 1;
        else
          return 0;
      }
    else if ((point_within_period >= 0.5) && (point_within_period <= 0.7))
      {
        if ((p[0] > -0.5) && (p[1] > 0.5))
          return 1;
        else
          return 0;
      }
    else
      return 0;
  }



  template <int dim>
  class BoundaryValues : public Function<dim>
  {
  public:
    virtual double value(const Point<dim>  &p,
                         const unsigned int component = 0) const override;
  };



  template <int dim>
  double BoundaryValues<dim>::value(const Point<dim> & /*p*/,
                                    const unsigned int component) const
  {
    (void)component;
    Assert(component == 0, ExcIndexRange(component, 0, 1));
    return 0;
  }



  // ## HeatEquation 实现
  //
  // 下面是主类的实现部分。先从构造函数开始，其中选用了一个一次元 (FE_Q<dim>(1))，
  // 将时间步长设为 1/500（因为右端项的周期在上面设置为 0.2，我们希望对每个周期
  // 使用 100 个时间步），并通过令 theta=0.5 来选择 Crank-Nicolson 方法。
  template <int dim>
  HeatEquation<dim>::HeatEquation()
    : fe(1)
    , dof_handler(triangulation)
    , time_step(1. / 500)
    , theta(0.5)
  {}



  // ### HeatEquation::setup_system
  //
  // 本函数中，我们分配自由度、构建约束 (constraints) 并根据正确的大小初始化
  // 线性代数对象。同时，我们也使用库函数构造质量矩阵和拉普拉斯矩阵。
  // 
  // 注意，这里在装配矩阵时没有考虑悬挂节点约束（AffineConstraints 参数使用了默认
  // 空对象）。我们会在 run() 中将这些约束“压缩”到矩阵中。
  template <int dim>
  void HeatEquation<dim>::setup_system()
  {
    dof_handler.distribute_dofs(fe);

    std::cout << std::endl
              << "===========================================" << std::endl
              << "Number of active cells: " << triangulation.n_active_cells()
              << std::endl
              << "Number of degrees of freedom: " << dof_handler.n_dofs()
              << std::endl
              << std::endl;

    constraints.clear();
    DoFTools::make_hanging_node_constraints(dof_handler, constraints);
    constraints.close();

    DynamicSparsityPattern dsp(dof_handler.n_dofs());
    DoFTools::make_sparsity_pattern(dof_handler,
                                    dsp,
                                    constraints,
                                    /*keep_constrained_dofs = */ true);
    sparsity_pattern.copy_from(dsp);

    mass_matrix.reinit(sparsity_pattern);
    laplace_matrix.reinit(sparsity_pattern);
    system_matrix.reinit(sparsity_pattern);

    MatrixCreator::create_mass_matrix(dof_handler,
                                      QGauss<dim>(fe.degree + 1),
                                      mass_matrix);
    MatrixCreator::create_laplace_matrix(dof_handler,
                                         QGauss<dim>(fe.degree + 1),
                                         laplace_matrix);

    solution.reinit(dof_handler.n_dofs());
    old_solution.reinit(dof_handler.n_dofs());
    system_rhs.reinit(dof_handler.n_dofs());
  }


  // ### HeatEquation::solve_time_step
  //
  // 本函数在单个时间步上求解线性系统。实现方式并无新奇之处：
  template <int dim>
  void HeatEquation<dim>::solve_time_step()
  {
    SolverControl            solver_control(1000, 1e-8 * system_rhs.l2_norm());
    SolverCG<Vector<double>> cg(solver_control);

    PreconditionSSOR<SparseMatrix<double>> preconditioner;
    preconditioner.initialize(system_matrix, 1.0);

    cg.solve(system_matrix, solution, system_rhs, preconditioner);

    constraints.distribute(solution);

    std::cout << "     " << solver_control.last_step() << " CG iterations."
              << std::endl;
  }



  // ### HeatEquation::output_results
  //
  // 生成图形化输出时，没有太多新的内容。我们只是在写出 VTK 文件时，
  // 附加上当前时间和时间步编号，以便在可视化时使用。
  template <int dim>
  void HeatEquation<dim>::output_results() const
  {
    DataOut<dim> data_out;

    data_out.attach_dof_handler(dof_handler);
    data_out.add_data_vector(solution, "U");

    data_out.build_patches();

    data_out.set_flags(DataOutBase::VtkFlags(time, timestep_number));

    const std::string filename =
      "solution-" + Utilities::int_to_string(timestep_number, 3) + ".vtk";
    std::ofstream output(filename);
    data_out.write_vtk(output);
  }


  // ### HeatEquation::refine_mesh
  //
  // 此函数负责自适应网格细化。其主要工作包括：使用 Kelly 误差估计器找到
  // 需要细化/粗化的单元；实际执行细化/粗化；以及在新旧网格之间转移解向量。
  //
  // 首先，我们使用 KellyErrorEstimator 来估计每个单元的误差；然后通过
  // GridRefinement::refine_and_coarsen_fixed_fraction 函数根据误差分布选出
  // 60% 的单元进行细化，40% 的单元进行粗化。因为本问题中“有事儿发生”的区域
  // 会移动，我们希望更积极地对网格进行粗化，以便将网格资源重新分配到更需要的地方。
  //
  // 之后，我们根据最小和最大网格层数限制了可细化/粗化的层数，以避免出现网格
  // 过细或过粗导致的时间步约束或精度不足问题。
  //
  // 然后，我们使用 SolutionTransfer 类在新旧网格之间转移解向量。要在网格
  // 改变后保留旧解，需要在 refine/coarsen 前调用 prepare_for_coarsening_and_refinement，
  // 之后执行网格细化，再调用 interpolate。最后需要对插值得到的解应用悬挂节点
  // 约束，使解在新网格上保持连续。
  template <int dim>
  void HeatEquation<dim>::refine_mesh(const unsigned int min_grid_level,
                                      const unsigned int max_grid_level)
  {
    Vector<float> estimated_error_per_cell(triangulation.n_active_cells());

    KellyErrorEstimator<dim>::estimate(
      dof_handler,
      QGauss<dim - 1>(fe.degree + 1),
      std::map<types::boundary_id, const Function<dim> *>(),
      solution,
      estimated_error_per_cell);

    GridRefinement::refine_and_coarsen_fixed_fraction(triangulation,
                                                      estimated_error_per_cell,
                                                      0.6,
                                                      0.4);

    if (triangulation.n_levels() > max_grid_level)
      for (const auto &cell :
           triangulation.active_cell_iterators_on_level(max_grid_level))
        cell->clear_refine_flag();
    for (const auto &cell :
         triangulation.active_cell_iterators_on_level(min_grid_level))
      cell->clear_coarsen_flag();

    // 以下注释解释了为什么可以这样写：基本上，三角形中迭代器在同一级别的单元
    // 是顺序排列的，所以我们只要循环到该层级的末尾即可。此外，本段代码正是负责
    // 保证最高层不会超过 max_grid_level。

    // 构造 SolutionTransfer 对象，用于在网格细化/粗化后转移解。我们将当前解
    // 拷贝到 previous_solution，并在三角形的 prepare_coarsening_and_refinement
    // 操作之前先调用 solution_trans.prepare_for_coarsening_and_refinement。
    SolutionTransfer<dim> solution_trans(dof_handler);

    Vector<double> previous_solution;
    previous_solution = solution;
    triangulation.prepare_coarsening_and_refinement();
    solution_trans.prepare_for_coarsening_and_refinement(previous_solution);

    // 执行网格细化后，需要更新 DoFHandler 并重新初始化矩阵和向量，然后才能
    // 执行解向量的插值转移。最后，再对新网格上的解分布进行悬挂节点约束处理。
    triangulation.execute_coarsening_and_refinement();
    setup_system();

    solution_trans.interpolate(previous_solution, solution);
    constraints.distribute(solution);
  }



  // ### HeatEquation::run
  //
  // 本函数是程序的核心，将遍历所有时间步。
  // 首先，我们设置初始全局细化次数 initial_global_refinement 和自适应网格
  // 预细化次数 n_adaptive_pre_refinement_steps。然后生成一个 L 形网格，并进行
  // 若干次全局细化，再初始化各类对象。接着，我们设置一个标记以便重复运行
  // 第一个时间步，并将初始解插值到网格上（这里选用零函数）。最后输出初始
  // 步的解。
  //
  // 需要注意的是，下面这段代码中使用了 goto 语句，它通常不被推荐使用，但在
  // 本例中可以减少代码重复量，将一些相同操作在合适时重新执行。函数最后会做
  // 进一步的解释。
  template <int dim>
  void HeatEquation<dim>::run()
  {
    const unsigned int initial_global_refinement       = 2;
    const unsigned int n_adaptive_pre_refinement_steps = 4;

    GridGenerator::hyper_L(triangulation);
    triangulation.refine_global(initial_global_refinement);

    setup_system();

    unsigned int pre_refinement_step = 0;

    Vector<double> tmp;
    Vector<double> forcing_terms;

  start_time_iteration:

    time            = 0.0;
    timestep_number = 0;

    tmp.reinit(solution.size());
    forcing_terms.reinit(solution.size());

    VectorTools::interpolate(dof_handler,
                             Functions::ZeroFunction<dim>(),
                             old_solution);
    solution = old_solution;

    output_results();

    // 我们将一直循环至 time 超过 0.5。首先，要构建需要求解的线性系统的右端项：
    // 其形式为 M U^{n-1} - (1 - theta) * k_n * A U^{n-1}。我们使用 system_rhs
    // 来保存这部分结果。先将旧解乘以质量矩阵得到 mass_matrix * old_solution，
    // 然后再减去 (1 - theta)*k_n*(laplace_matrix * old_solution)。
    const double end_time = 0.5;
    while (time <= end_time)
      {
        time += time_step;
        ++timestep_number;

        std::cout << "Time step " << timestep_number << " at t=" << time
                  << std::endl;

        mass_matrix.vmult(system_rhs, old_solution);

        laplace_matrix.vmult(tmp, old_solution);
        system_rhs.add(-(1 - theta) * time_step, tmp);

        // 接下来处理源项 (即右端项) 的影响。它对应于
        // k_n * [ (1 - theta)*F^{n-1} + theta*F^n ]。下列代码利用
        // VectorTools::create_right_hand_side 分别计算 F^{n-1} 和 F^n，
        // 并将其叠加到 forcing_terms 中。
        RightHandSide<dim> rhs_function;
        rhs_function.set_time(time);
        VectorTools::create_right_hand_side(dof_handler,
                                            QGauss<dim>(fe.degree + 1),
                                            rhs_function,
                                            tmp);
        forcing_terms = tmp;
        forcing_terms *= time_step * theta;

        rhs_function.set_time(time - time_step);
        VectorTools::create_right_hand_side(dof_handler,
                                            QGauss<dim>(fe.degree + 1),
                                            rhs_function,
                                            tmp);

        forcing_terms.add(time_step * (1 - theta), tmp);

        // 与时间步相关的项和源项现在都加到 system_rhs 中。同时，我们构造
        // system_matrix = M + theta * k_n * A，并调用 constraints.condense
        // 来处理悬挂节点约束。
        system_rhs += forcing_terms;

        system_matrix.copy_from(mass_matrix);
        system_matrix.add(theta * time_step, laplace_matrix);

        constraints.condense(system_matrix, system_rhs);

        // 处理边界值。创建一个 boundary_values_function，设置当前时间，
        // 然后在自由度上插值到边界。最后使用 MatrixTools::apply_boundary_values
        // 将这些值应用到系统矩阵和右端项中。
        {
          BoundaryValues<dim> boundary_values_function;
          boundary_values_function.set_time(time);

          std::map<types::global_dof_index, double> boundary_values;
          VectorTools::interpolate_boundary_values(dof_handler,
                                                   0,
                                                   boundary_values_function,
                                                   boundary_values);

          MatrixTools::apply_boundary_values(boundary_values,
                                             system_matrix,
                                             solution,
                                             system_rhs);
        }

        // 现在我们可以求解系统并输出结果。
        solve_time_step();
        output_results();

        // 最后，进行网格细化的判定。如果这是第一次时间步并且还没达到指定的
        // 自适应预细化次数，我们就细化网格然后跳回到 start_time_iteration 的位置
        // 重新开始时间迭代。否则，每隔 5 个时间步进行一次网格细化。
        // 周期完毕后，我们更新 old_solution 以进入下一个时间步。
        if ((timestep_number == 1) &&
            (pre_refinement_step < n_adaptive_pre_refinement_steps))
          {
            refine_mesh(initial_global_refinement,
                        initial_global_refinement +
                          n_adaptive_pre_refinement_steps);
            ++pre_refinement_step;

            std::cout << std::endl;

            goto start_time_iteration;
          }
        else if ((timestep_number > 0) && (timestep_number % 5 == 0))
          {
            refine_mesh(initial_global_refinement,
                        initial_global_refinement +
                          n_adaptive_pre_refinement_steps);
            tmp.reinit(solution.size());
            forcing_terms.reinit(solution.size());
          }

        old_solution = solution;
      }
  }
} // namespace Step26


// ## main 函数
//
// main 函数与之前的 step-6 及其后续的示例类似：我们在 try/catch 块中创建
// HeatEquation<2> 对象并调用 run()。
int main()
{
  try
    {
      using namespace Step26;

      HeatEquation<2> heat_equation_solver;
      heat_equation_solver.run();
    }
  catch (std::exception &exc)
    {
      std::cerr << std::endl
                << std::endl
                << "----------------------------------------------------"
                << std::endl;
      std::cerr << "处理过程中出现异常: " << std::endl
                << exc.what() << std::endl
                << "程序中止!" << std::endl
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
      std::cerr << "出现未知异常!" << std::endl
                << "程序中止!" << std::endl
                << "----------------------------------------------------"
                << std::endl;
      return 1;
    }

  return 0;
}
```




<!--stackedit_data:
eyJoaXN0b3J5IjpbNzMwMTc5NzUwLDYxODczNzM4NiwtOTg5Mz
c5NzE4LC0yNTMyMTI5MTMsLTE0NzUxMjM0NzgsLTQzNjE1OTMx
MywtMTkwNDU3OTAzNywxMTk0NDEzNjI5LC00MTc4NjczODFdfQ
==
-->