# dealii-03: 自由度


## step-2

### 介绍

在当前的教程程序中，我们展示了如何通过定义在该网格上的自由度（degrees of freedom，简称 DoF）的概念来表示分段多项式函数。在本例中，我们将使用最低阶的有限元 $Q_1$，即我们寻找的逼近函数 $u_h$ 在网格的每个四边形单元 $K$ 上是[“双线性”](https://defelement.com/elements/examples/quadrilateral-lagrange-equispaced-1.html)的。（如果我们使用三角形单元，则 $u_h$ 是线性的。）


在实践中，我们将函数表示为形函数 $\phi_j(x)$ 的线性组合，其中的系数 $U_j$ 称为“自由度”（degrees of freedom）。对于我们在这里考虑的双线性函数，每个形函数和自由度都与网格的一个顶点相关联。后续的例子将展示高阶单元，在这些单元中，自由度不一定与顶点相关联，还可能与网格的边、面或单元内部相关联。

“自由度”一词在有限元领域通常用于表示两个略有不同但相关的概念。第一个是，我们希望将有限元解表示为形函数的线性组合，形式为

$$
u_h(x) = \sum_{j=0}^{N-1} U_j \phi_j(x)
$$

这里，$U_j$ 是展开系数向量。由于我们尚不知道它们的值（我们将通过求解线性或非线性系统来得到它们），因此它们被称为“未知数”或“自由度”。该词的第二个含义如下：有限元问题的数学描述通常是寻找一个有限维函数 $u_h \in V_h$，使其满足某些方程组（例如，$a(u_h, \phi_h) = (f, \phi_h)$，对于所有测试函数 $\phi_h \in V_h$）。换句话说，这里我们只说明了解必须属于某个空间 $V_h$。然而，为了在计算机上实际求解该问题，我们需要选择该空间的一个基；这就是我们在上面使用形函数 $\phi_j(x)$ 和系数 $U_j$ 来展开 $u_h(x)$ 的原因。


* 自由度的枚举

在这种情况下，描述“自由度”需要我们简单地枚举 $V_h$ 空间的基函数。对于 $Q_1$ 元素，这意味着简单地枚举网格的顶点，但对于高阶元素，还需要枚举与网格的边、面或单元内部相关的形函数。换句话说，自由度的枚举与顶点的索引完全是两个独立的概念。**提供 $V_h$ 空间基函数枚举的类称为 `DoFHandler`。**

在网格上定义自由度（简称为 DoF）在实践中是一个相当简单的任务，因为库为你完成了所有工作。基本上，你所要做的就是创建一个有限元对象（来自 `deal.II` 已经拥有的许多有限元类之一，参见[有限元空间描述文档](https://www.dealii.org/current/doxygen/deal.II/group__fe.html)），并将其通过 `DoFHandler::distribute_dofs()` 函数传递给 `DoFHandler` 对象（“分配 DoFs”是我们用来描述上述枚举基函数过程的术语）。`DoFHandler` 是一个知道哪些自由度在哪里的类，即它可以回答诸如“全局有多少自由度”和“在这个单元上，给我这里存在的形函数的全局索引”之类的问题。**这是你在确定系统矩阵的大小以及将单个单元的贡献复制到全局矩阵时所需要的信息。**

因此，当前程序的第一个任务是获取一个网格和一个有限元，并枚举自由度。在当前的上下文中，这意味着简单地为网格的每个顶点分配一个自由度索引。完成此操作后，我们将在图中输出哪个顶点对应哪个自由度索引。

值得指出的是，几何上每个自由度的位置并不是我们在有限元代码中通常会问的问题。大多数时候，我们只关心所有自由度的枚举顺序，而不关心哪个自由度位于哪里。

* 稀疏性

有限元矩阵通常是非常稀疏的：这些矩阵中的绝大多数元素都是零。

更确切地说，**我们说一个矩阵是稀疏的，如果矩阵中每行的非零元素数量被限制在一个与自由度总数无关的数值**。例如，拉普拉斯方程的有限差分逼近的简单 5 点模板会生成一个稀疏矩阵，因为每行的非零元素数量是五个，并且与矩阵的总大小无关。对于更复杂的问题——例如 step-22 中的斯托克斯问题，特别是在 3D 中，每行的非零元素可能达到几百个。但重要的是，这个数值与问题的整体大小无关：如果你细化网格，每行的最大未知数数量保持不变。

稀疏性是有限元方法与使用泰勒展开式逼近偏微分方程的解并匹配系数，或者使用傅里叶基逼近的一个显著区别。

### 程序

前几行的 `include` 语句和之前的程序一样，所以不需要额外的注释：

```cpp
#include <deal.II/grid/tria.h>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_out.h>
```

但是，接下来的文件是新的。我们**需要这个头文件来将自由度（DoF）与顶点、线段和单元关联起来**：

```cpp
#include <deal.II/dofs/dof_handler.h>
```

接下来的 `include` 包含了双线性有限元的描述，其中包括每个三角剖分的顶点上有一个自由度，但面上和单元内部没有自由度。（实际上，这个文件包含了拉格朗日（Lagrange）元的一般描述，即二次元、三次元等版本，且不仅适用于 2D，还适用于 1D 和 3D。）

```cpp
#include <deal.II/fe/fe_q.h>
```

以下文件中可以找到若干用于操作自由度的工具，而之后的文件则是调用 `dof_tools.h` 中导入的一个函数所需的：

```cpp
#include <deal.II/dofs/dof_tools.h>
#include <deal.II/fe/mapping_q1.h>
```

我们将使用一个稀疏矩阵来可视化自由度分布在网格上时产生的非零条目模式。该类可以在这里找到：

```cpp
#include <deal.II/lac/sparse_matrix.h>
```

我们还需要使用一个中间稀疏模式结构，它位于以下文件中：

```cpp
#include <deal.II/lac/dynamic_sparsity_pattern.h>
```

我们将使用一个特殊的算法来重新编号自由度。它在这里声明：

```cpp
#include <deal.II/dofs/dof_renumbering.h>
```

最后，像在 `step-1` 中一样，我们将 `deal.II` 命名空间导入全局范围：

```cpp
using namespace dealii;
```

---

* 网格生成

这是在之前 `step-1` 示例程序中生成圆形网格的函数，只是细化步骤更少。唯一的区别是它通过其参数返回生成的网格。

在函数的末尾，我们还将这个网格输出到一个文件中。我们将在可视化自由度位置时使用此信息。要输出网格，我们使用你在 `step-1` 中已经看到的 `GridOut` 类；唯一的不同是我们使用 `gnuplot` 而不是 SVG 格式，因为 `gnuplot` 是我们将用于可视化自由度位置的程序。

```cpp
void make_grid(Triangulation<2> &triangulation)
{
  const Point<2> center(1, 0);
  const double   inner_radius = 0.5, outer_radius = 1.0;
  GridGenerator::hyper_shell(
    triangulation, center, inner_radius, outer_radius, 5);

  for (unsigned int step = 0; step < 3; ++step)
    {
      for (const auto &cell : triangulation.active_cell_iterators())
        for (const auto v : cell->vertex_indices())
          {
            const double distance_from_center =
              center.distance(cell->vertex(v));

            if (std::fabs(distance_from_center - inner_radius) <=
                1e-6 * inner_radius)
              {
                cell->set_refine_flag();
                break;
              }
          }

      triangulation.execute_coarsening_and_refinement();
    }

  std::ofstream mesh_file("mesh.gnuplot");
  GridOut().write_gnuplot(triangulation, mesh_file);
}
```

* 输出自由度的位置

接下来的函数输出自由度的位置，以便后续可视化。每个自由度的位置由 `DoFHandler` 对象知道，因此它是此函数的参数之一。由于我们希望执行两次（一次是初始枚举的自由度集，另一次是重新编号后的自由度集），因此函数还需要一个第二个参数，指定输出文件的名称。

为了学习 `deal.II`，完全理解此函数的具体操作可能并不重要，你可以略过它。但如果你仍然想知道：我们调用了 `DoFTools::map_dofs_to_support_points()` 函数，它返回了一个位置列表。它以映射（map）的形式返回，通过它我们可以查询某个自由度的位置（例如，在 `dof_location_map[42]` 中）。它将此信息存储在 `dof_location_map` 对象中。

然后我们使用 `DoFTools::write_gnuplot_dof_support_point_info()` 函数将该信息写入一个文件，格式是 `gnuplot` 程序可以理解的，用于在结果部分进行可视化。

```cpp
void write_dof_locations(const DoFHandler<2> &dof_handler,
                         const std::string   &filename)
{
  const std::map<types::global_dof_index, Point<2>> dof_location_map =
    DoFTools::map_dofs_to_support_points(MappingQ1<2>(), dof_handler);

  std::ofstream dof_location_file(filename);
  DoFTools::write_gnuplot_dof_support_point_info(dof_location_file,
                                                 dof_location_map);
}
```

![输入图片说明](https://www.dealii.org/current/doxygen/deal.II/images/steps/developer/step-2.dof-locations-1.png)

![输入图片说明](https://www.dealii.org/current/doxygen/deal.II/images/steps/developer/step-2.dof-locations-2.png)


* 这可能有些晦涩，但这段代码的具体作用并不特别重要，你不必花太多时间去理解它。重要的是查看我们得到的输出：

这些图显示了两个重要信息：（i）每个顶点上附加的数值标签——自由度（DoF）索引，以及（ii）左边的初始编号与右边的重新编号结果不同。哪一个更“好”当然是另一个问题（答案取决于我们想对这些自由度做什么）；重要的是，对于相同的网格，我们可以得到许多不同的自由度枚举方式。

至于稀疏模式，我们可以通过在浏览器中打开 .svg 文件来可视化这些模式。下面的图片表示矩阵，每个红色方块表示可能非零的条目。（这个条目实际是否为零取决于所考虑的方程，但矩阵中指示的位置告诉我们在离散化局部方程（即微分方程）时哪些形函数可以耦合，哪些不可以。）

左图中的不同区域，由线条中的折痕和左上角的单点表示，代表了三角剖分的不同细化级别上的自由度。如右图所示，重新编号后，稀疏模式在矩阵的主对角线周围更好地聚集。尽管这可能并不明显，但两幅图中的非零条目数当然是相同的。

---

* 扩展的可能性

就像 `step-1` 一样，你可能想要稍微玩一下这个程序，以便熟悉 `deal.II`。例如，在 `distribute_dofs` 函数中，我们使用的是线性有限元（这是传递给 `FE_Q` 对象的参数“1”）。可以探索使用高阶元素时稀疏模式的变化，例如三次元或五次元（分别使用 3 和 5 作为参数）。你可能还想看看自由度现在的位置——但为了做到这一点，你可能需要使用更少单元的网格，因为现在自由度也位于边和单元内部。

你还可以通过细化网格来探索稀疏模式的变化。你将看到，不仅矩阵的大小发生变化，其带宽（即矩阵中离对角线最远的非零元素的距离）也会变化，不过带宽与矩阵大小的比率通常会缩小，即矩阵更紧密地聚集在对角线附近。

另一个实验的想法是尝试 `DoFRenumbering` 命名空间中其他的重新编号策略，看看它们如何影响稀疏模式。

你还可以通过更改 `distribute_dofs()` 和 `renumber_dofs()` 中的 `print_svg()` 为 `print_gnuplot()`（并将文件后缀改为 .gnuplot 而不是 .svg）来使用 `GNUPLOT`（我们已经在上面使用过了）可视化输出：

```bash
examples/step-2> gnuplot

        G N U P L O T
        Version 3.7 patchlevel 3
        last modified Thu Dec 12 13:00:00 GMT 2002
        System: Linux 2.6.11.4-21.10-default

        Copyright(C) 1986 - 1993, 1998 - 2002
        Thomas Williams, Colin Kelley and many others

        Type `help` to access the on-line reference manual
        The gnuplot FAQ is available from
        http://www.gnuplot.info/gnuplot-faq.html

        Send comments and requests for help to <info-gnuplot@dartmouth.edu>
        Send bugs, suggestions and mods to <bug-gnuplot@dartmouth.edu>

Terminal type set to 'x11'
gnuplot> set style data points
gnuplot> plot "sparsity-pattern-1.gnuplot"
```



```cpp
/* ------------------------------------------------------------------------
 *
 * SPDX-License-Identifier: LGPL-2.1-or-later
 * Copyright (C) 1999 - 2024 by the deal.II authors
 *
 * This file is part of the deal.II library.
 *
 * Part of the source code is dual licensed under Apache-2.0 WITH
 * LLVM-exception OR LGPL-2.1-or-later. Detailed license information
 * governing the source code and code contributions can be found in
 * LICENSE.md and CONTRIBUTING.md at the top level directory of deal.II.
 *
 * ------------------------------------------------------------------------
 */

#include <deal.II/grid/tria.h>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_out.h>

#include <deal.II/dofs/dof_handler.h>

#include <deal.II/fe/fe_q.h>
#include <deal.II/dofs/dof_tools.h>
#include <deal.II/fe/mapping_q1.h>

#include <deal.II/lac/sparse_matrix.h>
#include <deal.II/lac/dynamic_sparsity_pattern.h>

#include <deal.II/dofs/dof_renumbering.h>

#include <fstream>

using namespace dealii;

void make_grid(Triangulation<2> &triangulation)
{
  const Point<2> center(1, 0);
  const double   inner_radius = 0.5, outer_radius = 1.0;
  GridGenerator::hyper_shell(
    triangulation, center, inner_radius, outer_radius, 5);

  for (unsigned int step = 0; step < 3; ++step)
    {
      for (const auto &cell : triangulation.active_cell_iterators())
        for (const auto v : cell->vertex_indices())
          {
            const double distance_from_center =
              center.distance(cell->vertex(v));

            if (std::fabs(distance_from_center - inner_radius) <=
                1e-6 * inner_radius)
              {
                cell->set_refine_flag();
                break;
              }
          }

      triangulation.execute_coarsening_and_refinement();
    }

  std::ofstream mesh_file("mesh.gnuplot");
  GridOut().write_gnuplot(triangulation, mesh_file);
}

void write_dof_locations(const DoFHandler<2> &dof_handler,
                         const std::string   &filename)
{
  const std::map<types::global_dof_index, Point<2>> dof_location_map =
    DoFTools::map_dofs_to_support_points(MappingQ1<2>(), dof_handler);

  std::ofstream dof_location_file(filename);
  DoFTools::write_gnuplot_dof_support_point_info(dof_location_file,
                                                 dof_location_map);
}

void distribute_dofs(DoFHandler<2> &dof_handler)
{
  const FE_Q<2> finite_element(1);
  dof_handler.distribute_dofs(finite_element);

  write_dof_locations(dof_handler, "dof-locations-1.gnuplot");

  DynamicSparsityPattern dynamic_sparsity_pattern(dof_handler.n_dofs(),
                                                  dof_handler.n_dofs());

  DoFTools::make_sparsity_pattern(dof_handler, dynamic_sparsity_pattern);

  SparsityPattern sparsity_pattern;
  sparsity_pattern.copy_from(dynamic_sparsity_pattern);

  std::ofstream out("sparsity-pattern-1.svg");
  sparsity_pattern.print_svg(out);
}

void renumber_dofs(DoFHandler<2> &dof_handler)
{
  DoFRenumbering::Cuthill_McKee(dof_handler);

  write_dof_locations(dof_handler, "dof-locations-2.gnuplot");

  DynamicSparsityPattern dynamic_sparsity_pattern(dof_handler.n_dofs(),
                                                  dof_handler.n_dofs());
  DoFTools::make_sparsity_pattern(dof_handler, dynamic_sparsity_pattern);

  SparsityPattern sparsity_pattern;
  sparsity_pattern.copy_from(dynamic_sparsity_pattern);

  std::ofstream out("sparsity-pattern-2.svg");
  sparsity_pattern.print_svg(out);
}

int main()
{
  Triangulation<2> triangulation;
  make_grid(triangulation);

  DoFHandler<2> dof_handler(triangulation);

  distribute_dofs(dof_handler);
  renumber_dofs(dof_handler);
}
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTI3ODU5MjM5NSwtNTM4NjMwODc5LC05ND
MyMzg4MDIsMTE3OTU5ODk3NiwxNzkxMDYzNzIzXX0=
-->