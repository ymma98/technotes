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
\;=\;
\bigl[(1-\theta)\,\Delta\,u^{n-1}(x) \;+\; \theta\,\Delta\,u^n(x)\bigr]
\;=\;
\bigl[(1-\theta)\,f(x,t_{n-1}) \;+\; \theta\,f(x,t_n)\bigr],
$$

其中

$$
k_n \;=\; t_n - t_{n-1}
$$

为时间步长。theta-格式推广了显式欧拉法（$\theta=0$）、隐式欧拉法（$\theta=1$）以及 Crank–Nicolson 法（$\theta=\tfrac12$）。由于后者具有最高的收敛阶数，我们在下面的程序中将使用 $\theta = \tfrac12$.

接下来，我们通过将方程乘以试函数并进行分部积分，然后限制在有限维子空间上来离散空间。在两边乘以 $k_n$ 后，得到如下全离散形式：

$$
M\,U^n \;-\; M\,U^{n-1}
\;+\; k_n\,\Bigl[\,(1-\theta)\,A\,U^{n-1} \;+\; \theta\,A\,U^n\Bigr]
\;=\;
k_n\,\Bigl[\,(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr],
$$
其中 $M$ 称为质量矩阵，$A$ 称为刚度矩阵，源自对拉普拉斯算子的离散化。把所有已知量移到右侧后，我们在每个时间步需求解的线性系统是：
\[
\bigl(M + k_n\,\theta\,A\bigr)\,U^n
\;=\;
M\,U^{n-1}
\;-\; k_n\,(1-\theta)\,A\,U^{n-1}
\;+\;
k_n\,\Bigl[\,(1-\theta)\,F^{n-1} \;+\; \theta\,F^n\Bigr].
\]

由于左端矩阵是对称且正定的，我们可以使用共轭梯度法（Conjugate Gradient）高效地求解该系统。

如果初始时刻已经得到节点系数 $U^0$，我们就可以开始上述迭代。这里，$U^0$ 通过将初值 $u_0(x)$ 插值到首次时间步使用的网格上获得。此外，我们还需要选择时间步长；在本程序中，我们将其设为固定值，但更高级的模拟器通常会自适应地进行选择。我们会在后续结果部分对这一点做简要讨论。

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTE5NDQxMzYyOSwtNDE3ODY3MzgxXX0=
-->