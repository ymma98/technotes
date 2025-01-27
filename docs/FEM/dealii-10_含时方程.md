# step-26, 含时方程

## 推导

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

替换 $u^n(x)$，并用测试函数 $\phi_i(x)$ 相乘，需要时进行分部积分。按上述过程，我们可以得到如下全离散形式：

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

## benchmark

常见错误:

* 将 $\theta$ 与 $(1-\theta)$ 搞混。
* 处理右端项时，比如忘记乘上 $k_n$ 或 $\theta$。
* 错误地处理边界条件，比如忘记乘上 $k_n$ 或 $\theta$，或者只在右端项而不是系统矩阵中施加非零边界值。


还有一种不太常见但也可能出现的问题是初始条件设置错误。不过，这往往可以通过输出第一次时间步的结果来发现。无论如何，为了确保代码正确性，最好有一套测试方案来分别验证这些不同的部分。具体而言：

* 用非零初始条件、但右端项和边界值都为零的情形来测试，并验证时间演化是否正确。
* 然后，用零初始条件和零边界值但非零右端项来测试，并再次检查正确性。
* 最后，用零初始条件和零右端项但非零边界值来测试。


这些听起来很复杂，但对于线性偏微分方程（无系数或系数恒定）来说，其实有一套相对成熟的测试流程，基于以下观察：如果将区域选为 $[0,1]^2$（或者作稍许修改选用矩形），那么精确解可以写成

$$
u(x,y,t) \;=\; a(t)\,\sin(n_x\pi x)\,\sin(n_y\pi y),
$$

其中 $n_x,\,n_y$ 为整数。当初始条件、右端项和边界值都类似地取成 $\sin(n_x\pi x)\sin(n_y\pi y)$ 时，这种形式成立。其原因在于 $\sin(n_x\pi x)\sin(n_y\pi y)$ 是拉普拉斯算子的特征函数，因此可以直接计算它在 $\partial_t$ 和 $-\Delta$ 下的行为。

* **设置非零初值$u_0$，以及 $f=0$和 $g=0$, 排除右端项和边界条件, 检查是否是 $k_n$ 项或 $\theta$ 出现问题**

例如，令
$$
u_0(x,y) \;=\; \sin(n_x\pi x)\,\sin(n_y\pi y),
\quad
f(x,y,t) \;=\; 0.
$$
带入 $u(x,y,t) = a(t)\,\sin(n_x\pi x)\,\sin(n_y\pi y)$ 后，有
$$
\bigl(\partial_t - \Delta\bigr)\,u(x,y,t)
\;=\;
\bigl(\partial_t - \Delta\bigr)\,\bigl[a(t)\,\sin(n_x\pi x)\,\sin(n_y\pi y)\bigr]
\;=\;
\bigl[a'(t) + (n_x^2 + n_y^2)\,\pi^2\,a(t)\bigr]\,
\sin(n_x\pi x)\,\sin(n_y\pi y).
$$

要使它等于 $f(x,y,t)=0$，必须满足

$$
a'(t) + (n_x^2 + n_y^2)\,\pi^2\,a(t) = 0,
$$

并由于初始条件 $a(0)=1$，将此方程对时间积分可得

$$
a(t) = e^{-(n_x^2 + n_y^2)\,\pi^2\,t}.
$$

换言之，如果初始条件是若干正弦函数之积，则解依旧保持该形状，并以已知的时间依赖衰减。这对在网格与时间步足够细时进行验证非常方便。

如果在时间积分方案中（例如对各项的 $\theta$ 或 $k$ 系数）出错，往往会导致解的时间衰减不准确。通过比较不同步长或网格尺寸时解在某一点的数值演化，可以检查衰减是否翻倍或减半。由于此测试中边界条件和右端项都为零，因此错误不太可能来自这两处。

* **设置$u_0=0$，以及$g=0$, 检查是否是右端项出现问题**

若确认时间积分器正确，可接着考虑右端项非零而初始条件为零的情形：$u_0(x,y) = 0$ 并 $f(x,y,t) = \sin(n_x\pi x)\sin(n_y\pi y)$。再次有
$$
\bigl(\partial_t - \Delta\bigr)\,u(x,y,t)
\;=\;
\bigl[a'(t) + (n_x^2 + n_y^2)\,\pi^2\,a(t)\bigr]\,
\sin(n_x\pi x)\,\sin(n_y\pi y).
$$
要使它等于 $f(x,y,t)$，需满足
$$
a'(t) + (n_x^2 + n_y^2)\,\pi^2\,a(t) = 1,
$$
并且初始条件 $a(0)=0$。对该方程做时间积分得到
$$
a(t) = \frac{1}{(n_x^2 + n_y^2)\,\pi^2}\,
\Bigl[\,1 - e^{-(n_x^2 + n_y^2)\,\pi^2\,t}\Bigr].
$$
同样，如果对右端项前的 $\theta$ 或 $k$ 系数处理错误，解的时间行为将不再准确，或者会收敛到错误的最大值，而不是
$$
\frac{1}{(n_x^2 + n_y^2)\,\pi^2}.
$$

在确认时间积分和右端项的处理均无问题后，我们可以使用类似思路来验证边界值的处理。

## 测试算例

在简单区域上用简单的右端项解热方程，通常会得到解快速变平滑且变化不大的结果。因此，这里我们选择在一个 L 形区域内求解热方程，边界条件与初始条件都为零，而右端项定义为

$$
f(x, t) =
\begin{cases}
\chi_1(x) & \text{if } 0 \leq t \leq 0.2\tau \text{ or } \tau \leq t \leq 1.2\tau \text{ or } 2\tau \leq t \leq 2.2\tau, \text{ etc.} \\
\chi_2(x) & \text{if } 0.5\tau \leq t \leq 0.7\tau \text{ or } 1.5\tau \leq t \leq 1.7\tau \text{ or } 2.5\tau \leq t \leq 2.7\tau, \text{ etc.} \\
0 & \text{otherwise.}
\end{cases}
$$

$$
\chi_1(x) =
\begin{cases}
1 & \text{if } x > 0.5 \text{ and } y > -0.5, \\
0 & \text{otherwise.}
\end{cases}
$$

$$
\chi_2(x) =
\begin{cases}
1 & \text{if } x > -0.5 \text{ and } y > 0.5, \\
0 & \text{otherwise.}
\end{cases}
$$


换言之，在每个长度为 $\tau$ 的周期里，右端项先在区域 1 上开启，然后关闭，再在区域 2 上开启，随后再次关闭。在结果部分中可以通过一个小动画直观地看到这一模式。

如果将热方程视为导体中随时间和空间变化的温度分布，那么上述测试用例对应一个 L 形区域，其边界温度始终保持在零，而在域的两个部分交替加热。加热时，这些位置的温度上升，随后向周围扩散并下降。这些初始条件的关键之处在于，解在时间（热源开关）和空间（凹角及边界、顶点等）都具有奇异性。




<!--stackedit_data:
eyJoaXN0b3J5IjpbNjE4NzM3Mzg2LC05ODkzNzk3MTgsLTI1Mz
IxMjkxMywtMTQ3NTEyMzQ3OCwtNDM2MTU5MzEzLC0xOTA0NTc5
MDM3LDExOTQ0MTM2MjksLTQxNzg2NzM4MV19
-->