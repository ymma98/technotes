# dealii-02: 网格

在 deal.II 中，网格由 `Triangulation` 类表示，该类存储网格几何结构并提供操作网格的功能。

## 网格生成

要创建一个网格，首先需要实例化一个 `Triangulation` 对象，并指定问题的维度（2D、3D 等）。比如:
```cpp
Triangulation<2> triangulation;
```
网格信息:
使用 `Triangulation` 类的成员函数可以获取网格的基本信息，例如活动单元的数量、总单元的数量、顶点的数量等。以下是一些常用的函数：

-   **`triangulation.n_active_cells()`**: 返回活动（未细分的）单元的数量。
-   **`triangulation.n_cells()`**: 返回网格中总单元的数量。
-   **`triangulation.n_vertices()`**: 返回网格中的顶点总数。
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQ4MzM1NDkxMCwxMDkwOTQ4MjldfQ==
-->