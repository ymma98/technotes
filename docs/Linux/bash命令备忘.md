# bash命令备忘

* tar 压缩同时排除文件 (不能用 `--include`)

```bash
tar -czvf save.tar.gz --exclude='dump.[^0]*' --exclude='dump.[0][^0]*' --exclude='dump.[0][0][^0]*' --exclude='dump.[0][0][0][^0]*' --exclude='dump.[0][0][0][0][^0]*' 01/ 02/ ...
```

* 通过跳板机 B, 将文件从目前的机器 A 传递给 C。比如 B 是一台自己的电脑，A 和 C 是两个集群，A, C 之间互相无法通讯

```bash
# B: ymma98@10.13.20.2
# A: this machine
# C: 222.20.94.38:22
ssh -f -L 127.0.0.1:1233:222.20.94.38:22 ymma98@10.13.20.2 sleep 10; rsync -auvzP -e 'ssh -p 1233' /file/ ymma@127.0.0.1:/remote/dir/
```

* 使用 `htop`

```bash
# : 折叠 cpu 使用情况
> : 选择按什么进行排序
```

* 统一替换文件夹名字

```bash
举例:

```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTQ4Njk4NDY1NCw3NTgwNTIwMTMsNDAyND
AzMTYwLC0xOTczMDIyODQwXX0=
-->