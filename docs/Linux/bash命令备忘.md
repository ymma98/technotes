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
$ ls
08_pert2e-3_tol1e-8_parv3e3_my96_eta-full_nl1.4e4_pres12600/  08_pert2e-3_tol1e-8_parv3e3_my96_eta-full_nl2e4_pres18000/  08_pert2e-3_tol1e-8_parv3e3_my96_eta-full_nl8e3_pres7200/
08_pert2e-3_tol1e-8_parv3e3_my96_eta-full_nl1e4_pres9000/     08_pert2e-3_tol1e-8_parv3e3_my96_eta-full_nl4e3_pres3600/   checkminmax.py
08_pert2e-3_tol1e-8_parv3e3_my96_eta-full_nl2e3_pres1800/     08_pert2e-3_tol1e-8_parv3e3_my96_eta-full_nl6e3_pres5400/   prun.sh

运行
$ for dir in $(ls -d */);do  mv $dir "${dir/tol1e-8/tol1e-7}";done
就会把 tol1e-8 替换为 tol1e-7
```

* 统一替换文件夹内某个文件的内容

```bash
$ sed -i 's/tol=1.0e-8/tol=1.0e-7/g' */input.in

-i 的意思是直接更改文件, g 是 global
```


* 命令行拷贝路径到系统剪贴板

```bash
alias cpwd=" pwd | xsel --clipboard --input"
```

如果这行命令失效 (windows + wsl + Xlaunch), 就 **重启XLaunch**。


* 参数匹配, 截取 `prefix`, `postfix`

```bash
#!/bin/bash

# 指定 vtk 文件所在的目录
vtk_dir="./vtk3dcartesian/"

# 遍历所有 vtk 文件
for vtk_path in "$vtk_dir"/*.vtk; do
    # 取得文件名（去掉路径）
    filename=$(basename "$vtk_path")
    # <prefix>.<number>.3d.cartesian.vtk 
    # "${var%%pattern}" 是一种参数扩展语法，
    # 用来从 变量 var 的值 中，匹配并删除最长的、位于末尾的 pattern
    prefix="${filename%%.*}"
    
    # "${var#pattern}" 同样是一种参数扩展，用来从 变量 var 的值中，
    # 匹配并删除最短的、位于开头的 pattern
    rest="${filename#*.}"
    
    number="${rest%%.*}"
    
    # 构造输出 csv 文件名：<prefix>.<number>.y0slice.ynorm1.csv
    csv_file="${prefix}.${number}.y0slice.ynorm1.csv"
    
    echo "Processing $filename -> $csv_file"
    
    # 并行执行命令（在后台运行），根据需要可以使用 & 让它们同时运行
    /opt/software/ParaView-5.11.0-RC2-MPI-Linux-Python3.9-x86_64/bin/pvpython autoparaviewslice.py "$filename" "$csv_file" &
done

# 等待所有后台任务结束
wait

echo "All tasks finished."
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzOTgwMDQ2MjAsMTcxNzY0OTA0MiwxNj
M5NjY2NjM5LDc1ODA1MjAxMyw0MDI0MDMxNjAsLTE5NzMwMjI4
NDBdfQ==
-->