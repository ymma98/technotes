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
<!--stackedit_data:
eyJoaXN0b3J5IjpbNDMzOTkxOTI1LC0yMDQyMjk4MjMzLDc1OT
c3ODA4MSwxNzM4NzU1MjM2LC01NjU4MDI1MDEsLTgxODY1LDY2
NjQyNDczNyw4OTM4NTIzNjcsODQyMzI0MjE5LDUzMzA5OTM4Ny
wxOTgxMjY4MjkzLDI1NDY3MzkyOCw3NTE1MjQxMzUsNTM1NzM2
MTM2LDYxOTg1NDc0MV19
-->