# 安装 stellopt

官网安装说明在[这里](https://princetonuniversity.github.io/STELLOPT/STELLOPT%20Compilation%20Docker)。

```bash
sudo pacman -S docker docker-buildx
# 启用并启动 Docker 服务
sudo systemctl enable --now docker.service
# 将当前用户加入 `docker` 组（无需每次都加 `sudo`）. a->append, G-> group name 'docker'
sudo usermod -aG docker $USER
# 切换当前 shell 的用户组为 docker, 不用重启docker 就可以让上一个语句的命令生效
newgrp docker
# 验证 docker 是否安装成功
docker run hello-world
# 拉取 stellopt
git clone https://github.com/PrincetonUniversity/STELLOPT.git
cd STELLOPT
# 用 `buildx` 构建名为 `libstell` 的 Docker 镜像，使用当前目录下的 `Dockerfile` 文件作为构建脚本
# docker buildx build: 使用 Docker 的 `buildx` 构建工具（支持多平台构建和新特性）来构建镜像
# --file Dockerfile: 指定 Dockerfile 文件为当前目录下的 `Dockerfile`
# --tag libstell: 指定构建出来的镜像的名字（tag）为 `libstell`. 之后可以用 `libstell` 这个名字来运行或引用这个镜像
# .: Docker 在构建镜像时，会把当前目录下的所有文件（包括 Dockerfile）传给 Docker 引擎
docker buildx build --file Dockerfile --tag libstell .
# 该镜像会在 `libstell` 的基础上，使用 `build_all` 脚本编译整个 STELLOPT 套件
docker buildx build --file Dockerfile_STELLOPT --tag stellopt .
# 进入容器
docker run -it stellopt:latest bash
```

创建 docker 脚本, 将输入文件路径挂载到 docker 路径下, 之后每次调用这个脚本就可以。`-v` 指的是把当前目录挂载到 docker 的 `/test` 下, `-w` 是切换工作路径到 `/test`, 之后跟镜像名字和运行的程序

```bash
docker run --rm \
  -v "$PWD":/test/ \
  -w /test \
  stellopt:latest \
  /home/STELLOPT/bin/xvmec2000 "$@"
```
测试文件在[这里](https://princetonuniversity.github.io/STELLOPT/VMEC)
```bash
../vmec input.test0527
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIwNDg3OTkyNF19
-->