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

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250119/image.5j4aimvnlc.webp)

使用上述定义，我们可以陈述该方程的弱形式，公式如下：求解 $u \in H^1_g = \{ v \in H^1 : v|_{\Gamma_1} = g_1 \}$ 使得

$$ (\nabla v, \nabla u)_\Omega + (v, u)_\Gamma = (v, f)_\Omega + (v, g_2)_\Gamma $$

对所有测试函数 $v \in H^1_0 = \{ v \in H^1 : v|_{\Gamma_1} = 0 \}$。边界项 $(v, g_2)_{\Gamma_2}$ 是通过分部积分得到的，使用 $\partial_n u = g_2$ 在 $\Gamma_2$ 上，$v = 0$ 在 $\Gamma_1$ 上。我们用来构建全局矩阵和右端向量的单元矩阵和向量因此如下所示：

$$ A_{ij}^K = (\nabla \varphi_i, \nabla \varphi_j)_K + (\varphi_i, \varphi_j)_K, $$

$$ F^K_i = (\varphi_i, f)_K + (\varphi_i, g_2) \partial K \cap \Gamma_2. $$



## 构造解法

为了验证我们的数值解 $u_h$ 的收敛性，我们希望设置一个精确解 $u$, 选择一个函数

$$ \bar{u}(x) = \sum_{i=1}^{3} \exp\left( -\frac{|x - x_i|^2}{\sigma^2} \right), $$

其中，指数函数的中心点 $x_i$ 分别为 $x_1 = (-\frac{1}{2}, \frac{1}{2})$，$x_2 = (-\frac{1}{2}, -\frac{1}{2})$，$x_3 = (\frac{1}{2}, -\frac{1}{2})$，半宽度设为 $\sigma = \frac{1}{8}$。构造解法则告诉我们：选择

$$ f = -\Delta u + \bar{u}, $$

$$ g_1 = \bar{u}, $$

$$ g_2 = n \cdot \nabla \bar{u}, $$

通过这种特殊的选择，$f$、$g_1$、$g_2$，原问题的解必然是 $u = \bar{u}$。然后，这使我们能够计算数值解的误差。在下面的代码中，我们通过 `Solution` 类表示 $\bar{u}$，而其他类将用来表示 $u$ 在 $\Gamma_1 = g_1$ 上和 $n \cdot \nabla u|_{\Gamma_2} = g_2$。

> **注意**  
> 原则上，你可以为上面的函数 $\bar{u}$ 选择任何形式——这里我们仅仅选择了三个指数函数的和。在实践中，有两个考虑因素需要考虑：（i）函数必须足够简单，以便你能够轻松地计算其导数，例如为了确定 $f = -\Delta \bar{u} + \bar{u}$。由于指数的导数相对容易计算，上述选择满足了这一要求，而像 $\bar{u}(x) = \text{atan}(\|x\|)$ 这样的函数会更具挑战。（ii）你不希望 $\bar{u}$ 是一个低阶多项式。因为如果你选择足够高阶的有限元多项式，你可以用数值解 $u_h$ 精确表示这个 $\bar{u}$，使得误差为零，无论网格是粗还是细。验证这一点是有用的，但它不能让你验证误差在任意函数 $f$ 的一般情况下随着网格大小 $h$ 的收敛阶次。（iii）典型的有限元误差估计假设解是平滑的，即足够平滑的域、右端项 $f$ 和边界条件。（iv）你希望所选择的解，其变化可以在你考虑的网格上被解析。例如，如果你选择 $\bar{u}(x) = \sin(1000x_1)\sin(1000x_2)$，此时只有非常细的网格才能捕获这样的高频振荡。

我们选择的解 $\bar{u}$ 满足所有这些要求：（i）它相对容易微分；（ii）它不z是一个多项式；（iii）它是平滑的；（iv）它的长度尺度为 $\sigma = \frac{1}{8}$，在 $[-1, 1]^d$ 范围内相对容易用每个坐标方向上至少16个单元的网格来解析。


## 代码拆解


```cpp

```

<!--stackedit_data:
eyJoaXN0b3J5IjpbMjg4MjkzNjE4LDExMDA3OTk1ODksLTk5ND
kzNDAyLC05NTE1NTA5MjAsLTQzNDk3OTgwNCwxNzU0NjE2Njkz
XX0=
-->