# dealii-11.02 参数类


## `Parameters` namespace 结构

```mermaid
graph TD
    Parameters --> Solver
    Parameters --> Refinement
    Parameters --> Flux
    Parameters --> Output
    Parameters --> AllParameters

    AllParameters --> Solver
    AllParameters --> Refinement
    AllParameters --> Flux
    AllParameters --> Output
    AllParameters --> BoundaryConditions

    BoundaryConditions --> FunctionParser
    BoundaryConditions --> EulerEquations_BoundaryKind["EulerEquations::BoundaryKind"]

    Solver --> SolverType[enum SolverType: gmres, direct]
    Solver --> OutputType[enum OutputType: quiet, verbose]

    Flux --> StabilizationKind["enum StabilizationKind: constant, mesh_dependent"]

    AllParameters --> InitialConditions["Initial Conditions: FunctionParser"]
    AllParameters --> BoundaryConditionsArray["Boundary Conditions Array[max_n_boundaries]"]

    BoundaryConditionsArray --> BoundaryConditions
```


## `Parameters` namespace 源程序


```cpp
  namespace Parameters
  {
```

* Solver struct

```cpp
    struct Solver
    {
      // 1. 首先, 定义变量类型和变量
      // 2. 调用 declare_parameters(ParameterHandler &prm) 和 parse_parameters(ParameterHandler &prm)
      enum SolverType
      {
        gmres,
        direct
      };
      SolverType solver;

      enum OutputType
      {
        quiet,
        verbose
      };
      OutputType output;

      double linear_residual;
      int    max_iterations;

      double ilut_fill;
      double ilut_atol;
      double ilut_rtol;
      double ilut_drop;

      static void declare_parameters(ParameterHandler &prm);
      void        parse_parameters(ParameterHandler &prm);
    };

    void Solver::declare_parameters(ParameterHandler &prm)
    {
      // 如果之前不存在 "linear solver" 这个子节，`enter_subsection` 就会创建它
      prm.enter_subsection("linear solver");
      {
        prm.declare_entry(
          "output",
          "quiet",
          Patterns::Selection("quiet|verbose"),
          "State whether output from solver runs should be printed. "
          "Choices are <quiet|verbose>.");
        prm.declare_entry("method",
                          "gmres",
                          Patterns::Selection("gmres|direct"),
                          "The kind of solver for the linear system. "
                          "Choices are <gmres|direct>.");
        prm.declare_entry("residual",
                          "1e-10",
                          Patterns::Double(),
                          "Linear solver residual");
        prm.declare_entry("max iters",
                          "300",
                          Patterns::Integer(),
                          "Maximum solver iterations");
        prm.declare_entry("ilut fill",
                          "2",
                          Patterns::Double(),
                          "Ilut preconditioner fill");
        prm.declare_entry("ilut absolute tolerance",
                          "1e-9",
                          Patterns::Double(),
                          "Ilut preconditioner tolerance");
        prm.declare_entry("ilut relative tolerance",
                          "1.1",
                          Patterns::Double(),
                          "Ilut relative tolerance");
        prm.declare_entry("ilut drop tolerance",
                          "1e-10",
                          Patterns::Double(),
                          "Ilut drop tolerance");
      }
      prm.leave_subsection();
    }

    void Solver::parse_parameters(ParameterHandler &prm)
    {
      prm.enter_subsection("linear solver");
      {
        const std::string op = prm.get("output");
        if (op == "verbose")
          output = verbose;
        if (op == "quiet")
          output = quiet;

        const std::string sv = prm.get("method");
        if (sv == "direct")
          solver = direct;
        else if (sv == "gmres")
          solver = gmres;

        linear_residual = prm.get_double("residual");
        max_iterations  = prm.get_integer("max iters");
        ilut_fill       = prm.get_double("ilut fill");
        ilut_atol       = prm.get_double("ilut absolute tolerance");
        ilut_rtol       = prm.get_double("ilut relative tolerance");
        ilut_drop       = prm.get_double("ilut drop tolerance");
      }
      prm.leave_subsection();
    }
```

* `Refinement`

```cpp
    struct Refinement
    {
      bool   do_refine;
      double shock_val;
      double shock_levels;

      static void declare_parameters(ParameterHandler &prm);
      void        parse_parameters(ParameterHandler &prm);
    };

    void Refinement::declare_parameters(ParameterHandler &prm)
    {
      prm.enter_subsection("refinement");
      {
        prm.declare_entry("refinement",
                          "true",
                          Patterns::Bool(),
                          "Whether to perform mesh refinement or not");
        prm.declare_entry("refinement fraction",
                          "0.1",
                          Patterns::Double(),
                          "Fraction of high refinement");
        prm.declare_entry("unrefinement fraction",
                          "0.1",
                          Patterns::Double(),
                          "Fraction of low unrefinement");
        prm.declare_entry("max elements",
                          "1000000",
                          Patterns::Double(),
                          "maximum number of elements");
        prm.declare_entry("shock value",
                          "4.0",
                          Patterns::Double(),
                          "value for shock indicator");
        prm.declare_entry("shock levels",
                          "3.0",
                          Patterns::Double(),
                          "number of shock refinement levels");
      }
      prm.leave_subsection();
    }

    void Refinement::parse_parameters(ParameterHandler &prm)
    {
      prm.enter_subsection("refinement");
      {
        do_refine    = prm.get_bool("refinement");
        shock_val    = prm.get_double("shock value");
        shock_levels = prm.get_double("shock levels");
      }
      prm.leave_subsection();
    }
```

* `Flux`

```cpp
    struct Flux
    {
      enum StabilizationKind
      {
        constant,
        mesh_dependent
      };
      StabilizationKind stabilization_kind;

      double stabilization_value;

      static void declare_parameters(ParameterHandler &prm);
      void        parse_parameters(ParameterHandler &prm);
    };

    void Flux::declare_parameters(ParameterHandler &prm)
    {
      prm.enter_subsection("flux");
      {
        prm.declare_entry(
          "stab",
          "mesh",
          Patterns::Selection("constant|mesh"),
          "Whether to use a constant stabilization parameter or "
          "a mesh-dependent one");
        prm.declare_entry("stab value",
                          "1",
                          Patterns::Double(),
                          "alpha stabilization");
      }
      prm.leave_subsection();
    }

    void Flux::parse_parameters(ParameterHandler &prm)
    {
      prm.enter_subsection("flux");
      {
        const std::string stab = prm.get("stab");
        if (stab == "constant")
          stabilization_kind = constant;
        else if (stab == "mesh")
          stabilization_kind = mesh_dependent;
        else
          AssertThrow(false, ExcNotImplemented());

        stabilization_value = prm.get_double("stab value");
      }
      prm.leave_subsection();
    }
```

* `Output`

```cpp
    struct Output
    {
      bool   schlieren_plot;
      double output_step;

      static void declare_parameters(ParameterHandler &prm);
      void        parse_parameters(ParameterHandler &prm);
    };

    void Output::declare_parameters(ParameterHandler &prm)
    {
      prm.enter_subsection("output");
      {
        prm.declare_entry("schlieren plot",
                          "true",
                          Patterns::Bool(),
                          "Whether or not to produce schlieren plots");
        prm.declare_entry("step",
                          "-1",
                          Patterns::Double(),
                          "Output once per this period");
      }
      prm.leave_subsection();
    }

    void Output::parse_parameters(ParameterHandler &prm)
    {
      prm.enter_subsection("output");
      {
        schlieren_plot = prm.get_bool("schlieren plot");
        output_step    = prm.get_double("step");
      }
      prm.leave_subsection();
    }
```

* `AllParameters`

```cpp
    template <int dim>
    struct AllParameters : public Solver,
                           public Refinement,
                           public Flux,
                           public Output
    {
      static const unsigned int max_n_boundaries = 10;

      struct BoundaryConditions
      {
        std::array<typename EulerEquations<dim>::BoundaryKind,
                   EulerEquations<dim>::n_components>
          kind;

        FunctionParser<dim> values;

        BoundaryConditions();
      };

      AllParameters();

      double diffusion_power;

      double time_step, final_time;
      double theta;
      bool   is_stationary;

      std::string mesh_filename;

      FunctionParser<dim> initial_conditions;
      BoundaryConditions  boundary_conditions[max_n_boundaries];

      static void declare_parameters(ParameterHandler &prm);
      void        parse_parameters(ParameterHandler &prm);
    };

    template <int dim>
    AllParameters<dim>::BoundaryConditions::BoundaryConditions()
      : values(EulerEquations<dim>::n_components)
    {
      std::fill(kind.begin(),
                kind.end(),
                EulerEquations<dim>::no_penetration_boundary);
    }

    template <int dim>
    AllParameters<dim>::AllParameters()
      : diffusion_power(0.)
      , time_step(1.)
      , final_time(1.)
      , theta(.5)
      , is_stationary(true)
      , initial_conditions(EulerEquations<dim>::n_components)
    {}

    template <int dim>
    void AllParameters<dim>::declare_parameters(ParameterHandler &prm)
    {
      prm.declare_entry("mesh",
                        "grid.inp",
                        Patterns::Anything(),
                        "input file name");

      prm.declare_entry("diffusion power",
                        "2.0",
                        Patterns::Double(),
                        "power of mesh size for diffusion");

      prm.enter_subsection("time stepping");
      {
        prm.declare_entry("time step",
                          "0.1",
                          Patterns::Double(0),
                          "simulation time step");
        prm.declare_entry("final time",
                          "10.0",
                          Patterns::Double(0),
                          "simulation end time");
        prm.declare_entry("theta scheme value",
                          "0.5",
                          Patterns::Double(0, 1),
                          "value for theta that interpolated between explicit "
                          "Euler (theta=0), Crank-Nicolson (theta=0.5), and "
                          "implicit Euler (theta=1).");
      }
      prm.leave_subsection();

      for (unsigned int b = 0; b < max_n_boundaries; ++b)
        {
          prm.enter_subsection("boundary_" + Utilities::int_to_string(b));
          {
            prm.declare_entry("no penetration",
                              "false",
                              Patterns::Bool(),
                              "whether the named boundary allows gas to "
                              "penetrate or is a rigid wall");
		    // 针对当前边界的每个物理分量，声明两个参数：
		    // 1. "w_i"：边界类型（选择项：inflow、outflow 或 pressure），默认值为 "outflow"
		    // 2. "w_i value"：对应的边界条件表达式，默认值为 "0.0"
            for (unsigned int di = 0; di < EulerEquations<dim>::n_components;
                 ++di)
              {
                prm.declare_entry("w_" + Utilities::int_to_string(di),
                                  "outflow",
                                  Patterns::Selection(
                                    "inflow|outflow|pressure"),
                                  "<inflow|outflow|pressure>");

                prm.declare_entry("w_" + Utilities::int_to_string(di) +
                                    " value",
                                  "0.0",
                                  Patterns::Anything(),
                                  "expression in x,y,z");
              }
          }
          prm.leave_subsection();
        }

      prm.enter_subsection("initial condition");
      {
        for (unsigned int di = 0; di < EulerEquations<dim>::n_components; ++di)
          prm.declare_entry("w_" + Utilities::int_to_string(di) + " value",
                            "0.0",
                            Patterns::Anything(),
                            "expression in x,y,z");
      }
      prm.leave_subsection();

      Parameters::Solver::declare_parameters(prm);
      Parameters::Refinement::declare_parameters(prm);
      Parameters::Flux::declare_parameters(prm);
      Parameters::Output::declare_parameters(prm);
    }

    template <int dim>
    void AllParameters<dim>::parse_parameters(ParameterHandler &prm)
    {
      mesh_filename   = prm.get("mesh");
      diffusion_power = prm.get_double("diffusion power");

      prm.enter_subsection("time stepping");
      {
        time_step = prm.get_double("time step");
        if (time_step == 0)
          {
            is_stationary = true;
            time_step     = 1.0;
            final_time    = 1.0;
          }
        else
          is_stationary = false;

        final_time = prm.get_double("final time");
        theta      = prm.get_double("theta scheme value");
      }
      prm.leave_subsection();

      for (unsigned int boundary_id = 0; boundary_id < max_n_boundaries;
           ++boundary_id)
        {
          prm.enter_subsection("boundary_" +
                               Utilities::int_to_string(boundary_id));
          {
            std::vector<std::string> expressions(
              EulerEquations<dim>::n_components, "0.0");

            const bool no_penetration = prm.get_bool("no penetration");

            for (unsigned int di = 0; di < EulerEquations<dim>::n_components;
                 ++di)
              {
                const std::string boundary_type =
                  prm.get("w_" + Utilities::int_to_string(di));

                if ((di < dim) && (no_penetration == true))
                  boundary_conditions[boundary_id].kind[di] =
                    EulerEquations<dim>::no_penetration_boundary;
                else if (boundary_type == "inflow")
                  boundary_conditions[boundary_id].kind[di] =
                    EulerEquations<dim>::inflow_boundary;
                else if (boundary_type == "pressure")
                  boundary_conditions[boundary_id].kind[di] =
                    EulerEquations<dim>::pressure_boundary;
                else if (boundary_type == "outflow")
                  boundary_conditions[boundary_id].kind[di] =
                    EulerEquations<dim>::outflow_boundary;
                else
                  AssertThrow(false, ExcNotImplemented());

                expressions[di] =
                  prm.get("w_" + Utilities::int_to_string(di) + " value");
              }

            boundary_conditions[boundary_id].values.initialize(
              FunctionParser<dim>::default_variable_names(),
              expressions,
              std::map<std::string, double>());
          }
          prm.leave_subsection();
        }

      prm.enter_subsection("initial condition");
      {
        std::vector<std::string> expressions(EulerEquations<dim>::n_components,
                                             "0.0");
        for (unsigned int di = 0; di < EulerEquations<dim>::n_components; ++di)
          expressions[di] =
            prm.get("w_" + Utilities::int_to_string(di) + " value");
        initial_conditions.initialize(
          // 这个函数返回一个字符串向量，包含了解析表达式时默认使用的变量名。
          // 例如，对于二维问题，默认变量名通常为 `"x"` 和 `"y"`；对于三维问题，则可能是 `"x"`, `"y"`, `"z"`
          FunctionParser<dim>::default_variable_names(),
          expressions,
          // `expressions` 是一个字符串向量，其中每个元素对应于一个物理分量的边界条件表达式
          std::map<std::string, double>());
      }
      prm.leave_subsection();

      Parameters::Solver::parse_parameters(prm);
      Parameters::Refinement::parse_parameters(prm);
      Parameters::Flux::parse_parameters(prm);
      Parameters::Output::parse_parameters(prm);
    }
  } // namespace Parameters
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTUzMDQwNjM4OSwtOTUzMzc5MDU0LDEwOT
c2MTU3MSwtMTg2MzA3MTU4NSwtMTQxNzk4ODgxOSw0NjA3MDg2
MCwtMTQzMjc5MzY3NywyNjI0MzQxMzUsLTE0MjU5NzY2NzEsLT
g5MjU4Njg4XX0=
-->