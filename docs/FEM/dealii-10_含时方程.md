# step-26, 含时方程

## 理论



考虑以下偏微分方程系统：
$$
\frac{\partial u(x,t)}{\partial t} \;-\; \Delta\,u(x,t) \;=\; f(x,t),
\quad \forall\, x \in \Omega,\; t \in (0, T),
$$

$$
u(x,0) \;=\; u_0(x), \quad \forall\, x \in \Omega,
$$

$$
u(x,t) \;=\; g(x,t), \quad \forall\, x \in \partial\Omega,\; t \in (0,T).
$$

我们的目标是使用 $\theta$-scheme 来离散时间，从而求解上述方程。具体做法如下：

$$
\frac{u^n(x) - u^{n-1}(x)}{k_n}
\;-\;
\bigl[(1-\theta)\,\Delta\,u^{n-1}(x) \;+\; \theta\,\Delta\,u^n(x)\bigr]
\;=\;
\bigl[(1-\theta)\,f(x,t_{n-1}) \;+\; \theta\,f(x,t_n)\bigr],
$$

其中

$$
k_n \;=\; t_n - t_{n-1}
$$

为时间步长。theta-格式推广了显式欧拉法（$\theta=0$）、隐式欧拉法（$\theta=1$）以及 Crank–Nicolson 法（$\theta=\tfrac12$）。由于后者具有最高的收敛阶数，我们在下面的程序中将使用 $\theta = \tfrac12$.

在这里，可以将 $u^{n-1}(x)$ 视为已知数据，因为它通常已被计算出来。现在，用

$$
u^n(x) \approx u_h^n(x) \;=\; \sum_{j} U_j^n\,\phi_j(x)
$$

替换 $u^n(x)$，并用测试函数 $\phi_i(x)$ 相乘，需要时进行分部积分。按上述过程，我们可以得到

接下来，我们通过将方程乘以试函数并进行分部积分，然后限制在有限维子空间上来离散空间。在两边乘以 $k_n$ 后，得到如下全离散形式：

$$
M\,U^n \;-\; M\,U^{n-1}
\;+\; k_n\,\Bigl[\,(1-\theta)\,A\,U^{n-1} \;+\; \theta\,A\,U^n\Bigr]
\;=\;
k_n\,\Bigl[\,(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr],
$$
其中 $M$ 称为质量矩阵，$A$ 称为刚度矩阵，源自对拉普拉斯算子的离散化。把所有已知量移到右侧后，我们在每个时间步需求解的线性系统是：

$$
\bigl(M + k_n\,\theta\,A\bigr)\,U^n
\;=\;
M\,U^{n-1}
\;-\; k_n\,(1-\theta)\,A\,U^{n-1}
\;+\;
k_n\,\Bigl[\,(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr].
$$

由于左端矩阵是对称且正定的，我们可以使用共轭梯度法（Conjugate Gradient）高效地求解该系统。

$$
\sum_{j}\,\bigl(M + k_n\,\theta\,A\bigr)_{ij}\,U_j^n
\;=\;
(\phi_i,\;u_h^{n-1})
\;-\;
k_n\,(1-\theta)\,\bigl(\nabla\phi_i,\;\nabla u_h^{n-1}\bigr)
\;+\;
k_n\,\Bigl[(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr].
$$

现在，设想在时间步 $n-1$ 与 $n$ 之间更换了网格。此时的问题是，用于 $u_h^n$ 和 $u_h^{n-1}$ 的基函数并不相同！这会影响右端的各项，$(\phi_i,\;u_h^{n-1})\;=\;\bigl(\phi_i^n,\;\phi_j^{n-1}\bigr)\,U_j^{n-1},\quad i=1,\dots,N_n.$，如果两个时间步中使用的网格相同，那么 $(\phi_i^n,\;\phi_j^{n-1})$ 就构成一个方形的质量矩阵 $M_{ij}$。然而，如果网格不同，这个矩阵通常是非方阵。

在实际中，通常不会这样做。更常见的做法是，每次适配网格时，将旧网格上的解插值到新网格上，以避免上述问题。也就是说，我们不直接求解上面的方程，而是转而求解

$$
\sum_{j}\,\bigl(M + k_n\,\theta\,A\bigr)_{ij}\,U_j^n
\;=\;
\bigl(\phi_i,\;I_h^n\,u_h^{n-1}\bigr)
\;-\;
k_n\,(1-\theta)\,\bigl(\nabla\phi_i,\;\nabla I_h^n\,u_h^{n-1}\bigr)
\;+\;
k_n\,\Bigl[(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr],
$$

其中 $I_h^n$ 是将解插值到时间步 $n$ 所用有限元空间的算子。





如果初始时刻已经得到节点系数 $U^0$，就可以开始上述迭代。这里，$U^0$ 通过将初值 $u_0(x)$ 插值到首次时间步使用的网格上获得。




<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE3ODE5MDUzNSwtNDM2MTU5MzEzLC0xOT
A0NTc5MDM3LDExOTQ0MTM2MjksLTQxNzg2NzM4MV19
-->