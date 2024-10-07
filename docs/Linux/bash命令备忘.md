# bash命令备忘

* tar 压缩同时排除文件 (不能用 `--include`)

```bash
tar -czvf save.tar.gz --exclude='dump.[^0]*' --exclude='dump.[0][^0]*' --exclude='dump.[0][0][^0]*' --exclude='dump.[0][0][0][^0]*' --exclude='dump.[0][0][0][0][^0]*' 01/ 02/ ...
```



<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE5NzMwMjI4NDBdfQ==
-->