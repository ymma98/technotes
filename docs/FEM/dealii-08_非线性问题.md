# 非线性问题


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
eyJoaXN0b3J5IjpbLTg5OTYyNzI3NCw0MzY0Nzg1NzEsLTYzOD
YxMTk2NCwtNDM4NzA5MTkyLC05OTY1NjUyNTRdfQ==
-->