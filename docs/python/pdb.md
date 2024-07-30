# pdb


| **命令**               | **描述**                             | **使用方法**                           |
|------------------------|--------------------------------------|----------------------------------------|
| 启动 PDB               | 启动 Python 脚本的调试器              | `python -m pdb <script.py>`            |
| 设置断点               | 在指定位置设置断点                   | `break <location>` 或 `b <location>`   |
| 继续执行               | 继续执行到下一个断点                 | `continue` 或 `c`                      |
| 列出代码               | 列出当前的代码或指定行的代码         | `list` 或 `l`                          |
| 执行下一行             | 执行下一行代码，不进入函数           | `next` 或 `n`                          |
| 单步执行               | 执行下一行代码，进入函数             | `step` 或 `s`                          |
| 返回上一级             | 返回函数调用前的代码行               | `return` 或 `r`                        |
| 打印变量值             | 打印表达式或变量的值                 | `print <expression>` 或 `p <expression>`|
| 查看变量类型           | 显示变量的类型                       | `whatis <variable>`                    |
| 退出 PDB               | 退出调试器                           | `quit` 或 `q`                          |
| 条件断点               | 设置带有条件的断点                   | `break <location>, <condition>`        |
| 跳过函数               | 执行直到函数返回                     | `until`                                |
| 查看外部变量           | 查看当前作用域外的变量               | `!var`                                 |
| 执行 Python 代码       | 在调试会话中执行任意 Python 代码     | `! <code>`                             |
| 跟踪执行               | 显示当前的调用堆栈                   | `where` 或 `w`                         |
| 在堆栈中移动           | 在调用堆栈中向上或向下移动           | `up`, `down`                           |
| 保存/恢复断点          | 保存或恢复断点设置                   | `save_breakpoints <file>`, `Pdb().readrc(<file>)` |
| 查看所有断点           | 列出所有设置的断点                   | `b`                                    |
| 删除断点               | 删除指定的断点                       | `clear <breakpoint number>`            |
| 查看局部变量           | 查看当前作用域中的局部变量           | `locals()`                             |
| 查看全局变量           | 查看当前全局环境中的变量             | `globals()`                            |
| 设置变量值             | 在调试会话中设置变量的值             | `!<variable> = <value>`                |
| 自动列出代码           | 在每次停止时自动显示当前的代码       | `set listsize <number>`                |
| 显示/隐藏调试信息      | 显示或隐藏调试输出                   | `set trace`, `set notrace`             |



<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE0MTcxOTUyMiw3OTE1OTk1NjJdfQ==
-->