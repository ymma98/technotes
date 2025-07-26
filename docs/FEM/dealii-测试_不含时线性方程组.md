# dealii-测试_不含时线性方程组

## 弱格式

原始方程:

$$
-\operatorname{div}\bigl(C\,\varepsilon(\vec{u})\bigr) = f
$$

其中 $C$ 是四阶矩阵, 上式可以写为

$$
-\partial_j\bigl(c_{ijkl}\,\varepsilon_{kl}\bigr) = f_i,\quad i = 1,\dots,d.
$$

$$
c_{ijkl} = \lambda\,\delta_{ij}\,\delta_{kl} \;+\; \mu\bigl(\delta_{ik}\,\delta_{jl} + \delta_{il}\,\delta_{jk}\bigr).
$$

$$
\varepsilon(\vec{u})_{kl} = \frac{1}{2}\bigl(\partial_k u_l + \partial_l u_k\bigr).
$$

经过简单的推导, $c_{ijkl}\,\varepsilon_{kl}$ 可以写为 $\sigma_{ij}$,

$$
-\nabla\!\cdot\sigma(\vec{u}) = f
$$

$$
\sigma_{ij}(u) = \lambda\,(\nabla\!\cdot \vec{u})\delta_{ij} + \mu (\partial_i u_j + \partial_j u_i)
$$

$$
\sigma(\vec{u})=
\begin{pmatrix}
\lambda\bigl(\frac{\partial u_1}{\partial x_1} + \frac{\partial u_2}{\partial x_2}\bigr) + 2\mu\,\frac{\partial u_1}{\partial x_1}
&
\mu\bigl(\frac{\partial u_1}{\partial x_2} + \frac{\partial u_2}{\partial x_1} \bigr)
\\[1ex]
\mu\bigl(\frac{\partial u_1}{\partial x_2} + \frac{\partial u_2}{\partial x_1}\bigr)
&
\lambda\bigl(\frac{\partial u_1}{\partial x_1} + \frac{\partial u_2}{\partial x_2}\bigr) + 2\mu\,\frac{\partial u_2}{\partial x_2}
\end{pmatrix}.
$$

将 $\vec{u}$ 乘以对应的 test function $\vec{v}$, 

$$
-\int_{\Omega} \bigl(\nabla \cdot \sigma(\vec{u})\bigr)\cdot \vec{v} dV=
\int_{\Omega} \vec{f}\cdot \vec{v} dV
$$

代入公式: 

$$
\int_{\Omega} \bigl(\nabla \cdot \sigma(\vec{u})\bigr)\cdot \vec{v} \;dV=
\int_{\partial\Omega}\bigl(\sigma(\vec{u}) \vec{n}\bigr)\cdot \vec{v} dS-
\int_{\Omega}\sigma(\vec{u}):\nabla v dV
$$

其中$\vec{n} = (n_1,n_2)^t$ 垂直于 $\partial \Omega$, 有:


$$
\int_{\Omega}\sigma\bigl(\mathbf{u}\bigr)\colon\nabla\mathbf{v}\,dV-\;\int_{\partial\Omega}\bigl(\sigma(\mathbf{u})\,\mathbf{n}\bigr)\cdot\mathbf{v}\,ds=\;\int_{\Omega}\mathbf{f}\cdot\mathbf{v}\,dV
$$

$$
A : B \;=\;
\begin{pmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{pmatrix}
:
\begin{pmatrix}
b_{11} & b_{12} \\
b_{21} & b_{22}
\end{pmatrix}
\;=\;
a_{11}b_{11} + a_{12}b_{12} + a_{21}b_{21} + a_{22}b_{22}\,.
$$


$$
\nabla \mathbf{v}=
\begin{pmatrix}
\frac{\partial v_{1}}{\partial x_{1}} & \frac{\partial v_{1}}{\partial x_{2}} \\
\frac{\partial v_{2}}{\partial x_{1}} & \frac{\partial v_{2}}{\partial x_{2}}
\end{pmatrix}
$$

然后将弱格式表示为分量的形式 (这里只考虑 Dirichlet BC, 扔掉边界项), 

$$
\sigma\bigl(\mathbf{u}\bigr)\colon\nabla\mathbf{v}=\sigma_{kl}\nabla\vec{v}_{kl} = [\lambda \text{div}(\vec{u})\delta_{kl}+\mu (\partial_k u_l + \partial_l u_k)]\partial_l v_k 
$$

$$
a(\mathbf{u}, \mathbf{v})=
\sum_{k,l}
\bigl(\lambda\,\partial_l u_l,\;\partial_k v_k\bigr)_{\!\Omega}
\;+\;\sum_{k,l}
\bigl(\mu\,\partial_k u_l,\;\partial_k v_l\bigr)_{\!\Omega}
\;+\;\sum_{k,l}
\bigl(\mu\,\partial_k u_l,\;\partial_l v_k\bigr)_{\!\Omega}.
$$

对于基函数, 有

$$
\vec{\Phi}_i = \phi_{\text{base(i)}} \hat{e}_{comp(i)}
$$

其中 $i = 1,...,N$, 一共有 $N$ 个基函数。`base(i)` 有很复杂的表示方法, 我们完全不用关心, 由 dealii 自动处理. 于是:

$$
\vec{\Phi}_i = \phi_i \hat{e}_{comp(i)} \\
\vec{u} = U_j \vec{\Phi}_j \\
\vec{v}_i = \vec{\Phi}_i
$$
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEwNDYyOTM5NjQsLTUzNDQ0NDc0MywxOD
YwODQ3NzA2LC01MzY2MDMyMDEsNjExNTExODI4LC0xMjU5NDk5
MDY3LC05Njk2NjAwNjMsLTEzNjIyMDA5ODddfQ==
-->