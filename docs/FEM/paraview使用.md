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

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250209/image.2yyh0vzztr.webp){ width="400" }

* 移动 3D 视角
	* 鼠标左键: 拖拽物体
	* 鼠标滚轮: 放大/缩小物体
	* 按住滚轮: 上下平移物体

* 切换回默认视角

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250209/image.4g4m2npufo.webp){ width="400" }

* 切换到 FRC 的 x-z 视角
	* set view direction to -Y
	* Rotate 90d clockwise

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250209/image.9dd2xt9f2b.webp){ width="400" }

* 指定 seed point
	* 在 panel 的 `Source` 一栏中添加 source
	* 如果想打包多个 source, 可以选中这些 source 后选择: `Filters > Alphabetical > GroupDatasets`

## 保存视角信息

在 paraview 中运行如下脚本

```python
import paraview.simple as pvs

# 获取当前视图和相机
view = pvs.GetActiveView()
camera = view.GetActiveCamera()

# 保存当前相机位置和角度
camera_position = camera.GetPosition()
camera_focal_point = camera.GetFocalPoint()
camera_view_angle = camera.GetViewAngle()
camera_view_up = camera.GetViewUp()

print("***"*10)
print("camera_position ", camera_position)
print("camera_focal_point ", camera_focal_point)
print("camera_view_angle ", camera_view_angle)
print("camera_view_up ", camera_view_up)
print("***"*10)
```

就可以在终端中打印出来当前视角信息。恢复视角信息需要如下脚本 (举例):

```python
import paraview.simple as pvs

view = pvs.GetActiveView()
camera = view.GetActiveCamera()

camera.SetPosition((-4.668740696971327, 2.564520009400343, 4.142102672113201))
camera.SetFocalPoint((0.07808221425864849, 0.22357416491324963, 0.32058582292675847))
camera.SetViewAngle(30.0)
camera.SetViewUp((0.30210918260735825, 0.9328669149578858, -0.19618705553952975))
```

## 常用的设置

### clip box

比如，想对一个 $r=0.3$m，$z\in[-2,2]$ 的圆柱做 clip, 

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250311/image.5c14omq0pk.webp){ width="400" }


### cylinder source 

如果想显示计算区域的 Box, 像下图中的白色框线那样，

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250311/image.8ades570ik.webp){ width="400" }

可以定义一个 cylinder source:

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250311/image.3uuzmvx5d5.webp){ width="400" }

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250311/image.8hgmnw13d3.webp){ width="400" }


### 定义参考平面

如果想高亮 $x=0$ 的 YZ 平面作为参考平面，像下面的淡绿色平面:

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250311/image.5q7kfiahdm.webp){ width="400" }


![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250311/image.26lmppdu4s.webp){ width="400" }

<!--stackedit_data:
eyJoaXN0b3J5IjpbNTc2NzQ3MTA1LDEwNjQwMzUxNCwtMTEwMD
g3NDg2MCwtOTE2NzYzMzU2LC02MTQ5ODk2NDgsLTMyMjcwMjEw
LDEyNTA2MjUwOSwxNjAxNjg4NzU2LC0zMjMyMTM3MDksLTE2Mj
EzMDgzODksLTIwNzY5NjM3NDQsMzQxODIwODI2LDYxNzQxNTEw
Niw5MjExNDk0MTQsLTEyNjcyOTMyOTQsLTEwMDkyMjU4MzNdfQ
==
-->