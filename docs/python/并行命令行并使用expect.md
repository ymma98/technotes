# 并行命令行并使用expect


```python
# -*- coding: utf-8 -*-
import os
import pexpect
from glob import glob
import multiprocessing

data_path = './data'
savevtk_path = './vtk3dcartesian'
drawcon_in = r'/home/ymma/lvdata/libs/draw/drawcon.in'

if not os.path.exists(savevtk_path):
    os.makedirs(savevtk_path)

dump_list = glob(os.path.join(data_path, 'dump.*'))

def process_dump(dump_name):
    try:
        print "Processing {}...".format(dump_name)

        # 启动 nimplot 程序
        child = pexpect.spawn('nimplot',timeout=320,env=os.environ)

        # 交互步骤，模拟用户输入
        child.expect('hit return to just create the xdraw binary files')
        child.sendline('xdraw')

        child.expect('files that will be read, or enter another input file name')
        child.sendline('')  # 回车


        child.expect('91: Toggle jfromb call OFF for data plots')
        child.sendline('4') 

        child.expect('For a long list, suspend nimplot, type')
        child.sendline(dump_name)
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

        print "Successfully generated: {}".format(vtk_filename)
        child.close()
    except pexpect.exceptions.ExceptionPexpect as e:
        print "Failed to process {}: {}".format(dump_name, e)

def main():
    pool = multiprocessing.Pool(processes=50)
    pool.map(process_dump, dump_list)

if __name__ == "__main__":
    main()
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIxMjA5MjQ5MTRdfQ==
-->