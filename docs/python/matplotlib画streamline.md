# 画 streamline


matplotlib 画 streamplot 的功能**非常不好用**。matplotlib 不仅画 3d 的图非常弱，画 streamplot 的功能也很弱。

#### 举例, 对于矢量场数据，(`x2d`, `y2d`, `vecx2d`, `vecy2d`):
```python
sp =  np.array(list(zip(np.array([0.1] * 15), np.arange(np.amin(r2d), np.amax(r2d), 0.01))))  # python3
sp =  np.array(zip(np.array([0.1] * 15), np.arange(np.amin(r2d), np.amax(r2d), 0.01)))  # python2
ax.streamplot(x2d, y2d, vecx2d, vecy2d, arrowstyle='-'. density=(1.2, 0.3),\
			  start_points=sp, color='k', linewidth=0.5)
```

#### 对于 python2 的 streamplot，具有以下缺点:
* 默认画出来的 streamline 是断断续续的。可能的原因是在追踪 streamline 时如果检测到路径经过的 grid cell 中已经有了一个 stream line, 那么正在追踪的这个 line 就会认为与上一条 line 太近，[进而导致正在追踪的 line break 掉](https://github.com/matplotlib/matplotlib/issues/8388/)
	* 这个问题没有根本的解决办法 ! 有两种改善的方式
	* A. 增大 `density` 参数，但是该 break 还是 break, 只是看起来不是那么明显。缺点也是显而易见的，线太密了不仅导致画图非常慢，而且导致画出来的图非常丑陋。相当于为了掩盖问题引入了更大的问题
	* B. 设置合理的 `start_points`. 当 streamline 的 start points 设置合理时，这个方法是有用的。 但这是很坑的，不同的 vector field 显然需要不同的 start_point, 所以画每一张图的时候都要花费海量的时间，而且程序没有通用性，想批量画图是不可能的。

#### 对于 python3 的 streamplot, 具有以下缺点:
* python3 的 streamplot 新增了参数 `broken_streamlines`。当 `broken_streamlines=False` 的时候画出来的 stream line 不会 break. 看起来很美好，解决了python2 的 streamplot 的“痛点”，对吧？
	* 但是！！！到了特定的情况这个功能还是中看不中用！比如我有柱坐标系下的 $\theta=0$ 和 $\theta=\pi$ 的矢量场数据，`(r2d, z2d, vecr2d_0, vecz2d_0)` 和 `(r2d, z2d, vecr2d_pi, vecz2d_pi)`。很自然的，我想画一个圆柱 (r,z) 面的 cross section。但是即使把 `broken_streamlines=False` 安排上，画出来在 $r=0$ 这条边还是 break 掉的
* python 2 的 stream plot 画 $r<0$ 的下半边的图像时不需要逆序 `r2d`。但是对于 python3 的 matplotlib, **不允许输入行或列方向递减的网格数据 。** 比如第一行是 -1, 第二行是 -2 是不行的。所以以下的程序才写为 `-(r2d_pi[::-1])`



```python
 ax1.streamplot(z2d, r2d, bz2d, br2d, arrowstyle='-', density=(1.2, 0.3), color='k', broken_streamlines=False, linewidth=0.5)
 ax1.streamplot(z2d_pi[::-1], -(r2d_pi[::-1]), bz2d_pi[::-1], -(br2d_pi[::-1]), arrowstyle='-', density=(1.2, 0.3), color='k', broken_streamlines=False, linewidth=0.5)
```
#### 对于 python2 和 python3 的 streamplot，有以下共通的特点/弱点:
* 不允许网格数据 `x2d`, `y2d` 中有重复的行和列。
* 网格必须是均匀网格

所以进一步增加了工作量... (我的网格数据中有重复的行和列，重复的行或列是挨在一起的)

删除网格和对应矢量场数据中，因为网格重复导致的重复的行和重复的列:
```python
def remove_duplicate(R, Z, br2d, bz2d):
    """ remove duplicate row of R, duplicate col of Z, for streamline plot
    """
    dup_row_idx = []
    dup_col_idx = []
    for i in range(len(R)):  # check R rows
        if i < len(R) - 2:
            if (R[i] == R[i + 1]).all():
                dup_row_idx.append(i)
    for i in range(len(Z[0])):
        if i < len(Z[0]) - 2:
            if (Z[:, i] == Z[:, i + 1]).all():
                dup_col_idx.append(i)
    R = np.delete(R, dup_row_idx, axis=0)
    Z = np.delete(Z, dup_row_idx, axis=0)
    br2d = np.delete(br2d, dup_row_idx, axis=0)
    bz2d = np.delete(bz2d, dup_row_idx, axis=0)

    R = np.delete(R, dup_col_idx, axis=1)
    Z = np.delete(Z, dup_col_idx, axis=1)
    br2d = np.delete(br2d, dup_col_idx, axis=1)
    bz2d = np.delete(bz2d, dup_col_idx, axis=1)
    return R, Z, br2d, bz2d
```
把非均匀网格的数据 (`rr, zz, br, bz`) 插值到均匀网格上: 
```python
r2d, z2d = np.meshgrid(np.linspace(np.amin(rr), np.amax(rr), int(rr.shape[0] * 0.9)), \
                           np.linspace(np.amin(zz), np.amax(zz), int(zz.shape[1] * 0.9)),indexing='ij')
br2d = griddata(np.column_stack((rr.ravel(), zz.ravel())), br.ravel(), (r2d, z2d))
bz2d = griddata(np.column_stack((rr.ravel(), zz.ravel())), bz.ravel(), (r2d, z2d))
```

#### 如果矢量场有流函数，最好还是先把流函数求出来然后画流函数的 contour

在尝试了 streamline 的 n 种难用之处后，我最后还是放弃直接画 stream line, 而是通过求流函数然后画流函数 contour 的方式等价地画矢量场的 streamline. 

在柱坐标系下，考虑环对称，则已知 $(B_r, B_z)$, 那么 $\psi$ 就是 $(B_r, B_z)$ 的流函数。$B_z = \frac{1}{r} \frac{\partial \psi}{\partial r}$, $B_r = -\frac{1}{r} \frac{\partial \psi}{\partial z}$,  有 $\psi=\int_0^r B_z r dr$。
所以, 把数据映射到均匀网格后，可以直接计算 $\psi$
```python
def get_uniform_data(rr, zz, br, bz):
    r2d, z2d = np.meshgrid(np.linspace(np.amin(rr), np.amax(rr), int(rr.shape[0] * 1.2)), \
                           np.linspace(np.amin(zz), np.amax(zz), int(zz.shape[1] * 1.2)),indexing='ij')
    br2d = griddata(np.column_stack((rr.ravel(), zz.ravel())), br.ravel(), (r2d, z2d))
    bz2d = griddata(np.column_stack((rr.ravel(), zz.ravel())), bz.ravel(), (r2d, z2d))
    return r2d, z2d, br2d, bz2d
    
# r2d, z2d, br2d, bz2d = plotfig.remove_duplicate(r2d, z2d, br2d, bz2d)
r2d, z2d, br2d, bz2d = get_uniform_data(r2d, z2d, br2d, bz2d)
psi2d = np.cumsum(bz2d*r2d, axis=0) * (r2d[1,0] - r2d[0,0])
``` 
之后直接画 $\psi$ 的 contour 就行

#### 总结
* 画 streamline 的时候，可以求出来流函数的画，就直接画流函数的 contour
* 迫不得已要调用 matplotlib 的 streamplot 的话，要注意删除网格中重复的行和列，以及把数据重新映射到均匀网格上
* python3 的 streamplot 有 broken_streamlines 这个参数，对于解决 stream plot 中 streamline 总是 break 这个问题有一定改善，但代价是，python3 的 streamplot 无法接受行或列中数据递减的网格
<!--stackedit_data:
eyJoaXN0b3J5IjpbMjA4NDg4ODk0MCwtMTU4MTM0OTYxOV19
-->