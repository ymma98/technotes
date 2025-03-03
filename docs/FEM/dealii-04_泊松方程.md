# 泊松方程

## step-3


* 有限元方法的基本设置

我们将解决一个简单版本的泊松方程，其边界值为零，但右侧为非零：
$$
-\Delta u = f  \text{ in } \Omega,\\
u=0 \text{ on } \partial\Omega.
$$
我们将在正方形 $\Omega = [-1, 1]^2$ 上解决此方程。在这个程序中，我们还将仅考虑特定情况 $f(x) = 1$，并将在下一个教程程序中回到如何实现更一般的情况。

如果您已经学习了有限元方法的基础，您会记得我们需要采取的步骤，以通过**有限维逼近来近似解 $u$**。具体来说，我们首先需要推导上述方程的弱形式，方法是将方程从左侧乘以测试函数 $\varphi$ 并在区域 $\Omega$ 上积分：
$$
-\int_\Omega \varphi \Delta u = \int_\Omega \varphi f.
$$
这可以通过分部积分得到：
$$
\int_\Omega \nabla \varphi \cdot \nabla u - \int_{\partial\Omega} \varphi \vec{n} \cdot \nabla u = \int_\Omega \varphi f.
$$
测试函数 $\varphi$ 必须满足相同类型的边界条件（在数学术语中：它需要来自我们寻求解的集合的切空间），因此在边界上 $\varphi = 0$，因此我们要寻找的弱形式为
$$(\nabla \varphi, \nabla u) = (\varphi, f),$$
这里我们使用了**常用的符号 $(a, b) = \int_\Omega ab$**。该问题要求寻找一个函数 $u$，使得对于来自适当空间（这里是 $H^1$ 空间）的所有测试函数 $\varphi$，该语句都成立。

当然，在一般情况下我们无法在计算机上找到这样的函数，而是我们寻求一个逼近 $u_h(x) = \sum_j U_j \varphi_j(x)$，其中 $U_j$ 是我们需要确定的未知扩展系数（该问题的“自由度”），而 $\varphi_i(x)$ 是我们将使用的有限元形状函数。为了定义这些形状函数，我们需要以下内容：

1. 一个定义形状函数的网格。
2. 一个描述我们希望在参考单元（在 deal.II 中始终是单位区间 $[0,1]$、单位正方形 $[0,1]^2$ 或单位立方体 $[0,1]^3$，具体取决于您所工作空间的维度）上使用的形状函数的有限元。在步骤 2 中，我们已经使用了类型为 `FE_Q<2>` 的对象，它表示通过对支持点的插值定义形状函数的常规拉格朗日元素。最简单的是 `FE_Q<2>(1)`，它使用多项式度为 1。在 2D 中，这些通常被称为双线性，因为它们在参考单元的两个坐标上是线性的。（在 1D 中，它们是线性的，在 3D 中是三线性的；然而，在 deal.II 文档中，我们通常不会做这种区分，而是简单地将这些函数称为“线性”的。）
3. 一个 `DoFHandler` 对象，用于枚举网格上的所有自由度，以有限元对象提供的参考单元描述为基础。您在步骤 2 中也已经看到如何做到这一点。
4. 一个映射，告诉我们如何从参考单元上有限元类定义的形状函数获取实际单元上的形状函数。默认情况下，除非您明确说明，否则 deal.II 将使用（双、三）线性映射，因此在大多数情况下您不必担心这一步。

通过这些步骤，我们现在拥有一组函数 $\varphi_i$，我们可以定义离散问题的弱形式：寻找一个函数 $u_h$，即寻找上述提到的扩展系数 $U_j$，使得
$$
(\nabla \varphi_i, \nabla u_h) = (\varphi_i, f), \quad i = 0 \ldots N-1.
$$
请注意，我们在这里遵循的约定是所有计数从零开始，这在 C 和 C++ 中很常见。通过插入表示 $u_h(x) = \sum_j U_j \varphi_j(x)$，然后观察到
$$
(\nabla \varphi_i, \nabla u_h) = (\nabla \varphi_i, \nabla[\sum_j U_j \varphi_j]) = \sum_j (\nabla \varphi_i, \nabla[U_j \varphi_j]) = \sum_j (\nabla \varphi_i, \nabla \varphi_j) U_j.
$$
因此，该问题变为：寻找一个向量 $U$ 使得
$$
AU = F,
$$
其中矩阵 $A$ 和右侧 $F$ 定义为
$$
A_{ij} = (\nabla \varphi_i, \nabla \varphi_j), \quad F_i = (\varphi_i, f).
$$
* 我们应该从左侧还是右侧乘以测试函数？

在继续描述如何计算这些量之前，请注意，如果我们将原始方程从右侧乘以测试函数而不是从左侧乘以，那么我们将得到形如
$$
U^T A = F^T
$$
的线性系统。通过转置该系统，这当然等同于解决
$$
A^T U = F
$$
这在这里与上面相同，因为 $A = A^T$。但在一般情况下并非如此，**为了避免任何混淆，经验表明，养成从左侧乘以方程而不是从右侧乘以（如数学文献中常做的）可以避免一种常见的错误，因为矩阵在比较理论和实现时自动正确，而不需要转置**。请参见步骤 9 中本教程的第一个示例，其中我们有一个非对称双线性形式，此时从右侧乘以或从左侧乘以是有区别的。


* 组装矩阵和右侧向量

现在我们知道我们需要什么（即：用于存储矩阵和向量的对象，以及计算 $A_{ij},F_i$ 的方法），我们可以看看实现这一目标需要什么：

- 对于 $A$ 的对象是 SparseMatrix 类型，而 $U$ 和 $F$ 的对象是 Vector 类型。我们将在下面的程序中看到用于求解线性系统的类。
- 我们需要一种形成积分的方法。在有限元方法中，这通常是通过求积来完成的，即用一组每个单元上的求积点的加权和来替代积分。也就是说，我们首先将 $\Omega$ 上的积分拆分为对所有单元的积分，

$$ 
  \begin{align*}
    A_{ij} &= (\nabla\varphi_i, \nabla \varphi_j) 
    = \sum_{K \in {\mathbb T}} \int_K \nabla\varphi_i \cdot \nabla \varphi_j, \\
    F_i &= (\varphi_i, f) 
    = \sum_{K \in {\mathbb T}} \int_K \varphi_i f,
  \end{align*}
$$ 

  然后用求积来近似每个单元的贡献：
  
$$ 
  \begin{align*}
    A^K_{ij} &=
    \int_K \nabla\varphi_i \cdot \nabla \varphi_j 
    \approx 
    \sum_q \nabla\varphi_i(\mathbf x^K_q) \cdot \nabla 
    \varphi_j(\mathbf x^K_q) w_q^K, \\
    F^K_i &=
    \int_K \varphi_i f 
    \approx 
    \sum_q \varphi_i(\mathbf x^K_q) f(\mathbf x^K_q) w^K_q,
  \end{align*}
$$ 

  其中 $\mathbb{T} \approx \Omega$ 是一个近似于域的剖分，$\mathbf x^K_q$ 是单元 $K$ 上的第 $q$ 个求积点，$w^K_q$ 是第 $q$ 个求积权重。完成这一过程需要不同的部分，我们将依次讨论它们。
  
- 首先，我们需要一种描述求积点位置 $\mathbf x_q^K$ 和它们权重 $w^K_q$ 的方法。它们通常通过与形状函数相同的方式从参考单元映射而来，即隐式地使用 MappingQ1 类，或者如果你明确说明，则通过从 Mapping 派生的其他类。参考单元上的位置和权重由从 Quadrature 基类派生的对象描述。通常，我们选择一种求积公式（即一组点和权重），以使得求积与矩阵中的积分完全相等；这可以通过高斯求积公式实现，该公式在 QGauss 类中实现。
- 然后，我们需要一些东西来帮助我们在单元 $K$ 上评估 $\varphi_i(\mathbf x^K_q)$。这就是 FEValues 类的作用：它接收一个有限元对象来描述参考单元上的 $\varphi$，一个求积对象来描述求积点和权重，以及一个映射对象（或隐式使用 MappingQ1 类），并提供在单元 $K$ 上的求积点位置的形状函数值和导数，以及进行积分所需的各种其他信息。

计算矩阵和右侧向量的过程是对所有单元（然后对求积点的求和）的求和，通常称为组装线性系统，或简称为组装，其含义与 [装配线](https://en.wikipedia.org/wiki/Assembly_line) 相关，意味着“将一组片段或元素组装在一起的行为”。

FEValues 确实是组装过程中的核心类。我们**用在参考单元上定义的点（由 Quadrature 对象）映射到实际单元上的求积点来替代积分**。实质上，我们将问题简化为只需要有限的信息，即形状函数值和导数、求积权重、法向量等，这些信息仅在有限的一组点上。FEValues 类将这三个组件结合在一起，并提供特定单元 $K$ 上的这组有限信息。当我们组装下面的线性系统时，你将看到它的实际应用。

值得注意的是，如果你在应用程序中自己创建这三个对象并自行处理信息，这一切也是可以实现的。然而，这既不会更简单（FEValues 类正好提供了你实际需要的信息）也不会更快：FEValues 类经过高度优化，只计算每个单元所需的特定信息；如果从前一个单元可以重用任何信息，它将这样做，并且该类中有大量代码确保在有利的情况下缓存信息。

本介绍的最后一点是提到，在线性系统获得后，它是通过迭代求解器进行求解的，然后进行后处理：我们使用 DataOut 类创建一个输出文件，可以通过常见的可视化程序进行可视化。

* 求解线性系统



通常学习求解线性系统的第一种方法是 [高斯消元法](https://en.wikipedia.org/wiki/Gaussian_elimination)。这个方法的问题在于，它需要的操作数量与 $N^3$ 成正比，其中 $N$ 是线性系统中方程或未知数的数量——更具体地说，操作数量为 $\frac{2}{3} N^3$，大致如此。对于 $N=1089$，这意味着我们需要大约 $8.61$ 亿次操作。这个数字是相当可行的，现代处理器花费不到 0.1 秒就能完成。然而，显然这并不能扩展：如果线性系统中的方程数量增加到原来的二十倍（即未知数也增加到二十倍），那么所需时间将达到 1000 到 10000 秒，甚至接近一个小时。再让线性系统增加十倍，显然我们无法在单台计算机上解决它。

通过认识到矩阵中只有相对少数的条目是非零的——即矩阵是 [稀疏矩阵](https://en.wikipedia.org/wiki/Sparse_matrix)，可以在一定程度上挽救局面。高斯消元法的变种可以利用这一点，使过程大大加快；我们将在第 29 步首次使用实现于 SparseDirectUMFPACK 类中的一种方法，以及之后的几种其他方法。这些高斯消元法的变种可能让我们达到 100,000 或 200,000 的问题规模，但不会多于此。

相反，我们将在这里采用1952年的一个想法： [共轭梯度法](https://en.wikipedia.org/wiki/Conjugate_gradient_method)，简称 "CG"。CG 是一种“迭代”求解器，它形成一系列逐渐收敛到精确解的向量；事实上，在没有舍入误差的情况下，经过 $N$ 次迭代后，如果矩阵是对称的且正定的，它能找到精确解。该方法最初被开发为另一种精确求解线性系统的方法，如高斯消元法，但由于没有太多优势而在几十年里被遗忘。然而，当计算机变得足够强大，可以解决高斯消元法不再有效的问题规模（大约在1980年代），CG被重新发现，人们意识到它非常适合来自有限元方法的大型稀疏系统。这是因为(i) 它计算的向量收敛到精确解，因此，只要我们对合理的近似感到满意，就不需要执行所有 $N$ 次迭代来找到精确解；(ii) 它仅需要矩阵-向量乘积，这对于稀疏矩阵非常有用，因为根据定义，稀疏矩阵只有 ${\cal O}(N)$ 条目，因此矩阵-向量乘积可以以 ${\cal O}(N)$ 的工作量完成，而对密集矩阵执行相同操作需要 $N^2$ 次操作。因此，我们可以希望用至多 ${\cal O}(N^2)$ 的操作来求解线性系统，且在许多情况下，实际所需的操作更少。

因此，有限元代码几乎总是使用诸如 CG 的迭代求解器来求解线性系统，我们在此代码中也将这样做。（我们指出，CG 方法仅适用于对称正定矩阵；对于其他方程，矩阵可能不具备这些特性，我们将不得不使用其他迭代求解器变种，如 [BiCGStab](https://en.wikipedia.org/wiki/Biconjugate_gradient_stabilized_method) 或 [GMRES](https://en.wikipedia.org/wiki/Generalized_minimal_residual_method)，它们适用于更一般的矩阵。）

这些迭代求解器的一个重要组成部分是我们指定解决线性系统时希望达到的容忍度——本质上是我们愿意接受的近似解的误差声明。近似解 $\tilde x$ 与线性系统 $Ax=b$ 的精确解 $x$ 之间的误差定义为 $\|x-\tilde x\|$，但这是一个我们无法计算的量，因为我们不知道精确解 $x$。相反，我们通常考虑 *残差*，其定义为 $\|b-A\tilde x\|=\|A(x-\tilde x)\|$，作为可计算的度量。然后，我们让迭代求解器计算越来越准确的解 $\tilde x$，直到 $\|b-A\tilde x\|\le \tau$。一个实际的问题是 $\tau$ 应该取什么值。在大多数应用中，设置
$$
\tau = 10^{-6} \|b\|
$$
是一个合理的选择。我们将 $\tau$ 设置为与 $b$ 的大小（范数）成比例，确保我们对解的准确性的期望相对于解的大小是相对的。

所有这些将在本程序的 `Step3::solve()` 函数中实现。正如你所看到的，使用 deal.II 设置线性求解器相当简单：整个函数只有三行代码。


以下是您提供的英文内容翻译为中文的版本，已转换为Markdown格式：


* 关于实现

尽管这是您可以使用有限元方法求解的最简单的方程，但该程序展示了大多数有限元程序的基本结构，同时也作为后续几乎所有程序的模板。具体来说，该程序的主类如下所示：
```cpp
class Step3
{
  public:
    Step3 ();
    void run ();

  private:
    void make_grid ();
    void setup_system ();
    void assemble_system ();
    void solve ();
    void output_results () const;

    Triangulation<2>     triangulation;
    FE_Q<2>              fe;
    DoFHandler<2>        dof_handler;

    SparsityPattern      sparsity_pattern;
    SparseMatrix<double> system_matrix;
    Vector<double>       solution;
    Vector<double>       system_rhs;
};
```
这遵循了面向对象编程的原则 <a href="http://en.wikipedia.org/wiki/Encapsulation_(object-oriented_programming)">数据封装</a>，即我们尽力将该类的几乎所有内部细节隐藏在外部无法访问的私有成员中。

让我们先看一下成员变量：这些变量遵循我们在上述要点中概述的构建块，即我们需要一个 Triangulation 和一个 DoFHandler 对象，以及一个描述我们想要使用的形状函数的有限元对象。第二组对象与线性代数相关：系统矩阵和右侧，以及解决方案向量，还有一个描述矩阵稀疏模式的对象。这些就是该类所需的全部（以及任何静态 PDE 求解器所需的基本要素），并且需要在整个程序中存活。与此相比，我们在组装中所需的 FEValues 对象仅在组装期间需要，因此我们在执行该操作的函数中创建它，并在其结束时销毁它。

其次，让我们看一下成员函数。这些函数也已经形成了几乎所有后续教程程序将使用的共同结构：
- `make_grid()`: 这可以被称为一个预处理函数。顾名思义，它设置存储三角剖分的对象。在后面的示例中，它还可以处理边界条件、几何等。
- `setup_system()`: 这是设置解决问题所需的所有其他数据结构的函数。特别是，它将初始化 DoFHandler 对象并正确调整与线性代数相关的各种对象的大小。这个函数通常与上面的预处理函数分开，因为在时间依赖程序中，它可能在每几个时间步中被调用，特别是在网格自适应细化时（我们将在第六步中看到如何做到这一点）。另一方面，设置网格本身在程序开始时只需执行一次，因此分为自己的函数。
- `assemble_system()`: 这是计算矩阵和右侧内容的地方，正如上面介绍中详细讨论的那样。由于对这个线性系统进行操作在概念上与计算其条目非常不同，因此我们将其与下一个函数分开。
- `solve()`: 这是计算线性系统 $AU=F$ 的解 $U$ 的函数。在当前程序中，这是一项简单的任务，因为矩阵非常简单，但当问题不再如此简单时，它将成为程序规模的重要组成部分。
- `output_results()`: 最后，当您计算出一个解时，您可能想对其进行一些处理。例如，您可能想将其输出为可以可视化的格式，或者您可能想计算您感兴趣的量：例如，热交换器中的热流、机翼的空气摩擦系数、最大桥梁载荷，或者仅仅是在某个点上的数值解值。因此，这个函数就是后处理您的解的地方。

所有这些都由单个公共函数（除了构造函数）连接在一起，即 `run()` 函数。它是从创建该类型对象的地方调用的，并且是按适当顺序调用所有其他函数的函数。将此操作封装到 `run()` 函数中，而不是从 `main()` 中调用所有其他函数，可以确保您可以更改此类中关注点分离的实现方式。例如，如果某个函数变得太大，您可以将其拆分为两个，而您唯一需要担心更改的地方就是在这个类中，而不是其他地方。



* 关于类型的说明

deal.II 在命名空间 dealii::types 中通过别名定义了许多整型。

特别是在这个程序中，您将在几个地方看到 types::global_dof_index：这是一种整数类型，用于表示自由度的 <i>全局</i> 索引，即在 Triangulation 上定义的 DoFHandler 对象中某个特定自由度的索引（与特定单元内某个特定自由度的索引相对）。对于当前程序（以及几乎所有教程程序），您将拥有几千到几百万个全局未知数（对于 $Q_1$ 元素，在 2D 中每个单元有 4 个，3D 中有 8 个）。因此，允许存储足够大数字以表示全局 DoF 索引的数据类型是 `unsigned int`，因为它允许存储介于 0 到略多于 40 亿之间的数字（在大多数系统中，整数为 32 位）。实际上，这就是 types::global_dof_index 的定义。

那么，为什么不直接使用 `unsigned int` 呢？deal.II 直到 7.3 版本之前是这样做的。然而，deal.II 支持非常大的计算（通过在第 40 步中讨论的框架），可能在几千个处理器中分布超过 40 亿个未知数。因此，在某些情况下，`unsigned int` 不够大，我们需要 64 位的无符号整型。为了实现这一点，我们引入了 types::global_dof_index，默认情况下，它被定义为简单的 `unsigned int`，而如果需要，可以通过在配置时传递特定标志将其定义为 `unsigned long long int`。

这涵盖了技术方面。但也有一个文档目的：在库及其构建的代码中，如果您看到使用数据类型 types::global_dof_index 的地方，您会立即知道所引用的量实际上是一个全局自由度索引。如果我们只是使用 `unsigned int`，则不会明显有这样的含义（它可能也是一个局部索引、边界指示符、材料 ID 等）。立即知道变量所指的内容也有助于避免错误。

在更实际的层面上，这种类型的存在意味着在组装期间，我们创建一个 $4\times 4$ 矩阵（在 2D 中，使用 $Q_1$ 元素）用于我们当前所在单元的贡献，然后我们需要将该矩阵的元素添加到全局（系统）矩阵的适当元素中。为此，我们需要获取当前单元中局部自由度的全局索引，我们将始终使用以下代码片段：
```cpp
  cell->get_dof_indices (local_dof_indices);
```
其中 `local_dof_indices` 被声明为
```cpp
  std::vector<types::global_dof_index> local_dof_indices (fe.n_dofs_per_cell());
```
这个变量的名称可能有点误导——它代表“在当前单元上局部定义的那些自由度的全局索引”——但在库中持有此信息的变量普遍以这种方式命名。

> 注：types::global_dof_index 不是该命名空间中定义的唯一类型。实际上，还有一个家族，包括 types::subdomain_id、types::boundary_id 和 types::material_id。所有这些都是整型数据类型的别名，但正如上面所述，它们在库中被广泛使用，因此 (i) 变量的意图更容易辨识，(ii) 如果需要，可以将实际类型更改为更大的类型，而无需遍历整个库并确定 `unsigned int` 的特定用途是否对应于某个材料指示符。



## 程序的进一步解释

* 程序框架
	* 创建网格 (`make_grid()`)
	* 设置求解问题所需的所有数据结构 (`setup_system()` )
		* 特别是，它会初始化 `DoFHandler` 对象，并正确调整与线性代数相关的各种对象的大小
	* 矩阵组装 (`assemble_system()`)
	* 矩阵求解 (`solve()`)
	* 数据后处理 (`output_results()`)
```cpp
/* ------------------------------------------------------------------------
 *
 * SPDX-License-Identifier: LGPL-2.1-or-later
 * Copyright (C) 1999 - 2024 by the deal.II authors
 *
 * This file is part of the deal.II library.
 *
 * Part of the source code is dual licensed under Apache-2.0 WITH
 * LLVM-exception OR LGPL-2.1-or-later. Detailed license information
 * governing the source code and code contributions can be found in
 * LICENSE.md and CONTRIBUTING.md at the top level directory of deal.II.
 *
 * ------------------------------------------------------------------------
 */

#include <deal.II/grid/tria.h>
#include <deal.II/dofs/dof_handler.h>
#include <deal.II/grid/grid_generator.h>

#include <deal.II/fe/fe_q.h>

#include <deal.II/dofs/dof_tools.h>

#include <deal.II/fe/fe_values.h>
#include <deal.II/base/quadrature_lib.h>

#include <deal.II/base/function.h>
#include <deal.II/numerics/vector_tools.h>
#include <deal.II/numerics/matrix_tools.h>

#include <deal.II/lac/vector.h>
#include <deal.II/lac/full_matrix.h>
#include <deal.II/lac/sparse_matrix.h>
#include <deal.II/lac/dynamic_sparsity_pattern.h>
#include <deal.II/lac/solver_cg.h>
#include <deal.II/lac/precondition.h>

#include <deal.II/numerics/data_out.h>
#include <fstream>
#include <iostream>

using namespace dealii;

class Step3
{
public:
  Step3();

  void run();

private:
  void make_grid();
  void setup_system();
  void assemble_system();
  void solve();
  void output_results() const;

  Triangulation<2> triangulation;
  // 定义基函数格式
  const FE_Q<2>    fe;
  DoFHandler<2>    dof_handler;

  SparsityPattern      sparsity_pattern;
  SparseMatrix<double> system_matrix;

  Vector<double> solution;
  Vector<double> system_rhs;
};

Step3::Step3()
  : fe(/* polynomial degree = */ 1)
  , dof_handler(triangulation)
{}

void Step3::make_grid()
{
  GridGenerator::hyper_cube(triangulation, -1, 1);
  triangulation.refine_global(5);

  std::cout << "Number of active cells: " << triangulation.n_active_cells()
            << std::endl;
}

void Step3::setup_system()
{
  // 给所有有限元节点编号
  dof_handler.distribute_dofs(fe);
  std::cout << "Number of degrees of freedom: " << dof_handler.n_dofs()
            << std::endl;
  // DOF 定了, 矩阵的大小就定了, 这里定义了 SparsityPattern
  DynamicSparsityPattern dsp(dof_handler.n_dofs());
  // 这一步, 是根据 dof_handler 决定 SparsityPattern 中可能的非零元素
  DoFTools::make_sparsity_pattern(dof_handler, dsp);
  // 相比于 DynamicSparsityPattern. SparsityPattern 是在数值存储上更优化的方案
  sparsity_pattern.copy_from(dsp);
  // matrix 和 SparsityPattern 的区别在于, 几个 matrix 可以共用一个 SparsityPattern
  system_matrix.reinit(sparsity_pattern);

  solution.reinit(dof_handler.n_dofs());
  system_rhs.reinit(dof_handler.n_dofs());
}

void Step3::assemble_system()
{
  // 定义积分公式
  const QGauss<2> quadrature_formula(fe.degree + 1);
  // update_values 得到 shape function 在 real cell 的值
  FEValues<2> fe_values(fe,
                        quadrature_formula,
                        update_values | update_gradients | update_JxW_values);

  const unsigned int dofs_per_cell = fe.n_dofs_per_cell();
  
  // 先计算小矩阵, 最后组装大矩阵
  FullMatrix<double> cell_matrix(dofs_per_cell, dofs_per_cell);
  Vector<double>     cell_rhs(dofs_per_cell);

  std::vector<types::global_dof_index> local_dof_indices(dofs_per_cell);

  for (const auto &cell : dof_handler.active_cell_iterators())
    {
      fe_values.reinit(cell);

      cell_matrix = 0;
      cell_rhs    = 0;

      for (const unsigned int q_index : fe_values.quadrature_point_indices())
        {
          for (const unsigned int i : fe_values.dof_indices())
            for (const unsigned int j : fe_values.dof_indices())
              cell_matrix(i, j) +=
                (fe_values.shape_grad(i, q_index) * // grad phi_i(x_q)
                 fe_values.shape_grad(j, q_index) * // grad phi_j(x_q)
                 fe_values.JxW(q_index));           // dx

          for (const unsigned int i : fe_values.dof_indices())
            cell_rhs(i) += (fe_values.shape_value(i, q_index) * // phi_i(x_q)
                            1. *                                // f(x_q)
                            fe_values.JxW(q_index));            // dx
        }
      cell->get_dof_indices(local_dof_indices);

      for (const unsigned int i : fe_values.dof_indices())
        for (const unsigned int j : fe_values.dof_indices())
          system_matrix.add(local_dof_indices[i],
                            local_dof_indices[j],
                            cell_matrix(i, j));

      for (const unsigned int i : fe_values.dof_indices())
        system_rhs(local_dof_indices[i]) += cell_rhs(i);
    }

  std::map<types::global_dof_index, double> boundary_values;
  VectorTools::interpolate_boundary_values(dof_handler,
                                           types::boundary_id(0),
                                           Functions::ZeroFunction<2>(),
                                           boundary_values);
  MatrixTools::apply_boundary_values(boundary_values,
                                     system_matrix,
                                     solution,
                                     system_rhs);
}

void Step3::solve()
{
  SolverControl            solver_control(1000, 1e-6 * system_rhs.l2_norm());
  SolverCG<Vector<double>> solver(solver_control);
  solver.solve(system_matrix, solution, system_rhs, PreconditionIdentity());

  std::cout << solver_control.last_step()
            << " CG iterations needed to obtain convergence." << std::endl;
}

void Step3::output_results() const
{
  DataOut<2> data_out;
  data_out.attach_dof_handler(dof_handler);
  data_out.add_data_vector(solution, "solution");
  data_out.build_patches();

  const std::string filename = "solution.vtk";
  std::ofstream     output(filename);
  data_out.write_vtk(output);
  std::cout << "Output written to " << filename << std::endl;
}

void Step3::run()
{
  make_grid();
  setup_system();
  assemble_system();
  solve();
  output_results();
}

int main()
{
  Step3 laplace_problem;
  laplace_problem.run();

  return 0;
}
```




<!--stackedit_data:
eyJoaXN0b3J5IjpbLTI5NjI3NDUyNSwtMTY1MDUwMTM3NywtMj
A5OTg2ODQzMiwtMzE1NTQ0NzQ4LDU5Njg5NzE2MCwtMTYxNzA2
NDM4NiwtMTYyMDc1NDg1NywxMTgyMjY0MDU5LC0xNTg2MjcxNz
g2LC0xODk4NDg0MTczLDE5MjY2NjMyNzksMTAyNDkwMDA2Miwt
MTcyMzEyOTI5NCwxOTUwOTg5Mzg4LC00NjA5NzA1N119
-->