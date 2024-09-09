# dealii-02: 网格

在 deal.II 中，网格由 `Triangulation` 类表示，该类存储网格几何结构并提供操作网格的功能。

## 网格生成

要创建一个网格，首先需要实例化一个 `Triangulation` 对象，并指定问题的维度（2D、3D 等）。比如:
```cpp
Triangulation<2> triangulation;
```
网格信息:

```cpp
std::cout << "活动单元 (未被细分) 的数量: " << triangulation.n_active_cells() << std::endl;
std::cout << "总单元数量: " << triangulation.n_cells() << std::endl;
std::cout << "总顶点数量: " << triangulation.n_vertices() << std::endl;

// 遍历单元
for (const auto &cell : triangulation.active_cell_iterators())
{
    std::cout << "单元索引: " << cell->index() << std::endl;
    std::cout << "顶点数量: " << cell->n_vertices() << std::endl;
    std::cout << "材料 ID: " << cell->material_id() << std::endl;
    std::cout << "细化级别: " << cell->level() << std::endl;
    std::cout << "单元中心: " << cell->center() << std::endl;
}

```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTQwMzk3MzgsMTA5MDk0ODI5XX0=
-->