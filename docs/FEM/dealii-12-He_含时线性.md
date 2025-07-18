# dealii-12-He_含时线性

对应 Chapter 4: Finite Elements for 2D second order parabolic and hyperbolic equation. 


$$
u_t - \nabla \cdot (c \nabla u) = f, \quad \text{in} \ \Omega \times [0, T],
$$

$$
u = g, \quad \text{on} \ \partial \Omega \times [0, T],
$$

$$
u = u_0, \quad \text{at} \ t = 0 \ \text{and in} \ \Omega.
$$

where $f(x, y, t)$ and $c(x, y, t)$ are given functions.

To get the weak form,

$$
\Rightarrow \ u_t v - \nabla \cdot (c \nabla u) v = f v \quad \text{in} \ \Omega
$$

$$
\Rightarrow \int_{\Omega} u_t v \, dx \, dy - \int_{\Omega} \nabla \cdot (c \nabla u) v \, dx \, dy = \int_{\Omega} f v \, dx \, dy
$$

$$
\int_{\Omega} u_t v \, dx \, dy + \int_{\Omega} c \nabla u \cdot \nabla v \, dx \, dy - \int_{\partial \Omega} (c \nabla u \cdot \hat{n}) v \, ds = \int_{\Omega} f v \, dx \, dy.
$$





<!--stackedit_data:
eyJoaXN0b3J5IjpbMTg1NzgxMzU1LDE3MzcyMTA3NDEsLTY1OT
I5NzgyOV19
-->