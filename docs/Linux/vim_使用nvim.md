# 使用 nvim



之前因为计算集群的网络难以稳定连接 github，导致在服务器上难以使用 `lvim`, 所以一直在服务器上使用的 `nvim`。我选择在 `nvim` 中使用 `vim-plug` 管理插件。下载插件时只用一个一个下载就可以减小服务器网络不稳定的影响，而不是像 `lvim` 那样一次性安装完所有的插件。

* `nvim`  所有有关的文件放在 `~/.config/nvim/` 中，有
```bash
$ ls
autoload  coc-settings.json  init.vim  node  vim-plug
```

其中，`init.vim` 是 `nvim` 首先读取的文件:
```bash
:set number
:set autoindent
:set mouse=a
:set clipboard+=unnamedplus

autocmd FileType * setlocal tabstop=4 shiftwidth=4 expandtab softtabstop=4



source $HOME/.config/nvim/vim-plug/plugins.vim
```


在 `coc-settings.json` 中对部分插件进行进一步的设置:
```bash
{
  "clangd.path": "~/.config/coc/extensions/coc-clangd-data/install/13.0.0/clangd_13.0.0/bin/clangd",
  "python.pythonPath": "/home/ymma/anaconda2/bin/python"
}
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbMzQ1NDkxOTk5LC0zNjAxMjU3MDEsLTE1OT
k1MDI2MTldfQ==
-->