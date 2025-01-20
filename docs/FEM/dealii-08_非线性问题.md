# 非线性问题


There is no finite algorithm to find a root of a single general nonlinear equation:

$$ f(x) = 0 $$

All algorithms for this kind of problem are iterative:

- Start with an initial guess $x_0$
- Compute a sequence of iterates $\{ x_k \}$
- Hope (or prove) that $x_k \to x$ where $x$ is a root of $f(.)$


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
F(\vec{x}_0) = F(\vec{x}_k) + \frac{\partial F(\vec{x}_k)}{\partial \vec{x}} (\vec{x}_0-\vec{x}_k) = 0
$$

其中 $\vec{x}=\vec{x}_0$ 是方程的根, 其中 $\delta \mathbf{x}=\vec{x}_0-\vec{x}_k$，那么

$$
\vec{x}_0 = \frac{-F(\vec{x}_k)}{\frac{\partial F(\vec{x}_k)}{\partial \vec{x}}} + \vec{x}_k
$$

这里 $\vec{x}_0$ 可以看作 $\vec{x}_{n+1}$, $\vec{x}_k$ 可以看作 $\vec{x}_n$。

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTYzODYxMTk2NCwtNDM4NzA5MTkyLC05OT
Y1NjUyNTRdfQ==
-->