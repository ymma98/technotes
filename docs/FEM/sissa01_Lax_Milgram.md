# sissa01_Lax_Milgram

* 课程 [github 仓库](https://github.com/dealii-courses/sissa-mhpc-theory-and-practice-of-fem)
* [课程主页](https://www.math.sissa.it/course/phd-course/theory-and-practice-finite-element-methods)
* [b站视频](https://www.bilibili.com/video/BV1qq4y1H7bU/?spm_id_from=333.337.search-card.all.click&vd_source=b7bbd99721bfe117cc47d14c9f45af86)

___

## prototypical problem of PDE

假设 $\Omega$ 是 Lipschitz (典例: 具有有界的一阶导数。在 FEM 中，说 domain is Lipschitz, 意味着 $\partial\Omega$ 满足 Lipschitz 连续性条件，边界不过于尖锐或过于陡峭), bounded，并且是 subset of $\mathbb{R}^d$。

典型问题是 elliptic problem. 
$$
-\Delta u = f \quad \text{in} \quad \Omega \\
u = 0 \quad \text{on} \quad \partial \Omega 
$$
上式可以表示为 weak form. 
$-\Delta$ 可以视为 a weak derivative operator on a Hilbert space。这里相当于把 Laplace operator 的经典定义 $-\Delta = -\sum_{i=1}^d \frac{\partial^2 u}{\partial x_i^2}$ 更改为了弱形式的定义。

弱形式的视角中，$-\Delta$ 可以被视作一种映射 $A: V \rightarrow V^\prime$, 将 $V$ ($V$ is Hilbert. FEM 中 Hilbert 的意思是该空间有以下性质, 1. 向量空间，空间中定义了加法和数乘。2. 内积空间，空间定义了内积，并且内积运算是线性的，可交换顺序的，正定的 $(u,u)\geq0$。3. 完备性。意味着任何在 $V$ 中的 Cauchy 序列，即一组元素之间的距离随着序列的增加而趋近于零，都会收敛到 $V$ 中的某个元素) 映射为其对偶空间 (在对偶空间中，每个元素 $f\in V^\prime$ 都是一个线性泛函，作用于 $V$  中的函数 $u$，并返回一个数值)。

于是 
$$
A u = F \quad \text{in} \quad V^\prime
$$
这里 $Au$ 是 $V^\prime$ 中的一个 linear operator (linear functional: $V \rightarrow \mathbb{R}$). 上式也等价于
$$
\langle Au, v\rangle = \langle F,v\rangle \quad \forall \quad v \in V
$$

duality opertor $\langle \cdot, \cdot \rangle$ 定义为 
$$
\langle Au, v\rangle \coloneqq \int_\Omega Au v
$$

所以典型的 FEM 流程是:

1. replace the space $V$ (infinite dimensional, Hilbert) with $V_h$ (finite dimensional)。$V_h = \text{span}\{v_i\}_{i=1}^{n}$，所以 $\forall u_h$, 存在一个矢量, $\exists \{u^i\}_{i=1}^n \in \mathbb{R}^n$, s.t. $u_h(x)=u^iv_i (x)$


2. $A u = F \quad \text{in} \quad V^\prime$ 替换为 $A u_h = F \quad \text{in} \quad V^\prime_h$ ，得到 $\langle Au_h, v_h\rangle = \int_\Omega Au_h v_h, \quad \forall v_h\in V_h$

3. 矩阵化。$\langle A v_j u^j, v_i\rangle=\langle F, v_i\rangle$, $i=1,2,...,n$。所以有 $\mathbb{A}_{ij} u^j = \mathbb{F}_i$, 其中 $\mathbb{A}_{ij}\coloneqq \langle Av_j,v_i \rangle$, $\mathbb{F}_{i}\coloneqq \langle F,v_i \rangle$

## Lax-Milgram lemma

Lax-Milgram 引理主要说明了线性变分问题在满足一定条件下存在唯一的解。具体而言，它确保了当双线性形式满足连续性和强制性（coercivity）条件时，弱形式（变分形式）的线性偏微分方程在所选的 Hilbert 空间中具有唯一解。

Assume $V$ is Hilbert with norm $\lVert \cdot \rVert_V$, and assume $a$ is a bilinear operator on $V$
$$
a: V\times V \rightarrow \mathbb{R} \\
a(u,v) \coloneqq \langle Au, v\rangle
$$
with $a(u,v)\leq \lVert A \rVert \lVert u \rVert \lVert v \rVert, \quad \forall u,v\in V$  (连续性条件)

并且有 $a(u,u)\geq \alpha \lVert u\rVert^2$, assuming $\exists \alpha\in \mathbb{R}, \alpha > 0$. (强制性条件)

在以上两个条件下，Lax-Milgram 引理保证了：

解的存在性：变分问题有解，即存在 $u\in V$ 满足 $a(u,v)=F(v)=\langle Au, v\rangle = \langle F,v\rangle$。

解的唯一性。

并且
$$
\|u\| \leqslant \frac{1}{\alpha}\|F\|_*
$$

$$
\|F\|_*:=\sup _{0 \neq v \in V} \frac{|F(v)|}{\|v\|}=\sup _{0 \neq v \in V} \frac{|\langle F, v\rangle|}{\|v\|} .
$$




<!--stackedit_data:
eyJoaXN0b3J5IjpbLTY3NjE2NDM2NiwtMTkxNjk1NjI0NiwxNz
kyNjU2NjgyLC0yMDUyOTYwNjkwLC0xNjcxMDczMzQ2LDE0Njg5
NTY4MjIsMTY5ODI4NzE2OSwtMzg5ODQ1Nzk5LDIwNzk2MzEwMj
QsMjA3NTkzODY1NCwtNzYzNzk5MjM1LDE5MDQ3MTczNDMsMTAx
MDgyMjQzXX0=
-->