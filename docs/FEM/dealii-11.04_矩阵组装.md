# dealii-11.04_矩阵组装

- `ConservationLaw` 类：实现守恒律问题的主程序，包括系统设置、装配系统、求解、网格细化、自适应调整、结果输出等核心功能。

`ConservationLaw` 的写法使得我们可以相对容易地将其改为适用于另一组方程：只需为其他双曲方程重新实现 `EulerEquations` 类的成员，或者通过添加新的方程（例如对额外变量的输运，或者加入化学反应等）来扩展当前方程即可。然而，这样的修改不会影响时间步进或非线性求解（只要实现正确），因此也无需修改 `ConservationLaw` 中的任何内容。


____


```cpp
  template <int dim>
  class ConservationLaw
  {
  public:
    ConservationLaw(const char *input_filename);
    void run();

 private:
    // 配置稀疏矩阵的结构：建立 DoFHandler 上的稀疏模式并初始化 system_matrix
    void setup_system();                                                           

    // 组装全局离散系统，包括单元贡献和面贡献
    void assemble_system();                                               

    // 组装单个单元（cell）的体积分项
    // - fe_v: 用于获取该单元的形函数值、梯度和 JxW
    // - dofs: 该单元对应的自由度全局编号列表
    void assemble_cell_term(const FEValues<dim>                        &fe_v,
                            const std::vector<types::global_dof_index> &dofs);       

    // 组装单元面的贡献
    // - face_no: 面编号
    // - fe_v: 本单元面上的 FEValues
    // - fe_v_neighbor: 邻居单元面上的 FEValues（若为内部面）
    // - dofs / dofs_neighbor: 本单元和邻居单元对应的自由度列表
    // - external_face: 是否为边界面
    // - boundary_id: 边界面的边界条件编号
    // - face_diameter: 面的特征尺寸（用于网格依赖的稳定化）
    void assemble_face_term(
      const unsigned int                          face_no,
      const FEFaceValuesBase<dim>                &fe_v,
      const FEFaceValuesBase<dim>                &fe_v_neighbor,
      const std::vector<types::global_dof_index> &dofs,
      const std::vector<types::global_dof_index> &dofs_neighbor,
      const bool                                  external_face,
      const unsigned int                          boundary_id,
      const double                                face_diameter);                

    // 求解线性/非线性系统：返回 {线性迭代次数, 最终残差}
    std::pair<unsigned int, double> solve(Vector<double> &solution);             

    // 根据当前解（predictor）计算每个单元的自适应细化指标
    void compute_refinement_indicators(Vector<double> &indicator) const;          

    // 根据细化指标在网格上执行细化或粗化，并插值传递旧解
    void refine_grid(const Vector<double> &indicator);                              

    // 将当前解输出为 VTK 文件，便于后处理与可视化
    void output_results() const;                                                  

    // -------------------- 核心数据成员 --------------------

    Triangulation<dim>   triangulation;     // 存储并管理计算区域的网格拓扑和几何
    const MappingQ1<dim> mapping;           // 线性映射，用于将参考单元映射到实际单元

    const FESystem<dim> fe;                 // 由多个标量 FE_Q 组成的混合有限元空间
    DoFHandler<dim>     dof_handler;        // 管理全局自由度的分配和约束

    const QGauss<dim>     quadrature;       // 体积分的 Gauss 点规则（degree+1 点）
    const QGauss<dim - 1> face_quadrature;  // 面积分的 Gauss 点规则（degree+1 点）

    Vector<double> old_solution;            // 上一个时间步的解，作为“旧”解用于时间推进
    Vector<double> current_solution;        // 当前迭代中的解
    Vector<double> predictor;               // 时间推进的预测值，用于二阶时间离散（BDF2 等）

    Vector<double> right_hand_side;         // 全局残差向量或右端项

    TrilinosWrappers::SparseMatrix system_matrix;  // 存储线性系统系数矩阵的稀疏矩阵

    Parameters::AllParameters<dim> parameters;     // 封装所有控制参数（网格、求解器、边界、输出等）
    ConditionalOStream             verbose_cout;   // 根据 parameters.output 控制日志打印开关

  };

template <int dim>
ConservationLaw<dim>::ConservationLaw(const char *input_filename)
  : mapping()                                                      // 默认构造 MappingQ1<dim>，用于在参考单元与实际网格单元之间做线性映射 =
  , fe(FE_Q<dim>(1) ^ EulerEquations<dim>::n_components)          // 构造一个系统有限元：在标量 Q1 元素的基础上重复 n_components 次，生成 FESystem<dim> 
  , dof_handler(triangulation)                                     // 将 DoFHandler 与 Triangulation 关联，用于后续自由度的分配和管理
  , quadrature(fe.degree + 1)                                      // 根据 fe 的多项式阶数 degree 初始化 Gauss 积分，积分点数为 degree+1 
  , face_quadrature(fe.degree + 1)                                 // 同理初始化面（边）积分规则 
  , verbose_cout(std::cout, false)                                 // 条件输出流，初始设为 false（即不打印），后续可根据参数打开
{
  ParameterHandler prm;                                            // 声明一个 ParameterHandler，用于读取和管理输入文件中的参数 
  Parameters::AllParameters<dim>::declare_parameters(prm);        // 注册（声明）所有参数项，以便 parse_input 时能识别 

  prm.parse_input(input_filename);                                // 从指定的 input 文件中读取参数 
  parameters.parse_parameters(prm);                               // 将读取到的参数值填充到成员变量 parameters 中

  verbose_cout.set_condition(                                     
    parameters.output == Parameters::Solver::verbose);           // 如果用户在输入文件中指定了 verbose 模式，则启用详细输出
}

template <int dim>
void ConservationLaw<dim>::setup_system()
{
  // 1. 构造一个动态稀疏模式（DynamicSparsityPattern），
  //    尺寸为全局自由度数 × 全局自由度数。
  DynamicSparsityPattern dsp(dof_handler.n_dofs(),
                             dof_handler.n_dofs());

  // 2. 根据 DoFHandler 的耦合关系（哪些自由度在同一个单元上）
  //    填充稀疏模式 dsp。
  DoFTools::make_sparsity_pattern(dof_handler, dsp);

  // 3. 使用已经填充好的稀疏模式重新初始化 TrilinosWrappers::SparseMatrix，
  //    为后续线性系统组装分配存储空间。
  system_matrix.reinit(dsp);
}

template <int dim>
void ConservationLaw<dim>::assemble_system()
{
  // --- 预备工作：获取单元自由度数并分配索引数组 ---
  // 本单元上的自由度个数
  const unsigned int dofs_per_cell =
    dof_handler.get_fe().n_dofs_per_cell();

  // 存放本单元和邻居单元自由度的全局索引
  std::vector<types::global_dof_index> dof_indices(dofs_per_cell);
  std::vector<types::global_dof_index> dof_indices_neighbor(dofs_per_cell);

  // --- 定义 UpdateFlags，用于告诉 FEValues/FEFaceValues 需要哪些更新内容 ---
  // 单元内部积分需要：形函数值、梯度、积分点位置、JxW（权重）
  const UpdateFlags update_flags =
          update_values   |
          update_gradients|
          update_quadrature_points |
          update_JxW_values;
  // 外部面（含边界）还需更新法向量
  const UpdateFlags face_update_flags =
          update_values         |
          update_quadrature_points |
          update_JxW_values     |
          update_normal_vectors;
  // 邻居面只需更新形函数值
  const UpdateFlags neighbor_face_update_flags = update_values;

  // --- 创建各种 FEValues 对象 ---
  // mapping：几何映射；fe：有限元；
  // quadrature：胞内高斯点；face_quadrature：面上高斯点。
  FEValues<dim>        fe_v(mapping, fe, quadrature, update_flags);
  FEFaceValues<dim>    fe_v_face(mapping,
                                 fe,
                                 face_quadrature,
                                 face_update_flags);
  FESubfaceValues<dim> fe_v_subface(mapping,
                                    fe,
                                    face_quadrature,
                                    face_update_flags);
  // 用于内部面时，对应邻居单元的 FEValues
  FEFaceValues<dim>    fe_v_face_neighbor(mapping,
                                          fe,
                                          face_quadrature,
                                          neighbor_face_update_flags);
  FESubfaceValues<dim> fe_v_subface_neighbor(mapping,
                                             fe,
                                             face_quadrature,
                                             neighbor_face_update_flags);

  // --- 遍历所有活动单元，组装整个线性系统 ---
  for (const auto &cell : dof_handler.active_cell_iterators())
  {
    // 1) 单元体项组装
    fe_v.reinit(cell);                  // 初始化 FEValues
    cell->get_dof_indices(dof_indices);// 获取本单元自由度索引
    assemble_cell_term(fe_v, dof_indices);// 组装体项（质量、对流、扩散、源项等）

    // 2) 单元面项组装
    for (const auto face_no : cell->face_indices())
    {
      if (cell->at_boundary(face_no))
      {
        // 边界面：只有本侧积分，external_face = true
        fe_v_face.reinit(cell, face_no);
        assemble_face_term(face_no,
                           fe_v_face,          // 本单元面 FEValues
                           fe_v_face,          // 无邻居，重复传入
                           dof_indices,        // 本单元自由度
                           std::vector<types::global_dof_index>(), // 无邻居自由度
                           true,               // 外部面标志
                           cell->face(face_no)->boundary_id(),     // 边界 ID
                           cell->face(face_no)->diameter());       // 面直径（用于稳定化）
      }
      else
      {
        // 内部面
        if (cell->neighbor(face_no)->has_children())
        {
          // 情况 A：邻居已细化
          const unsigned int neighbor2 =
            cell->neighbor_of_neighbor(face_no);
          for (unsigned int subface_no = 0;
               subface_no < cell->face(face_no)->n_children();
               ++subface_no)
          {
            auto neighbor_child =
              cell->neighbor_child_on_subface(face_no, subface_no);
            // 检查子面一致性
            Assert(neighbor_child->face(neighbor2) ==
                   cell->face(face_no)->child(subface_no),
                   ExcInternalError());
            Assert(neighbor_child->is_active(), ExcInternalError());

            // 本单元子面积分
            fe_v_subface.reinit(cell, face_no, subface_no);
            // 邻居子单元面积分
            fe_v_face_neighbor.reinit(neighbor_child, neighbor2);
            // 获取邻居自由度索引
            neighbor_child->get_dof_indices(dof_indices_neighbor);
            // 组装面项（internal_face = false）
            assemble_face_term(face_no,
                               fe_v_subface,
                               fe_v_face_neighbor,
                               dof_indices,
                               dof_indices_neighbor,
                               false,
                               numbers::invalid_unsigned_int,
                               neighbor_child->face(neighbor2)->diameter());
          }
        }
        else if (cell->neighbor(face_no)->level() != cell->level())
        {
          // 情况 B：邻居为更粗层级
          auto neighbor = cell->neighbor(face_no);
          Assert(neighbor->level() == cell->level() - 1,
                 ExcInternalError());
          neighbor->get_dof_indices(dof_indices_neighbor);
          // 找到粗层级邻居对应的面号和子面号
          auto faceno_subfaceno =
            cell->neighbor_of_coarser_neighbor(face_no);
          const unsigned int neighbor_face_no    = faceno_subfaceno.first,
                             neighbor_subface_no = faceno_subfaceno.second;
          Assert(neighbor->neighbor_child_on_subface(
                   neighbor_face_no, neighbor_subface_no) == cell,
                 ExcInternalError());

          // 本单元完整面积分
          fe_v_face.reinit(cell, face_no);
          // 粗层级邻居子面积分
          fe_v_subface_neighbor.reinit(
            neighbor, neighbor_face_no, neighbor_subface_no);

          // 组装面项
          assemble_face_term(face_no,
                             fe_v_face,
                             fe_v_subface_neighbor,
                             dof_indices,
                             dof_indices_neighbor,
                             false,
                             numbers::invalid_unsigned_int,
                             cell->face(face_no)->diameter());
        }
      }
    } // end for face
  } // end for cell
}

template <int dim>
void ConservationLaw<dim>::assemble_cell_term(
  const FEValues<dim>                        &fe_v,
  const std::vector<types::global_dof_index> &dof_indices)
{
  // --- 1. 准备工作：获取自由度数和积分点数 ---
  const unsigned int dofs_per_cell = fe_v.dofs_per_cell;       // 本单元自由度数量
  const unsigned int n_q_points    = fe_v.n_quadrature_points; // 本单元积分点数量

  // --- 2. 定义在每个积分点存储的物理量（自动微分/标量） ---
  // W, grad_W 使用 Sacado::Fad 以自动得到局部残差对自由度的导数（雅可比）
  Table<2, Sacado::Fad::DFad<double>> W(n_q_points,
                                        EulerEquations<dim>::n_components);
  Table<2, double>                     W_old(n_q_points,
                                              EulerEquations<dim>::n_components);
  Table<3, Sacado::Fad::DFad<double>> grad_W(n_q_points,
                                             EulerEquations<dim>::n_components,
                                             dim);
  Table<3, double> grad_W_old(n_q_points,
                              EulerEquations<dim>::n_components,
                              dim);

  // 用于存放当前残差 R_i 关于本单元所有自由度的导数 ∂R_i/∂U_k
  std::vector<double> residual_derivatives(dofs_per_cell);

  // --- 3. 将当前解值装入自动微分变量 independent_local_dof_values ---
  std::vector<Sacado::Fad::DFad<double>> independent_local_dof_values(dofs_per_cell);
  for (unsigned int i = 0; i < dofs_per_cell; ++i)
    independent_local_dof_values[i] = current_solution(dof_indices[i]);
  // 为 Fad 变量指定哪个分量是独立变量 (0..dofs_per_cell-1)
  for (unsigned int i = 0; i < dofs_per_cell; ++i)
    independent_local_dof_values[i].diff(i, dofs_per_cell);

  // --- 4. 初始化 W, W_old, grad_W, grad_W_old 为零 ---
  for (unsigned int q = 0; q < n_q_points; ++q)
    for (unsigned int c = 0; c < EulerEquations<dim>::n_components; ++c)
    {
      W[q][c]     = 0;
      W_old[q][c] = 0;
      for (unsigned int d = 0; d < dim; ++d)
      {
        grad_W[q][c][d]     = 0;
        grad_W_old[q][c][d] = 0;
      }
    }

  // --- 5. 在积分点处重构数值解 W 和其梯度 grad_W ---
  // 弱形式重构： 
  //   W(q)      = Σ_i φ_i(q) · U_i,
  //   ∇W(q)_d  = Σ_i ∂φ_i/∂x_d (q) · U_i.
  for (unsigned int q = 0; q < n_q_points; ++q)
    for (unsigned int i = 0; i < dofs_per_cell; ++i)
    {
      // 找到自由度 i 对应的方程分量 c
      const unsigned int c =
        fe_v.get_fe().system_to_component_index(i).first;

      // W 和 W_old:
      W[q][c]     += independent_local_dof_values[i]
                       * fe_v.shape_value_component(i, q, c);
      W_old[q][c] += old_solution(dof_indices[i])
                       * fe_v.shape_value_component(i, q, c);

      // grad_W 和 grad_W_old:
      for (unsigned int d = 0; d < dim; ++d)
      {
        grad_W[q][c][d]     += independent_local_dof_values[i]
                                 * fe_v.shape_grad_component(i, q, c)[d];
        grad_W_old[q][c][d] += old_solution(dof_indices[i])
                                 * fe_v.shape_grad_component(i, q, c)[d];
      }
    }

  // --- 6. 计算物理通量 flux 和源项 forcing（当前与旧时刻） ---
  // 对于欧拉方程：∂W/∂t + ∇·F(W) = S(W)
  std::vector<ndarray<Sacado::Fad::DFad<double>,
                      EulerEquations<dim>::n_components, dim>>
    flux(n_q_points);
  std::vector<ndarray<double, EulerEquations<dim>::n_components, dim>>
    flux_old(n_q_points);
  std::vector<std::array<Sacado::Fad::DFad<double>, EulerEquations<dim>::n_components>>
    forcing(n_q_points);
  std::vector<std::array<double, EulerEquations<dim>::n_components>>
    forcing_old(n_q_points);

  for (unsigned int q = 0; q < n_q_points; ++q)
  {
    // 计算 F(W_old), S(W_old)
    EulerEquations<dim>::compute_flux_matrix  (W_old[q], flux_old[q]);
    EulerEquations<dim>::compute_forcing_vector(W_old[q], forcing_old[q]);
    // 计算 F(W),    S(W)
    EulerEquations<dim>::compute_flux_matrix  (W[q],     flux[q]);
    EulerEquations<dim>::compute_forcing_vector(W[q],     forcing[q]);
  }

  // --- 7. 在本单元上对每个局部试函数 φ_i 计算残差 R_i 并组装到全局矩阵/向量 ---
  //
  // R_i = ∫_Ωe (1/Δt)(W - W_old) φ_i dV
  //     − ∫_Ωe ∇φ_i · [θ F(W) + (1−θ) F(W_old)] dV
  //     + ∫_Ωe h^p (θ ∇W + (1−θ)∇W_old) · ∇φ_i dV
  //     − ∫_Ωe [θ S(W) + (1−θ)S(W_old)] φ_i dV
  //
  // 其中 h = cell->diameter(), p = parameters.diffusion_power
  for (unsigned int i = 0; i < dofs_per_cell; ++i)
  {
    // 使用 Fad<double> 累加得到 R_i（包含其对各 U_k 的偏导信息）
    Sacado::Fad::DFad<double> R_i = 0;
    const unsigned int component_i =
      fe_v.get_fe().system_to_component_index(i).first;

    for (unsigned int q = 0; q < n_q_points; ++q)
    {
      const double JxW = fe_v.JxW(q);
      const double h_p = std::pow(fe_v.get_cell()->diameter(),
                                  parameters.diffusion_power);

      // ——— 时间项 ———
      if (!parameters.is_stationary)
        R_i += (1.0 / parameters.time_step)
               * (  W[q][component_i]
                  - W_old[q][component_i] )
               * fe_v.shape_value_component(i, q, component_i)
               * JxW;

      // ——— 对流通量项 ———
      for (unsigned int d = 0; d < dim; ++d)
        R_i -= ( parameters.theta *     flux[q][component_i][d]
                + (1.0 - parameters.theta) * flux_old[q][component_i][d] )
               * fe_v.shape_grad_component(i, q, component_i)[d]
               * JxW; 
        // 对应弱形式中的: −∫ ∇φ_i · F_θ dV

      // ——— 扩散稳定化项 ———
      for (unsigned int d = 0; d < dim; ++d)
        R_i += h_p
               * ( parameters.theta *     grad_W[q][component_i][d]
                 + (1.0 - parameters.theta) * grad_W_old[q][component_i][d] )
               * fe_v.shape_grad_component(i, q, component_i)[d]
               * JxW;
        // 对应: +∫ h^p (θ ∇W + (1−θ) ∇W_old) · ∇φ_i dV

      // ——— 源项 ———
      R_i -= ( parameters.theta *     forcing[q][component_i]
              + (1.0 - parameters.theta) * forcing_old[q][component_i] )
             * fe_v.shape_value_component(i, q, component_i)
             * JxW;
        // 对应: −∫ φ_i S_θ dV
    }

    // 提取 R_i 关于每个独立自由度的偏导数 ∂R_i/∂U_k
    for (unsigned int k = 0; k < dofs_per_cell; ++k)
      residual_derivatives[k] = R_i.fastAccessDx(k);

    // 将雅可比行 residual_derivatives 加入全局稀疏矩阵
    system_matrix.add(dof_indices[i],
                      dof_indices,
                      residual_derivatives);

    // 并将残差值 R_i.val() 积分到右端向量
    right_hand_side(dof_indices[i]) -= R_i.val();
  }
}


  template <int dim>
  void ConservationLaw<dim>::assemble_face_term(
    const unsigned int                          face_no,
    const FEFaceValuesBase<dim>                &fe_v,
    const FEFaceValuesBase<dim>                &fe_v_neighbor,
    const std::vector<types::global_dof_index> &dof_indices,
    const std::vector<types::global_dof_index> &dof_indices_neighbor,
    const bool                                  external_face,
    const unsigned int                          boundary_id,
    const double                                face_diameter)
  {
    const unsigned int n_q_points    = fe_v.n_quadrature_points;
    const unsigned int dofs_per_cell = fe_v.dofs_per_cell;

    std::vector<Sacado::Fad::DFad<double>> independent_local_dof_values(
      dofs_per_cell),
      independent_neighbor_dof_values(external_face == false ? dofs_per_cell :
                                                               0);

    const unsigned int n_independent_variables =
      (external_face == false ? 2 * dofs_per_cell : dofs_per_cell);

    for (unsigned int i = 0; i < dofs_per_cell; ++i)
      {
        independent_local_dof_values[i] = current_solution(dof_indices[i]);
        independent_local_dof_values[i].diff(i, n_independent_variables);
      }

    if (external_face == false)
      for (unsigned int i = 0; i < dofs_per_cell; ++i)
        {
          independent_neighbor_dof_values[i] =
            current_solution(dof_indices_neighbor[i]);
          independent_neighbor_dof_values[i].diff(i + dofs_per_cell,
                                                  n_independent_variables);
        }

    Table<2, Sacado::Fad::DFad<double>> Wplus(
      n_q_points, EulerEquations<dim>::n_components),
      Wminus(n_q_points, EulerEquations<dim>::n_components);
    Table<2, double> Wplus_old(n_q_points, EulerEquations<dim>::n_components),
      Wminus_old(n_q_points, EulerEquations<dim>::n_components);

    for (unsigned int q = 0; q < n_q_points; ++q)
      for (unsigned int i = 0; i < dofs_per_cell; ++i)
        {
          const unsigned int component_i =
            fe_v.get_fe().system_to_component_index(i).first;
          Wplus[q][component_i] +=
            independent_local_dof_values[i] *
            fe_v.shape_value_component(i, q, component_i);
          Wplus_old[q][component_i] +=
            old_solution(dof_indices[i]) *
            fe_v.shape_value_component(i, q, component_i);
        }

    if (external_face == false)
      {
        for (unsigned int q = 0; q < n_q_points; ++q)
          for (unsigned int i = 0; i < dofs_per_cell; ++i)
            {
              const unsigned int component_i =
                fe_v_neighbor.get_fe().system_to_component_index(i).first;
              Wminus[q][component_i] +=
                independent_neighbor_dof_values[i] *
                fe_v_neighbor.shape_value_component(i, q, component_i);
              Wminus_old[q][component_i] +=
                old_solution(dof_indices_neighbor[i]) *
                fe_v_neighbor.shape_value_component(i, q, component_i);
            }
      }
    else
      {
        Assert(boundary_id < Parameters::AllParameters<dim>::max_n_boundaries,
               ExcIndexRange(boundary_id,
                             0,
                             Parameters::AllParameters<dim>::max_n_boundaries));

        std::vector<Vector<double>> boundary_values(
          n_q_points, Vector<double>(EulerEquations<dim>::n_components));
        parameters.boundary_conditions[boundary_id].values.vector_value_list(
          fe_v.get_quadrature_points(), boundary_values);

        for (unsigned int q = 0; q < n_q_points; ++q)
          {
            EulerEquations<dim>::compute_Wminus(
              parameters.boundary_conditions[boundary_id].kind,
              fe_v.normal_vector(q),
              Wplus[q],
              boundary_values[q],
              Wminus[q]);
            EulerEquations<dim>::compute_Wminus(
              parameters.boundary_conditions[boundary_id].kind,
              fe_v.normal_vector(q),
              Wplus_old[q],
              boundary_values[q],
              Wminus_old[q]);
          }
      }

    std::vector<
      std::array<Sacado::Fad::DFad<double>, EulerEquations<dim>::n_components>>
      normal_fluxes(n_q_points);
    std::vector<std::array<double, EulerEquations<dim>::n_components>>
      normal_fluxes_old(n_q_points);

    double alpha;

    switch (parameters.stabilization_kind)
      {
        case Parameters::Flux::constant:
          alpha = parameters.stabilization_value;
          break;
        case Parameters::Flux::mesh_dependent:
          alpha = face_diameter / (2.0 * parameters.time_step);
          break;
        default:
          DEAL_II_NOT_IMPLEMENTED();
          alpha = 1;
      }

    for (unsigned int q = 0; q < n_q_points; ++q)
      {
        EulerEquations<dim>::numerical_normal_flux(
          fe_v.normal_vector(q), Wplus[q], Wminus[q], alpha, normal_fluxes[q]);
        EulerEquations<dim>::numerical_normal_flux(fe_v.normal_vector(q),
                                                   Wplus_old[q],
                                                   Wminus_old[q],
                                                   alpha,
                                                   normal_fluxes_old[q]);
      }

    std::vector<double> residual_derivatives(dofs_per_cell);
    for (unsigned int i = 0; i < fe_v.dofs_per_cell; ++i)
      if (fe_v.get_fe().has_support_on_face(i, face_no) == true)
        {
          Sacado::Fad::DFad<double> R_i = 0;

          for (unsigned int point = 0; point < n_q_points; ++point)
            {
              const unsigned int component_i =
                fe_v.get_fe().system_to_component_index(i).first;

              R_i += (parameters.theta * normal_fluxes[point][component_i] +
                      (1.0 - parameters.theta) *
                        normal_fluxes_old[point][component_i]) *
                     fe_v.shape_value_component(i, point, component_i) *
                     fe_v.JxW(point);
            }

          for (unsigned int k = 0; k < dofs_per_cell; ++k)
            residual_derivatives[k] = R_i.fastAccessDx(k);
          system_matrix.add(dof_indices[i], dof_indices, residual_derivatives);

          if (external_face == false)
            {
              for (unsigned int k = 0; k < dofs_per_cell; ++k)
                residual_derivatives[k] = R_i.fastAccessDx(dofs_per_cell + k);
              system_matrix.add(dof_indices[i],
                                dof_indices_neighbor,
                                residual_derivatives);
            }

          right_hand_side(dof_indices[i]) -= R_i.val();
        }
  }

  template <int dim>
  std::pair<unsigned int, double>
  ConservationLaw<dim>::solve(Vector<double> &newton_update)
  {
    switch (parameters.solver)
      {
        case Parameters::Solver::direct:
          {
            SolverControl                                  solver_control(1, 0);
            TrilinosWrappers::SolverDirect::AdditionalData data(
              parameters.output == Parameters::Solver::verbose);
            TrilinosWrappers::SolverDirect direct(solver_control, data);

            direct.solve(system_matrix, newton_update, right_hand_side);

            return {solver_control.last_step(), solver_control.last_value()};
          }

        case Parameters::Solver::gmres:
          {
            Epetra_Vector x(View,
                            system_matrix.trilinos_matrix().DomainMap(),
                            newton_update.begin());
            Epetra_Vector b(View,
                            system_matrix.trilinos_matrix().RangeMap(),
                            right_hand_side.begin());

            AztecOO solver;
            solver.SetAztecOption(
              AZ_output,
              (parameters.output == Parameters::Solver::quiet ? AZ_none :
                                                                AZ_all));
            solver.SetAztecOption(AZ_solver, AZ_gmres);
            solver.SetRHS(&b);
            solver.SetLHS(&x);

            solver.SetAztecOption(AZ_precond, AZ_dom_decomp);
            solver.SetAztecOption(AZ_subdomain_solve, AZ_ilut);
            solver.SetAztecOption(AZ_overlap, 0);
            solver.SetAztecOption(AZ_reorder, 0);

            solver.SetAztecParam(AZ_drop, parameters.ilut_drop);
            solver.SetAztecParam(AZ_ilut_fill, parameters.ilut_fill);
            solver.SetAztecParam(AZ_athresh, parameters.ilut_atol);
            solver.SetAztecParam(AZ_rthresh, parameters.ilut_rtol);

            solver.SetUserMatrix(
              const_cast<Epetra_CrsMatrix *>(&system_matrix.trilinos_matrix()));

            solver.Iterate(parameters.max_iterations,
                           parameters.linear_residual);

            return {solver.NumIters(), solver.TrueResidual()};
          }
      }

    DEAL_II_NOT_IMPLEMENTED();
    return {0, 0};
  }

  template <int dim>
  void ConservationLaw<dim>::compute_refinement_indicators(
    Vector<double> &refinement_indicators) const
  {
    EulerEquations<dim>::compute_refinement_indicators(dof_handler,
                                                       mapping,
                                                       predictor,
                                                       refinement_indicators);
  }

  template <int dim>
  void
  ConservationLaw<dim>::refine_grid(const Vector<double> &refinement_indicators)
  {
    for (const auto &cell : dof_handler.active_cell_iterators())
      {
        const unsigned int cell_no = cell->active_cell_index();
        cell->clear_coarsen_flag();
        cell->clear_refine_flag();

        if ((cell->level() < parameters.shock_levels) &&
            (std::fabs(refinement_indicators(cell_no)) > parameters.shock_val))
          cell->set_refine_flag();
        else if ((cell->level() > 0) &&
                 (std::fabs(refinement_indicators(cell_no)) <
                  0.75 * parameters.shock_val))
          cell->set_coarsen_flag();
      }

    {
      AffineConstraints<double> hanging_node_constraints;
      DoFTools::make_hanging_node_constraints(dof_handler,
                                              hanging_node_constraints);
      hanging_node_constraints.close();

      hanging_node_constraints.distribute(old_solution);
      hanging_node_constraints.distribute(predictor);
    }

    const std::vector<Vector<double>> transfer_in = {old_solution, predictor};

    triangulation.prepare_coarsening_and_refinement();

    SolutionTransfer<dim> soltrans(dof_handler);
    soltrans.prepare_for_coarsening_and_refinement(transfer_in);

    triangulation.execute_coarsening_and_refinement();

    dof_handler.clear();
    dof_handler.distribute_dofs(fe);

    std::vector<Vector<double>> transfer_out = {
      Vector<double>(dof_handler.n_dofs()),
      Vector<double>(dof_handler.n_dofs())};
    soltrans.interpolate(transfer_in, transfer_out);

    old_solution = std::move(transfer_out[0]);
    predictor    = std::move(transfer_out[1]);

    current_solution.reinit(dof_handler.n_dofs());
    current_solution = old_solution;

    right_hand_side.reinit(dof_handler.n_dofs());
  }

  template <int dim>
  void ConservationLaw<dim>::output_results() const
  {
    typename EulerEquations<dim>::Postprocessor postprocessor(
      parameters.schlieren_plot);

    DataOut<dim> data_out;
    data_out.attach_dof_handler(dof_handler);

    data_out.add_data_vector(current_solution,
                             EulerEquations<dim>::component_names(),
                             DataOut<dim>::type_dof_data,
                             EulerEquations<dim>::component_interpretation());

    data_out.add_data_vector(current_solution, postprocessor);

    data_out.build_patches();

    static unsigned int output_file_number = 0;
    std::string         filename =
      "solution-" + Utilities::int_to_string(output_file_number, 3) + ".vtk";
    std::ofstream output(filename);
    data_out.write_vtk(output);

    ++output_file_number;
  }

  template <int dim>
  void ConservationLaw<dim>::run()
  {
    {
      GridIn<dim> grid_in;
      grid_in.attach_triangulation(triangulation);

      std::ifstream input_file(parameters.mesh_filename);
      Assert(input_file, ExcFileNotOpen(parameters.mesh_filename));

      grid_in.read_ucd(input_file);
    }

    dof_handler.distribute_dofs(fe);

    old_solution.reinit(dof_handler.n_dofs());
    current_solution.reinit(dof_handler.n_dofs());
    predictor.reinit(dof_handler.n_dofs());
    right_hand_side.reinit(dof_handler.n_dofs());

    setup_system();

    VectorTools::interpolate(dof_handler,
                             parameters.initial_conditions,
                             old_solution);
    current_solution = old_solution;
    predictor        = old_solution;

    if (parameters.do_refine == true)
      for (unsigned int i = 0; i < parameters.shock_levels; ++i)
        {
          Vector<double> refinement_indicators(triangulation.n_active_cells());

          compute_refinement_indicators(refinement_indicators);
          refine_grid(refinement_indicators);

          setup_system();

          VectorTools::interpolate(dof_handler,
                                   parameters.initial_conditions,
                                   old_solution);
          current_solution = old_solution;
          predictor        = old_solution;
        }

    output_results();

    Vector<double> newton_update(dof_handler.n_dofs());

    double time        = 0;
    double next_output = time + parameters.output_step;

    predictor = old_solution;
    while (time < parameters.final_time)
      {
        std::cout << "T=" << time << std::endl
                  << "   Number of active cells:       "
                  << triangulation.n_active_cells() << std::endl
                  << "   Number of degrees of freedom: " << dof_handler.n_dofs()
                  << std::endl
                  << std::endl;

        std::cout << "   NonLin Res     Lin Iter       Lin Res" << std::endl
                  << "   _____________________________________" << std::endl;

        unsigned int nonlin_iter = 0;
        current_solution         = predictor;
        while (true)
          {
            system_matrix = 0;

            right_hand_side = 0;
            assemble_system();

            const double res_norm = right_hand_side.l2_norm();
            if (std::fabs(res_norm) < 1e-10)
              {
                std::printf("   %-16.3e (converged)\n\n", res_norm);
                break;
              }
            else
              {
                newton_update = 0;

                std::pair<unsigned int, double> convergence =
                  solve(newton_update);

                current_solution += newton_update;

                std::printf("   %-16.3e %04d        %-5.2e\n",
                            res_norm,
                            convergence.first,
                            convergence.second);
              }

            ++nonlin_iter;
            AssertThrow(nonlin_iter <= 10,
                        ExcMessage("No convergence in nonlinear solver"));
          }

        time += parameters.time_step;

        if (parameters.output_step < 0)
          output_results();
        else if (time >= next_output)
          {
            output_results();
            next_output += parameters.output_step;
          }

        predictor = current_solution;
        predictor.sadd(2.0, -1.0, old_solution);

        old_solution = current_solution;

        if (parameters.do_refine == true)
          {
            Vector<double> refinement_indicators(
              triangulation.n_active_cells());
            compute_refinement_indicators(refinement_indicators);

            refine_grid(refinement_indicators);
            setup_system();

            newton_update.reinit(dof_handler.n_dofs());
          }
      }
  }
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE5ODQ5OTcwMzIsNTc0MzQxNjA2LC0xNj
E3MTAxODcyLDE2NzE3ODU2OTMsLTE4MDg4NDM1MTIsLTE4NzU2
NDU1NjgsODA2NzIwNTkyLDk0NjQzOTc0M119
-->