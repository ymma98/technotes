# dealii-02: 网格

文档中关于 mesh 的 [Topic](https://www.dealii.org/current/doxygen/deal.II/group__grid.html).

## 简介

在 deal.II 中，网格由 `Triangulation` 类表示，该类存储网格几何结构并提供操作网格的功能。

网格可以被视为单元格的集合；如果网格经过细化（可能是自适应方式），则这个集合会被组织成细化层次的层级结构。除了单元格之外，构成三角剖分的几何对象还包括单元格的面（在三维中还有单元格的边）以及单元格的顶点。需要注意的是 deal.ii 只实现了由线性、四边形和六面体单元格组成的三角剖分，不支持三角形和四面体。

单元格集合由 `Triangulation` 类及其派生类（如 `parallel::distributed::Triangulation` 和 `parallel::shared::Triangulation`）管理。它将相关数据保存在内存中，并提供接口以进行查询。大多数与单元格相关的操作都是通过循环遍历所有单元格来执行的。为此，`Triangulation` 类提供了迭代器的概念：虽然实现方式不同，但它们的行为类似于指向单元格或面的指针，并可以用于查询单元格的几何属性，以及像邻近单元格或单元格的面的信息。

值得注意的是，`Triangulation` 类只存储网格的几何信息（即顶点和单元格的位置）和拓扑信息（即哪些单元格是彼此的邻居等）。它与有限元或定义在网格上的自由度没有直接关系。这些功能是由 `DoFHandler` 类来执行的，`DoFHandler` 获取有限元空间的描述，并根据有限元类的定义在顶点、面或单元格上分配和管理自由度。这样的分离使得可以同时在同一网格上有多个 `DoFHandler` 类工作。


![输入图片说明](https://www.dealii.org/current/doxygen/deal.II/dot_inline_dotgraph_7.png)

## manifold

在 deal.II 中，"流形" 是一个几何概念，用来描述域（即你正在模拟的物理问题所在的空间）的几何形状。简单来说，流形帮助描述空间的形状，特别是当这个空间不是简单的直线、平面或者普通三维立方体时。默认情况下，所有的单元、面和边都被分配到一个叫做 `FlatManifold` 的流形，它表示平直的几何。

在最基本的网格生成中，所有的单元（如三角形或四边形）都可以被认为是由直线段、平面或者体积所组成的。例如，如果你要模拟一个正方体的空间，每个单元就是非常规整的。如果只用平面或直线来描述这些单元，我们不需要考虑“流形”。但是，很多时候，我们要模拟的是曲面或复杂几何，比如球形、圆柱形等——这些几何在细化网格时，需要用到曲线或曲面来描述单元边界，而不是简单的直线。这时就需要引入“流形”来精确描述这些边界的形状。

流形的描述在几个上下文中是必要的：

* 网格细化
每当细化一个单元时，需要在 `Triangulation` 中引入新的顶点。最简单的情况是假设构成 `Triangulation` 的对象是直线段、双线性曲面或三线性体积。此时，新的顶点被简单地放置在旧顶点的中间。这就是 `Triangulation` 类的默认行为，并由 `FlatManifold` 类描述。

另一方面，如果处理的是曲面几何，或需要在某个方向上更密集细化的几何体，这种做法就不合适了。因此，派生自 `Manifold` 基类的类用于描述域的几何。可以通过 `Triangulation::set_manifold()` 函数将从该基类派生的类的对象与 `Triangulation` 对象关联，使用流形ID（详见 `types::manifold_id`）将其附加到单元、面或边上，并使用 `TriaAccessor::set_manifold_id()` 函数为这些几何体指定相应的流形ID。然后，在网格细化过程中，`Triangulation` 将询问流形对象新顶点应放置的位置。已经存在的类可以支持最常见的几何体，例如 `CylindricalManifold` 和 `PolarManifold`，它们分别表示在柱坐标系或极坐标系中描述空间的几何。默认情况下，所有通过 `GridGenerator` 命名空间生成的曲面几何都会自动将正确的流形对象附加到域的曲面部分。

* 积分
使用高阶有限元方法时，通常需要使用边界的曲线近似，而不是直线近似来计算单元项。此类曲线元素的实际实现发生在 `Mapping` 类中，然而，它从此处描述的类获取域边界的信息。当然，当积分边界项（例如非齐次 Neumann 边界条件）时也是如此。

* 非零余维的域
在某些情况下，`Triangulation` 被嵌入到高维空间中，即当 `Triangulation` 类的第二个模板参数显式指定并大于第一个参数时（参见示例 step-34），流形描述对象用来描述不仅是域的边界，还包括域本身的几何，尤其是当域是实际为曲线的流形时。在这些情况下，可以使用 `Triangulation::set_manifold()` 函数来指示在细化曲线或使用高阶映射计算积分时应使用哪个流形描述。


在 deal.II 中，流形被视为一组点，并带有点之间的距离概念。新点通常通过提供流形上的局部坐标系，识别局部坐标系中的现有点（使用局部映射将它们拉回到局部坐标系以获得它们的局部坐标），然后通过现有点的加权和在局部坐标系中找到新点，并将该点转换回真实空间（使用局部映射将其推到前方）。实现这一机制的主要类是 `ChartManifold` 类，这也是用户在处理复杂几何时最有可能重载的类。

尽管这个过程在大多数感兴趣的情况下并不简单，但对于大多数简单几何，如圆柱、球体或壳体，deal.II 提供了合理的实现。更复杂的例子可以参见 step-53 和 step-54 中展示的技术。


![输入图片说明](https://www.dealii.org/current/doxygen/deal.II/dot_inline_dotgraph_8.png)


## 网格生成

生成网格有三种方式：

1.  通过 `GridGenerator` 类生成；`GridGenerator` 类提供了一些函数，可以自动生成最简单和最常见的几何形状。例如，可以使用该类中的函数生成矩形（或立方体）几何体、圆形、球体或圆柱体。
2.  从文件中读取；使用 `GridIn` 类从输入文件中读取网格，该类支持多种不同的格式 (step-5)。
3.  手动创建。通过构建描述三角剖分（triangulation）的顶点和单元格的数据结构来创建网格。使用这种方法构建的数据结构可以传递给 `Triangulation` 类的 `create_triangulation()` 函数 (step-14)。


## 网格信息

`Triangulation` 定义了一组迭代器，允许用户遍历整个网格，即构成网格的单元、面、边等，或者是网格的一部分。这些迭代器在某种意义上都继承自 `TriaIterator` 类。

基本上，`TriaIterator` 的模板签名为：
```cpp
TriaIterator<Accessor>
```
概念上，这种类型类似于指向由 `Accessor` 类表示的对象的指针。通常你不会直接使用实际的类名，而是使用网格类提供的 `typedef`，例如 `typename Triangulation::cell_iterator`。

在 deal.II 中，三角剖分使用“规则树的森林 (forest of regular trees)”的计算概念来存储数据。可以这样理解：将粗网格的单元视为树根；然后，如果这些粗网格单元之一被细化，它将拥有 $2^{dim}$ 个子单元，反过来，这些子单元也可以（但不一定会）拥有 $2^{dim}$ 个自己的子单元，依此类推。这意味着，每个粗网格的单元可以看作是一棵二叉树的根节点（在 1D 中），或四叉树（在 2D 中），或八叉树（在 3D 中）。这些由粗网格单元生成的树集合就构成了完全描述三角剖分的森林，包括所有的活跃单元和非活跃单元。特别地，活跃单元 (**active cells**, 实际参与计算) 是那些没有后代的树的终端节点，即未进一步细化的单元。相应地，非活跃单元 (**inactive cells**, 不能直接参与计算) 对应于有后代的节点，即已进一步细化的单元。

一个 `Triangulation` 包含线段（每个可能有 2 个子节点）、四边形（每个可能有 4 个子节点）和六面体（每个可能有 8 个子节点）的森林。根据维度的不同，这些对象也可以被称为单元或面。总之，一个节点对应于一个线段。


* 遍历对象

所有相同类型的迭代器，并且遍历相同类型几何对象的迭代器，都会以相同的顺序遍历网格。以下是一个代码示例：

```cpp
Triangulation<dim> tria;
DoFHandler<dim>    dof1(tria);
DoFHandler<dim>    dof2(tria);
...
typename Triangulation<dim>::cell_iterator ti  = tria.begin();
typename DoFHandler<dim>::cell_iterator   di1 = dof1.begin();
typename DoFHandler<dim>::cell_iterator   di2 = dof2.begin();
...
while (ti != tria.end())
{
  // 执行某些操作
  ++ti;
  ++di1;
  ++di2;
}
```

在这里，所有迭代器将始终指向相同的网格单元，尽管 `DoFHandler` 和 `Triangulation` 是非常不同的类，甚至即使 `DoFHandler` 处理不同的有限元：它们都以相同的顺序访问单元，差异仅在于 `Accessor` (分别为 `Triangulation<dim>::cell_iterator` 和 `DoFHandler<dim>::cell_iterator`)。如前所述，迭代器遍历对象森林的顺序实际上是明确定义的，但应用程序不应假设任何特定的顺序，而应将其视为库的实现细节。

与上述示例对应，以下代码片段中，迭代器遍历活跃对象的顺序对于所有迭代器都是相同的，区别在于这里我们只考虑活跃单元：

```cpp
typename Triangulation<dim>::active_cell_iterator ti  = tria.begin_active();
typename DoFHandler<dim>::active_cell_iterator   di1 = dof1.begin_active();
typename DoFHandler<dim>::active_cell_iterator   di2 = dof2.begin_active();
...
while (ti != tria.end())
{
  // 执行某些操作
  ++ti;
  ++di1;
  ++di2;
}
```

在这个示例中，所有活跃迭代器按照相同的顺序遍历活跃单元，这确保了即使在处理不同的 `DoFHandler` 或不同的有限元时，迭代器也会同步指向相同的活跃单元。这对于确保并行处理或同步操作非常有用。

* Accessor


迭代器类似于指针：它们可以被递增或递减，它们指向 `Accessor`。对于指针，它们指向一个存储某些数据的实际对象。而在 deal.II 中，迭代器解引用时得到的 `Accessor` 并不是一个指向实际对象的引用，而是返回一个能够获取表示单元格数据的对象。通常，这个对象不会自己存储单元格的顶点位置或者其邻居是什么。但它知道如何从 `Triangulation` 类中设置的数组、表格和列表中获取这些信息，从而描述网格。

访问描述单元格的数据总是通过 `Accessor` 进行的，也就是说，表达式 `i->xxx()`  (`ptr->value` 相当于 `(*ptr).value`，首先解引用指针或迭代器 `ptr`，获得 `obj`，然后通过 `.` 来访问 `obj` 的 `value` 成员) 能够访问该 `Accessor` 的所有属性。你可以从迭代器查询的属性示例如下：

```cpp
cell->vertex(1);
line->child(0);
hex->face(3);
cell->at_boundary();
face->boundary_id();
```

由于解引用迭代器返回的是 `Accessor` 对象，因此这些调用实际上是 `Accessor::vertex()`、`Accessor::child()` 等成员函数。这些函数会从存储这些数据的各种数据结构中找出相关信息。对于 deal.II 中的应用程序作者来说，如何实现这些功能以及使用了哪些数据结构并不需要关心。特别地，通过隐藏实际的数据结构，我们可以以一种高效的方式存储数据，而不一定是以一种容易让应用程序开发者理解或访问的方式存储数据。

* Accessor 类型



根据要访问的数据类型不同，deal.II 中有不同种类的 `Accessor` 类：

- **`TriaAccessor`** 类提供有关单元、面、线、四边形和六面体（这些几何对象构成了三角剖分）的几何属性的数据，以及它们的父子关系。
- **`CellAccessor`** 类继承自 `TriaAccessor` 类，适用于具有完整维度的对象（即单元，而不是例如限定单元的线段）。在这种情况下，可以通过 `Accessor` 获取关于网格拓扑连接的额外信息，例如请求指向单元邻居的迭代器。
- **`DoFAccessor`** 类允许访问与单元、面等关联的自由度（degrees of freedom）相关的信息。需要注意的是，`DoFAccessor` 类继承自 `TriaAccessor` 或 `CellAccessor`（取决于 `DoFAccessor` 是否指向完整维度的对象）。此外，`DoFAccessor` 类有两种形式：一种访问单元级别的自由度，另一种访问活跃单元的自由度。
- **`DoFCellAccessor`** 类与 `DoFAccessor` 的关系类似于 `CellAccessor` 与 `TriaAccessor` 的关系。

除了查看这些类的成员文档外，你通常不需要直接处理这些实际的类名。通常你可以使用网格类 `Triangulation` 和 `DoFHandler` 提供的 `typedef`，以及用于生成这些对象的函数：

| 类            | `cell_iterator` 类型                         | 函数调用                        |
| ------------- | -------------------------------------------- | ------------------------------- |
| `Triangulation` | `typename Triangulation::cell_iterator`     | `Triangulation::begin()`         |
| `DoFHandler`   | `typename DoFHandler::cell_iterator`         | `DoFHandler::begin()`            |

`Triangulation` 类支持通过 `typename Triangulation::face_iterator` 遍历单元的面，该类型由 `Triangulation::begin_face()` 返回。

活跃迭代器

| 类            | `cell_iterator` 类型                         | 函数调用                        |
| ------------- | -------------------------------------------- | ------------------------------- |
| `Triangulation` | `typename Triangulation::active_cell_iterator` | `Triangulation::begin_active()` |
| `DoFHandler`   | `typename DoFHandler::active_cell_iterator`    | `DoFHandler::begin_active()`    |

`Triangulation` 类还支持通过 `typename Triangulation::active_face_iterator` 遍历活跃单元的面，该类型由 `Triangulation::begin_active_face()` 返回。

除了这些作用于单元和面的类型和函数调用（这些逻辑概念取决于维度：在 2D 中，单元是四边形，而在 3D 中是六面体），还有类似 `begin_active_quad()` 或 `end_quad()` 的类型和函数调用，它们作用于维度无关的几何对象：线、四边形和六面体 (`Quad` 是一种**维度泛化**的概念，它允许在不同维度下表示不同的对象。在 `deal.II` 中，虽然 `Quad` 一词在 2D 中是指四边形，但在 1D 中会指线段 `Line` ，在 3D 中会指六面体的面)。这些调用也有活跃和非活跃的形式。





## 网格输出

如果输出文件中包含的是基于该网格的模拟结果，则通过 `DataOut` 类实现。另一方面，如果只想将网格的几何和拓扑写入文件，则可以使用 `GridOut` 类来实现。


## 工具类  

`GridTools` 类提供了一组作用于网格的函数。例如，包括移动节点、拉伸或旋转整个三角剖分、计算域的直径，或将其划分为大小大致相等的块以便于并行计算。

`GridRefinement` 类实现了一些基于其成员函数给出的细化指标的网格细化算法。

## 例程

产生网格, 需要 `Triangulation` 类定义网格和存储信息, 然后通过 `GridGenerator` 产生所需形状的网格。
```cpp
#include <deal.II/grid/tria.h>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_out.h>
 
#include <iostream>
#include <fstream>
#include <cmath>
 
using namespace dealii;
 
 
void first_grid()
{
  Triangulation<2> triangulation;
 
  GridGenerator::hyper_cube(triangulation);
  triangulation.refine_global(4);
 
  std::ofstream out("grid-1.svg");
  GridOut       grid_out;
  grid_out.write_svg(triangulation, out);
  std::cout << "Grid written to grid-1.svg" << std::endl;
}
 
void second_grid()
{
  Triangulation<2> triangulation;
 
  const Point<2> center(1, 0);
  const double   inner_radius = 0.5, outer_radius = 1.0;
  GridGenerator::hyper_shell(
    triangulation, center, inner_radius, outer_radius, 10);
  for (unsigned int step = 0; step < 5; ++step)
    {
      for (const auto &cell : triangulation.active_cell_iterators())
        {
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
        }
 
      triangulation.execute_coarsening_and_refinement();
    }
 
 
  std::ofstream out("grid-2.svg");
  GridOut       grid_out;
  grid_out.write_svg(triangulation, out);
 
  std::cout << "Grid written to grid-2.svg" << std::endl;
}
 
 
 
 
int main()
{
  first_grid();
  second_grid();
}
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk0Nzg3NTc1MSwtNjExOTMwMTEwLDE5Mj
kyNjMyMTgsODcxMzAzNjUsNzU5NTU0NTE0LDQ0NjAzODIyNywt
ODgwMzIzMzY2LC0xODQzNDA1MzUyLDE0MjkxNDExMzgsLTE2Mj
I3MTk0NDIsLTYxMjM1OTM1LDc4Njk4MzQxNyw3MDM4Mzk5ODks
NTg1OTIwMjA4LDg2MDYzOTIwLDY1MDczNzUwMSwxOTAzMjI1NT
g0LC05NDE0NTE2MjQsLTQwMzk3MzgsMTA5MDk0ODI5XX0=
-->