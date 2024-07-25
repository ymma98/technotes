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

其中，`shiftwidth` 设置了自动缩进和反缩进的宽度

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


题外话：

之前因为计算集群的网络难以稳定连接 github，导致在服务器上难以使用 `lvim`, 所以一直在服务器上使用的 `nvim`。我选择在 `nvim` 中使用 `vim-plug` 管理插件。下载插件时只用一个一个下载就可以减小服务器网络不稳定的影响，而不是像 `lvim` 那样一次性安装完所有的插件。


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE0MTMwMTEyNjZdfQ==
-->