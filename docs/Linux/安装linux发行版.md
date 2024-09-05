# 安装 linux 发行版

## 启动盘

使用 `ventoy` 制作启动盘:

```bash
https://www.ventoy.net/cn/index.html
```

## arch 装机

参考教程

```bash
https://archlinuxstudio.github.io/ArchLinuxTutorial/#/
```




## Manjaro 装机

参考:

```bash
https://github.com/orangbus/Tool
```



中文输入法

```bash
https://arch.icekylin.online/rookie/desktop-env-and-app.html#_12-2-%E8%8B%A5%E4%BD%BF%E7%94%A8-ext4-%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F
```



选择清华源:

```bash
sudo pacman-mirrors -i -c China -m rank   
```

添加中文社区仓库 (**这条还是不要做了**):

```bash
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```



多版本软件用 spack



用 yay 安装 aur 容易挂掉

```bash
cd ~/build
git clone https://aur.archlinux.org/package_name.git
cd package_name
makepkg -si
pacman -U package_name-version-architecture.pkg.tar.zst

https://wiki.archlinux.org/title/Arch_User_Repository#Installing_and_upgrading_packages
```



Manjaro 自带的 pamac 图形化包管理器在设置中即可开启 AUR 支持。命令行下我选用了 [yay](https://github.com/Jguer/yay)，可以直接从官方 community 仓库中安装：

```
# 后面那个是编译包时需要的一些工具，不然会报错缺少 fakeroot 之类的
sudo pacman -S yay base-devel

# 设置 AUR 清华镜像源
yay --aururl "https://aur.tuna.tsinghua.edu.cn" --save

# 开启 pacman 和 yay 的彩色输出
sudo sed -i "s/#Color/Color/g" /etc/pacman.conf
```





安装google chrome

```bash
git clone https://aur.archlinux.org/google-chrome.git
cd google-chrome
makepkg -si
```



安装 wps

```bash
sudo pacman -S wps-office
sudo pacman -S ttf-wps-fonts
```





翻墙:

安装(在下面这个网页上搜索安装 v2rayA):

https://arch.icekylin.online/rookie/transparent.html#%F0%9F%94%96-%E8%BF%99%E4%B8%80%E8%8A%82%E5%B0%86%E4%BC%9A%E8%AE%A8%E8%AE%BA

v2raya + switchomega 配合使用教程:

https://zhuanlan.zhihu.com/p/414998586





pdf:

```bash
编辑 pdf:
libreoffice --draw pdf_file
查看 pdf:
okular pdf_file
```



matlab:

```bash
If you are using MATLAB(>=2022a), follow these steps...
cd <matlab installer root directory>
cd /bin/glnxa64
ls | grep libfreetype
mkdir exclude
mv libfreetype.so.x.xx.x exclude/
```





#### matlab 字体问题:

```bash
解决方案在这个网站上:
https://panqiincs.me/2019/06/05/after-installing-manjaro/

首先安装如下字体：
sudo pacman -S ttf-roboto noto-fonts ttf-dejavu
# 文泉驿
sudo pacman -S wqy-bitmapfont wqy-microhei wqy-microhei-lite wqy-zenhei
# 思源字体
sudo pacman -S noto-fonts-cjk adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts

创建文件:~/.config/fontconfig/fonts.conf
写入如下配置:
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">

<fontconfig>

    <its:rules xmlns:its="http://www.w3.org/2005/11/its" version="1.0">
        <its:translateRule translate="no" selector="/fontconfig/*[not(self::description)]"/>
    </its:rules>

    <description>Manjaro Font Config</description>

    <!-- Font directory list -->
    <dir>/usr/share/fonts</dir>
    <dir>/usr/local/share/fonts</dir>
    <dir prefix="xdg">fonts</dir>
    <dir>~/.fonts</dir> <!-- this line will be removed in the future -->

    <!-- 自动微调 微调 抗锯齿 内嵌点阵字体 -->
    <match target="font">
        <edit name="autohint"> <bool>false</bool> </edit>
        <edit name="hinting"> <bool>true</bool> </edit>
        <edit name="antialias"> <bool>true</bool> </edit>
        <edit name="embeddedbitmap" mode="assign"> <bool>false</bool> </edit>
    </match>

    <!-- 英文默认字体使用 Roboto 和 Noto Serif ,终端使用 DejaVu Sans Mono. -->
    <match>
        <test qual="any" name="family">
            <string>serif</string>
        </test>
        <edit name="family" mode="prepend" binding="strong">
            <string>Noto Serif</string>
        </edit>
    </match>
    <match target="pattern">
        <test qual="any" name="family">
            <string>sans-serif</string>
        </test>
        <edit name="family" mode="prepend" binding="strong">
            <string>Roboto</string>
        </edit>
    </match>
    <match target="pattern">
        <test qual="any" name="family">
            <string>monospace</string>
        </test>
        <edit name="family" mode="prepend" binding="strong">
            <string>DejaVu Sans Mono</string>
        </edit>
    </match>

    <!-- 中文默认字体使用思源宋体,不使用 Noto Sans CJK SC 是因为这个字体会在特定情况下显示片假字. -->
    <match>
        <test name="lang" compare="contains">
            <string>zh</string>
        </test>
        <test name="family">
            <string>serif</string>
        </test>
        <edit name="family" mode="prepend">
            <string>Source Han Serif CN</string>
        </edit>
    </match>
    <match>
        <test name="lang" compare="contains">
            <string>zh</string>
        </test>
        <test name="family">
            <string>sans-serif</string>
        </test>
        <edit name="family" mode="prepend">
            <string>Source Han Sans CN</string>
        </edit>
    </match>
    <match>
        <test name="lang" compare="contains">
            <string>zh</string>
        </test>
        <test name="family">
            <string>monospace</string>
        </test>
        <edit name="family" mode="prepend">
            <string>Noto Sans Mono CJK SC</string>
        </edit>
    </match>

    <!-- 把Linux没有的中文字体映射到已有字体，这样当这些字体未安装时会有替代字体 -->
    <match target="pattern">
        <test qual="any" name="family">
            <string>SimHei</string>
        </test>
        <edit name="family" mode="assign" binding="same">
            <string>Source Han Sans CN</string>
        </edit>
    </match>
    <match target="pattern">
        <test qual="any" name="family">
            <string>SimSun</string>
        </test>
        <edit name="family" mode="assign" binding="same">
            <string>Source Han Serif CN</string>
        </edit>
    </match>
    <match target="pattern">
        <test qual="any" name="family">
            <string>SimSun-18030</string>
        </test>
        <edit name="family" mode="assign" binding="same">
            <string>Source Han Serif CN</string>
        </edit>
    </match>
    
    <!-- Load local system customization file -->
    <include ignore_missing="yes">conf.d</include>
    <!-- Font cache directory list -->
    <cachedir>/var/cache/fontconfig</cachedir>
    <cachedir prefix="xdg">fontconfig</cachedir>
    <!-- will be removed in the future -->
    <cachedir>~/.fontconfig</cachedir>

    <config>
        <!-- Rescan in every 30s when FcFontSetList is called -->
        <rescan> <int>30</int> </rescan>
    </config>

</fontconfig>
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTMxNzQ3ODg1NV19
-->