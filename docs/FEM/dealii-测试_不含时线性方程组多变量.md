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

最终的弱格式表示为:

$$
(\varepsilon(\mathbf{v}), 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathrm{div}\,\mathbf{v}, p)_\Omega - (q, \mathrm{div}\,\mathbf{u})_\Omega = (\mathbf{v}, \mathbf{f})_\Omega - (\mathbf{v}, \mathbf{g}_N)_{\Gamma_N}.
$$


<!--stackedit_data:
eyJoaXN0b3J5IjpbMTcwODM4MTExMywyMTQ1OTM1Mjg5LDE4Nj
YwNzM5MTcsLTE4NTgzNjIzNzgsMjA3MjM2MzI0OSwtNzQxNDc3
MTYwLC0yMTI5OTM2MjQzLDc4NDQxMzMzMiwtMTUzNjc2OTI0Ni
wtMTM1MDU5NzIzNiwtMTgxMTI3MDM4NV19
-->