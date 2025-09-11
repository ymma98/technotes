# dealii-测试_GSeq

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


![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250911/image.5xazmf9j2b.webp){width=400px}

## 数值方法

考虑矩形计算区域, 矩形区域由 $r = r_{max}=r_w$, $z=z_{max}$, $r=0$, $z=z_{min}$ 四条线决定。边界条件是:


* $r=0$ 处, $\psi=0$
* $r=r_w$ 处, $\psi=\psi_w$
* $z=z_{max}$ 和 $z=z_{min}$ 处，$\frac{\partial \psi}{\partial z}=0$ 或 $\psi=\psi_{w2}$


对于 GS solver, 一开始给定任意 $p_0(\psi)$ 剖面, 一般是这样的形式:

$$
    \begin{cases}
    p_0(\psi) = \cdots \quad \text{where} \quad \psi<0 \\
    p_0(\psi) = p_{open} \quad \text{where} \quad \psi \geq 0
    \end{cases}
$$

$\cdots$ 代表任意表达式, 一般是一次函数，二次函数, 三次函数等。



求解步骤:


* 设置计算区域的大小。计算区域总是用柱坐标系 $(r,\theta,z)$ 描述, 这里仅考虑环向对称的情况, 因此计算区域总是用 $(r,z)$ 描述。我们总是默认计算区域是关于 $z=0$ 对称的, 因此默认 $z_{max}=|z_{min}|$. 我们需要指定: $z_{max}$, $z_{min}$, $r_w=r_{max}$, $r_{min}$. 其中默认 $z_{min}=-z_{max}$, $r_{min}=0$

* 指定压强剖面 $p_0(\psi)$, 以及 $p_{open}$, 默认 $C=1$。指定 separatrix 包围的面积 $S$. 求解 GS 方程右边函数 $-\mu_0 r^2 C \frac{dp_0}{d\psi}$

* 给定 $r=r_w$ 处的固定边界条件 $\psi_w$; 给定 $r=r_{min}$处的边界条件 $\psi_{r0}$ (默认 $r_{min}$ 处 $\psi_{r0}=0$); 给定 $z=z_{min}$ 和 $z=z_{max}$ 区域的边界条件, 要么是固定边界条件 $\psi=\psi_{zend}(r)$, 要么是Neumman 边界条件 $\frac{\partial\psi}{\partial z} = 0$

* 生成初始网格。网格总是矩形、均匀网格

* 给定或读取初始的 initial guess $\psi_0$, 这部分可以直接设置, 也可以直接读取外部文件, 其中外部文件满足 .csv 格式, 里面存储的是 $r,z,\psi_0$

* 开始迭代 GS 方程, 使用 Picard 迭代方法, $\psi_{n+1}=(1-w) \psi_{n}+w\psi^{n+1}$, 其中 $Q$ 是矩阵组装后得到的 $Ax=b$ 的 $b$, 反复迭代, 直到 $d=max|\psi_{n+1}-\psi_n|<\epsilon$

* 判断, 是否需要限定 $S$?
	 * 如果不需要限定 $S$, 则迭代过程中恒有 $C=1$. 之后迭代求解 GS 方程
   * 如果需要限定 $S$, 则第 $n$ 次迭代完成后, 更新 $C$, 有 $C_{n+1}=C_{n}\times S/S_n$, 也就是说, 如果 $S_n$ 比设定的值$S$大了, 那么下次迭代就降低 $C$. 因此, 这里也需要一个程序计算每一步的 $S_n$, 计算方法是, 找到每一步 $\psi=0$ 的 contour, 然后计算该 contour 包围的面积
   * 数据后处理, 输出数据为 .csv 格式, 将数据输出到一个均匀网格上
     

目前想到的迭代方法: $S$ 是设置的 separatrix 的面积。初始, $p(\psi)=Cp_0(\psi)$。迭代完成之后, 得到 $S_n$, $n$ 代表是第$n$次迭代, $C_{n+1} = C_n \frac{S}{S_n}$, $p_{n+1} = C_{n+1}p_n$, 也就是说, 如果 $S_n$ 比设定的值大了, 那么下次迭代就降低压强。   





## benchmark



poloidal flux 的表达式为



$$
\psi(r, z)=  -r A_\phi=\frac{\psi_0}{R_0^4}\left\{\left(r^2-R_0^2\right)^2+\frac{z^2}{E^2}\left(r^2-R_x^2\right)\right. \\
 \left.-\tau R_0^2\left[r^2 \ln \left(\frac{r^2}{R_0^2}\right)-\left(r^2-R_0^2\right)-\frac{\left(r^2-R_0^2\right)^2}{2 R_0^2}\right]\right\},
$$

$$

$$

其中 $R_0$ 是 $r_o$, 并且有 $\psi(R_0,0)=0$。$R_x$ 是 X 点半径, $\tau$是三角度 triangularity, $E$ 是拉长比。


$$
\begin{aligned}
B_r= & -\frac{1}{r} \frac{\partial \psi}{\partial z}=-\frac{2 \psi_0}{r R_0^4}\left[\frac{z}{E^2}\left(r^2-R_x^2\right)\right], \\
B_z= & \frac{1}{r} \frac{\partial \psi}{\partial r}=\frac{2 \psi_0}{R_0^4}\left\{2\left(r^2-R_0^2\right)+\frac{z^2}{E^2}\right. \\
& \left.-\tau R_0^2\left[\ln \left(\frac{r^2}{R_0^2}\right)-\frac{\left(r^2-R_0^2\right)}{R_0^2}\right]\right\} .
\end{aligned}
$$


在 $X$ 点处，有 $B_z(R_x,Z_x)=0$，由此得到
$$
Z_x \;=\; E \,\sqrt{\tau R_0^2 \ln\!\Bigl(\frac{R_x^2}{R_0^2}\Bigr)\;+\;(2+\tau)\bigl(R_0^2 - R_x^2\bigr)}.
$$


环向磁场为
$$
B_\phi \;=\; \frac{B_0 R_0}{r}.
$$




在磁轴附近（$z\to0,\ r\to R_0$），有
$$
\psi = 4\,\psi_0\,\epsilon^2,\quad
\epsilon \equiv \frac{r - R_0}{R_0} \ll 1,\quad
\kappa \equiv \frac{2E}{\sqrt{1 - R_x^2/R_0^2}}.
$$




因此在 $O$ 点附近的极向磁场和安全因子为


$$
B_p = 8\,\frac{\psi_0}{R_0^2}\,\epsilon,\qquad
q_0 = \frac{r\,B_0}{R_0\,B_p} = \frac{B_0\,R_0^2}{8\,\psi_0},
$$


由此得到
$$
\psi_0 = \frac{B_0\,R_0^2}{8\,q_0}.
$$




对于 FRC，我们令 $\tau=0,\ R_x=0,\ B_\phi=0$，此时得到 Hill vortex平衡


$$
\begin{aligned}
\psi(r, z)= \frac{\psi_0}{R_0^4}\left\{\left(r^2-R_0^2\right)^2+\frac{z^2}{E^2}r^2\right\},
\end{aligned}
$$



并取 $B_z(0,0)=B_0$，从而有 $\psi_0 = \frac{B_0\,R_0^2}{4}$。  

而且,
$$
\begin{aligned}
        -\mu_0 r^2 p^\prime &= \frac{2(1+4E^2) \psi_0 r^2}{E^2 R_0^4} \\
        p^\prime &= - \frac{2(1+4E^2) \psi_0}{\mu_0 E^2 R_0^4}
    \end{aligned}
$$



该 FRC 模型也适用于磁镜，只需进一步令 $R_0^2<0$。 

这里令 $R_0=0.1$, $B_0=-0.1$, $E=1$, 得到 (蓝色虚线为数值结果, 红色实线为解析解): 


![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250911/image.67xtfl42pd.webp){width=600px}


## 其它测试情况



```bash
subsection mesh
  set rmin = 0.
  set rmax = 0.3
  set zmin = -2.
  set zmax = 2.
  set mx   = 90
  set my   = 200
end

subsection profile
  set pres_expr = 1.5 * (-1.0 * psi)
  set p_open = 0.
  set S = 0.4
end

subsection boundary
  set psi_wall =  3.e-4 #1e-3
  set neumann_zmax = true
  set neumann_zmin = true
  set psi_zmax = 0.0
  set psi_zmin = 0.0
end

subsection solver
  set poly_degree = 1
  set max_iter_num = 1500
  set tol = 1.e-9
  set gscenter=0.8
end

subsection io
  set input_file = gsfrc.in
  set output_file = gsfrc.out
end
```

`test_solver.cpp`

```cpp
#include <deal.II/base/parameter_handler.h>
#include <deal.II/base/mpi.h>
#include "../../include/mesh.hpp"
#include "../../include/parameters.hpp"
#include "../../include/solver.hpp"
#include "../../external/CLI11.hpp"

using namespace dealii;
using namespace gsfrc;

int main(int argc, char **argv)
{
    dealii::Utilities::MPI::MPI_InitFinalize mpi_init(argc, argv, 1);
  /* ---------------- read default parameter file -------------- */

    CLI::App app{"GSSolver"};
    std::string init_csv;
    app.add_option("-i,--init", init_csv,
            "Initial guess for the solver (CSV file)");
    CLI11_PARSE(app, argc, argv);

    dealii::ParameterHandler prm;
    gsfrc::Parameters::declare_parameters(prm);
    prm.parse_input("./gsfrc.prm");

    gsfrc::Parameters params;
    params.parse_parameters(prm);

    // mesh
    dealii::Triangulation<2> tria;
    gsfrc::create_uniform_rect_mesh(tria,
                                      params.rmin, params.rmax,
                                      params.zmin, params.zmax,
                                      params.mx, params.my);
    // solver
    gsfrc::GSSolver gs(tria,
                       params.poly_degree,
                       params.max_iter_num,
                       params.tol,
                       params.gscenter,
                       params.psi_wall,
                       params.neumann_zmax,
                       params.neumann_zmin,
                       params.psi_zmax,
                       params.psi_zmin,
                       params.p_open,
                       params.pres_expr, params.constants,
                       params.S);

    std::string type ="normalS"; //"normalS";
    // std::string type ="test_solovev"; //"normalS";

    if(!init_csv.empty()){
        gs.load_initial_guess_csv(init_csv);
        std::cout << "Initial guess loaded from: " << init_csv << std::endl;
    }



    gs.picardit(type);
    // gs.adeptivePicardit(type);
    gs.writedata("psi_numerical","csv");    // → psi_numerical.csv

  return 0;
}
```








## 程序实现


├── external
│   └── CLI11.hpp
├── include
│   ├── mesh.hpp
│   ├── parameters.hpp
│   └── solver.hpp
├── src
│   ├── mesh.cpp
│   ├── parameters.cpp
│   └── solver.cpp

* `mesh.hpp`

```cpp
#ifndef GS_MESH_HPP
#define GS_MESH_HPP

#include <deal.II/grid/tria.h>
#include <deal.II/base/point.h>
#include <string>

namespace gsfrc
{
    // boundary ids: r=0 -> 0, z=zmin -> 1, r=rw -> 2, z=zmax -> 3
    void create_uniform_rect_mesh(dealii::Triangulation<2> &tria,
            double rmin=0.0,  double rmax=0.3,
            double zmin=-2.0, double zmax=2.0,
            unsigned int mx = 16, unsigned int my = 48);

    void meshplot(const dealii::Triangulation<2> &tria,
            const std::string& savename = "mesh",
            bool write_svg = true, bool write_vtk = true);
} // namespace gsfrc

#endif // !GS_MESH_HPP
```


* `parameter.hpp`

```cpp
#pragma once
#include <deal.II/base/parameter_handler.h>
#include <deal.II/base/function_parser.h>
#include <deal.II/base/numbers.h>
#include <iomanip>
#include <map>
#include <string>


#include <deal.II/base/point.h>
#include <deal.II/lac/vector.h>

#include <fstream>
#include <sstream>
#include <unordered_map>


namespace gsfrc
{
struct Parameters
{
  /* ---------- rectangular mesh ---------- */
  double rmin = 0.0,  rmax = 0.3;
  double zmin = -2.0, zmax = 2.0;
  unsigned int mx = 16, my = 48;

  /* ---------- profile ---------- */
  std::string pres_expr = "1.0";   ///< expression p(psi)
  double      p_open    = 0.0;     ///< pressure in open field-line region
  double      S         = 0.0; ///< target separatrix area
  std::map<std::string, double> constants={{"pi", dealii::numbers::PI},
                               {"mu0", 4.0 * dealii::numbers::PI * 1.0e-7}};

  /* ---------- boundary conditions ---------- */
  double psi_wall   = 0.0; ///< ψ on conducting wall
  bool   neumann_zmax = false,
         neumann_zmin = false;
  double psi_zmax = 0.0, psi_zmin = 0.0;

  /* ---------- nonlinear iteration (solver) ---------- */
  unsigned int poly_degree  = 2;
  unsigned int max_iter_num = 1000;
  double       tol          = 1e-8;
  double       gscenter     = 0.3;

  /* ---------- I/O ---------- */
  std::string input_file  = "gsfrc.in";
  std::string output_file = "gsfrc.out";

  /* ---------- runtime objects (not read) ---------- */
  dealii::FunctionParser<1> pressure_parser; ///< p(ψ)

  /* ---------- interface ---------- */
  static void declare_parameters(dealii::ParameterHandler &prm);
  void        parse_parameters(dealii::ParameterHandler &prm);

};


inline std::unordered_map<std::string, double>
    read_initial_guess_csv(const std::string &filename){
        std::ifstream infile(filename);
        if (!infile) {
            throw std::runtime_error("Can not open file: " + filename);
        }

        std::unordered_map<std::string, double> data;
        std::string line;
        std::getline(infile, line); // skip header
        while (std::getline(infile, line)) {
            std::istringstream iss(line);
            double r,z,psi;
            char comma;
            if (!(iss >> r >> comma >> z >> comma >> psi))
                continue;
            std::ostringstream key;
            key << std::setprecision(17) << r << "," << z;
            data[key.str()] = psi;
        }
        return data;
    }


} // namespace gsfrc
```


* `solver.hpp`

```cpp
#pragma once

#include <deal.II/grid/tria.h>
#include <deal.II/base/function_parser.h>
#include <deal.II/lac/vector.h>
#include <deal.II/lac/affine_constraints.h>
#include <deal.II/fe/fe_q.h>
#include <deal.II/fe/fe_values.h>
#include <deal.II/dofs/dof_handler.h>
#include <deal.II/dofs/dof_tools.h>
#include <deal.II/numerics/data_out.h>
#include <deal.II/numerics/vector_tools.h>
#include <deal.II/lac/trilinos_sparse_matrix.h>


#include <string>

namespace gsfrc
{
    class GSSolver {
        public:
            GSSolver(dealii::Triangulation<2> &tria,
                    const unsigned int poly_degree,
                    const unsigned int max_iter_num,
                    const double tol,
                    const double gscenter,
                    const double psi_wall,
                    const bool neumann_zmax,
                    const bool neumann_zmin,
                    const double psi_zmax,
                    const double psi_zmin,
                    const double p_open,
                    const std::string &pres_expr,
                    const std::map<std::string, double> &pres_constants,
                    const double S=1.0);

            void solve(std::string type);
            void adeptivePicardit(std::string type);
            void writedata(std::string filename, std::string type) const;
            void picardit(std::string type);
            void load_initial_guess_csv(const std::string &filename);

        private:
            dealii::Triangulation<2> &tria_;
            const unsigned int pd_;  // poly_degree
            const unsigned int maxitnum_;
            const double tol_;
            const double omg_; // gscenter, Picard relaxation number
            const double psi_wall_;
            const bool neumann_zmax_;
            const bool neumann_zmin_;
            const double psi_zmax_;
            const double psi_zmin_;
            const double p_open_;
            dealii::FunctionParser<1> presparser_;

            // FE
            dealii::FE_Q<2> fe_;
            dealii::DoFHandler<2> dof_handler_;
            dealii::AffineConstraints<double> constraints_;

            const double S_;  // target area
            double area_; // area during iteration
            double Cold_;
            double Cnew_;

            bool initial_guess_read_;


            // matrix solver
            dealii::TrilinosWrappers::SparseMatrix system_matrix_;
            dealii::Vector<double>                 system_rhs_;
            dealii::Vector<double>                 psi_vec_;   // current iterate
            dealii::Vector<double>                 tmp_vec_; // x in Ax=b

            void assemble_system(std::string type);
            void apply_boundary_conditions(std::string bctype = "normal");
            double pressure_val(double psi, std::string type="normal");
            double dpdpsi(double psi, std::string type="normal");

            static double solovevpsi(double r, double z,
                    double R0, double B0, double E);
            static double solovevpp(double R0, double B0, double E);
            double calc_separatrix_area() const;


            double step_norm(const dealii::Vector<double> a,
                               const dealii::Vector<double> b) const;
            double calculate_residual_norm(std::string type, 
                const dealii::Vector<double> &vec);


    };
} // namespace gsfrc
```

* mesh.cpp

```cpp
#include <cmath>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_out.h>
#include <deal.II/base/exceptions.h>
#include <deal.II/base/point.h>
#include <fstream>
#include <string>
#include <cmath>
#include <vector>

#include "mesh.hpp"

namespace gsfrc
{
    void create_uniform_rect_mesh(dealii::Triangulation<2> &tria,
                                  double rmin, double rmax,
                                  double zmin, double zmax,
                                  unsigned int mx, unsigned int my){
        AssertThrow(rmin < rmax && zmin < zmax,
                dealii::ExcMessage("invalid rmin/rmax/zmin/zmax"));
        const dealii::Point<2> p1(rmin, zmin);
        const dealii::Point<2> p2(rmax, zmax);
        const std::vector<unsigned int> ncells = {mx, my};
        
        dealii::GridGenerator::subdivided_hyper_rectangle(tria, ncells, p1, p2);

        // label the boundaries, 
        // boundary ids: r=0 -> 0, z=zmin -> 1, r=rw -> 2, z=zmax -> 3
        for (const auto &cell : tria.active_cell_iterators()) {
            for (const auto f : cell->face_indices()) {
                if (cell->face(f)->at_boundary()){
                    const dealii::Point<2> c = cell->face(f)->center();
                    const double r = c[0];
                    const double z = c[1];
                    double tol = 1.e-6;
                    if (std::fabs(r - rmin) < tol)
                        cell->face(f)->set_boundary_id(0);
                    else if (std::fabs(z - zmin) < tol)
                        cell->face(f)->set_boundary_id(1);
                    else if (std::fabs(r - rmax) < tol)
                        cell->face(f)->set_boundary_id(2);
                    else if (std::fabs(z - zmax) < tol)
                        cell->face(f)->set_boundary_id(3);
        else
                        throw dealii::ExcMessage("invalid boundary face");
                }
            }
        }
    }

    void meshplot(const dealii::Triangulation<2> &tria,
                 const std::string& savename,
                 bool write_svg, bool write_vtk) {
        dealii::GridOut grid_out;
        if (write_svg) {
            std::ofstream svgfile(savename + ".svg");
            grid_out.write_svg(tria, svgfile);
        }
        if (write_vtk) {
            std::ofstream vtkfile(savename + ".vtk");
            grid_out.write_vtk(tria, vtkfile);
        }
    }
}
```


* `parameter.cpp`


```cpp
#include "parameters.hpp"
#include <deal.II/base/numbers.h>
#include <map>

namespace gsfrc {

void Parameters::declare_parameters(dealii::ParameterHandler &prm)
{
  // Rectangular mesh
  prm.enter_subsection("mesh");
  {
    prm.declare_entry("rmin", "0.0", dealii::Patterns::Double(), "Left radial boundary");
    prm.declare_entry("rmax", "0.3", dealii::Patterns::Double(), "Right radial boundary");
    prm.declare_entry("zmin", "-2.0", dealii::Patterns::Double(), "Lower axial boundary");
    prm.declare_entry("zmax", "2.0", dealii::Patterns::Double(), "Upper axial boundary");
    prm.declare_entry("mx", "16", dealii::Patterns::Integer(), "mesh number in r-dir");
    prm.declare_entry("my", "16", dealii::Patterns::Integer(), "mesh number in z-dir");
  }
  prm.leave_subsection();

  // Pressure profile
  prm.enter_subsection("profile");
  {
    prm.declare_entry("pres_expr", "1.0", dealii::Patterns::Anything(), "muParser expression in variable psi");
    prm.declare_entry("p_open", "0.0", dealii::Patterns::Double(), "Pressure in open field-line region");
    prm.declare_entry("S", "0.0", dealii::Patterns::Double(), "Target separatrix area");
  }
  prm.leave_subsection();

  // Boundary conditions
  prm.enter_subsection("boundary");
  {
    prm.declare_entry("psi_wall", "0.0", dealii::Patterns::Double(), "Psi on conducting wall");
    prm.declare_entry("neumann_zmax", "true", dealii::Patterns::Bool(), "Neumann BC at zmax");
    prm.declare_entry("neumann_zmin", "true", dealii::Patterns::Bool(), "Neumann BC at zmin");
    prm.declare_entry("psi_zmax", "0.0", dealii::Patterns::Double(), "Dirichlet BC value at zmax (if not Neumann)");
    prm.declare_entry("psi_zmin", "0.0", dealii::Patterns::Double(), "Dirichlet BC value at zmin (if not Neumann)");
  }
  prm.leave_subsection();

  // Nonlinear iteration
  prm.enter_subsection("solver");
  {
    prm.declare_entry("poly_degree", "2", dealii::Patterns::Integer(), "polynomial degree");
    prm.declare_entry("max_iter_num", "1000", dealii::Patterns::Integer(), "Maximum number of iterations");
    prm.declare_entry("tol", "1e-8", dealii::Patterns::Double(), "Convergence tolerance");
    prm.declare_entry("gscenter", "0.3", dealii::Patterns::Double(), "Picard iteration relexation number");
  }
  prm.leave_subsection();

  // I/O
  prm.enter_subsection("io");
  {
    prm.declare_entry("input_file", "gsfrc.in", dealii::Patterns::Anything(), "Input file name");
    prm.declare_entry("output_file", "gsfrc.out", dealii::Patterns::Anything(), "Output file name");
  }
  prm.leave_subsection();
}

void Parameters::parse_parameters(dealii::ParameterHandler &prm)
{
  // Rectangular mesh
  prm.enter_subsection("mesh");
  {
    rmin = prm.get_double("rmin");
    rmax = prm.get_double("rmax");
    zmin = prm.get_double("zmin");
    zmax = prm.get_double("zmax");
    mx   = prm.get_integer("mx");
    my   = prm.get_integer("my");
  }
  prm.leave_subsection();

  // Pressure profile
  prm.enter_subsection("profile");
  {
    // constexpr double mu0 = 4.0 * dealii::numbers::PI * 1e-7;
    pres_expr = prm.get("pres_expr");
    p_open    = prm.get_double("p_open");
    S         = prm.get_double("S");
    // std::map<std::string, double> constants={{"pi", dealii::numbers::PI},
    //                                          {"mu0", mu0}};
    // If the expression does not use any named constants,
    // as in "4.5*psi^2 + 3*psi + 2", then an empty map (constants) is fine.
    pressure_parser.initialize("psi", pres_expr, constants);
  }
  prm.leave_subsection();

  // Boundary conditions
  prm.enter_subsection("boundary");
  {
    psi_wall     = prm.get_double("psi_wall");
    neumann_zmax = prm.get_bool("neumann_zmax");
    neumann_zmin = prm.get_bool("neumann_zmin");
    psi_zmax     = prm.get_double("psi_zmax");
    psi_zmin     = prm.get_double("psi_zmin");
  }
  prm.leave_subsection();

  // Nonlinear iteration
  prm.enter_subsection("solver");
  {
    poly_degree  = prm.get_integer("poly_degree");
    max_iter_num = prm.get_integer("max_iter_num");
    tol          = prm.get_double("tol");
    gscenter     = prm.get_double("gscenter");
  }
  prm.leave_subsection();

  // I/O
  prm.enter_subsection("io");
  {
    input_file  = prm.get("input_file");
    output_file = prm.get("output_file");
  }
  prm.leave_subsection();
}

} // namespace gsfrc
```

* `solver.cpp`

```cpp
#include <deal.II/base/quadrature_lib.h>
#include <deal.II/base/function.h>
#include <deal.II/base/parameter_handler.h>
#include <deal.II/base/function_parser.h>
#include <deal.II/base/function_lib.h>
#include <deal.II/base/utilities.h>
#include <deal.II/base/conditional_ostream.h>
#include <deal.II/base/tensor.h>
#include <deal.II/dofs/dof_tools.h>

#include <deal.II/lac/vector.h>
#include <deal.II/lac/dynamic_sparsity_pattern.h>

#include <deal.II/grid/tria.h>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_out.h>
#include <deal.II/grid/grid_refinement.h>
#include <deal.II/grid/grid_in.h>

#include <deal.II/dofs/dof_handler.h>
#include <deal.II/dofs/dof_tools.h>

#include <deal.II/fe/fe_values.h>
#include <deal.II/fe/fe_system.h>
#include <deal.II/fe/mapping_q1.h>
#include <deal.II/fe/fe_q.h>

#include <deal.II/numerics/data_out.h>
#include <deal.II/numerics/vector_tools.h>
#include <deal.II/numerics/solution_transfer.h>

#include <deal.II/lac/trilinos_sparse_matrix.h>
#include <deal.II/lac/trilinos_precondition.h>
#include <deal.II/lac/trilinos_solver.h>


#include <iomanip>
#include <iostream>
#include <algorithm>
#include <sstream>
#include <string>

#include <omp.h>


#include "../include/solver.hpp"
#include "../include/parameters.hpp"

namespace gsfrc{
    namespace {
        constexpr double mu0 = 4.0 * dealii::numbers::PI * 1e-7; 
    }

    GSSolver::GSSolver(dealii::Triangulation<2> &tria,
                     const unsigned int poly_degree,
                     const unsigned int max_iter_num,
                     const double tol,
                     const double gscenter,
                     const double psi_wall,
                     const bool neumann_zmax,
                     const bool neumann_zmin,
                     const double psi_zmax,
                     const double psi_zmin,
                     const double p_open,
                     const std::string &pres_expr,
                     const std::map<std::string, double> &pres_constants,
                     const double S)
        : tria_(tria),
        pd_(poly_degree),
        maxitnum_(max_iter_num),
        tol_(tol),
        omg_(gscenter),
        psi_wall_(psi_wall),
        neumann_zmax_(neumann_zmax),
        neumann_zmin_(neumann_zmin),
        psi_zmax_(psi_zmax),
        psi_zmin_(psi_zmin),
        p_open_(p_open),
        fe_(pd_),
        dof_handler_(tria_),
        S_(S),
        area_(S)
    {
        presparser_.initialize("psi",pres_expr, pres_constants);
        // distribute dofs
        dof_handler_.distribute_dofs(fe_);
        
        // initialize system matrix and vectors
        psi_vec_.reinit(dof_handler_.n_dofs());
        tmp_vec_.reinit(dof_handler_.n_dofs());
        system_rhs_.reinit(dof_handler_.n_dofs());

        Cold_ = 1.0;
        Cnew_ = 1.0;

        initial_guess_read_ = false;
    }


    class InitialGuess : public dealii::Function<2> {
        public:
            InitialGuess();
            virtual double value(const dealii::Point<2> &p,
            unsigned int component = 0) const override;
    };


    InitialGuess::InitialGuess() : dealii::Function<2>(1) {}

    double InitialGuess::value(const dealii::Point<2> &p,
            unsigned int /*component*/) const {
        double R0 = 0.15, B0 = -0.1, E = 6.0;
        // double R0 = 0.1, B0 = -0.1, E = 1.0;
        double psi0 = B0 * R0 * R0 / 4.0;
        double r = p[0], z=p[1];
        double psi = psi0 / (R0 * R0 * R0 * R0) *
            ((r * r - R0 * R0) * (r * r - R0 * R0) +
            z * z / (E * E) * r * r);
        double psir0 = psi0 / (R0 * R0 * R0 * R0) *
            ((R0 * R0) * (R0 * R0)); // psi at (0,0)
        psi = -1. * psi - (-1.0 * psir0);
        return psi;
    }


    class LambdaFunction : public dealii::Function<2> {
        public:
            LambdaFunction(const std::function<double(const dealii::Point<2>&)> &func)
                : dealii::Function<2>(1), lambda_func(func) {}
    
            virtual double value(const dealii::Point<2> &p,
                    unsigned int component = 0) const override {
                return lambda_func(p);
            }
    
        private:
            std::function<double(const dealii::Point<2>&)> lambda_func;
    };

    double GSSolver::solovevpsi(double r, double z, double R0, double B0, double E){
        // psi = psi0 / R0^4 ((r^2 - R0^2)^2 + z^2/E^2 * r^2)
        // psi0 = B0 R0^2 / 4 where B0=Bz(0,0)
        // p' = -2*(1+4*E^2)*psi0 / (mu0 * E^2 * R0^4)
        double psi0 = B0 * R0 * R0 / 4.0;
        double psi = psi0 / (R0 * R0 * R0 * R0) *
            ((r * r - R0 * R0) * (r * r - R0 * R0) +
            z * z / (E * E) * r * r);
        return psi;
    }
    double GSSolver::solovevpp(double R0, double B0, double E){
        // double mu0 = 4.0 * dealii::numbers::PI * 1e-7;
        double psi0 = B0 * R0 * R0 / 4.0;
        // here, pp is the mu0 * p^prime
        double pp = -2.0 * (1.0 + 4.0 * E * E) * psi0 /
            (E * E * R0 * R0 * R0 * R0);
        return pp;
    }

    class ParabolicZBC : public dealii::Function<2> {
    public:
        ParabolicZBC(double psi_wall, double r_wall)
            : dealii::Function<2>(1), psi_wall_(psi_wall), r_wall_(r_wall) {}
    
        virtual double value(const dealii::Point<2> &p,
                            unsigned int component = 0) const override
        {
            const double r = p[0];
            return psi_wall_ / (r_wall_ * r_wall_) * (r * r);
        }
    
    private:
        double psi_wall_, r_wall_;
    };



    void GSSolver::apply_boundary_conditions(std::string bctype){
        /*
         bctype = 'normal', r=0 and r=rw: Dirichlet, z=zmin and z=zmax: Neumann
         bctype = 'test_solovev', all Dirichlet BC
        */
        constraints_.clear();
        // 在自适应网格细化（AMR）或不规则网格下，某些单元细化而邻居没细化，
        // 会产生“挂点”（hanging node）
        // 这些点的自由度不能独立，需要通过线性关系（约束）和相邻单元的节点
        // 绑定，否则会出现解不连续
        dealii::DoFTools::make_hanging_node_constraints(dof_handler_,
            constraints_);
        ParabolicZBC parabolic_bc(psi_wall_, 0.3);
        const unsigned int id_rmin=0, id_zmin=1, id_rmax=2, id_zmax=3;
        if (bctype == "normal" or bctype=="normalS") {
            dealii::Functions::ConstantFunction<2> zerofunc(0.0);
            dealii::VectorTools::interpolate_boundary_values(
            dof_handler_, id_rmin, zerofunc, constraints_);
            dealii::Functions::ConstantFunction<2> psiwfunc(psi_wall_);
            dealii::VectorTools::interpolate_boundary_values(
            dof_handler_, id_rmax, psiwfunc, constraints_);
            if (!neumann_zmin_) {
            dealii::Functions::ConstantFunction<2> psizminfunc(psi_zmin_);
            dealii::VectorTools::interpolate_boundary_values(
            dof_handler_, id_zmin, psizminfunc, constraints_);
            }
            // else {
            //      dealii::VectorTools::interpolate_boundary_values(
            //         dof_handler_, id_zmin, parabolic_bc, constraints_);
            // }
            if (!neumann_zmax_) {
            dealii::Functions::ConstantFunction<2> psizmaxfunc(psi_zmax_);
            dealii::VectorTools::interpolate_boundary_values(
            dof_handler_, id_zmax, psizmaxfunc, constraints_);
            }
            // else {
            //      dealii::VectorTools::interpolate_boundary_values(
            //         dof_handler_, id_zmax, parabolic_bc, constraints_);
            // }

        }
        else if (bctype == "test_solovev") {
            // psi = psi0 / R0^4 ((r^2 - R0^2)^2 + z^2/E^2 * r^2)
            // psi0 = B0 R0^2 / 4 where B0=Bz(0,0)
            // p' = -2*(1+4*E^2)*psi0 / (mu0 * E^2 * R0^4)
            double R0 = 0.1, B0 = -0.1;
            double E = 1.0;
            auto psi_exact = [R0,B0,E](const dealii::Point<2> &p) -> double {
                const double r = p[0];
                const double z = p[1];
                return solovevpsi(r, z, R0, B0, E);
            };
            LambdaFunction psi_exact_func(psi_exact);
            for (const unsigned int id:{id_rmin, id_zmin, id_rmax, id_zmax}) {
                dealii::VectorTools::interpolate_boundary_values(
                dof_handler_, id, psi_exact_func, constraints_);
            }
        }
        else {
            throw dealii::ExcMessage("Unknown boundary condition type: " + bctype);
        }
        constraints_.close();
    }




    double GSSolver::pressure_val(double psi, std::string type) {
        if (type == "normal"){
            if (psi > 0.0)
                return p_open_;
            return presparser_.value(dealii::Point<1>(psi));
        }
        else if (type == "normalS"){
            if (psi > 0.0)
                return p_open_ * Cnew_;
            // psi < 0, use the parser
            return presparser_.value(dealii::Point<1>(psi)) * Cnew_;
        }
        else if (type == "test_solovev"){
            double R0 = 0.1, B0 = -0.1, E=1.0;
            double pp = solovevpp(R0, B0, E);
            return pp * psi;
        }
        else{
            throw dealii::ExcMessage("Unknown pressure type: " + type);
        }

    }

    double GSSolver::dpdpsi(double psi, std::string type) {
        double h = 1.e-8 * std::max(1.0, std::fabs(psi));
        double p1 = pressure_val(psi + h, type);
        double p2 = pressure_val(psi - h, type);
        double pp = (p1 - p2) / (2. * h);

        if (std::abs(pp) > 30.0)
            pp = 0.;

        if (type == "normal" || type == "normalS"){
            // dealii::Point<1> psi_point(psi);
            // double pp_inside = presparser_.gradient(psi_point)[0];
            // // transition region
            // double delta_psi = 0.1 * std::abs(psi_wall_);
            // double H_smooth = 0.5 * (1.0 - std::tanh(psi/delta_psi));
            // return pp_inside * H_smooth * Cnew_;

            return pp;
        }
        else if (type == "test_solovev"){
            double R0 = 0.1, B0 = -0.1, E = 1.0;
            return solovevpp(R0, B0, E);
            // return pp;
        }
        else {
            throw dealii::ExcMessage("Unknown pressure type: " + type);
        }
    }



    void GSSolver::assemble_system(std::string type){
        system_matrix_ = 0.0;
        system_rhs_ = 0.0;

        dealii::QGauss<2> quadrature(pd_ + 2);
        dealii::FEValues<2> fe_values(fe_, quadrature,
                                      dealii::update_values |
                                      dealii::update_gradients |
                                      dealii::update_quadrature_points |
                                      dealii::update_JxW_values);

        // psi at quadrature point
        std::vector<double> psi_q(quadrature.size());
        std::vector<dealii::types::global_dof_index> local_dofs(fe_.n_dofs_per_cell());
        // \int \frac{1}{r} (\frac{\partial \psi}{\partial r}\frac{\partial v}{\partial r}
        // + \frac{\partial \psi}{\partial z} \frac{\partial v}{\partial z}) drdz 
        // = \int v \frac{1}{r} \frac{\partial \psi}{\partial r} n_r dz
        // + \int v \frac{1}{r} \frac{\partial \psi}{\partial z} n_z dr
        // +\mu_0 \int rp^\prime v drdz
        for (const auto & cell : dof_handler_.active_cell_iterators()){
            fe_values.reinit(cell);
            cell->get_dof_indices(local_dofs);

            // get psi on quadrature points
            fe_values.get_function_values(psi_vec_, psi_q);

            // local per-cell matrix and vector
            dealii::FullMatrix<double> cell_mat(fe_.n_dofs_per_cell(),
                                fe_.n_dofs_per_cell());
            dealii::Vector<double> cell_rhs(fe_.n_dofs_per_cell());

            cell_mat = 0.0;
            cell_rhs = 0.0;

            for (unsigned int q=0; q < quadrature.size(); q++) {
                const double r = fe_values.quadrature_point(q)[0];
                double pp = dpdpsi(psi_q[q], type); // p^\prime

                // double eps = psi_wall_ * 1.e-1;
                // double w = 0.5 * (1.0 - std::tanh(psi_q[q]/eps));
                // if (r>=0.15) pp *= w;

                for (unsigned int i=0; i < fe_.n_dofs_per_cell(); i++){
                    // dphi(i)/dr(xq), dphi(i)/dz(xq)
                    const dealii::Tensor<1,2> grad_i = fe_values.shape_grad(i,q);

                    for (unsigned int j=0; j < fe_.n_dofs_per_cell(); j++){
                        // dphi(j)/dr(xq), dphi(j)/dz(xq)
                        const dealii::Tensor<1,2> grad_j = fe_values.shape_grad(j,q);
                        if (std::abs(r) > 1.e-7)
                            cell_mat(i,j)+=(grad_i * grad_j) * fe_values.JxW(q) / r;
                        else
                            cell_mat(i,j) += 0.;
                    }

                    const double v_i = fe_values.shape_value(i, q); // test function
                    cell_rhs(i) += r * pp * v_i * fe_values.JxW(q);
                }

            }
            // apply cell matrix to global matrix with BC considered
            constraints_.distribute_local_to_global(cell_mat, cell_rhs,
                                                local_dofs, system_matrix_,
                                                system_rhs_);
        } 

    }


    double GSSolver::calc_separatrix_area() const {
        // calculate the area of the separatrix, i.e., the area where psi=0
        dealii::QGauss<2> quadrature(pd_ + 2);
        dealii::FEValues<2> fe_values(fe_, quadrature,
                                      dealii::update_values |
                                      dealii::update_JxW_values);
        std::vector<double> psi_q(quadrature.size());
        double area = 0.0;
        for (const auto & cell : dof_handler_.active_cell_iterators()){
            fe_values.reinit(cell);
            std::vector<double> psi_q(quadrature.size());
            fe_values.get_function_values(psi_vec_, psi_q);
            for (unsigned int q=0; q < quadrature.size(); q++) {
                if (psi_q[q] < 0.0)
                    area += fe_values.JxW(q);
            }
        }
        return area;
    }

    void GSSolver::solve(std::string type) {
        assemble_system(type);
        dealii::SolverControl solver_control(2000, 1.e-12);
        dealii::TrilinosWrappers::SolverGMRES linear_solver(solver_control);
        // dealii::TrilinosWrappers::SolverCG linear_solver(solver_control);

        dealii::TrilinosWrappers::PreconditionILU preconditioner;
        preconditioner.clear();
        preconditioner.initialize(system_matrix_,1.2);


        tmp_vec_ = 0.0;
        linear_solver.solve(system_matrix_, tmp_vec_,
                         system_rhs_, preconditioner);
        // linear_solver.solve(system_matrix_, tmp_vec_, system_rhs_,
        //                 dealii::TrilinosWrappers::PreconditionIdentity());


        dealii::Vector<double> A_times_b(dof_handler_.n_dofs());
        system_matrix_.vmult(A_times_b, tmp_vec_);
        A_times_b.sadd(-1.0, system_rhs_);
        std::cout << "\n----------debuging........-------------"<<
            "Ax-b l2norm = " << A_times_b.l2_norm() << std::endl;

        constraints_.distribute(tmp_vec_);


    }



    void GSSolver::picardit(std::string type){
        apply_boundary_conditions(type);
        // mark the constraint locations
        dealii::DynamicSparsityPattern dsp(dof_handler_.n_dofs(),
            dof_handler_.n_dofs());
        dealii::DoFTools::make_sparsity_pattern(dof_handler_, dsp,
                constraints_, /*keep_constrained_dofs=*/false);
        system_matrix_.reinit(dsp);
        std::vector<dealii::Point<2>> support_points(dof_handler_.n_dofs());
        dealii::MappingQ1<2> mapping;
        dealii::DoFTools::map_dofs_to_support_points(mapping, 
                dof_handler_, support_points);
        dealii::Vector<double> diff = tmp_vec_;

        if (!initial_guess_read_){
            std::cout << "No initial guess provided, using Solovev." << std::endl;
            InitialGuess solovev;
            dealii::VectorTools::interpolate(dof_handler_, solovev, psi_vec_);
        }

        for (unsigned int it=0; it<maxitnum_; it++){
            solve(type);
            // psi_{new} - psi_{old}
            diff = tmp_vec_;
            diff -= psi_vec_;
            // max_i |diff_i|, infinity-norm of the correction \delta psi(diff)
            const double max_corr = diff.linfty_norm();
            unsigned int max_corr_dof = dealii::numbers::invalid_unsigned_int;
            for (unsigned int i=0; i<diff.size();i++){
                if (std::abs(std::abs(diff(i)) - max_corr) < 1.e-10){
                    max_corr_dof = i;
                    break;
                }
            }
            const dealii::Point<2> max_corr_pt = support_points[max_corr_dof];
            const double r_max_corr = max_corr_pt[0];
            const double z_max_corr = max_corr_pt[1];

            // psi_{n+1} = (1-omg_) * psi_{old} + omg_ * psi_{new}
            // psi_vec_.sadd(1.0-omg_, omg_, tmp_vec_);
            psi_vec_ *= (1.0 - omg_);
            psi_vec_.add(omg_, tmp_vec_);

            area_ = calc_separatrix_area();


            if (type == "normalS"){
                // double cmax=1.2, cmin=0.8;
                double cmax=5.0, cmin=0.2;
                double tmparea_ = area_;
                if (tmparea_ < S_ * 0.1) tmparea_ = S_ * 0.1;

                double alpha_ = omg_ * 0.5;
                if (std::abs((area_-S_)/S_)>0.01){
                    Cnew_ =  (1.0 - alpha_) * Cold_ + alpha_ * Cold_ * S_ / tmparea_;

                    Cnew_ = std::max(cmin, std::min(Cnew_, cmax));
                    
                    Cold_ = Cnew_;
                }
            }

            // if (type == "normalS") {
            //     double error = S_ - area_;
            //     double rel_error = error / S_;
            //     double abs_rel_error = std::min(1.0, std::abs(rel_error));
            //     double kp = 0.2;
            //     double ki = 5.e-3;
            //     double kd = 0.2;
            //     double cmin = 0.1, cmax = 10.;
            //     static double integral_sum = 0.;
            //     static double last_error = 0.0;

            //     integral_sum += rel_error;
            //     integral_sum = std::max(std::min(integral_sum,0.05),-0.05);
            //     double error_derivative = error - last_error;
            //     double deltaC = kp*rel_error + ki*integral_sum + 
            //                     kd * error_derivative;
            //     Cnew_ = Cold_ + deltaC;
            //     Cnew_ = Cold_ * (1.0 - omg_) + omg_ * Cnew_;
            //     Cnew_ = std::max(cmin, std::min(Cnew_, cmax));
            //     Cold_ = Cnew_;
            //     last_error = error;
            // }



            std::cout << "----------------------------------------------------"
                <<std::endl;
            // std::cout << "  Picard " << std::setw(5) << it + 1
            //     << "   max|newpsi-oldpsi| = " << max_corr << std::endl;

            std::cout << "  Picard " << std::setw(5) << it + 1
                  << "   max|newpsi-oldpsi| = " << max_corr
                  << "  at (r,z)=(" << r_max_corr << ", " << z_max_corr << ")\n";
            std::cout << "   tmp_vec_ at (r_max_corr, z_max_corr) is" << 
                tmp_vec_(max_corr_dof) << std::endl;
            std::cout << "   psi_vec_ at (r_max_corr, z_max_corr) is" << 
                psi_vec_(max_corr_dof) << std::endl;


            // double residual_norm_current = calculate_residual_norm(type, psi_vec_);
            // std::cout << "   max residual l2(Ax-b) = " 
            //     << residual_norm_current << std::endl;

            double minpsi = *std::min_element(psi_vec_.begin(), psi_vec_.end());
            double maxpsi = *std::max_element(psi_vec_.begin(), psi_vec_.end());
            std::cout << "          max/min psi = " << maxpsi << ",   "
                << minpsi << std::endl;
            std::cout << " separatrix S = " << area_ << "  ,target S = "
                << S_ << "   ,C = " << Cnew_ << std::endl;

            if (max_corr < tol_){
                std::cout << " Converged in " << it + 1 << "Picard steps.\n";
                return;
            }
        }

        std::cout << 
        "Picard iteration did not converge within maxitnum_ iterations."
        << std::endl;

        std::ofstream diffout_debug("diff_psi_debug.csv");
        std::cout<<"---------------diff_psi_debug 01 ---------"<<std::endl;
        diffout_debug << "r,z,diffpsi\n";
        for (unsigned int i = 0; i < diff.size(); ++i)
            diffout_debug << std::setprecision(17) << support_points[i][0]
                << ',' << support_points[i][1] << ','
            << diff(i) << '\n';
        std::cout<<"---------------diff_psi_debug 01 ---------"<<std::endl;

    }

    
    double GSSolver::step_norm(const dealii::Vector<double> a,
                               const dealii::Vector<double> b) const {
        // calculate the step norm ||a-b||_2
        dealii::Vector<double> diff = a;
        diff -= b;
        return diff.l2_norm();
    }


    double GSSolver::calculate_residual_norm(std::string type, 
            const dealii::Vector<double> &vec){
        dealii::Vector<double> old_psi_vec = psi_vec_;
        psi_vec_ = vec;
    
        assemble_system(type);
    
        // 恢复主解向量
        psi_vec_ = old_psi_vec;
    
        // 2. 计算 A*vec 
        dealii::Vector<double> A_times_vec(dof_handler_.n_dofs());
        system_matrix_.vmult(A_times_vec, vec);
    
        // 3. 计算残差向量 r = A*vec - b(vec)
        //    为了不修改 system_rhs_, 我们使用 A_times_vec 来存储结果
        A_times_vec.sadd(-1.0, system_rhs_);
    
        return A_times_vec.l2_norm();
    }



    void GSSolver::adeptivePicardit(std::string type){
        apply_boundary_conditions(type);
        // mark the constraint locations
        dealii::DynamicSparsityPattern dsp(dof_handler_.n_dofs(),
            dof_handler_.n_dofs());
        dealii::DoFTools::make_sparsity_pattern(dof_handler_, dsp,
                constraints_, /*keep_constrained_dofs=*/false);
        system_matrix_.reinit(dsp);

        if (!initial_guess_read_){
            std::cout << "No initial guess provided, using Solovev." << std::endl;
            InitialGuess solovev;
            dealii::VectorTools::interpolate(dof_handler_, solovev, psi_vec_);
            constraints_.distribute(psi_vec_);
        }

        // adaptive Picard iteration
        double omega = omg_;
        const double min_omega = 1.e-3;
        dealii::Vector<double> psi_current = psi_vec_;
        dealii::Vector<double> psi_last_accepted = psi_current;
        dealii::Vector<double> psi_trial(dof_handler_.n_dofs());
        
        // initial residual
        double residual_norm_current = calculate_residual_norm(type, psi_current);


        for (unsigned int it=0; it<maxitnum_; it++){
            psi_vec_ = psi_current;
            bool step_accepted = false;
            solve(type);
            double current_omega = omega;
            while (current_omega > min_omega){
                // try: psi_trial=(1-omega)*psi_current+omega*psi_next_unrelaxed
                psi_trial = psi_current;
                psi_trial.sadd(1.0-current_omega, current_omega, tmp_vec_);

                double residual_norm_trial = 
                    calculate_residual_norm(type, psi_trial);


                // accept
                if (residual_norm_trial < residual_norm_current){
                    psi_last_accepted = psi_current;
                    psi_current = psi_trial;
                    residual_norm_current = residual_norm_trial;
                    step_accepted = true;
                    omega = std::min(omg_, current_omega * 1.5);
                    break;
                }
                else{
                    current_omega *=0.5;
                }
            }

            if (!step_accepted){
                std::cout <<"\nConvergence failed. omega < min_omega." << std::endl;
                psi_vec_ = psi_current;
                return;
            }


            // update norm
            dealii::Vector<double> diff = psi_current;
            diff -= psi_last_accepted;
            double max_corr_norm = diff.linfty_norm();

            area_ = calc_separatrix_area();
            if (type == "normalS"){
                // double cmax=1.2, cmin=0.8;
                double cmax=2.0, cmin=0.5;
                double tmparea_ = area_;
                if (tmparea_ < S_ * 0.1) tmparea_ = S_ * 0.1;

                double alpha_ = omega * 0.5;
                if (std::abs((area_-S_)/S_)>0.01){
                    Cnew_ =  (1.0 - alpha_) * Cold_ + alpha_ * Cold_ * S_ / tmparea_;

                    Cnew_ = std::max(cmin, std::min(Cnew_, cmax));
                    
                    Cold_ = Cnew_;
                }
            }
            
            
            std::cout << "----------------------------------------------------"
                <<std::endl;
            std::cout << "  Picard " << std::setw(5) << it + 1
                << "   max|newpsi-oldpsi| = " << max_corr_norm <<
                "  ,max residual l2(Ax-b) = " << residual_norm_current << std::endl;

            double minpsi = *std::min_element(psi_vec_.begin(), psi_vec_.end());
            double maxpsi = *std::max_element(psi_vec_.begin(), psi_vec_.end());
            std::cout << "          max/min psi = " << maxpsi << ",   "
                << minpsi << std::endl;
            std::cout << " separatrix S = " << area_ << "  ,target S = "
                << S_ << "   ,C = " << Cnew_ << "  , omega = " << omega << std::endl;
            if (max_corr_norm < tol_){
                std::cout << " Converged in " << it + 1 << "Picard steps.\n";
                return;
            }
        }

        std::cout << 
        "Picard iteration did not converge within maxitnum_ iterations."
        << std::endl;
    }


    void GSSolver::writedata(std::string filename, std::string type) const {
        if (type == "vtk"){
            dealii::DataOut<2> data_out;
            data_out.attach_dof_handler(dof_handler_);
            data_out.add_data_vector(psi_vec_,"psi");
            data_out.build_patches();

            std::ofstream out(filename + ".vtk");
            data_out.write_vtk(out);
        }
        else if (type == "csv") {
            std::ofstream out(filename + ".csv");
            out << "r,z,psi\n";
            std::vector<dealii::Point<2>> support_points(dof_handler_.n_dofs());
            dealii::MappingQ1<2>          mapping;
            dealii::DoFTools::map_dofs_to_support_points(mapping, dof_handler_,
                                           support_points);

            for (unsigned int i = 0; i < psi_vec_.size(); ++i)
                out << std::setprecision(17) << support_points[i][0]
                    << ',' << support_points[i][1] << ','
                << psi_vec_(i) << '\n';
        }
        else {
            throw dealii::ExcMessage("Unknown output type: " + type);
        }
    }

    void GSSolver::load_initial_guess_csv(const std::string &filename){
        auto csvtomapdata = read_initial_guess_csv(filename);

        dealii::MappingQ1<2> mapping;
        std::vector<dealii::Point<2>> support_points(dof_handler_.n_dofs());
        dealii::DoFTools::map_dofs_to_support_points(mapping, dof_handler_,
                                       support_points);

        for (unsigned int i = 0; i < support_points.size(); ++i) {
            std::ostringstream key;
            key << std::setprecision(17)<<support_points[i][0] << ','
                << support_points[i][1];
            auto it = csvtomapdata.find(key.str());
            if (it != csvtomapdata.end()) {
                psi_vec_(i) = it->second; // set initial guess
            } else {
                throw dealii::ExcMessage("Support point "+key.str()+
                                 " is missing in "+filename);
            }
        }
        initial_guess_read_ = true;
        std::cout << "Initial guess loaded from " << filename << std::endl;
    }
        
}
```

* `test_solver.cpp`
```cpp
#include <deal.II/base/parameter_handler.h>
#include <deal.II/base/mpi.h>
#include "../../include/mesh.hpp"
#include "../../include/parameters.hpp"
#include "../../include/solver.hpp"
#include "../../external/CLI11.hpp"

using namespace dealii;
using namespace gsfrc;

int main(int argc, char **argv)
{
    dealii::Utilities::MPI::MPI_InitFinalize mpi_init(argc, argv, 1);
  /* ---------------- read default parameter file -------------- */

    CLI::App app{"GSSolver"};
    std::string init_csv;
    app.add_option("-i,--init", init_csv,
            "Initial guess for the solver (CSV file)");
    CLI11_PARSE(app, argc, argv);

    dealii::ParameterHandler prm;
    gsfrc::Parameters::declare_parameters(prm);
    prm.parse_input("./gsfrc.prm");

    gsfrc::Parameters params;
    params.parse_parameters(prm);

    // mesh
    dealii::Triangulation<2> tria;
    gsfrc::create_uniform_rect_mesh(tria,
                                      params.rmin, params.rmax,
                                      params.zmin, params.zmax,
                                      params.mx, params.my);
    // solver
    gsfrc::GSSolver gs(tria,
                       params.poly_degree,
                       params.max_iter_num,
                       params.tol,
                       params.gscenter,
                       params.psi_wall,
                       params.neumann_zmax,
                       params.neumann_zmin,
                       params.psi_zmax,
                       params.psi_zmin,
                       params.p_open,
                       params.pres_expr, params.constants,
                       params.S);

    std::string type ="normalS"; //"normalS";
    // std::string type ="test_solovev"; //"normalS";

    if(!init_csv.empty()){
        gs.load_initial_guess_csv(init_csv);
        std::cout << "Initial guess loaded from: " << init_csv << std::endl;
    }



    gs.picardit(type);
    // gs.adeptivePicardit(type);
    gs.writedata("psi_numerical","csv");    // → psi_numerical.csv

  return 0;
}
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTgxOTE0NDI3NSwtMjY3MDE2MzYxLC04Nj
I2MjQwMzYsMTQxMzA4ODA0NSwxMzQ4MTQ3NTg3LC0xNDk2NDc4
MjQ5LC03NDE5MzM4MzcsLTEzODAzNDYyNjcsMTkzMzY2Nzk4My
w1OTQ0NzYxMTBdfQ==
-->