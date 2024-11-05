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

$-\Delta$ 可以视为 a weak derivative operator on a Hilbert space

$-\Delta = -\Sum \frac{\partial u}{}$

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQxNjI4NDE2NF19
-->