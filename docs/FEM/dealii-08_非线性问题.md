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

假设 $u_{k}$ 是当前值, 对 $R(u)$ 在 $u_k$ 处进行泰勒展开,

$$
R(u) = R(u_k) + \frac{dR(u_k)}{du_k} (u-u_k)
$$

令 $u_{k+1}$ 是 $R(u)=0$ 的解, $\delta u_k = u_{k+1} - u_k$ 有:

$$
R(u_{k+1})-R
$$


则根据牛顿法有

$$
\frac{dR(u)}{du} \delta u = -R(u)
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

Solve $R(u) = 0$ by using the iteration
$$
u_{k+1} = u_k - [R'(u_k)]^{-1} R(u_k)
$$

or equivalently (linear equation):
$$
[R'(u_k)] \delta u_k = -R(u_k), \quad u_{k+1} = u_k + \delta u_k
$$


Here, this means:

$$- \nabla \cdot \left( \frac{A}{\sqrt{1 + |\nabla u_k|^2}} \nabla \delta u_k \right) + \nabla \cdot \left( \frac{A \nabla u_k \cdot \nabla \delta u_k}{(1 + |\nabla u_k|^2)^{3/2}} \nabla u_k \right) = f + \nabla \cdot \left( \frac{A}{\sqrt{1 + |\nabla u_k|^2}} \nabla u_k \right)$$

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
eyJoaXN0b3J5IjpbMjQ2NTAwNjU5LDE3MTA0Mjk0MDIsMTc3MD
YyMjM2MiwyMDI4ODg2OTU5LDQxNzMyMjk3MCwtMTg2MDUxMzk1
MywtMTI1NjAzNjk4NCwtNjgxMzgwNDgyLC0xODMwMzY0NzQxLD
E2NDIwNTgwODUsMTkwMzQ0NDM0MiwtMTgyMDUyMTY1MiwtMzY1
NTc0NTkxLC0xMjMwODUxMzIzLC04OTk2MjcyNzQsNDM2NDc4NT
cxLC02Mzg2MTE5NjQsLTQzODcwOTE5MiwtOTk2NTY1MjU0XX0=

-->