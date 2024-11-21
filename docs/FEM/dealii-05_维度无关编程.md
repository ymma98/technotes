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
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTU5MDg0MzgwNV19
-->