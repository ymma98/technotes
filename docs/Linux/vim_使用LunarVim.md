# 使用 LunarVim

之前配置 vim 的方案是 nvim + vim-plug, 但使用一段时间之后发现了更简便的做法: 直接使用 [LunarVim](https://www.lunarvim.org/) !

LunarVim 的好处是开箱即用, 而且定义插件和快捷键都很方便, 很适合在个人电脑上使用。

如果是在无法翻墙的环境安装，需要把安装命令中的 `githubusercontent` 替换为 `gitmirror`，比如
```bash
LV_BRANCH='release-1.4/neovim-0.9' bash <(curl -s https://raw.githubusercontent.com/LunarVim/LunarVim/release-1.4/neovim-0.9/utils/installer/install.sh)
# 改为
LV_BRANCH='release-1.4/neovim-0.9' bash <(curl -s https://raw.gitmirror.com/LunarVim/LunarVim/release-1.4/neovim-0.9/utils/installer/install.sh)
```

目前在 `~/.config/lvim/config.lua` 中的配置:

```lua
-- Read the docs: https://www.lunarvim.org/docs/configuration
-- Example configs: https://github.com/LunarVim/starter.lvim
-- Video Tutorials: https://www.youtube.com/watch?v=sFA9kX-Ud_c&list=PLhoH5vyxr6QqGu0i7tt_XoVK9v-KvZ3m6
-- Forum: https://www.reddit.com/r/lunarvim/
-- Discord: https://discord.com/invite/Xb9B4Ny

--[[
 THESE ARE EXAMPLE CONFIGS FEEL FREE TO CHANGE TO WHATEVER YOU WANT
 `lvim` is the global options object
]]


-- vim options
vim.opt.shiftwidth = 2
vim.opt.tabstop = 2
vim.opt.relativenumber = true

-- general
lvim.log.level = "info"
lvim.format_on_save = {
    enabled = true,
    pattern = "*.lua",
    timeout = 1000,
}
-- to disable icons and use a minimalist setup, uncomment the following
-- lvim.use_icons = false

-- keymappings <https://www.lunarvim.org/docs/configuration/keybindings>
lvim.leader = "space"
-- add your own keymapping
lvim.keys.normal_mode["<C-s>"] = ":w<cr>"

-- lvim.keys.normal_mode["<S-l>"] = ":BufferLineCycleNext<CR>"
-- lvim.keys.normal_mode["<S-h>"] = ":BufferLineCyclePrev<CR>"

-- -- Use which-key to add extra bindings with the leader-key prefix
-- lvim.builtin.which_key.mappings["W"] = { "<cmd>noautocmd w<cr>", "Save without formatting" }
-- lvim.builtin.which_key.mappings["P"] = { "<cmd>Telescope projects<CR>", "Projects" }

-- -- Change theme settings
-- lvim.colorscheme = "lunar"

lvim.builtin.alpha.active = true
lvim.builtin.alpha.mode = "dashboard"
lvim.builtin.terminal.active = true
lvim.builtin.nvimtree.setup.view.side = "left"
lvim.builtin.nvimtree.setup.renderer.icons.show.git = false

-- Automatically install missing parsers when entering buffer
lvim.builtin.treesitter.auto_install = true

-- lvim.builtin.treesitter.ignore_install = { "haskell" }

-- -- generic LSP settings <https://www.lunarvim.org/docs/languages#lsp-support>

-- --- disable automatic installation of servers
-- lvim.lsp.installer.setup.automatic_installation = false

-- ---configure a server manually. IMPORTANT: Requires `:LvimCacheReset` to take effect
-- ---see the full default list `:lua =lvim.lsp.automatic_configuration.skipped_servers`
-- vim.list_extend(lvim.lsp.automatic_configuration.skipped_servers, { "pyright" })
-- local opts = {} -- check the lspconfig documentation for a list of all possible options
-- require("lvim.lsp.manager").setup("pyright", opts)

-- add `pyright` to `skipped_servers` list
vim.list_extend(lvim.lsp.automatic_configuration.skipped_servers, { "pyright" })
-- remove `jedi_language_server` from `skipped_servers` list
lvim.lsp.automatic_configuration.skipped_servers = vim.tbl_filter(function(server)
    return server ~= "jedi_language_server"
end, lvim.lsp.automatic_configuration.skipped_servers)

-- ---remove a server from the skipped list, e.g. eslint, or emmet_ls. IMPORTANT: Requires `:LvimCacheReset` to take effect
-- ---`:LvimInfo` lists which server(s) are skipped for the current filetype
-- lvim.lsp.automatic_configuration.skipped_servers = vim.tbl_filter(function(server)
--   return server ~= "emmet_ls"
-- end, lvim.lsp.automatic_configuration.skipped_servers)

-- -- you can set a custom on_attach function that will be used for all the language servers
-- -- See <https://github.com/neovim/nvim-lspconfig#keybindings-and-completion>
-- lvim.lsp.on_attach_callback = function(client, bufnr)
--   local function buf_set_option(...)
--     vim.api.nvim_buf_set_option(bufnr, ...)
--   end
--   --Enable completion triggered by <c-x><c-o>
--   buf_set_option("omnifunc", "v:lua.vim.lsp.omnifunc")
-- end

-- -- linters and formatters <https://www.lunarvim.org/docs/languages#lintingformatting>
-- local formatters = require "lvim.lsp.null-ls.formatters"
-- formatters.setup {
--   { command = "stylua" },
--   {
--     command = "prettier",
--     extra_args = { "--print-width", "100" },
--     filetypes = { "typescript", "typescriptreact" },
--   },
-- }
-- local linters = require "lvim.lsp.null-ls.linters"
-- linters.setup {
--   { command = "flake8", filetypes = { "python" } },
--   {
--     command = "shellcheck",
--     args = { "--severity", "warning" },
--   },
-- }

-- -- Additional Plugins <https://www.lunarvim.org/docs/plugins#user-plugins>
-- lvim.plugins = {
--     {
--       "folke/trouble.nvim",
--       cmd = "TroubleToggle",
--     },
-- }

-- -- Autocommands (`:help autocmd`) <https://neovim.io/doc/user/autocmd.html>
-- vim.api.nvim_create_autocmd("FileType", {
--   pattern = "zsh",
--   callback = function()
--     -- let treesitter use bash highlight for zsh files as well
--     require("nvim-treesitter.highlight").attach(0, "bash")
--   end,
-- })
--


lvim.plugins = {
    {
        "rafi/awesome-vim-colorschemes",
    },
    {
        "preservim/tagbar",
    },
    {
        "cdelledonne/vim-cmake",
        -- https://github.com/cdelledonne/vim-cmake
    },
    {
        -- 关闭侧边栏却不改变比例, :Bdelete
        'moll/vim-bbye',
    },
    {
        "kevinhwang91/nvim-ufo",
        dependencies = "kevinhwang91/promise-async",
    },
    {
        "iamcco/markdown-preview.nvim",
        cmd = { "MarkdownPreviewToggle", "MarkdownPreview", "MarkdownPreviewStop" },
        ft = { "markdown" },
        build = function() vim.fn["mkdp#util#install"]() end,
    },
    {
        "yetone/avante.nvim",
        event = "VeryLazy",
        lazy = false,
        version = false, -- set this if you want to always pull the latest change
        opts = {
            provider = "deepseek",
            vendors = {
                deepseek = {
                    __inherited_from = "openai",
                    endpoint = "https://api.deepseek.com/v1",
                    model = "deepseek-coder",
                },
            },
        },
        -- if you want to build from source then do `make BUILD_FROM_SOURCE=true`
        build = "make",
        -- build = "powershell -ExecutionPolicy Bypass -File Build.ps1 -BuildFromSource false" -- for windows
        dependencies = {
            "nvim-treesitter/nvim-treesitter",
            "stevearc/dressing.nvim",
            "nvim-lua/plenary.nvim",
            "MunifTanjim/nui.nvim",
            --- The below dependencies are optional,
            "nvim-tree/nvim-web-devicons", -- or echasnovski/mini.icons
            "zbirenbaum/copilot.lua",      -- for providers='copilot'
            {
                -- support for image pasting
                "HakonHarnes/img-clip.nvim",
                event = "VeryLazy",
                opts = {
                    -- recommended settings
                    default = {
                        embed_image_as_base64 = false,
                        prompt_for_file_name = false,
                        drag_and_drop = {
                            insert_mode = true,
                        },
                        -- required for Windows users
                        use_absolute_path = true,
                    },
                },
            },
            {
                -- Make sure to set this up properly if you have lazy=true
                'MeanderingProgrammer/render-markdown.nvim',
                opts = {
                    file_types = { "markdown", "Avante" },
                },
                ft = { "markdown", "Avante" },
            },
        },
    },
}

-- show colorcolumn and set the width=0
vim.opt.colorcolumn = "80"




vim.opt.clipboard = "unnamedplus"
vim.opt.relativenumber = false
lvim.keys.normal_mode["<C-n>"] = ":bnext<CR>"
lvim.keys.normal_mode["<C-p>"] = ":bprev<CR>"
lvim.keys.normal_mode["<C-t>"] = ":NvimTreeToggle<CR>"
lvim.builtin.terminal.open_mapping = "<F7>"
lvim.keys.normal_mode["<F8>"] = ":TagbarToggle<CR>"
lvim.colorscheme = "jellybeans"
-- :Pe show the warning and error message
-- :Bd close current tab
-- zR open all folds (normal mode)
-- zM close all folds (normal mode)
-- https://github.com/numToStr/Comment.nvim
-- gcc Toggles the current line using linewise comment (normal)
-- gbc Toggles the current line using blockwise comment (normal)
-- `[count]gcc` - Toggles the number of line given as a prefix-count using linewise (normal)
-- `[count]gbc` - Toggles the number of line given as a prefix-count using blockwise (normal)
-- `gc` - Toggles the region using linewise comment (visual)
-- `gb` - Toggles the region using blockwise comment (visual)

-- autocompletion in command window: <C-n> and <C-p>

lvim.builtin.terminal.direction = "horizontal" -- 终端在底部水平展开
lvim.builtin.terminal.size = 15                -- 你想要的高度
lvim.builtin.which_key.mappings["t"] = {
    name = "Terminal",
    t = { "<cmd>ToggleTerm<cr>", "Toggle Terminal" }, -- <leader> + t + t
}
vim.keymap.set("t", "<Esc>", "<C-\\><C-n>", { noremap = true, silent = true })


vim.api.nvim_create_autocmd("BufEnter", {
    pattern = { "*.f", "*.F" },
    callback = function()
        -- 禁用 Treesitter 高亮
        vim.cmd("TSBufDisable highlight")
    end,
})

-- 设置 Tab 为 4 个空格
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
-- 使用空格代替 Tab
vim.opt.expandtab = true




-- 设置详细显示 warning 和 error 信息
vim.cmd [[
command! Pe lua vim.diagnostic.open_float(); vim.diagnostic.open_float()
]]

-- 在底部 tag 中显示当前文件的绝对路径
lvim.builtin.lualine.style = "default"
lvim.builtin.lualine.sections = {
    lualine_c = {
        {
            function()
                return vim.fn.expand('%:p') -- 获取并返回当前文件的完整路径
            end,
            padding = 1                     -- 组件前后的空白字符数
        }
    }
}



-- 设置 :Bd 等价于 :Bdelete
vim.cmd('command! Bd Bdelete')

-- 设置 :Copypath 等价于: 拷贝当前文件所在的路径到系统剪贴板
vim.cmd('command! Copypath call setreg("+", expand("%:p"))')


-- 设置 Cmake
-- lvim.keys.normal_mode["<F5>"] = ":CMakeClean<CR>:CMakeGenerate<CR>:CMakeBuild<CR>"
--
--

-- 代码折叠, 对应 nvim-ufo 插件, 地址: https://github.com/kevinhwang91/nvim-ufo
vim.o.fillchars = [[foldopen:,foldclose:]]
vim.o.foldcolumn = '1' -- '0' is not bad
vim.o.foldlevel = 99   -- Using ufo provider need a large value, feel free to decrease the value
vim.o.foldlevelstart = 99
vim.o.foldenable = true
-- Using ufo provider need remap `zR` and `zM`. If Neovim is 0.6.1, remap yourself
vim.keymap.set('n', 'zR', require('ufo').openAllFolds)
vim.keymap.set('n', 'zM', require('ufo').closeAllFolds)
require('ufo').setup({
    provider_selector = function(bufnr, filetype, buftype)
        return { 'treesitter', 'indent' }
    end
})
require 'nvim-treesitter.configs'.setup {
    ensure_installed = "cpp",
    highlight = {
        enable = true,
    },
    fold = {
        enable = true,
    },
}


-- 自动保存折叠信息
vim.api.nvim_create_autocmd({ "BufWinLeave" }, {
    pattern = { "*.*" },
    desc = "save view (folds), when closing file",
    command = "mkview",
})
vim.api.nvim_create_autocmd({ "BufWinEnter" }, {
    pattern = { "*.*" },
    desc = "load view (folds), when opening file",
    command = "silent! loadview"
})


-- github copilot
-- https://www.lunarvim.org/docs/configuration/plugins/example-configurations#copilotlua-and-copilot-cmp
-- Make sure to run :Lazy load copilot-cmp followed by :Copilot auth once
-- the plugin is installed to start the authentication process.
table.insert(lvim.plugins, {
    "zbirenbaum/copilot-cmp",
    event = "InsertEnter",
    dependencies = { "zbirenbaum/copilot.lua" },
    config = function()
        vim.defer_fn(function()
            require("copilot").setup()     -- https://github.com/zbirenbaum/copilot.lua/blob/master/README.md#setup-and-configuration
            require("copilot_cmp").setup() -- https://github.com/zbirenbaum/copilot-cmp/blob/master/README.md#configuration
        end, 100)
    end,
})
```


## 问题整合

### LSP 不工作, `gd` 没反应

首先，看下 `:LspInfo`，不工作的情况是这样的:

```bash
Detected filetype:   cpp

0 client(s) attached to this buffer: 

Configured servers list: 
```

然后, 尝试运行: `:LvimCacheReset`


### gentoo 更新后lvim吞字符

gentoo 服务器更新后，发现文本对齐后的第一个字符都不显示（如下图），我的 wsl (ubuntu) 和另一台 arch 系统的电脑都没这个问题。

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250513/image.lvy86vkcl.webp){width=400px}

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20250513/image.2dox33gs9o.webp){width=400px}

同时报很多错,

```bash
An internal error has occured: false ".../lazy/opt/nvim-treesitter/lua/nvim-treesitter/locals.lua:286: attempt to call method 'parent' (a nil value)"
```

```bash
:checkhealth nvim-treesitter 

得到:

==============================================================================
nvim-treesitter: require("nvim-treesitter.health").check()

Installation ~
- WARNING `tree-sitter` executable not found (parser generator, only needed for :TSInstallFromGrammar, not required for :TSInstall)
- OK `node` found v20.14.0 (only needed for :TSInstallFromGrammar)
- OK `git` executable found.
- OK `cc` executable found. Selected from { vim.NIL, "cc", "gcc", "clang", "cl", "zig" }
Version: cc (Gentoo 13.3.1_p20241220 p2) 13.3.1 20241220
- OK Neovim was compiled with tree-sitter runtime ABI version 15 (required >=13). Parsers must be compatible with runtime ABI.

OS Info:
{
machine = "x86_64",
release = "6.1.12-gentoo-x86_64",
sysname = "Linux",
version = "#1 SMP PREEMPT_DYNAMIC Mon Nov 20 14:00:50 UTC 2023"
} ~

Parser/Features H L F I J
- c ✓ ✓ ✓ ✓ ✓
- comment ✓ . . . .
- lua ✓ ✓ ✓ ✓ ✓
- markdown ✓ . ✓ ✓ ✓
- markdown_inline ✓ . . . ✓
- python ✓ ✓ ✓ ✓ ✓
- query x ✓ ✓ ✓ ✓
- regex ✓ . . . .
- vim ✓ ✓ ✓ . ✓
- vimdoc ✓ . . . ✓

Legend: H[ighlight], L[ocals], F[olds], I[ndents], In[j]ections
+) multiple parsers found, only one will be used
x) errors found in the query, try to run :TSUpdate {lang} ~

The following errors have been detected: ~
- ERROR query(highlights): /usr/share/nvim/runtime/lua/vim/treesitter/query.lua:373: Query error at 14:2. Invalid node type "missing_node":
(missing_node
^

query(highlights) is concatenated from the following files:
| [ERROR]:"/usr/share/nvim/runtime/queries/query/highlights.scm", failed to load: /usr/share/nvim/runtime/lua/vim/treesitter/query.lua:373: Query error at 14:2. Invalid node type "missing_node":
(missing_node
^
```

查找各方论坛无果，一方面是围绕 treesitter 解决问题，但即使是直接禁用 `:TSDisable` 都没有用。还有很多其它无效的尝试，令人抓狂。

最后，试出来的解决方法是，自己下载 nvim 的 appimage, 然后把 appimage 的路径添加到 `$PATH` 中，

```bash
~/.config/nvim/executable/
```

可以解决吞字符的问题。虽然还是报一些错：

```bash
An internal error has occured: false ".../lazy/opt/nvim-treesitter/lua/nvim-treesitter/locals.lua:286: attempt to call method 'parent' (a nil value)"
```

以及需要把配置中的自动保存折叠信息全注释掉lvim 才能勉强工作（否则移动一下光标就会自动折叠所有代码）

```bash
-- 自动保存折叠信息
--vim.api.nvim_create_autocmd({ "BufWinLeave" }, {
--    pattern = { "*.*" },
--    desc = "save view (folds), when closing file",
--    command = "mkview",
--})
--vim.api.nvim_create_autocmd({ "BufWinEnter" }, {
--    pattern = { "*.*" },
--    desc = "load view (folds), when opening file",
--    command = "silent! loadview"
--})
```

没排查出来问题的原因，只是试出来初步的解决方法；折腾了几个小时才勉强带错运行。只能看gentoo在哪一次更新中能顺便解决这个问题了。
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIyNTEwMzUzOCwxMTg4ODQxODIzLC0zMj
Q2MjIxMDIsLTE1MjA3MTg5OTAsLTY1OTMwMjczNiw0MzM5OTE5
MjUsLTIwNDIyOTgyMzMsNzU5Nzc4MDgxLDE3Mzg3NTUyMzYsLT
U2NTgwMjUwMSwtODE4NjUsNjY2NDI0NzM3LDg5Mzg1MjM2Nyw4
NDIzMjQyMTksNTMzMDk5Mzg3LDE5ODEyNjgyOTMsMjU0NjczOT
I4LDc1MTUyNDEzNSw1MzU3MzYxMzYsNjE5ODU0NzQxXX0=
-->