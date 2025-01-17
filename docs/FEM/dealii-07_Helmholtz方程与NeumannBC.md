# step-7, Helmholtz方程与NeumannBC

## 方程

 `VectorTools::integrate_difference()` 该函数计算给定连续函数与有限元在每个单元上的不同范数。当然，像任何其他积分一样，我们只能使用求积公式来评估这些范数；因此，选择合适的求积公式对于准确评估误差至关重要。特别是对于 $L_{\infty}$ 范数，我们仅在求积点上评估数值解和精确解的最大偏差。事实上，这通常也是对其他范数的良好建议：如果你的求积点恰巧选在误差较小的位置，由于超收敛，计算出的误差看起来比实际小得多，甚至可能会建议更高的收敛阶次。因此，我们将为这些误差范数的积分选择不同于线性系统组装的求积公式。

函数 `VectorTools::integrate_difference()` 在三角剖分的每个单元 $K$ 上评估所需的范数，并返回一个包含每个单元这些值的向量。通过这些局部值，我们可以获得全局误差。例如，如果向量 $e$ 包含所有单元 $K$ 的元素 $e_K$，并包含局部 $L_2$ 范数 $\|u - u_h\|_K$，那么

$$
E = \left( \sum_K e_K^2 \right)^{1/2}
$$

就是全局的 $L_2$ 误差 $E = \|u - u_h\|_{\Omega}$。

* Neumann BC: 会影响组装右端向量。


Helmholtz方程：

$$ -\Delta u + \alpha u = f, $$

在方形区域 $[-1, 1]^2$ 上，$\alpha = 1$，并附加Dirichlet边界条件：

$$ u = g_1 $$

在边界 $\Gamma$ 的一部分 $\Gamma_1$ 上，和Neumann条件：

$$ n \cdot \nabla u = g_2 $$

在其余部分 $\Gamma_2 = \Gamma \setminus \Gamma_1$ 。我们将使用 $\Gamma_1 = \Gamma \cap \{ \{ x = 1 \} \cup \{ y = 1 \} \}$。（我们称这个方程具有“良好符号”，因为算子 $-\Delta + \alpha I$（其中$I$为单位算子）和$\alpha > 0$是一个正定算子；带有“坏符号”的方程是 $-\Delta - \alpha u$，对于带有“坏符号”的方程，如果$\alpha > 0$较大，算子 $-\Delta - \alpha I$ 不是正定的，这会导致许多我们在这里无需讨论的问题。如果$\alpha$恰好是$-\Delta$的特征值，则算子也可能不可逆——即方程没有唯一解。）

使用上述定义，我们可以陈述该方程的弱形式，公式如下：求解 $u \in H^1_g = \{ v \in H^1 : v|_{\Gamma_1} = g_1 \}$ 使得

$$ (\nabla v, \nabla u)_\Omega + (v, u)_\Gamma = (v, f)_\Omega + (v, g_2)_\Gamma $$

对所有测试函数 $v \in H^1_0 = \{ v \in H^1 : v|_{\Gamma_1} = 0 \}$。边界项 $(v, g_2)_{\Gamma_2}$ 是通过分部积分得到的，使用 $\partial_n u = g_2$ 在 $\Gamma_2$ 上，$v = 0$ 在 $\Gamma_1$ 上。我们用来构建全局矩阵和右端向量的单元矩阵和向量因此如下所示：

$$ A_{ij}^K = (\nabla \varphi_i, \nabla \varphi_j)_K + (\varphi_i, \varphi_j)_K, $$

$$ F^K_i = (\varphi_i, f)_K + (\varphi_i, g_2) \partial K \cap \Gamma_2. $$

由于之前的例子中已经多次展示了域积分的生成，因此在此更感兴趣的是边界积分的生成。它大致按照以下步骤进行：对于域积分，我们有 `FEValues` 类，该类提供形状值的值和梯度，以及雅可比，并且我们使用该类执行这些任务，来对单元面的积分进行操作。它为我们提供了一个求积公式，适用于我们希望执行积分的面，这个面上的维度与单元面相同。然后，类会计算该面的值、梯度、法向量、权重等。


<!--stackedit_data:
eyJoaXN0b3J5IjpbODgxODg2MDYxLC00MzQ5Nzk4MDQsMTc1ND
YxNjY5M119
-->