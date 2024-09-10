# dealii-02: 网格

文档中关于 mesh 的 [Topic](https://www.dealii.org/current/doxygen/deal.II/group__grid.html).

在 deal.II 中，网格由 `Triangulation` 类表示，该类存储网格几何结构并提供操作网格的功能。

网格可以被视为单元格的集合；如果网格经过细化（可能是自适应方式），则这个集合会被组织成细化层次的层级结构。除了单元格之外，构成三角剖分的几何对象还包括单元格的面（在三维中还有单元格的边）以及单元格的顶点。需要注意的是，我们在这里稍微滥用了“triangulation”这个词，因为deal.II只实现了由线性、四边形和六面体单元格组成的三角剖分；不支持三角形和四面体。

这个单元格集合由 `Triangulation` 类及其派生类（如 `parallel::distributed::Triangulation` 和 `parallel::shared::Triangulation`）管理。它将相关数据保存在内存中，并提供接口以进行查询。大多数与单元格相关的操作都是通过循环遍历所有单元格来执行的。为此，`Triangulation` 类提供了迭代器的概念（详见“Iterators on mesh-like containers”）：虽然实现方式不同，但它们的行为类似于指向单元格或面的指针，并可以用于查询单元格的几何属性，以及像邻近单元格或单元格的面的信息。

值得注意的是，`Triangulation` 类只存储网格的几何信息（即顶点和单元格的位置）和拓扑信息（即哪些单元格是彼此的邻居等）。它与有限元或定义在网格上的自由度没有直接关系。这些功能是由 `DoFHandler` 类（详见“Degrees of Freedom”主题）来执行的，`DoFHandler` 获取有限元空间的描述，并根据有限元类的定义在顶点、面或单元格上分配和管理自由度。这样的分离使得可以同时在同一网格上有多个 `DoFHandler` 类工作。

从整体上看，deal.II中的三角剖分与库的其他部分紧密交互：




* 网格生成
* 网格细分
* 网格信息
<!--stackedit_data:
eyJoaXN0b3J5IjpbNjUwNzM3NTAxLDE5MDMyMjU1ODQsLTk0MT
Q1MTYyNCwtNDAzOTczOCwxMDkwOTQ4MjldfQ==
-->