# dealii-测试_含时线性

## 弱格式

对应 Xiaoming He Chapter 4: Finite Elements for 2D second order parabolic and hyperbolic equation. 


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

Define the stiffness matrix

$$
A(t) = [a_{ij}]_{i,j=1}^{N_b} = \left[ \int_{\Omega} c \nabla \varphi_j \cdot \nabla \varphi_i \, dx \, dy \right]_{i,j=1}^{N_b}.
$$

Define the mass matrix

$$
M = [m_{ij}]_{i,j=1}^{N_b} = \left[ \int_{\Omega} \varphi_j \varphi_i \, dx \, dy \right]_{i,j=1}^{N_b}.
$$

Define the load vector

$$
\vec{b}(t) = [b_i]_{i=1}^{N_b} = \left[ \int_{\Omega} f \varphi_i \, dx \, dy \right]_{i=1}^{N_b}.
$$

Define the unknown vector

$$
\vec{X}(t) = [u_j(t)]_{j=1}^{N_b}.
$$

Then we obtain the system

$$
M \vec{X}'(t) + A(t) \vec{X}(t) = \vec{b}(t).
$$


## 时间离散

General $\theta$-scheme:

$$
\frac{y_{j+1} - y_j}{h} = \theta f(t_{j+1}, y_{j+1}) + (1 - \theta) f(t_j, y_j);
$$

- $\theta = 0$: forward Euler scheme;
- $\theta = 1$: backward Euler scheme;
- $\theta = \frac{1}{2}$: Crank-Nicolson scheme.

$$
\frac{M \vec{X}^{m+1} - \vec{X}^m}{\Delta t} + \theta A(t_{m+1}) \vec{X}^{m+1} + (1 - \theta) A(t_m) \vec{X}^m = \theta \vec{b}(t_{m+1}) + (1 - \theta) \vec{b}(t_m), \quad m = 0, \dots, M_m - 1.
$$



$$
\Rightarrow \left[ \frac{M}{\Delta t} + \theta A(t_{m+1}) \right] \vec{X}^{m+1} = \theta \vec{b}(t_{m+1}) + (1 - \theta) \vec{b}(t_m) + \frac{M}{\Delta t} \vec{X}^m - (1 - \theta) A(t_m) \vec{X}^m
$$


$$
\tilde{A}^{m+1} \vec{X}^{m+1} = \tilde{b}^{m+1}, \quad m = 0, \dots, M_m - 1,
$$

where

$$
\tilde{A}^{m+1} = \frac{M}{\Delta t} + \theta A(t_{m+1}),
$$

$$
\tilde{b}^{m+1} = \theta \vec{b}(t_{m+1}) + (1 - \theta) \vec{b}(t_m) + \left[ \frac{M}{\Delta t}  - (1 - \theta) A(t_m) \right] \vec{X}^m.
$$

## 具体的问题

 $\Omega = [0, 2] \times [0, 1]$:

$$
u_t - \nabla \cdot (2 \nabla u) = -3 e^{x + y + t}, \quad \text{on} \ \Omega \times [0, 1],
$$

$$
u(x, y, 0) = e^{x + y}, \quad \text{on} \ \partial \Omega,
$$

$$
u = e^{y + t} \quad \text{on} \ x = 0,
$$

$$
u = e^{2 + y + t} \quad \text{on} \ x = 2,
$$

$$
u = e^{x + t} \quad \text{on} \ y = 0,
$$

$$
u = e^{x + 1 + t} \quad \text{on} \ y = 1.
$$

The analytic solution of this problem is $u = e^{x + y + t}$.



<!--stackedit_data:
eyJoaXN0b3J5IjpbMTg2MDEyOTE2OF19
-->