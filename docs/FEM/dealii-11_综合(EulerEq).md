# step-33, Euler equation


# 引言

## 欧拉流动

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
\end{pmatrix}.
$$
<!--stackedit_data:
eyJoaXN0b3J5IjpbNDU5NDQ5MTk1LDExMDExOTA4NTddfQ==
-->