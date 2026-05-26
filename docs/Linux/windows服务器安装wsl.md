# windows服务器安装wsl

* 为特定用户而不是全体用户安装

管理员权限运行 powershell, 执行:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
```

重启，管理员powershell运行

```powershell
New-Item -ItemType Directory -Path "C:\WSL_Shared" -Force

# 1. 下载官方最新的 WSL2 内核包（确保文件完好） 
Invoke-WebRequest -Uri "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi" -OutFile "$env:TEMP\wsl_update_x64.msi"
# 2. 在底层驱动已激活的状态下，重新静默安装它 
Start-Process "msiexec.exe" -ArgumentList "/i $env:TEMP\wsl_update_x64.msi /quiet /norestart" -Wait 
# 3. 验证全局状态（如果显示出内核版本号，说明全局修复成功） 
wsl --status
```


普通用户powershell 运行

```powershell
# 此时内核已全局就绪，导入将直接开始，通常会静置 10~30 秒（取决于服务器硬盘速度） 
wsl --import Ubuntu-Latest "$env:USERPROFILE\MyWSL" "C:\WSL_Shared\install.tar.gz" 
# 导入成功后，直接启动进入最新版 Ubuntu 24.04 空间 
wsl -d Ubuntu-Latest
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTc4MDQwNDE1MSwyMTM5NDUwMDI5XX0=
-->