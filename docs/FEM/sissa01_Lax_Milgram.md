# sissa01_Lax_Milgram

* 课程 [github 仓库](https://github.com/dealii-courses/sissa-mhpc-theory-and-practice-of-fem)
* [课程主页](https://www.math.sissa.it/course/phd-course/theory-and-practice-finite-element-methods)
* [b站视频](https://www.bilibili.com/video/BV1qq4y1H7bU/?spm_id_from=333.337.search-card.all.click&vd_source=b7bbd99721bfe117cc47d14c9f45af86)

___

## prototypical problem of PDE

假设 $\Omega$ 是 Lipschitz (典例: 具有有界的一阶导数。在 FEM 中，说 domain is Lipschitz, 意味着 $\partial\Omega$满足 Lipschitz 连续性条件，边界不过于尖锐或过于陡峭), bounded，并且是 subset of $\mathbb{R}^d$。

典型问题是 elliptic problem. 

$$
-\Delta u = f \quad \text{in} \quad \Omega \\
u = 0 \quad \text{on} \quad \partial \Omega 
$$

上式可以表示为 weak form. 

$-\Delta$ 可以视为 a weak derivative operator on a Hilbert space。这里相当于把 Laplace operator 的经典定义 $-\Delta = -\sum_{i=1}^d \frac{\partial^2 u}{\partial x_i^2}$ 更改为了弱形式的定义。

弱形式的视角中，$-\Delta$ 可以被视作一种映射 $A: V \rightarrow V^\prime$, 将 $V$ ($V$ is Hilbert. FEM 中 Hilbert 的意思是该空间有以下性质, 1. 向量空间，空间中定义了加法和数乘。2. 内积空间，空间定义了内积，并且内积运算是线性的，可交换顺序的，正定的 $(u,u)\geq0$。3. 完备性。意味着任何在 $V$ 中的 Cauchy 序列，即一组元素之间的距离随着序列的增加而趋近于零，都会收敛到 $V$ 中的某个元素) 映射为其对偶空间。

yu'shi

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE0MzgyOTY2MzVdfQ==
-->