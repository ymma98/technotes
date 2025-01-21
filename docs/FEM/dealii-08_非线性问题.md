# 非线性问题

## 理论

There is no finite algorithm to find a root of a single general nonlinear equation:

$$ f(x) = 0 $$

All algorithms for this kind of problem are iterative:

- Start with an initial guess $x_0$
- Compute a sequence of iterates $\{ x_k \}$
- Hope (or prove) that $x_k \to x$ where $x$ is a root of $f(.)$

**Goal:** Choose $g(x)$ so that

$$ x_{k+1} = g(x_k) \quad \Longleftrightarrow \quad f(x) = 0 $$

**Examples:**

- "Picard iteration" (assume that $f(x) = p(x) x - h$):

  $$ g(x) = \frac{1}{p(x)} h \quad \Longrightarrow \quad p(x_k) x_{k+1} = h $$

- Pseudo-timestepping:

  $$ g(x) = x \pm \Delta \tau f(x) \quad \Longrightarrow \quad \frac{x_{k+1} - x_k}{\Delta \tau} = \pm f(x_k) $$

- Newton's method:

  $$ g(x) = x - \frac{f(x)}{f'(x)} \quad \Longrightarrow \quad x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)} $$


对于非线性的有限元，相当于求解线性系统 

$$
K(u) u = f
$$

定义残差:

$$
R(u) = K(u) u -f 
$$

我们的目标是求解 $R(u) = 0$。

假设 $u_{k}$ 是当前值, 对 $R(u)$ 在 $u_k$ 处进行泰勒展开, 展开到一阶,

$$
R(u) = R(u_k) + \frac{dR(u_k)}{du_k} (u-u_k) = 0
$$

令 $u_{k+1}$ 是 $R(u)=0$ 的解, $\delta u_k = u_{k+1} - u_k$ 有:

$$
R(u_{k}) + \frac{dR(u_k)}{du_k} \delta u_k = 0
$$

于是得到线性方程组:

$$
\frac{dR(u_k)}{du_k} \delta u_k = -R(u_k)
$$

其中,

$$
\frac{dR(u_k)}{du_k} \delta u_k = \frac{dR}{d\epsilon} = \lim_{\epsilon\rightarrow0} \frac{dR[u_k + \epsilon \delta u_k] - dR[u_k]}{\epsilon} = \frac{\partial R}{\partial u_k} \delta u_k+\frac{\partial R}{\partial \nabla u_k} \cdot \nabla \delta u_k
$$


### Picard iteration 

**Goal:** Solve

$$- \nabla \cdot \left( A \frac{\nabla u}{\sqrt{1 + |\nabla u|^2}} \right) = f$$

**Picard iteration:** Repeatedly solve

$$
\left( \nabla \varphi, \frac{A \nabla u_{k+1}}{\sqrt{1 + |\nabla u_k|^2}} \right) = (\varphi, f), \quad \nabla \varphi \in H_0^1
$$

- Converges frequently
- Picard iteration typically converges rather slowly

### Pseudo-timestepping

**Pseudo-timestepping:** Iterate to $\tau \to \infty$ the equation
$$
\frac{\partial u(\tau)}{\partial \tau} - \nabla \cdot \left( A \frac{\nabla u(\tau)}{\sqrt{1 + |\nabla u(\tau)|^2}} \right) = f
$$

For example using the explicit Euler method:
$$
\frac{u_{k+1} - u_k}{\Delta \tau} - \nabla \cdot \left( A \frac{\nabla u_k}{\sqrt{1 + |\nabla u_k|^2}} \right) = f
$$

Semi-implicit Euler method
$$
\frac{u_{k+1} - u_k}{\Delta \tau} - \nabla \cdot \left( A \frac{\nabla u_{k+1}}{\sqrt{1 + |\nabla u_k|^2}} \right) = f
$$

- Pseudo-timestepping converges almost always
- Easy to implement (it's just a heat equation)
- With implicit method, can make time step larger + larger
- Often takes many, many time steps

### Newton's method

对于方程:

$$- \nabla \cdot \left( A \frac{\nabla u}{\sqrt{1 + |\nabla u|^2}} \right) = f$$

定义方程的残差为 $R(u)$: 

$$
R(u) = -\nabla \cdot \left( A \frac{\nabla u}{\sqrt{1 + |\nabla u|^2}} \right) -f
$$

此时相当于求解 $R(u) = 0$。对于非线性方程, 应用牛顿迭代, 相当于求解 


$$
\frac{dR(u_k)}{du_k} \delta u_k = -R(u_k)
$$

其中,

$$
\frac{dR(u_k)}{du_k} \delta u_k = \frac{dR}{d\epsilon} = \lim_{\epsilon\rightarrow0} \frac{dR[u_k + \epsilon \delta u_k] - dR[u_k]}{\epsilon} = \frac{\partial R}{\partial u_k} \delta u_k+\frac{\partial R}{\partial \nabla u_k} \nabla \delta u_k
$$


$$
 R.H.S = \frac{\partial R}{\partial u_k} \delta u_k+\frac{\partial R}{\partial \nabla u_k} \nabla \delta u = 0 -\nabla\cdot \left[ A \left(- \frac{\nabla u \cdot  \nabla\delta u_k}{1+|\nabla u|^{3/2}}\nabla u  + \frac{\nabla \delta u_k}{\sqrt{1+|\nabla u|^2}} \right)  \right]
$$


Here, this means:

$$- \nabla \cdot \left( \frac{A}{\sqrt{1 + |\nabla u_k|^2}} \nabla \delta u_k \right) + \nabla \cdot \left( \frac{A \nabla u_k \cdot \nabla \delta u_k}{(1 + |\nabla u_k|^2)^{3/2}} \nabla u_k \right) = f + \nabla \cdot \left( \frac{A}{\sqrt{1 + |\nabla u_k|^2}} \nabla u_k \right)$$

This is in fact a symmetric and positive definite problem.

## 弱格式


Starting with the strong formulation above, we get the weak formulation by multiplying both sides of the PDE with a test function $\varphi$ and integrating by parts on both sides:

$$
\left( \nabla \varphi, \frac{1}{\left( 1 + |\nabla u^n|^2 \right)^{\frac{1}{2}}} \nabla \delta u^n \right) 
    - \left( \nabla \varphi, \frac{\nabla u^n \cdot \nabla \delta u^n}{\left( 1 + |\nabla u^n|^2 \right)^{\frac{3}{2}}} \nabla u^n \right) 
= - \left( \nabla \varphi, \frac{1}{\left( 1 + |\nabla u^n|^2 \right)^{\frac{1}{2}}} \nabla u^n \right).
$$

Here the solution $\delta u^n$ is a function in $H^1(\Omega)$, subject to the boundary conditions discussed above. Reducing this space to a finite-dimensional space with basis $\{\varphi_0, \ldots, \varphi_{N-1}\}$, we can write the solution:

$$
\delta u^n = \sum_{j=0}^{N-1} \delta U_j^n \varphi_j.
$$

Using the basis functions as test functions and defining $a_n := \frac{1}{\sqrt{1 + |\nabla u^n|^2}}$, we can rewrite the weak formulation:

$$
\sum_{j=0}^{N-1} \left[ (\nabla \varphi_i, a_n \nabla \varphi_j) 
    - (\nabla u^n \cdot \nabla \varphi_i, a_n^3 \nabla u^n \cdot \nabla \varphi_j) \right] \delta U_j 
= - (\nabla \varphi_i, a_n \nabla u^n) \quad \forall i = 0, \ldots, N-1,
$$

where the solution $\delta u^n$ is given by the coefficients $\delta U_j^n$. This linear system of equations can be rewritten as:

$$
A^n \delta U^n = b^n,
$$

where the entries of the matrix $A^n$ are given by:

$$
A_{ij}^n := (\nabla \varphi_i, a_n \nabla \varphi_j) 
    - (\nabla u^n \cdot \nabla \varphi_i, a_n^3 \nabla u^n \cdot \nabla \varphi_j),
$$

and the right-hand side $b^n$ is given by:

$$
b_i^n := -(\nabla \varphi_i, a_n \nabla u^n).
$$




<!--stackedit_data:
eyJoaXN0b3J5IjpbMTMxMzIzOTY5OSwtMTkzODU5MTc4OSwtND
YxNDYwODk3LDQ5MDk3ODUyNywtMTAzMzcyNzQzLDEzNDA2OTk0
NDUsLTI1NzE5Mjc1MiwyNDY1MDA2NTksMTcxMDQyOTQwMiwxNz
cwNjIyMzYyLDIwMjg4ODY5NTksNDE3MzIyOTcwLC0xODYwNTEz
OTUzLC0xMjU2MDM2OTg0LC02ODEzODA0ODIsLTE4MzAzNjQ3ND
EsMTY0MjA1ODA4NSwxOTAzNDQ0MzQyLC0xODIwNTIxNjUyLC0z
NjU1NzQ1OTFdfQ==
-->