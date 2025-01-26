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

需要解决的离散问题是：

$$
A(\mathbf{x}_h, \mathbf{w}_h) = F(\mathbf{w}_h),
$$

$x_h={u_h,p_h},wh={vh,qh}\mathbf{x}_h = \{\mathbf{u}_h, p_h\}$, \mathbf{w}_h = \{\mathbf{v}_h, q_h\}。xh\mathbf{x}_h 和 wh\mathbf{w}_h 都来自空间 Xh=RT(k)×DQ(k)X_h = RT(k) \times DQ(k)，其中 RT(k)RT(k) 本身是一个由 dim\text{dim}-维函数组成的空间，用于处理流速是向量值的情况。那么关键问题是：我们如何在程序中实现这一点？

向量值单元在之前的教程程序中已经讨论过，第一次详细讲解是在 \texttt{step-8}。主要区别在于，向量值空间 VhV_h 的所有分量是统一的：位移向量的 dim\text{dim} 个分量全都相同，并且来自同一个函数空间。因此，我们可以通过将 dim\text{dim} 乘以常规 Q(1)Q(1) 有限元空间的外积来构建 VhV_h，确保所有形函数只有一个非零的向量分量。我们在 \texttt{step-8} 中的做法是，只查看唯一的（标量）非零分量，并使用 \texttt{fe.system_to_component_index(i).first} 函数来确定这个分量究竟是哪一个。

对于 Raviart-Thomas 单元来说，这种方法行不通：由于其构造方式需要满足空间 H(div)H(\text{div}) 的某些正则性属性，RT(k)RT(k) 的形函数通常在所有向量分量上都是非零的。因此，如果使用 \texttt{fe.system_to_component_index(i).first} 来确定形函数 ii 唯一的非零分量，会产生一个异常。我们真正需要的是获取形函数的**所有**向量分量。在 \texttt{deal.II} 文档中，我们称这种有限元为非原始单元（\textit{non-primitive}），而将那些标量的或每个向量值形函数仅在单个向量分量上非零的有限元称为原始单元（\textit{primitive}）。

那么，对于非原始单元，我们该怎么办？为了弄清楚这一点，让我们回到教程程序，几乎从头开始。我们了解到可以使用 \texttt{FEValues} 类来确定形函数在积分点处的值和梯度。例如，我们可以调用 \texttt{fe_values.shape_value(i, q_point)} 来获取编号为 \texttt{q_point} 的积分点上第 ii 个形函数的值。在 \texttt{step-8} 和其他教程程序中，我们还了解到这个函数调用同样适用于向量值形函数（原始有限元的情况），并且它返回的是形函数 ii 在积分点 \texttt{q_point} 上唯一的非零分量的值。

对于非原始形函数，这种方法显然行不通：形函数 ii 并没有单个非零的向量分量，因此调用 \texttt{fe_values.shape_value(i, q_point)} 就没有意义。然而，\texttt{deal.II} 提供了另一个函数调用：\texttt{fe_values.shape_value_component(i, q_point, comp)}，它返回第 \texttt{comp} 个向量分量在积分点 \texttt{q_point} 上的值，其中 \texttt{comp} 是一个从零到当前有限元向量分量数量之间的索引。例如，我们用来描述速度和压力的单元将具有 dim+1\text{dim}+1 个分量。值得注意的是，这个函数调用同样适用于原始形函数：它只会对除一个以外的所有分量返回零；对于非原始形函数，通常会为多个分量返回非零值。

----------

这是对原始内容的准确中文翻译，同时保持技术术语的清晰和一致性。
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTc5MDgxNDI0OCw0NTYzOTQyMjcsLTE3Mj
k2OTAzNSwxOTYyNDUzNDQxLDc3Mjc4NzIwNSwxNzQwNDA5MzU5
XX0=
-->