# 非线性问题

对于非线性问题, 我们有方程:

$$
F(\vec{x}) = 0
$$

根据 Taylor expansion, 有

$$
F(\vec{x}) = F(\vec{x}_k) + \frac{\partial F(\vec{x})}{\partial \vec{x}} (\vec{x}-\vec{x}_k)
$$

于是, 

$$
F(\vec{x}_0) = F(\vec{x}_k) + \frac{\partial F(\vec{x})}{\partial \vec{x}_0} (\vec{x}_0-\vec{x}_k)
$$

我们希望 $\vec{x}=\vec{x}_0$ 是方程的根, 其中 $\delta \mathbf{x}=\vec{x}_0-\vec{x}_k$

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTgwNDUzOTI1Nl19
-->