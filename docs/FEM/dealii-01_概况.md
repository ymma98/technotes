# dealii-01: 概况

* [项目官网](https://www.dealii.org/)
* [项目仓库](https://github.com/dealii/dealii)

## 善用手册

[这里](https://www.dealii.org/current/doxygen/deal.II/index.html) 是 dealii 手册的 main page.
main page 下面细分很多栏目:

* [Tutorial](https://www.dealii.org/current/doxygen/deal.II/Tutorial.html): 它通常不会讨论具体函数的参数细节，而是旨在提供事物如何协同工作的**整体概念**
* [Topics](https://www.dealii.org/current/doxygen/deal.II/topics.html): 文档处于**中间层次**，它为某个特定领域的内容提供了概述。例如，当你想了解有哪些有限元类时，可以查阅 Finite element space descriptions 主题。当然，主题也与手册和教程相互链接。如果你点击一个类名，比如 Triangulation，你会在类名下方的顶部找到链接，点击后可以了解该类所属主题的更多信息。
* [Classes](https://www.dealii.org/current/doxygen/deal.II/annotated.html): 当你知道自己想做什么，但忘记了函数的具体名称、参数或者返回值时需要查阅的地方。它提供的是**细致入微**的视角，而不会告诉你某个函数如何在整体框架中发挥作用。
* [FAQ](https://github.com/dealii/dealii/wiki/Frequently-Asked-Questions): 盖了许多关于 deal.II 特定方面的问题，也包括更一般的问题，例如“如何调试科学计算代码？”或“我能否通过训练让自己写出更少错误的代码？”
* [user group](https://groups.google.com/g/dealii): 用户提问, 以及开发者发布声明的地方
	* [废弃的 user group](https://groups.google.com/g/dealii-developers)
* [github issures](https://github.com/dealii/dealii/issues): github 仓库中的 issue 界面
* [publications](https://www.dealii.org/community/publications/): 用到了 dealii 的出版物
* [code gallery](https://dealii.org/developer/doxygen/deal.II/CodeGallery.html): 代码库是教程的延伸，程序的目的是展示如何使用 deal.II 实现应用程序，但不要求这些代码像教程中那样进行详细的注释和文档说明


## 概况

* [这里](https://dealii.org/current/doxygen/deal.II/) 是dealii 的 main page 以及概况

<img src="https://dealii.org/current/doxygen/deal.II/dot_inline_dotgraph_11.png" width="600" height="600"/>



1. **网格生成（Triangulation 类）**

	-   **类：`Triangulation`** `Triangulation` 类负责创建和管理表示计算域的网格。这个网格由单元（二维的三角形，三维的四面体）组成，`Triangulation` 是单元及其低维边界对象的集合。`Triangulation` 存储网格的几何和拓扑属性：单元如何连接及其顶点的位置。在二维中，它只知道单元有 4 条边（线）和 4 个顶点（在三维中，它有 6 个面（四边形）、12 条边和 8 个顶点），其他所有内容都由映射类定义。
	通常通过对所有单元的循环，可能会查询每个单元的所有面，来获取 Triangulation 的属性和数据。因此，网格的大部分信息都隐藏在迭代器后面，即类似指针的结构，可以从一个单元迭代到下一个单元，并且可以获取它当前指向的单元的信息。
	-   **关键作用**：定义几何形状和网格结构，用于在其上求解 PDE。

2. **有限元空间（FiniteElement 类）**

	-   **类：`FiniteElement`** `FiniteElement` 类定义了解将在其上逼近的有限元空间。它指定在每个网格单元上使用的基函数类型，例如 Lagrange 元，以及函数在单元之间是否连续或不连续。
	-   **关键作用**：定义基函数和每个单元上的自由度（DoFs）。

3. **自由度处理器（DoFHandler 类）**

	-   **类：`DoFHandler`** `DoFHandler` 类负责在网格上分配自由度（DoFs）。它将每个网格单元与适当数量的自由度相关联，并连接相邻的单元。与 `Triangulation` 对象类似，大多数对 `DoFHandler` 的操作是通过遍历所有单元并对每个或部分单元执行某些操作。因此，这两个类的接口非常相似：它们允许获取指向第一个和最后一个单元（或面，或线等）的迭代器，并通过这些迭代器提供信息。通过这些迭代器可以获取的信息包括几何和拓扑信息（这些信息实际上可以通过 Triangulation 迭代器获取，因为它们实际上是派生类）以及诸如当前单元上自由度的全局编号等信息。值得注意的是，与 Triangulations 类似，DoFHandler 类并不知道从单位单元到其各自单元的映射。

	-   **关键作用**：管理自由度的分布，使得能够组装系统矩阵和向量。

4. **映射（坐标变换）**

	-   **类：`Mapping`** `Mapping` 类处理**参考单元**（标准的单位单元，例如单位正方形或立方体）和**物理单元**（实际域中的单元）之间的变换。在复杂几何或曲线网格中，映射确保基函数及其导数在物理空间中正确表示。
	    -   **MappingQ1**：用于直边单元的线性映射。
	    -   **MappingQ**：用于曲边单元的高阶映射。
	-   **关键作用**：通过参考单元和物理单元之间的转换，确保在物理域上准确执行积分和计算。

5. **求积（数值积分）**

	-   **类：`Quadrature`** `Quadrature` 类定义了用于计算单元或边界上积分的数值积分点。这些积分点对于组装 PDE 的弱形式的系统是必要的，其中涉及基函数的积分。
	-   **关键作用**：在每个网格单元上提供弱形式的准确数值积分。

6. **边界条件**

	-   **类：`AffineConstraints`** 边界条件是通过 `AffineConstraints` 类来指定的，它负责在解上强制执行 Dirichlet（固定值）或 Neumann（固定通量）边界条件。这些条件在域的特定边界位置应用。
	-   **关键作用**：在解上强制执行边界条件，确保问题设定正确。

7. **系统矩阵和向量的组装**

	-   **类：`SparseMatrix`, `Vector`** 系统方程是通过计算刚度矩阵和载荷向量来组装的。这个过程使用有限元基函数、求积点和自由度来离散化 PDE 的弱形式。
	-   **关键作用**：`SparseMatrix` 保存系统矩阵，`Vector` 保存右端项（RHS）和解向量。

8. **求解器**

	-   **类：`SolverControl` 和 `SolverCG`（共轭梯度求解器）** 在组装系统方程之后，使用求解器来求解线性或非线性系统。`SolverCG`（共轭梯度法）是用于对称正定系统的常用求解器之一。其他求解器如 GMRES 或直接求解器也可用。
	-   **关键作用**：求解系统方程，得到解向量。

9. **预处理**

	-   **类：`PreconditionSSOR`, `PreconditionAMG`** 为了加快迭代求解器的收敛速度，通常使用预处理器。像 SSOR（对称逐次超松弛）或 AMG（代数多重网格）这样的预处理器可以改善系统的条件性，从而更容易求解。
	-   **关键作用**：提高迭代求解器的效率和收敛速度。

10. **后处理和可视化**

	-   **类：`DataOut`** 一旦获得解，通常需要可视化或分析结果。`DataOut` 类允许将解数据导出为兼容可视化工具（如 ParaView 或 Visit）的格式。
	-   **关键作用**：输出解数据用于后处理和可视化。

___

关键组件总结：

-   **Triangulation**：管理网格结构。
-   **FiniteElement**：定义用于近似解的基函数。
-   **DoFHandler**：管理网格上的自由度分配和连接。
-   **Mapping**：处理参考单元与物理单元之间的转换，确保计算准确。
-   **Quadrature**：提供数值积分规则。
-   **AffineConstraints**：强制执行边界条件。
-   **SparseMatrix/Vector**：组装系统方程。
-   **Solver**：求解系统方程。
-   **Preconditioner**：加速求解器收敛。
-   **DataOut**：输出解数据，用于可视化和分析。




___
注: 

**Manifold**: Manifolds 描述了单元的形状，以及更一般地描述了解方程的域的几何形状。它们使用微分几何的语言。


## 安装

把仓库克隆到本地后:

```bash
$ make dir build
$ cd build/
$ cmake -DCMAKE_INSTALL_PREFIX=../install/ \
      -DDEAL_II_WITH_MPI=ON \
      -DDEAL_II_WITH_HDF5=ON \ -DDEAL_II_WITH_TRILINOS=ON -DDEAL_II_WITH_METIS=ON -DDEAL_II_WITH_PARMETIS=ON \
      ../
```











<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE3OTA1NzkyNTEsLTU5Mzg0NDE2Miw1MT
QyMDQyODAsMzYwMDY3NDc3LC0xMTU3MTE1MzI1LC03NjkyMzEw
MTgsODg4NzAwNTAyLC0xODM5NTgzMDUzLDE4NTAxMTYzMDMsLT
E4NjM1ODQ4MjEsMjUwOTc2ODA0LDY1MjQwMzUzOCwxODA1Njg3
MzY4LDU5OTc4MTQ0OCwxMjM0MTM0MzA5LC0yOTAzNTI2NzgsLT
Q3MTQ0MTc0MSwtMTUyMDgyMzUwLC00NjU3NDc0MjMsLTE4MTkw
NjY1MTZdfQ==
-->