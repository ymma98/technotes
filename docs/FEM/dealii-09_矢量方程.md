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
K^{-1} \mathbf{u} + \nabla p = 0 \quad \text{在 } \Omega,
$$
$$
-\text{div } \mathbf{u} = -f \quad \text{在 } \Omega,
$$
$$
p = g \quad \text{在 } \partial \Omega.
$$

这里，将定义速度 $\mathbf{u}$ 的方程乘以 $K^{-1}$ 是为了使方程组对称化：一个方程包含梯度，另一个包含负散度，而这两个方程是彼此的伴随，从而在假设 $K$ 是对称张量的前提下，得到一个对称的双线性形式，以及一个对称的系统矩阵。

这个问题的弱形式是通过将两个方程分别乘以测试函数并对某些项进行分部积分得到的：

$$
A(\{\mathbf{u}, p\}, \{\mathbf{v}, q\}) = F(\{\mathbf{v}, q\}),
$$

其中

$$
A(\{\mathbf{u}, p\}, \{\mathbf{v}, q\}) = (\mathbf{v}, K^{-1} \mathbf{u})_\Omega - (q, \text{div } \mathbf{u})_\Omega - (\mathbf{v}, \nabla p)_\Omega,
$$
$$
F(\{\mathbf{v}, q\}) = -(g, \mathbf{v} \cdot \mathbf{n})_{\partial \Omega} - (f, q)_\Omega.
$$

这里，$\mathbf{n}$ 是边界上的外法向量。注意，在这种形式中，原问题的狄利克雷边界值被包含在弱形式中。

<!--stackedit_data:
eyJoaXN0b3J5IjpbNzExOTcwNjY2LDE5NjI0NTM0NDEsNzcyNz
g3MjA1LDE3NDA0MDkzNTldfQ==
-->