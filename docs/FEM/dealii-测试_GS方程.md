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
$$
    \vec{B}_p = B_r \hat{e}_r + B_z \hat{e}_z = \frac{1}{r} \nabla \psi \times \hat{e}_\theta
$$

所以磁场 $\vec{B}$ 表示为:

$$
    \begin{aligned}
    \vec{B} &= B_\theta \hat{e}_\theta + \vec{B}_p  \\
    &= B_\theta \hat{e}_\theta + \frac{1}{r} \nabla \psi \times \hat{e}_\theta
    \end{aligned}
$$

该 stream function 和极向磁通 $\psi_p$ 的关系是:

$$
    \begin{aligned}
    \psi_p &= \int_{r_o}^{r} \vec{B}_p \cdot dA  \\
      &= \int_{r_o}^{r} B_z (r, z=0) 2\pi r dr \\
      &= \int_{r_o}^{r} \frac{1}{r} \frac{\partial \psi}{\partial r} 2\pi r dr \\
      &= 2\pi \psi(r,z=0)
    \end{aligned}
$$


## 弱格式

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQxNzYzNDQ0Niw1OTQ0NzYxMTBdfQ==
-->