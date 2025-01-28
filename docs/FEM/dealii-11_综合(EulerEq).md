# step-33, Euler equation



## 理论

描述可压缩无粘气体运动的方程（即气体动力学的欧拉方程）是一组基本的守恒定律系统。在空间维度 $d$ 下，其形式为：

$$
\partial_t \mathbf{w} + \nabla \cdot \mathbf{F}(\mathbf{w}) = \mathbf{G}(\mathbf{w}),
$$

其中解向量 $\mathbf{w} = (\rho v_1, \ldots, \rho v_d, \rho, E)^T$ 包含以下物理量：  
- $\rho$ 为流体密度  
- $\mathbf{v} = (v_1, \ldots, v_d)^T$ 为流速（因此 $\rho\mathbf{v}$ 表示线性动量密度）  
- $E$ 为气体的能量密度  

该方程组可具体展开为：
$$
\partial_t \mathbf{w}_i + \nabla \cdot \mathbf{F}_i(\mathbf{w}) = \mathbf{G}_i(\mathbf{w}), \quad i = 1, \ldots, \text{dim} + 2.
$$

对于欧拉方程，通量矩阵 $\mathbf{F}$（或通量函数系统）定义为（以 $d = 3$ 为例）：
$$
\mathbf{F}(\mathbf{w}) = 
\begin{pmatrix}
\rho v_1^2 + p & \rho v_2 v_1 & \rho v_3 v_1 \\
\rho v_1 v_2 & \rho v_2^2 + p & \rho v_3 v_2 \\
\rho v_1 v_3 & \rho v_2 v_3 & \rho v_3^2 + p \\
\rho v_1 & \rho v_2 & \rho v_3 \\
(E + p)v_1 & (E + p)v_2 & (E + p)v_3
\end{pmatrix},
$$

右侧源项仅考虑重力效应时，其形式为：
$$
\mathbf{G}(\mathbf{w}) = 
\begin{pmatrix}
g_1 \rho \\
g_2 \rho \\
g_3 \rho \\
0 \\
\rho \mathbf{g} \cdot \mathbf{v}
\end{pmatrix},
$$
其中 $g = (g_1, g_2, g_3)^T$ 表示重力向量。由此，完整的方程组为：

$$
\partial_t (\rho v_1) + \sum_{i=1}^d \frac{\partial (\rho v_i v_i + \delta u_i v_i)}{\partial x_i} = g_i \rho, \quad i = 1, \ldots, d,
$$

$$
\partial_t \rho + \sum_{i=1}^d \frac{\partial (\rho v_i v_i)}{\partial x_i} = 0,
$$

$$
\partial_t E + \sum_{i=1}^d \frac{\partial ((E + p)v_i)}{\partial x_i} = \rho g \cdot v.
$$

这些方程分别描述了动量、质量和能量的守恒。系统通过定义压力的关系闭合：
$$
p = (\gamma - 1)\left(E - \frac{1}{2} \rho |\mathbf{v}|^2\right).
$$
对于空气（主要由氮气和氧气组成）和其他双原子气体，比热容比为 $\gamma = 1.4$。

### 离散化

离散化的过程与通常方式相同，需要考虑这是一个与 step-12 中讨论的简单问题相同类型的双曲问题。我们选择一个有限元空间 $V_h$，并将我们的守恒方程与一个（向量值）测试函数 $\mathbf{z} \in V_h$ 做内积。然后，我们进行分部积分，

$$
\partial_t \mathbf{w} + \nabla \cdot \mathbf{F}(\mathbf{w}) = 0
$$

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dx + \int_{\Omega} \nabla \cdot \mathbf{F}(\mathbf{w}) \cdot \mathbf{z} \, dx = 0
$$

对上式第二项应用分部积分，将导数从 $\mathbf{F}(\mathbf{w})$ 转移到测试函数 $\mathbf{z}$ 上：

$$
\int_{\Omega} \nabla \cdot \mathbf{F}(\mathbf{w}) \cdot \mathbf{z} \, dx =- \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx+ \int_{\partial \Omega} (\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}) \cdot \mathbf{z} \, ds
$$

因此弱形式变为: 

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dx- \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx+ \int_{\partial \Omega} (\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}) \cdot \mathbf{z} \, ds = 0
$$


在边界 $\partial \Omega$ 上，直接使用 $\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}$ 可能导致数值不稳定，特别是在高对流流动非线性问题中。因此，引入数值通量 $\mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n})$，其中 $\mathbf{w}^+$ 和 $\mathbf{w}^-$ 分别表示边界两侧的解。

替换边界项:

$$
\int_{\partial \Omega} (\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}) \, z \, ds \approx \int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds
$$

这里，$z^+$ 通常表示测试函数在边界的上游侧值。

因此，弱形式变为:

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot z \, dx - \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla z \, dx + \int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds = 0
$$


直接使用弱形式可能在数值计算中引入不稳定性，尤其是在高对流流动非线性问题中。为了提高稳定性，通常会添加稳定化项，例如人工黏性或拉普拉斯扩散项。

在给定的方程中，添加了一个稳定化项 $h^\eta (\nabla \mathbf{w}, \nabla z)$，其中：

- $h$ 是网格尺寸。
- $\eta$ 是一个与问题相关的指数，通常用于控制稳定化项的强度。
- $(\nabla \mathbf{w}, \nabla \mathbf{z})$ 表示 $\mathbf{w}$ 和 $\mathbf{z}$ 的梯度的内积。

因此，最终的弱形式为：

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dx - \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx + h^\eta \int_{\Omega} \nabla \mathbf{w} : \nabla z \, dx + \int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds \approx 0
$$

这与用户提供的近似式相符。



并用数值通量 $\mathbf{H}$ 来近似边界通量：

$$
\int_{\Omega} (\partial_t \mathbf{w}, \mathbf{z}) + (\nabla \cdot \mathbf{F}(\mathbf{w}), \mathbf{z})
\approx
\int_{\Omega} (\partial_t \mathbf{w}, \mathbf{z}) - (\mathbf{F}(\mathbf{w}), \nabla \mathbf{z}) + h^\eta(\nabla \mathbf{w}, \nabla \mathbf{z}) + \int_{\partial \Omega} \bigl(\mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}), \mathbf{z}^+\bigr),
$$

其中，上标 $+$ 表示函数的内部迹，$-$ 表示外部迹。扩散项 $h^\eta(\nabla \mathbf{w}, \nabla \mathbf{z})$ 是为了稳定性而引入的，其中 $h$ 为网格尺寸，$\eta$ 为决定扩散量大小的参数。

在边界上，我们必须指定外侧迹 $\mathbf{w}^-$. 根据不同的边界条件，我们可以采用以下任一种方式：

- **流入边界（Inflow boundary）**：$\mathbf{w}^- = \text{desired value}.$
- **超音速流出边界（Supersonic outflow boundary）**：$\mathbf{w}^- = \mathbf{w}^+.$
- **亚音速流出边界（Subsonic outflow boundary）**：$\mathbf{w}^- = \mathbf{w}^+$，但能量分量需修改以满足给定压力 $p_o$，即
  $$
  \mathbf{w}^- = \bigl(\rho^+,\, \rho v_1^+,\, \dots,\, \rho v_d^+,\, p_o/(\gamma - 1) + 0.5\,\rho\,|\mathbf{v}^+|^2\bigr).
  $$
- **反射边界（Reflective boundary）**：设定 $\mathbf{w}^-$ 满足 $(\mathbf{v}^+ + \mathbf{v}^-)\cdot \mathbf{n} = 0$，且 $\rho^- = \rho^+$，$E^- = E^+$。



我们使用时间步进方法来代替上述方程中的时间导数。为简化起见，我们定义在时间步 $n$ 时的空间残差 $\mathbf{B}(\mathbf{w}_n)(\mathbf{z})$ (即与时间导数无关项的和)：

$$
\mathbf{B}(\mathbf{w}_n)(\mathbf{z})
= - \int_{\Omega} \bigl(\mathbf{F}(\mathbf{w}_n), \nabla \mathbf{z}\bigr)+ h^\eta \bigl(\nabla \mathbf{w}_n, \nabla \mathbf{z}\bigr)+ \int_{\partial \Omega} \bigl(\mathbf{H}(\mathbf{w}_n^+, \mathbf{w}_n^-, \mathbf{n}), \mathbf{z}\bigr)- \int_{\Omega} \bigl(\mathbf{G}(\mathbf{w}_n), \mathbf{z}\bigr).
$$

在每个时间步，我们的完整离散化要求对任意测试函数 $\mathbf{z}$ 所得到的残差为零：

$$
\mathbf{R}(\mathbf{W}_{n+1})(\mathbf{z})
= \int_{\Omega} \Bigl(\frac{\mathbf{w}_{n+1} - \mathbf{w}_n}{\delta t}, \mathbf{z}\Bigr)+ \theta \,\mathbf{B}(\mathbf{w}_{n+1})+ (1 - \theta)\,\mathbf{B}(\mathbf{w}_n)
= 0,
$$

其中 $\theta \in [0,1]$，且 $\mathbf{w}_i = \sum_{k} \mathbf{W}_i^k\,\phi_k.$ 选择 $\theta = 0$ 得到显式（前向）Euler 方案，$\theta = 1$ 对应稳定的隐式（后向）Euler 方案，$\theta = \tfrac12$ 对应 Crank–Nicolson 方案。

在下面的实现中，我们对通量函数 $\mathbf{H}$ 选择 Lax–Friedrichs 通量，即

$$
\mathbf{H}(\mathbf{a}, \mathbf{b}, \mathbf{n})
= \tfrac12\Bigl(\mathbf{F}(\mathbf{a})\cdot \mathbf{n} + \mathbf{F}(\mathbf{b})\cdot \mathbf{n} + \alpha \,\bigl(\mathbf{a}-\mathbf{b}\bigr)\Bigr),
$$

其中 $\alpha$ 要么是输入文件中给定的常数，要么是与网格相关的量。在后者情况下，它可取为 $-\tfrac{h}{2\,\delta t}$，其中 $h$ 是施加该通量的面的直径，$\delta t$ 是当前时间步。

基于上述选择，让残差为零即可得到非线性方程组 $\mathbf{R}(\mathbf{W}_{n+1}) = 0$。我们使用牛顿迭代（与 step-15 中相同的方法）来求解这一非线性方程组，即通过以下迭代：

$$
\mathbf{R}'\bigl(\mathbf{W}_{n+1}^k,\;\delta \mathbf{W}_{n+1}^k\bigr)(\mathbf{z})
= -\,\mathbf{R}\bigl(\mathbf{W}_{n+1}^k\bigr)(\mathbf{z})
\quad \forall\,\mathbf{z}\in V_h,
$$

$$
\mathbf{W}_{n+1}^{k+1}
= \mathbf{W}_{n+1}^k + \delta \mathbf{W}_{n+1}^k,
$$

直到 $\bigl|\mathbf{R}(\mathbf{W}_{n+1}^k)\bigr|$（残差）足够小为止。若仅使用有限元空间的节点基函数来检验，而不使用所有 $\mathbf{z}$，则可得到一个关于 $\delta \mathbf{W}$ 的线性方程组：

$$
\mathbf{R}'\bigl(\mathbf{W}_{n+1}^k\bigr)\,\delta \mathbf{W}_{n+1}^k
= -\,\mathbf{R}\bigl(\mathbf{W}_{n+1}^k\bigr).
$$

通常，该线性方程组既不对称也没有特定的正定性。我们将使用直接求解器或 Trilinos 的 GMRES 方法来求解它。正如后文所示，这种全隐式迭代往往收敛非常迅速（通常 3 步左右），并且具有牛顿方法所期望的二次收敛阶。





<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE4ODM5ODQzNjgsNjYxODg1OTg0LDUyMD
A0NTI1LDE4NjE4OTM4ODYsLTEzOTk0Njk0MjQsLTExOTc3Nzcx
OTIsMTU4NjIxNTcwMCw0NTk0NDkxOTUsMTEwMTE5MDg1N119
-->