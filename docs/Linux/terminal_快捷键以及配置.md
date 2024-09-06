# terminal 配置


## terminal 快捷键

| 快捷键          | 功能描述                           |
|----------------|------------------------------------|
| `Ctrl + A`     | 移动到行首                         |
| `Ctrl + E`     | 移动到行尾                         |
| `Ctrl + K`     | 从光标位置剪切到行尾               |
| `Ctrl + U`     | 从光标位置剪切到行首               |
| `Ctrl + Y`     | 粘贴之前剪切的内容                 |
| `Ctrl + W`     | 剪切光标左侧的单词                 |
| `Ctrl + C`     | 终止当前命令                       |
| `Ctrl + Z`     | 将当前命令放到后台运行             |
| `Ctrl + D`     | 退出当前终端                       |
| `Ctrl + R`     | 搜索命令历史                       |
| `Ctrl + L`     | 清屏                               |
| `Ctrl + T`     | 交换光标处和前一个字符             |
| `Ctrl + XX`    | 在行首和光标之间移动               |
| `Alt + F`      | 移动到下一个单词开头               |
| `Alt + B`      | 移动到上一个单词开头               |
| `Alt + D`      | 删除光标右侧的单词                 |
| `Alt + T`      | 交换光标处的单词和之前的单词       |
| `Shift + Page Up` | 向上滚动终端输出                  |
| `Shift + Page Down` | 向下滚动终端输出                |


## 使用 powerlevel10k 配置 prompt (zsh)


[powerlevel10k repo 地址](https://github.com/romkatv/powerlevel10k?tab=readme-ov-file#how-do-i-add-username-andor-hostname-to-prompt)

配置方法:
```bash
p10k configure
```

默认不显示 user@hostname. 设置显示 user@hostname: 在 ~/.p10k.zsh 中找到下面这行，并按提示把这行注释掉

```bash
# Don't show context unless running with privileges or in SSH.
# Tip: Remove the next line to always show context.
typeset -g POWERLEVEL9K_CONTEXT_{DEFAULT,SUDO}_{CONTENT,VISUAL_IDENTIFIER}_EXPANSION=
```


## 使用 oh-my-bash (bash)

oh-my-bash 项目[地址](https://github.com/ohmybash/oh-my-bash)

安装好后，在 `~/.bashrc` 中设置主题
```bash
OSH_THEME="powerbash10k"
```
找到 `~/.oh-my-bash/themes/powerbash10k`

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTA4NjYyNDQxNSwtMTk2ODUzMzQyMCwtOD
Q3MzI0MzU5LDMwOTA2NTgyNl19
-->