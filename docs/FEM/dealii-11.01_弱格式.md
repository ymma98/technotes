# dealii-11.01 弱格式

> step-33 几乎包含了所有构造有限元求解器需要掌握的内容, 因此详细学习该 tutorial.

## 常用公式

* gradient

$$
\nabla f(\mathbf{x}) = \frac{\partial f(\mathbf{x})}{\partial x_i} = f_{,i}(\mathbf{x}) \mathbf{e}_i
$$

$$
\nabla f(\mathbf{x}) =
\begin{bmatrix}
    f_{,1} \\
    f_{,2} \\
    f_{,3}
\end{bmatrix}
$$

$$
\nabla \mathbf{f}(\mathbf{x}) = \frac{\partial f_i(\mathbf{x})}{\partial x_j} = f_{i,j}(\mathbf{x}) \mathbf{e}_i \otimes \mathbf{e}_j
$$

$$
\nabla \mathbf{f}(\mathbf{x}) =
\begin{bmatrix}
    f_{1,1} & f_{1,2} & f_{1,3} \\
    f_{2,1} & f_{2,2} & f_{2,3} \\
    f_{3,1} & f_{3,2} & f_{3,3}
\end{bmatrix}
$$

* divergence

$$
\text{div}(\mathbf{f}(\mathbf{x})) = \text{tr}(\nabla \mathbf{f}(\mathbf{x})) = \nabla \mathbf{f}(\mathbf{x}) : \mathbf{I}
$$

$$
\text{div}(\mathbf{f}(\mathbf{x})) = f_{i,i}(\mathbf{x}) = f_{1,1} + f_{2,2} + f_{3,3}
$$

$$
\text{div}(\mathbf{F}(\mathbf{x})) = \text{tr}(\nabla \mathbf{F}(\mathbf{x})) = \nabla \mathbf{F}(\mathbf{x}) : \mathbf{I}
$$

$$
\text{div}(\mathbf{F}(\mathbf{x})) = F_{ij,j}(\mathbf{x}) =
\begin{bmatrix}
    F_{11,1} + F_{12,2} + F_{13,3} \\
    F_{21,1} + F_{22,2} + F_{23,3} \\
    F_{31,1} + F_{32,2} + F_{33,3}
\end{bmatrix}
$$

* Laplace

$$
\Delta f(\mathbf{x}) = \text{div}(\nabla f(\mathbf{x})) = f_{,ii} = f_{,11} + f_{,22} + f_{,33}
$$

$$
\Delta \mathbf{f}(\mathbf{x}) = \text{div}(\nabla (\mathbf{f}(\mathbf{x}))) = f_{i,jj}
$$

$$
\Delta \mathbf{f}(\mathbf{x}) =
\begin{bmatrix}
    f_{1,11} + f_{1,22} + f_{1,33} \\
    f_{2,11} + f_{2,22} + f_{2,33} \\
    f_{3,11} + f_{3,22} + f_{3,33}
\end{bmatrix}
$$

* tensor

$$
\nabla (\alpha \mathbf{u}) = \mathbf{u} \otimes \nabla \alpha + \alpha \nabla \mathbf{u}
$$

$$
\nabla (\mathbf{u} \cdot \mathbf{v}) = \mathbf{u} \cdot \nabla \mathbf{v} + \mathbf{v} \cdot \nabla \mathbf{u}
$$

$$
\text{div} (\alpha \mathbf{u}) = \alpha \text{div}(\mathbf{u}) + \mathbf{u} \cdot \nabla \alpha
$$

$$
\text{div} (\alpha \mathbf{A}) = \alpha \text{div}(\mathbf{A}) + \mathbf{A} \cdot \nabla \alpha
$$

$$
\text{div} (\mathbf{u} \cdot \mathbf{A}) = \mathbf{u} \cdot \text{div}(\mathbf{A}) + \mathbf{A} : \nabla \mathbf{u}
$$

$$
\text{div} (\mathbf{u} \otimes \mathbf{v}) = \mathbf{u} \text{div}(\mathbf{v}) + \mathbf{v} \cdot \nabla \mathbf{u}^{\text{T}}
$$



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
eyJoaXN0b3J5IjpbLTE5NDg2MjQ2OTcsLTE4NjUwNDUzNTgsMT
gxMzU1NDM3MCwzOTA1Mzc2ODIsMTcxNTY1NjcyOCwtNjY5NzQ3
MDQ3LC0xNzM4OTY1OTc4XX0=
-->