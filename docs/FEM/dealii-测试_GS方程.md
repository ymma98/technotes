# dealii-测试_含时线性

## GS 方程

出发坐标系: 柱坐标, $(r, \theta, z)$。并假设 $\partial_\theta = 0$


根据 $\nabla \cdot \vec{B} = 0$

$$
    \frac{1}{r} \frac{\partial \left( rB_r \right)}{\partial r} + \frac{\partial B_z}{\partial z} = 0
$$

因为 $\vec{B} = \nabla \times \vec{A}$:

$$
        B_r = -\frac{\partial A_\theta}{\partial z}  \\
        B_z = \frac{1}{r} \frac{\partial \left( rA_\theta \right)}{\partial r}
$$

令 stream function 为 $\psi = rA_\theta$, 得到:



## 弱格式

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTE5MzkxMDg1MSw1OTQ0NzYxMTBdfQ==
-->