# dealii-11.01 弱格式

> step-33 几乎包含了所有构造有限元求解器需要掌握的内容, 因此详细学习该 tutorial.

## 常用公式

**consider scalar, vector and 2nd order tensor field on** $\mathcal{B} \in \mathbb{R}^3$

$$
\alpha : \mathcal{B} \to \mathbb{R}
$$

$$
\mathbf{u} : \mathcal{B} \to \mathbb{R}^3
$$

$$
\mathbf{v} : \mathcal{B} \to \mathbb{R}^3
$$

$$
\mathbf{A} : \mathcal{B} \to \mathbb{R}^3 \otimes \mathbb{R}^3
$$

$$
\alpha : \mathbf{x} \mapsto \alpha \left( \mathbf{x} \right)
$$

$$
\mathbf{u} : \mathbf{x} \mapsto \mathbf{u} \left( \mathbf{x} \right)
$$

$$
\mathbf{v} : \mathbf{x} \mapsto \mathbf{v} \left( \mathbf{x} \right)
$$

$$
\mathbf{A} : \mathbf{x} \mapsto \mathbf{A} \left( \mathbf{x} \right)
$$


- **consider scalar- and vector field in domain** $\mathcal{B} \in \mathbb{R}^3$

$$
f : \mathcal{B} \to \mathbb{R}
$$

$$
f : \mathcal{B} \to \mathbb{R}^3
$$

$$
f : \mathbf{x} \mapsto f \left( \mathbf{x} \right)
$$

$$
f : \mathbf{x} \mapsto f \left( \mathbf{x} \right)
$$


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

$$
\nabla \cdot (\nabla \mathbf{w}) \cdot \mathbf{v} = \Delta \mathbf{w} \cdot \mathbf{v} = \nabla \cdot (\nabla \mathbf{w} \cdot \mathbf{v}) - \nabla \mathbf{w} : \nabla \mathbf{v}
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

$$
\left( \alpha \, u_i \right)_{,j} = u_i \, \alpha_{,j} + \alpha \, u_{i,j}
$$

$$
\left( u_i \, v_i \right)_{,j} = u_i \, v_{i,j} + v_i \, u_{i,j}
$$

$$
\left( \alpha \, u_i \right)_{,i} = \alpha \, u_{i,i} + u_i \, \alpha_{,i}
$$

$$
\left( \alpha \, A_{ij} \right)_{,j} = \alpha \, A_{ij,j} + A_{ij} \, \alpha_{,j}
$$

$$
\left( u_i \, A_{ij} \right)_{,j} = u_i \, A_{ij,j} + A_{ij} \, u_{i,j}
$$

$$
\left( u_i \, v_j \right)_{,j} = u_i \, v_{j,j} + v_j \, u_{i,j}
$$



$$
\int_{\partial \mathcal{B}} \alpha \mathbf{n} \, dA = \int_{\mathcal{B}} \nabla \alpha \, dV \quad \text{green}
$$

$$
\int_{\partial \mathcal{B}} \mathbf{u} \cdot \mathbf{n} \, dA = \int_{\mathcal{B}} \text{div}(\mathbf{u}) \, dV \quad \text{gauss}
$$

$$
\int_{\partial \mathcal{B}} \mathbf{A} \cdot \mathbf{n} \, dA = \int_{\mathcal{B}} \text{div}(\mathbf{A}) \, dV \quad \text{gauss}
$$

$$
\int_{\partial \mathcal{B}} \alpha \, n_i \, \mathrm{d}A = \int_{\mathcal{B}} \alpha_{,i} \, \mathrm{d}V
$$

$$
\int_{\partial \mathcal{B}} u_i \, n_i \, \mathrm{d}A = \int_{\mathcal{B}} u_{i,i} \, \mathrm{d}V
$$

$$
\int_{\partial \mathcal{B}} A_{ij} \, n_j \, \mathrm{d}A = \int_{\mathcal{B}} A_{ij,j} \, \mathrm{d}V
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

为了数值稳定性，对以上弱格式作以下处理：

* 边界项中，$\mathbf{F}(\mathbf{w})\rightarrow \mathbf{H}(\mathbf{w}^+,\mathbf{w}^-, \mathbf{n})$, 从而边界项变为 $\int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds$
	* 其中, $\mathbf{H}$ 是 Lax–Friedrichs 通量, $\mathbf{H}(\mathbf{a}, \mathbf{b}, \mathbf{n})
= \tfrac12\Bigl(\mathbf{F}(\mathbf{a})\cdot \mathbf{n} + \mathbf{F}(\mathbf{b})\cdot \mathbf{n} + \alpha \,\bigl(\mathbf{a}-\mathbf{b}\bigr)\Bigr)$
	* $\alpha$ 要么是输入文件中给定的常数，要么是与网格相关的量。在后者情况下，它可取为 $-\tfrac{h}{2\,\delta t}$，其中 $h$ 是施加该通量的面的直径，$\delta t$ 是当前时间步
* 在原始的微分方程左侧添加一项 $-\Delta \mathbf{w}$, 从而, $\int \Delta \mathbf{w} \cdot \mathbf{z} d\Omega =\int_{\partial \Omega} \nabla \mathbf{w}\cdot \mathbf{z} \cdot \mathbf{n} dS - \int \nabla \mathbf{w} :\mathbf{z}d\Omega$






<!--stackedit_data:
eyJoaXN0b3J5IjpbLTY1NzA2MTI4OCwtMzI2MTgwMjA2LC05OT
QwMTc5NTUsLTE5NDg2MjQ2OTcsLTE4NjUwNDUzNTgsMTgxMzU1
NDM3MCwzOTA1Mzc2ODIsMTcxNTY1NjcyOCwtNjY5NzQ3MDQ3LC
0xNzM4OTY1OTc4XX0=
-->