# paraview 使用

## 导航
[ParaView Documentation](https://docs.paraview.org/en/latest/index.html)
[ParaView Classroom Tutorials](https://www.paraview.org/Wiki/SNL_ParaView_Tutorials)

## 基本信息

ParaView 使用 VTK（the Visualization Toolkit）作为可视化和数据处理的核心支撑。

VTK 的模型基于数据流（data-flow）范式。在这种范式下，数据在系统中流动，并在每一步被称为 algorithm 的模块所转换。algorithm 可以是常见操作（如裁剪、切片或从数据生成等值面），也可以用来计算派生量等。algorithm 通过其输入端口（input port）接收数据，并通过输出端口（output port）输出结果。为了将数据输入到系统中，需要能够读取或生成数据的生产者，这些没有输入端口但拥有一个或多个输出端口的 algorithm 称为 source。比如，从文件中读取数据的 reader 就是这类 source 的一个示例。此外，还有将数据转换成图形基元（graphics primitives）以便在计算机屏幕上渲染或保存到另一个文件中的 algorithm。此类具有一个或多个输入端口但没有输出端口的 algorithm 称为 sink。而同时带有输入端口和输出端口、用于对数据进行中间处理的 algorithm 则称为 filter。source、filter 和 sink 共同构建了灵活的基础架构，用户只需通过连接这些 algorithm 就能创建复杂的处理管线来执行各种复杂任务。


从这种视角来看，可视化管线是 ParaView 工作流的核心：通过创建一个 reader（即 source）将数据导入系统，然后使用 filter 提取信息（例如生成等值面）并在 view 中进行渲染，或者利用 writer（作为一种 sink）将数据保存到磁盘。


## 基本操作

* 将默认的蓝色背景改为白色背景


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTc4NTA1MDY1OSwtMTI2NzI5MzI5NCwtMT
AwOTIyNTgzM119
-->