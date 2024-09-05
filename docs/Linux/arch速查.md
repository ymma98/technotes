# arch速查


```bash
# 更新包数据库
pacman -Sy

# 升级所有已安装的包
pacman -Syu

# 安装包
pacman -S 包名

# 删除包（保留其依赖）
pacman -R 包名

# 删除包及其依赖（不被其他包使用的）
pacman -Rs 包名

# 搜索仓库中的包
pacman -Ss 关键词

# 查询已安装的包
pacman -Q

# 查询特定已安装包的信息
pacman -Qi 包名

# 查询哪个包拥有指定文件
pacman -Qo 文件名

# 清理未使用的包（孤立包）
pacman -Rns $(pacman -Qtdq)

# 查看包内容
pacman -Ql 包名

# 查找包含特定文件的包
pacman -F 文件名

# 下载但不安装包
pacman -Sw 包名

# 更新系统时忽略某个包
pacman -Syu --ignore 包名

# AUR Helpers (如 `yay`, `paru`)

# 安装 AUR 包 (以 `yay` 为例):
yay -S 包名

# 更新 AUR 包
yay -Syu

# 编辑 `pacman` 配置文件 (/etc/pacman.conf) 来添加仓库、修改选项等

# 使用 `pacman-mirrors` 选择最快的镜像 (注意，这可能主要适用于 Manjaro)
pacman-mirrors -f

# 清理旧版本的包缓存
pacman -Sc

# 清理所有未安装包的缓存
pacman -Scc
# 警告: 以上命令会删除所有下载的包缓存，谨慎使用
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE1NjA0MTI0ODhdfQ==
-->