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

$$
\int_{\Omega} \bigl(\nabla \cdot \sigma(\vec{u})\bigr)\cdot \vec{v} \;dV=
\int_{\partial\Omega}\bigl(\sigma(\vec{u}) \vec{n}\bigr)\cdot \vec{v} dS-
\int_{\Omega}\sigma(\vec{u}):\nabla v dV
$$

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTUzNjYwMzIwMSw2MTE1MTE4MjgsLTEyNT
k0OTkwNjcsLTk2OTY2MDA2MywtMTM2MjIwMDk4N119
-->