# Gaussian SI 单位制转换

看论文的时候经常会看到 Gaussian 单位制的表达式/公式，需要转换为 SI 格式。有两类方法，下面列出的第一种方法是最方便的，但只应用于等式。

## 便捷方法 (equation)

参考这篇文章:

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
& \mathbf{M} / c \leftrightarrow \mathbf{M}, \\
& c \mathbf{A} \leftrightarrow  \mathbf{A} \\
& \mathbf{E} \leftrightarrow \mathbf{E}
\end{aligned}
$$

以及
$$
c^2=\left(\epsilon_0 \mu_0\right)^{-1}
$$
并且所有出现 $\epsilon$ 的地方都要凑成 $\epsilon_0 \epsilon$；所有出现 $\mu$ 的地方都要凑成 $\mu_0 \mu$。


* example 1.
$$
\mathbf{\nabla} \times \mathbf{H}=\frac{4 \pi \mathbf{J}}{c}+\frac{\partial \mathbf{D}}{c \partial t} \quad \text{(Gaussian)}
$$

$$
\begin{aligned}
\mathbf{\nabla} \times \mathbf{H} \frac{4\pi}{c} &= \frac{4\pi}{c} \mathbf{J} + \frac{\partial \mathbf{D}}{\partial t} \frac{4\pi}{c} \\
\mathbf{\nabla} \times \mathbf{H} &= \mathbf{J} + \frac{\partial \mathbf{D}}{\partial t}  \quad \text{(SI)}
\end{aligned}
$$

* example 2.

$$
\begin{aligned}
w &=\frac{1}{4 \pi}\left(\frac{\epsilon E^2}{2}+\frac{B^2}{2 \mu}\right) \quad \text{(Gaussian)} \\
&= \frac{1}{4\pi} \frac{\epsilon \epsilon_0 E^2}{2\epsilon_0} + \frac{1}{4\pi} \frac{c^2 B^2 \mu_0}{2\mu_0 \mu} \\
&= \frac{\epsilon \epsilon_0 E^2}{2} + \frac{B^2}{2\mu_0 \mu} \quad \text{(SI)}
\end{aligned}
$$


* example 3. (skin depth)

$$
\begin{aligned}
\delta&=\left(c^2 / 2 \pi \omega \mu \sigma\right)^{1 / 2} \quad \text{(Gaussian)} \\
&= \left(\frac{2}{\epsilon_0 \mu_0 4\pi \omega \mu \sigma}\right)^{1/2} \\
&= \left(\frac{2}{\mu_0 \omega \mu \sigma}\right)^{1/2} \quad \text{(SI)}
\end{aligned}
$$


## 最通用方法 (equation，expression 都可以)



NRL formulary 给出的公式如下 (注意 Gaussian $\rightarrow$ SI: $c \rightarrow (\epsilon_0\mu_0)^{-1/2}\alpha$)：

![输入图片说明](https://github.com/ymma98/picx-images-hosting/raw/master/20241021/image.6m3w9oju91.webp)

比如,
$$
\frac{B^2}{8\pi} (\text{Gaussian}) = \frac{B^2 4\pi\beta}{\alpha^3 \mu_0 8 \pi} (\text{SI})= \frac{B^2}{2\mu_0}\cdot \frac{\beta}{\alpha^3} (\text{SI})
$$
如果是等式的话， $\beta/\alpha^3$ 就会消掉。

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTAwOTE2NzQ0NCwtNTkwMDIzMDIwLDU1MD
M4NDcyNiwtNTAzODAwMjk4LC0yMDk5MDgxMDE3LC0xMDUzODIx
MDE0LDY3NzQwMzg2LDIwMzM4ODcyODYsMTY1NzgwNjExNywxNj
gyNzc1ODkxLDIxMTM5MjA4NjhdfQ==
-->