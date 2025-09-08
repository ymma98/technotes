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

对于电流项, 因为可以验算:
$$
    \mu_0 \vec{J} = \nabla \times \vec{B} = \mu_0 J_\theta \hat{e}_\theta + \nabla \times B_\theta \hat{e}_\theta
$$

其中:

$$
    \nabla \times B_\theta \hat{e}_\theta = \frac{1}{r} \nabla  \left( rB_\theta \right) \times \hat{e}_\theta
$$

所以:

$$
    \mu_0 \vec{J} = \mu_0 J_\theta \hat{e}_\theta + \frac{1}{r} \nabla  \left( rB_\theta \right) \times \hat{e}_\theta
$$

如果定义$\Delta^*$:

$$
    \Delta^* \psi = r^2 \nabla \cdot \left( \frac{\nabla \psi}{r^2} \right) = r \frac{\partial}{\partial r} \left( \frac{1}{r} \frac{\partial \psi}{\partial r} \right) + \frac{\partial^2 \psi}{\partial z^2 }
$$

可以验证:

$$
    \mu_0 J_\theta \hat{e}_\theta = \nabla \times \vec{B}_p
$$

$$
    \begin{aligned}
    \mu_0 J_\theta &= \left( \nabla \times \vec{B}_p \right)_\theta = -\frac{1}{r} \Delta^* \psi
    \end{aligned}
$$

定义 $F = rB_\theta$, 有 $\nabla P = \vec{J} \times \vec{B}$, 所以:

$$
      P^{\prime}  \nabla \Psi = (J_\theta \hat{e}_\theta + \frac{1}{\mu_0 r} F^\prime \nabla \Psi \times \hat{e}_\theta) \times ( B_\theta \hat{e}_\theta + \frac{1}{r} \nabla \Psi \times \hat{e}_\theta)
$$

## 弱格式

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk0MDM4NzQ3Miw1OTQ0NzYxMTBdfQ==
-->