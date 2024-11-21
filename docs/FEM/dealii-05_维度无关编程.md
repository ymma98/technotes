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
$$(\nabla \varphi, \nabla u) = (\varphi, f),$$
<!--stackedit_data:
eyJoaXN0b3J5IjpbMjM5Njk3NDQwXX0=
-->