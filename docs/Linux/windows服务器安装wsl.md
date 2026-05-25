# windows服务器安装wsl

* 为特定用户而不是全体用户安装

管理员权限运行 powershell, 执行:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMjEzOTQ1MDAyOV19
-->