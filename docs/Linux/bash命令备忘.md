# bash命令备忘

* tar 压缩同时排除文件 (不能用 `--include`)

```bash
tar -czvf save.tar.gz --exclude='dump.[^0]*' --exclude='dump.[0][^0]*' --exclude='dump.[0][0][^0]*' --exclude='dump.[0][0][0][^0]*' --exclude='dump.[0][0][0][0][^0]*' 01/ 02/ ...
```

* 通过跳板机 B, 将文件从机器 A 传递给 C

```bash
# 1233 是任意指定的端口
# 将
ssh -f -L 127.0.0.1:1233:222.20.94.38:22 ymma@211.67.27.88 sleep 10; rsync -auvzP -e 'ssh -p 1233' prj_compression/compress14_paper_20220521/paper_referee_NF_20221119 ymma@127.0.0.1:~


ip: 211.67.27.88
ssh port:22
username: ymma
password: gentle&Estate6Slum

mhd passwd:
Near=Plunge-creek


2404:
systemctl enable and start sshd
ssh -f -L 127.0.0.1:1233:222.20.94.38:22 ymma98@10.13.22.35 sleep 10; rsync -auvzP -e 'ssh -p 1233' pubbak  ymma@127.0.0.1:~/lvdata/


2410:
ssh -f -L 127.0.0.1:1233:222.20.94.38:22 ymma98@10.13.20.2 sleep 10; rsync -auvzP -e 'ssh -p 1233' /home/ymma/00backupFinal/01_backup190/04_stab ymma@127.0.0.1:/home/ymma/lvdata/00backupFinal/01_backup190/

```

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk0OTg0Mzc0NiwtMTk3MzAyMjg0MF19
-->