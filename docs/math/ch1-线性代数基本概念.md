# 线性代数基本概念

> 参考: Roussas G G. A course in mathematical statistics[M]. Elsevier, 1997. 


## 仿射变换

* In Euclidean geometry (平直空间几何), an [affine transformation](https://en.wikipedia.org/wiki/Affine_transformation) or affinity (from the Latin, affinis, "connected with") is a **geometric transformation that preserves lines and parallelism, but not necessarily Euclidean distances and angles**.
An affine map is the composition of two functions: a translation and a linear map. $\mathbf{y}=f(\mathbf{x})=A \mathbf{x}+\mathbf{b}$





* 实仿射平面 (real affine plane) 写作 $A {\mathbb{R}^{2}}$ (A for affine)。仿射平面是点集, 仿射平面中没有定义两点之间的距离，并且没有固定的原点 (origin)。矢量表述了仿射平面中点的相对关系。
* 映射 $f: \mathbb{R}^{2} \rightarrow \mathbb{R}^{2}$ 称作 Euclidean transformation 如果 $f$ 保留了距离. $P_1$ 到 $P_2$ 的距离等于 $f(P_1)$ 到 $f(P_2)$
* 映射 $f: \mathbb{R}^{2} \rightarrow \mathbb{R}^{2}$ 称作 affine transformation 如果 $f$ 把直线映射到直线 (但对距离没有要求, 可以是圆到椭圆。仿射变换一定是平行四边形到平行四边形)。
* 平移 (transformation):
$$
\left[\begin{array}{l}x \\y\end{array}\right] \rightarrow\left[\begin{array}{l}x+a \\y+b\end{array}\right]
$$
* 所有的仿射变换可以写作: $f(w)=l(w)+v$
* 行列式的绝对值表示线性变换对空间区域体积（在二维情况下为面积）的缩放因子。当行列式小于零（即缩放因子为负值）时，这意味着线性变换不仅对空间进行了拉伸或压缩，还反转了空间的方向性
* 矩阵 $F=\left(\begin{array}{ll}a & b \\ c & d\end{array}\right)$ 的行列式
$$  
\begin{equation*} \text { Det } F=a d-b c \end{equation*}  
$$
* 矩阵的逆: 
$$
F^{-1}=\left(\begin{array}{ll}\frac{d}{\operatorname{Det} F} & \frac{-b}{\operatorname{Det} F}  \tag{1.8}\\\frac{-c}{\operatorname{Det} F} & \frac{a}{\operatorname{Det} F}\end{array}\right)
$$

  
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTkwNTg2OTM0MV19
-->