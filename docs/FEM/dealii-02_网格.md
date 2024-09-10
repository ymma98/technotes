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

在 deal.II 中，三角剖分使用“规则树的森林 (forest of regular trees)”的计算概念来存储数据。可以这样理解：将粗网格的单元视为树根；然后，如果这些粗网格单元之一被细化，它将拥有 $2^{dim}$ 个子单元，反过来，这些子单元也可以（但不一定会）拥有 2dim2^{\text{dim}}2dim 个自己的子单元，依此类推。这意味着，每个粗网格的单元可以看作是一棵二叉树的根节点（在 1D 中），或四叉树（在 2D 中），或八叉树（在 3D 中）。这些由粗网格单元生成的树集合就构成了完全描述三角剖分的森林，包括所有的活跃单元和非活跃单元。特别地，活跃单元是那些没有后代的树的终端节点，即未进一步细化的单元。相应地，非活跃单元对应于有后代的节点，即已进一步细化的单元。

## 网格输出

如果输出文件中包含的是基于该网格的模拟结果，则通过 `DataOut` 类实现。另一方面，如果只想将网格的几何和拓扑写入文件，则可以使用 `GridOut` 类来实现。


## 工具类  

`GridTools` 类提供了一组作用于网格的函数。例如，包括移动节点、拉伸或旋转整个三角剖分、计算域的直径，或将其划分为大小大致相等的块以便于并行计算。

`GridRefinement` 类实现了一些基于其成员函数给出的细化指标的网格细化算法。
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQ4NjY4NDAyNCw3MDM4Mzk5ODksNTg1OT
IwMjA4LDg2MDYzOTIwLDY1MDczNzUwMSwxOTAzMjI1NTg0LC05
NDE0NTE2MjQsLTQwMzk3MzgsMTA5MDk0ODI5XX0=
-->