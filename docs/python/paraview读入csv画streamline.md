# paraview读入csv画streamline

* 首先将数据从 $(r,z,\zeta)$ 坐标系转换到 $(r,\theta, z)$ 坐标系, 并存储为 csv 格式

$$
\begin{aligned}
x &= r \cos\theta \\
y &= r \sin\theta \\
z &= z \\
B_x &= B_r \cos\theta - B_\theta \sin \theta \\
B_y &= B_r \sin\theta + B_\theta \cos \theta \\
B_z &= B_z
\end{aligned}
$$

```python
def save_1d_flatten_data(dump_name):
    phi1d = np.linspace(0., np.pi *2., num=phi_num, endpoint=False)
    theta1d = -phi1d
    dump0 = pynim.DumpFile(dump_path+dump_name, nxbl, nybl, tor_angle=0.)
    time = dump0.t
    r2d, z2d = dump0.get_rz()
    Nr, Nz = r2d.shape
    x = np.zeros((phi_num, Nr, Nz))
    y = np.zeros((phi_num, Nr, Nz))
    z = np.zeros((phi_num, Nr, Nz))
    bx = np.zeros((phi_num, Nr, Nz))
    by = np.zeros((phi_num, Nr, Nz))
    bz = np.zeros((phi_num, Nr, Nz))

    for i in range(phi1d.shape[0]):
        print ("for tot data, phi_index=%d" % (i))
        dump = pynim.DumpFile(dump_path+dump_name, nxbl, nybl, tor_angle=phi1d[i])
        r2d, z2d = dump.get_rz()
        _, _, br2d_tot = dump.get_br2d()
        _, _, bz2d_tot = dump.get_bz2d()
        _, _, bt2d_tot = dump.get_bt2d()
        btheta2d_tot = -bt2d_tot
        x[i] = r2d * np.cos(theta1d[i])
        y[i] = r2d * np.sin(theta1d[i])
        z[i] = z2d
        bx[i] = br2d_tot * np.cos(theta1d[i]) - btheta2d_tot * np.sin(theta1d[i])
        by[i] = br2d_tot * np.sin(theta1d[i]) + btheta2d_tot * np.cos(theta1d[i])
        bz[i] = bz2d_tot

    x = x.ravel()
    y = y.ravel()
    z = z.ravel()
    bx = bx.ravel()
    by = by.ravel()
    bz = bz.ravel()

    points = np.c_[x, y, z]
    unique_points, indices = np.unique(points, axis=0, return_index=True)
    x, y, z = unique_points[:, 0], unique_points[:, 1], unique_points[:, 2]
    bx, by, bz = bx[indices], by[indices], bz[indices]

    # 将数据组合成一个 DataFrame
    df = pd.DataFrame({
        'x': x,
        'y': y,
        'z': z,
        'bx': bx,
        'by': by,
        'bz': bz
    })

    df.to_csv(dump_name + '.csv', index=False)
```

* paraview 读取 csv 数据ge'shi


<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQ4Mzk0OTE2MiwtMTczMjE1OTAyLC0xND
I1NzA2MDExLC02MzkwMDUzODldfQ==
-->