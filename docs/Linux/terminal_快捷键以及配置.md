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

自己电脑上还是用 [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh) 好些。 [oh-my-bash](https://github.com/ohmybash/oh-my-bash) 项目里面包含一大堆自作主张的小聪明, 比如默认修改了一大堆常用的命令， cp, cd, mv 之类的，第一次使用的时候还是很麻烦的。

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

* 安装好后，在 `~/.bashrc` 中设置主题
```bash
OSH_THEME="powerbash10k"
```
找到 `~/.oh-my-bash/themes/powerbash10k/powerbash10k.theme.sh`，修改 `function __pb10k_prompt_dir` 中 `local info` 这一行为如下格式:
```bash
function __pb10k_prompt_dir {
  local color=$_omb_prompt_bold_navy
  local box=""
  # local info="  \w"
  local info="  $(echo "$PWD" | sed "s|^$HOME|~|")"
  printf "%s|%s|%s|%s" "$color" "$info" "$_omb_prompt_bold_white" "$box"
}
```
目的是将 `/home/username/` 显示为 `~/`


---

* 设置 python 自动补全

真不知道 oh-my-bash 有什么大病，之前
```bash
alias p="python"
```
用起来好好的，结果使用 oh-my-bash 后，按 `p` 没办法自动补全了，把 oh-my-bash 设置的所有 plugin, alias 注释掉都不管用！只能用下面的方法:
```bash
# 打印 python 调用的补全函数
$ complete -p python
complete -F _comp_cmd_python python
```
然后在 `~/.bashrc` 中设置 `p` 的补全函数
```bash
alias p="python"
complete -F _comp_cmd_python p
```

---


* 把 `cd`, `>`, `cp` , `mkdir`, `mv` 改回默认的设置

`cp` , `mkdir`, `mv`  这三个的篡改，见于 `~/.oh-my-bash/aliases/general.aliases.sh`

oh-my-bash 会自作聪明地把很多最常用的命令给你改掉，然后你还轻易不好改回去。比如，它会把 `cd` 改成如下形式:
```bash
$ alias cd
alias cd='_omb_directories_cd'
```
那么， `'_omb_directories_cd'` 又是什么呢？是它自定义的函数:
```bash
$ grep -rni '_omb_directories_cd' ~/.oh-my-bash/
~/.oh-my-bash/lib/directories.sh:10:function _omb_directories_cd {
~/.oh-my-bash/lib/directories.sh:50:_omb_util_alias cd='_omb_directories_cd'
```
`cd` 运行后总是会打印 `$(pwd)`。把 oh-my-bash 所有的插件全部注释掉，还是不解决问题。

以及运行 `cp`, `mkdir`, `mv`  时，会默认打印详细信息。


只能这样操作了:
```bash
unalias cp
# 同理也有
unalias mv
unalias mkdir
 
# 对于以上三个命令，也可以注释掉 `general` 这一行
aliases=(
  # general
)
```
禁止 `cd` 命令输出 `$(pwd)` 还有点麻烦, 简单的 unalias 不解决问题。解决方案在[这里](https://github.com/ohmybash/oh-my-bash/issues/201)， 找到 ~/.bashrc 中的这一行:
```bash
source "$OSH"/oh-my-bash.sh
```
在后面加上
```bash
unset CDPATH
```
oh my bash 还自作主张地禁止重定向符覆写文件，会报错:
```bash
-bash: id: cannot overwrite existing file
```
来自github issue 中的 [解决方案](https://github.com/ohmybash/oh-my-bash/issues/50) 还不管用，需要在 `~/.bashrc` 中添加如下行:
```bash
set +o noclobber
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTU5NDU4ODY4MCw5NDE4NTczMzYsLTQ2OT
gyNDc2OSw1ODI1MzIxMDIsLTIyODg0Mzg0NiwtMTc0OTM1Njgx
Miw3OTI5NTg2NjQsLTIwODU2MjM2MzAsMTA4NjYyNDQxNSwtMT
k2ODUzMzQyMCwtODQ3MzI0MzU5LDMwOTA2NTgyNl19
-->