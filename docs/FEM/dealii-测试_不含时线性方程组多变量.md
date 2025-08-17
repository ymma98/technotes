# dealii-测试_不含时线性方程组-多变量


## 弱格式

对应 Xiaoming He Chapter 6: Finite elements for 2D steady Stokes equation 

原始方程:

$$
-2 \, \mathrm{div}\,\varepsilon(\mathbf{u}) + \nabla p = \mathbf{f}, \\
-\mathrm{div}\,\mathbf{u} = 0,
$$

测试函数为 $\vec{\phi} = (\vec{v},q)^T$

$$
\begin{pmatrix}
-2 \, \mathrm{div}\,\varepsilon(\mathbf{u}) + \nabla p \\
-\mathrm{div}\,\mathbf{u}\end{pmatrix} =
\begin{pmatrix}
\mathbf{f} \\
0\end{pmatrix}
$$


<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQ4MjU5MjUyMCwtMTM1MDU5NzIzNiwtMT
gxMTI3MDM4NV19
-->