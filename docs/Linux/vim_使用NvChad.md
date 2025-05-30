# 使用 NvChad

* [安装](https://nvchad.com/docs/quickstart/install)
* 更改主题颜色 `<leader> + th`
* NvChad 使用 Lazy 管理, 典型例子是 [`lazy_doc`](https://lazy.folke.io/spec/examples)
* Mapping
	* 查看 key mapping: `NvCheatsheet` 或 `Telescope keymaps` 
	* `<C>` -> `Ctrl`, `<leader>` -> `space`, `<A>` -> `Alt`, `S` -> `Shift`

## `~/.config/nvim/lua/autocmds.lua`

```lua
require "nvchad.autocmds"

vim.api.nvim_create_autocmd("BufWinLeave", {
  pattern = "*.*",
  command = "mkview",
})
vim.api.nvim_create_autocmd("BufWinEnter", {
  pattern = "*.*",
  command = "silent! loadview",
})
```

## `~/.config/nvim/lua/chadrc.lua`

```lua
-- This file needs to have same structure as nvconfig.lua 
-- https://github.com/NvChad/ui/blob/v3.0/lua/nvconfig.lua
-- Please read that file to know all available options :( 

---@type ChadrcConfig
local M = {}

M.base46 = {
	theme = "jellybeans",

	-- hl_override = {
	-- 	Comment = { italic = true },
	-- 	["@comment"] = { italic = true },
	-- },
}

-- M.nvdash = { load_on_startup = true }
-- M.ui = {
--       tabufline = {
--          lazyload = false
--      }
--}

return M
```

## `~/.config/nvim/lua/mappings.lua`

```lua
require "nvchad.mappings"

-- add yours here

local map = vim.keymap.set

map("n", ";", ":", { desc = "CMD enter command mode" })
-- map("i", "jk", "<ESC>")

-- map({ "n", "i", "v" }, "<C-s>", "<cmd> w <cr>")

local opts = { silent = true, noremap = true }

-- buffer cycling (normal mode)
map("n", "<C-n>", ":bnext<CR>",         opts)
map("n", "<C-p>", ":bprev<CR>",         opts)

-- Bdelete
-- :Bd close current tab
vim.api.nvim_create_user_command("Bd", "bdelete", {})

-- file explorer (NvChad uses nvim-tree)
map("n", "<C-t>", ":NvimTreeToggle<CR>", opts)

-- tagbar (or symbols-outline if you prefer)
map("n", "<F8>", ":TagbarToggle<CR>", opts)

-- folds (nvim-ufo)
-- zR open all folds (normal mode)
-- zM close all folds (normal mode)
map("n", "zR", function() require("ufo").openAllFolds()  end, opts)
map("n", "zM", function() require("ufo").closeAllFolds() end, opts)

-- :Pe show the warning and error message
vim.api.nvim_create_user_command("Pe", function() vim.diagnostic.open_float() end, {})

-- :Copypath
vim.api.nvim_create_user_command("Copypath", function() vim.fn.setreg("+", vim.fn.expand("%:p")) end, {})



-- https://github.com/numToStr/Comment.nvim
-- normal mode
-- gcc Toggles the current line using linewise comment (normal)
-- gbc Toggles the current line using blockwise comment (normal)
-- `[count]gcc` - Toggles the number of line given as a prefix-count using linewise (normal)
-- `[count]gbc` - Toggles the number of line given as a prefix-count using blockwise (normal)
-- visual mode
-- `gc` - Toggles the region using linewise comment (visual)
-- `gb` - Toggles the region using blockwise comment (visual)
--

-- 代码折叠, 对应 nvim-ufo 插件, 地址: https://github.com/kevinhwang91/nvim-ufo
-- zR open all folds (normal mode)
-- zM close all folds (normal mode)
-- zo, zc z-open and z-close in current line
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
```

## `~/.config/nvim/lua/options.lua`

```lua
require "nvchad.options"

-- add yours here!

-- local o = vim.o
-- o.cursorlineopt ='both' -- to enable cursorline!

local opt = vim.opt

-- tabs & spaces
opt.tabstop     = 4
opt.shiftwidth  = 4
opt.expandtab   = true

-- line numbers & colour column
opt.relativenumber = false
opt.colorcolumn    = "80"

-- clipboard
opt.clipboard = "unnamedplus":
```

## `~/.config/nvim/lua/plugins/init.lua`


```lua
return {
  {
    "stevearc/conform.nvim",
    -- event = 'BufWritePre', -- uncomment for format on save
    opts = require "configs.conform",
  },

  -- These are some examples, uncomment them if you want to see them work!
  {
    "neovim/nvim-lspconfig",
    config = function()
      require "configs.lspconfig"
    end,
  },

  -- test new blink
  -- { import = "nvchad.blink.lazyspec" },

  -- {
  -- 	"nvim-treesitter/nvim-treesitter",
  -- 	opts = {
  -- 		ensure_installed = {
  -- 			"vim", "lua", "vimdoc",
  --      "html", "css"
  -- 		},
  -- 	},
  -- },
    --

  -- CMake helpers
  {
    "cdelledonne/vim-cmake",
    cmd   = { "CMakeGenerate", "CMakeBuild", "CMakeClean" },
  },

  -- better folds
  {
    "kevinhwang91/nvim-ufo",
    event = "BufReadPost",
    dependencies = "kevinhwang91/promise-async",
    config = function()
      require("ufo").setup {
        provider_selector = function(_, ft, _)    -- treesitter for most, fallback to indent
          return { "treesitter", "indent" }
        end,
      }
    end,
  },

  -- Markdown preview
  {
    "iamcco/markdown-preview.nvim",
    ft    = { "markdown" },
    build = function() vim.fn["mkdp#util#install"]() end,
  },

  {
   -- 关闭侧边栏却不改变比例, :Bdelete
    'moll/vim-bbye',
  },
  {
    "zbirenbaum/copilot.lua",
    event = "InsertEnter",
    config = function()
      require("copilot").setup({})
    end,
  },
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      {
      -- Make sure to run :Lazy load copilot-cmp followed by :Copilot auth once
        "zbirenbaum/copilot-cmp",
        config = function()
          require("copilot_cmp").setup()
        end,
      },
    },
    opts = {
      sources = {
        { name = "nvim_lsp", group_index = 2 },
        { name = "copilot",  group_index = 2 },
        { name = "luasnip",  group_index = 2 },
        { name = "buffer",   group_index = 2 },
        { name = "nvim_lua", group_index = 2 },
        { name = "path",     group_index = 2 },
      },
    },
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
  {
    "nvim-lualine/lualine.nvim",
    lazy=false,
    dependencies = {},
    config = function()
      require("lualine").setup {
        options = {
          theme = "jellybeans",
        },
        sections = {
          lualine_a = { "mode" },
          lualine_b = { "branch", "diff" },
          lualine_c = {
            {
              function()
                return vim.fn.expand("%:p")
              end,
              icon = "",
              padding = { left = 1, right = 1 }
            }
          },
          lualine_x = { "encoding", "filetype" },
          lualine_y = { "progress" },
          lualine_z = { "location" },
        },
      }
    end,
  }
}



```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTMwMDMxMDk1MCwtMTczNTMzMTQ3LDEyNT
cxMzk4MjYsLTQ3NzMzNDY2OSw0NzY5NDE1MzBdfQ==
-->