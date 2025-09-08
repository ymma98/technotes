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

因为 $\hat{e}_i = h_i \vec{e}^i$, 所以 $\hat{e}_\theta = r \nabla \theta$, 所以:

$$
    \begin{aligned}
      P^{\prime}  \nabla \Psi &= (-\frac{1}{\mu_0} \Delta^* \Psi \nabla \theta + \frac{1}{\mu_0} F^\prime \nabla \Psi \times \nabla \theta) \times ( F \nabla \theta + \nabla \Psi \times \nabla \theta) \\
      &= -\frac{1}{\mu_0} (\Delta^* \Psi \nabla \theta) \times F \nabla \theta -\frac{1}{\mu_0} (\Delta^* \Psi \nabla \theta) \times (\nabla \Psi \times \nabla \theta) + \\
      &\frac{1}{\mu_0} (F^\prime \nabla \Psi \times \nabla \theta) \times  F \nabla \theta + \frac{1}{\mu_0} (F^\prime \nabla \Psi \times \nabla \theta) \times (\nabla \Psi \times \nabla \theta) \\
      &= -\frac{1}{\mu_0 r^2} \Delta^* \Psi \nabla \Psi - \frac{1}{\mu_0 r^2} F F^\prime \nabla \Psi
    \end{aligned}
$$

所以:
$$
    P^\prime  = -\frac{1}{\mu_0 r^2} \Delta^* \Psi - \frac{1}{\mu_0 r^2} F F^\prime 
$$

即
$$
    \begin{aligned}
    & \Delta^* \Psi = -\mu_0 r^2 P^\prime - FF^\prime \\
    & \Delta^* =  r \frac{\partial}{\partial r} \left( \frac{1}{r} \frac{\partial }{\partial r} \right) + \frac{\partial^2 }{\partial z^2 }
    \end{aligned}
$$

对于 FRC 来说:

$$
    \begin{aligned}
    & \Delta^* \Psi = -\mu_0 r^2 P^\prime, \quad F = 0 \\
    & \Delta^* \Psi = -\mu_0 r J_\theta \\
    & J_\theta = r P^\prime
    \end{aligned}
$$

## 弱格式


FRC 下 Grad-Shafranov 方程为:

$$
\begin{aligned}
\Delta^* \psi &\equiv r \frac{\partial}{\partial r}
   \Bigl(\frac{1}{r}\,\frac{\partial \psi}{\partial r}\Bigr)+ \frac{\partial^2 \psi}{\partial z^2}
   = -\mu_0\,r^2\,p'(\psi),\\
J_\theta
&= r\,p'(\psi),\\
B_z
&= \frac{1}{r}\,\frac{\partial\psi}{\partial r}, 
\qquad
B_r = -\frac{1}{r}\,\frac{\partial\psi}{\partial z}.
\end{aligned}
$$

其中 $\psi = \int_0^r B_z r dr$, $B_w>0$ 对应 $\psi=0$ 为 separatrix, $\psi<0$ 为闭合磁力线区域, $\psi>0$ 为开放磁力线区域.  $p(\psi) = Cp_0(\psi)$,  $C$ 是一个常数, 是为了避免出现分叉解而设置的。

对于 GS 方程, 进行弱格式推导, 假设测试函数是标量函数 $v$,



GS 方程也可以写为 (已知 $\Delta^*\psi = r^2 \nabla \cdot (\frac{\nabla \psi}{r^2})$):

$$
    \nabla\cdot (\frac{1}{r^2} \nabla \psi) = -\mu_0 p^\prime
$$

考虑 test function $v$:

$$
    \begin{aligned}
    \int  \nabla\cdot (\frac{1}{r^2} \nabla \psi) v dV &= -\mu_0 \int  p^\prime v dV \\
    \int \nabla \cdot (v\frac{1}{r^2} \nabla \psi) dV - \int \frac{1}{r^2} \nabla \psi \cdot \nabla v dV &= -\mu_0 \int p^\prime v dV \\
    \int v\frac{1}{r^2} \nabla \psi \cdot\vec{n} dS - 2\pi\int \frac{1}{r} (\frac{\partial \psi}{\partial r}\frac{\partial v}{\partial r} + \frac{\partial \psi}{\partial z} \frac{\partial v}{\partial z}) drdz &= -\mu_0 2\pi \int rp^\prime v drdz \\
    \int v \frac{1}{r} \frac{\partial \psi}{\partial r} n_r dz + \int v \frac{1}{r} \frac{\partial \psi}{\partial z} n_z dr - \int \frac{1}{r} (\frac{\partial \psi}{\partial r}\frac{\partial v}{\partial r} + \frac{\partial \psi}{\partial z} \frac{\partial v}{\partial z}) drdz &= -\mu_0 \int rp^\prime v drdz \\
       \int \frac{1}{r} (\frac{\partial \psi}{\partial r}\frac{\partial v}{\partial r} + \frac{\partial \psi}{\partial z} \frac{\partial v}{\partial z}) drdz &= \int v \frac{1}{r} \frac{\partial \psi}{\partial r} n_r dz + \int v \frac{1}{r} \frac{\partial \psi}{\partial z} n_z dr +\mu_0 \int rp^\prime v drdz
    \end{aligned}
$$

其中 $n_r$ 和 $n_z$ 是垂直于表面的单位向量, 对于矩形网格, $r=r_w=r_{max}$ 面/线, $n_r=1$, $r=0$ 处 $n_r=-1$. $z=z_{max}$ 处 $n_z=1$, $z=z_{min}$处$n_z=-1$. test function $v$ 在固定边界条件处取 0, 在 Neumann BC 上可以取任意值。
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTMzMTA0NTY1Miw1OTQ0NzYxMTBdfQ==
-->