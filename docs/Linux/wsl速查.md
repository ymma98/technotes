# wsl 速查

## 分屏
```bash
ref: https://learn.microsoft.com/en-us/windows/terminal/panes
alt + shift + +: 创建垂直分屏
alt + shift + -: 创建水平分屏
alt + 方向键: 在不同分屏之间跳转
alt + shift + 方向键: 调整分屏尺寸
ctrl + shift + w: 关闭窗口 
```

## 配置代理

* 设置和代理软件一样的端口，设置windows 下的 ipv4 地址 (powershell 下使用 ipconfig 查看)
```bash
export http_proxy="http://211.67.27.213:7890"
export https_proxy="http://211.67.27.213:7890"
```
* 在代理软件中设置 allow lAN
* 测试，如果有输出表明成功
```bash
# 使用位于 IP 地址 `211.67.27.213` 上、端口 `7890` 的 HTTP 代理，发起一个到 `http://www.google.com` 的 GET 请求。`-x` 选项告诉 `curl` 使用指定的 HTTP 代理
curl -x http://211.67.27.213:7890 http://www.google.com
```


## 安装华科 vpn 之后无法启动 wsl

一旦运行 wsl 就会报错
```bash
The attempted operation is not supported for the type of object referenced.
Error code: Wsl/Service/0x8007273d

[process exited with code 4294967295 (0xffffffff)]
You can now close this terminal with Ctrl+D, or press Enter to restart.
```

解决办法: 管理员权限运行 Powershell

```bash
netsh winsock reset
```

这条命令的作用是重置 Winsock Catalog（Windows Sockets API）到其默认状态或干净状态。
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEwNTY0MTUwMDddfQ==
-->