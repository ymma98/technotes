# step-4, dimension independent programming

依然是考虑泊松方程,

$$
-\Delta u = f \text{ in } \Omega,\\
u=0 \text{ on } \partial\Omega.
$$

然后做以下积分:
$$
-\int_\Omega \varphi \Delta u = \int_\Omega \varphi f.
$$
考虑到 $\nabla \cdot (\varphi \nabla u) = \nabla \varphi \cdot \nabla u + \varphi\Delta u$, 于是有
$$
\int_\Omega \nabla \varphi \cdot \nabla u - \int_{\partial\Omega} \varphi \vec{n} \cdot \nabla u = \int_\Omega \varphi f.
$$
测试函数 $\varphi$ 必须满足相同类型的边界条件（在数学术语中：它需要来自我们寻求解的集合的切空间），因此在边界上 $\varphi = 0$，因此我们要寻找的弱形式为
$$
(\nabla \varphi, \nabla u) = (\varphi, f),
$$
这里我们使用了常用的符号 $(a, b) = \int_\Omega ab$

通过这些步骤，我们现在拥有一组函数 $\varphi_i$，我们可以定义离散问题的弱形式：寻找一个函数 $u_h$，即寻找上述提到的扩展系数 $U_j$，使得
$$
(\nabla \varphi_i, \nabla u_h) = (\varphi_i, f), \quad i = 0 \ldots N-1.
$$
请注意，我们在这里遵循的约定是所有计数从零开始，这在 C 和 C++ 中很常见。通过插入表示 $u_h(x) = \sum_j U_j \varphi_j(x)$，然后观察到
$$
(\nabla \varphi_i, \nabla u_h) = (\nabla \varphi_i, \nabla[\sum_j U_j \varphi_j]) = \sum_j (\nabla \varphi_i, \nabla[U_j \varphi_j]) = \sum_j (\nabla \varphi_i, \nabla \varphi_j) U_j.
$$
因此，该问题变为：寻找一个向量 $U$ 使得
$$
AU = F,
$$
其中矩阵 $A$ 和右侧 $F$ 定义为
$$
A_{ij} = (\nabla \varphi_i, \nabla \varphi_j), \quad F_i = (\varphi_i, f).
$$
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEwMDc1MzMyNDksMjM5Njk3NDQwXX0=
-->