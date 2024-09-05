# windows 中使用 latex

windows 系统中使用 latex 体验非常非常糟糕，最大的问题是编译缓慢，至少比 linux 上编译慢 2 倍以上。于是不得不把编译过程迁移到 wsl 中，在 vscode 中编写 latex 文件。

## wsl 下载 Times New Roman 字体

在使用 hust [毕业论文模板](https://github.com/Lianghao93/HUST-PhD-Thesis-Latex-v3.1) 的时候 , 发现依赖一些只有 windows 上才有的字体。

为了在 wsl 环境下依然可以使用这个模板, 要安装这些只有 windows 才有的字体。
```bash
sudo apt install ttf-mscorefonts-installer
sudo fc-cache
``` 

```bash
fc-match Arial # 查看Arial 
fc-match Times # 查看Times New Roman
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbMzYxMDg1NTA0XX0=
-->