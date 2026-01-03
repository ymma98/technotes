# ch3_场与变分

我们可以称被积函数为 $L$；它是系统若干**独立变量**
（坐标、场幅值或其他量）以及这些变量对积分参数
（速度或场梯度等）的导数的函数。
如果变量是 $\varphi_1,\ldots,\varphi_n$，
参数是 $x_1,\ldots,x_m$，
导数是
$$
\frac{\partial \varphi_r}{\partial x_s} = \varphi_{rs},
$$
那么需要最小化的积分为：

$$
\mathcal{L}
=
\int_{a_1}^{b_1}
\cdots
\int_{a_m}^{b_m}
L\!\left(
\varphi,
\frac{\partial \varphi}{\partial x},
x
\right)
\, dx_1 \cdots dx_m
\tag{3.1.1}
$$

（第三段及后续：变分法与应用计划）

通过该函数的最小化，我们可以得到控制 $\varphi$
（作为 $x$ 的函数）的偏微分方程以及许多其他东西。
这个获得 $\varphi$ 的过程称为**变分法**
（*variational method*）。

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTExOTY2MDAzNjhdfQ==
-->