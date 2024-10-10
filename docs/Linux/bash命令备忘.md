# bash命令备忘

* tar 压缩同时排除文件 (不能用 `--include`)

```bash
tar -czvf save.tar.gz --exclude='dump.[^0]*' --exclude='dump.[0][^0]*' --exclude='dump.[0][0][^0]*' --exclude='dump.[0][0][0][^0]*' --exclude='dump.[0][0][0][0][^0]*' 01/ 02/ ...
```

* 通过跳板机 B, 将文件从机器 A 传递给 C

```bash

```

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQ1MDIwMjk4NSwtMTk3MzAyMjg0MF19
-->