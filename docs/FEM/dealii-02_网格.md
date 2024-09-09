# dealii-02: 网格

在 deal.II 中，网格由 `Triangulation` 类表示，该类存储网格几何结构并提供操作网格的功能。

## 网格生成

要创建一个网格，首先需要实例化一个 `Triangulation` 对象，并指定问题的维度（2D、3D 等）。比如:
```cpp
Triangulation<2> triangulation;
```
deal.II 提供了多种内置函数，可以用来生成常见几何形状的网格。例如，`GridGenerator` 命名空间包含了生成网格的函数，适用于立方体、圆、圆柱等几何形状。比如:
```cpp
Triangulation<2> triangulation;

// 创建一个二维正方形网格，角点位于 (0, 0) 和 (1, 1)
GridGenerator::hyper_cube(triangulation, 0, 1);

// 全局细化网格两次（每个单元被划分成多个小单元）
triangulation.refine_global(2);
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMjAzMDYyNzE5MCwxMDkwOTQ4MjldfQ==
-->