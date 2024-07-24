# 没有管理员权限安装htop

* 安装依赖 `ncurses`
```bash
wget https://ftp.gnu.org/pub/gnu/ncurses/ncurses-6.3.tar.gz
tar xzf ncurses-6.3.tar.gz
cd ncurses-6.3
./configure --prefix=$HOME/local --with-shared --enable-widec --with-termlib --enable-termcap
make 
make install
```
* 安装 `htop`
```bash
curl -LO https://github.com/htop-dev/htop/archive/refs/tags/3.1.2.tar.gz
tar -xzvf 3.1.2.tar.gz
cd htop-3.1.2
./autogen.sh
./configure --prefix=$HOME/local --enable-unicode CFLAGS="-I$HOME/local/include" LDFLAGS="-L$HOME/local/lib"
make
make install
```

* 更新环境变量
```bash
export PATH="$HOME/local/bin:$PATH"
export LD_LIBRARY_PATH="$HOME/local/lib:$LD_LIBRARY_PATH"
```




<!--stackedit_data:
eyJoaXN0b3J5IjpbNjIwMjI2OTVdfQ==
-->