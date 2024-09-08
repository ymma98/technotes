# 在beamer中插入动画

有时候需要向报告中插入 gif 文件

* 将 gif 文件转化为一系列的 png 文件
	* Linux 中运行 `convert -coalesce xxx.gif xxx.png`
* beamer 中添加 `\usepackage{animate}`
* 需要插入动画处, 使用 `\animategraphics[options]{frame rate}{file base name}{first}{last}`
	* e.g. `\animategraphics[loop,width=4cm]{10}{./figs/pgif/pressure_wo_cbar-}{0}{100}`

美中不足的地方是添加动画后编译速度明显减慢。
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTUyMzUwOTExNl19
-->