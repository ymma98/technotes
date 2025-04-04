# step-20, 矢量方程

这个 tutorial 用到了 Block and Schur complement solvers，跳过！... 矩阵求解变得无比麻烦。

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


需要求解的离散问题是：

$$
A(x_h, w_h) = F(w_h),
$$

$x_h = \{\mathbf{u_h}, p_h\}$，$w_h = \{\mathbf{v_h}, q_h\}$。$x_h$和$w_h$来自空间$X_h = RT(k) \times DQ(k)$，其中$RT(k)$是一个 $dim$ 维的函数空间，用于表示流速是矢量值。$k$ 代表 $k$ 阶有限元, RT 代表 Raviart-Thomas elements, DG 代表 discontinuous elements。RT(k) 属于 $H(div)$ 单元，可保证通量（或速度）在单元间的法向连续，有助于局部守恒。

对于向量问题, test function 也是矢量, $\mathbf{v_h} = (v_1, v_2)$。最后还是将方程转换为标量方程。

finite elements that are either scalar or for which every vector-valued shape function is nonzero only in a single vector component are called **primitive**, RT elements 是 non-primitive. _non-primitive_：形函数在多个矢量分量上都有贡献，需要用更通用的接口取值。

## 灾难: 矩阵求解

本问题得到的系统 $Ax=b$ 中的矩阵 $A$, 是对称但不定的(indefinite), 这意味着无法使用 CG 方法求解。另外，$A$ 的对角线上有 zero block, 这使得一般的 preconditioner (Jacobi, SSOR) 都不起作用。

Conjugate Gradient method: 只适用于对称的正定矩阵。对于本问题不适用。tutorial 中提到的  Schur complement 这个方法并不通用, 而且要手动推导化简分块矩阵，对于不关心矩阵求解过程的我们来说简直是灾难。只能先...跳过？

* matlab 中关于稀疏矩阵的求解似乎比较智能，[文档](https://www.mathworks.com/help/matlab/math/iterative-methods-for-linear-systems.html)质量也高


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTQ1ODY2NzgwMSwtMTA5NjE5MTc5MSwtOT
IxMjgzNDY1LDE2NDY0NDc1NjMsMTYwMzQwMDExMSwtOTM5MTMy
MjUyLC0yMDUwNDU5NzUsLTM0MTY3NjA4NCw1MDQ1NjY4OTIsND
U2Mzk0MjI3LC0xNzI5NjkwMzUsMTk2MjQ1MzQ0MSw3NzI3ODcy
MDUsMTc0MDQwOTM1OV19
-->