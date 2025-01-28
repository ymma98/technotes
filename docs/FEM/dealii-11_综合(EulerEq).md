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
\partial_t (\rho v_1) + \sum_{i=1}^d \frac{\partial (\rho v_i v_i + \delta u_i v_i)}{\partial x_i} = g_i \rho, \quad i = 1, \ldots, d,
$$

$$
\partial_t \rho + \sum_{i=1}^d \frac{\partial (\rho v_i v_i)}{\partial x_i} = 0,
$$

$$
\partial_t E + \sum_{i=1}^d \frac{\partial ((E + p)v_i)}{\partial x_i} = \rho g \cdot v.
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

该结构体的所有成员都是 `static` 的，即该结构体没有由实例成员变量指定的实际状态。实现这一点的更好方式，而不是使用一个所有成员均为 `static` 的结构体，是使用命名空间——但命名空间无法模板化，而我们希望结构体的某些成员变量依赖于空间维度。因此，我们按照通常的方式使用模板参数进行引入：

```cpp
template <int dim>
struct EulerEquations
{
}
```

首先，我们定义一些变量来描述解向量（solution vector）的各个components。这包括系统中component的数量（欧拉方程在每个空间方向上都有一个动量项，再加上能量和密度项，因此总共有 $dim + 2$ 个component），以及描述解向量中第一个动量组件、密度组件和能量密度组件索引的函数。

请注意，所有这些数值都依赖于空间维度；以通用的方式（而不是通过隐式约定）定义它们，使得代码更具灵活性，并且在以后扩展它（例如向方程添加更多组件）时更容易。

```cpp
static const unsigned int n_components          = dim + 2;
static const unsigned int first_momentum_component = 0;
static const unsigned int density_component     = dim;
static const unsigned int energy_component      = dim + 1;
```

在程序的后续部分，我们需要指定解变量的名称，以及如何将不同的组件分组为矢量场和标量场。我们可以在代码的其他地方描述这些内容，但为了使与欧拉方程相关的内容保持局部化，而使程序的其余部分尽可能通用，我们将在以下两个函数中提供这些信息。

```

This Markdown version maintains clarity while ensuring all equations are properly enclosed within `$$...$$` or `$...$`. Let me know if you need further refinements!
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE2MDc0NzIzNTgsMjA2MDQzMTUwMiw5Mj
IwNjQxMDMsMjA2MDQzMTUwMiw1MzQ2MTY4MjAsNTM0NjE2ODIw
LC02MjEyMzk4NDIsLTgzNjU4MTE3MywxNjc2OTgzMzIyLC0xOD
gzOTg0MzY4LDY2MTg4NTk4NCw1MjAwNDUyNSwxODYxODkzODg2
LC0xMzk5NDY5NDI0LC0xMTk3Nzc3MTkyLDE1ODYyMTU3MDAsND
U5NDQ5MTk1LDExMDExOTA4NTddfQ==
-->