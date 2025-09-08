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


## GS 方程存在分叉解

有分叉解的原因是, $p(\psi)$ 虽然形式上是线性的, 却是分段线性的, 而且分段的条件依赖于未知的 separatrix ($\psi=0$) 的形状, 此时一般的 PDE 理论不再适用。分段线性的形式使得方程变得非线性, 也叫自由边界问题 (边界位置并未事先给定，而是随待求解函数确定)

对于 1D 的 GS 方程, 有 $\partial_z=0$, 假设 $p(\psi)=CH(\psi)$, $H$ 是 Heviside 函数($H=1$ for $\psi<0$, $H=0$ for $\psi>0$), GS 方程变为:

$$
    r \frac{d}{dr} \left( \frac{1}{r} \frac{d\psi}{dr} \right) = -\mu_0 C r^2 H(\psi).
$$

在 $0<r<r_s$区域, 有

$$
    \psi = - \frac{1}{8}\mu_0 C r^4 + c_1 r^2 + c_2
$$

在 $r>r_s$ 区域, 有:

$$
    \psi = c_3 r^2 + c_4
$$

应用边界条件, $r\to0$, $\psi=0$ 得到 $c_2=0$. 在边界处, 有 $\psi=\psi_w$, 且在 $r=r_s$处, 有 $\psi=0$, 得到:

$$
    \begin{cases}
        c_1 = \frac{1}{8} \mu_0 C r_s^2 \\
        c_3 = \frac{\psi_w}{r_w^2 - r_s^2} \\
        c_4 = -c_3 r_s^2 =  - \frac{\psi_w}{r_w^2 - r_s^2} r_s^2
    \end{cases}
$$

因为 $r=r_s$ 处没有面电流 ($B_z$ 无跳变), 所以 $r=r_s$ 处 $\partial_r\psi$ 连续,

$$
\begin{aligned}
    -\frac{1}{2} \mu_0 C r_s^3 + 2c_1r_s &= 2c_3r_s \\
    c_3 &= -\frac{1}{4}\mu_0 C r_s^2 + c_1 = -\frac{1}{8} \mu_0 C r_s^2
\end{aligned}
$$

因为 $c_3>0$, 所以 $C<0$.根据 $c_3$, 有

$$
\begin{aligned}
    -\frac{1}{8} \mu_0 C r_s^2 &= \frac{\psi_w}{r_w^2 - r_s^2} \\
    x_s^2 (1-x_s^2) = -\frac{8\psi_w}{\mu_0 C r_w^4}
\end{aligned}
$$

如果定义 $K=\frac{\mu_0Cr_w^4}{\psi_w} < 0$, 有

$$
    y^2-y-\frac{8}{K} = 0
$$

其中

$$
    y = x_s^2 = \frac{1 \pm \sqrt{1 + \frac{32}{K}}}{2}
$$

如果 $\Delta = 1+\frac{32}{K} < 0$ 即 $K<-32$, 无平衡解。如果 $k=-32$ 则有唯一解, 如果 $K>-32$ 则有两支解。

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250908/image.3rbkw6dkpa.webp){width=400px}


## 

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzODAzNDYyNjcsMTkzMzY2Nzk4Myw1OT
Q0NzYxMTBdfQ==
-->