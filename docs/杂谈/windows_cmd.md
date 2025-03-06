# windows cmd 命令记录

| 命令              | 功能介绍                                                        | 示例                                        |
|-------------------|----------------------------------------------------------------|---------------------------------------------|
| cd                | 显示当前目录或切换目录                                          | `cd C:\Windows\System32`                    |
| dir               | 显示当前目录下文件和子目录列表                                  | `dir /p`（分页显示）                        |
| md / mkdir        | 创建新目录                                                      | `mkdir newfolder`                           |
| rd / rmdir        | 删除目录（仅适用于空目录）                                      | `rmdir oldfolder`                           |
| del               | 删除文件                                                        | `del test.txt`                              |
| copy              | 复制文件到指定位置                                              | `copy C:\file.txt D:\backup\file.txt`       |
| move              | 移动文件或重命名文件                                            | `move C:\file.txt D:\moved\file.txt`        |
| rename            | 重命名文件或目录                                                | `rename oldname.txt newname.txt`            |
| cls               | 清屏，清除当前 CMD 窗口中的内容                                  | `cls`                                       |
| echo              | 在命令行输出文本                                                | `echo Hello World`                          |
| type              | 显示文本文件的内容                                              | `type C:\Users\readme.txt`                  |
| more              | 分页显示文本文件内容                                            | `type C:\Users\readme.txt | more`          |
| help              | 显示 CMD 命令帮助或查看指定命令的详细帮助信息                    | `help dir`                                  |
| ipconfig          | 显示或刷新网络配置信息                                          | `ipconfig /all`                            |
| ping              | 测试与目标地址（域名/IP）的网络连通性                            | `ping 8.8.8.8`                             |
| tracert           | 跟踪数据包到目标的路径                                          | `tracert www.google.com`                    |
| netstat           | 显示网络连接、路由表和网络统计信息                               | `netstat -an`                               |
| tasklist          | 显示当前运行的进程列表                                          | `tasklist`                                  |
| taskkill          | 通过进程 PID 或映像名称结束进程                                  | `taskkill /PID 1234 /F`                     |
| fc                | 比较两个文件或文件夹内容                                        | `fc file1.txt file2.txt`                    |
| find              | 在文件中搜索指定文本串                                          | `find "Hello" file.txt`                     |
| findstr           | 支持正则表达式的搜索工具                                        | `findstr /R "error[0-9]" log.txt`           |
| attrib            | 显示或更改文件的属性                                            | `attrib +r +h secret.txt`                   |
| chkdsk            | 检查并修复磁盘错误                                              | `chkdsk C: /f /r`                           |
| tree              | 以树状结构显示指定驱动器或路径下的目录结构                      | `tree C:\Projects`                          |
| shutdown          | 关机、重启或注销计算机                                          | `shutdown /s /t 60` （60秒后关机）          |
| systeminfo        | 显示本机计算机配置信息（操作系统、补丁等）                       | `systeminfo`                                |
| color             | 设置 CMD 窗口的前景和背景颜色                                    | `color 0A` （黑底绿色字体）                 |
| start             | 在单独窗口中启动一个程序或打开文件/文件夹                        | `start notepad.exe`                         |
| set               | 显示、设置或删除环境变量                                        | `set PATH=C:\MyTools;%PATH%`               |
| call              | 从一个批处理文件（.bat）调用另一个批处理文件                      | `call secondscript.bat`                     |
| exit              | 退出 CMD 窗口                                                   | `exit`                                      |




* 定时关机

```bash
# 重启(-r)、注销(-l), 关机(-s)
shutdown -s -t 3600 -c "根据xxx停电通知，系统将在1小时后关机，请及时保存工作！xxx上午开机"
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTM1OTUyNjQ5OCw3NDY1ODA3NzFdfQ==
-->