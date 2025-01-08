# bashrc

```bash
##################################### shortcut
alias ll='ls -alF'
alias la='ls -A' 
alias s="ls -F"
alias b="nvim"
alias p="python"
alias gitadog="git log --all --decorate --oneline --graph"
alias gitadog2="git log --graph --abbrev-commit --decorate --date=relative --all"
# 非集群环境，用 `git show-tree` 代替 `gitadog`

# 产生随机标识符
alias grand8="openssl rand -hex 8"
alias grand4="openssl rand -hex 4"
# 统计当前文件夹内文件夹和文件的大小, 并从大到小排列
alias sortsize="du -ah --max-depth=1 | sort -hr"

# clear duplicate $PATH
# reference: https://unix.stackexchange.com/questions/14895/duplicate-entries-in-path-a-problem
PATH=$(printf "%s" "$PATH" | awk -v RS=':' '!a[$1]++ { if (NR > 1) printf RS; printf $1 }')


#################################### wsl
## export DISPLAY=:0,0 # in wsl 1
export DISPLAY=$(awk '/nameserver / {print $2; exit}' /etc/resolv.conf 2>/dev/null):0 # in WSL 2
# export DISPLAY=localhost:0.0
export LIBGL_ALWAYS_INDIRECT=1

export PATH="/usr/local/texlive/2022/bin:$PATH"
export PATH="/usr/local/texlive/2022/:$PATH"
export PATH="/usr/local/texlive/2022/bin/x86_64-linux:$PATH"

alias setproxy="export ALL_PROXY=socks5://127.0.0.1:10808"
alias unsetproxy="unset ALL_PROXY"
alias sync190="rsync -auvz -e 'ssh -p 32158'"
alias sync172="rsync -auvz -e 'ssh -p 32157'"

alias winmode="git config oh-my-zsh.hide-dirty 1"
alias wslmode="git config oh-my-zsh.hide-dirty 0"


##################################  190
alias squeue="squeue -o'%.7i %.9P %.8j %.8u %.2t %.10M %.6D %C'"
alias sinfoall="sinfo -o '%n %e %m %a %c %C'"
alias squeuetot="squeue | awk '{if(NR>1) s+=\$8} END {print s}'"
alias squeuedelall="squeue|awk '{if(\$4==\"ymma\")print \$1}'|xargs scancel"

alias rsync172="rsync -auvze 'ssh -p 32157'"
alias scancelid="scancel \$(cat id | grep -Eo '[0-9]*')"

alias findid="for file in \$(find ./ -name id);do echo -n \${file}; echo -n '   ';cat \${file};done"
alias pc="python inpynim.py c &>/dev/null &"
alias cl1="ls |grep -vE 'gs|new|00000|org'|xargs rm"

PS1='\u@\h:\w \$ '
alias shortps1='PS1="\u@\h:\W \$ "'
alias cpwd=" pwd | xsel --clipboard --input"
alias xselcp="xsel --clipboard --input"


# for tabby
# export PS1="$PS1\[\e]1337;CurrentDir="'$(pwd)\a\]'

PATH=/home/ymma/.config/nvim/node/node-v16.14.0-linux-x64/bin:$PATH
PATH=/home/ymma/bin/VSCode-linux-x64/bin:$PATH


################################## end


################################ 172
alias qdelall="showq | awk '{if(\$2==\"ymma\") print \$1}'|xargs qdel"
alias sqall="showq | awk '{if(NR>1 && \$2==\"ymma\") print \$1, \$4}'"
alias showqq="watch -n 1 showq"
alias nodefree="pestat|grep free"
alias qdelid="qdel \$(cat id | grep -Eo '^[0-9]*')"
alias pestatid="pestat | grep \$(cat id | grep -Eo '^[0-9]*')"
alias rsync190="rsync -auvze 'ssh -p 32158'"
alias pc="python inpynim.py c &>/dev/null &"
alias findid="for file in \$(find ./ -name id);do echo -n \${file}; echo -n '   ';cat \${file};done"
```


## inputrc

`~/.inputrc`

```bash
set completion-ignore-case on
```

## tmux config

`~/.tmux.conf`

```bash
# set -g mouse on
# bind -T copy-mode-vi Enter send-keys -X copy-pipe-and-cancel "xclip -i -f -selection primary | xclip -i -selection clipboard"
# bind -T copy-mode-vi MouseDragEnd1Pane send-keys -X copy-pipe-and-cancel "xclip -i -f -selection primary | xclip -i -selection clipboard"
# bind -T copy-mode-vi C-j send-keys -X copy-pipe-and-cancel "xclip -i -f -selection primary | xclip -i -selection clipboard"

#for copying to sys clipboard
bind -T copy-mode-vi Enter send-keys -X copy-pipe-and-cancel "xclip -i -f -selection primary | xclip -i -selection clipboard"
bind -T copy-mode-vi MouseDragEnd1Pane send-keys -X copy-pipe-and-cancel "xclip -i -f -selection primary | xclip -i -selection clipboard"
bind -T copy-mode-vi C-j send-keys -X copy-pipe-and-cancel "xclip -i -f -selection primary | xclip -i -selection clipboard"

#general other stuff
### set -g default-terminal "xterm-256color"
set -g mouse on
set-window-option -g mode-keys vi
```


## ~/.wezterm.lua

[wezterm 官网](https://wezfurlong.org/wezterm/index.html)

```lua
-- Pull in the wezterm API
local wezterm = require 'wezterm'

-- This will hold the configuration.
local config = wezterm.config_builder()

-- For example, changing the color scheme:
config.color_scheme = 'jellybeans'
config.font = wezterm.font 'DejaVu Sans Mono'
config.font_size = 16

-- This is where you actually apply your config choices
config.keys = {
    -- Split pane horizontally (tmux: Ctrl-b %)
    {
        key = '%',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.SplitHorizontal { domain = 'CurrentPaneDomain' },
    },

    -- Split pane vertically (tmux: Ctrl-b ")
    {
        key = '"',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.SplitVertical { domain = 'CurrentPaneDomain' },
    },

    -- Create new tab (Ctrl-Shift t)
    {
        key = 't',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.SpawnTab 'CurrentPaneDomain',
    },

    -- Close current pane (tmux: Ctrl-b x)
    {
        key = 'x',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.CloseCurrentPane { confirm = true },
    },

    -- Switch to pane using arrow keys (tmux: Ctrl-b + Arrow key)
    {
        key = 'h',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.ActivatePaneDirection 'Left',
    },
    {
        key = 'l',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.ActivatePaneDirection 'Right',
    },
    {
        key = 'k',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.ActivatePaneDirection 'Up',
    },
    {
        key = 'j',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.ActivatePaneDirection 'Down',
    },

    -- Copy to clipboard (Ctrl-Shift c)
    {
        key = 'c',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.CopyTo 'Clipboard',
    },

    -- Paste from clipboard (Ctrl-Shift p)
    {
        key = 'p',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.PasteFrom 'Clipboard',
    },

    -- New WezTerm window (Ctrl-Shift n)
    {
        key = 'n',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.SpawnWindow,
    },

    -- Switch between tabs (Alt + number)
    {
        key = '1',
        mods = 'ALT',
        action = wezterm.action.ActivateTab(0),
    },
    {
        key = '2',
        mods = 'ALT',
        action = wezterm.action.ActivateTab(1),
    },
    {
        key = '3',
        mods = 'ALT',
        action = wezterm.action.ActivateTab(2),
    },
    {
        key = '4',
        mods = 'ALT',
        action = wezterm.action.ActivateTab(3),
    },
    {
        key = '5',
        mods = 'ALT',
        action = wezterm.action.ActivateTab(4),
    },
    {
        key = '6',
        mods = 'ALT',
        action = wezterm.action.ActivateTab(5),
    },
    {
        key = '7',
        mods = 'ALT',
        action = wezterm.action.ActivateTab(6),
    },
    {
        key = '8',
        mods = 'ALT',
        action = wezterm.action.ActivateTab(7),
    },
    {
        key = '9',
        mods = 'ALT',
        action = wezterm.action.ActivateTab(8),
    },

    -- Previous tab (Ctrl + shift + {)
    {
        key = '{',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.ActivateTabRelative(-1),
    },

    -- Next tab (Ctrl + shift + })
    {
        key = '}',
        mods = 'CTRL|SHIFT',
        action = wezterm.action.ActivateTabRelative(1),
    },
}



-- and finally, return the configuration to wezterm
return config
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMzA2OTI0NTAyLC03ODgwNzI0MTgsOTIxOT
IwMTAsMjA0NzU1OTEwLDk5NDY0NjQ1NiwtNjgwNTEzOTgxLC0x
MDgxODY1MzkzLDY1MjM2OTc5NSwtMTU3Nzk0MTMyNF19
-->