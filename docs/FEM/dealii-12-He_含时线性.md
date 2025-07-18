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

**To get the weak form**,

$$
\Rightarrow \ u_t v - \nabla \cdot (c \nabla u) v = f v \quad \text{in} \ \Omega
$$

$$
\Rightarrow \int_{\Omega} u_t v \, dx \, dy - \int_{\Omega} \nabla \cdot (c \nabla u) v \, dx \, dy = \int_{\Omega} f v \, dx \, dy
$$

$$
\int_{\Omega} u_t v \, dx \, dy + \int_{\Omega} c \nabla u \cdot \nabla v \, dx \, dy - \int_{\partial \Omega} (c \nabla u \cdot \hat{n}) v \, ds = \int_{\Omega} f v \, dx \, dy.
$$


Let $a(u, v) = \int_{\Omega} c \nabla u \cdot \nabla v \, dx \, dy$ and $(f, v) = \int_{\Omega} f v \, dx \, dy$.

Weak formulation: find $u \in H^1(0, T; H^1(\Omega))$ such that

$$
(u_t, v) + a(u, v) = (f, v)
$$

for any $v \in H^1_0(\Omega)$ (Dirichlet BC here).

Discretization: 

$$
(u_{ht}, v_h) + a(u_h, v_h) = (f, v_h)
$$

$$
\Leftrightarrow \int_{\Omega} u_{ht} v_h \, dx \, dy + \int_{\Omega} c \nabla u_h \cdot \nabla v_h \, dx \, dy = \int_{\Omega} f v_h \, dx \, dy
$$

$$
u_h(x, y, t) = \sum_{j=1}^{N_b} u_j(t) \varphi_j(x, y)
$$





<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQ0ODA4NDg5MCwtMTgyMjE4NjcyNiwtNz
k1NDE1MDM5LDE4NTc4MTM1NSwxNzM3MjEwNzQxLC02NTkyOTc4
MjldfQ==
-->