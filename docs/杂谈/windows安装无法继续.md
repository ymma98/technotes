# 计算机意外的重新启动或遇到错误, windows安装无法继续

记录一次给 thinkpad-X1 重装win11-专业版系统过程中遇到的问题 (安装win10专业版、教育版也有类似的问题)。中间略过若干尝试，只记录最终解决了问题的一个流程。

注: `F1` 设置 BIOS (关闭 security boot), `F12` 设置启动介质

___

* (1) 重装系统时, 报错: `dpc_watchdog_violation`。这个报错将导致系统强制重启

* (2) 重启后报错: `计算机意外的重新启动或遇到错误, windows安装无法继续`

* (3) 通过[以下方法](https://zhuanlan.zhihu.com/p/344349529) 进入系统:
	* 按`shift+F10`弹出命令行窗口
	* 输入`regedit`，找到注册表`HKEY_LOCAL_MACHINE\SYSTEM\SETUP\STATUS\ChildCompletion`
	* `ChildCompletion`下面有SETUP.EXE,找到后双击它，将1修改为3，确定之后关闭注册表编辑器
	* 点击错误消息框的确定，电脑就会自动重启，重新解析安装包再次进入安装系统

* (4) 进入系统后，发现没有 wifi，且触摸板从始至终无法使用。设备列表中没有 wifi 模块。尝试直接安装 wifi 驱动、安装联想驱动管理器、或者通过 cclean 等软件均无法解决驱动问题。经过测试有线网可以使用。

* (5) 保持有线网为联通状态，再次通过U盘启动重装系统, 重复流程 (1)-(3), 进入系统后依然没有 wifi 模块。但是触摸板可以使用。重启系统并设置 security boot 之后，可以找到 wifi 模块。之后也没有报错问题 (1) 和问题 (2)

---
出现以上问题的原因未知, 可能的关键步骤是安装时保持接入有线网, 以及拔出u盘后设置 security boot, 但后者不知道是不是多余的操作。稀里糊涂地把问题解决了
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTEwNzQyNjI2OV19
-->