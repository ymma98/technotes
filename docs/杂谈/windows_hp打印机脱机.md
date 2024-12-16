# HP 打印机脱机

* HP LaserJet MFP M227sdn
现象：打印机网线连接正常，HP smart 显示打印机处于 Ready 状态，ping 打印机的 IP 也能 ping 通，能在网页中直接访问打印机。但是一打印就显示打印机「脱机」。

[解决办法](https://support.hp.com/cn-zh/document/c01484827)：`Control Panel` -> `Hardware and Sound` -> `Devices and Printers`，找到打印机，右键 `Printer Properties`，选择 `Ports` 这一栏，默认是 WSD Port，改为 `Standard TCP/IP Port`。

原因似乎是 [Windows 对 WSD 端口驱动的支持有问题](https://answers.microsoft.com/en-us/windows/forum/all/error-in-wsd-port-driver/fea6c323-e26c-4c6e-a395-5f2b31074b51)。

<!--stackedit_data:
eyJoaXN0b3J5IjpbMjAyNDk1OTYxLC0xMTA1MzE2MTQxXX0=
-->