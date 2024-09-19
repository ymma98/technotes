# 琐碎的 Mathematica 使用

* 快速给定两点求直线方程表达式 -> 求插值函数问题
```Mathematica
Simplify[InterpolatingPolynomial[{{-2.0, 10^4}, {-1.95, 1}}, x]]
```
* 分段函数
```Mathematica
Module[{x0 = 1, c, a}, a = 3; c = Exp[a*x0];
 Plot[Piecewise[{{Exp[a*x], x <= x0}, {-Log[x] + c, x > x0}}], {x, -1,
    10}, PlotRange -> All]]
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbOTQwNzMzMjAzLDEyMTEyNjM0MDRdfQ==
-->