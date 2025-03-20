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
| **17** | $\nabla \mathbf{u} \;=\; \left(\frac{\partial u_i}{\partial x_j}\right) e_i \otimes e_j \;=\; \begin{pmatrix} \frac{\partial u_1}{\partial x_1} & \frac{\partial u_1}{\partial x_2} & \frac{\partial u_1}{\partial x_3} \\[6pt] \frac{\partial u_2}{\partial x_1} & \frac{\partial u_2}{\partial x_2} & \frac{\partial u_2}{\partial x_3} \\[6pt] \frac{\partial u_3}{\partial x_1} & \frac{\partial u_3}{\partial x_2} & \frac{\partial u_3}{\partial x_3} \end{pmatrix}$ |
| **18** | $\nabla \cdot \mathbf{A} \;=\; \left(\sum_{j} \frac{\partial A_{ij}}{\partial x_j}\right) e_i \;=\; \begin{pmatrix} \sum_{j} \frac{\partial A_{1j}}{\partial x_j} \\[6pt] \sum_{j} \frac{\partial A_{2j}}{\partial x_j} \\[6pt] \sum_{j} \frac{\partial A_{3j}}{\partial x_j} \end{pmatrix}$ |
| **19** | $\mathbf{A} : \mathbf{B} \;=\; \sum_{i,j} A_{ij} \, B_{ij} \;=\; \mathrm{trace}\,(\mathbf{A}^T \mathbf{B})$ |
| **20** | $\nabla \cdot (\mathbf{u} \otimes \mathbf{v}) \;=\; (\nabla \cdot \mathbf{u}) \,\mathbf{v} \;+\; (\nabla \mathbf{v})^T \mathbf{u}$ |
| **21** | $\int_{\Omega} \nabla \mathbf{u} : \nabla \mathbf{v} \, d\Omega \;=\; \int_{\Omega} \sum_{i,j} \frac{\partial u_i}{\partial x_j} \,\frac{\partial v_i}{\partial x_j} \, d\Omega$ |
| **22** | $\int_{\Omega} \nabla \mathbf{u} : \nabla \mathbf{v} \, d\Omega \;=\; -\,\int_{\Omega} (\Delta \mathbf{u}) \cdot \mathbf{v} \, d\Omega \;+\; \int_{\partial \Omega} \frac{\partial \mathbf{u}}{\partial n} \,\cdot\, \mathbf{v} \, dS$ |
| **23** | $(\nabla \mathbf{u}) : (\nabla \mathbf{v}) \;=\; \sum_{i,j} \frac{\partial u_i}{\partial x_j} \,\frac{\partial v_i}{\partial x_j}$ |
| **24** | $\Delta \mathbf{u} \;=\; \nabla \bigl(\nabla \cdot \mathbf{u}\bigr) \;-\; \nabla \times \bigl(\nabla \times \mathbf{u}\bigr)$ |
| **25** | $\int_{\Omega} \mathbf{A} : \nabla \mathbf{v} \, d\Omega \;=\; -\,\int_{\Omega} \bigl(\nabla \cdot \mathbf{A}^T\bigr) \cdot \mathbf{v} \, d\Omega \;+\; \int_{\partial \Omega} (\mathbf{A}^T \mathbf{v}) \cdot \mathbf{n} \, dS$ |


## Euler equation 弱格式推导






<!--stackedit_data:
eyJoaXN0b3J5IjpbODQ2Njc3MDA1LDM5MDUzNzY4MiwxNzE1Nj
U2NzI4LC02Njk3NDcwNDcsLTE3Mzg5NjU5NzhdfQ==
-->