# Gaussian SI 单位制转换

看论文的时候经常会看到 Gaussian 单位制的表达式/公式，如果按照 NRL formulary 里面给的方法还是有些繁琐了。如下 (注意 Gaussian $\rightarrow$ SI: $c \rightarrow (\epsilon_0\mu_0)^{-1/2}\alpha$)：

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20241021/image.6m3w9oju91.webp)

比如,
 
$$
\frac{B^2}{8\pi} (Gaussian) = \frac{B^2 4\pi\beta}{\alpha^3 \mu_0 8 \pi} (SI)= \frac{B^2}{2\mu_0}\cdot \frac{\beta}{\alpha^3} (SI)
$$
如果是等式的话， $\beta/\alpha^3$ 就会消掉。

除了以上方法，还有一种新方法，参考这篇文章:
* An easy method for converting equations between SI and Gaussian units, Yuntung Lau, American Journal of Physics 56, 135 (1988); doi: 10.1119/1.15691

记住以下映射表:

$$
\begin{aligned}
& \text{SI} \leftrightarrow \text{Gaussian} \\
& 4 \pi \epsilon_0 \leftrightarrow 1, \\
& 1 \leftrightarrow 4 \pi \epsilon_0, \\
& c \mathbf{B} \leftrightarrow \mathbf{B}, \\
& 4 \pi \mathbf{D} \leftrightarrow \mathbf{D}, \\
& 4 \pi \mathbf{H} / c \leftrightarrow \mathbf{H}, \\
& \mathbf{M} / c \leftrightarrow \mathbf{M},
\end{aligned}
$$

以及
$$
c^2=\left(\epsilon_0 \mu_0\right)^{-1}
$$

以及所有出现 $\epsilon$ 的地方都要凑成

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTY3NDM5ODc1OCw2Nzc0MDM4NiwyMDMzOD
g3Mjg2LDE2NTc4MDYxMTcsMTY4Mjc3NTg5MSwyMTEzOTIwODY4
XX0=
-->