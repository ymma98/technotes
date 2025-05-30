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
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIwNjI0NTYxNDEsLTE3MzUzMzE0NywxMj
U3MTM5ODI2LC00NzczMzQ2NjksNDc2OTQxNTMwXX0=
-->