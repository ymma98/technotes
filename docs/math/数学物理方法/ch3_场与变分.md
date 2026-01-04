# ch3_场与变分

## 变分法

对于被积函数 $L$，它是系统若干**独立变量**（coordinate、field amplitudes）以及这些变量对积分参数（速度或场梯度等）的导数的函数。如果变量是$\varphi_1,\ldots,\varphi_n$， 参数是 $x_1,\ldots,x_m$，
导数是  $\frac{\partial \varphi_r}{\partial x_s} = \varphi_{rs}$, 那么需要最小化的积分为：

$$
\mathfrak{L}=
\int_{a_1}^{b_1} \cdots \int_{a_m}^{b_m} L\!\left(
\varphi, \frac{\partial \varphi}{\partial x}, x \right) \, dx_1 \cdots dx_m
$$

通过该函数的最小化（$\delta \mathfrak{L} = 0$），我们可以得到控制(governing) $\varphi$（作为 $x$ 的函数）的偏微分方程以及许多其他东西。 这个获得 $\varphi$ 的过程称为**变分法**。变分法能够以简洁的方式表达涵盖各种现象的一般原理。

### 变分积分(variational integral)与欧拉方程(Euler equation)

待最小化（或最大化）积分的被积函数 $L$ 将被称为系统的 Lagrange density（拉格朗日密度）。它是系统基本参数的函数的函数。对于函数 $\varphi_r$，假设改变由项 $\epsilon \eta_r$ 表示，其中 $\eta_r$ 是参数的任意函数，$\epsilon$ 是一个与参数无关的小量。通常使用简写符号 $\delta \varphi_r$ 来代替 $\epsilon \eta_r$，其中 $\delta \varphi$ 被视为函数 $\varphi$ 的任意微小“变分（variation）。$\varphi$ 的这种修正也会导致梯度分量 $\varphi_{rs}$ 的变化。场值的变化：$\tilde{\varphi}_r = \varphi_r + \epsilon_r \eta_r(x)$, 梯度的变化：$\tilde{\varphi}_{rs} = \varphi_{rs} + \epsilon_r \frac{\partial \eta_r}{\partial x_s}$

回顾最基础的二元泰勒展开：

$$f(y + \Delta y, z + \Delta z) \approx f(y, z) + \frac{\partial f}{\partial y}\Delta y + \frac{\partial f}{\partial z}\Delta z$$

现在把 $L$ 看作是 $\varphi$ 和 $\varphi_{rs}$ 的函数：

$$L(\dots, \varphi_r + \epsilon \eta_r, \varphi_{rs} + \epsilon \frac{\partial \eta_r}{\partial x_s}, \dots) \approx L(\dots) + \underbrace{\frac{\partial L}{\partial \varphi_r} (\epsilon \eta_r)}_{\text{场值贡献}} + \underbrace{\sum_s \frac{\partial L}{\partial \varphi_{rs}} \left(\epsilon \frac{\partial \eta_r}{\partial x_s}\right)}_{\text{梯度贡献}}$$

利用 $L$ 的泰勒级数展开，我们可以证明，由 $\varphi$ 的微小变化引起的积分 $\mathfrak{L}$ 的一阶变化可以写为：

$$\delta \mathfrak{L} = \int_{a_1}^{b_1} \dots \int_{a_m}^{b_m} \sum_{r=1}^{n} \epsilon_r \left[ \frac{\partial L}{\partial \varphi_r} \eta_r + \sum_{s=1}^{m} \frac{\partial L}{\partial \varphi_{rs}} \frac{\partial \eta_r}{\partial x_s} \right] dx_1 \dots dx_m$$

我们假设参数的选择使得积分限都是常数，并且所有 $\eta$ 在这些极限处趋于零。

项 $(\partial L / \partial \varphi_{rs}) (\partial \eta_r / \partial x_s)$ 可以对 $x_s$ 进行分部积分（integrated by parts），得到：

$$\left[ \frac{\partial L}{\partial \varphi_{rs}} \eta_r \right]_{a_s}^{b_s} - \int_{a_s}^{b_s} \frac{\partial}{\partial x_s} \left( \frac{\partial L}{\partial \varphi_{rs}} \right) \eta_r dx_s$$

第一项为零，因为 $\eta_r = 0$ 在 $a_s$ 和 $b_s$ 处。因此，$\mathfrak{L}$ 的一阶变分是：

$$\delta \mathfrak{L} = \int_{a_1}^{b_1} \dots \int_{a_m}^{b_m} \sum_{r=1}^{n} \epsilon_r \left[ \frac{\partial L}{\partial \varphi_r} - \sum_{s=1}^{m} \frac{\partial}{\partial x_s} \left( \frac{\partial L}{\partial \varphi_{rs}} \right) \right] \eta_r dx_1 \dots dx_m \quad (3.1.2)$$

（得出 Euler-Lagrange 方程）

为了使 $\mathfrak{L}$ 取极值（最大值或最小值），必须选择 $\varphi$ 的函数形式，使得 $\delta \mathfrak{L}$ 积分中每个 $\epsilon_r$ 的系数为零。这导致了一组描述 $\varphi$ 期望行为的方程：

$$\sum_{s=1}^{m} \frac{\partial}{\partial x_s} \left( \frac{\partial L}{\partial \varphi_{rs}} \right) = \frac{\partial L}{\partial \varphi_r}; \quad r = 1, \dots, n \quad (3.1.3)$$

这些用于确定 $\varphi$ 最佳函数形式的方程被称为 **Euler equations（欧拉方程）**。

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTU4NzkzMDEwM119
-->