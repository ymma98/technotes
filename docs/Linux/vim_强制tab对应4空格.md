# 强制 tab 对应 4 空格

之前的设置 `init.vim`:
```bash
:set number
:set autoindent
:set tabstop=4
:set shiftwidth=4
:set smarttab
:set softtabstop=4
:set expandtab
:set mouse=a
:set clipboard+=unnamedplus

source $HOME/.config/nvim/vim-plug/plugins.vim
```

其中，`shiftwidth` 设置了自动缩进和反缩进的宽度。

`expandtab` 选项控制 Vim 如何处理 Tab 键。如果启用了 `expandtab`，每次你按下 Tab 键时，Vim 会插入空格而不是实际的 Tab 字符。

`softtabstop` 控制在插入模式下，按下 Tab 键时实际插入的空格数，而不改变文件中的实际 Tab 字符。当 `softtabstop` 的值与 `tabstop` 和 `shiftwidth` 一致时，按下 Tab 键插入的空格数与缩进的宽度保持一致。

但是，之前的设置，在打开个别文件时，依然有一个 tab 对应 2 空格的情况，不知道为什么。

现在设置为:
```bashrc
:set number
:set autoindent
" :set tabstop=4
" :set shiftwidth=4
" :set smarttab
" :set softtabstop=4
" :set expandtab
:set mouse=a
:set clipboard+=unnamedplus

autocmd FileType * setlocal tabstop=4 shiftwidth=4 expandtab softtabstop=4



source $HOME/.config/nvim/vim-plug/plugins.vim
```

autocmd FileType * setlocal 这样的设置更有强制性，强制应用到当前缓冲区。


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTg4ODYxNzEyLC05MzM2MTYzMTldfQ==
-->