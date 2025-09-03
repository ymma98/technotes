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


## 如果是非线性怎么办呢?

牛顿法!

比如，

$$
\mathbf{u}\cdot \nabla \mathbf{u}-2 \, \mathrm{div}\,\varepsilon(\mathbf{u}) + \nabla p = \mathbf{f}, \\
-\mathrm{div}\,\mathbf{u} = 0,
$$
其中 $\mathbf{u}\cdot \nabla \mathbf{u}$ 是非线性项, 对应弱格式中多了一项非线性项 $F(\mathbf{u})$:

$$
\int (\mathbf{u}\cdot \nabla \mathbf{u}) \cdot \mathbf{v} dV
$$

对于牛顿迭代, 如果已知 $\mathbf{u}^{l}$, 那么 $F(\mathbf{u}^{l+1})$ 可以用 $\mathbf{u}^{l}$ 处的值估算:

$$
F(\mathbf{u}^{l+1}) = F(\mathbf{u}^{l})+\frac{\partial F}{\partial \mathbf{u}} \delta \mathbf{u}
$$
其中 $\frac{\partial F}{\partial \mathbf{u}} \delta \mathbf{u}$ 是 Frechet 导数:

$$
\frac{\partial F}{\partial \mathbf{u}} \delta \mathbf{u} = \lim_{\epsilon\rightarrow 0}\frac{d}{d\epsilon} F(\mathbf{u} + \delta \mathbf{u})
$$

对于该问题而言, 有 (为了打字方便, 以下省略积分符号): 
$$
\frac{\partial F}{\partial \mathbf{u}} \delta \mathbf{u} = \frac{d}{d\epsilon} \left[ (\mathbf{u}^l +\epsilon \delta \mathbf{u})\cdot \nabla (\mathbf{u}^l + \epsilon \delta \mathbf{u}) \cdot \mathbf{v} \right] \\
=\mathbf{u}^l \cdot \nabla \delta \mathbf{u} \cdot \mathbf{v} + \delta \mathbf{u}\cdot \nabla \mathbf{u}^l \cdot \mathbf{v}
$$
其中 $\delta \mathbf{u} = \mathbf{u}^{l+1} - \mathbf{u}^l$. 所以
$$
\frac{\partial F}{\partial \mathbf{u}} \delta \mathbf{u} = \mathbf{u}^l\cdot \nabla \mathbf{u}^{l+1} \cdot \mathbf{v} + \mathbf{u}^{l+1} \cdot \nabla \mathbf{u}^l \cdot \mathbf{v} - 2 \mathbf{u}^l \cdot \nabla \mathbf{u}^{l+1} \cdot \mathbf{v}   
$$

因此, 

$$
\int (\mathbf{u}^{l+1}\cdot \nabla \mathbf{u}^{l+1}) \cdot \mathbf{v} dV = \int \mathbf{u}^l\cdot \nabla \mathbf{u}^{l+1} \cdot \mathbf{v} dV + \int \mathbf{u}^{l+1} \cdot \nabla \mathbf{u}^l \cdot \mathbf{v} dV - \int \mathbf{u}^{l} \cdot \nabla \mathbf{u}^l  dV
$$

每次迭代 $A^{l+1} X^{l+1} = b^{l+1}$, 直到 $|X^{l+1} - X^{l}| < \epsilon$

如果 $F(\mathbf{u})$ 是线性项, 那么 $F(k\mathbf{u})=kF(\mathbf{u})$, $F(\mathbf{u}+\mathbf{B})=F(\mathbf{u})+F(\mathbf{B})$,

$$
F(\mathbf{u}^{l+1}) = F*()
$$



## 代码实现重点


### 代码框架

对于多变量系统, 一开始还是和之前一样的, 定义一个 solver class `LinearSteadyStokesSolver`, 并再构造函数中设定网格密度, `polynomial degree`, 初始化 `dof_handler(triangulation)`, 以及初始化 `fe(dealii::FE_Q<dim>(pd_ + 1) ^ dim, dealii::FE_Q<dim>(pd_))`.  `fe` 用于记录自由度, 可以根据变量的多少 (比如这里是 $\vec{u}$, $p$) 一直传参数进去, 这里第一个参数对应 $u$, 有 `dim` 个自由度, 第二个参数对应 $p$, 有1个自由度

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

这里需要注意 `AnalyticalSolution` 和 `RightHandSide` 分别继承自  `public dealii::Function<dim>` 和 `public dealii::TensorFunction<1, dim>`.  这类 class 的套路都是类似的, 需要实现:

* ` virtual double value(const dealii::Point<dim> &p,const unsigned int component = 0) const override`
* `virtual dealii::Tensor<1, dim> gradient(const dealii::Point<dim> &p,const unsigned int component = 0) const override`
* `virtual void vector_value(const dealii::Point<dim> &p,dealii::Vector<double> &values) const override`
                    

```cpp
template <int dim>
class AnalyticalSolution : public dealii::Function<dim> {
public:
  // 问题是 dim 维度的, this->n_components=dim +１
  AnalyticalSolution()
    : dealii::Function<dim>(dim + 1) {}

  virtual double value(const dealii::Point<dim> &p,
                       const unsigned int component = 0) const override{
    // exception: component 的值超出了 [0, n_components) 这个有效范围
    Assert(component < this->n_components,
           dealii::ExcIndexRange(component, 0, this->n_components));

    const double x = p[0];
    const double y = p[1];

    switch (component)
      {
        case 0: // Velocity u_1
          return ...
        case 1: // Velocity u_2
         return ...
        case 2: // Pressure p
          return ...
        default:
          return 0;
      }
  }

    // Tensor<rank, dim>, rank=0->scalar, rank=1->vector
    // 计算单个分量的梯度
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
            return_gradient[0] = ...
            return_gradient[1] = ...
            break;
          }
        case 1: // Gradient of u_2 = [du_2/dx, du_2/dy]
          {
            return_gradient[0] = ...
            return_gradient[1] = ...
            break;
          }
        case 2: // Gradient of p = [dp/dx, dp/dy]
          {
            return_gradient[0] = ...
            return_gradient[1] = ...
            break;
          }
      }
    return return_gradient;
  }

  virtual void vector_value(const dealii::Point<dim> &p,
          dealii::Vector<double> &values) const override{
      Assert(values.size() == dim+1,
              dealii::ExcDimensionMismatch(values.size(),dim+1));
      for (unsigned int i=0; i < this->n_components; i++){
        values(i) = value(p,i);
      }
  }
};


template <int dim>
class RightHandSide : public dealii::TensorFunction<1, dim>
{
public:
  RightHandSide()
    : dealii::TensorFunction<1, dim>() {}

  virtual dealii::Tensor<1, dim> value(const dealii::Point<dim> &p) const override
  {
    Assert(dim == 2, dealii::StandardExceptions::ExcNotImplemented());
    const double x = p[0];
    const double y = p[1];
 
    dealii::Tensor<1, dim> f_val;

    f_val[0] =...;
    f_val[1] = ...;

    return f_val;
  }

  virtual void value_list(const std::vector<dealii::Point<dim>> &points,
                          std::vector<dealii::Tensor<1, dim>>   &values) const override
  {
    Assert(points.size() == values.size(),
           dealii::ExcDimensionMismatch(points.size(), values.size()));

    for (unsigned int i = 0; i < points.size(); ++i)
      {
        values[i] = value(points[i]);
      }
  }
};
```


### setup system

需要注意的是:
* 需要分别指定 $\vec{u}$ 和 $p$ 的 Dirichlet BC, 这一步是通过 `dealii::FEValuesExtractors::Vector` 实现的
* 单独为空间中一个点的 $p$ 设置 Dirichlet BC 还是比较麻烦的, 可以参考代码注释

```cpp
template <int dim>
void LinearSteadyStokesSolver<dim>::setup_system()
{
  const dealii::Point<2> p1(0., -0.25);
  const dealii::Point<2> p2(1.0, 0.);

  unsigned int               mx     = 1.0 / h_;
  unsigned int               my     = 0.25 / h_;
  const std::vector<unsigned int> ncells = {mx, my};
  dealii::GridGenerator::subdivided_hyper_rectangle(triangulation,
                                                    ncells,
                                                    p1,
                                                    p2);

  dof_handler.distribute_dofs(fe);

  
  // Step 1: Initialize constraints and apply all boundary conditions
  // using the default, interleaved DoF numbering.
  constraints.clear();
  dealii::DoFTools::make_hanging_node_constraints(dof_handler, constraints);

  // Apply velocity Dirichlet BCs
  // 定义名为 velocities 的提取器 (extractor) 对象
  // 告诉 FEValues 如何从一个包含多个变量的FESystem 中，只提取特定的vector
  // 0 代表该 vector 的分量是 0~dim-1, 从 0 开始
  const dealii::FEValuesExtractors::Vector velocities(0);
  dealii::VectorTools::interpolate_boundary_values(dof_handler,
                                                   0,
                                                   AnalyticalSolution<dim>(),
                                                   constraints,
                                                   fe.component_mask(velocities));

  // Apply pressure pin
  const dealii::FEValuesExtractors::Scalar pressure(dim);
  const dealii::ComponentMask pressure_mask = fe.component_mask(pressure);
  const dealii::IndexSet pressure_dofs =
    dealii::DoFTools::extract_dofs(dof_handler, pressure_mask);
  const dealii::types::global_dof_index first_pressure_dof =
    *pressure_dofs.begin();
  // add_line 表示添加一个新的约束
  // 所有对自由度 i 的约束都形如: x_i = sum_{j!=i} (a_j * x_j) + b
  // 其中 b 对应于非齐次项, j 代表别的自由度
  constraints.add_line(first_pressure_dof);
  // 1. 创建一个标准的单元格到真实空间的映射 (MappingQ1)
  const dealii::MappingQ1<dim> mapping;
  // 2. 创建一个向量来存储所有自由度的坐标
  std::vector<dealii::Point<dim>> dof_locations(dof_handler.n_dofs());
  
  // 3. 使用 DoFTools 中的核心函数来计算并填充这个坐标向量
  dealii::DoFTools::map_dofs_to_support_points(mapping,
                                              dof_handler,
                                              dof_locations);
  // 4. 从向量中通过索引获取我们需要的特定自由度的坐标
  const dealii::Point<dim> p_dof_location = dof_locations[first_pressure_dof];
  // 5. 计算在该点的精确压力值
  const double p_value_at_node =
    AnalyticalSolution<dim>().value(p_dof_location, dim);
  // 6. 将约束的不均匀项设置为计算出的精确值
  constraints.set_inhomogeneity(first_pressure_dof, p_value_at_node);
  
  constraints.close();

  std::cout << "   Number of DoFs: " << dof_handler.n_dofs() << std::endl;
  
  dealii::DynamicSparsityPattern dsp(dof_handler.n_dofs(),
                                     dof_handler.n_dofs());
  dealii::DoFTools::make_sparsity_pattern(dof_handler,
                                          dsp,
                                          constraints,
                                          /*keep_constrained_dofs = */ false);
  sparsity_pattern.copy_from(dsp);

  system_matrix.reinit(sparsity_pattern);
  solution.reinit(dof_handler.n_dofs());
  system_rhs.reinit(dof_handler.n_dofs());
}
```


### 矩阵组装

```cpp
template <int dim>
void LinearSteadyStokesSolver<dim>::assemble_system(){

    dealii::QGauss<dim> quadrature_formula(pd_ + 2);

    dealii::FEValues<dim> fe_values(fe,
                quadrature_formula,
                dealii::update_values | dealii::update_quadrature_points |
                dealii::update_JxW_values | dealii::update_gradients);

  const unsigned int dofs_per_cell = fe.n_dofs_per_cell();
  const unsigned int n_q_points    = quadrature_formula.size();

  dealii::FullMatrix<double> local_matrix(dofs_per_cell, dofs_per_cell);
  dealii::Vector<double>     local_rhs(dofs_per_cell);

  std::vector<dealii::types::global_dof_index> local_dof_indices(dofs_per_cell);

  const RightHandSide<dim>          right_hand_side;
  std::vector<dealii::Tensor<1, dim>>    rhs_values(n_q_points);

  const dealii::FEValuesExtractors::Vector velocities(0);
  const dealii::FEValuesExtractors::Scalar pressure(dim);

  // Pre-calculate shape function values/gradients at quadrature points for efficiency, as done in step-22.
  // 2 is for rank, dim is for dim
  std::vector<dealii::SymmetricTensor<2, dim>> symgrad_phi_u(dofs_per_cell);
  std::vector<double>                  div_phi_u(dofs_per_cell);
  std::vector<double>                  phi_p(dofs_per_cell);
  std::vector<dealii::Tensor<1, dim>>          phi_u(dofs_per_cell);

  for (const auto &cell : dof_handler.active_cell_iterators()){
      fe_values.reinit(cell);
      local_matrix = 0;
      local_rhs    = 0;

      right_hand_side.value_list(fe_values.get_quadrature_points(),
                                 rhs_values);

      for (unsigned int q = 0; q < n_q_points; ++q){
          for (unsigned int k = 0; k < dofs_per_cell; ++k){
            // 0.5 * (nabla phi + nabla phi^T)
              symgrad_phi_u[k] = fe_values[velocities].symmetric_gradient(k, q);
              // div(phi_k)
              div_phi_u[k]     = fe_values[velocities].divergence(k, q);
              phi_p[k]         = fe_values[pressure].value(k, q);
              // phi_k
              phi_u[k]         = fe_values[velocities].value(k, q);
            }

          for (unsigned int i = 0; i < dofs_per_cell; ++i)
            {
              for (unsigned int j = 0; j < dofs_per_cell; ++j)
                {
                  // This is the implementation of the weak form:
                  // (2* ε(v_h):ε(u_h)) - (div(v_h), p_h) - (q_h, div(u_h))
                  local_matrix(i, j) +=
                    (
                     // Term 1: (2*ε(phi_i_u):ε(phi_j_u))
                     2 * (symgrad_phi_u[i] * symgrad_phi_u[j])
                     // Term 2: -(div(phi_i_u), phi_j_p)
                     - div_phi_u[i] * phi_p[j]
                     // Term 3: -(phi_i_p, div(phi_j_u))
                     - phi_p[i] * div_phi_u[j]
                     ) * fe_values.JxW(q);
                }
              // Right hand side: (v, f)
              local_rhs(i) += (phi_u[i] * rhs_values[q]) * fe_values.JxW(q);
            }
      }

      cell->get_dof_indices(local_dof_indices);
      constraints.distribute_local_to_global(local_matrix,
                                             local_rhs,
                                             local_dof_indices,
                                             system_matrix,
                                             system_rhs);
  }
}
```



## 测试结果

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250825/image.4ub9n8eota.webp){width=400px}


![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250825/image.26ltcvn158.webp){width=400px}


## 全部代码

```cpp
#include <deal.II/base/quadrature_lib.h>
#include <deal.II/base/function.h>
#include <deal.II/base/tensor.h>

#include <deal.II/lac/vector.h>
#include <deal.II/lac/full_matrix.h>
#include <deal.II/lac/sparse_matrix.h>
#include <deal.II/lac/dynamic_sparsity_pattern.h>
#include <deal.II/lac/solver_cg.h>
#include <deal.II/lac/precondition.h>
#include <deal.II/lac/affine_constraints.h>
#include <deal.II/lac/sparse_direct.h>
#include <deal.II/grid/grid_tools.h>

#include <deal.II/grid/tria.h>
#include <deal.II/grid/grid_generator.h>
#include <deal.II/grid/grid_refinement.h>

#include <deal.II/dofs/dof_handler.h>
#include <deal.II/dofs/dof_tools.h>

#include <deal.II/fe/fe_values.h>

#include <deal.II/numerics/vector_tools.h>
#include <deal.II/numerics/matrix_tools.h>
#include <deal.II/numerics/data_out.h>
#include <deal.II/numerics/error_estimator.h>


#include <deal.II/base/timer.h>
#include <deal.II/base/tensor_function.h>
#include <deal.II/dofs/dof_renumbering.h>
#include <deal.II/lac/solver_minres.h>
#include <deal.II/lac/sparse_ilu.h>


#include <deal.II/fe/fe_system.h>
#include <deal.II/fe/fe_q.h>
#include <fstream>
#include <iostream>

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
class AnalyticalSolution : public dealii::Function<dim> {
public:
  // 问题是 dim 维度的, this->n_components=dim +１
  AnalyticalSolution()
    : dealii::Function<dim>(dim + 1) {}

  virtual double value(const dealii::Point<dim> &p,
                       const unsigned int component = 0) const override{
    // exception: component 的值超出了 [0, n_components) 这个有效范围
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

    // Tensor<rank, dim>, rank=0->scalar, rank=1->vector
    // 计算单个分量的梯度
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
              dealii::ExcDimensionMismatch(values.size(),dim+1));
      for (unsigned int i=0; i < this->n_components; i++){
        values(i) = value(p,i);
      }
  }
};



template <int dim>
class RightHandSide : public dealii::TensorFunction<1, dim>
{
public:
  RightHandSide()
    : dealii::TensorFunction<1, dim>() {}

  virtual dealii::Tensor<1, dim> value(const dealii::Point<dim> &p) const override
  {
    Assert(dim == 2, dealii::StandardExceptions::ExcNotImplemented());
    const double x = p[0];
    const double y = p[1];
    const double nu = 1.0;

    dealii::Tensor<1, dim> f_val;

    f_val[0] = -nu * (2 * x * x + 2 * y * y + std::exp(-y)) + dealii::numbers::PI *
           dealii::numbers::PI * std::cos(dealii::numbers::PI * x) * std::cos(2 * dealii::numbers::PI * y);

    f_val[1] = 4.0 * nu * x * y -
               nu * std::pow(dealii::numbers::PI, 3.0) *
                 std::sin(dealii::numbers::PI * x) +
               2.0 * dealii::numbers::PI *
                 (2.0 - dealii::numbers::PI * std::sin(dealii::numbers::PI * x)) *
                 std::sin(2.0 * dealii::numbers::PI * y);

    return f_val;
  }

  virtual void value_list(const std::vector<dealii::Point<dim>> &points,
                          std::vector<dealii::Tensor<1, dim>>   &values) const override
  {
    Assert(points.size() == values.size(),
           dealii::ExcDimensionMismatch(points.size(), values.size()));

    for (unsigned int i = 0; i < points.size(); ++i)
      {
        values[i] = value(points[i]);
      }
  }
};



template <int dim>
LinearSteadyStokesSolver<dim>::LinearSteadyStokesSolver(const unsigned int pd, double h)
  : pd_(pd), h_(h)
  , dof_handler(triangulation)
  , fe(dealii::FE_Q<dim>(pd_ + 1) ^ dim, dealii::FE_Q<dim>(pd_))
{}


template <int dim>
void LinearSteadyStokesSolver<dim>::setup_system()
{
  const dealii::Point<2> p1(0., -0.25);
  const dealii::Point<2> p2(1.0, 0.);

  unsigned int               mx     = 1.0 / h_;
  unsigned int               my     = 0.25 / h_;
  const std::vector<unsigned int> ncells = {mx, my};
  dealii::GridGenerator::subdivided_hyper_rectangle(triangulation,
                                                    ncells,
                                                    p1,
                                                    p2);

  dof_handler.distribute_dofs(fe);

  
  // Step 1: Initialize constraints and apply all boundary conditions
  // using the default, interleaved DoF numbering.
  constraints.clear();
  dealii::DoFTools::make_hanging_node_constraints(dof_handler, constraints);

  // Apply velocity Dirichlet BCs
  // 定义名为 velocities 的提取器 (extractor) 对象
  // 告诉 FEValues 如何从一个包含多个变量的FESystem 中，只提取特定的vector
  // 0 代表该 vector 的分量是 0~dim-1, 从 0 开始
  const dealii::FEValuesExtractors::Vector velocities(0);
  dealii::VectorTools::interpolate_boundary_values(dof_handler,
                                                   0,
                                                   AnalyticalSolution<dim>(),
                                                   constraints,
                                                   fe.component_mask(velocities));

  // Apply pressure pin
  const dealii::FEValuesExtractors::Scalar pressure(dim);
  const dealii::ComponentMask pressure_mask = fe.component_mask(pressure);
  const dealii::IndexSet pressure_dofs =
    dealii::DoFTools::extract_dofs(dof_handler, pressure_mask);
  const dealii::types::global_dof_index first_pressure_dof =
    *pressure_dofs.begin();
  // add_line 表示添加一个新的约束
  // 所有对自由度 i 的约束都形如: x_i = sum_{j!=i} (a_j * x_j) + b
  // 其中 b 对应于非齐次项, j 代表别的自由度
  constraints.add_line(first_pressure_dof);
  // 1. 创建一个标准的单元格到真实空间的映射 (MappingQ1)
  const dealii::MappingQ1<dim> mapping;
  // 2. 创建一个向量来存储所有自由度的坐标
  std::vector<dealii::Point<dim>> dof_locations(dof_handler.n_dofs());
  
  // 3. 使用 DoFTools 中的核心函数来计算并填充这个坐标向量
  dealii::DoFTools::map_dofs_to_support_points(mapping,
                                              dof_handler,
                                              dof_locations);
  // 4. 从向量中通过索引获取我们需要的特定自由度的坐标
  const dealii::Point<dim> p_dof_location = dof_locations[first_pressure_dof];
  // 5. 计算在该点的精确压力值
  const double p_value_at_node =
    AnalyticalSolution<dim>().value(p_dof_location, dim);
  // 6. 将约束的不均匀项设置为计算出的精确值
  constraints.set_inhomogeneity(first_pressure_dof, p_value_at_node);
  
  constraints.close();

  std::cout << "   Number of DoFs: " << dof_handler.n_dofs() << std::endl;
  
  dealii::DynamicSparsityPattern dsp(dof_handler.n_dofs(),
                                     dof_handler.n_dofs());
  dealii::DoFTools::make_sparsity_pattern(dof_handler,
                                          dsp,
                                          constraints,
                                          /*keep_constrained_dofs = */ false);
  sparsity_pattern.copy_from(dsp);

  system_matrix.reinit(sparsity_pattern);
  solution.reinit(dof_handler.n_dofs());
  system_rhs.reinit(dof_handler.n_dofs());
}




template <int dim>
void LinearSteadyStokesSolver<dim>::assemble_system(){

    dealii::QGauss<dim> quadrature_formula(pd_ + 2);

    dealii::FEValues<dim> fe_values(fe,
                quadrature_formula,
                dealii::update_values | dealii::update_quadrature_points |
                dealii::update_JxW_values | dealii::update_gradients);

  const unsigned int dofs_per_cell = fe.n_dofs_per_cell();
  const unsigned int n_q_points    = quadrature_formula.size();

  dealii::FullMatrix<double> local_matrix(dofs_per_cell, dofs_per_cell);
  dealii::Vector<double>     local_rhs(dofs_per_cell);

  std::vector<dealii::types::global_dof_index> local_dof_indices(dofs_per_cell);

  const RightHandSide<dim>          right_hand_side;
  std::vector<dealii::Tensor<1, dim>>    rhs_values(n_q_points);

  const dealii::FEValuesExtractors::Vector velocities(0);
  const dealii::FEValuesExtractors::Scalar pressure(dim);

  // Pre-calculate shape function values/gradients at quadrature points for efficiency, as done in step-22.
  // 2 is for rank, dim is for dim
  std::vector<dealii::SymmetricTensor<2, dim>> symgrad_phi_u(dofs_per_cell);
  std::vector<double>                  div_phi_u(dofs_per_cell);
  std::vector<double>                  phi_p(dofs_per_cell);
  std::vector<dealii::Tensor<1, dim>>          phi_u(dofs_per_cell);

  for (const auto &cell : dof_handler.active_cell_iterators()){
      fe_values.reinit(cell);
      local_matrix = 0;
      local_rhs    = 0;

      right_hand_side.value_list(fe_values.get_quadrature_points(),
                                 rhs_values);

      for (unsigned int q = 0; q < n_q_points; ++q){
          for (unsigned int k = 0; k < dofs_per_cell; ++k){
            // 0.5 * (nabla phi + nabla phi^T)
              symgrad_phi_u[k] = fe_values[velocities].symmetric_gradient(k, q);
              // div(phi_k)
              div_phi_u[k]     = fe_values[velocities].divergence(k, q);
              phi_p[k]         = fe_values[pressure].value(k, q);
              // phi_k
              phi_u[k]         = fe_values[velocities].value(k, q);
            }

          for (unsigned int i = 0; i < dofs_per_cell; ++i)
            {
              for (unsigned int j = 0; j < dofs_per_cell; ++j)
                {
                  // This is the implementation of the weak form:
                  // (2* ε(v_h):ε(u_h)) - (div(v_h), p_h) - (q_h, div(u_h))
                  local_matrix(i, j) +=
                    (
                     // Term 1: (2*ε(phi_i_u):ε(phi_j_u))
                     2 * (symgrad_phi_u[i] * symgrad_phi_u[j])
                     // Term 2: -(div(phi_i_u), phi_j_p)
                     - div_phi_u[i] * phi_p[j]
                     // Term 3: -(phi_i_p, div(phi_j_u))
                     - phi_p[i] * div_phi_u[j]
                     ) * fe_values.JxW(q);
                }
              // Right hand side: (v, f)
              local_rhs(i) += (phi_u[i] * rhs_values[q]) * fe_values.JxW(q);
            }
      }

      cell->get_dof_indices(local_dof_indices);
      constraints.distribute_local_to_global(local_matrix,
                                             local_rhs,
                                             local_dof_indices,
                                             system_matrix,
                                             system_rhs);
  }
}


template <int dim>
void LinearSteadyStokesSolver<dim>::solve()
{
  std::cout << "   Solving with direct solver..." << std::flush;
  dealii::Timer timer;
  timer.start();

  dealii::SparseDirectUMFPACK direct_solver;
  solution = system_rhs;
  direct_solver.solve(system_matrix, solution);
 
  constraints.distribute(solution);

  timer.stop();
  std::cout << " done in " << timer.wall_time() << "s." << std::endl;

  
}



// template <int dim>
// void LinearSteadyStokesSolver<dim>::solve()
// {
//   std::cout << "   Solving with direct solver..." << std::flush;
//   dealii::Timer timer;
//   timer.start();
// 
//   // Use a direct solver, which is equivalent to MATLAB's A \ b.
//   // This is efficient for 2D problems.
//   dealii::SparseDirectUMFPACK direct_solver;
//   direct_solver.initialize(system_matrix);
//   direct_solver.solve(system_rhs);
//   
//   // The solution is now in system_rhs, so copy it to the solution vector.
//   solution = system_rhs;
// 
//   timer.stop();
// 
//   // Distribute constraints (e.g., hanging nodes if any were present)
//   constraints.distribute(solution);
// 
//   std::cout << " done in " << timer.wall_time() << "s." << std::endl;
// }

// template <int dim>
// void LinearSteadyStokesSolver<dim>::solve()
// {
//     
//     // dealii::SparseILU<double> preconditioner;
//     // dealii::PreconditionSSOR<> preconditioner;
//     // preconditioner.initialize(system_matrix,1.2);
// 
//     // 2. 设置求解器控制器 (Solver Control)
//     dealii::SolverControl solver_control(6000, 1.e-12);
// 
//     dealii::SolverMinRes<dealii::Vector<double>> minres(solver_control);
// 
//     solution = 0;
//     
//     dealii::Timer timer;
//     timer.start();
// 
//     // minres.solve(system_matrix, solution, system_rhs, preconditioner);
//     minres.solve(system_matrix, solution, system_rhs, dealii::PreconditionIdentity());
// 
//     timer.stop();
// 
//     // 5. 分配约束
//     constraints.distribute(solution);
//     
//     std::cout << " done in " << timer.wall_time() << "s." << std::endl;
//     std::cout << "      MINRES converged in " << solver_control.last_step() 
//               << " iterations." << std::endl;
// }


template <int dim>
void LinearSteadyStokesSolver<dim>::output_results() const
{
  // This part is correct
  std::vector<std::string> solution_names(dim, "velocity");
  solution_names.emplace_back("pressure");

  std::vector<dealii::DataComponentInterpretation::DataComponentInterpretation>
    data_component_interpretation(
      dim, dealii::DataComponentInterpretation::component_is_part_of_vector);
  data_component_interpretation.push_back(
    dealii::DataComponentInterpretation::component_is_scalar);

  dealii::DataOut<dim> data_out;
  data_out.attach_dof_handler(dof_handler);

  data_out.add_data_vector(solution,
                           solution_names,
                           dealii::DataOut<dim>::type_dof_data,
                           data_component_interpretation);

  data_out.build_patches();
  std::ofstream output("solution.vtk");
  data_out.write_vtk(output);
}



template <int dim>
void LinearSteadyStokesSolver<dim>::compute_errors() const
{
  const dealii::ComponentSelectFunction<dim> pressure_mask(dim, dim + 1);
  const dealii::ComponentSelectFunction<dim> velocity_mask(std::make_pair(0, dim),
                                                           dim + 1);

  const AnalyticalSolution<dim> exact_solution;
  const dealii::QGauss<dim> quadrature(pd_ + 2);

  // Step 1: Compute a vector of errors, with one entry per cell.
  dealii::Vector<double> per_cell_errors(triangulation.n_active_cells());

  // L2 error for velocity
  dealii::VectorTools::integrate_difference(dof_handler,
                                            solution,
                                            exact_solution,
                                            per_cell_errors,
                                            quadrature,
                                            dealii::VectorTools::L2_norm,
                                            &velocity_mask);
  // Step 2: Combine the per-cell errors into a global L2 norm.
  const double u_l2_error =
    dealii::VectorTools::compute_global_error(triangulation,
                                              per_cell_errors,
                                              dealii::VectorTools::L2_norm);

  // H1 error for velocity
  dealii::VectorTools::integrate_difference(dof_handler,
                                            solution,
                                            exact_solution,
                                            per_cell_errors,
                                            quadrature,
                                            dealii::VectorTools::H1_seminorm,
                                            &velocity_mask);
  const double u_h1_error =
    dealii::VectorTools::compute_global_error(triangulation,
                                              per_cell_errors,
                                              dealii::VectorTools::H1_seminorm);
  
  // L2 error for pressure
  dealii::VectorTools::integrate_difference(dof_handler,
                                            solution,
                                            exact_solution,
                                            per_cell_errors,
                                            quadrature,
                                            dealii::VectorTools::L2_norm,
                                            &pressure_mask);
  const double p_l2_error =
    dealii::VectorTools::compute_global_error(triangulation,
                                              per_cell_errors,
                                              dealii::VectorTools::L2_norm);

  // H1 error for pressure
  dealii::VectorTools::integrate_difference(dof_handler,
                                            solution,
                                            exact_solution,
                                            per_cell_errors,
                                            quadrature,
                                            dealii::VectorTools::H1_seminorm,
                                            &pressure_mask);
  const double p_h1_error =
    dealii::VectorTools::compute_global_error(triangulation,
                                              per_cell_errors,
                                              dealii::VectorTools::H1_seminorm);


    // 1. 创建一个向量来存储精确解在所有节点上的值
  dealii::Vector<double> exact_solution_at_nodes(dof_handler.n_dofs());
  dealii::VectorTools::interpolate(dof_handler,
                                   exact_solution,
                                   exact_solution_at_nodes);

  double u_linf_error = 0.0;
  double p_linf_error = 0.0;
  // 创建一个标记，避免重复计算同一个自由度的误差
  std::vector<bool> dof_is_processed(dof_handler.n_dofs(), false);
  
  // 2. 遍历所有单元格
  std::vector<dealii::types::global_dof_index> local_dof_indices(fe.dofs_per_cell);
  for (const auto &cell : dof_handler.active_cell_iterators())
    {
      // 3. 获取当前单元格上所有自由度的全局索引
      cell->get_dof_indices(local_dof_indices);

      // 4. 遍历当前单元格上的所有局部自由度 (从 0 到 dofs_per_cell-1)
      for (unsigned int j = 0; j < fe.dofs_per_cell; ++j)
        {
          const dealii::types::global_dof_index global_dof_index = local_dof_indices[j];

          // 如果这个全局自由度已经处理过，则跳过
          if (dof_is_processed[global_dof_index])
            continue;
          
          dof_is_processed[global_dof_index] = true;

          // 5. 使用 *局部索引 j* 来获取它对应的分量 (速度或压力)
          // 这是修正之前错误的关键点
          const unsigned int component_index = fe.system_to_component_index(j).first;

          const double error =
            std::abs(exact_solution_at_nodes(global_dof_index) - solution(global_dof_index));

          // 6. 根据分量类型，更新对应的无穷范数误差
          if (component_index < dim) // 是速度分量
            {
              u_linf_error = std::max(u_linf_error, error);
            }
          else // 是压力分量
            {
              p_linf_error = std::max(p_linf_error, error);
            }
        }
    }

  // --- Output ---

  std::cout << "\nErrors:\n"
          << "  ||u - u_h||_Linf = " << u_linf_error << '\n' // Added line
          << "  ||u - u_h||_L2 = " << u_l2_error << '\n'
          << "  ||u - u_h||_H1 = " << u_h1_error << '\n'
          << "  ||p - p_h||_Linf = " << p_linf_error << '\n' // Added line
          << "  ||p - p_h||_L2 = " << p_l2_error << '\n'
          << "  ||p - p_h||_H1 = " << p_h1_error << '\n'
          << std::endl;
}




template <int dim>
void LinearSteadyStokesSolver<dim>::run()
{
  setup_system();
  assemble_system();
  solve();
  output_results();
  compute_errors();
}


int main()
{
  try
    {
      const int dim = 2;
      const unsigned int pd = 1;
      const double       h  = 1.0/64.0; 

      LinearSteadyStokesSolver<dim> stokes_problem(pd,h);
      std::cout << "h = " << h << ", pd(u) = " << pd+1 <<
          "pd(p) = " << pd << std::endl;
      stokes_problem.run();
    }
  catch (std::exception &exc)
    {
      std::cerr << std::endl
                << std::endl
                << "----------------------------------------------------"
                << std::endl;
      std::cerr << "Exception on processing: " << std::endl
                << exc.what() << std::endl
                << "Aborting!" << std::endl
                << "----------------------------------------------------"
                << std::endl;
      return 1;
    }
  catch (...)
    {
      std::cerr << std::endl
                << std::endl
                << "----------------------------------------------------"
                << std::endl;
      std::cerr << "Unknown exception!" << std::endl
                << "Aborting!" << std::endl
                << "----------------------------------------------------"
                << std::endl;
      return 1;
    }

  return 0;
}
```


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEyNDIzMTE0MDksLTE1MTUxMjI2MTcsLT
E5NDU5ODAwNDMsMTE5MTM4OTg4OCwtMjE0MDc3NDgzMCwtMjA4
NjQ4MDIzMSwxNTI5MTYyLC0xODE3MzE3OTc2LDEzNTE1NTQ0NT
gsOTYyMDkzODIwLDEwNTg4NzI2NjIsMTcxOTQ5MzU0NywtMTAx
Mjg5MzY2NCwtMTk4NTkyMDI4NCw5MDA3NTUyMTUsLTE0ODU0Nz
c4MjksNzQwNjQzMTE2LDEzMDkyNjk5NTIsLTkzNjUxMjIzNSwt
MzY2MzY1MDM0XX0=
-->