# spack速查

比较好的[教程](https://ashki23.github.io/spack.html)。

```bash
# 安装软件包
spack install <package>            # 安装指定的软件包

# 卸载软件包
spack uninstall <package>          # 卸载指定的软件包

# 加载和卸载软件包（环境模块）
spack load <package>               # 加载软件包到当前环境
spack unload <package>             # 从当前环境卸载软件包

# 查找软件包
spack find [options] <package>     # 列出已安装的软件包
spack list [options]               # 显示可用软件包的列表

# 软件包信息
spack info <package>               # 显示有关软件包的详细信息

# 查看依赖关系
spack dependents <package>         # 显示依赖指定包的其他包
spack dependencies <package>       # 显示指定包的依赖

# 环境管理
spack env create <env> [file]      # 创建一个新环境
spack env activate <env>           # 激活环境
spack env deactivate               # 停用环境

# 配置 Spack
spack config get <config>          # 获取 Spack 配置
spack config add <config>          # 添加 Spack 配置
spack config edit <config>         # 编辑 Spack 配置文件

# 清理 Spack
spack clean [options]              # 清理 Spack 的下载缓存和临时文件

# 编译器管理
spack compiler find                # 检测并添加可用的编译器
spack compiler list                # 列出已知的编译器

# 仓库管理
spack repo add <repo>              # 添加软件包仓库
spack repo list                    # 列出已配置的仓库

# 查看和更新 Spack
spack version                      # 显示 Spack 的版本
spack update                       # 更新 Spack 到最新版本

# 模块管理
spack module tcl refresh           # 更新 Tcl 模块文件
spack module lmod refresh          # 更新 Lmod 模块文件
```


* 显示已经 load 的软件包

```bash
spack find --loaded 
```

* 显示软件包路径和详细信息

```bash
spack find -p hdf5@1.14.5
spack find -p hdf5
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbNzg0MTkxMTI4LC0yOTI3ODMzNjQsLTE1MD
A3ODI0MzddfQ==
-->