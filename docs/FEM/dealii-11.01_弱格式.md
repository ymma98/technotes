# dealii-11.01 弱格式

> step-33 几乎包含了所有构造有限元求解器需要掌握的内容, 因此详细学习该 tutorial.

```mermaid
graph TD
    main[main 程序入口] --> ConservationLaw
    ConservationLaw --> Parameters
    ConservationLaw --> EulerEquations
    Parameters --> Solver
    Parameters --> Refinement
    Parameters --> Flux
    Parameters --> Output
    EulerEquations --> Postprocessor
```

- `EulerEquations` 类：封装所有完全描述欧拉方程特性的内容，包括通量矩阵 $\mathbf{F}(\mathbf{W})$，数值通量 $\mathbf{F}(\mathbf{W}^+, \mathbf{W}^-, \mathbf{n})$，右端项 $\mathbf{G}(\mathbf{W})$，边界条件，加密指标以及后处理输出等需要了解解向量和方程各分量意义的内容。

- Parameters 模块, 处理程序运行所需的参数，包括：
    -   `Solver`: 求解器相关参数
    -   `Refinement`: 网格细化相关参数
    -   `Flux`: 通量计算相关稳定性参数
    -   `Output`: 输出控制参数
	-   一个综合结构 `AllParameters` 集合了所有参数的管理和解析。

- `ConservationLaw` 类：实现守恒律问题的主程序，包括系统设置、装配系统、求解、网格细化、自适应调整、结果输出等核心功能。

`ConservationLaw` 的写法使得我们可以相对容易地将其改为适用于另一组方程：只需为其他双曲方程重新实现 `EulerEquations` 类的成员，或者通过添加新的方程（例如对额外变量的输运，或者加入化学反应等）来扩展当前方程即可。然而，这样的修改不会影响时间步进或非线性求解（只要实现正确），因此也无需修改 `ConservationLaw` 中的任何内容。

同样，如果我们想改进线性或非线性求解器，或者像在 results 小节末尾所暗示的那样改进时间步进方案，那么这也不需要对 `EulerEquations` 做任何改动。


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
- $E$ 为气体的能量密度， $E = p/(\gamma-1)+\rho \mathbf{v}^2/2$

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

* 边界项中，$\mathbf{F}(\mathbf{w})\rightarrow \mathbf{H}(\mathbf{w}^+,\mathbf{w}^-, \mathbf{n})$, 从而边界项变为 $\int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds$， $\mathbf{w}^+$ 是内侧解
	* 其中, $\mathbf{H}$ 是 Lax–Friedrichs 通量, $\mathbf{H}(\mathbf{a}, \mathbf{b}, \mathbf{n})
= \tfrac12\Bigl(\mathbf{F}(\mathbf{a})\cdot \mathbf{n} + \mathbf{F}(\mathbf{b})\cdot \mathbf{n} + \alpha \,\bigl(\mathbf{a}-\mathbf{b}\bigr)\Bigr)$。如果内侧解更大, $\alpha \,\bigl(\mathbf{w^+}-\mathbf{w^-}\bigr)$  就会增加输运, 减小内外梯度
	* $\alpha$ 要么是输入文件中给定的常数，要么是与网格相关的量。在后者情况下，它可取为 $-\tfrac{h}{2\,\delta t}$，其中 $h$ 是施加该通量的面的直径，$\delta t$ 是当前时间步
* 在原始的微分方程左侧添加一项 $-h^\eta \Delta \mathbf{w}$, 从而, $\int \Delta \mathbf{w} \cdot \mathbf{z} d\Omega =\int_{\partial \Omega} \nabla \mathbf{w}\cdot \mathbf{z} \cdot \mathbf{n} dS - \int \nabla \mathbf{w} : \nabla \mathbf{z}d\Omega$. 因为 $\mathbf{z}$ 在边界处为 0，所以相当于在弱格式方程中增加了一项 $h^\eta \int \nabla \mathbf{w} : \nabla \mathbf{z}d\Omega$

由此, 原弱格式变为

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dx - \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx + h^\eta \int_{\Omega} \nabla \mathbf{w} : \nabla z \, dx + \int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds \approx \int_{\Omega}\mathbf{G}\mathbf{w}\cdot \mathbf{z} dx
$$

将空间项表示为 $\mathbf{B(w_n)}$, 有:

$$
\mathbf{B(w_n)} = - \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx + h^\eta \int_{\Omega} \nabla \mathbf{w} : \nabla z \, dx + \int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds - \int_{\Omega}\mathbf{G}\mathbf{w}\cdot \mathbf{z} dx
$$

于是弱格式变为

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dx + \mathbf{B(w_n)} =0
$$

使用 $\theta-$implicit method, 有

$$
\int_\Omega \frac{\mathbf{w_{n+1} - \mathbf{w_n}}}{\delta t} \cdot \mathbf{z} dx + \theta \mathbf{B(w_{n+1})} + (1-\theta) \mathbf{B(w_{n})} = 0
$$

此时，相当于求解非线性方程组: 

$$
\mathbf{R(w_{n+1})} = \int_\Omega \frac{\mathbf{w_{n+1} - \mathbf{w_n}}}{\delta t} \cdot \mathbf{z} dx + \theta \mathbf{B(w_{n+1})} + (1-\theta) \mathbf{B(w_{n})} = 0
$$

根据牛顿迭代法，如果要求解非线性方程 (组),  $R(u) = 0$, 相当于求解

$$
\frac{dR(u)}{du} \delta u = -R(u)
$$

其中 $\frac{dR(u)}{du}$ 是 $R(u)$ 关于 u 的 Jacobian. 


对于本问题，牛顿迭代的第 $k$ 步对应于:

$$
\mathbf{W}_{n+1}^{k+1}
= \mathbf{W}_{n+1}^k + \delta \mathbf{W}_{n+1}^k,
$$

$$
\mathbf{R}'\bigl(\mathbf{W}_{n+1}^k\bigr)\,\delta \mathbf{W}_{n+1}^k
= -\,\mathbf{R}\bigl(\mathbf{W}_{n+1}^k\bigr).
$$

通常，该线性方程组既不对称也没有特定的正定性。只能使用直接求解器或 Trilinos 的 GMRES 方法来求解它。










<!--stackedit_data:
eyJoaXN0b3J5IjpbLTczNDY2NTc5NCwtMTYzMDM4NjM1NCwxMz
cxNTUzMDg2LC01MjE1MjE0ODMsMjAzMTA0MTA3NywtMTMzNjg5
MDQ5OSwxMTkxMzgxNzI1LC0zMjYxODAyMDYsLTk5NDAxNzk1NS
wtMTk0ODYyNDY5NywtMTg2NTA0NTM1OCwxODEzNTU0MzcwLDM5
MDUzNzY4MiwxNzE1NjU2NzI4LC02Njk3NDcwNDcsLTE3Mzg5Nj
U5NzhdfQ==
-->