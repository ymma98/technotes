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

**Newton's method:** Consider the residual
$$
R(u) = f - \nabla \cdot \left( A \frac{\nabla u}{\sqrt{1 + |\nabla u|^2}} \right)
$$

Solve $R(u) = 0$ by using the iteration
$$
u_{k+1} = u_k - [R'(u_k)]^{-1} R(u_k)
$$

or equivalently:
$$
[R'(u_k)] \delta u_k = -R(u_k), \quad u_{k+1} = u_k + \delta u_k
$$

**Goal:** Solve
$$
- \nabla \cdot \left( A \frac{\nabla u}{\sqrt{1 + |\nabla u|^2}} \right) = f
$$

**Newton's method:** Iterate on
$$
[R'(u_k)] \delta u_k = -R(u_k), \quad u_{k+1} = u_k + \delta u_k
$$

Here, this means:
$$
- \nabla \cdot \left( \frac{A}{\sqrt{1 + |\nabla u_k|^2}} \nabla \delta u_k \right) + \nabla \cdot \left( \frac{A \nabla u_k \cdot \nabla \delta u_k}{(1 + |\nabla u_k|^2)^{3/2}} \nabla u_k \right) = f + \nabla \cdot \left( \frac{A}{\sqrt{1 + |\nabla u_k|^2}} \nabla u_k \right)
$$

This is in fact a symmetric and positive definite problem.





对于非线性问题, 我们有方程:

$$
F(\vec{x}) = 0
$$

根据 Taylor expansion, 有

$$
F(\vec{x}) = F(\vec{x}_k) + \frac{\partial F(\vec{x})}{\partial \vec{x}} (\vec{x}-\vec{x}_k)
$$

于是, 

$$
F(\vec{x}_{k+1}) = F(\vec{x}_k) + \frac{\partial F(\vec{x}_k)}{\partial \vec{x}} (\vec{x}_0-\vec{x}_k) = 0
$$

其中 $\vec{x}=\vec{x}_0$ 是方程的根, 其中 $\delta \mathbf{x}=\vec{x}_0-\vec{x}_k$，那么

$$
\vec{x}_0 = \frac{-F(\vec{x}_k)}{\frac{\partial F(\vec{x}_k)}{\partial \vec{x}}} + \vec{x}_k
$$

这里 $\vec{x}_0$ 可以看作 $\vec{x}_{n+1}$, $\vec{x}_k$ 可以看作 $\vec{x}_n$。

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE2MDkxNTE1ODcsMTkwMzQ0NDM0MiwtMT
gyMDUyMTY1MiwtMzY1NTc0NTkxLC0xMjMwODUxMzIzLC04OTk2
MjcyNzQsNDM2NDc4NTcxLC02Mzg2MTE5NjQsLTQzODcwOTE5Mi
wtOTk2NTY1MjU0XX0=
-->