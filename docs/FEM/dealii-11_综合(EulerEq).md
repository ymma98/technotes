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

// 如引言中所述，我们使用各种 Trilinos 包作为线性求解器以及自动微分工具。这些包含在以下的头文件中。
//
// 由于 deal.II 提供了对基本 Trilinos 矩阵、预条件器和求解器的接口，我们以类似于 deal.II 线性代数结构的方式包含它们。
#include <deal.II/lac/trilinos_sparse_matrix.h>
#include <deal.II/lac/trilinos_precondition.h>
#include <deal.II/lac/trilinos_solver.h>

// Sacado 是 Trilinos 中的自动微分包，用于在完全隐式的牛顿迭代中求解雅可比矩阵：
#include <Sacado.hpp>

// 这里再次包含的是 C++ 标准库：
#include <iostream>
#include <fstream>
#include <vector>
#include <memory>
#include <array>

// 为了结束这一部分，将 dealii 库中的所有内容引入到本程序将使用的命名空间中：
namespace Step33
{
  using namespace dealii;


  // @sect3{Euler equation specifics}

  // 在这里，我们定义了这个特定守恒定律系统的通量函数，以及几乎所有与气体动力学欧拉方程相关的特定内容，如引言中讨论的原因。我们将所有这些内容组合到一个结构体中，该结构体定义了与通量相关的一切。该结构体的所有成员都是静态的，即该结构体没有由实例成员变量指定的实际状态。更好的方法是使用命名空间而不是具有所有静态成员的结构体——但命名空间不能被模板化，而我们希望结构体的一些成员变量依赖于空间维度，这通常通过模板参数引入。
  template <int dim>
  struct EulerEquations
  {
    // @sect4{Component description}

    // 首先，一些变量以通用的方式描述解向量的各个组成部分。这包括系统中的组成部分数量（欧拉方程在每个空间方向有一个动量条目，加上能量和密度组成部分，总共有 <code>dim+2</code> 个组成部分），以及描述解向量中第一个动量组成部分、密度组成部分和能量密度组成部分索引的函数。注意，所有这些数字都依赖于空间维度；以通用方式定义它们（而不是通过隐式约定）使我们的代码更具灵活性，并且更容易在以后扩展，例如通过向方程中添加更多组成部分。
    static const unsigned int n_components             = dim + 2;
    static const unsigned int first_momentum_component = 0;
    static const unsigned int density_component        = dim;
    static const unsigned int energy_component         = dim + 1;

    // 在程序的后面生成图形输出时，我们需要指定解变量的名称以及各个组成部分如何分组为向量和标量场。我们本可以在那里描述这些内容，但为了将与欧拉方程相关的内容局部化，并使程序的其余部分尽可能通用，我们在以下两个函数中提供了此类信息：
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


    // @sect4{Transformations between variables}

    // 接下来，我们定义气体常数。在类声明之后的定义中，我们将其设置为 1.4（与上述的整数变量不同，静态常量浮点成员变量不能在类声明中初始化）。这个 1.4 的值代表由两个原子组成的分子气体，例如主要由 $N_2$ 和 $O_2$ 组成的空气。
    static const double gas_gamma;


    // 在接下来的内容中，我们需要根据守恒变量向量计算动能和压力。我们可以基于能量密度和动能 $\frac 12 \rho |\mathbf v|^2 = \frac{|\rho \mathbf v|^2}{2\rho}$ 来完成（注意，独立变量包含动量分量 $\rho v_i$，而不是速度 $v_i$）。
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


    // @sect4{EulerEquations::compute_flux_matrix}

    // 我们将通量函数 $F(W)$ 定义为一个大矩阵。这个矩阵的每一行代表该行中组成部分的一个标量守恒定律。这个矩阵的确切形式在引言中已经给出。注意我们知道矩阵的大小：它有与系统组成部分数量相同的行和 <code>dim</code> 列；与其使用 FullMatrix 对象（具有可变数量的行和列，因此每次创建此类矩阵时必须在堆上分配内存），我们直接使用一个矩形数值数组。
    //
    // 我们将通量函数的数值类型模板化，以便在这里使用自动微分类型。同样，我们将使用不同输入向量数据类型调用该函数，因此我们也将其模板化：
    template <typename InputVector>
    static void compute_flux_matrix(const InputVector &W,
                                    ndarray<typename InputVector::value_type,
                                            EulerEquations<dim>::n_components,
                                            dim>      &flux)
    {
      // 首先计算出现在通量矩阵中的压力，然后计算矩阵的前 <code>dim</code> 列，这些列对应于动量项：
      const typename InputVector::value_type pressure = compute_pressure(W);

      for (unsigned int d = 0; d < dim; ++d)
        {
          for (unsigned int e = 0; e < dim; ++e)
            flux[first_momentum_component + d][e] =
              W[first_momentum_component + d] *
              W[first_momentum_component + e] / W[density_component];

          flux[first_momentum_component + d][d] += pressure;
        }

      // 然后是密度项（即质量守恒），最后是能量守恒：
      for (unsigned int d = 0; d < dim; ++d)
        flux[density_component][d] = W[first_momentum_component + d];

      for (unsigned int d = 0; d < dim; ++d)
        flux[energy_component][d] = W[first_momentum_component + d] /
                                    W[density_component] *
                                    (W[energy_component] + pressure);
    }


    // @sect4{EulerEquations::compute_normal_flux}

    // 在域的边界和跨挂节点上，我们使用数值通量函数来强制施加边界条件。这个例程是带有稳定化参数 $\alpha$ 的基本 Lax-Friedrichs 通量。其形式在引言中已经给出：
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

    // @sect4{EulerEquations::compute_forcing_vector}

    // 以描述通量函数 $\mathbf F(\mathbf w)$ 的方式，我们还需要描述右端项的强制项。如引言所述，这里我们只考虑重力，这导致了特定的形式 $\mathbf G(\mathbf w) = \left(
    // g_1\rho, g_2\rho, g_3\rho, 0, \rho \mathbf g \cdot \mathbf v
    // \right)^T$，这里以三维情况为例。更具体地，我们将只考虑 $\mathbf g=(0,0,-1)^T$ 在三维中，或者 $\mathbf g=(0,-1)^T$ 在二维中。这自然导致了以下函数：
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


    // @sect4{Dealing with boundary conditions}

    // 我们还必须处理边界条件。为此，让我们首先定义我们当前知道如何处理的边界条件类型：
    enum BoundaryKind
    {
      inflow_boundary,
      outflow_boundary,
      no_penetration_boundary,
      pressure_boundary
    };


    // 下一部分是实际决定在每种边界类型上做什么。为此，记住引言中提到的，边界条件通过在给定不均匀项 $\mathbf j$ 和可能的解的值 $\mathbf w^+$ 在内部，选择边界外部的值 $\mathbf w^-$ 来指定。然后，这两者被传递给数值通量 $\mathbf H(\mathbf{w}^+, \mathbf{w}^-,
    // \mathbf{n})$ 以定义双线性形式的边界贡献。
    //
    // 在某些情况下，可以为解向量的每个组成部分独立地指定边界条件。例如，如果组成部分 $c$ 被标记为流入，则 $w^-_c = j_c$。如果是流出，则 $w^-_c = w^+_c$。下面的函数首先处理这两种简单情况。
    //
    // 这里有一个小问题，从 C++ 语言的角度来看，使这个函数变得不愉快：输出向量 <code>Wminus</code> 当然会被修改，因此它不应该是 <code>const</code> 参数。然而，在下面的实现中它是 const 的，并且需要这样以允许代码编译。原因是我们在一个地方调用这个函数，其中 <code>Wminus</code> 的类型是 <code>Table@<2,Sacado::Fad::DFad@<double@> @></code>，这是一个二维表，其索引分别表示求积点和向量分量。我们以 <code>Wminus[q]</code> 作为最后一个参数调用这个函数；对二维表进行下标操作会生成一个临时访问器对象，表示一个一维向量，正是我们在这里需要的。然而，临时访问器对象不能绑定到函数的非常量引用参数上，这是 C++ 1998 和 2003 标准所规定的（这将在下一个标准中通过右值引用得到修正）。我们通过将输出参数设为常量来解决这个问题，因为这里是访问器对象是常量，而不是它指向的表：后者仍然可以被写入。尽管如此，这种 hack 仍然令人不愉快，因为它限制了可以用作此函数模板参数的数据类型：普通向量无法使用，因为它们在标记为 <code>const</code> 时不能被写入。在目前没有好的解决方案的情况下，我们将采用这里展示的务实但不优雅的解决方案：
    template <typename DataVector>
    static void
    compute_Wminus(const std::array<BoundaryKind, n_components> &boundary_kind,
                   const Tensor<1, dim>                         &normal_vector,
                   const DataVector                             &Wplus,
                   const Vector<double> &boundary_values,
                   const DataVector     &Wminus)
    {
      for (unsigned int c = 0; c < n_components; ++c)
        switch (boundary_kind[c])
          {
            case inflow_boundary:
              {
                Wminus[c] = boundary_values(c);
                break;
              }

            case outflow_boundary:
              {
                Wminus[c] = Wplus[c];
                break;
              }

            // 规定压力边界条件有点复杂，因为即使压力被规定，我们实际上是在设置能量组成部分，这将依赖于速度和压力。因此，尽管这看起来像是迪里克雷类型的边界条件，但我们会获得能量对速度和密度的敏感性（除非这些也被规定）：
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
                // 我们规定速度（我们处理的是一个特定的分量，因此速度的平均值正交于表面法向量。这会导致速度分量的横向敏感性）。
                typename DataVector::value_type vdotn = 0;
                for (unsigned int d = 0; d < dim; ++d)
                  {
                    vdotn += Wplus[d] * normal_vector[d];
                  }

                Wminus[c] = Wplus[c] - 2.0 * vdotn * normal_vector[c];
                break;
              }

            default:
              DEAL_II_NOT_IMPLEMENTED();
          }
    }


    // @sect4{EulerEquations::compute_refinement_indicators}

    // 在这个类中，我们还想指定如何细化网格。将使用我们在 <code>EulerEquations</code> 类中提供的所有信息的 <code>ConservationLaw</code> 类对它所解决的特定守恒定律相当无知：它甚至不知道解向量有多少个组成部分。因此，它无法知道合理的细化指标是什么。另一方面，这里我们知道，或者至少我们可以提出一个合理的选择：我们简单地查看密度的梯度，并计算 $\eta_K=\log\left(1+|\nabla\rho(x_K)|\right)$，其中 $x_K$ 是单元 $K$ 的中心。
    //
    // 当然，还有许多同样合理的细化指标，但这个指标符合要求，并且易于计算：
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



    // @sect4{EulerEquations::Postprocessor}

    // 最后，我们声明一个实现数据组件后处理的类。这个类解决的问题是，我们使用的欧拉方程的形式中的变量是守恒形式而不是物理形式：它们是动量密度 $\mathbf m=\rho\mathbf
    // v$，密度 $\rho$ 和能量密度 $E$。我们还希望在输出文件中包含速度 $\mathbf v=\frac{\mathbf
    // m}{\rho}$ 和压力 $p=(\gamma-1)(E-\frac{1}{2} \rho |\mathbf
    // v|^2)$。
    //
    // 此外，我们还希望添加生成施莱伦图（schlieren plots）的可能性。施莱伦图是一种可视化冲击波和其他尖锐界面的方法。单词 "schlieren" 是德语单词，可以翻译为 "条纹" —— 但通过一个例子可能更容易解释：当你将高度浓缩的酒精或透明的盐水溶液倒入水中时，你会看到这种现象；两者颜色相同，但由于折射率不同，因此在完全混合之前，光线通过混合物时会沿弯曲的射线路径传播，如果你观察它，会导致亮度变化。这就是 "schlieren"。在可压缩流动中，类似的效应发生是因为折射率依赖于气体的压力（因此依赖于密度）。
    //
    // 这个词的起源指的是三维体积的二维投影（我们看到的是三维流体的二维图像）。在计算流体力学中，我们可以通过考虑引起这种效应的原因来了解这种现象：密度变化。因此，施莱伦图通过绘制 $s=|\nabla \rho|^2$ 来生成；显然，$s$ 在冲击波和其他高度动态的地方很大。如果用户需要（在输入文件中指定），我们希望在输出其他派生量的同时生成这些施莱伦图。
    //
    // 从守恒变量计算派生量并将其输出到数据文件的算法实现依赖于 DataPostprocessor 类。它有广泛的文档，类的其他用法也可以在 step-29 中找到。因此，我们在这里不进行详细注释。
    class Postprocessor : public DataPostprocessor<dim>
    {
    public:
      Postprocessor(const bool do_schlieren_plot);

      virtual void evaluate_vector_field(
        const DataPostprocessorInputs::Vector<dim> &inputs,
        std::vector<Vector<double>> &computed_quantities) const override;

      virtual std::vector<std::string> get_names() const override;

      virtual std::vector<
        DataComponentInterpretation::DataComponentInterpretation>
      get_data_component_interpretation() const override;

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


  // 这是唯一一个值得详细注释的函数。当生成图形输出时，DataOut 及相关类将调用这个函数，每个单元都有访问每个求积点的值、梯度、Hessian 和法向量（如果我们在处理面）。注意，每个求积点的数据本身是向量值的，即守恒变量。我们将在每个求积点计算我们感兴趣的量。为此，我们可以忽略 Hessians（"inputs.solution_hessians"）和法向量（"inputs.normals"）。
  template <int dim>
  void EulerEquations<dim>::Postprocessor::evaluate_vector_field(
    const DataPostprocessorInputs::Vector<dim> &inputs,
    std::vector<Vector<double>>                &computed_quantities) const
  {
    // 在函数开始时，让我们确保所有变量具有正确的大小，以便我们可以访问单个向量元素而不必担心可能会读取或写入无效元素；我们还检查 <code>solution_gradients</code> 向量仅在我们真正需要时包含数据（系统通过在下面的 <code>get_needed_update_flags()</code> 函数中声明知道这一点）。对于内部向量，我们检查外部向量的至少第一个元素具有正确的内部大小：
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

    // 然后循环遍历所有求积点并在那里执行我们的工作。代码应该是相当自解释的。输出变量的顺序首先是 <code>dim</code> 个速度，然后是压力，如果需要的话，还有施莱伦图。注意，我们尝试对输入向量中的变量顺序保持通用，使用 <code>first_momentum_component</code> 和 <code>density_component</code> 信息：
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


  // @sect3{Run time parameter handling}

  // 我们的下一个任务是定义一些包含运行时参数的类（例如求解器容差、迭代次数、稳定化参数等）。这些可以在主类中完成，但我们将其与主类分离，以使程序更加模块化和易于阅读：所有与运行时参数相关的内容都将在以下命名空间中，而程序逻辑则在主类中。
  //
  // 我们将运行时参数拆分为几个独立的结构，这些结构都将放入命名空间 <code>Parameters</code> 中。在这些类中，有一些类为单独的组（例如求解器、网格细化或输出）分组参数。每个这些类都有 <code>declare_parameters()</code> 和
  // <code>parse_parameters()</code> 函数，分别在 ParameterHandler 对象中声明参数子部分和条目，并从这样的对象中检索实际的参数值。这些类在 ParameterHandler 的子部分中声明它们的所有参数。
  //
  // 以下命名空间的最后一个类通过从之前的所有类派生并处理输入文件顶层的几个其他条目，以及在子部分中一些过短而不值得单独结构的条目，来组合所有前面的类。
  //
  // 这里值得指出一件事：下面的类中没有任何一个类有一个构造函数来初始化各种成员变量。然而，这不是问题，因为我们将从输入文件中读取这些类中声明的所有变量（或者间接地：ParameterHandler 对象将从那里读取，然后我们将从这个对象中获取值），它们将通过这种方式初始化。如果输入文件中根本没有指定某个变量，这也不是问题：ParameterHandler 类将在这种情况下简单地采用在下面各类的 <code>declare_parameters()</code> 函数中声明条目时指定的默认值。
  namespace Parameters
  {
    // @sect4{Parameters::Solver}
    //
    // 这些类中的第一个处理线性内部求解器的参数。它提供指示使用哪种求解器（GMRES 作为一般非对称不定系统的求解器，或稀疏直接求解器）、生成的输出量以及调整我们用作 GMRES 预条件器的阈值不完全 LU 分解（ILUT）的各种参数的参数。
    //
    // 特别地，ILUT 接受以下参数：
    // - ilut_fill：在形成 ILU 分解时要添加的额外条目数
    // - ilut_atol，ilut_rtol：在形成预条件器时，对于某些问题，糟糕的条件（或只是运气不好）可能导致预条件器条件非常差。因此，向原始矩阵添加对角扰动并为这个稍微更好的矩阵形成预条件器可能会有所帮助。ATOL 是在形成预条件器之前添加到对角线的绝对扰动，RTOL 是一个缩放因子 $rtol \geq 1$。
    // - ilut_drop：ILUT 将删除任何幅值小于此值的值。这是管理此预条件器使用的内存量的一种方式。
    //
    // 每个参数的含义也在 <code>declare_parameters()</code> 函数中 ParameterHandler::declare_entry 调用的第三个参数中进行了简要描述。
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



    // @sect4{Parameters::Refinement}
    //
    // 类似地，这里有一些参数决定如何细化网格（以及是否要进行细化）。有关冲击参数具体作用的内容，请参见下文的网格细化函数。
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



    // @sect4{Parameters::Flux}
    //
    // 接下来是关于通量修改以提高稳定性的部分。特别地，提供了两种选项来稳定 Lax-Friedrichs 通量：要么选择 $\mathbf{H}(\mathbf{a},\mathbf{b},\mathbf{n}) = \frac{1}{2}(\mathbf{F}(\mathbf{a})\cdot \mathbf{n} +
    // \mathbf{F}(\mathbf{b})\cdot \mathbf{n} + \alpha (\mathbf{a} -
    // \mathbf{b}))$，其中 $\alpha$ 是在输入文件中指定的固定数，或者 $\alpha$ 是一个依赖于网格的值。在后一种情况下，它被选择为 $\frac{h}{2\delta T}$，其中 $h$ 是应用通量的面的直径，$\delta T$ 是当前时间步长。
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



    // @sect4{Parameters::Output}
    //
    // 然后是关于输出参数的部分。我们提供生成施莱伦图（密度的平方梯度，用于可视化冲击波前）的选项，以及在不希望每个时间步都生成输出文件的情况下，生成图形输出的时间间隔。
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


// @sect4{Parameters::AllParameters}
//
// 最后将所有内容整合在一起的类。它自己声明了许多参数，大多数是参数文件顶层的参数，以及几个不够大而不值得单独类的部分。它还包含所有实际依赖空间维度的内容，例如初始条件或边界条件。
//
// 由于这个类是从上面所有类派生而来，所以<code>declare_parameters()</code>和<code>parse_parameters()</code>函数也调用了基类的相应函数。
//
// 注意，这个类还处理输入文件中指定的初始条件和边界条件的声明。为此，在这两种情况下，都有类似“w_0 value”的条目，表示一个以$x,y,z$为变量的表达式，描述初始条件或边界条件作为一个将由FunctionParser类解析的公式。类似的表达式存在于“w_1”、“w_2”等，用于表示Euler系统的<code>dim+2</code>个守恒变量。类似地，我们允许在输入文件中使用最多<code>max_n_boundaries</code>个边界指示符，每个边界指示符可以与流入、流出或压力边界条件相关联，并且对于每个组件和每个边界指示符，分别指定齐次边界条件。
//
// 用于存储边界指示符的数据结构有点复杂。它是一个包含<code>max_n_boundaries</code>个元素的数组，指示将被接受的边界指示符范围。对于这个数组中的每个条目，我们在<code>BoundaryCondition</code>结构中存储一对数据：首先，一个大小为<code>n_components</code>的数组，对于解向量的每个组件，指示它是流入、流出还是其他类型的边界；其次，一个FunctionParser对象，一次性描述这个边界ID的解向量的所有组件。
//
// <code>BoundaryCondition</code>结构需要一个构造函数，因为我们需要在构造时告诉函数解析器对象它要描述多少个向量组件。因此，这个初始化不能等待我们在<code>AllParameters::parse_parameters()</code>中实际设置FunctionParser对象表示的公式。
//
// 出于同样的原因，我们必须在构造函数中告诉Function对象它们的向量大小，我们必须有一个<code>AllParameters</code>类的构造函数，至少初始化另一个FunctionParser对象，即描述初始条件的那个对象。
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



// @sect3{Conservation law class}
//
// 这里终于是一个实际使用我们上面定义的所有Euler方程和参数特性的类。公共接口与往常几乎相同（构造函数现在接受一个从中读取参数的文件名，该文件名在命令行中传递）。私有函数接口也与通常的安排相似，<code>assemble_system</code>函数被分成三部分：一个包含所有单元的主循环，然后分别调用另外两个函数来处理单元和面的积分。
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



  // 前几个成员变量也相当标准。注意，我们定义了一个映射对象，在整个程序中用于组装项（我们将它传递给每个FEValues和FEFaceValues对象）；我们使用的映射只是标准的$Q_1$映射——换句话说，没有什么特别的——但在这里声明一个并在整个程序中使用它，将使以后更容易在需要时更改它。事实上，这一点相当相关：已知对于Euler方程的跨声速模拟，如果边界近似的阶数不够高，计算即使在$h\rightarrow 0$时也不会收敛。
  Triangulation<dim>   triangulation;
  const MappingQ1<dim> mapping;

  const FESystem<dim> fe;
  DoFHandler<dim>     dof_handler;

  const QGauss<dim>     quadrature;
  const QGauss<dim - 1> face_quadrature;

  // 接下来是一系列数据向量，分别对应于前一个时间步的解（<code>old_solution</code>）、当前解的最佳猜测（<code>current_solution</code>；我们称之为<em>guess</em>，因为用于计算它的牛顿迭代可能尚未收敛，而<code>old_solution</code>指的是前一个时间步的完全收敛的最终结果），以及通过将当前和前一个解外推一个时间步到未来来计算的下一个时间步的解的预测值：
  Vector<double> old_solution;
  Vector<double> current_solution;
  Vector<double> predictor;

  Vector<double> right_hand_side;

  // 这一组最终的成员变量（除了位于最底部的持有所有运行时参数的对象和仅在请求详细输出时才打印内容的屏幕输出流）处理我们在这个程序中与Trilinos库的接口，该库为我们提供了线性求解器。类似于在step-17和step-18中包含PETSc矩阵，所有我们需要做的就是创建一个Trilinos稀疏矩阵，而不是标准的deal.II类。系统矩阵用于每个牛顿步骤中的雅可比矩阵。由于我们不打算在并行环境中运行这个程序（尽管使用Trilinos数据结构并不太难），因此我们不必考虑像分配自由度之类的其他事情。
  TrilinosWrappers::SparseMatrix system_matrix;

  Parameters::AllParameters<dim> parameters;
  ConditionalOStream             verbose_cout;
};


// @sect4{ConservationLaw::ConservationLaw}
//
// 关于构造函数没什么多说的。基本上，它读取输入文件并用解析的值填充参数对象：
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



// @sect4{ConservationLaw::setup_system}
//
// 以下（简单的）函数在每次网格更改时被调用。它所做的就是根据我们在所有以前的教程程序中生成的稀疏模式调整Trilinos矩阵的大小。
template <int dim>
void ConservationLaw<dim>::setup_system()
{
  DynamicSparsityPattern dsp(dof_handler.n_dofs(), dof_handler.n_dofs());
  DoFTools::make_sparsity_pattern(dof_handler, dsp);

  system_matrix.reinit(dsp);
}


// @sect4{ConservationLaw::assemble_system}
//
// 这个函数和接下来的两个函数是这个程序的核心：它们组装了应用牛顿法到非线性守恒方程系统后产生的线性系统。
//
// 这个第一个函数将所有的组装部分整合在一个例程中，该例程为每个单元/面分派正确的部分。实际的组装实现是在接下来的函数中完成的。
//
// 在函数顶部，我们进行通常的整理工作：分配FEValues、FEFaceValues和FESubfaceValues对象，这些对象对于在单元、面和子面（在不同细化级别的相邻单元的情况下）上的积分是必要的。注意，我们不需要所有信息（例如值、梯度或求积点的实际位置）用于所有这些对象，因此我们只通过指定最小的一组UpdateFlags来让FEValues类获取实际需要的内容。例如，当使用FEFaceValues对象用于相邻单元时，我们只需要形状值：给定一个特定的面，求积点和<code>JxW</code>值与当前单元相同，并且法向量已知为当前单元法向量的负值。
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

  // 然后循环遍历所有单元，初始化当前单元的FEValues对象，并调用组装该单元问题的函数。
  for (const auto &cell : dof_handler.active_cell_iterators())
    {
      fe_v.reinit(cell);
      cell->get_dof_indices(dof_indices);

      assemble_cell_term(fe_v, dof_indices);

      // 然后循环遍历这个单元的所有面。如果一个面是外部边界的一部分，那么就在那里组装边界条件（<code>assemble_face_terms</code>的第五个参数指示我们是否在处理外部或内部面；如果是外部面，表示邻居的自由度索引的第四个参数将被忽略，因此我们传递一个空向量）：
      for (const auto face_no : cell->face_indices())
        if (cell->at_boundary(face_no))
          {
            fe_v_face.reinit(cell, face_no);
            assemble_face_term(face_no,
                               fe_v_face,
                               fe_v_face,
                               dof_indices,
                               std::vector<types::global_dof_index>(),
                               true,
                               cell->face(face_no)->boundary_id(),
                               cell->face(face_no)->diameter());
          }

        // 另一种情况是我们正在处理一个内部面。有两种情况需要区分：这是一个在相同细化级别的两个单元之间的正常面，还是在不同细化级别的两个单元之间的面。
        //
        // 在第一种情况下，我们不需要做任何事情：我们使用的是连续有限元，并且在这种情况下双线性形式中不会出现面项。如果我们强制执行悬挂节点约束（如迄今为止在所有以前的教程程序中使用连续有限元时所做的那样），第二种情况通常也不会导致面项的出现（这种约束是由AffineConstraints类与DoFTools::make_hanging_node_constraints一起完成的）。然而，在当前程序中，我们选择在不同细化级别的单元之间的面上弱地强制连续性，原因有两个：（i）因为我们可以这样做，且更重要的是（ii）因为我们必须通过AffineConstraints类的操作将用于从残差计算牛顿矩阵元素的自动微分穿线。这是可能的，但并不简单，因此我们选择这种替代方法。
        //
        // 需要决定的是，我们处于不同细化级别的两个单元之间接口的哪一侧。
        //
        // 让我们先考虑邻居更细化的情况。然后我们必须循环遍历当前单元面的子单元并在每个子单元上进行积分。我们在代码中加入了一些断言，以确保我们试图确定哪个邻居子单元的面与当前单元面的给定子面重合的推理是正确的——一点防御性编程总是有益的。
        //
        // 然后我们调用在面上积分的函数；由于这是一个内部面，第五个参数是false，第六个参数被忽略，因此我们再次传递一个无效值：
        else
          {
            if (cell->neighbor(face_no)->has_children())
              {
                const unsigned int neighbor2 =
                  cell->neighbor_of_neighbor(face_no);

                for (unsigned int subface_no = 0;
                     subface_no < cell->face(face_no)->n_children();
                     ++subface_no)
                  {
                    const typename DoFHandler<dim>::active_cell_iterator
                      neighbor_child =
                        cell->neighbor_child_on_subface(face_no, subface_no);

                    Assert(neighbor_child->face(neighbor2) ==
                             cell->face(face_no)->child(subface_no),
                           ExcInternalError());
                    Assert(neighbor_child->is_active(), ExcInternalError());

                    fe_v_subface.reinit(cell, face_no, subface_no);
                    fe_v_face_neighbor.reinit(neighbor_child, neighbor2);

                    neighbor_child->get_dof_indices(dof_indices_neighbor);

                    assemble_face_term(
                      face_no,
                      fe_v_subface,
                      fe_v_face_neighbor,
                      dof_indices,
                      dof_indices_neighbor,
                      false,
                      numbers::invalid_unsigned_int,
                      neighbor_child->face(neighbor2)->diameter());
                  }
              }

            // 另一种情况是如果邻居比当前单元更粗糙（特别是因为通常每个面只有一个悬挂节点的限制，邻居必须比当前单元精确粗化一级，这一点我们通过断言进行了检查）。同样，我们随后在这个接口上进行积分：
            else if (cell->neighbor(face_no)->level() != cell->level())
              {
                const typename DoFHandler<dim>::cell_iterator neighbor =
                  cell->neighbor(face_no);
                Assert(neighbor->level() == cell->level() - 1,
                       ExcInternalError());

                neighbor->get_dof_indices(dof_indices_neighbor);

                const std::pair<unsigned int, unsigned int> faceno_subfaceno =
                  cell->neighbor_of_coarser_neighbor(face_no);
                const unsigned int neighbor_face_no = faceno_subfaceno.first,
                                   neighbor_subface_no =
                                     faceno_subfaceno.second;

                Assert(neighbor->neighbor_child_on_subface(
                         neighbor_face_no, neighbor_subface_no) == cell,
                       ExcInternalError());

                fe_v_face.reinit(cell, face_no);
                fe_v_subface_neighbor.reinit(neighbor,
                                             neighbor_face_no,
                                             neighbor_subface_no);

                assemble_face_term(face_no,
                                   fe_v_face,
                                   fe_v_subface_neighbor,
                                   dof_indices,
                                   dof_indices_neighbor,
                                   false,
                                   numbers::invalid_unsigned_int,
                                   cell->face(face_no)->diameter());
              }
          }
    }
}


// @sect4{ConservationLaw::assemble_cell_term}
//
// 这个函数通过计算残差的单元部分，将其负值添加到右端向量中，并将其相对于局部变量的导数添加到雅可比矩阵（即牛顿矩阵）中，从而组装单元项。回想一下，残差的单元贡献表示为
// $R_i = \left(\frac{\mathbf{w}^{k}_{n+1} - \mathbf{w}_n}{\delta t} ,
// \mathbf{z}_i \right)_K $ $ +
// \theta \mathbf{B}(\mathbf{w}^{k}_{n+1})(\mathbf{z}_i)_K $ $ +
// (1-\theta) \mathbf{B}(\mathbf{w}_{n}) (\mathbf{z}_i)_K $
// 其中
// $\mathbf{B}(\mathbf{w})(\mathbf{z}_i)_K =
// - \left(\mathbf{F}(\mathbf{w}),\nabla\mathbf{z}_i\right)_K $ $
// + h^{\eta}(\nabla \mathbf{w} , \nabla \mathbf{z}_i)_K $ $
// - (\mathbf{G}(\mathbf {w}), \mathbf{z}_i)_K $
// 对于 $\mathbf{w} = \mathbf{w}^k_{n+1}$ 和 $\mathbf{w} = \mathbf{w}_{n}$ 都成立，
// $\mathbf{z}_i$ 是第 $i$ 个向量值测试函数。
// 另外，标量积
// $\left(\mathbf{F}(\mathbf{w}), \nabla\mathbf{z}_i\right)_K$ 被理解为
// $\int_K \sum_{c=1}^{\text{n_components}} \sum_{d=1}^{\text{dim}} \mathbf{F}(\mathbf{w})_{cd}
// \frac{\partial z^c_i}{\partial x_d}$
// 其中 $z^c_i$ 是第 $i$ 个测试函数的第 $c$ 个组件。
//
// 在这个函数的顶部，我们进行通常的整理工作，分配一些稍后需要的局部变量。特别是，我们将分配一些变量，这些变量将保存当前解 $W_{n+1}^k$ 在第 $k$ 次牛顿迭代后的值（变量<code>W</code>）和前一个时间步的解 $W_{n}$（变量<code>W_old</code>）。
//
// 除了这些，我们还需要当前变量的梯度。有点遗憾我们必须计算这些；我们几乎不需要。简单守恒定律的好处是通量通常不涉及任何梯度。然而，我们确实需要这些用于扩散稳定化。
//
// 我们实际存储这些变量的格式需要一些解释。首先，我们需要在每个求积点为解向量的每个<code>EulerEquations::n_components</code>组件获取值。这形成了一个二维表，我们使用deal.II的Table类（这比使用<code>std::vector@<std::vector@<T@> @></code>更高效，因为它只需要一次分配内存，而不是为外部向量的每个元素分配一次）。类似地，梯度是一个三维表，Table类也支持这种结构。
//
// 其次，我们希望使用自动微分。为此，我们对所有从我们希望计算导数的变量计算出的内容使用Sacado::Fad::DFad模板。这包括当前解和求积点处的梯度（它们是自由度的线性组合）以及从它们计算出的所有内容，如残差，但不包括前一个时间步的解。这些变量都在函数的第一部分中找到，以及一个我们将用来存储残差单个组件导数的变量：
template <int dim>
void ConservationLaw<dim>::assemble_cell_term(
  const FEValues<dim>                        &fe_v,
  const std::vector<types::global_dof_index> &dof_indices)
{
  const unsigned int dofs_per_cell = fe_v.dofs_per_cell;
  const unsigned int n_q_points    = fe_v.n_quadrature_points;

  Table<2, Sacado::Fad::DFad<double>> W(n_q_points,
                                        EulerEquations<dim>::n_components);

  Table<2, double> W_old(n_q_points, EulerEquations<dim>::n_components);

  Table<3, Sacado::Fad::DFad<double>> grad_W(
    n_q_points, EulerEquations<dim>::n_components, dim);

  Table<3, double> grad_W_old(n_q_points,
                              EulerEquations<dim>::n_components,
                              dim);

  std::vector<double> residual_derivatives(dofs_per_cell);

  // 接下来，我们必须定义在求解牛顿步长时将尝试确定的独立变量。这些独立变量是我们在这里提取的局部自由度的值：
  std::vector<Sacado::Fad::DFad<double>> independent_local_dof_values(
    dofs_per_cell);
  for (unsigned int i = 0; i < dofs_per_cell; ++i)
    independent_local_dof_values[i] = current_solution(dof_indices[i]);

  // 下一步融合了所有的魔力：我们将自动微分变量的一个子集声明为独立的自由度，而所有其他变量仍然是依赖函数。它们正是刚刚提取的局部自由度。所有引用它们的计算（无论是直接还是间接的）都将累积对这些变量的敏感性。
  //
  // 为了标记这些变量为独立变量，以下代码起到了作用，将<code>independent_local_dof_values[i]</code>标记为总共<code>dofs_per_cell</code>个独立变量中的第$i$个：
  for (unsigned int i = 0; i < dofs_per_cell; ++i)
    independent_local_dof_values[i].diff(i, dofs_per_cell);

  // 在所有这些声明之后，让我们实际计算一些东西。首先，<code>W</code>、<code>W_old</code>、<code>grad_W</code>和<code>grad_W_old</code>的值，我们可以通过使用公式$W(x_q)=\sum_i \mathbf W_i \Phi_i(x_q)$从局部自由度值计算出来，
  // 其中$\mathbf W_i$是（局部部分的）解向量的第$i$个条目，$\Phi_i(x_q)$是在求积点$x_q$处评估的第$i$个向量值形状函数的值。梯度可以以类似的方式计算。
  //
  // 理想情况下，我们可以使用类似FEValues::get_function_values和FEValues::get_function_gradients的调用来计算这些信息，但由于（i）我们必须为此扩展FEValues类，且（ii）我们不希望将整个<code>old_solution</code>向量设为fad类型，只希望将局部单元变量设为fad类型，因此我们显式地编写了上面的循环。在此之前，我们添加了另一个循环，将所有fad变量初始化为零：
  for (unsigned int q = 0; q < n_q_points; ++q)
    for (unsigned int c = 0; c < EulerEquations<dim>::n_components; ++c)
      {
        W[q][c]     = 0;
        W_old[q][c] = 0;
        for (unsigned int d = 0; d < dim; ++d)
          {
            grad_W[q][c][d]     = 0;
            grad_W_old[q][c][d] = 0;
          }
      }

  for (unsigned int q = 0; q < n_q_points; ++q)
    for (unsigned int i = 0; i < dofs_per_cell; ++i)
      {
        const unsigned int c =
          fe_v.get_fe().system_to_component_index(i).first;

        W[q][c] += independent_local_dof_values[i] *
                   fe_v.shape_value_component(i, q, c);
        W_old[q][c] +=
          old_solution(dof_indices[i]) * fe_v.shape_value_component(i, q, c);

        for (unsigned int d = 0; d < dim; ++d)
          {
            grad_W[q][c][d] += independent_local_dof_values[i] *
                               fe_v.shape_grad_component(i, q, c)[d];
            grad_W_old[q][c][d] += old_solution(dof_indices[i]) *
                                   fe_v.shape_grad_component(i, q, c)[d];
          }
      }


  // 接下来，为了计算单元贡献，我们需要在所有求积点处评估$\mathbf{F}({\mathbf w}^k_{n+1})$、$\mathbf{G}({\mathbf w}^k_{n+1})$以及$\mathbf{F}({\mathbf w}_n)$、$\mathbf{G}({\mathbf w}_n)$。为了存储这些，我们还需要分配一些内存。注意，我们以自动微分变量的形式计算通量矩阵和右端向量，这样以后可以很容易地从中计算雅可比矩阵的贡献：
  
  std::vector<ndarray<Sacado::Fad::DFad<double>,
                      EulerEquations<dim>::n_components,
                      dim>>
    flux(n_q_points);

  std::vector<ndarray<double, EulerEquations<dim>::n_components, dim>>
    flux_old(n_q_points);

  std::vector<
    std::array<Sacado::Fad::DFad<double>, EulerEquations<dim>::n_components>>
    forcing(n_q_points);

  std::vector<std::array<double, EulerEquations<dim>::n_components>>
    forcing_old(n_q_points);

  for (unsigned int q = 0; q < n_q_points; ++q)
    {
      EulerEquations<dim>::compute_flux_matrix(W_old[q], flux_old[q]);
      EulerEquations<dim>::compute_forcing_vector(W_old[q], forcing_old[q]);
      EulerEquations<dim>::compute_flux_matrix(W[q], flux[q]);
      EulerEquations<dim>::compute_forcing_vector(W[q], forcing[q]);
    }


  // 我们现在已经准备好了所有的组件，因此开始进行组装。我们有一个针对系统组件的外层循环，以及一个针对求积点的内层循环，在那里我们累积对第$i$个残差$R_i$的贡献。这个残差的一般公式在介绍和这个函数的顶部给出。然而，我们可以稍微简化它，考虑到第$i$个（向量值的）测试函数$\mathbf{z}_i$实际上只有一个非零分量（更多关于这个主题的内容可以在@ref vector_valued模块中找到）。它将由下面的<code>component_i</code>变量表示。有了这个，残差项可以重写为
  // @f{eqnarray*}{
  // R_i &=&
  // \left(\frac{(\mathbf{w}_{n+1} -
  // \mathbf{w}_n)_{\text{component_i}}}{\delta
  // t},(\mathbf{z}_i)_{\text{component_i}}\right)_K
  // \\ &-& \sum_{d=1}^{\text{dim}} \left(  \theta \mathbf{F}
  // ({\mathbf{w}^k_{n+1}})_{\text{component_i},d} + (1-\theta)
  // \mathbf{F} ({\mathbf{w}_{n}})_{\text{component_i},d}  ,
  // \frac{\partial(\mathbf{z}_i)_{\text{component_i}}} {\partial
  // x_d}\right)_K
  // \\ &+& \sum_{d=1}^{\text{dim}} h^{\eta} \left( \theta \frac{\partial
  // (\mathbf{w}^k_{n+1})_{\text{component_i}}}{\partial x_d} + (1-\theta)
  // \frac{\partial (\mathbf{w}_n)_{\text{component_i}}}{\partial x_d} ,
  // \frac{\partial (\mathbf{z}_i)_{\text{component_i}}}{\partial x_d}
  // \right)_K
  // \\ &-& \left( \theta\mathbf{G}({\mathbf{w}^k_n+1} )_{\text{component_i}}
  // + (1-\theta)\mathbf{G}({\mathbf{w}_n})_{\text{component_i}} ,
  // (\mathbf{z}_i)_{\text{component_i}} \right)_K ,
  // @f}
  // 其中积分被理解为通过对求积点求和来计算。
  //
  // 我们最初以正的方式累积所有残差的贡献，这样我们就不需要对雅可比矩阵的条目取负值。然后，当我们将其累加到<code>right_hand_side</code>向量时，我们取这个残差的负值。
  for (unsigned int i = 0; i < fe_v.dofs_per_cell; ++i)
    {
      Sacado::Fad::DFad<double> R_i = 0;

      const unsigned int component_i =
        fe_v.get_fe().system_to_component_index(i).first;

      // 每一行（i）的残差将累积到这个fad变量中。在为这一行完成组装后，我们将查询对这个变量的敏感性，并将它们添加到雅可比矩阵中。

      for (unsigned int point = 0; point < fe_v.n_quadrature_points; ++point)
        {
          if (parameters.is_stationary == false)
            R_i += 1.0 / parameters.time_step *
                   (W[point][component_i] - W_old[point][component_i]) *
                   fe_v.shape_value_component(i, point, component_i) *
                   fe_v.JxW(point);

          for (unsigned int d = 0; d < dim; ++d)
            R_i -=
              (parameters.theta * flux[point][component_i][d] +
               (1.0 - parameters.theta) * flux_old[point][component_i][d]) *
              fe_v.shape_grad_component(i, point, component_i)[d] *
              fe_v.JxW(point);

          for (unsigned int d = 0; d < dim; ++d)
            R_i +=
              1.0 *
              std::pow(fe_v.get_cell()->diameter(),
                       parameters.diffusion_power) *
              (parameters.theta * grad_W[point][component_i][d] +
               (1.0 - parameters.theta) * grad_W_old[point][component_i][d]) *
              fe_v.shape_grad_component(i, point, component_i)[d] *
              fe_v.JxW(point);

          R_i -=
            (parameters.theta * forcing[point][component_i] +
             (1.0 - parameters.theta) * forcing_old[point][component_i]) *
            fe_v.shape_value_component(i, point, component_i) *
            fe_v.JxW(point);
        }

      // 在循环结束时，我们必须将敏感性添加到矩阵中，并将残差从右端向量中减去。Trilinos的FAD数据类型通过<code>R_i.fastAccessDx(k)</code>使我们能够访问导数，因此我们将数据存储在一个临时数组中。然后，这些关于局部自由度整行的信息被一次性添加到Trilinos矩阵中（它支持我们选择的数据类型）。
      for (unsigned int k = 0; k < dofs_per_cell; ++k)
        residual_derivatives[k] = R_i.fastAccessDx(k);
      system_matrix.add(dof_indices[i], dof_indices, residual_derivatives);
      right_hand_side(dof_indices[i]) -= R_i.val();
    }
}


// @sect4{ConservationLaw::assemble_face_term}
//
// 在这里，我们基本上做了与前一个函数相同的事情。在顶部，我们引入了独立变量。因为当前函数也用于处理两个单元之间的内部面，独立变量不仅包括当前单元的自由度，而且在内部面情况下还包括邻居单元的自由度。
template <int dim>
void ConservationLaw<dim>::assemble_face_term(
  const unsigned int                          face_no,
  const FEFaceValuesBase<dim>                &fe_v,
  const FEFaceValuesBase<dim>                &fe_v_neighbor,
  const std::vector<types::global_dof_index> &dof_indices,
  const std::vector<types::global_dof_index> &dof_indices_neighbor,
  const bool                                  external_face,
  const unsigned int                          boundary_id,
  const double                                face_diameter)
{
  const unsigned int n_q_points    = fe_v.n_quadrature_points;
  const unsigned int dofs_per_cell = fe_v.dofs_per_cell;

  std::vector<Sacado::Fad::DFad<double>> independent_local_dof_values(
    dofs_per_cell),
    independent_neighbor_dof_values(external_face == false ? dofs_per_cell :
                                                             0);

  const unsigned int n_independent_variables =
    (external_face == false ? 2 * dofs_per_cell : dofs_per_cell);

  for (unsigned int i = 0; i < dofs_per_cell; ++i)
    {
      independent_local_dof_values[i] = current_solution(dof_indices[i]);
      independent_local_dof_values[i].diff(i, n_independent_variables);
    }

  if (external_face == false)
    for (unsigned int i = 0; i < dofs_per_cell; ++i)
      {
        independent_neighbor_dof_values[i] =
          current_solution(dof_indices_neighbor[i]);
        independent_neighbor_dof_values[i].diff(i + dofs_per_cell,
                                                n_independent_variables);
      }


  // 接下来，我们需要定义这个面这边的守恒变量值${\mathbf W}$（$ {\mathbf W}^+$）
  // 和另一边的守恒变量值（${\mathbf W}^-$），对于${\mathbf W} =
  // {\mathbf W}^k_{n+1}$和${\mathbf W} = {\mathbf W}_n$都是如此。
  // “这边”的值可以与前一个函数完全相同地计算出来，但请注意
  // <code>fe_v</code>变量现在是FEFaceValues或FESubfaceValues类型：
  Table<2, Sacado::Fad::DFad<double>> Wplus(
    n_q_points, EulerEquations<dim>::n_components),
    Wminus(n_q_points, EulerEquations<dim>::n_components);
  Table<2, double> Wplus_old(n_q_points, EulerEquations<dim>::n_components),
    Wminus_old(n_q_points, EulerEquations<dim>::n_components);

  for (unsigned int q = 0; q < n_q_points; ++q)
    for (unsigned int i = 0; i < dofs_per_cell; ++i)
      {
        const unsigned int component_i =
          fe_v.get_fe().system_to_component_index(i).first;
        Wplus[q][component_i] +=
          independent_local_dof_values[i] *
          fe_v.shape_value_component(i, q, component_i);
        Wplus_old[q][component_i] +=
          old_solution(dof_indices[i]) *
          fe_v.shape_value_component(i, q, component_i);
      }

  // 计算“另一边”有点复杂。如果这是一个内部面，我们可以像上面一样通过简单地使用来自邻居的独立变量来计算：
  if (external_face == false)
    {
      for (unsigned int q = 0; q < n_q_points; ++q)
        for (unsigned int i = 0; i < dofs_per_cell; ++i)
          {
            const unsigned int component_i =
              fe_v_neighbor.get_fe().system_to_component_index(i).first;
            Wminus[q][component_i] +=
              independent_neighbor_dof_values[i] *
              fe_v_neighbor.shape_value_component(i, q, component_i);
            Wminus_old[q][component_i] +=
              old_solution(dof_indices_neighbor[i]) *
              fe_v_neighbor.shape_value_component(i, q, component_i);
          }
    }
  // 另一方面，如果这是一个外部边界面，那么$\mathbf{W}^-$的值将是$\mathbf{W}^+$的函数，或者它们将被规定，具体取决于这里施加的边界条件的类型。
  //
  // 要开始评估，让我们确保为这个边界指定的边界ID是我们在
  // 参数对象中实际上有数据的ID。接下来，我们评估不齐次性的函数对象。这有点棘手：给定的边界可能既有规定的值，也有隐式值。如果某个特定组件没有被规定，值将评估为零，并在下面被忽略。
  //
  // 剩下的工作由一个实际上了解Euler方程边界条件具体细节的函数完成。请注意，由于我们在这里使用的是fad变量，敏感性将被适当地更新，这是一个否则会非常复杂的过程。
  else
    {
      Assert(boundary_id < Parameters::AllParameters<dim>::max_n_boundaries,
             ExcIndexRange(boundary_id,
                           0,
                           Parameters::AllParameters<dim>::max_n_boundaries));

      std::vector<Vector<double>> boundary_values(
        n_q_points, Vector<double>(EulerEquations<dim>::n_components));
      parameters.boundary_conditions[boundary_id].values.vector_value_list(
        fe_v.get_quadrature_points(), boundary_values);

      for (unsigned int q = 0; q < n_q_points; ++q)
        {
          EulerEquations<dim>::compute_Wminus(
            parameters.boundary_conditions[boundary_id].kind,
            fe_v.normal_vector(q),
            Wplus[q],
            boundary_values[q],
            Wminus[q]);
          // 这里我们假设边界类型、边界法向量和边界数据值在时间推进过程中保持不变。
          EulerEquations<dim>::compute_Wminus(
            parameters.boundary_conditions[boundary_id].kind,
            fe_v.normal_vector(q),
            Wplus_old[q],
            boundary_values[q],
            Wminus_old[q]);
        }
    }


  // 现在我们已经有了$\mathbf w^+$和$\mathbf w^-$，我们可以开始为每个求积点计算数值通量函数$\mathbf H(\mathbf w^+,\mathbf w^-, \mathbf n)$。在调用执行此操作的函数之前，我们还需要确定Lax-Friedrich的稳定性参数：
  
  std::vector<
    std::array<Sacado::Fad::DFad<double>, EulerEquations<dim>::n_components>>
    normal_fluxes(n_q_points);
  std::vector<std::array<double, EulerEquations<dim>::n_components>>
    normal_fluxes_old(n_q_points);

  double alpha;

  switch (parameters.stabilization_kind)
    {
      case Parameters::Flux::constant:
        alpha = parameters.stabilization_value;
        break;
      case Parameters::Flux::mesh_dependent:
        alpha = face_diameter / (2.0 * parameters.time_step);
        break;
      default:
        DEAL_II_NOT_IMPLEMENTED();
        alpha = 1;
    }

  for (unsigned int q = 0; q < n_q_points; ++q)
    {
      EulerEquations<dim>::numerical_normal_flux(
        fe_v.normal_vector(q), Wplus[q], Wminus[q], alpha, normal_fluxes[q]);
      EulerEquations<dim>::numerical_normal_flux(fe_v.normal_vector(q),
                                                 Wplus_old[q],
                                                 Wminus_old[q],
                                                 alpha,
                                                 normal_fluxes_old[q]);
    }

  // 现在组装面项，以与前一个函数中单元贡献的方式完全相同。唯一的区别是，如果这是一个内部面，我们还必须考虑残差贡献对相邻单元自由度的敏感性：
  std::vector<double> residual_derivatives(dofs_per_cell);
  for (unsigned int i = 0; i < fe_v.dofs_per_cell; ++i)
    if (fe_v.get_fe().has_support_on_face(i, face_no) == true)
      {
        Sacado::Fad::DFad<double> R_i = 0;

        for (unsigned int point = 0; point < n_q_points; ++point)
          {
            const unsigned int component_i =
              fe_v.get_fe().system_to_component_index(i).first;

            R_i += (parameters.theta * normal_fluxes[point][component_i] +
                    (1.0 - parameters.theta) *
                      normal_fluxes_old[point][component_i]) *
                   fe_v.shape_value_component(i, point, component_i) *
                   fe_v.JxW(point);
          }

        for (unsigned int k = 0; k < dofs_per_cell; ++k)
          residual_derivatives[k] = R_i.fastAccessDx(k);
        system_matrix.add(dof_indices[i], dof_indices, residual_derivatives);

        if (external_face == false)
          {
            for (unsigned int k = 0; k < dofs_per_cell; ++k)
              residual_derivatives[k] = R_i.fastAccessDx(dofs_per_cell + k);
            system_matrix.add(dof_indices[i],
                              dof_indices_neighbor,
                              residual_derivatives);
          }

        right_hand_side(dof_indices[i]) -= R_i.val();
      }
}


// @sect4{ConservationLaw::solve}
//
// 在这里，我们实际上求解线性系统，使用Trilinos的Aztec或Amesos线性求解器中的任意一个。计算的结果将写入传递给此函数的参数向量。结果是迭代次数和最终线性残差的一个对。
template <int dim>
std::pair<unsigned int, double>
ConservationLaw<dim>::solve(Vector<double> &newton_update)
{
  switch (parameters.solver)
    {
      // 如果参数文件指定使用直接求解器，那么我们会进入这里。这个过程是直接的，因为deal.II在Trilinos中提供了Amesos直接求解器的包装类。我们所要做的就是创建一个求解器控制对象（这里只是一个虚拟对象，因为我们不会执行任何迭代），然后创建直接求解器对象。在实际求解时，请注意，我们不传递预条件器。这对于直接求解器来说也没有什么意义。最后，我们返回求解器控制的统计信息——这将表明没有执行迭代，并且最终线性残差为零，除非这里提供了更好的信息：
      case Parameters::Solver::direct:
        {
          SolverControl                                  solver_control(1, 0);
          TrilinosWrappers::SolverDirect::AdditionalData data(
            parameters.output == Parameters::Solver::verbose);
          TrilinosWrappers::SolverDirect direct(solver_control, data);

          direct.solve(system_matrix, newton_update, right_hand_side);

          return {solver_control.last_step(), solver_control.last_value()};
        }

      // 同样地，如果我们要使用迭代求解器，我们使用Aztec的GMRES求解器。我们也可以在这里使用Trilinos迭代求解器和预条件器的包装类，但我们选择直接使用Aztec求解器。对于给定的问题，Aztec的内部预条件器实现优于deal.II的包装类，因此我们在AztecOO求解器中使用ILU-T预条件，并设置一堆可以从参数文件中更改的选项。
      //
      // 还有两个实际问题：由于我们已经将右端向量和解向量构建为deal.II的Vector对象（而不是矩阵，它是Trilinos对象），我们必须向求解器提供Trilinos的Epetra向量。幸运的是，它们支持“视图”的概念，因此我们只需传递一个指向我们的deal.II向量的指针。我们必须为向量提供一个设置并行分布的Epetra_Map，这是一个在串行中只是一个虚拟对象。最简单的方法是询问矩阵的映射，因为我们将准备好进行矩阵向量乘法。
      //
      // 其次，Aztec求解器希望我们传递一个Trilinos的Epetra_CrsMatrix，而不是deal.II的包装类本身。因此，我们通过命令trilinos_matrix()访问Trilinos包装类中的实际Trilinos矩阵。Trilinos希望矩阵是非常量的，因此我们必须手动使用const_cast来去除常量性。
      case Parameters::Solver::gmres:
        {
          Epetra_Vector x(View,
                          system_matrix.trilinos_matrix().DomainMap(),
                          newton_update.begin());
          Epetra_Vector b(View,
                          system_matrix.trilinos_matrix().RangeMap(),
                          right_hand_side.begin());

          AztecOO solver;
          solver.SetAztecOption(
            AZ_output,
            (parameters.output == Parameters::Solver::quiet ? AZ_none :
                                                              AZ_all));
          solver.SetAztecOption(AZ_solver, AZ_gmres);
          solver.SetRHS(&b);
          solver.SetLHS(&x);

          solver.SetAztecOption(AZ_precond, AZ_dom_decomp);
          solver.SetAztecOption(AZ_subdomain_solve, AZ_ilut);
          solver.SetAztecOption(AZ_overlap, 0);
          solver.SetAztecOption(AZ_reorder, 0);

          solver.SetAztecParam(AZ_drop, parameters.ilut_drop);
          solver.SetAztecParam(AZ_ilut_fill, parameters.ilut_fill);
          solver.SetAztecParam(AZ_athresh, parameters.ilut_atol);
          solver.SetAztecParam(AZ_rthresh, parameters.ilut_rtol);

          solver.SetUserMatrix(
            const_cast<Epetra_CrsMatrix *>(&system_matrix.trilinos_matrix()));

          solver.Iterate(parameters.max_iterations,
                         parameters.linear_residual);

          return {solver.NumIters(), solver.TrueResidual()};
        }
    }

  DEAL_II_NOT_IMPLEMENTED();
  return {0, 0};
}


// @sect4{ConservationLaw::compute_refinement_indicators}
//
// 这个函数非常简单：我们不假装这里知道一个好的细化指标是什么。相反，我们假设<EulerEquation>类会知道这一点，因此我们只是将各自的函数委托给我们在那里实现的函数：
template <int dim>
void ConservationLaw<dim>::compute_refinement_indicators(
  Vector<double> &refinement_indicators) const
{
  EulerEquations<dim>::compute_refinement_indicators(dof_handler,
                                                     mapping,
                                                     predictor,
                                                     refinement_indicators);
}


// @sect4{ConservationLaw::refine_grid}
//
// 在这里，我们使用之前计算的细化指标来细化网格。开始时，我们遍历所有单元并标记那些我们认为应该被细化的单元：
template <int dim>
void
ConservationLaw<dim>::refine_grid(const Vector<double> &refinement_indicators)
{
  for (const auto &cell : dof_handler.active_cell_iterators())
    {
      const unsigned int cell_no = cell->active_cell_index();
      cell->clear_coarsen_flag();
      cell->clear_refine_flag();

      if ((cell->level() < parameters.shock_levels) &&
          (std::fabs(refinement_indicators(cell_no)) > parameters.shock_val))
        cell->set_refine_flag();
      else if ((cell->level() > 0) &&
               (std::fabs(refinement_indicators(cell_no)) <
                0.75 * parameters.shock_val))
        cell->set_coarsen_flag();
    }

  // 下一步解决了引言中的一个注释中提到的问题：我们想要稍后使用的SolutionTransfer类测试我们程序中解函数在悬挂节点处连续的假设。实际上，这在这个程序中并非如此，因为我们不明智地选择以弱方式强制执行悬挂节点约束，就像例如使用不连续元件时所做的那样。但是我们这里使用的元件是连续的（即FE_Q的多个副本），因此断言将失败并且程序将中止。为了避免这个问题（而不必重写整个程序），我们只需确保解确实满足悬挂节点约束，但创建一个包含悬挂节点约束的AffineConstraints对象，并将约束应用于我们希望SolutionTransfer类传输到下一个网格的两个解向量：
  {
    AffineConstraints<double> hanging_node_constraints;
    DoFTools::make_hanging_node_constraints(dof_handler,
                                            hanging_node_constraints);
    hanging_node_constraints.close();

    hanging_node_constraints.distribute(old_solution);
    hanging_node_constraints.distribute(predictor);
  }

  // 然后，我们需要在进行细化时将各种解向量从旧网格转移到新网格。SolutionTransfer类在这里是我们的朋友；它有相当详细的文档，包括示例，因此我们不会对以下代码进行太多注释。最后三行只是将一些其他向量的大小重置为现在正确的大小：
  const std::vector<Vector<double>> transfer_in = {old_solution, predictor};

  triangulation.prepare_coarsening_and_refinement();

  SolutionTransfer<dim> soltrans(dof_handler);
  soltrans.prepare_for_coarsening_and_refinement(transfer_in);

  triangulation.execute_coarsening_and_refinement();

  dof_handler.clear();
  dof_handler.distribute_dofs(fe);

  std::vector<Vector<double>> transfer_out = {
    Vector<double>(dof_handler.n_dofs()),
    Vector<double>(dof_handler.n_dofs())};
  soltrans.interpolate(transfer_in, transfer_out);

  old_solution = std::move(transfer_out[0]);
  predictor    = std::move(transfer_out[1]);

  current_solution.reinit(dof_handler.n_dofs());
  current_solution = old_solution;

  right_hand_side.reinit(dof_handler.n_dofs());
}


// @sect4{ConservationLaw::output_results}
//
// 这个函数现在相当直接。所有的魔力，包括将数据从守恒变量转换为物理变量，都已被抽象并移到了EulerEquations类中，以便在我们想要解决其他超弦守恒定律时可以替换它。
//
// 注意，输出文件的编号是通过保持一个计数器作为静态变量来确定的，该计数器在第一次调用此函数时设置为零，并在每次调用结束时递增。
template <int dim>
void ConservationLaw<dim>::output_results() const
{
  typename EulerEquations<dim>::Postprocessor postprocessor(
    parameters.schlieren_plot);

  DataOut<dim> data_out;
  data_out.attach_dof_handler(dof_handler);

  data_out.add_data_vector(current_solution,
                           EulerEquations<dim>::component_names(),
                           DataOut<dim>::type_dof_data,
                           EulerEquations<dim>::component_interpretation());

  data_out.add_data_vector(current_solution, postprocessor);

  data_out.build_patches();

  static unsigned int output_file_number = 0;
  std::string         filename =
    "solution-" + Utilities::int_to_string(output_file_number, 3) + ".vtk";
  std::ofstream output(filename);
  data_out.write_vtk(output);

  ++output_file_number;
}



// @sect4{ConservationLaw::run}
//
// 这个函数包含了这个程序的顶层逻辑：初始化、时间循环和内部牛顿迭代。
//
// 在开始时，我们读取参数文件中指定的网格文件，设置DoFHandler和各种向量，然后在这个网格上插值给定的初始条件。然后，我们根据初始条件执行多次网格细化，以获得一个已经很好地适应初始解的网格。在这个过程中结束时，我们输出初始解。
template <int dim>
void ConservationLaw<dim>::run()
{
  {
    GridIn<dim> grid_in;
    grid_in.attach_triangulation(triangulation);

    std::ifstream input_file(parameters.mesh_filename);
    Assert(input_file, ExcFileNotOpen(parameters.mesh_filename));

    grid_in.read_ucd(input_file);
  }

  dof_handler.distribute_dofs(fe);

  // 为所有字段分配大小。
  old_solution.reinit(dof_handler.n_dofs());
  current_solution.reinit(dof_handler.n_dofs());
  predictor.reinit(dof_handler.n_dofs());
  right_hand_side.reinit(dof_handler.n_dofs());

  setup_system();

  VectorTools::interpolate(dof_handler,
                           parameters.initial_conditions,
                           old_solution);
  current_solution = old_solution;
  predictor        = old_solution;

  if (parameters.do_refine == true)
    for (unsigned int i = 0; i < parameters.shock_levels; ++i)
      {
        Vector<double> refinement_indicators(triangulation.n_active_cells());

        compute_refinement_indicators(refinement_indicators);
        refine_grid(refinement_indicators);

        setup_system();

        VectorTools::interpolate(dof_handler,
                                 parameters.initial_conditions,
                                 old_solution);
        current_solution = old_solution;
        predictor        = old_solution;
      }

  output_results();

  // 然后进入主时间步循环。在顶部，我们简单地输出一些状态信息，以便跟踪计算进度，以及一个指示非线性内部迭代进度的表头：
  Vector<double> newton_update(dof_handler.n_dofs());

  double time        = 0;
  double next_output = time + parameters.output_step;

  predictor = old_solution;
  while (time < parameters.final_time)
    {
      std::cout << "T=" << time << std::endl
                << "   Number of active cells:       "
                << triangulation.n_active_cells() << std::endl
                << "   Number of degrees of freedom: " << dof_handler.n_dofs()
                << std::endl
                << std::endl;

      std::cout << "   NonLin Res     Lin Iter       Lin Res" << std::endl
                << "   _____________________________________" << std::endl;

      // 然后是用于在每个时间步中解决非线性问题的内部牛顿迭代。顶部的做法是重置矩阵和右端向量，然后组装线性系统。如果残差的范数足够小，那么我们声明牛顿迭代已经收敛。否则，我们求解线性系统，使用牛顿增量更新当前解，并输出收敛信息。最后，我们检查牛顿迭代次数是否超过了10的限制——如果是，很可能迭代正在发散，进一步的迭代将无济于事。如果发生这种情况，我们抛出一个异常，<code>main()</code>中将捕获它并显示状态信息，然后程序中止。
      //
      // 请注意，我们在下面使用的AssertThrow宏的写法在很大程度上等同于编写类似<code>if (!(nonlin_iter <= 10)) throw ExcMessage("No convergence in nonlinear solver");</code>的代码。唯一的显著区别是，AssertThrow还确保抛出的异常携带有关生成位置（文件名和行号）的信息。这在这里并不至关重要，因为只有一个地方可能发生这种异常；然而，当人们想要找出错误发生的位置时，它通常是一个非常有用的工具。
      unsigned int nonlin_iter = 0;
      current_solution         = predictor;
      while (true)
        {
          system_matrix = 0;

          right_hand_side = 0;
          assemble_system();

          const double res_norm = right_hand_side.l2_norm();
          if (std::fabs(res_norm) < 1e-10)
            {
              std::printf("   %-16.3e (converged)\n\n", res_norm);
              break;
            }
          else
            {
              newton_update = 0;

              std::pair<unsigned int, double> convergence =
                solve(newton_update);

              current_solution += newton_update;

              std::printf("   %-16.3e %04d        %-5.2e\n",
                          res_norm,
                          convergence.first,
                          convergence.second);
            }

          ++nonlin_iter;
          AssertThrow(nonlin_iter <= 10,
                      ExcMessage("No convergence in nonlinear solver"));
        }

      // 我们只有在牛顿迭代已经收敛的情况下才会到达这一点，因此在此执行各种收敛后任务：
      //
      // 首先，我们更新时间并根据需要生成图形输出。然后，我们通过近似$\mathbf w^{n+1}\approx \mathbf w^n +
      // \delta t \frac{\partial \mathbf w}{\partial t} \approx \mathbf w^n
      // + \delta t \; \frac{\mathbf w^n-\mathbf w^{n-1}}{\delta t} = 2
      // \mathbf w^n - \mathbf w^{n-1}$来更新下一个时间步的解的预测值，以尝试使适应性工作得更好。其思想是尝试在前沿之前进行细化，而不是步入一组粗糙的单元并将old_solution扩散开来。这个简单的时间外推器完成了工作。有了这个，我们然后根据用户的需要细化网格，并最终继续下一个时间步：
      time += parameters.time_step;

      if (parameters.output_step < 0)
        output_results();
      else if (time >= next_output)
        {
          output_results();
          next_output += parameters.output_step;
        }

      predictor = current_solution;
      predictor.sadd(2.0, -1.0, old_solution);

      old_solution = current_solution;

      if (parameters.do_refine == true)
        {
          Vector<double> refinement_indicators(
            triangulation.n_active_cells());
          compute_refinement_indicators(refinement_indicators);

          refine_grid(refinement_indicators);
          setup_system();

          newton_update.reinit(dof_handler.n_dofs());
        }
    }
}
} // namespace Step33

// @sect3{main()}

// 以下的“main”函数与以前的示例类似，无需特别注释。注意，如果在命令行中未给出输入文件名，程序将中止。
int main(int argc, char *argv[])
{
  try
    {
      using namespace dealii;
      using namespace Step33;

      if (argc != 2)
        {
          std::cout << "Usage:" << argv[0] << " input_file" << std::endl;
          std::exit(1);
        }

      Utilities::MPI::MPI_InitFinalize mpi_initialization(
        argc, argv, numbers::invalid_unsigned_int);

      ConservationLaw<2> cons(argv[1]);
      cons.run();
    }
  catch (std::exception &exc)
    {
      std::cerr << std::endl
                << std::endl
                << "----------------------------------------------------"
                << std::endl;
      std::cerr << "Exception on processing: " << std::endl
                << exc.what() << std::endl
                << "Aborting!" << std::endl
                << "----------------------------------------------------"
                << std::endl;
      return 1;
    }
  catch (...)
    {
      std::cerr << std::endl
                << std::endl
                << "----------------------------------------------------"
                << std::endl;
      std::cerr << "Unknown exception!" << std::endl
                << "Aborting!" << std::endl
                << "----------------------------------------------------"
                << std::endl;
      return 1;
    };

  return 0;
}

```

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzMTMyNzQxNjIsOTIyMDY0MTAzLDIwNj
A0MzE1MDIsNTM0NjE2ODIwLDUzNDYxNjgyMCwtNjIxMjM5ODQy
LC04MzY1ODExNzMsMTY3Njk4MzMyMiwtMTg4Mzk4NDM2OCw2Nj
E4ODU5ODQsNTIwMDQ1MjUsMTg2MTg5Mzg4NiwtMTM5OTQ2OTQy
NCwtMTE5Nzc3NzE5MiwxNTg2MjE1NzAwLDQ1OTQ0OTE5NSwxMT
AxMTkwODU3XX0=
-->