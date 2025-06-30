# macbookPro安装windows

帮别人在 macbookPro 上重装系统, 安装了 win11, 这里记录下过程。

安装前的症状: 无法进入开机界面, 界面显示需要选择键盘布置，点进去系统自动修复失败。触控板和键盘不可用。

需要: 拓展坞，外接的键盘，鼠标和无线网卡。

* 关机，在拓展坞上插入启动盘 (我的启动盘是用 ventoy 制作的)
* 开机, 按住 `alt` 键不松手 (对应 mac `Option` )
* 一路格式化，正常安装
* 装好win11 后, 进入 settings 查看设备型号, 我这里是 MacBookPro14,2


* 安装硬件驱动
	* 在 powershell 中执行:
	
	```bash
	Invoke-WebRequest `
  -Uri "https://github.com/timsutton/brigadier/releases/latest/download/brigadier.exe" `
  -OutFile "$env:USERPROFILE\Downloads\brigadier.exe"
	```

	* 之后安装 7-zip. 访问 www.7-zip.org/, 下载win11安装程序并安装。
	* 然后
	
	```bash
	cd $env:USERPROFILE\Downloads
	.\brigadier.exe --model MacBookPro14,2
	```
	
	* 进入刚安装好的 BootCamp-xxxx\BootCamp 文件夹, 执行
	
	```bash
	.\Setup.exe
	```

* 最后, 重启, 并开机后在任务管理器中禁用 BootCamp, 否则每次开机都会弹窗报错，但实际上驱动已经可以用了。


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTExNTUxOTAzNzIsLTY2NDcyMjA0Nl19
-->