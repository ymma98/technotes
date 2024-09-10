# dealii-02: 网格

文档中关于 mesh 的 [Topic](https://www.dealii.org/current/doxygen/deal.II/group__grid.html).

## 简介

在 deal.II 中，网格由 `Triangulation` 类表示，该类存储网格几何结构并提供操作网格的功能。

网格可以被视为单元格的集合；如果网格经过细化（可能是自适应方式），则这个集合会被组织成细化层次的层级结构。除了单元格之外，构成三角剖分的几何对象还包括单元格的面（在三维中还有单元格的边）以及单元格的顶点。需要注意的是 deal.ii 只实现了由线性、四边形和六面体单元格组成的三角剖分，不支持三角形和四面体。

单元格集合由 `Triangulation` 类及其派生类（如 `parallel::distributed::Triangulation` 和 `parallel::shared::Triangulation`）管理。它将相关数据保存在内存中，并提供接口以进行查询。大多数与单元格相关的操作都是通过循环遍历所有单元格来执行的。为此，`Triangulation` 类提供了迭代器的概念：虽然实现方式不同，但它们的行为类似于指向单元格或面的指针，并可以用于查询单元格的几何属性，以及像邻近单元格或单元格的面的信息。

值得注意的是，`Triangulation` 类只存储网格的几何信息（即顶点和单元格的位置）和拓扑信息（即哪些单元格是彼此的邻居等）。它与有限元或定义在网格上的自由度没有直接关系。这些功能是由 `DoFHandler` 类来执行的，`DoFHandler` 获取有限元空间的描述，并根据有限元类的定义在顶点、面或单元格上分配和管理自由度。这样的分离使得可以同时在同一网格上有多个 `DoFHandler` 类工作。


![输入图片说明](https://www.dealii.org/current/doxygen/deal.II/dot_inline_dotgraph_7.png)





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
- **`DoFAccessor`** 类允许访问与单元、面等关联的自由度（degrees of freedom）相关的信息。需要注意的是，`DoFAccessor` 类继承自 `TriaAccessor` 或 `CellAccessor`（取决于 `DoFAccessor` 是否指向完整维度的对象），因此可以提供其基类的超集信息。此外，`DoFAccessor` 类有两种形式：一种访问单元级别的自由度，另一种访问活跃单元的自由度。
- **`DoFCellAccessor`** 类与 `DoFAccessor` 的关系类似于 `CellAccessor` 与 `TriaAccessor` 的关系。

除了查看这些类的成员文档外，你通常不需要直接处理这些实际的类名。通常你可以使用网格类 `Triangulation` 和 `DoFHandler` 提供的 `typedef`，以及用于生成这些对象的函数：

| 类            | `cell_iterator` 类型                         | 函数调用                        |
| ------------- | -------------------------------------------- | ------------------------------- |
| `Triangulation` | `typename Triangulation::cell_iterator`     | `Triangulation::begin()`         |
| `DoFHandler`   | `typename DoFHandler::cell_iterator`         | `DoFHandler::begin()`            |

`Triangulation` 类支持通过 `typename Triangulation::face_iterator` 遍历单元的面，该类型由 `Triangulation::begin_face()` 返回。

### 活跃迭代器的特性：

| 类            | `cell_iterator` 类型                         | 函数调用                        |
| ------------- | -------------------------------------------- | ------------------------------- |
| `Triangulation` | `typename Triangulation::active_cell_iterator` | `Triangulation::begin_active()` |
| `DoFHandler`   | `typename DoFHandler::active_cell_iterator`    | `DoFHandler::begin_active()`    |

`Triangulation` 类还支持通过 `typename Triangulation::active_face_iterator` 遍历活跃单元的面，该类型由 `Triangulation::begin_active_face()` 返回。

除了这些作用于单元和面的类型和函数调用（这些逻辑概念取决于维度：在 2D 中，单元是四边形，而在 3D 中是六面体），还有类似 `begin_active_quad()` 或 `end_quad()` 的类型和函数调用，它们作用于维度无关的几何对象：线、四边形和六面体。这些调用也有活跃和非活跃的形式。

所有这些类型定义（`typedef`）在以下内部类中定义：

- 对于 `Triangulation` 迭代器，定义在 `internal::TriangulationImplementation::Iterators<1, spacedim>`、`internal::TriangulationImplementation::Iterators<2, spacedim>` 和 `internal::TriangulationImplementation::Iterators<3, spacedim>`。
- 对于 `DoFHandler` 迭代器，定义在 `internal::DoFHandlerImplementation::Iterators<1, spacedim, lda>`、`internal::DoFHandlerImplementation::Iterators<2, spacedim, lda>` 和 `internal::DoFHandlerImplementation::Iterators<3, spacedim, lda>`。

这些定义确保了你可以通过 `Triangulation` 和 `DoFHandler` 类的接口方便地操作网格中的单元、面和自由度。





## 网格输出

如果输出文件中包含的是基于该网格的模拟结果，则通过 `DataOut` 类实现。另一方面，如果只想将网格的几何和拓扑写入文件，则可以使用 `GridOut` 类来实现。


## 工具类  

`GridTools` 类提供了一组作用于网格的函数。例如，包括移动节点、拉伸或旋转整个三角剖分、计算域的直径，或将其划分为大小大致相等的块以便于并行计算。

`GridRefinement` 类实现了一些基于其成员函数给出的细化指标的网格细化算法。
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTg4MDMyMzM2NiwtMTg0MzQwNTM1MiwxND
I5MTQxMTM4LC0xNjIyNzE5NDQyLC02MTIzNTkzNSw3ODY5ODM0
MTcsNzAzODM5OTg5LDU4NTkyMDIwOCw4NjA2MzkyMCw2NTA3Mz
c1MDEsMTkwMzIyNTU4NCwtOTQxNDUxNjI0LC00MDM5NzM4LDEw
OTA5NDgyOV19
-->