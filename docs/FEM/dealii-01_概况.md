# dealii-01: 概况

* [这里](https://dealii.org/current/doxygen/deal.II/) 是dealii 的 main page 以及概况
* [这里](https://dealii.org/current/doxygen/deal.II/Tutorial.html) 是 dealii 的 tutorial programs.

## 概况

**Triangulation**: Triangulations 是单元及其低维边界对象的集合。单元是在“从参考单元到真实单元的映射”部分中通过适当的映射从参考超立方体 [0,1]^dim 生成的图像。

Triangulation 存储网格的几何和拓扑属性：单元如何连接及其顶点的位置。Triangulation 对你可能想在此网格上使用的有限元一无所知，甚至不知道单元的形状：在二维中，它只知道单元有 4 条边（线）和 4 个顶点（在三维中，它有 6 个面（四边形）、12 条边和 8 个顶点），其他所有内容都由映射类定义。

通常通过对所有单元的循环，可能会查询每个单元的所有面，来获取 Triangulation 的属性和数据。因此，网格的大部分信息都隐藏在迭代器后面，即类似指针的结构，可以从一个单元迭代到下一个单元，并且可以获取它当前指向的单元的信息。


**Manifold**: Manifolds 描述了单元的形状，以及更一般地描述了解方程的域的几何形状。它们使用微分几何的语言。更多信息请参见 **Manifold description for triangulations**。

**Finite Element**: Finite element 类描述了定义在单位单元上的有限元空间的属性。例如，这包括位于顶点、边上或单元内部的自由度数量。除此之外，finite element 类还必须提供在单位单元上个别形函数在某些点处的值和梯度。

finite element 类的文档位于 **Finite elements** 主题中。

**Quadrature**: 与有限元一样，quadrature 对象定义在单位单元上。它们只描述了单位单元上 quadrature 点的位置及其权重。

特定 quadrature 公式的类文档位于 **Quadrature formulas** 主题中。

**DoFHandler**: DoFHandler 对象是 Triangulations 和 Finite elements 的汇合点：有限元类描述了每个顶点、边或单元需要的自由度数量，而 DoFHandler 类为每个顶点、边或 Triangulation 的单元分配这些空间，并为它们提供全局编号。

另一种视角是：网格和有限元描述了我们寻求的离散解所处的有限维空间 Vh 的抽象属性，DoFHandler 类枚举了该空间的一个具体基，以便我们可以将离散解表示为 uh(x)=∑jUjφi(x)，其中 Uj 是有序的系数集。

与 Triangulation 对象类似，大多数对 DoFHandlers 的操作是通过遍历所有单元并对每个或部分单元执行某些操作。因此，这两个类的接口非常相似：它们允许获取指向第一个和最后一个单元（或面，或线等）的迭代器，并通过这些迭代器提供信息。通过这些迭代器可以获取的信息包括几何和拓扑信息（这些信息实际上可以通过 Triangulation 迭代器获取，因为它们实际上是派生类）以及诸如当前单元上自由度的全局编号等信息。迭代器还可以从存储与 Triangulation 相关的所有自由度值的数据向量中提取当前单元自由度对应的值。

值得注意的是，与 Triangulations 类似，DoFHandler 类并不知道从单位单元到其各自单元的映射。它也不了解与其管理的自由度对应的形函数：它只知道，例如，每个顶点有 2 个自由度，每个单元内部有 4 个自由度。除了它们的存在这一点外，其具体细节与 DoFHandler 类无关。

DoFHandler 类及其关联类在 **Degrees of Freedom** 主题中进行了描述。此外，还有一些专门的版本可以处理多层次和 hp 离散化。它们分别在 **Multilevel support** 和 **hp-finite element support** 主题中描述。有限元方法经常意味着对自由度施加约束，例如对于悬挂节点或应用边界条件的节点；处理此类约束的内容在 **Constraints on degrees of freedom** 主题中进行了描述。

**Mapping**: 有限元程序的下一步是需要在 Triangulation 的每个单元上计算矩阵和右手边条目或其他量，使用有限元的形函数和由 quadrature 规则定义的 quadrature 点。为此，需要将形函数、quadrature 点和 quadrature 权重从单位单元映射到 Triangulation 的每个单元上。虽然这不是直接由 Mapping 类完成的，但由其派生类提供支持：它们描述了如何将点从单位空间映射到实际空间并返回，同时提供此导数的梯度和雅可比行列式。

这些类都在 **Mappings between reference and real cell** 主题中进行了描述。

**FEValues**: 下一步是实际上取一个有限元并在映射到真实单元时的 quadrature 公式定义的点上评估其形函数及其梯度。这是 **FEValues** 类及其兄弟类的领域：从某种意义上说，它们提供了有限元函数空间的逐点视图。

这似乎有些限制：在数学分析中，我们总是用涉及有限元形函数的单元或单元面的积分来编写公式。因此，人们可能认为有必要将有限元空间描述为连续空间。然而，在实际中，这并不是必要的：所有的积分在实际计算中都被 quadrature 公式的近似值所取代，因此实际上唯一必要的能力是在域内的有限数量点处评估形函数。**FEValues** 类提供的正是这些信息：给定有限元、quadrature 和映射对象，它们计算了将连续函数空间（相对于离散的，而不是相对于不连续的）限制为有限数量点的结果。

有许多对象可以做到这一点：**FEValues** 用于在单元上评估，**FEFaceValues** 用于在单元的面上评估，**FESubfaceValues** 用于在单元面的一部分上评估。所有这些类都在 **Finite element access/FEValues classes** 主题中进行了描述。

**Linear Systems**: 如果知道如何使用 FEValues 及其兄弟类在各个单元上评估形函数的值和梯度，并且知道如何使用 DoFHandler 迭代器获取单元上的自由度全局编号，那么下一步就是使用问题的双线性形式来组装线性系统的矩阵（和右手边）。然后我们将从这个线性系统中确定我们问题的解。

为此，我们需要有用于存储和管理矩阵和向量条目的类。deal.II 提供了大量此类类以及与其他提供类似功能的软件包的接口。相关文档可以在 **Linear algebra classes** 主题中找到。

**Linear Solvers**: 为了确定有限维线性方程组的解，需要线性求解器。在有限元应用中，它们通常是迭代的，但有时也可能希望使用直接或稀疏直接求解器。deal.II 提供了相当多的此类求解器。它们在 **Linear solver classes** 主题中进行了描述。

**Output**: 最后，一旦在给定的 Triangulation 上获得了有限元问题的解，通常会希望使用可视化程序对其进行后处理。该库本身不进行可视化处理，但生成多种图形格式的输出文件，供广泛使用的可视化工具理解。

生成这些输出文件的类的描述见 **Graphical output** 主题。

此外，deal.II 还有一些类组，超出了此处列出的内容。它们涉及上述层次结构的更精细的概念，或者涉及诸如输入和输出处理等与有限元程序并不完全相关的侧面问题，但也在其中出现。这些类都列在从此页面顶部菜单栏可访问的 **Classes and Namespaces** 视图中，并且也被分组到各自的主题中（见此页面顶部的 **Topics** 标签）。

我们为希望将应用程序文档直接链接到 deal.II 在线文档的用户提供了 Doxygen 标签文件。标签文件位于 deal.tag。对于每个 deal.II 版本，它位于 Doxygen 参考文档的上一级目录中。要使用标签文件，你需要将其下载到 Doxygen 能找到的位置。之后，在你的 Doxygen 选项文件中找到 `TAGFILES` 键并写入

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE4MTkwNjY1MTYsMTE2NDEwODQxMF19
-->