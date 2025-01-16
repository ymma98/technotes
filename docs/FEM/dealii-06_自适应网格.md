# step-6, 自适应网格

## 步骤

- 在当前网格上求解PDE；
- 使用某些标准估算每个单元的误差；
- 标记那些误差较大的单元进行细化，标记那些误差较小的单元进行粗化，其他单元保持不变；
- 对标记的单元进行细化和粗化，以获得新的网格；
- 重复上述步骤，直到新网格上的误差足够小。

## 理论

理论上我们知道如果细化全局网格，误差将会按照下面的公式收敛为零：

$$
\| \nabla (u - u_h) \|_\Omega \leq C h^{p}_{\text{max}} \| \nabla^{p+1} u \|_\Omega,
$$

其中 $C$ 是与 $h$ 和 $u$ 无关的常数，$p$ 是使用的有限元的多项式阶数，$h_{\text{max}}$ 是最大单元的尺寸。那么，如果最大单元很重要，为什么我们要在某些区域内细化网格呢？

答案在于观察到上面的公式并不最优。实际上，更多的工作表明，以下的估计要更好（你应该将其与上述估计的平方进行比较）：

$$
\| (u - u_h) \|_\Omega^2 \leq C \sum_K h_K^{2p} \| \nabla^{p+1} u \|_K^2.
$$

这个公式表明，不需要将最大单元做得非常小，而是网格只需要在那些 $| \nabla^{p+1} u |$ 较大的地方做得小。 

当然，这个先验估计在实际中并不是非常有用，因为我们无法知道问题的精确解 $u$，因此无法直接计算 $\nabla^{p+1} u$。但这正是常见的做法，我们可以计算数值近似值 $\nabla^{p+1} u$，并且这些值可以通过之前计算得到。



$$
-\nabla \cdot a(\mathbf{x}) \nabla u(\mathbf{x}) = 1 \quad \text{in } \Omega,
$$

$$
u = 0 \quad \text{on } \partial \Omega.
$$

$$
a(\mathbf{x}) =
\begin{cases}
20 & \text{if } |\mathbf{x}| < 0.5, \\
1 & \text{otherwise.}
\end{cases}
$$



<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE3NzI1OTc2NzcsMTkyODM5MzM2LC0yMD
AxMDYwMzQ4LC0xNDY5MjkxMzE5XX0=
-->