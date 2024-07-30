# pdb


#### 基础命令

-   启动 PDB: `python -m pdb <script.py>`
-   设置断点: `break <location>` 或 `b <location>`
-   继续执行: `continue` 或 `c`
-   列出代码: `list` 或 `l`
-   执行下一行: `next` 或 `n` (不进入函数)
-   单步执行: `step` 或 `s` (进入函数)
-   打印变量值: `print <expression>` 或 `p <expression>`
-   退出 PDB: `quit` 或 `q`

#### 高级命令

-   条件断点: `break <location>, <condition>`
-   跳过函数: `until`
-   查看外部变量: `!var`
-   执行 Python 代码: `! <code>`
-   跟踪执行: `where` 或 `w`
-   在堆栈中移动: `up`, `down`
-   保存/恢复断点: `save_breakpoints <file>`, `Pdb().readrc(<file>)`
<!--stackedit_data:
eyJoaXN0b3J5IjpbNDgyNTk2ODU0XX0=
-->