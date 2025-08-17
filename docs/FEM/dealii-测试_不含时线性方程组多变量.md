# dealii-测试_不含时线性方程组-多变量


## 弱格式

对应 Xiaoming He Chapter 6: Finite elements for 2D steady Stokes equation 

原始方程:

$$
-2 \, \mathrm{div}\,\varepsilon(\mathbf{u}) + \nabla p = \mathbf{f}, \\
-\mathrm{div}\,\mathbf{u} = 0,
$$

测试函数为 $\vec{\phi} = (\vec{v},q)^T$, 即, 对第一个式子点积 $\vec{v}$, 对第二个式子乘以 $q$, **然后相加**，得到:

$$
(\mathbf{v}, -2 \, \mathrm{div}\,\varepsilon(\mathbf{u}) + \nabla p)_\Omega - (q, \mathrm{div}\,\mathbf{u})_\Omega 
= (\mathbf{v}, \mathbf{f})_\Omega,
$$




<!--stackedit_data:
eyJoaXN0b3J5IjpbNzg0NDEzMzMyLC0xNTM2NzY5MjQ2LC0xMz
UwNTk3MjM2LC0xODExMjcwMzg1XX0=
-->