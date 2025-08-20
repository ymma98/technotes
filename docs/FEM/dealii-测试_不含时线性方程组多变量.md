# dealii-测试_不含时线性方程组-多变量


## 弱格式

对应 Xiaoming He Chapter 6: Finite elements for 2D steady Stokes equation 

原始方程:

$$
-2 \, \mathrm{div}\,\varepsilon(\mathbf{u}) + \nabla p = \mathbf{f}, \\
-\mathrm{div}\,\mathbf{u} = 0,
$$

其中 $\epsilon(\mathbf{u}) = \frac{1}{2}(\nabla \mathbf{u} + \nabla \mathbf{u}^T)$, $\epsilon_{ij} = \frac{1}{2}(\partial_j u_i + \partial_i u_j)$

测试函数为 $\vec{\phi} = (\vec{v},q)^T$, 即, 对第一个式子点积 $\vec{v}$, 对第二个式子乘以 $q$, **然后相加**，得到:

$$
(\mathbf{v}, -2 \, \mathrm{div}\,\varepsilon(\mathbf{u}) + \nabla p)_\Omega - (q, \mathrm{div}\,\mathbf{u})_\Omega 
= (\mathbf{v}, \mathbf{f})_\Omega,
$$

对 $\nabla p$ 项应用分部积分，

$$
(\mathbf{v}, -2 \, \mathrm{div}\,\varepsilon(\mathbf{u}))_\Omega - (\mathrm{div}\,\mathbf{v}, p)_\Omega + (\mathbf{n}\cdot\mathbf{v}, p)_{\partial\Omega} - (q, \mathrm{div}\,\mathbf{u})_\Omega
= (\mathbf{v}, \mathbf{f})_\Omega.
$$

之后对第一项应用分部积分 ($\epsilon^T = \epsilon$)

$$
(\nabla\cdot\epsilon)\cdot \vec{v} = (\partial_j\epsilon_{ij}) v_i = \partial_j(\epsilon_{ij} v_i) - \epsilon_{ij} \partial_j v_i  = \nabla \cdot (\vec{v}\cdot \epsilon^T) - \epsilon :\vec{v} = \nabla \cdot (\vec{v}\cdot \epsilon) - \epsilon :\vec{v}
$$

因为 $(\vec{v}\cdot \epsilon)\cdot \vec{n} = v_j \epsilon_{ij} n_i = n_i v_j \epsilon_{ij} = \vec{n}\otimes \vec{v} : \epsilon$, 所以弱格式化为:

$$
(\nabla \mathbf{v}, 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathbf{n} \otimes \mathbf{v}, 2 \, \varepsilon(\mathbf{u}))_{\partial\Omega} - (\mathrm{div}\,\mathbf{v}, p)_\Omega + (\mathbf{n}\cdot\mathbf{v}, p)_{\partial\Omega} - (q, \mathrm{div}\,\mathbf{u})_\Omega
= (\mathbf{v}, \mathbf{f})_\Omega,
$$

这里应用一个结论，一个张量总可以分为对称部分+反对称部分，$\mathbf{A}=\mathbf{A}_{sym}+\mathbf{A}_{skew}$, $\mathbf{A}_{sym} = \frac{1}{2} (\mathbf{A} + \mathbf{A}^T)$, $\mathbf{A}_{skew} = \frac{1}{2} (\mathbf{A} - \mathbf{A}^T)$, 一个任意张量双点积一个对称张量，等于这个张量的对称部分双点积这个对称张量，于是弱格式进一步化为

$$
(\varepsilon(\mathbf{v}), 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathbf{n} \otimes \mathbf{v}, 2 \, \varepsilon(\mathbf{u}))_{\partial\Omega} - (\mathrm{div}\,\mathbf{v}, p)_\Omega + (\mathbf{n}\cdot\mathbf{v}, p)_{\partial\Omega} - (q, \mathrm{div}\,\mathbf{u})_\Omega
= (\mathbf{v}, \mathbf{f})_\Omega,
$$

如果观察除了边界项之外的项，可以发现 $\vec{v}$ 和 $\vec{u}$ 可以互换, $q$ 和 $p$ 可以互换, 最后得到的矩阵一定是对称的 (只有 test function 和 trial function 是函数, 其它都只带来常数项，只要函数的形式是对称的, 那么矩阵一定是对称的). 

我们可以把边界项化为更有意义的形式 (用应力张量表达 F/m^2)

$$ -(\mathbf{n} \otimes \mathbf{v}, 2 \, \varepsilon(\mathbf{u}))_{\Gamma_N} + (\mathbf{n} \cdot \mathbf{v}, p)_{\Gamma_N} = \sum_{i,j=1}^{d} - (n_i v_j, 2 \, \varepsilon(\mathbf{u})_{ij})_{\Gamma_N} + \sum_{i}^{d} (n_i v_i, p)_{\Gamma_N}
$$

$$= \sum_{i,j=1}^{d} - (n_i v_j, 2 \, \varepsilon(\mathbf{u})_{ij})_{\Gamma_N}+ \sum_{i,j=1}^{d} (n_i v_j, p \, \delta_{ij})_{\Gamma_N}
$$

$$
= \sum_{i,j=1}^{d} (n_i v_j, p \, \delta_{ij} - 2 \, \varepsilon(\mathbf{u})_{ij})_{\Gamma_N}
$$

$$
= (\mathbf{n} \otimes \mathbf{v}, p \, \mathbf{I} - 2 \, \varepsilon(\mathbf{u}))_{\Gamma_N}
$$

$$
= (\mathbf{v}, \mathbf{n} \cdot [p \mathbf{I} - 2 \, \varepsilon(\mathbf{u})])_{\Gamma_N}.
$$

 于是 
$$
\mathbf{n} \cdot \bigl[p \mathbf{I} - 2 \, \varepsilon(\mathbf{u})\bigr] 
= \mathbf{g}_N 
\quad \text{on } \Gamma_N.
$$

$\mathbf{g}_N$ 是作用在表面上的力 (N/m^2)， $\vec{n}$ 无量纲 $\int \nabla \cdot \mathbf{T} dV = \int \mathbf{T}\cdot \vec{n} dS$. 最终的弱格式表示为:

$$
(\varepsilon(\mathbf{v}), 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathrm{div}\,\mathbf{v}, p)_\Omega - (q, \mathrm{div}\,\mathbf{u})_\Omega = (\mathbf{v}, \mathbf{f})_\Omega - (\mathbf{v}, \mathbf{g}_N)_{\Gamma_N}.
$$

在 Dirichlet BC 下, $\mathbf{v} = 0$. 对于 Neumann BC, 需要约束 $\mathbf{g_N}$, 注意因为原始方程中只有 $\nabla p$, 因此必须在边界某处指定 $p$ 为 Dirichlet BC. 

还有一种特殊的边界条件: partial boundary onditions 或者滑移边界条件 (slip boundary condition), 相当于 Dirichlet BC+Neumann BC, 只约束特定方向的 $\vec{u}$. 如果像一条水管那样，需要约束 $\vec{u}_t  = \vec{u} - \vec{n}(\vec{u}\cdot\vec{n}) = (\mathbf{I} - \vec{n} \otimes \vec{n}) \cdot \vec{u}$  (注:  $\vec{a} \otimes \vec{b} \cdot \vec{c} = \vec{a} (\vec{b} \cdot \vec{c})$)

此时有:

$$
\mathbf{u}_t = 0, \\
\mathbf{n} \cdot \bigl(\mathbf{n} \cdot [p\mathbf{I} - 2 \, \varepsilon(\mathbf{u})]\bigr) = 0.
$$

对应的，类似于湖水的情况，有法向速度为0， 

$$
\mathbf{n} \cdot \mathbf{u} = 0, \\
( \mathbf{I} - \mathbf{n} \otimes \mathbf{n} ) \cdot
\bigl( \mathbf{n} \cdot [p\mathbf{I} - 2 \, \varepsilon(\mathbf{u})] \bigr) = 0.
$$

## 离散化

对于弱格式:

$$
(\varepsilon(\mathbf{v}), 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathrm{div}\,\mathbf{v}, p)_\Omega - (q, \mathrm{div}\,\mathbf{u})_\Omega = (\mathbf{v}, \mathbf{f})_\Omega - (\mathbf{v}, \mathbf{g}_N)_{\Gamma_N}.
$$

$$
\mathbf{g}_N  = \mathbf{n} \cdot \bigl[p \mathbf{I} - 2 \, \varepsilon(\mathbf{u})\bigr] 
\quad \text{on } \Gamma_N.
$$

$$\epsilon(\mathbf{u}) = \frac{1}{2}(\nabla \mathbf{u} + \nabla \mathbf{u}^T)$$

$$\epsilon_{ij} = \frac{1}{2}(\partial_j u_i + \partial_i u_j)$$


其中测试函数是 $\vec{\phi} = (\vec{v},q)^T$. 可以化为如下矩阵形式:

$$
\begin{pmatrix}
A & B^T \\
B & 0
\end{pmatrix}
\begin{pmatrix}
U \\
P
\end{pmatrix}=
\begin{pmatrix}
F \\
0
\end{pmatrix}
$$

如果 $\mathbf{u}= \sum\limits_{j}^{N_u} U_j \bm{\phi}_j$, $p=\sum\limits_{j}^{N_p} P_j \varphi_j$,  $\mathbf{v}=\bm{\phi}_i$ 则 

$$
U = \{U_j\}_{j=1}^{N_u}
$$

$$
P = \{P_j\}_{j=1}^{N_p}
$$

$$
A_{ij} = 2 \int \epsilon(\bm{\phi_i}):\epsilon(\bm{\phi_j}) dV
$$

$$
B^T_{ij} = -\int \nabla \cdot \bm{\phi_i} \varphi_j dV
$$

$$
F = \int \bm{v_i} \cdot \bm{f} dV - \int \bm{v}_i \cdot \bm{g}_N dS
$$



$$
B_i
$$
<!--stackedit_data:
eyJoaXN0b3J5IjpbMzAwMDcxODUxLDE0ODU0Njc4NjYsLTE2OT
A3Njk1ODQsMTY1MjE0OTkwOCwzMTA5MDQ4MjEsLTk5NTMwODEw
MSwzMDEwMDYyNjksMTcwODM4MTExMywyMTQ1OTM1Mjg5LDE4Nj
YwNzM5MTcsLTE4NTgzNjIzNzgsMjA3MjM2MzI0OSwtNzQxNDc3
MTYwLC0yMTI5OTM2MjQzLDc4NDQxMzMzMiwtMTUzNjc2OTI0Ni
wtMTM1MDU5NzIzNiwtMTgxMTI3MDM4NV19
-->