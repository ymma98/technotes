# step-20, 矢量方程

* step-22 (待看)

## 问题描述

$$
-\nabla \cdot K(x) \nabla p = f \quad \text{in } \Omega,
$$

$$
p = g \quad \text{on } \partial \Omega.
$$



如果假设 $\mathbf{u} = -K \nabla p$，有：

$$
K^{-1} \mathbf{u} + \nabla p = 0 \quad \text{in } \Omega,
$$

$$
-\text{div } \mathbf{u} = -f \quad \text{in } \Omega,
$$

$$
p = g \quad \text{on} \quad \partial \Omega.
$$


这个问题的弱形式是通过将两个方程分别乘以测试函数并对某些项进行分部积分得到的：

$$
A(\{\mathbf{u}, p\}, \{\mathbf{v}, q\}) = F(\{\mathbf{v}, q\}),
$$

其中

$$
A(\{\mathbf{u}, p\}, \{\mathbf{v}, q\}) = (\mathbf{v}, K^{-1} \mathbf{u})_\Omega - (\text{div } \mathbf{v}, p)_\Omega - (q, \text{div } \mathbf{u})_\Omega
$$

$$
F(\{\mathbf{v}, q\}) = -(g, \mathbf{v} \cdot \mathbf{n})_{\partial \Omega} - (f, q)_\Omega
$$


需要求解的离散问题是：

$$
A(x_h, w_h) = F(w_h),
$$

$x_h = \{u_h, p_h\}$，$w_h = \{v_h, q_h\}$。$x_h$和$w_h$来自空间$X_h = RT(k) \times DQ(k)$，其中$RT(k)$是一个$dim$维的函数空间，用于表示流速是矢量值。关键问题是：如何在程序中实现这些？

矢量值单元已经在之前的教程中讨论过，首次详细介绍是在\texttt{step-8}中。主要区别在于，矢量值空间$V_h$在所有分量上是统一的：位移矢量的$dim$个分量都是相等的，并来自同一函数空间。因此，我们将$V_h$构建为$dim$个通常的$Q(1)$有限元空间的外积，从而确保所有形函数只有一个非零的矢量分量。与其处理矢量值形函数，在\texttt{step-8}中我们只需查看唯一的非零标量分量，并通过调用\texttt{fe.system\_to\_component\_index(i).first}来确定该分量。

这种方法不适用于Raviart-Thomas单元。由于其构造需满足$H(\text{div})$空间的特定正则性性质，$RT(k)$的形函数通常在所有矢量分量上都非零。因此，如果直接使用\texttt{fe.system\_to\_component\_index(i).first}来确定形函数$i$唯一的非零分量，将会产生异常。我们需要获取形函数的所有矢量分量。按照deal.II的术语，这类有限元称为\textbf{非原始单元}（non-primitive），而那些标量有限元或矢量值形函数仅在一个矢量分量上非零的有限元称为\textbf{原始单元}（primitive）。

那么，针对非原始单元，我们该如何处理？为了解决这个问题，让我们回到教程的最初部分。我们了解到，可以使用\texttt{FEValues}类来确定形函数在积分点上的值和梯度。例如，我们可以调用\texttt{fe\_values.shape\_value(i, q\_point)}来获取第$i$个形函数在编号为$q\_point$的积分点处的值。在\texttt{step-8}和其他教程中，我们了解到该函数调用也适用于矢量值形函数（针对原始有限元），并且返回形函数$i$在积分点$q\_point$处唯一的非零分量的值。

对于非原始形函数，这显然行不通：形函数$i$没有单一的非零矢量分量，因此调用\texttt{fe\_values.shape\_value(i, q\_point)}并无意义。然而，deal.II提供了另一个函数调用\texttt{fe\_values.shape\_value\_component(i, q\_point, comp)}，它返回形函数$i$在积分点$q\_point$处第$comp$个矢量分量的值，其中$comp$的索引在零到当前有限元矢量分量数之间。例如，我们用于描述速度和压力的单元将具有$dim+1$个分量。需要注意的是，该函数调用也可用于原始形函数：它会对除一个分量外的其他分量返回零；而对于非原始形函数，通常会返回多个非零值。

<!--stackedit_data:
eyJoaXN0b3J5IjpbODU1NzQwMDgwLDQ1NjM5NDIyNywtMTcyOT
Y5MDM1LDE5NjI0NTM0NDEsNzcyNzg3MjA1LDE3NDA0MDkzNTld
fQ==
-->