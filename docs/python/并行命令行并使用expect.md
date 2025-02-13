# 并行命令行并使用expect

* 记得 `pexpect.spawn` 设置合理的 `timeout`
*  如果 `pexepct` 运行的命令有创建临时文件的操作, 需要单独为每个进程单独创建一个文件夹


```python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os
import pexpect
from glob import glob
import multiprocessing
import tempfile
import shutil

script_dir = os.path.dirname(os.path.abspath(__file__))

data_path = os.path.join(script_dir, 'data')
savevtk_path = os.path.join(script_dir, 'vtk3dcartesian')

drawcon_in = '/home/ymma/lvdata/libs/draw/drawcon.in'
nimrod_in = os.path.join(script_dir, 'nimrod.in')  # nimplot 需要的文件

if not os.path.exists(savevtk_path):
    os.makedirs(savevtk_path)

# 生成 dump 文件列表（最好转换为绝对路径）
dump_list = [os.path.abspath(p) for p in glob(os.path.join(data_path, '*dump*.*'))]

def process_dump(dump_name):
    # 为每个 nimplot 运行创建一个独立的临时工作目录
    tmp_dir = tempfile.mkdtemp(prefix='nimplot_')
    try:
        print("Processing {} in temporary directory: {}".format(dump_name, tmp_dir))
        
        # 将必需的 nimrod.in 文件复制到临时目录中
        if os.path.exists(nimrod_in):
            shutil.copy(nimrod_in, tmp_dir)
        else:
            print("Warning: {} not found.".format(nimrod_in))
        
        # 启动 nimplot，指定工作目录为临时目录
        child = pexpect.spawn('nimplot', cwd=tmp_dir, timeout=400)
        
        child.expect('hit return to just create the xdraw binary files')
        child.sendline('xdraw')
    
        child.expect('files that will be read, or enter another input file name')
        child.sendline('')  # 回车
    
        child.expect('91: Toggle jfromb call OFF for data plots')
        child.sendline('4')
    
        child.expect('For a long list, suspend nimplot, type')
        child.sendline(dump_name)  # dump_name 已经是绝对路径
        child.sendline('')
    
        child.expect('t: same as p, but transform vector')
        child.sendline('t')
    
        child.expect('Please enter the desired periodic coorindate increment')
        child.sendline('0.02')
    
        child.expect('and zero the equilibrium arrays for these plots')
        child.sendline('y')
    
        child.expect('Enter the name of the draw')
        child.sendline(drawcon_in)
    
        child.expect('Enter a file name for an ascii version of')
        vtk_filename = os.path.join(savevtk_path, "{}.3d.cartesian.vtk".format(os.path.basename(dump_name)))
        child.sendline(vtk_filename)
    
        child.expect('Hit return to return to the data selection level')
        child.sendline('')
        child.expect('Data Options:')
        child.sendline('')
        child.expect('91: Toggle jfromb call OFF for data plots')
        child.sendline('0')
    
        print("Successfully generated: {}".format(vtk_filename))
        child.close()
    except pexpect.exceptions.ExceptionPexpect as e:
        print("Failed to process {}: {}".format(dump_name, e))
    finally:
        # 处理完毕后删除临时目录
        shutil.rmtree(tmp_dir)

def main():
    pool = multiprocessing.Pool(processes=20)
    pool.map(process_dump, dump_list)

if __name__ == "__main__":
    main()
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbNDYwOTU1MjE4LDE1MzI4ODQ2ODUsLTEwMT
kzMTQ2MzQsLTEzNTk5NTI3MThdfQ==
-->