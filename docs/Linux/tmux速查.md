# tmux cheat sheet

* [参考](https://gist.github.com/andreyvit/2921703)


（注：C-x 表示 Ctrl + x，M-x 表示 Alt + x）


以下所有快捷键均假设你使用 `C-b` 作为前缀。

----------

## 会话（Sessions）、窗口（Windows）、面板（Panes）

-   **会话（Session）**：一组窗口，并且包含当前正在使用的窗口信息。
-   **窗口（Window）**：相当于一个「虚拟桌面」，其中可以包含多个面板。
-   **面板（Pane）**：窗口中的一个矩形区域，运行一个特定的命令（如一个 shell）。

----------

## 查看帮助

显示所有快捷键列表：

```bash
C-b ?
```

如果想在查看帮助和复制模式下使用 Vim 按键（例如 j、k、C-u、C-d 等），需要在 `~/.tmux.conf` 中添加：

```bash
setw -g mode-keys vi
```

提示：本 cheatsheet 中提到的所有命令，都可以通过以下方式执行：

-   在终端中直接输入 `tmux <command>`
-   在 tmux 中先按 `C-b :`，然后输入 `<command>`
-   或者将它们加入到 `~/.tmux.conf`

----------

## 管理会话（Sessions）

### 创建会话

```bash
tmux new-session -s work
```

创建一个与已有会话共享窗口，但拥有自己当前窗口指针的新会话：

```bash
tmux new-session -s work2 -t work
```

### 附加/Detach会话

```bash
tmux attach -t work
```

Detach当前会话：

```bash
C-b d
```

### 切换会话

```bash
C-b (    # 上一个会话
C-b )    # 下一个会话
C-b L    # 最后使用过的会话
C-b s    # 从会话列表中选择
```

### 其他会话操作

```bash
C-b $
```

重命名当前会话（弹出命令行让你输入新名称）。

----------

## 管理窗口（Windows）

### 创建新窗口

```bash
C-b c
```

创建一个新的窗口。

### 切换窗口

```bash
C-b 1 ... C-b 9  C-b 0   # 切换到对应编号的窗口（1~9, 0）
C-b p                   # 切换到上一个窗口
C-b n                   # 切换到下一个窗口
C-b l                   # 切换到上一次使用的窗口
C-b w                   # 从窗口列表中选择
```

### 针对带提示的窗口切换

```bash
C-b M-n  # 切换到下一个有提示（bell/activity/content alert）的窗口
C-b M-p  # 切换到上一个有提示的窗口
```

### 其他窗口操作

```bash
C-b ,
```

重命名当前窗口（弹出命令行输入名称）。

```bash
C-b &
```

关闭（kill）当前窗口。

----------

## 管理拆分面板（Panes）

### 创建新面板

```bash
C-b "   # 垂直分割（上下）
C-b %   # 水平分割（左右）
```

### 切换面板

```bash
C-b 左/右/上/下   # 切换到相应方向的面板
C-b o            # 在所有面板间依次循环切换
C-b ;            # 切换到上一次使用的面板
```

### 移动面板

```bash
C-b {      # 将当前面板向前移动
C-b }      # 将当前面板向后移动
C-b C-o    # 整个窗口的面板“上移”轮换
C-b M-o    # 整个窗口的面板“下移”轮换
C-b !      # 将当前面板移出到一个新窗口
```

也可以使用命令将当前面板移动到指定会话/窗口的指定面板位置，例如：

```bash
C-b :move-pane -t :3.2
```

将当前面板拆分到“窗口3”的“面板2”位置。

### 调整面板大小

```bash
C-b M-↑ / C-b M-↓ / C-b M-← / C-b M-→
# 每次调整 5 行/列

C-b C-↑ / C-b C-↓ / C-b C-← / C-b C-→
# 每次调整 1 行/列
```

### 预设布局

```bash
C-b M-1  # 切换到 even-horizontal 布局
C-b M-2  # 切换到 even-vertical 布局
C-b M-3  # 切换到 main-horizontal 布局
C-b M-4  # 切换到 main-vertical 布局
C-b M-5  # 切换到 tiled 布局
C-b space  # 切换到下一个布局
```

### 其他操作

```bash
C-b x   # 关闭（kill）当前面板
C-b q   # 短暂显示所有面板编号
```

----------

## 其他配置文件设置

在 `C-b r` 重新载入配置文件：

```bash
unbind r
bind r source-file ~/.tmux.conf
```

其他常用设置示例：

```bash
setw -g xterm-keys on
```

这条设置可以让 tmux 正确处理更多复杂按键。

----------

以上即是基于 `C-b` 作为前缀键的 tmux 快捷键与配置说明。祝使用愉快！
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQzOTkyOTM5NSwtOTI3NDIxNjkwXX0=
-->