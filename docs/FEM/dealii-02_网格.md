# dealii-02: 网格

在 deal.II 中，网格由 `Triangulation` 类表示，该类存储网格几何结构并提供操作网格的功能。

## 网格生成

要创建一个网格，首先需要实例化一个 `Triangulation` 对象，并指定问题的维度（2D、3D 等）。比如:
```cpp
Triangulation<2> triangulation;
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE2NTc0MzEzNTUsMTA5MDk0ODI5XX0=
-->