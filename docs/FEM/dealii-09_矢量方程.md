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

K−1u+∇p=0在 Ω,K^{-1} \mathbf{u} + \nabla p = 0 \quad \text{在 } \Omega, −div u=−f在 Ω,-\text{div } \mathbf{u} = -f \quad \text{在 } \Omega, p=g在 ∂Ω.p = g \quad \text{在 } \partial \Omega.

在这里，我们将定义速度 $\mathbf{u}$ 的方程乘以 $K^{-1}$，这是因为这使得方程组变得对称：一个方程包含梯度，另一个方程包含负散度，两者显然是彼此的共轭，从而产生一个对称的双线性形式，并在通常假设 $K$ 为对称张量的情况下得到一个对称系统矩阵。

该问题的弱形式通过将两个方程与测试函数相乘，并对部分项进行分部积分得到：

A({u,p},{v,q})=F({v,q}),A(\{\mathbf{u}, p\}, \{\mathbf{v}, q\}) = F(\{\mathbf{v}, q\}),

其中

A({u,p},{v,q})=(v,K−1u)Ω−(div v,p)Ω−(q,div u)Ω,A(\{\mathbf{u}, p\}, \{\mathbf{v}, q\}) = (\mathbf{v}, K^{-1} \mathbf{u})_\Omega - (\text{div } \mathbf{v}, p)_\Omega - (q, \text{div } \mathbf{u})_\Omega, F({v,q})=−(g,v⋅n)∂Ω−(f,q)Ω.F(\{\mathbf{v}, q\}) = -(g, \mathbf{v} \cdot \mathbf{n})_{\partial \Omega} - (f, q)_\Omega.

这里，$\mathbf{n}$ 是边界处的外法向量。请注意，在这种形式中，原始问题的狄利克雷边界值已被纳入弱形式。

----------

Let me know if you need further refinements or explanations!
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk2MjQ1MzQ0MSw3NzI3ODcyMDUsMTc0MD
QwOTM1OV19
-->