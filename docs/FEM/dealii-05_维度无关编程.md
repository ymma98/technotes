# step-4, dimension independent programming

依然是考虑泊松方程,

$$
-\Delta u = f \text{ in } \Omega,\\
u=0 \text{ on } \partial\Omega.
$$

然后做以下积分:
$$
-\int_\Omega \varphi \Delta u = \int_\Omega \varphi f.
$$
考虑到 $\nabla \cdot (\varphi \nabla u) = \nabla \varphi \cdot \nabla u + \varphi\Delta u$, 于是有
$$
\int_\Omega \nabla \varphi \cdot \nabla u - \int_{\partial\Omega} \varphi \vec{n} \cdot \nabla u = \int_\Omega \varphi f.
$$
测试函数 $\varphi$ 必须满足相同类型的边界条件（在数学术语中：它需要来自我们寻求解的集合的切空间），因此在边界上 $\varphi = 0$，因此我们要寻找的弱形式为
$$
(\nabla \varphi, \nabla u) = (\varphi, f),
$$
这里我们使用了常用的符号 $(a, b) = \int_\Omega ab$

通过这些步骤，我们现在拥有一组函数 $\varphi_i$，我们可以定义离散问题的弱形式：寻找一个函数 $u_h$，即寻找上述提到的扩展系数 $U_j$，使得
$$
(\nabla \varphi_i, \nabla u_h) = (\varphi_i, f), \quad i = 0 \ldots N-1.
$$
请注意，我们在这里遵循的约定是所有计数从零开始，这在 C 和 C++ 中很常见。通过插入表示 $u_h(x) = \sum_j U_j \varphi_j(x)$，然后观察到
$$
(\nabla \varphi_i, \nabla u_h) = (\nabla \varphi_i, \nabla[\sum_j U_j \varphi_j]) = \sum_j (\nabla \varphi_i, \nabla[U_j \varphi_j]) = \sum_j (\nabla \varphi_i, \nabla \varphi_j) U_j.
$$
因此，该问题变为：寻找一个向量 $U$ 使得
$$
AU = F,
$$
其中矩阵 $A$ 和右侧 $F$ 定义为
$$
A_{ij} = (\nabla \varphi_i, \nabla \varphi_j), \quad F_i = (\varphi_i, f).
$$
**为了避免任何混淆，经验表明，养成从左侧乘以方程而不是从右侧乘以（如数学文献中常做的）可以避免一种常见的错误，因为矩阵在比较理论和实现时自动正确，而不需要转置**。

我们首先将 $\Omega$ 上的积分拆分为对所有单元的积分，

$$ 
  \begin{align*}
    A_{ij} &= (\nabla\varphi_i, \nabla \varphi_j) 
    = \sum_{K \in {\mathbb T}} \int_K \nabla\varphi_i \cdot \nabla \varphi_j, \\
    F_i &= (\varphi_i, f) 
    = \sum_{K \in {\mathbb T}} \int_K \varphi_i f,
  \end{align*}
$$ 

  然后用求积来近似每个单元的贡献：
  
$$ 
  \begin{align*}
    A^K_{ij} &=
    \int_K \nabla\varphi_i \cdot \nabla \varphi_j 
    \approx 
    \sum_q \nabla\varphi_i(\mathbf x^K_q) \cdot \nabla 
    \varphi_j(\mathbf x^K_q) w_q^K, \\
    F^K_i &=
    \int_K \varphi_i f 
    \approx 
    \sum_q \varphi_i(\mathbf x^K_q) f(\mathbf x^K_q) w^K_q,
  \end{align*}
$$ 

  其中 $\mathbb{T} \approx \Omega$ 是一个近似于域的剖分，$\mathbf x^K_q$ 是单元 $K$ 上的第 $q$ 个求积点，$w^K_q$ 是第 $q$ 个求积权重。

#### include 头文件。这部分头文件太多了，很难搞清楚哪个对应哪个，估计真正使用的时候，也是一股脑全部 include 进来，根本不作区分

```cpp
  // 用于网格生成和枚举自由度
  #include <deal.II/grid/tria.h>
  #include <deal.II/dofs/dof_handler.h>
  #include <deal.II/grid/grid_generator.h>
  // 用于设置基函数
  #include <deal.II/fe/fe_q.h>
  // 用于产生稀疏矩阵的 sparsity pattern
  #include <deal.II/dofs/dof_tools.h>
  // 用于每个单元上的数值积分
  #include <deal.II/fe/fe_values.h>
  #include <deal.II/base/quadrature_lib.h>
  // 用于设置边界条件
  #include <deal.II/base/function.h>
  #include <deal.II/numerics/vector_tools.h>
  #include <deal.II/numerics/matrix_tools.h>
  // 用于矩阵求解, 组装
  #include <deal.II/lac/vector.h>
  #include <deal.II/lac/full_matrix.h>
  #include <deal.II/lac/sparse_matrix.h>
  #include <deal.II/lac/dynamic_sparsity_pattern.h>
  #include <deal.II/lac/solver_cg.h>
  #include <deal.II/lac/precondition.h>
  // 用于数据后处理
  #include <deal.II/numerics/data_out.h>
  #include <fstream>
  #include <iostream>
  
  using namespace dealii;
```

#### 设置 solver 框架

```cpp
  template <int dim>
  class Step4
  {
  public:
    Step4();
    void run();

  private:
    // 生成网格
    void make_grid();
    // 用于设置所有所需的数据结构。之所以放在这里, 是因为在含时问题中, 如果考虑到自适应网格, 就需要每隔几个时间步就要重新设置一遍数据结构
    void setup_system();
    // 矩阵组装
    void assemble_system();
    // 矩阵求解
    void solve();
    // 输出数据
    void output_results() const;
	// 定义 member variable, 用于管理网格、shape function 和 DOF
    Triangulation<dim> triangulation;
    const FE_Q<dim>    fe;
    DoFHandler<dim>    dof_handler;

    SparsityPattern      sparsity_pattern;
    SparseMatrix<double> system_matrix; // A

    Vector<double> solution; // x
    Vector<double> system_rhs;  // b
  };
```

#### 定义求解问题

$$
-\nabla\cdot \nabla u = f \\
f= 4(x^4 + y^4) \quad \text{2D} \\
f= 4(x^4 + y^4 + z^4) \quad \text{3D} \\
u = x^2 + y^2 \quad  \text{on}\quad \partial \Omega
$$

```cpp
  template <int dim>
  class RightHandSide : public Function<dim>
  {
  public:
    virtual double value(const Point<dim>  &p,
                         const unsigned int component = 0) const override;
  };

  template <int dim>
  class BoundaryValues : public Function<dim>
  {
  public:
    virtual double value(const Point<dim>  &p,
                         const unsigned int component = 0) const override;
  };
```

这里用到了虚函数的概念。`Function` 在 dealii 中是一个 abstract class (本身不能被实例化，要求至少包含一个纯虚函数)。`RightHandSide` 是 `Function` 的继承，其中 overriding 了 `Function::value()` 函数，因为是 overriding, 所以函数的参数以及末尾的 const 等要完全一致。同理，`BoundaryValues` 也是如此。

接下来是 `RightHandSide::value()` 和 `BoundaryValues::value()` 的具体实现:

```cpp
  template <int dim>
  double RightHandSide<dim>::value(const Point<dim> &p,
                                   const unsigned int /*component*/) const
  {
    double return_value = 0.0;
    for (unsigned int i = 0; i < dim; ++i)
      return_value += 4.0 * std::pow(p[i], 4.0);

    return return_value;
  }

  template <int dim>
  double BoundaryValues<dim>::value(const Point<dim> &p,
                                    const unsigned int /*component*/) const
  {
    return p.square();
  }
```

在定义中，这里用到了 unnamed parameters, 可以避免编译器报 warning, 同时对于虚函数，在 declaration 的时候需要用到 virtual 和 override 关键字，但是在 definition 的时候就用不到了，但是如果想在 definition 的时候加入 virtual 和 override 也是可以的。

#### 定义构造函数

初始化 poly degree, 以及 dof_handler

```cpp
  template <int dim>
  Step4<dim>::Step4()
    : fe(/* polynomial degree = */ 1)
    , dof_handler(triangulation)
  {}
```

这里是构造函数的具体实现，`:` 之后的是 member initializer list。triangulation 本身调用了自己的默认构造函数, 不需要显式地构造。


#### 网格定义实现

```cpp
  template <int dim>
  void Step4<dim>::make_grid()
  {
    GridGenerator::hyper_cube(triangulation, -1, 1);
    triangulation.refine_global(4);

    std::cout << "   Number of active cells: " << triangulation.n_active_cells()
              << std::endl
              << "   Total number of cells: " << triangulation.n_cells()
              << std::endl;
  }
```

refine_global(n) 意味着所有的 cell 都均匀地划分为 2\*\*dim 个子网格。以 2D 的情况为例，最开始 triangulation 只有一个 cell, 然后被 refine 4次，意味着 refine 之后有 (2\*\*2)**4 个网格，即256个网格。总网格数是 $(2^{dim})^n$ 。

active cell 就是参与计算的 cell. inactive cell 是 active cell 的父节点，total cell number = active cell num + inactive cell num. total cell number 没有物理意义, 只是和 triangulation 管理 mesh 的数据结构有关。

#### 设置数据结构实现

```cpp
  template <int dim>
  void Step4<dim>::setup_system()
  {
    // 给所有有限元节点编号
    dof_handler.distribute_dofs(fe);

    std::cout << "   Number of degrees of freedom: " << dof_handler.n_dofs()
              << std::endl;
	// DOF 定了, 矩阵的大小就定了, 这里定义了 SparsityPattern
    DynamicSparsityPattern dsp(dof_handler.n_dofs());
    // 这一步, 是根据 dof_handler 决定 SparsityPattern 中可能的非零元素
    DoFTools::make_sparsity_pattern(dof_handler, dsp);
    // 相比于 DynamicSparsityPattern. SparsityPattern 是在数值存储上更优化的方案
    sparsity_pattern.copy_from(dsp);
	// matrix 和 SparsityPattern 的区别在于, 几个 matrix 可以共用一个 SparsityPattern
    system_matrix.reinit(sparsity_pattern);

    solution.reinit(dof_handler.n_dofs());
    system_rhs.reinit(dof_handler.n_dofs());
  }
```


#### 矩阵组装实现

```cpp

```






<!--stackedit_data:
eyJoaXN0b3J5IjpbLTQ2NzA2OTYxNSwtMTg5MzExNDYyNywxNj
M2MjY2ODIzLDIwNjE3MTc0NDEsNjcyMDQ2MzE2LDEzODE3MDkw
ODQsLTE4MDE0NTQ0MjgsMjkyMDgyMDgxLC0xNzExMzMxMDI2LD
EzOTk4Mjk5OTMsLTEyNDY3NDE2MDEsLTEyMDI0NDY2ODcsNDIx
NzQ3MDAzLDExOTMyMDU4OTksLTE1MzU2NzYwMTQsNTUzMDMwNT
Q0LC0xNDA1ODIzODI4LDEyNTc5NzcyMTksLTE5NTc1MzE5MDMs
MTc4Mzk3ODk3NF19
-->