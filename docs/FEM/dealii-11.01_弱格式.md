# dealii-11.01 弱格式

> step-33 几乎包含了所有构造有限元求解器需要掌握的内容, 因此详细学习该 tutorial.

## 常用弱格式推导公式




## Euler equation 弱格式推导

描述可压缩无粘气体运动的方程（即气体动力学的欧拉方程）是一组基本的守恒定律系统。在空间维度 $d$ 下，其形式为：

$$
\partial_t \mathbf{w} + \nabla \cdot \mathbf{F}(\mathbf{w}) = \mathbf{G}(\mathbf{w}),
$$

其中解向量 $\mathbf{w} = (\rho v_1, \ldots, \rho v_d, \rho, E)^T$ 包含以下物理量：  
- $\rho$ 为流体密度  
- $\mathbf{v} = (v_1, \ldots, v_d)^T$ 为流速（因此 $\rho\mathbf{v}$ 表示线性动量密度）  
- $E$ 为气体的能量密度 

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
其中 $g = (g_1, g_2, g_3)^T$ 表示重力向量。

$$
\mathbf{F}(\mathbf{w}) = 
\begin{pmatrix}
\rho \mathbf{v} \otimes \mathbf{v} + p \mathbf{I} \\[6pt]
\rho \mathbf{v} \\[6pt]
(E+p)\mathbf{v}
\end{pmatrix}
$$

将我们的守恒方程与一个（向量值）测试函数 $\mathbf{z} \in V_h$ 做内积。然后，我们进行分部积分，

$$
\partial_t \mathbf{w} + \nabla \cdot \mathbf{F}(\mathbf{w}) 
$$

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dV + \int_{\Omega} \nabla \cdot \mathbf{F}(\mathbf{w}) \cdot \mathbf{z} \, dV
$$

对上式第二项应用分部积分，将导数从 $\mathbf{F}(\mathbf{w})$ 转移到测试函数 $\mathbf{z}$ 上：

$$
\int_{\Omega} \nabla \cdot \mathbf{F}(\mathbf{w}) \cdot \mathbf{z} \, dx =- \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx+ \int_{\partial \Omega} (\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}) \cdot \mathbf{z} \, ds
$$

因此弱形式变为: 

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dx- \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx+ \int_{\partial \Omega} (\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}) \cdot \mathbf{z} \, ds = 0
$$






<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE4NjUwNDUzNTgsMTgxMzU1NDM3MCwzOT
A1Mzc2ODIsMTcxNTY1NjcyOCwtNjY5NzQ3MDQ3LC0xNzM4OTY1
OTc4XX0=
-->