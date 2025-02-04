# # 计算机意外的重新启动或遇到错误, windows安装无法继续

记录一次给 thinkpad-X1 重装win11-专业版系统过程中遇到的问题 (安装win10专业版、教育版也有类似的问题)。中间略过若干尝试，只记录最终解决了问题的一个流程。

___

* (1) 重装系统时, 报错: `dpc_watchdog_violation`。

* (2) 重启后报错: `计算机意外的重新启动或遇到错误, windows安装无法继续`

* (3) 通过[以下方法](https://zhuanlan.zhihu.com/p/344349529) 进入系统:
	* 按`shift+F10`弹出命令行窗口
	* 输入`regedit`，找到注册表`HKEY_LOCAL_MACHINE\SYSTEM\SETUP\STATUS\ChildCompletion`
	* `ChildCompletion`下面有SETUP.EXE,找到后双击它，将1修改为3，确定之后关闭注册表编辑器
	* 点击错误消息框的确定，电脑就会自动重启，重新解析安装包再次进入安装系统

* 进入系统后，发现没有 wifi。设备列表中没有 wifi 模块。尝试直接安装 wifi 驱动、安装联想驱动管理器、或者通过 cclean 等软件均无法解决驱动问题。

* 再次通过U盘启动重装系统, 重复 


原因猜测: wifi 驱动有问题 (设备列表中找不到), 但进入系统后直接安装 wifi 驱动、安装联想驱动管理器、或者通过 cclean 等软件均无法解决驱动问题。
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE3ODI0NTgxNF19
-->