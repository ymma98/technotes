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

离散化过程遵循常规方法，考虑到这是一个与 step-12 中讨论的简单问题类似的双曲问题。我们选择一个有限元空间 $V_A$，并将守恒律与（向量值）测试函数 $\mathbf{z} \in V_A$ 进行积分。然后通过分部积分，并用数值通量 $H$ 近似边界通量：

$$
\int_{\Omega} \left( \partial_t \mathbf{w}, \mathbf{z} \right) + \left( \nabla \cdot \mathbf{F}(\mathbf{w}), \mathbf{z} \right)
$$

近似为：
$$
\int_{\Omega} \left( \partial_t \mathbf{w}, \mathbf{z} \right) - \left( \mathbf{F}(\mathbf{w}), \nabla \mathbf{z} \right) + h^\eta \left( \nabla \mathbf{w}, \nabla \mathbf{z} \right) + \int_{\partial \Omega} \left( H(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}), \mathbf{z}^+ \right),
$$

其中上标 $+$ 表示函数的内侧迹，$-$ 表示外侧迹。扩散项 $h^\eta (\nabla \mathbf{w}, \nabla \mathbf{z})$ 完全为稳定性引入，其中 $h$ 是网格尺寸，$\eta$ 是控制扩散量的参数。

在边界上，需指定外侧迹 $\mathbf{w}^-$ 的值。根据边界条件，可设定以下类型之一：
- **流入边界**：$\mathbf{w}^-$ 被指定为期望值。
- **超音速流出边界**：$\mathbf{w}^- = \mathbf{w}^+$。
- **亚音速流出边界**：$\mathbf{w}^- = \mathbf{w}^+$，但能量变量被修改以支持预设压力 $p_\omega$，即：
- 
$$
\mathbf{w}^- = \left( \rho^+, \rho v_1^+, \ldots, \rho v_d^+, \frac{p_\omega}{\gamma - 1} + \frac{1}{2}\rho |\mathbf{v}^+|^2 \right).
$$

- **反射边界**：设定 $\mathbf{w}^-$ 使得 $(\mathbf{v}^+ + \mathbf{v}^-) \cdot \mathbf{n} = 0$，且 $\rho^- = \rho^+$，$E^- = E^+$。



通过时间步进格式替换方程中的时间导数。为简化，定义时间步 $n$ 的空间残量 $\mathbf{B}(\mathbf{w}_n)(\mathbf{z})$：

$$
\mathbf{B}(\mathbf{w}_n)(\mathbf{z}) = -\int_{\Omega} \left( \mathbf{F}(\mathbf{w}_n), \nabla \mathbf{z} \right) + h^\psi \left( \nabla \mathbf{w}_n, \nabla \mathbf{z} \right) + \int_{\partial \Omega} \left( H(\mathbf{w}_n^+, \mathbf{w}^-(\mathbf{w}_n^+), \mathbf{n}), \mathbf{z} \right) - \int_{\Omega} \left( \mathbf{G}(\mathbf{w}_n), \mathbf{z} \right).
$$

在每个时间步，全离散化要求残量对所有测试函数 $\mathbf{z}$ 为零：
$$
R(\mathbf{W}_{n+1})(\mathbf{z}) = \int_{\Omega} \left( \frac{\mathbf{w}_{n+1} - \mathbf{w}_n}{\delta t}, \mathbf{z} \right) + \theta \mathbf{B}(\mathbf{w}_{n+1})(\mathbf{z}) + (1 - \theta) \mathbf{B}(\mathbf{w}_n)(\mathbf{z}) = 0,
$$
其中 $\theta \in [0, 1]$，且 $\mathbf{w}_i = \sum_k \mathbf{W}_i^k \phi_k$。选择 $\theta = 0$ 对应显式（前向）欧拉格式，$\theta = 1$ 对应隐式（后向）欧拉格式，$\theta = \frac{1}{2}$ 对应 Crank-Nicolson 格式。

在下方实现中，选择 Lax-Friedrichs 通量作为函数 $H$，即：
$$
H(\mathbf{a}, \mathbf{b}, \mathbf{n}) = \frac{1}{2} \left( \mathbf{F}(\mathbf{a}) \cdot \mathbf{n} + \mathbf{F}(\mathbf{b}) \cdot \mathbf{n} + \alpha (\mathbf{a} - \mathbf{b}) \right),
$$
其中 $\alpha$ 可以是输入文件中指定的固定值，或与网格相关的值。后者情况下，$\alpha$ 被选为 $\frac{\lambda}{\delta \Omega^2}$，其中 $\lambda$ 是应用通量的面直径，$\delta \Omega^2$ 是当前时间步长。

通过这些选择，将残量设为零得到一个非线性方程组 $R(\mathbf{W}_{n+1}) = 0$。我们通过牛顿迭代法（如 step-15 中所述）求解，即迭代：
$$
R'(\mathbf{W}_{n+1}^k, t) \delta \mathbf{W}_{n+1}^k (\mathbf{z}) = -R(\mathbf{W}_{n+1}^k)(\mathbf{z}), \quad \forall \mathbf{z} \in V_h,
$$

$$
\mathbf{W}_{n+1}^{k+1} = \mathbf{W}_{n+1}^k + t \delta \mathbf{W}_{n+1}^k,
$$
直到残量 $|R(\mathbf{W}_{n+1}^k)|$ 足够小。通过使用有限元空间的节点基函数测试（而非所有 $\mathbf{z}$），得到关于 $\delta \mathbf{W}$ 的线性系统：
$$
\mathbf{R}'(\mathbf{W}_{n+1}^k) \delta \mathbf{W}_{n+1}^k = -\mathbf{R}(\mathbf{W}_{n+1}^k).
$$

该线性系统通常非对称且无特定定性性质。我们使用直接求解器或 Trilinos 的 GMRES 实现进行求解。如下方结果所示，此全隐式迭代收敛极快（通常 3 步内），并具有牛顿法预期的二次收敛阶。
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTk4MTYwMzg1Nyw0NTk0NDkxOTUsMTEwMT
E5MDg1N119
-->