# dealii-11.01 弱格式

> step-33 几乎包含了所有构造有限元求解器需要掌握的内容, 因此详细学习该 tutorial.

## 常用弱格式推导公式

| 编号 | 公式 |
|-----:|:-----|
| **1** | $\nabla (fg) = f \nabla g + g \nabla f$ |
| **2** | $\nabla \cdot (f \,\vec{u}) = f (\nabla \cdot \vec{u}) + \vec{u} \cdot \nabla f$ |
| **3** | $\nabla \times (f \,\vec{u}) = f (\nabla \times \vec{u}) + (\nabla f) \times \vec{u}$ |
| **4** | $\nabla \cdot (\vec{u} \times \vec{v}) = \vec{v}\cdot (\nabla \times \vec{u}) - \vec{u} \cdot (\nabla \times \vec{v})$ |
| **5** | $\nabla \times (\vec{u} \times \vec{v}) = (\vec{v}\cdot \nabla)\,\vec{u} - (\vec{u}\cdot \nabla)\,\vec{v} + \vec{u}\,(\nabla \cdot \vec{v}) - \vec{v}\,(\nabla \cdot \vec{u})$ |
| **6** | $\Delta (fg) = f \,\Delta g + g \,\Delta f + 2\,\nabla f \cdot \nabla g$ |
| **7** | $\nabla (\nabla \cdot \vec{u}) - \nabla \times (\nabla \times \vec{u}) = \Delta \vec{u}$ |
| **8** | $\Delta (f \,\vec{u}) = f \,\Delta \vec{u} + \vec{u} \,\Delta f + 2 \,\nabla f \cdot \nabla \vec{u}$ |
| **9** | $\int_{\Omega} \nabla u \cdot \nabla v \, d\Omega \;=\; -\int_{\Omega} (\Delta u)\, v \, d\Omega \;+\; \int_{\partial \Omega} \frac{\partial u}{\partial n} \, v \, dS$ |
| **10** | $\int_{\Omega} \nabla u \cdot \vec{v}\, d\Omega \;=\; - \int_{\Omega} u\,(\nabla \cdot \vec{v}) \, d\Omega \;+\; \int_{\partial \Omega} u \;\vec{v}\cdot \vec{n} \, dS$ |
| **11** | $\int_{\Omega} (\nabla \cdot \vec{u}) \, v \, d\Omega \;=\; -\int_{\Omega} \vec{u}\cdot (\nabla v) \, d\Omega \;+\; \int_{\partial \Omega} v \;\vec{u}\cdot \vec{n} \, dS$ |
| **12** | $\int_{\Omega} (\nabla \times \vec{u}) \cdot \vec{v}\, d\Omega \;=\; \int_{\Omega} \vec{u}\cdot (\nabla \times \vec{v}) \, d\Omega \;-\; \int_{\partial \Omega} (\vec{u}\times \vec{v}) \cdot \vec{n} \, dS$ |
| **13** | $\int_{\Omega} \vec{u}\cdot (\nabla \times \vec{v}) \, d\Omega \;=\; \int_{\Omega} (\nabla \times \vec{u}) \cdot \vec{v}\, d\Omega \;+\; \int_{\partial \Omega} (\vec{v}\times \vec{u}) \cdot \vec{n} \, dS$ |
| **14** | $\int_{\Omega} \nabla u \cdot \nabla v \, d\Omega \;=\; \int_{\Omega} (\nabla u) \cdot (\nabla v) \, d\Omega$ |
| **15** | $\int_{\Omega} (\nabla \cdot \vec{u}) \, (\nabla \cdot \vec{v}) \, d\Omega$ |
| **16** | $\int_{\Omega} (\nabla \times \vec{u}) \cdot (\nabla \times \vec{v}) \, d\Omega$ |

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTY2OTc0NzA0NywtMTczODk2NTk3OF19
-->