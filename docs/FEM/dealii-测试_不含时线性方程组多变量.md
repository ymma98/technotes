# dealii-测试_不含时线性方程组-多变量


## 弱格式

对应 Xiaoming He Chapter 6: Finite elements for 2D steady Stokes equation 

原始方程:

$$
-2 \, \mathrm{div}\,\varepsilon(\mathbf{u}) + \nabla p = \mathbf{f}, \\
-\mathrm{div}\,\mathbf{u} = 0,
$$

其中 $\epsilon(\mathbf{u}) = \frac{1}{2}(\nabla \mathbf{u} + \nabla \mathbf{u}^T)$, $\epsilon_{ij} = \frac{1}{2}(\partial_j u_i + \partial_i u_j)$

测试函数为 $\vec{\phi} = (\vec{v},q)^T$, 即, 对第一个式子点积 $\vec{v}$, 对第二个式子乘以 $q$, **然后相加**，得到:

$$
(\mathbf{v}, -2 \, \mathrm{div}\,\varepsilon(\mathbf{u}) + \nabla p)_\Omega - (q, \mathrm{div}\,\mathbf{u})_\Omega 
= (\mathbf{v}, \mathbf{f})_\Omega,
$$

对 $\nabla p$ 项应用分部积分，

$$
(\mathbf{v}, -2 \, \mathrm{div}\,\varepsilon(\mathbf{u}))_\Omega - (\mathrm{div}\,\mathbf{v}, p)_\Omega + (\mathbf{n}\cdot\mathbf{v}, p)_{\partial\Omega} - (q, \mathrm{div}\,\mathbf{u})_\Omega
= (\mathbf{v}, \mathbf{f})_\Omega.
$$

之后对第一项应用分部积分 ($\epsilon^T = \epsilon$)

$$
(\nabla\cdot\epsilon)\cdot \vec{v} = (\partial_j\epsilon_{ij}) v_i = \partial_j(\epsilon_{ij} v_i) - \epsilon_{ij} \partial_j v_i  = \nabla \cdot (\vec{v}\cdot \epsilon^T) - \epsilon :\vec{v} = \nabla \cdot (\vec{v}\cdot \epsilon) - \epsilon :\vec{v}
$$

因为 $(\vec{v}\cdot \epsilon)\cdot \vec{n} = v_j \epsilon_{ij} n_i = n_i v_j \epsilon_{ij} = \vec{n}\otimes \vec{v} : \epsilon$, 所以弱格式化为:

$$
(\nabla \mathbf{v}, 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathbf{n} \otimes \mathbf{v}, 2 \, \varepsilon(\mathbf{u}))_{\partial\Omega} - (\mathrm{div}\,\mathbf{v}, p)_\Omega + (\mathbf{n}\cdot\mathbf{v}, p)_{\partial\Omega} - (q, \mathrm{div}\,\mathbf{u})_\Omega
= (\mathbf{v}, \mathbf{f})_\Omega,
$$

这里应用一个结论，一个张量总可以分为对称部分+反对称部分，$\mathbf{A}=\mathbf{A}_{sym}+\mathbf{A}_{skew}$, $\mathbf{A}_{sym} = \frac{1}{2} (\mathbf{A} + \mathbf{A}^T)$, $\mathbf{A}_{skew} = \frac{1}{2} (\mathbf{A} - \mathbf{A}^T)$, 一个任意张量双点积一个对称张量，等于这个张量的对称部分双点积这个对称张量，于是弱格式进一步化为

$$
(\varepsilon(\mathbf{v}), 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathbf{n} \otimes \mathbf{v}, 2 \, \varepsilon(\mathbf{u}))_{\partial\Omega} - (\mathrm{div}\,\mathbf{v}, p)_\Omega + (\mathbf{n}\cdot\mathbf{v}, p)_{\partial\Omega} - (q, \mathrm{div}\,\mathbf{u})_\Omega
= (\mathbf{v}, \mathbf{f})_\Omega,
$$

如果观察除了边界项之外的项，可以发现 $\vec{v}$ 和 $\vec{u}$ 可以互换, $q$ 和 $p$ 可以互换, 最后得到的矩阵一定是对称的 (只有 test function 和 trial function 是函数, 其它都只带来常数项，只要函数的形式是对称的, 那么矩阵一定是对称的). 

我们可以把边界项化为更有意义的形式 (用应力张量表达 F/m^2)

$$ -(\mathbf{n} \otimes \mathbf{v}, 2 \, \varepsilon(\mathbf{u}))_{\Gamma_N} + (\mathbf{n} \cdot \mathbf{v}, p)_{\Gamma_N} = \sum_{i,j=1}^{d} - (n_i v_j, 2 \, \varepsilon(\mathbf{u})_{ij})_{\Gamma_N} + \sum_{i}^{d} (n_i v_i, p)_{\Gamma_N}
$$

$$= \sum_{i,j=1}^{d} - (n_i v_j, 2 \, \varepsilon(\mathbf{u})_{ij})_{\Gamma_N}+ \sum_{i,j=1}^{d} (n_i v_j, p \, \delta_{ij})_{\Gamma_N}
$$

$$
= \sum_{i,j=1}^{d} (n_i v_j, p \, \delta_{ij} - 2 \, \varepsilon(\mathbf{u})_{ij})_{\Gamma_N}
$$

$$
= (\mathbf{n} \otimes \mathbf{v}, p \, \mathbf{I} - 2 \, \varepsilon(\mathbf{u}))_{\Gamma_N}
$$

$$
= (\mathbf{v}, \mathbf{n} \cdot [p \mathbf{I} - 2 \, \varepsilon(\mathbf{u})])_{\Gamma_N}.
$$

 于是 
$$
\mathbf{n} \cdot \bigl[p \mathbf{I} - 2 \, \varepsilon(\mathbf{u})\bigr] 
= \mathbf{g}_N 
\quad \text{on } \Gamma_N.
$$

$\mathbf{g}_N$ 是作用在表面上的力 (N/m^2)， $\vec{n}$ 无量纲 $\int \nabla \cdot \mathbf{T} dV = \int \mathbf{T}\cdot \vec{n} dS$. 最终的弱格式表示为:

$$
(\varepsilon(\mathbf{v}), 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathrm{div}\,\mathbf{v}, p)_\Omega - (q, \mathrm{div}\,\mathbf{u})_\Omega = (\mathbf{v}, \mathbf{f})_\Omega - (\mathbf{v}, \mathbf{g}_N)_{\Gamma_N}.
$$

在 Dirichlet BC 下, $\mathbf{v} = 0$. 对于 Neumann BC, 需要约束 $\mathbf{g_N}$, 注意因为原始方程中只有 $\nabla p$, 因此必须在边界某处指定 $p$ 为 Dirichlet BC, 但是不用在整个边界上指定一个 $p$ 的边界条件.

只有在推导该物理量所对应的弱格式中，出现一个与该物理量的 test function 相乘的边界积分项时, 我们才需要指定这个物理量的边界条件。这里 $p$ 是作为 $\vec{u}$ 的拉格朗日乘子出现的, 拉格朗日乘子的大小，反映了为了满足约束条件，需要付出多大的“代价”。在斯托克斯方程中， $\nabla p$ 可以被理解为一种“约束力”。当流体想要汇聚到一个点（将要被压缩）时，$p$ 会迅速在该点升高，产生一个强大的压强梯度（约束力）把流体推开，从而保证 $\nabla \cdot \vec{u} = 0$。

还有一种特殊的边界条件: partial boundary onditions 或者滑移边界条件 (slip boundary condition), 相当于 Dirichlet BC+Neumann BC, 只约束特定方向的 $\vec{u}$. 如果像一条水管那样，需要约束 $\vec{u}_t  = \vec{u} - \vec{n}(\vec{u}\cdot\vec{n}) = (\mathbf{I} - \vec{n} \otimes \vec{n}) \cdot \vec{u}$  (注:  $\vec{a} \otimes \vec{b} \cdot \vec{c} = \vec{a} (\vec{b} \cdot \vec{c})$)

此时有:

$$
\mathbf{u}_t = 0, \\
\mathbf{n} \cdot \bigl(\mathbf{n} \cdot [p\mathbf{I} - 2 \, \varepsilon(\mathbf{u})]\bigr) = 0.
$$

因为速度只有法向分量， 根据第二个方程, 可知此时并不贡献任何边界项。

对应的，类似于湖水的情况，有法向速度为0， 

$$
\mathbf{n} \cdot \mathbf{u} = 0, \\
( \mathbf{I} - \mathbf{n} \otimes \mathbf{n} ) \cdot
\bigl( \mathbf{n} \cdot [p\mathbf{I} - 2 \, \varepsilon(\mathbf{u})] \bigr) = 0.
$$

## 离散化

对于弱格式:

$$
(\varepsilon(\mathbf{v}), 2 \, \varepsilon(\mathbf{u}))_\Omega - (\mathrm{div}\,\mathbf{v}, p)_\Omega - (q, \mathrm{div}\,\mathbf{u})_\Omega = (\mathbf{v}, \mathbf{f})_\Omega - (\mathbf{v}, \mathbf{g}_N)_{\Gamma_N}.
$$

$$
\mathbf{g}_N  = \mathbf{n} \cdot \bigl[p \mathbf{I} - 2 \, \varepsilon(\mathbf{u})\bigr] 
\quad \text{on } \Gamma_N.
$$

$$\epsilon(\mathbf{u}) = \frac{1}{2}(\nabla \mathbf{u} + \nabla \mathbf{u}^T)$$

$$\epsilon_{ij} = \frac{1}{2}(\partial_j u_i + \partial_i u_j)$$


其中测试函数是 $\vec{\phi} = (\vec{v},q)^T$. 可以化为如下矩阵形式 (分别取 test function 为 $\vec{\phi} = (\vec{v},0)^T$ 和 $\vec{\phi} = (0,q)^T$ 得到两行方程):

$$
\begin{pmatrix}
A & B^T \\
B & 0
\end{pmatrix}
\begin{pmatrix}
U \\
P
\end{pmatrix}=
\begin{pmatrix}
F \\
0
\end{pmatrix}
$$

如果 $\mathbf{u}= \sum\limits_{j}^{N_u} U_j \bm{\phi}_j$, $p=\sum\limits_{j}^{N_p} P_j \varphi_j$,  $\mathbf{v}=\bm{\phi}_i$, $q = \varphi_i$  则 

$$
U = \{U_j\}_{j=1}^{N_u}
$$

$$
P = \{P_j\}_{j=1}^{N_p}
$$

$$
A_{ij} = 2 \int \epsilon(\bm{\phi_i}):\epsilon(\bm{\phi_j}) dV
$$

$$
B^T_{ij} = -\int \nabla \cdot \bm{\phi_i} \varphi_j dV
$$

$$
F = \int \bm{v_i} \cdot \bm{f} dV - \int \bm{v}_i \cdot \bm{g}_N dS
$$



$$
B_{ij} = -\int \varphi_i \nabla \cdot \bm{\phi}_j dV
$$

当 PDE 离散后出现**对角零块**, 表明这是一个鞍点问题, 确保数值稳定的方法之一是降低对角零块对应的变量的基函数阶数。



## 误差计算

- $L^\infty$ norm error:

$$
\|\mathbf{u} - \mathbf{u}_h\|_\infty 
= \max \left( \|u_1 - u_{1h}\|_\infty, \; \|u_2 - u_{2h}\|_\infty \right),
$$

$$
\|u_1 - u_{1h}\|_\infty = \sup_\Omega |u_1 - u_{1h}|,
$$

$$
\|u_2 - u_{2h}\|_\infty = \sup_\Omega |u_2 - u_{2h}|,
$$

$$
\|p - p_h\|_\infty = \sup_\Omega |p - p_h| \, .
$$

- $L^2$ norm error:

$$
\|\mathbf{u} - \mathbf{u}_h\|_0
= \sqrt{ \|u_1 - u_{1h}\|_0^2 + \|u_2 - u_{2h}\|_0^2 },
$$

$$
\|u_1 - u_{1h}\|_0
= \left( \int_\Omega (u_1 - u_{1h})^2 \, dxdy \right)^{1/2},
$$

$$
\|u_2 - u_{2h}\|_0
= \left( \int_\Omega (u_2 - u_{2h})^2 \, dxdy \right)^{1/2},
$$

$$
\|p - p_h\|_0
= \left( \int_\Omega (p - p_h)^2 \, dxdy \right)^{1/2}.
$$

- $H^1$ semi-norm error:

$$
|\mathbf{u} - \mathbf{u}_h|_1
= \sqrt{ |u_1 - u_{1h}|_1^2 + |u_2 - u_{2h}|_1^2 },
$$

$$
|u_1 - u_{1h}|_1= \left( \int_\Omega \left( \frac{\partial (u_1 - u_{1h})}{\partial x} \right)^2 + \left( \frac{\partial (u_1 - u_{1h})}{\partial y} \right)^2 dxdy \right)^{1/2},
$$

$$
|u_2 - u_{2h}|_1 = \left( \int_\Omega \left( \frac{\partial (u_2 - u_{2h})}{\partial x} \right)^2 + \left( \frac{\partial (u_2 - u_{2h})}{\partial y} \right)^2 dxdy \right)^{1/2},
$$

$$
|p - p_h|_1 = \left( \int_\Omega \left( \frac{\partial (p - p_h)}{\partial x} \right)^2 + \left( \frac{\partial (p - p_h)}{\partial y} \right)^2 dxdy \right)^{1/2}.
$$




## test case

这里使用如下测试形式:


$$
f_1 = -2\nu x^2 - 2\nu y^2 - \nu e^{-y} + \pi^2 \cos(\pi x) \cos(2\pi y),
$$

$$
f_2 = 4\nu x y - \nu \pi^3 \sin(\pi x) + 2\pi (2 - \pi \sin(\pi x)) \sin(2\pi y).
$$

解析解:

$$
u_1 = x^2 y^2 + e^{-y}, \qquad
u_2 = -\tfrac{2}{3} x y^3 + 2 - \pi \sin(\pi x),
$$

$$
p = -(2 - \pi \sin(\pi x)) \cos(2\pi y),
$$


$$\Omega = [0,1] \times [-0.25,0]$$

## 代码实现重点


### 代码框架

对于多变量系统, 一开始还是和之前一样的, 定义一个 solver class `LinearSteadyStokesSolver`, 并再构造函数中设定网格密度, `polynomial degree`, 初始化 `dof_handler(triangulation)`, 以及初始化 `fe(dealii::FE_Q<dim>(pd_ + 1) ^ dim, dealii::FE_Q<dim>(pd_))`. 

有限元的框架: `setup_system()` (生成网格, 设置边界条件 `constraints`), `assemble_system()` (矩阵组装), `solve()`, `output_results()`, `compute_errors()`

```cpp
template<int dim>
class LinearSteadyStokesSolver{
    public:
        LinearSteadyStokesSolver(const unsigned int pd, double h);
        void run();
        void compute_errors() const;

    private:
        void setup_system();
        void assemble_system();
        void solve();
        void output_results() const;

        const unsigned int pd_;
        const double h_;

        dealii::Triangulation<dim> triangulation;
        dealii::DoFHandler<dim> dof_handler;
        dealii::FESystem<dim> fe;

        dealii::AffineConstraints<double> constraints;
        dealii::SparsityPattern sparsity_pattern;
        dealii::SparseMatrix<double> system_matrix;

        dealii::Vector<double> solution;
        dealii::Vector<double> system_rhs;
};

template <int dim>
LinearSteadyStokesSolver<dim>::LinearSteadyStokesSolver(const unsigned int pd, double h)
  : pd_(pd), h_(h)
  , dof_handler(triangulation)
  , fe(dealii::FE_Q<dim>(pd_ + 1) ^ dim, dealii::FE_Q<dim>(pd_))
{}
```

### 设置解析解和 RHS

```cpp

template <int dim>
class AnalyticalSolution : public dealii::Function<dim> {
public:
  AnalyticalSolution()
    : dealii::Function<dim>(dim + 1) {}

  virtual double value(const dealii::Point<dim> &p,
                       const unsigned int component = 0) const override{
    Assert(component < this->n_components,
           dealii::ExcIndexRange(component, 0, this->n_components));

    const double x = p[0];
    const double y = p[1];

    switch (component)
      {
        case 0: // Velocity u_1
          return (x * x * y * y + std::exp(-y));
        case 1: // Velocity u_2
          return (-2.0 / 3.0 * x * y * y * y + 2.0 -
                  dealii::numbers::PI * std::sin(dealii::numbers::PI * x));
        case 2: // Pressure p
          return (-(2.0 - dealii::numbers::PI * std::sin(dealii::numbers::PI * x)) *
                  std::cos(2.0 * dealii::numbers::PI * y));
        default:
          return 0;
      }
  }

    virtual dealii::Tensor<1, dim> gradient(const dealii::Point<dim> &p,
                                  const unsigned int component = 0) const override
  {
    Assert(component < this->n_components,
           dealii::ExcIndexRange(component, 0, this->n_components));

    const double x = p[0];
    const double y = p[1];
    
    dealii::Tensor<1, dim> return_gradient;

    switch (component)
      {
        case 0: // Gradient of u_1 = [du_1/dx, du_1/dy]
          {
            return_gradient[0] = 2.0 * x * y * y;
            return_gradient[1] = 2.0 * x * x * y - std::exp(-y);
            break;
          }
        case 1: // Gradient of u_2 = [du_2/dx, du_2/dy]
          {
            return_gradient[0] = -2.0 / 3.0 * y * y * y -
                                 dealii::numbers::PI * dealii::numbers::PI *
                                   std::cos(dealii::numbers::PI * x);
            return_gradient[1] = -2.0 * x * y * y;
            break;
          }
        case 2: // Gradient of p = [dp/dx, dp/dy]
          {
            return_gradient[0] = dealii::numbers::PI * dealii::numbers::PI *
                                 std::cos(dealii::numbers::PI * x) *
                                 std::cos(2.0 * dealii::numbers::PI * y);
            return_gradient[1] = 2.0 * dealii::numbers::PI *
                                 (2.0 - dealii::numbers::PI *
                                   std::sin(dealii::numbers::PI * x)) *
                                 std::sin(2.0 * dealii::numbers::PI * y);
            break;
          }
      }
    return return_gradient;
  }

  virtual void vector_value(const dealii::Point<dim> &p,
          dealii::Vector<double> &values) const override{
      Assert(values.size() == dim+1,
              dealii::ExcDimensionMismatch(values.size(),dim));
      for (unsigned int i=0; i < this->n_components; i++){
        values(i) = value(p,i);
      }
  }
};

```


## 测试结果

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250825/image.4ub9n8eota.webp){width=400px}


![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250825/image.26ltcvn158.webp){width=400px}


<!--stackedit_data:
eyJoaXN0b3J5IjpbMTcxOTQ5MzU0NywtMTAxMjg5MzY2NCwtMT
k4NTkyMDI4NCw5MDA3NTUyMTUsLTE0ODU0Nzc4MjksNzQwNjQz
MTE2LDEzMDkyNjk5NTIsLTkzNjUxMjIzNSwtMzY2MzY1MDM0LD
E1NzIyNjk5NjIsLTE2MTY5ODUxNTQsMTQ4NTQ2Nzg2NiwtMTY5
MDc2OTU4NCwxNjUyMTQ5OTA4LDMxMDkwNDgyMSwtOTk1MzA4MT
AxLDMwMTAwNjI2OSwxNzA4MzgxMTEzLDIxNDU5MzUyODksMTg2
NjA3MzkxN119
-->