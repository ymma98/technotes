# step-33, Euler equation



## 理论

描述可压缩无粘气体运动的方程（即气体动力学的欧拉方程）是一组基本的守恒定律系统。在空间维度 $d$ 下，其形式为：

$$
\partial_t \mathbf{w} + \nabla \cdot \mathbf{F}(\mathbf{w}) = \mathbf{G}(\mathbf{w}),
$$

其中解向量 $\mathbf{w} = (\rho v_1, \ldots, \rho v_d, \rho, E)^T$ 包含以下物理量：  
- $\rho$ 为流体密度  
- $\mathbf{v} = (v_1, \ldots, v_d)^T$ 为流速（因此 $\rho\mathbf{v}$ 表示线性动量密度）  
- $E$ 为气体的能量密度  

该方程组可具体展开为：

$$
\partial_t \mathbf{w}_i + \nabla \cdot \mathbf{F}_i(\mathbf{w}) = \mathbf{G}_i(\mathbf{w}), \quad i = 1, \ldots, \text{dim} + 2.
$$

对于欧拉方程，通量矩阵 $\mathbf{F}$（或通量函数系统）定义为（以 $d = 3$ 为例）：

$$
\mathbf{F}(\mathbf{w}) = 
\begin{pmatrix}
\rho v_1^2 + p & \rho v_2 v_1 & \rho v_3 v_1 \\
\rho v_1 v_2 & \rho v_2^2 + p & \rho v_3 v_2 \\
\rho v_1 v_3 & \rho v_2 v_3 & \rho v_3^2 + p \\
\rho v_1 & \rho v_2 & \rho v_3 \\
(E + p)v_1 & (E + p)v_2 & (E + p)v_3
\end{pmatrix},
$$

右侧源项仅考虑重力效应时，其形式为：
$$
\mathbf{G}(\mathbf{w}) = 
\begin{pmatrix}
g_1 \rho \\
g_2 \rho \\
g_3 \rho \\
0 \\
\rho \mathbf{g} \cdot \mathbf{v}
\end{pmatrix},
$$
其中 $g = (g_1, g_2, g_3)^T$ 表示重力向量。由此，完整的方程组为：


$$
\begin{aligned}
\partial_t (\rho v_i) + \sum_{s=1}^{d} \frac{\partial (\rho v_i v_s + \delta_{is} p)}{\partial x_s} &= g_i \rho, \quad i = 1, \dots, d, \\
\partial_t \rho + \sum_{s=1}^{d} \frac{\partial (\rho v_s)}{\partial x_s} &= 0, \\
\partial_t E + \sum_{s=1}^{d} \frac{\partial ((E + p) v_s)}{\partial x_s} &= \rho \mathbf{g} \cdot \mathbf{v}.
\end{aligned}
$$

这些方程分别描述了动量、质量和能量的守恒。系统通过定义压力的关系闭合：
$$
p = (\gamma - 1)\left(E - \frac{1}{2} \rho |\mathbf{v}|^2\right).
$$
对于空气（主要由氮气和氧气组成）和其他双原子气体，比热容比为 $\gamma = 1.4$。

### 离散化

离散化的过程与通常方式相同，需要考虑这是一个与 step-12 中讨论的简单问题相同类型的双曲问题。我们选择一个有限元空间 $V_h$，并将我们的守恒方程与一个（向量值）测试函数 $\mathbf{z} \in V_h$ 做内积。然后，我们进行分部积分，

$$
\partial_t \mathbf{w} + \nabla \cdot \mathbf{F}(\mathbf{w}) = 0
$$

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dx + \int_{\Omega} \nabla \cdot \mathbf{F}(\mathbf{w}) \cdot \mathbf{z} \, dx = 0
$$

对上式第二项应用分部积分，将导数从 $\mathbf{F}(\mathbf{w})$ 转移到测试函数 $\mathbf{z}$ 上：

$$
\int_{\Omega} \nabla \cdot \mathbf{F}(\mathbf{w}) \cdot \mathbf{z} \, dx =- \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx+ \int_{\partial \Omega} (\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}) \cdot \mathbf{z} \, ds
$$

因此弱形式变为: 

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dx- \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx+ \int_{\partial \Omega} (\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}) \cdot \mathbf{z} \, ds = 0
$$


在边界 $\partial \Omega$ 上，直接使用 $\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}$ 可能导致数值不稳定，特别是在高对流流动非线性问题中。因此，引入数值通量 $\mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n})$，其中 $\mathbf{w}^+$ 和 $\mathbf{w}^-$ 分别表示边界两侧的解。

替换边界项:

$$
\int_{\partial \Omega} (\mathbf{F}(\mathbf{w}) \cdot \mathbf{n}) \, z \, ds \approx \int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds
$$

这里，$z^+$ 通常表示测试函数在边界的上游侧值。

因此，弱形式变为:

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot z \, dx - \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla z \, dx + \int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds = 0
$$


直接使用弱形式可能在数值计算中引入不稳定性，尤其是在高对流流动非线性问题中。为了提高稳定性，通常会添加稳定化项，例如人工黏性或拉普拉斯扩散项。

在给定的方程中，添加了一个稳定化项 $h^\eta (\nabla \mathbf{w}, \nabla z)$，其中：

- $h$ 是网格尺寸。
- $\eta$ 是一个与问题相关的指数，通常用于控制稳定化项的强度。
- $(\nabla \mathbf{w}, \nabla \mathbf{z})$ 表示 $\mathbf{w}$ 和 $\mathbf{z}$ 的梯度的内积。

因此，最终的弱形式为：

$$
\int_{\Omega} \partial_t \mathbf{w} \cdot \mathbf{z} \, dx - \int_{\Omega} \mathbf{F}(\mathbf{w}) : \nabla \mathbf{z} \, dx + h^\eta \int_{\Omega} \nabla \mathbf{w} : \nabla z \, dx + \int_{\partial \Omega} \mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}) \cdot z^+ \, ds \approx 0
$$

这与用户提供的近似式相符。



并用数值通量 $\mathbf{H}$ 来近似边界通量：

$$
\int_{\Omega} (\partial_t \mathbf{w}, \mathbf{z}) + (\nabla \cdot \mathbf{F}(\mathbf{w}), \mathbf{z})
\approx
\int_{\Omega} (\partial_t \mathbf{w}, \mathbf{z}) - (\mathbf{F}(\mathbf{w}), \nabla \mathbf{z}) + h^\eta(\nabla \mathbf{w}, \nabla \mathbf{z}) + \int_{\partial \Omega} \bigl(\mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n}), \mathbf{z}^+\bigr),
$$

其中，上标 $+$ 表示函数的内部迹，$-$ 表示外部迹。扩散项 $h^\eta(\nabla \mathbf{w}, \nabla \mathbf{z})$ 是为了稳定性而引入的，其中 $h$ 为网格尺寸，$\eta$ 为决定扩散量大小的参数。

在边界上，我们必须指定外侧迹 $\mathbf{w}^-$. 根据不同的边界条件，我们可以采用以下任一种方式：

- **流入边界（Inflow boundary）**：$\mathbf{w}^- = \text{desired value}.$
- **超音速流出边界（Supersonic outflow boundary）**：$\mathbf{w}^- = \mathbf{w}^+.$
- **亚音速流出边界（Subsonic outflow boundary）**：$\mathbf{w}^- = \mathbf{w}^+$，但能量分量需修改以满足给定压力 $p_o$，即
  $$
  \mathbf{w}^- = \bigl(\rho^+,\, \rho v_1^+,\, \dots,\, \rho v_d^+,\, p_o/(\gamma - 1) + 0.5\,\rho\,|\mathbf{v}^+|^2\bigr).
  $$
- **反射边界（Reflective boundary）**：设定 $\mathbf{w}^-$ 满足 $(\mathbf{v}^+ + \mathbf{v}^-)\cdot \mathbf{n} = 0$，且 $\rho^- = \rho^+$，$E^- = E^+$。



我们使用时间步进方法来代替上述方程中的时间导数。为简化起见，我们定义在时间步 $n$ 时的空间残差 $\mathbf{B}(\mathbf{w}_n)(\mathbf{z})$ (即与时间导数无关项的和)：

$$
\mathbf{B}(\mathbf{w}_n)(\mathbf{z})
= - \int_{\Omega} \bigl(\mathbf{F}(\mathbf{w}_n), \nabla \mathbf{z}\bigr)+ h^\eta \bigl(\nabla \mathbf{w}_n, \nabla \mathbf{z}\bigr)+ \int_{\partial \Omega} \bigl(\mathbf{H}(\mathbf{w}_n^+, \mathbf{w}_n^-, \mathbf{n}), \mathbf{z}\bigr)- \int_{\Omega} \bigl(\mathbf{G}(\mathbf{w}_n), \mathbf{z}\bigr).
$$

在每个时间步，我们的完整离散化要求对任意测试函数 $\mathbf{z}$ 所得到的残差为零：

$$
\mathbf{R}(\mathbf{W}_{n+1})(\mathbf{z})
= \int_{\Omega} \Bigl(\frac{\mathbf{w}_{n+1} - \mathbf{w}_n}{\delta t}, \mathbf{z}\Bigr)+ \theta \,\mathbf{B}(\mathbf{w}_{n+1})+ (1 - \theta)\,\mathbf{B}(\mathbf{w}_n)
= 0,
$$

其中 $\theta \in [0,1]$，且 $\mathbf{w}_i = \sum_{k} \mathbf{W}_i^k\,\phi_k.$ 选择 $\theta = 0$ 得到显式（前向）Euler 方案，$\theta = 1$ 对应稳定的隐式（后向）Euler 方案，$\theta = \tfrac12$ 对应 Crank–Nicolson 方案。

在下面的实现中，我们对通量函数 $\mathbf{H}$ 选择 Lax–Friedrichs 通量，即

$$
\mathbf{H}(\mathbf{a}, \mathbf{b}, \mathbf{n})
= \tfrac12\Bigl(\mathbf{F}(\mathbf{a})\cdot \mathbf{n} + \mathbf{F}(\mathbf{b})\cdot \mathbf{n} + \alpha \,\bigl(\mathbf{a}-\mathbf{b}\bigr)\Bigr),
$$

其中 $\alpha$ 要么是输入文件中给定的常数，要么是与网格相关的量。在后者情况下，它可取为 $-\tfrac{h}{2\,\delta t}$，其中 $h$ 是施加该通量的面的直径，$\delta t$ 是当前时间步。

基于上述选择，让残差为零即可得到非线性方程组 $\mathbf{R}(\mathbf{W}_{n+1}) = 0$。我们使用牛顿迭代（与 step-15 中相同的方法）来求解这一非线性方程组，即通过以下迭代：

$$
\mathbf{R}'\bigl(\mathbf{W}_{n+1}^k,\;\delta \mathbf{W}_{n+1}^k\bigr)(\mathbf{z})
= -\,\mathbf{R}\bigl(\mathbf{W}_{n+1}^k\bigr)(\mathbf{z})
\quad \forall\,\mathbf{z}\in V_h,
$$

$$
\mathbf{W}_{n+1}^{k+1}
= \mathbf{W}_{n+1}^k + \delta \mathbf{W}_{n+1}^k,
$$

直到 $\bigl|\mathbf{R}(\mathbf{W}_{n+1}^k)\bigr|$（残差）足够小为止。若仅使用有限元空间的节点基函数来检验，而不使用所有 $\mathbf{z}$，则可得到一个关于 $\delta \mathbf{W}$ 的线性方程组：

$$
\mathbf{R}'\bigl(\mathbf{W}_{n+1}^k\bigr)\,\delta \mathbf{W}_{n+1}^k
= -\,\mathbf{R}\bigl(\mathbf{W}_{n+1}^k\bigr).
$$

通常，该线性方程组既不对称也没有特定的正定性。我们将使用直接求解器或 Trilinos 的 GMRES 方法来求解它。正如后文所示，这种全隐式迭代往往收敛非常迅速（通常 3 步左右），并且具有牛顿方法所期望的二次收敛阶。


## 自动微分

由于计算雅可比矩阵 $\mathbf{R}'(\mathbf{W}^k)$ 极其繁琐，我们使用自动微分工具包 Sacado 来完成此任务。Sacado 是 Trilinos 框架中的一个包，提供了 C++ 模板类 `Sacado::Fad::DFad`（Fad 代表“前向自动微分”），支持常见算术运算以及诸如 $\sqrt{\phantom{x}}$、$\sin$、$\cos$、$\mathrm{pow}$ 等函数。要使用该功能，需要先声明一组此类变量，并将其中一些标记为自由度，其他变量作为独立变量的函数。这些变量在算法中被使用，并且当变量被使用时，它们相对于自由度的敏感性会被持续更新。

可以想象，对于整体的完整雅可比矩阵而言，这个过程可能会非常昂贵：独立变量是 $\mathbf{W}^k$，而依赖变量是向量 $\mathbf{R}(\mathbf{W}^k)$ 的各个分量。这两种向量都可能拥有数万甚至更多分量。然而，需要注意的是，并非 $\mathbf{R}$ 的所有分量都依赖于 $\mathbf{W}^k$ 的所有分量：实际上，$\mathbf{R}$ 中的某个分量仅在其对应的形函数与 $\mathbf{W}^k$ 中的某个分量所对应的形函数在弱形式上有重叠且耦合时才会依赖它。

更具体地讲，明智的做法是定义一组最小数量的独立 AD (auto differential) 变量，使得当前单元上的残差可能依赖它们：在每个单元上，我们仅将对应于该单元自由度（或者，如果需要计算单元间跳跃项，则对应于两个相邻单元之一的自由度）的那些变量定义为独立变量，而局部残差向量的分量则是依赖变量。如果不这样做（例如，将 $\mathbf{W}^k$ 的*所有*分量都定义为独立变量），将导致非常昂贵的零值计算：局部残差向量的分量与解向量的绝大多数分量都无关，因此它们的导数为零；然而，计算这些零值的过程本身就可能占用整个程序 90% 以上的计算时间。早些年，一位学生无意中做的一个实验就证实了这一点。

回到自动计算雅可比矩阵的问题：作者曾在不可压缩 Navier–Stokes 问题中同时使用了手动编写的雅可比矩阵和 Sacado 方案进行对比测试，发现 Sacado 方法的速度与手动编写的雅可比矩阵不相上下，但大大简化了实现并减少了错误：因为使用自动微分只需要实现残差 $\mathbf{R}(\mathbf{W})$ 的代码即可，从而保证了正确性并极大地降低了维护成本。换言之，雅可比矩阵 $\mathbf{R}'$ 基本上由与计算残差 $\mathbf{R}$ 相同的代码来获取，这使得代码维护更加简单。

说到这里，下面给出一个如何使用 Sacado 的简短示例：

```cpp
#include <Sacado.hpp>
#include <iostream>

using fad_double = Sacado::Fad::DFad<double>;

main() {

  fad_double a,b,c;

  a = 1; b = 2;

  a.diff(0,2);  // Set a to be dof 0, in a 2-dof system.

  b.diff(1,2);  // Set b to be dof 1, in a 2-dof system.

  c = 2*a+cos(a*b);

  double *derivs = &c.fastAccessDx(0); // Access derivatives

  std::cout << "dc/da = " << derivs[0] << ", dc/db=" << derivs[1] << std::endl;

}
```

输出结果是以下偏导数
$$
\frac{\partial c(a,b)}{\partial a}, \quad \frac{\partial c(a,b)}{\partial b}
$$
其中
$$
c(a,b) = 2a + \cos(a\,b)
$$
并在 $a=1, b=2$ 处进行计算。

需要注意的是，Sacado 能提供比上述程序中使用的那部分更多的自动微分功能。然而，理解上述示例已经足以让我们理解如何在本 Euler 流动程序中使用 Sacado。

## Trilinos 求解器

该程序使用 Trilinos 包提供的 Aztec 迭代求解器或 Amesos 稀疏直接求解器。该包本质上是为并行程序设计的，但在这里也可以方便地用于串行方式。Epetra 包是构建这些求解器所基于的基础向量/矩阵库。这个功能非常强大的包可以用来描述向量在并行环境下的分布，以及定义在这些向量上操作的稀疏矩阵。有关在示例中如何使用这些求解器的更多细节，可参阅带有注释的代码。

## 自适应 (Adaptivity)

本示例采用一种特定的加密指标，用于在激波类型的问题以及包含向下流动示例中展现一定的效果。我们根据密度的平方梯度来进行网格加密。在相邻单元具有不同细化级别的情况下，通过计算它们之间的数值通量来处理悬挂节点，而不是像之前的所有教程程序那样使用 `AffineConstraints` 类。这样一来，该示例结合了连续与 DG 的方法，并且在使用自动微分计算雅可比矩阵时，无需跟踪被约束的自由度，从而简化了雅可比矩阵的生成过程。

此外，我们还限制了最大细化层数来避免细化过程失控。根据作者的经验，在时间相关问题中，如果不加以控制，细化会使得模拟速度严重下降，因为当某个区域的网格过于精细时，时间步长可能会变得非常小。在本示例中，通过让用户指定网格中可能出现的最高细化级别来限制细化程度，从而避免模拟因过度细化而停滞。

## 输入文件、初始与边界条件

我们使用一个输入文件（input deck）来控制模拟。通过这种方式，可以在不重新编译的情况下更改边界条件和其他重要属性。关于输入文件格式的更多信息，请参阅结尾的 results 小节，其中详细介绍了一个示例输入文件。

在之前的示例程序中，我们通常将初始条件和边界条件硬编码在程序里。而在本程序中，我们改用 `FunctionParser` 表达式解析器类，这样就可以在输入文件中指定通用表达式，并在运行时进行解析 —— 也就是说，我们无需重新编译程序就能更改初始条件。因此，在下面的程序中不会声明名为 `InitialConditions` 或 `BoundaryConditions` 的类。

## 实现 (Implementation)

本程序的实现分为三个主要部分：

- `EulerEquations` 类：封装所有完全描述欧拉方程特性的内容，包括通量矩阵 $\mathbf{F}(\mathbf{W})$，数值通量 $\mathbf{F}(\mathbf{W}^+, \mathbf{W}^-, \mathbf{n})$，右端项 $\mathbf{G}(\mathbf{W})$，边界条件，加密指标以及后处理输出等需要了解解向量和方程各分量意义的内容。

- 一个命名空间（namespace），包含所有与运行时参数相关的内容。

- `ConservationLaw` 类：处理时间步进、外层非线性和内层线性求解、组装线性系统，以及驱动这一切的顶层逻辑。

之所以这样安排，是因为它将程序中的各种关注点分开：`ConservationLaw` 的写法使得我们可以相对容易地将其改为适用于另一组方程：只需为其他双曲方程重新实现 `EulerEquations` 类的成员，或者通过添加新的方程（例如对额外变量的输运，或者加入化学反应等）来扩展当前方程即可。然而，这样的修改不会影响时间步进或非线性求解（只要实现正确），因此也无需修改 `ConservationLaw` 中的任何内容。

同样，如果我们想改进线性或非线性求解器，或者像在 results 小节末尾所暗示的那样改进时间步进方案，那么这也不需要对 `EulerEquations` 做任何改动。


## commented program

### include files

```cpp
  #include <deal.II/base/quadrature_lib.h>
  #include <deal.II/base/function.h>
  #include <deal.II/base/parameter_handler.h>
  #include <deal.II/base/function_parser.h>
  #include <deal.II/base/utilities.h>
  #include <deal.II/base/conditional_ostream.h>

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
```

然后，如引言中提到的，我们使用各种Trilinos包作为线性求解器以及自动微分。这些在以下包含文件中

```cpp
  #include <deal.II/lac/trilinos_sparse_matrix.h>
  #include <deal.II/lac/trilinos_precondition.h>
  #include <deal.II/lac/trilinos_solver.h>
```

Sacado是Trilinos中的自动微分包，用于找到完全隐式牛顿迭代的雅可比矩阵：

```cpp
  #include <Sacado.hpp>
```

```cpp
  #include <iostream>
  #include <fstream>
  #include <vector>
  #include <memory>
  #include <array>
```

```cpp
  namespace Step33
  {
    using namespace dealii;
```



### 欧拉方程的具体内容

在这里，我们定义了该特定系统的守恒定律的通量函数，以及与欧拉方程（用于气体动力学）相关的所有其他内容。我们将所有这些内容分组到一个结构体中，以定义与通量相关的所有内容。

该结构体的所有成员都是 `static` 的，即该结构体没有由实例成员变量指定的实际状态。声明为 `static` 可以在不创建类实例的情况下调用这些函数，提高了代码的灵活性和可重用性。实现这一点的更好方式，而不是使用一个所有成员均为 `static` 的结构体，是使用命名空间——但命名空间无法模板化，而我们希望结构体的某些成员变量依赖于空间维度。因此，我们按照通常的方式使用模板参数进行引入：

```cpp
template <int dim>
struct EulerEquations
{
```

首先，我们定义一些变量来描述解向量（solution vector）的各个components。这包括系统中component的数量（欧拉方程在每个空间方向上都有一个动量项，再加上能量和密度项，因此总共有 $dim + 2$ 个component），以及描述解向量中第一个动量component、密度component和能量密度component索引的函数。

请注意，所有这些数值都依赖于空间维度；以通用的方式（而不是通过隐式约定）定义它们，使得代码更具灵活性，并且在以后扩展它（例如向方程添加更多组件）时更容易。

```cpp
static const unsigned int n_components          = dim + 2;
static const unsigned int first_momentum_component = 0;
static const unsigned int density_component     = dim;
static const unsigned int energy_component      = dim + 1;
```

在程序的后续部分，我们需要指定解变量的名称，以及如何将不同的组件分组为矢量场和标量场。我们可以在代码的其他地方描述这些内容，但为了使与欧拉方程相关的内容保持局部化，而使程序的其余部分尽可能通用，我们将在以下两个函数中提供这些信息。

```cpp
      static std::vector<std::string> component_names()
      {
        std::vector<std::string> names(dim, "momentum");
        names.emplace_back("density");
        names.emplace_back("energy_density");

        return names;
      }

      static std::vector<DataComponentInterpretation::DataComponentInterpretation>
      component_interpretation()
      {
        std::vector<DataComponentInterpretation::DataComponentInterpretation>
          data_component_interpretation(
            dim, DataComponentInterpretation::component_is_part_of_vector);
        data_component_interpretation.push_back(
          DataComponentInterpretation::component_is_scalar);
        data_component_interpretation.push_back(
          DataComponentInterpretation::component_is_scalar);

        return data_component_interpretation;
      }
```


接下来，我们定义气体常数（gas constant）。我们将在该类的声明之后立即将其定义为 $1.4$（与上面定义的整数变量不同，在 C++ 中，`static const` 浮点成员变量不能在类声明中初始化）。该值 $1.4$ 代表由双原子分子组成的气体，例如空气，其中几乎完全由 $N_2$ 和 $O_2$ 组成，仅包含少量其他痕量气体。

```cpp
static const double gas_gamma;
```

在接下来的计算中，我们需要从守恒变量向量中计算动能和压强。我们可以基于能量密度以及动能计算这些值：

$$
\frac{1}{2} \rho |\mathbf{v}|^2 = \frac{|\rho \mathbf{v}|^2}{2\rho}
$$

（请注意，独立变量包含的是动量分量 $\rho v_i$，而不是速度分量 $v_i$）。

```cpp
      template <typename InputVector>
      static typename InputVector::value_type
      compute_kinetic_energy(const InputVector &W)
      {
        typename InputVector::value_type kinetic_energy = 0;
        for (unsigned int d = 0; d < dim; ++d)
          kinetic_energy +=
            W[first_momentum_component + d] * W[first_momentum_component + d];
        kinetic_energy *= 1. / (2 * W[density_component]);

        return kinetic_energy;
      }

      template <typename InputVector>
      static typename InputVector::value_type
      compute_pressure(const InputVector &W)
      {
        return ((gas_gamma - 1.0) *
                (W[energy_component] - compute_kinetic_energy(W)));
      }
```

$$
\mathbf{F}(\mathbf{w}) = 
\begin{pmatrix}
\rho v_1^2 + p & \rho v_2 v_1 & \rho v_3 v_1 \\
\rho v_1 v_2 & \rho v_2^2 + p & \rho v_3 v_2 \\
\rho v_1 v_3 & \rho v_2 v_3 & \rho v_3^2 + p \\
\rho v_1 & \rho v_2 & \rho v_3 \\
(E + p)v_1 & (E + p)v_2 & (E + p)v_3
\end{pmatrix}
$$

完整的方程组为：

$$
\begin{aligned}
\partial_t (\rho v_i) + \sum_{s=1}^{d} \frac{\partial (\rho v_i v_s + \delta_{is} p)}{\partial x_s} &= g_i \rho, \quad i = 1, \dots, d, \\
\partial_t \rho + \sum_{s=1}^{d} \frac{\partial (\rho v_s)}{\partial x_s} &= 0, \\
\partial_t E + \sum_{s=1}^{d} \frac{\partial ((E + p) v_s)}{\partial x_s} &= \rho \mathbf{g} \cdot \mathbf{v}.
\end{aligned}
$$

我们将通量函数 $F(\mathbf{W})$ 定义为一个大矩阵。该矩阵的每一行代表该行对应的分量的标量守恒定律。该矩阵的具体形式在介绍部分已经给出。需要注意的是，我们知道该矩阵的大小：它有与系统组件数量相等的行数，以及 $dim$ 列数；而不是使用 `FullMatrix` 对象（`FullMatrix` 具有可变的行数和列数，因此每次创建这样一个矩阵时都必须在堆上分配内存），我们直接使用一个规则的数值数组。

我们对通量函数的数值类型进行模板化，以便可以在此处使用自动微分类型。同样，我们会使用不同类型的输入向量调用该函数，因此我们也对其进行模板化：

```cpp
template <typename InputVector>
static void compute_flux_matrix(const InputVector &W,
    ndarray<typename InputVector::value_type,
            EulerEquations<dim>::n_components,
            dim> &flux)
{
```


首先计算出出现在通量矩阵中的压力项，然后计算矩阵前 $dim$ 列，这些列对应于动量项：

```cpp
        const typename InputVector::value_type pressure = compute_pressure(W);

        for (unsigned int d = 0; d < dim; ++d)
          {
            for (unsigned int e = 0; e < dim; ++e)
              flux[first_momentum_component + d][e] =
                W[first_momentum_component + d] *
                W[first_momentum_component + e] / W[density_component];

            flux[first_momentum_component + d][d] += pressure;
          }
```
Then the terms for the density (i.e. mass conservation), and, lastly, conservation of energy:
```cpp
        for (unsigned int d = 0; d < dim; ++d)
          flux[density_component][d] = W[first_momentum_component + d];

        for (unsigned int d = 0; d < dim; ++d)
          flux[energy_component][d] = W[first_momentum_component + d] /
                                      W[density_component] *
                                      (W[energy_component] + pressure);
      }
```

在领域的边界和悬挂节点上，我们使用数值通量函数来强制执行边界条件。这个例程是基本的Lax-Friedrich通量，带有一个稳定化参数a。它的形式已经在引言中给出：

```cpp
      template <typename InputVector>
      static void numerical_normal_flux(
        const Tensor<1, dim>                                       &normal,
        const InputVector                                          &Wplus,
        const InputVector                                          &Wminus,
        const double                                                alpha,
        std::array<typename InputVector::value_type, n_components> &normal_flux)
      {
        ndarray<typename InputVector::value_type,
                EulerEquations<dim>::n_components,
                dim>
          iflux, oflux;

        compute_flux_matrix(Wplus, iflux);
        compute_flux_matrix(Wminus, oflux);

        for (unsigned int di = 0; di < n_components; ++di)
          {
            normal_flux[di] = 0;
            for (unsigned int d = 0; d < dim; ++d)
              normal_flux[di] += 0.5 * (iflux[di][d] + oflux[di][d]) * normal[d];

            normal_flux[di] += 0.5 * alpha * (Wplus[di] - Wminus[di]);
          }
      }
```

$$
\mathbf{H}(\mathbf{w}_{n+}, \mathbf{w}_{n-}, \mathbf{n})
= \tfrac12\Bigl(\mathbf{F}(\mathbf{w}_{n+})\cdot \mathbf{n} + \mathbf{F}(\mathbf{w}_{n-})\cdot \mathbf{n} + \alpha \,\bigl(\mathbf{w}_{n+}-\mathbf{w}_{n-}\bigr)\Bigr),
$$

```cpp
      template <typename InputVector>
      static void numerical_normal_flux(
        const Tensor<1, dim>                                       &normal,
        const InputVector                                          &Wplus,
        const InputVector                                          &Wminus,
        const double                                                alpha,
        std::array<typename InputVector::value_type, n_components> &normal_flux)
      {
        ndarray<typename InputVector::value_type,
                EulerEquations<dim>::n_components,
                dim>
          iflux, oflux;

        compute_flux_matrix(Wplus, iflux);
        compute_flux_matrix(Wminus, oflux);

        for (unsigned int di = 0; di < n_components; ++di)
          {
            normal_flux[di] = 0;
            for (unsigned int d = 0; d < dim; ++d)
              normal_flux[di] += 0.5 * (iflux[di][d] + oflux[di][d]) * normal[d];

            normal_flux[di] += 0.5 * alpha * (Wplus[di] - Wminus[di]);
          }
      }
```

与描述通量函数 $\mathbf{F}(\mathbf{w})$ 相同，我们还需要一种方法来描述右端项的外力。正如介绍部分所提到的，我们这里仅考虑重力，这导致特定形式：

$$
\mathbf{G}(\mathbf{w}) = (g_1 \rho, g_2 \rho, g_3 \rho, 0, \rho \mathbf{g} \cdot \mathbf{v})^T
$$

这里展示的是三维情况。更具体地说，我们仅考虑：在 3D 中 $\mathbf{g} = (0, 0, -1)^T$，或在 2D 中$\mathbf{g} = (0, -1)^T$


```cpp
      template <typename InputVector>
      static void compute_forcing_vector(
        const InputVector                                          &W,
        std::array<typename InputVector::value_type, n_components> &forcing)
      {
        const double gravity = -1.0;

        for (unsigned int c = 0; c < n_components; ++c)
          switch (c)
            {
              case first_momentum_component + dim - 1:
                forcing[c] = gravity * W[density_component];
                break;
              case energy_component:
                forcing[c] = gravity * W[first_momentum_component + dim - 1];
                break;
              default:
                forcing[c] = 0;
            }
      }
```

另一个需要处理的问题是边界条件。为此，首先定义目前可以处理的边界条件类型：

```cpp
enum BoundaryKind
{
    inflow_boundary,
    outflow_boundary,
    no_penetration_boundary,
    pressure_boundary
};
```

接下来的问题是如何决定在每种边界上该做什么。边界条件是通过在边界外部选择一个值 $\mathbf{w}^-$（给定一个“边界上给定的外部数据”或“外部源项/不均匀项 $\mathbf{j}$，以及可能的内部解值 $\mathbf{w}^+$ ）来指定的。这些值随后被传递给数值通量函数$\mathbf{H}(\mathbf{w}^+, \mathbf{w}^-, \mathbf{n})$ 用于定义边界对双线性形式的贡献。

在某些情况下，边界条件可以针对解向量的每个分量单独指定。例如，如果分量 $c$ 被标记为流入边界（inflow），则 $w_c^−=j_c$, 也就是说把该分量的外侧值直接指定成函数 $j_c$​ 的值; 如果是流出边界（outflow），则：$w_c^- = w_c^+$, 表示外侧解就与内侧相同. 这两个简单情况首先在下面的函数中处理。


不过这里有一个小麻烦，在 C++ 语言层面会显得不太优雅：我们要对输出向量 `Wminus` 进行修改，所以它本不应该是一个 `const` 形参。但在随后的实现里，你会看到它却被写成了 `const`，这是为了让代码可以编译通过。

之所以如此，是因为我们调用这个函数的地方， `Wminus`  的类型是 `Table<2, Sacado::Fad::DFad<double>>`，也就是一个二维的表格（下标分别表示积分点和解向量分量）。当我们调用函数时，写的是 `wminus[q]` 作为最后一个实参。对一个二维 `Table` 进行下标访问，会产生一个临时访问器对象（它相当于一个“一维向量”的视图），正是我们所需要的类型。

然而根据 C++ 1998 和 2003 标准，临时对象不能被绑定到一个非常量的引用形参上（C++11 的 rvalue 引用可以解决这个问题，但当时的标准还不支持）。因此，我们不得不让该形参是 `const`，以便临时对象能够被绑定上。这样做虽然可以让我们继续写入数据（因为真正被 `const` 修饰的是这个访问器对象，而不是它底层指向的表数据），但这仍然是一个不太优雅的“黑科技”做法。

这么做也限制了可用在这个函数模板中的数据类型：如果我们换成普通向量类型，那么被标记为 `const` 后就没法再写入了。眼下没有更好的解决方案，所以我们只好采用这套实用但并不完美的方案。

```cpp
template <typename DataVector>
static void
compute_Wminus(const std::array<BoundaryKind, n_components> &boundary_kind,
               const Tensor<1, dim>                         &normal_vector,
               const DataVector                             &Wplus,
               const Vector<double> &boundary_values,
               /* 
                * 注意这里: Wminus 是 const 形参, 
                * 但我们却在函数体内对它做写操作 (见下方 Wminus[c] = ...).
                * 这是因为 Wminus 可能是一个临时"访问器"对象, 
                * C++98/03 中只能用 const 引用接收临时对象.
                * 在这种情况下,"const"修饰的是这个"访问器"自身, 
                * 而真正的底层数据仍然是可写的.
                */
               const DataVector     &Wminus)
{
  for (unsigned int c = 0; c < n_components; ++c)
    switch (boundary_kind[c])
      {
        case inflow_boundary:
          {
            // 入口边界: 指定某分量 c 的外侧值 = 给定的 boundary_values(c)
            Wminus[c] = boundary_values(c);
            break;
          }

        case outflow_boundary:
          {
            // 出口边界: 外侧值和内侧相同
            Wminus[c] = Wplus[c];
            break;
          }

        // 其他情况略...
      }
}
```

规定的压强边界条件比其他情况更复杂，因为尽管我们直接规定了压强，但实际上我们是在设置能量分量，而该分量将取决于速度和压强。因此，即使这看起来像是狄利克雷（Dirichlet）类型的边界条件，我们仍然会得到能量对速度和密度的敏感性：

```cpp
              // 在该边界上指定或已知p，然后根据内侧解(或入口解)去确定别的量（比如速度、密度），再用理想气体公式填充总能量
              case pressure_boundary:
                {
                  const typename DataVector::value_type density =
                    (boundary_kind[density_component] == inflow_boundary ?
                       boundary_values(density_component) :
                       Wplus[density_component]);

                  typename DataVector::value_type kinetic_energy = 0;
                  for (unsigned int d = 0; d < dim; ++d)
                    if (boundary_kind[d] == inflow_boundary)
                      kinetic_energy += boundary_values(d) * boundary_values(d);
                    else
                      kinetic_energy += Wplus[d] * Wplus[d];
                  kinetic_energy *= 1. / 2. / density;

                  Wminus[c] =
                    boundary_values(c) / (gas_gamma - 1.0) + kinetic_energy;

                  break;
                }

              case no_penetration_boundary:
                {
                  typename DataVector::value_type vdotn = 0;
                  for (unsigned int d = 0; d < dim; ++d)
                    {
                      vdotn += Wplus[d] * normal_vector[d];
                    }
                  // 这里, -2.0 * ... 意味着法向分量被反弹
                  Wminus[c] = Wplus[c] - 2.0 * vdotn * normal_vector[c];
                  break;
                }

              default:
                DEAL_II_NOT_IMPLEMENTED();
            }
      }
```
在这个类中，我们还需要指定如何细化网格。`ConservationLaw` 类将使用 `EulerEquation` 类中提供的所有信息，但它对所求解的具体守恒定律并不关心：它甚至不关心解向量有多少个分量。因此，它无法知道一个合理的refinement indicator应该是什么。

另一方面，我们在这里可以定义一个合理的选择：我们简单地查看密度的梯度，并计算：

$$
\eta_K = \log(1 + |\nabla \rho(\mathbf{x}_K)|)
$$

其中，$\mathbf{x}_K$ 是单元 $K$ 的中心。

当然，也有许多同样合理的细化指示子，但这个方法有效，并且计算简单：


```cpp
      static void
      compute_refinement_indicators(const DoFHandler<dim> &dof_handler,
                                    const Mapping<dim>    &mapping,
                                    const Vector<double>  &solution,
                                    Vector<double>        &refinement_indicators)
      {
        const unsigned int dofs_per_cell = dof_handler.get_fe().n_dofs_per_cell();
        std::vector<unsigned int> dofs(dofs_per_cell);
     
        const QMidpoint<dim> quadrature_formula;
        const UpdateFlags    update_flags = update_gradients;
        FEValues<dim>        fe_v(mapping,
                           dof_handler.get_fe(),
                           quadrature_formula,
                           update_flags);
        // 外层 std::vector：大小为 1，对应于使用的求积公式 QMidpoint<dim> 仅有一个求积点(中点)
        // 内层 std::vector：大小为 n_components，对应于问题的各个分量
        std::vector<std::vector<Tensor<1, dim>>> dU(
          1, std::vector<Tensor<1, dim>>(n_components));

        for (const auto &cell : dof_handler.active_cell_iterators())
          {
            const unsigned int cell_no = cell->active_cell_index();
            fe_v.reinit(cell);
            fe_v.get_function_gradients(solution, dU);

            refinement_indicators(cell_no) = std::log(
              1 + std::sqrt(dU[0][density_component] * dU[0][density_component]));
          }
      }
```


最后，我们定义了一个类，用于实现数据组件的后处理。这个类解决的问题是，我们在欧拉方程的公式中使用的变量是保守的而不是物理的形式：它们是动量密度 $\mathrm{m} = \rho \mathrm{v}$，密度 $\rho$，和能量密度 $E$。我们还希望在输出文件中包括速度 $\mathrm{v} = \mathrm{m}/\rho$ 和压力 $p = (\gamma-1)(E-\frac{1}{2}\rho |\mathrm{v}|^2)$。

`Postprocessor` 类（继承自 `DataPostprocessor<dim>`) 主要做的就是：

-   接收当前求解得到的解（以及其梯度等信息），
-   将其转换为我们感兴趣的物理量（如速度、压力等），
-   告诉可视化工具如何解释各分量，并对输出命名。

在 `step-33` 中，为了进一步观察流体特征，还可能绘制 schlieren plot（施利伦图），它通常用来反映流体密度梯度大小，用于可视化激波或涡流等较剧烈的密度变化区域。代码中通过一个布尔量 `do_schlieren_plot` 来决定是否要输出这个额外的标量场（其值往往与密度梯度的模相关）。




```cpp
      class Postprocessor : public DataPostprocessor<dim>
      {
      public:
        Postprocessor(const bool do_schlieren_plot);

        // 核心函数，用于计算需要输出的量
        virtual void evaluate_vector_field(
          const DataPostprocessorInputs::Vector<dim> &inputs,
          std::vector<Vector<double>> &computed_quantities) const override;
        // 返回输出量对应的名称列表
        virtual std::vector<std::string> get_names() const override;
        // 返回各输出分量如何被解释，是矢量分量还是标量分量等
        virtual std::vector<
          DataComponentInterpretation::DataComponentInterpretation>
        get_data_component_interpretation() const override;
        // 返回一个 `UpdateFlags` 集合，用于告诉该后处理在评估时，需要从有限元求解器或后处理框架获得哪些信息
        virtual UpdateFlags get_needed_update_flags() const override;

      private:
        const bool do_schlieren_plot;
      };
    };

    template <int dim>
    const double EulerEquations<dim>::gas_gamma = 1.4;

    template <int dim>
    EulerEquations<dim>::Postprocessor::Postprocessor(
      const bool do_schlieren_plot)
      : do_schlieren_plot(do_schlieren_plot)
    {}
    template <int dim>
    void EulerEquations<dim>::Postprocessor::evaluate_vector_field(
      const DataPostprocessorInputs::Vector<dim> &inputs,
      std::vector<Vector<double>>                &computed_quantities) const
    {
          const unsigned int n_evaluation_points = inputs.solution_values.size();

      if (do_schlieren_plot == true)
        Assert(inputs.solution_gradients.size() == n_evaluation_points,
               ExcInternalError());

      Assert(computed_quantities.size() == n_evaluation_points,
             ExcInternalError());

      Assert(inputs.solution_values[0].size() == n_components,
             ExcInternalError());

      if (do_schlieren_plot == true)
        {
          Assert(computed_quantities[0].size() == dim + 2, ExcInternalError());
        }
      else
        {
          Assert(computed_quantities[0].size() == dim + 1, ExcInternalError());
        }
            for (unsigned int p = 0; p < n_evaluation_points; ++p)
        {
          const double density = inputs.solution_values[p](density_component);

          for (unsigned int d = 0; d < dim; ++d)
            computed_quantities[p](d) =
              inputs.solution_values[p](first_momentum_component + d) / density;

          computed_quantities[p](dim) =
            compute_pressure(inputs.solution_values[p]);

          if (do_schlieren_plot == true)
            computed_quantities[p](dim + 1) =
              inputs.solution_gradients[p][density_component] *
              inputs.solution_gradients[p][density_component];
        }
    }

    template <int dim>
    std::vector<std::string> EulerEquations<dim>::Postprocessor::get_names() const
    {
      std::vector<std::string> names;
      for (unsigned int d = 0; d < dim; ++d)
        names.emplace_back("velocity");
      names.emplace_back("pressure");

      if (do_schlieren_plot == true)
        names.emplace_back("schlieren_plot");

      return names;
    }

    template <int dim>
    std::vector<DataComponentInterpretation::DataComponentInterpretation>
    EulerEquations<dim>::Postprocessor::get_data_component_interpretation() const
    {
      std::vector<DataComponentInterpretation::DataComponentInterpretation>
        interpretation(dim,
                       DataComponentInterpretation::component_is_part_of_vector);

      interpretation.push_back(DataComponentInterpretation::component_is_scalar);

      if (do_schlieren_plot == true)
        interpretation.push_back(
          DataComponentInterpretation::component_is_scalar);

      return interpretation;
    }

    template <int dim>
    UpdateFlags
    EulerEquations<dim>::Postprocessor::get_needed_update_flags() const
    {
      if (do_schlieren_plot == true)
        return update_values | update_gradients;
      else
        return update_values;
    }
```



### Run time parameter handling

我们的下一个任务是定义一些类，这些类将包含运行时参数（例如求解器容差、迭代次数、稳定化参数等）。

我们将运行时参数拆分为几个独立的结构，并将它们全部放入命名空间 `Parameters` 中。在这些类中，有一些用于特定类别的参数组，例如求解器、网格细化或输出。每个类都有 `declare_parameters()` 和 `parse_parameters()` 函数，它们用于在 `ParameterHandler` 对象中声明参数子部分和条目，并从该对象中检索实际参数值。这些类的所有参数都声明在 `ParameterHandler` 的子部分中。

以下命名空间的最终类通过从所有前述类继承并处理输入文件顶层的几个额外条目来整合所有这些类。此外，它还会处理一些零散的其他条目，这些条目过于简单，无法单独构成一个结构。

这里需要指出一点：下面的所有类都没有构造函数来初始化各个成员变量。不过这并不是问题，因为我们会从输入文件中读取这些类中声明的所有变量（或者间接地：`ParameterHandler` 对象会从输入文件中读取它们，并提供这些值），这样它们就会被正确初始化。如果某个变量在输入文件中根本没有指定，这同样不是问题：在这种情况下，`ParameterHandler` 类会采用 `declare_parameters()` 函数声明该条目时指定的默认值。

```cpp
    namespace Parameters
    {
```

####  Parameters::Solver

处理线性求解器的参数。它提供的参数包括用于指定求解器的选项。

具体来说，ILUT （incomplete LU decomposition） 接受以下参数：
- `ilut_fill`：在执行 ILU 分解时需要添加的额外条目数。
- `ilut_atol`，`ilut_rtol`：在构造预处理器时，对于某些问题，糟糕的条件数（或单纯的运气不好）可能导致预处理器的条件非常差。因此，可以通过在对角线上添加扰动来改善原始矩阵，并基于此构造一个条件稍好的预处理器。`ATOL` 是一个绝对扰动量，被添加到对角线上以形成预处理器，而 `RTOL` 是一个缩放因子，满足 $r_{tol} \geq 1$。
- `ilut_drop`：ILUT 会丢弃任何小于此值的数值。这是控制该预处理器使用内存量的一种方式。

```cpp
      struct Solver
      {
        enum SolverType
        {
          gmres,
          direct
        };
        SolverType solver;

        enum OutputType
        {
          quiet,
          verbose
        };
        OutputType output;

        double linear_residual;
        int    max_iterations;

        double ilut_fill;
        double ilut_atol;
        double ilut_rtol;
        double ilut_drop;

        static void declare_parameters(ParameterHandler &prm);
        void        parse_parameters(ParameterHandler &prm);
      };

      void Solver::declare_parameters(ParameterHandler &prm)
      {
        prm.enter_subsection("linear solver");
        {
          prm.declare_entry(
            "output",
            "quiet",
            Patterns::Selection("quiet|verbose"),
            "State whether output from solver runs should be printed. "
            "Choices are <quiet|verbose>.");
          prm.declare_entry("method",
                            "gmres",
                            Patterns::Selection("gmres|direct"),
                            "The kind of solver for the linear system. "
                            "Choices are <gmres|direct>.");
          prm.declare_entry("residual",
                            "1e-10",
                            Patterns::Double(),
                            "Linear solver residual");
          prm.declare_entry("max iters",
                            "300",
                            Patterns::Integer(),
                            "Maximum solver iterations");
          prm.declare_entry("ilut fill",
                            "2",
                            Patterns::Double(),
                            "Ilut preconditioner fill");
          prm.declare_entry("ilut absolute tolerance",
                            "1e-9",
                            Patterns::Double(),
                            "Ilut preconditioner tolerance");
          prm.declare_entry("ilut relative tolerance",
                            "1.1",
                            Patterns::Double(),
                            "Ilut relative tolerance");
          prm.declare_entry("ilut drop tolerance",
                            "1e-10",
                            Patterns::Double(),
                            "Ilut drop tolerance");
        }
        prm.leave_subsection();
      }

      void Solver::parse_parameters(ParameterHandler &prm)
      {
        prm.enter_subsection("linear solver");
        {
          const std::string op = prm.get("output");
          if (op == "verbose")
            output = verbose;
          if (op == "quiet")
            output = quiet;

          const std::string sv = prm.get("method");
          if (sv == "direct")
            solver = direct;
          else if (sv == "gmres")
            solver = gmres;

          linear_residual = prm.get_double("residual");
          max_iterations  = prm.get_integer("max iters");
          ilut_fill       = prm.get_double("ilut fill");
          ilut_atol       = prm.get_double("ilut absolute tolerance");
          ilut_rtol       = prm.get_double("ilut relative tolerance");
          ilut_drop       = prm.get_double("ilut drop tolerance");
        }
        prm.leave_subsection();
      }
```

#### Parameters::Refinement

determine how the mesh is to be refined


```cpp
      struct Refinement
      {
        bool   do_refine;
        double shock_val;
        double shock_levels;

        static void declare_parameters(ParameterHandler &prm);
        void        parse_parameters(ParameterHandler &prm);
      };

      void Refinement::declare_parameters(ParameterHandler &prm)
      {
        prm.enter_subsection("refinement");
        {
          prm.declare_entry("refinement",
                            "true",
                            Patterns::Bool(),
                            "Whether to perform mesh refinement or not");
          prm.declare_entry("refinement fraction",
                            "0.1",
                            Patterns::Double(),
                            "Fraction of high refinement");
          prm.declare_entry("unrefinement fraction",
                            "0.1",
                            Patterns::Double(),
                            "Fraction of low unrefinement");
          prm.declare_entry("max elements",
                            "1000000",
                            Patterns::Double(),
                            "maximum number of elements");
          prm.declare_entry("shock value",
                            "4.0",
                            Patterns::Double(),
                            "value for shock indicator");
          prm.declare_entry("shock levels",
                            "3.0",
                            Patterns::Double(),
                            "number of shock refinement levels");
        }
        prm.leave_subsection();
      }

      void Refinement::parse_parameters(ParameterHandler &prm)
      {
        prm.enter_subsection("refinement");
        {
          do_refine    = prm.get_bool("refinement");
          shock_val    = prm.get_double("shock value");
          shock_levels = prm.get_double("shock levels");
        }
        prm.leave_subsection();
      }
```

#### Parameters::Flux

接下来是关于通量修改的部分，以提高其稳定性。具体来说，提供了两种选项来稳定 Lax-Friedrichs 通量：可以选择

$$
\mathbf{H}(\mathbf{a}, \mathbf{b}, \mathbf{n}) = \frac{1}{2} \left( \mathbf{F}(\mathbf{a}) \cdot \mathbf{n} + \mathbf{F}(\mathbf{b}) \cdot \mathbf{n} + \alpha (\mathbf{a} - \mathbf{b}) \right)
$$

其中，$\alpha$ 可以是输入文件中指定的固定数值，或者是依赖于网格的值。在后一种情况下，它被选择为

$$
\alpha = \frac{h}{2\delta T}
$$

其中，$h$ 是应用通量的面直径，$\delta T$ 是当前的时间步长。

```cpp
      struct Flux
      {
        enum StabilizationKind
        {
          constant,
          mesh_dependent
        };
        StabilizationKind stabilization_kind;

        double stabilization_value;

        static void declare_parameters(ParameterHandler &prm);
        void        parse_parameters(ParameterHandler &prm);
      };

      void Flux::declare_parameters(ParameterHandler &prm)
      {
        prm.enter_subsection("flux");
        {
          prm.declare_entry(
            "stab",
            "mesh",
            Patterns::Selection("constant|mesh"),
            "Whether to use a constant stabilization parameter or "
            "a mesh-dependent one");
          prm.declare_entry("stab value",
                            "1",
                            Patterns::Double(),
                            "alpha stabilization");
        }
        prm.leave_subsection();
      }

      void Flux::parse_parameters(ParameterHandler &prm)
      {
        prm.enter_subsection("flux");
        {
          const std::string stab = prm.get("stab");
          if (stab == "constant")
            stabilization_kind = constant;
          else if (stab == "mesh")
            stabilization_kind = mesh_dependent;
          else
            AssertThrow(false, ExcNotImplemented());

          stabilization_value = prm.get_double("stab value");
        }
        prm.leave_subsection();
      }
```

#### Parameters::Output

```cpp
      struct Output
      {
        bool   schlieren_plot;
        double output_step;

        static void declare_parameters(ParameterHandler &prm);
        void        parse_parameters(ParameterHandler &prm);
      };

      void Output::declare_parameters(ParameterHandler &prm)
      {
        prm.enter_subsection("output");
        {
          prm.declare_entry("schlieren plot",
                            "true",
                            Patterns::Bool(),
                            "Whether or not to produce schlieren plots");
          prm.declare_entry("step",
                            "-1",
                            Patterns::Double(),
                            "Output once per this period");
        }
        prm.leave_subsection();
      }

      void Output::parse_parameters(ParameterHandler &prm)
      {
        prm.enter_subsection("output");
        {
          schlieren_plot = prm.get_bool("schlieren plot");
          output_step    = prm.get_double("step");
        }
        prm.leave_subsection();
      }
```

#### Parameters::AllParameters

最终，这个类将所有部分整合在一起。它自身声明了一些参数，其中大多数位于参数文件的顶层，同时还包括一些过小而不值得单独创建类的部分。它还包含所有真正与空间维度相关的内容，例如初始条件或边界条件。

由于此类继承自上述所有类，`declare_parameters()` 和 `parse_parameters()` 函数也会调用基类的相应函数。

需要注意的是，该类还负责声明输入文件中指定的初始和边界条件。为此，在这两种情况下，都有类似 `"w_0 value"` 这样的条目，它表示一个关于 $x, y, z$ 的表达式，该表达式用于描述初始条件或边界条件，稍后将由 `FunctionParser` 类解析。类似地，`"w_1"`, `"w_2"` 等也存在，它们表示欧拉方程组的 $dim+2$ 个守恒变量。同样，我们允许在输入文件中使用最多 `max_n_boundaries` 个边界指示符，并且每个指示符可以与流入、流出或压力边界条件相关联，同时对每个分量和每个边界指示符分别指定齐次边界条件。

用于存储边界指示符的数据结构稍微复杂一些。它是一个大小为 `max_n_boundaries` 的数组，其中的元素表示将被接受的边界指示符的范围。对于该数组中的每个条目，我们在 `BoundaryCondition` 结构中存储一对数据：首先，一个大小为 `n_components` 的数组，其中的每个分量指示该解向量分量是否为流入、流出或其他类型的边界；其次，一个 `FunctionParser` 对象，该对象描述此边界 ID 的所有解向量分量。

`BoundaryCondition` 结构需要一个构造函数，因为我们需要在构造时告诉函数解析器对象要描述多少个向量分量。因此，在 `AllParameters::parse_parameters()` 中的 `FunctionParser` 参数表示的公式在初始化时就必须指定，而不能等到解析输入文件时才设定。

出于同样的原因，由于 `Function` 对象在构造时需要知道其向量大小，我们必须在 `AllParameters` 类的构造函数中至少初始化另一个 `FunctionParser` 对象，即用于描述初始条件的那个。

```cpp
      template <int dim>
      struct AllParameters : public Solver,
                             public Refinement,
                             public Flux,
                             public Output
      {
        static const unsigned int max_n_boundaries = 10;

        struct BoundaryConditions
        {
          std::array<typename EulerEquations<dim>::BoundaryKind,
                     EulerEquations<dim>::n_components>
            kind;

          FunctionParser<dim> values;

          BoundaryConditions();
        };

        AllParameters();

        double diffusion_power;

        double time_step, final_time;
        double theta;
        bool   is_stationary;

        std::string mesh_filename;

        FunctionParser<dim> initial_conditions;
        BoundaryConditions  boundary_conditions[max_n_boundaries];

        static void declare_parameters(ParameterHandler &prm);
        void        parse_parameters(ParameterHandler &prm);
      };

      template <int dim>
      AllParameters<dim>::BoundaryConditions::BoundaryConditions()
        : values(EulerEquations<dim>::n_components)
      {
        std::fill(kind.begin(),
                  kind.end(),
                  EulerEquations<dim>::no_penetration_boundary);
      }

      template <int dim>
      AllParameters<dim>::AllParameters()
        : diffusion_power(0.)
        , time_step(1.)
        , final_time(1.)
        , theta(.5)
        , is_stationary(true)
        , initial_conditions(EulerEquations<dim>::n_components)
      {}

      template <int dim>
      void AllParameters<dim>::declare_parameters(ParameterHandler &prm)
      {
        prm.declare_entry("mesh",
                          "grid.inp",
                          Patterns::Anything(),
                          "input file name");

        prm.declare_entry("diffusion power",
                          "2.0",
                          Patterns::Double(),
                          "power of mesh size for diffusion");

        prm.enter_subsection("time stepping");
        {
          prm.declare_entry("time step",
                            "0.1",
                            Patterns::Double(0),
                            "simulation time step");
          prm.declare_entry("final time",
                            "10.0",
                            Patterns::Double(0),
                            "simulation end time");
          prm.declare_entry("theta scheme value",
                            "0.5",
                            Patterns::Double(0, 1),
                            "value for theta that interpolated between explicit "
                            "Euler (theta=0), Crank-Nicolson (theta=0.5), and "
                            "implicit Euler (theta=1).");
        }
        prm.leave_subsection();

        for (unsigned int b = 0; b < max_n_boundaries; ++b)
          {
            prm.enter_subsection("boundary_" + Utilities::int_to_string(b));
            {
              prm.declare_entry("no penetration",
                                "false",
                                Patterns::Bool(),
                                "whether the named boundary allows gas to "
                                "penetrate or is a rigid wall");

              for (unsigned int di = 0; di < EulerEquations<dim>::n_components;
                   ++di)
                {
                  prm.declare_entry("w_" + Utilities::int_to_string(di),
                                    "outflow",
                                    Patterns::Selection(
                                      "inflow|outflow|pressure"),
                                    "<inflow|outflow|pressure>");

                  prm.declare_entry("w_" + Utilities::int_to_string(di) +
                                      " value",
                                    "0.0",
                                    Patterns::Anything(),
                                    "expression in x,y,z");
                }
            }
            prm.leave_subsection();
          }

        prm.enter_subsection("initial condition");
        {
          for (unsigned int di = 0; di < EulerEquations<dim>::n_components; ++di)
            prm.declare_entry("w_" + Utilities::int_to_string(di) + " value",
                              "0.0",
                              Patterns::Anything(),
                              "expression in x,y,z");
        }
        prm.leave_subsection();

        Parameters::Solver::declare_parameters(prm);
        Parameters::Refinement::declare_parameters(prm);
        Parameters::Flux::declare_parameters(prm);
        Parameters::Output::declare_parameters(prm);
      }

      template <int dim>
      void AllParameters<dim>::parse_parameters(ParameterHandler &prm)
      {
        mesh_filename   = prm.get("mesh");
        diffusion_power = prm.get_double("diffusion power");

        prm.enter_subsection("time stepping");
        {
          time_step = prm.get_double("time step");
          if (time_step == 0)
            {
              is_stationary = true;
              time_step     = 1.0;
              final_time    = 1.0;
            }
          else
            is_stationary = false;

          final_time = prm.get_double("final time");
          theta      = prm.get_double("theta scheme value");
        }
        prm.leave_subsection();

        for (unsigned int boundary_id = 0; boundary_id < max_n_boundaries;
             ++boundary_id)
          {
            prm.enter_subsection("boundary_" +
                                 Utilities::int_to_string(boundary_id));
            {
              std::vector<std::string> expressions(
                EulerEquations<dim>::n_components, "0.0");

              const bool no_penetration = prm.get_bool("no penetration");

              for (unsigned int di = 0; di < EulerEquations<dim>::n_components;
                   ++di)
                {
                  const std::string boundary_type =
                    prm.get("w_" + Utilities::int_to_string(di));

                  if ((di < dim) && (no_penetration == true))
                    boundary_conditions[boundary_id].kind[di] =
                      EulerEquations<dim>::no_penetration_boundary;
                  else if (boundary_type == "inflow")
                    boundary_conditions[boundary_id].kind[di] =
                      EulerEquations<dim>::inflow_boundary;
                  else if (boundary_type == "pressure")
                    boundary_conditions[boundary_id].kind[di] =
                      EulerEquations<dim>::pressure_boundary;
                  else if (boundary_type == "outflow")
                    boundary_conditions[boundary_id].kind[di] =
                      EulerEquations<dim>::outflow_boundary;
                  else
                    AssertThrow(false, ExcNotImplemented());

                  expressions[di] =
                    prm.get("w_" + Utilities::int_to_string(di) + " value");
                }

              boundary_conditions[boundary_id].values.initialize(
                FunctionParser<dim>::default_variable_names(),
                expressions,
                std::map<std::string, double>());
            }
            prm.leave_subsection();
          }

        prm.enter_subsection("initial condition");
        {
          std::vector<std::string> expressions(EulerEquations<dim>::n_components,
                                               "0.0");
          for (unsigned int di = 0; di < EulerEquations<dim>::n_components; ++di)
            expressions[di] =
              prm.get("w_" + Utilities::int_to_string(di) + " value");
          initial_conditions.initialize(
            FunctionParser<dim>::default_variable_names(),
            expressions,
            std::map<std::string, double>());
        }
        prm.leave_subsection();

        Parameters::Solver::parse_parameters(prm);
        Parameters::Refinement::parse_parameters(prm);
        Parameters::Flux::parse_parameters(prm);
        Parameters::Output::parse_parameters(prm);
      }
    } // namespace Parameters
```

### Conservation law class

最终，我们定义了一个真正执行操作的类，它处理我们之前定义的所有欧拉方程和参数相关的内容。其公共接口基本与以往相同（现在构造函数接受一个文件名，该文件用于读取参数，并通过命令行传递）。私有函数接口的设计也与通常的结构类似，其中 `assemble_system` 函数被拆分为三个部分：其中一个部分包含对所有单元的主循环，而另外两个部分分别用于计算单元积分和面积分。

```cpp
    template <int dim>
    class ConservationLaw
    {
    public:
      ConservationLaw(const char *input_filename);
      void run();

    private:
      void setup_system();

      void assemble_system();
      void assemble_cell_term(const FEValues<dim>                        &fe_v,
                              const std::vector<types::global_dof_index> &dofs);
      void assemble_face_term(
        const unsigned int                          face_no,
        const FEFaceValuesBase<dim>                &fe_v,
        const FEFaceValuesBase<dim>                &fe_v_neighbor,
        const std::vector<types::global_dof_index> &dofs,
        const std::vector<types::global_dof_index> &dofs_neighbor,
        const bool                                  external_face,
        const unsigned int                          boundary_id,
        const double                                face_diameter);

      std::pair<unsigned int, double> solve(Vector<double> &solution);

      void compute_refinement_indicators(Vector<double> &indicator) const;
      void refine_grid(const Vector<double> &indicator);

      void output_results() const;
```

前几个成员变量也相当标准。需要注意的是，我们定义了一个映射对象，在程序中用于组装各项计算（我们会将其传递给每个 `FEValues` 和 `FEFaceValues` 对象）；我们使用的映射只是标准的 $Q_1$ 映射——换句话说，并没有什么特别的复杂性——但在这里声明一个映射对象并在整个程序中使用它，会使后续需要更改时更加简单。这一点实际上相当重要：众所周知，对于包含欧拉方程的跨音速模拟，如果边界逼近阶次不够高，则即使当 $h \to 0$，计算仍然不会收敛。


```cpp
      Triangulation<dim>   triangulation;
      const MappingQ1<dim> mapping;

      const FESystem<dim> fe;
      DoFHandler<dim>     dof_handler;

      const QGauss<dim>     quadrature;
      const QGauss<dim - 1> face_quadrature;
```

接下来是一些数据向量，它们对应于前一个时间步的解（`old_solution`）、当前解的最佳猜测（`current_solution`，我们称之为“猜测”，因为计算它的牛顿迭代可能尚未收敛），以及下一个时间步解的预测值，该预测值通过对当前解和前一个解进行外推来计算。`old_solution` 指的是前一个时间步的最终收敛解。


```cpp
      Vector<double> old_solution;
      Vector<double> current_solution;
      Vector<double> predictor;

      Vector<double> right_hand_side;
```

这组最终的成员变量（除了最底部存储所有运行时参数的对象以及仅在请求详细输出时才打印内容的屏幕输出流）处理程序中与 Trilinos 库的接口，该库为我们提供线性求解器。类似于在 `step-17` 和 `step-18` 中包含 PETSc 矩阵，我们所需做的只是创建一个 Trilinos 稀疏矩阵，而不是标准的 deal.II 矩阵。系统矩阵用于每个牛顿迭代步骤中的雅可比计算。由于我们不打算以并行方式运行该程序（尽管使用 Trilinos 数据结构进行并行化并不困难），因此我们无需考虑诸如自由度分布之类的其他问题。

```cpp
      TrilinosWrappers::SparseMatrix system_matrix;

      Parameters::AllParameters<dim> parameters;
      ConditionalOStream             verbose_cout;
    };
```

#### ConservationLaw::ConservationLaw

```cpp
    template <int dim>
    ConservationLaw<dim>::ConservationLaw(const char *input_filename)
      : mapping()
      , fe(FE_Q<dim>(1) ^ EulerEquations<dim>::n_components)
      , dof_handler(triangulation)
      , quadrature(fe.degree + 1)
      , face_quadrature(fe.degree + 1)
      , verbose_cout(std::cout, false)
    {
      ParameterHandler prm;
      Parameters::AllParameters<dim>::declare_parameters(prm);

      prm.parse_input(input_filename);
      parameters.parse_parameters(prm);

      verbose_cout.set_condition(parameters.output ==
                                 Parameters::Solver::verbose);
    }
```

#### ConservationLaw::setup_system

每次改变网格时，都会调用以下函数。它所做的只是根据稀疏性模式调整Trilinos 矩阵的大小

```cpp
    template <int dim>
    void ConservationLaw<dim>::setup_system()
    {
      DynamicSparsityPattern dsp(dof_handler.n_dofs(), dof_handler.n_dofs());
      DoFTools::make_sparsity_pattern(dof_handler, dsp);

      system_matrix.reinit(dsp);
    }
```

#### ConservationLaw::assemble_system

这个函数以及接下来的两个函数是该程序的核心部分：它们组装由牛顿方法应用于非线性守恒方程系统所产生的线性系统。

这个第一个函数将所有组装部分整合到一个例程中，并为每个单元/面分配正确的部分。这些对象的实际组装实现是在接下来的函数中完成的。

在函数的开头，我们进行常规的初始化工作：分配 `FEValues`、`FEFaceValues` 和 `FESubfaceValues` 对象，以执行单元、面和子面的积分（在不同细化级别的相邻单元情况下）。需要注意的是，我们不需要为所有对象存储所有信息（例如值、梯度或求积点的真实位置），因此我们仅让 `FEValues` 类根据需要获取最小集合的 `UpdateFlags`。例如，当为相邻单元使用 `FEFaceValues` 对象时，我们只需要形函数值：对于特定的面，求积点和 $J_x^W$ 的值与当前单元的值相同，而法向量已知是当前单元法向量的相反数。

```cpp
    template <int dim>
    void ConservationLaw<dim>::assemble_system()
    {
      const unsigned int dofs_per_cell = dof_handler.get_fe().n_dofs_per_cell();

      std::vector<types::global_dof_index> dof_indices(dofs_per_cell);
      std::vector<types::global_dof_index> dof_indices_neighbor(dofs_per_cell);

      const UpdateFlags update_flags = update_values | update_gradients |
                                       update_quadrature_points |
                                       update_JxW_values,
                        face_update_flags =
                          update_values | update_quadrature_points |
                          update_JxW_values | update_normal_vectors,
                        neighbor_face_update_flags = update_values;

      FEValues<dim>        fe_v(mapping, fe, quadrature, update_flags);
      FEFaceValues<dim>    fe_v_face(mapping,
                                  fe,
                                  face_quadrature,
                                  face_update_flags);
      FESubfaceValues<dim> fe_v_subface(mapping,
                                        fe,
                                        face_quadrature,
                                        face_update_flags);
      FEFaceValues<dim>    fe_v_face_neighbor(mapping,
                                           fe,
                                           face_quadrature,
                                           neighbor_face_update_flags);
      FESubfaceValues<dim> fe_v_subface_neighbor(mapping,
                                                 fe,
                                                 face_quadrature,
                                                 neighbor_face_update_flags);
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzMzkyMjU2ODksMzAwNTcxNTUxLDUyOT
IxOTQyOCwxNTQzNDc0MjYsLTE0NjE4NzA5NjYsODA1MTk2ODE0
LDQwMTcxMDM4NiwyMTA5NjYyMTMwLDE1NzI0MTUwODcsMTE4MD
M3NTcwMiwtMzE4MTQyODc3LDU1MDI5NzM1LDIwMzgxODkzMTMs
MTI5OTc3MzI2LDIwMjIwNjE5NzYsLTY3OTAwODU0Miw2MTM5OD
c2NjAsMTM1ODQ5MzIyOCwxNDU3NzA2MzIwLDE5MzM3MTcyMV19

-->