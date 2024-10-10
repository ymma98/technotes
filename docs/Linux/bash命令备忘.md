# bash命令备忘

* tar 压缩同时排除文件 (不能用 `--include`)

```bash
tar -czvf save.tar.gz --exclude='dump.[^0]*' --exclude='dump.[0][^0]*' --exclude='dump.[0][0][^0]*' --exclude='dump.[0][0][0][^0]*' --exclude='dump.[0][0][0][0][^0]*' 01/ 02/ ...
```

* 通过跳板机 B, 将文件从机器 A 传递给 C

```bash
# 首先, 设置本地端口转发, 1233 是任意指定的端口
#  `-f`: 让 ssh 命令在后台运行。
#  `-L 127.0.0.1:1233:IP-C:22`: 设置本地端口转发。这告诉 `ssh` 监听本地机器上的 1233 端口，并将所有通过这个端口的数据转发到 `IP-C` 的 22 端口。`222.20.94.38` 是最终目标服务器的 IP 地址，22 是 SSH 服务的标准端口。
ssh -f -L 127.0.0.1:1233:222.20.94.38:22 ymma98@10.13.20.2 sleep 10; rsync -auvzP -e 'ssh -p 1233' /home/ymma/00backupFinal/01_backup190/04_stab ymma@127.0.0.1:/home/ymma/lvdata/00backupFinal/01_backup190/

```

<!--stackedit_data:
eyJoaXN0b3J5IjpbNjE4NjY1NjE0LC0xOTczMDIyODQwXX0=
-->