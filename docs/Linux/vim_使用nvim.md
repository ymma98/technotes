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
在 `init.vim` 中，设置在 `vim-plug/plugins.vim` 中配置插件, 插件会被下载到 `autoload/plugged` 中:
```bash
" auto-install vim-plug
if empty(glob('~/.config/nvim/autoload/plug.vim'))
  silent !curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  "autocmd VimEnter * PlugInstall
  "autocmd VimEnter * PlugInstall | source $MYVIMRC
endif



call plug#begin('~/.config/nvim/autoload/plugged')

    " Better Syntax Support
    Plug 'sheerun/vim-polyglot'
    " File Explorer
    Plug 'scrooloose/NERDTree'
    " Auto pairs for '(' '[' '{'
    Plug 'jiangmiao/auto-pairs'

    Plug 'https://github.com/vim-airline/vim-airline'
    Plug 'https://github.com/tpope/vim-commentary' " For Commenting gcc & gc
    Plug 'https://github.com/preservim/tagbar' " Tagbar for code navigation
    Plug 'https://github.com/tc50cal/vim-terminal' " Vim Terminal
    Plug 'https://github.com/rafi/awesome-vim-colorschemes' " Retro Scheme
    Plug 'neoclide/coc.nvim', {'branch': 'release'}
    Plug 'https://github.com/ap/vim-buftabline'
    Plug 'iamcco/markdown-preview.nvim', { 'do': { -> mkdp#util#install() }}



call plug#end()

nnoremap <C-N> :bnext<CR>
nnoremap <C-P> :bprev<CR>

nnoremap <silent> <F1> :botright sp\|resize 10\|terminal<CR>i<CR>
tnoremap <silent> <ESC> <C-\><C-n><CR><C-W>k<CR>

"nnoremap <C-n> :NERDTree<CR>
nnoremap <C-t> :NERDTreeToggle<CR>

nmap <F8> :TagbarToggle<CR>
:set completeopt-=preview " For No Previews

:colorscheme jellybeans

let g:NERDTreeDirArrowExpandable="+"
let g:NERDTreeDirArrowCollapsible="~"

nmap <silent> gd <Plug>(coc-definition)

" Use <c-space> to trigger completion.
" inoremap <silent><expr> <c-space> pumvisible() ? coc#_select_confirm() : coc#refresh()
inoremap <silent><expr> <CR> coc#pum#visible() ? coc#pum#confirm() : "\<CR>"

set splitright
```


在 `coc-settings.json` 中对部分插件进行进一步的设置:
```bash
{
  "clangd.path": "~/.config/coc/extensions/coc-clangd-data/install/13.0.0/clangd_13.0.0/bin/clangd",
  "python.pythonPath": "/home/ymma/anaconda2/bin/python"
}
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTc5MzgwNTQ5LC0zNjAxMjU3MDEsLTE1OT
k1MDI2MTldfQ==
-->