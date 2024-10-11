# pyright

* pyright 找不到通过 `sys.path.append()` 方式添加的库

在python文件的目录中添加 `pyrightconfig.json`

```bash
{
  "extraPaths": ["/home/ymma/lvdata/libs/"]
}
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk4NDEzOTE2NV19
-->