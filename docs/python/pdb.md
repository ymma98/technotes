# pdb


| **命令**               | **描述**                           | **使用方法**                     |
|------------------------|------------------------------------|----------------------------------|
| 启动 PDB               | 启动调试器                         | `python -m pdb <script.py>`      |
| 设置断点               | 设置断点                           | `break <location>` 或 `b <location>` |
| 继续执行               | 继续执行直到下一个断点             | `continue` 或 `c`                |
| 列出代码               | 列出当前代码段                     | `list` 或 `l`                    |
| 执行下一行             | 执行下一行代码（不进入函数）       | `next` 或 `n`                    |
| 单步执行               | 单步执行（进入函数）               | `step` 或 `s`                    |
| 打印变量值             | 打印表达式或变量的值               | `print <expression>` 或 `p <expression>` |
| 退出 PDB               | 退出调试器                         | `quit` 或 `q`                    |
| 条件断点               | 设置条件断点                       | `break <location>, <condition>`  |
| 跳过函数               | 跳过当前函数的剩余部分             | `until`                          |
| 查看外部变量           | 查看当前作用域外的变量             | `!var`                           |
| 执行 Python 代码       | 执行任意 Python 代码               | `! <code>`                       |
| 跟踪执行               | 显示当前的堆栈跟踪                 | `where` 或 `w`                   |
| 在堆栈中移动           | 在调用堆栈中向上或向下移动         | `up`, `down`                     |
| 保存/恢复断点          | 保存或恢复断点设置                 | `save_breakpoints <file>`, `Pdb().readrc(<file>)` |


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
eyJoaXN0b3J5IjpbLTEzMTc0ODc2NDldfQ==
-->