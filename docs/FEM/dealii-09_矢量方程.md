# step-20, 矢量方程

* step-22 (待看)

## 问题描述

$$
-\nabla \cdot K(x) \nabla p = f \quad \text{in } \Omega,
$$

$$
p = g \quad \text{on } \partial \Omega.
$$



如果假设 $\mathbf{u} = -K \nabla p$，有：

$$
K^{-1} \mathbf{u} + \nabla p = 0 \quad \text{in } \Omega,
$$

$$
-\text{div } \mathbf{u} = -f \quad \text{in } \Omega,
$$

$$
p = g \quad \text{on} \quad \partial \Omega.
$$


这个问题的弱形式是通过将两个方程分别乘以测试函数并对某些项进行分部积分得到的：

$$
A(\{\mathbf{u}, p\}, \{\mathbf{v}, q\}) = F(\{\mathbf{v}, q\}),
$$

其中

$$
A(\{\mathbf{u}, p\}, \{\mathbf{v}, q\}) = (\mathbf{v}, K^{-1} \mathbf{u})_\Omega - (\text{div } \mathbf{v}, p)_\Omega - (q, \text{div } \mathbf{u})_\Omega
$$

$$
F(\{\mathbf{v}, q\}) = -(g, \mathbf{v} \cdot \mathbf{n})_{\partial \Omega} - (f, q)_\Omega
$$


这里，$\mathbf{n}$ 是边界上的外法向量。注意，在这种形式中，原问题的狄利克雷边界值被包含在弱形式中。

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE5ODQ0NDMxOTMsLTE3Mjk2OTAzNSwxOT
YyNDUzNDQxLDc3Mjc4NzIwNSwxNzQwNDA5MzU5XX0=
-->