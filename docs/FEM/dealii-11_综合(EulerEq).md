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


```

<!--stackedit_data:
eyJoaXN0b3J5IjpbOTIyMDY0MTAzLDIwNjA0MzE1MDIsNTM0Nj
E2ODIwLDUzNDYxNjgyMCwtNjIxMjM5ODQyLC04MzY1ODExNzMs
MTY3Njk4MzMyMiwtMTg4Mzk4NDM2OCw2NjE4ODU5ODQsNTIwMD
Q1MjUsMTg2MTg5Mzg4NiwtMTM5OTQ2OTQyNCwtMTE5Nzc3NzE5
MiwxNTg2MjE1NzAwLDQ1OTQ0OTE5NSwxMTAxMTkwODU3XX0=
-->