# step-6, 自适应网格

## 步骤

- 在当前网格上求解PDE；
- 使用某些标准估算每个单元的误差；
- 标记那些误差较大的单元进行细化，标记那些误差较小的单元进行粗化，其他单元保持不变；
- 对标记的单元进行细化和粗化，以获得新的网格；
- 重复上述步骤，直到新网格上的误差足够小。




$$
-\nabla \cdot a(\mathbf{x}) \nabla u(\mathbf{x}) = 1 \quad \text{in } \Omega,
$$

$$
u = 0 \quad \text{on } \partial \Omega.
$$

$$
a(\mathbf{x}) =
\begin{cases}
20 & \text{if } |\mathbf{x}| < 0.5, \\
1 & \text{otherwise.}
\end{cases}
$$



<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIyMjE0ODQxMiwtMTQ2OTI5MTMxOV19
-->