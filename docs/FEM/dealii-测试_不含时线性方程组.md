# dealii-测试_不含时线性方程组

## 弱格式

原始方程:

$$
-\operatorname{div}\bigl(C\,\varepsilon(u)\bigr) = f
$$

其中 $C$ 是四阶矩阵, 上式可以写为

$$
-\partial_j\bigl(c_{ijkl}\,\varepsilon_{kl}\bigr) = f_i,\quad i = 1,\dots,d.
$$

$$
c_{ijkl} = \lambda\,\delta_{ij}\,\delta_{kl} \;+\; \mu\bigl(\delta_{ik}\,\delta_{jl} + \delta_{il}\,\delta_{jk}\bigr).
$$

$$
\varepsilon(u)_{kl} = \frac{1}{2}\bigl(\partial_k u_l + \partial_l u_k\bigr).
$$

经过简单的推导, $c_{ijkl}\,\varepsilon_{kl}$ 可以写为 $\sigma_{ij}$,

$$
\sigma_{ij}(u) = \lambda\,(\nabla\!\cdot u)\delta_{ij} + \mu (\partial_i u_j + \partial_j u_i)
$$
<!--stackedit_data:
eyJoaXN0b3J5IjpbMzI0ODkzMzE3LC0xMzYyMjAwOTg3XX0=
-->