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



$$
(\varepsilon(\mathbf{v}), 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathbf{n} \otimes \mathbf{v}, 2 \, \varepsilon(\mathbf{u}))_{\partial\Omega} - (\mathrm{div}\,\mathbf{v}, p)_\Omega + (\mathbf{n}\cdot\mathbf{v}, p)_{\partial\Omega} - (q, \mathrm{div}\,\mathbf{u})_\Omega
= (\mathbf{v}, \mathbf{f})_\Omega,
$$


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE4NTgzNjIzNzgsMjA3MjM2MzI0OSwtNz
QxNDc3MTYwLC0yMTI5OTM2MjQzLDc4NDQxMzMzMiwtMTUzNjc2
OTI0NiwtMTM1MDU5NzIzNiwtMTgxMTI3MDM4NV19
-->