# mpirun 报错

## ucx error

运行 openmpi 3.1.6 时，有如下报错:
```bash
mm_posix.c:195  UCX  ERROR open(file_name=/proc/211766/fd/28 flags=0x0) failed: Permission denied
mm_ep.c:149  UCX  ERROR mm ep failed to connect to remote FIFO id 0xc000000700033b36: Shared memory error
```

解决方法: [加上 `-x UCX_POSIX_USE_PROC_LINK=n` 这个 flag](https://github.com/openucx/ucx/issues/4224)
```bash
mpirun -x UCX_POSIX_USE_PROC_LINK=n program
```
`-x` 用来指定环境变量, 通过设置 `UCX_POSIX_USE_PROC_LINK=n`，等于告诉 UCX 不使用 `/proc` 下的文件，从而避免这些权限问题


<!--stackedit_data:
eyJoaXN0b3J5IjpbMjAwNTUyOTY2MywtMTg2NjUzNDA1OV19
-->