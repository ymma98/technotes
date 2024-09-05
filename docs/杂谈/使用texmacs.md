# 使用texmacs

## Remark
texmacs 的适用范围:

* 文档内容较少, 比如 $\leq10$ 页。文档太长的话会很卡 (不知道怎么解决...)
* 对文档的格式有一定要求, 但没有过高的要求 (对格式要求较多的话只能用 latex, 或耐着性子调 word)
* 敲公式尤其舒适!

总之, 如果想以最快的速度, 形成一篇排版尚可的文档, 而且该文档中包含较多的公式, texmacs 就是最好的选择！非常适合记笔记, 尤其是数学笔记。

## Enunciations

`Insert -> Enunciation -> ...`

* Theorem.  最重要的, 最抽象的, 高度数学化的, 最正确的结论。
* Proposition. 命题, 不如 theorem 抽象和重要的, 但也相对重要的结论。
* Lemma. 引理。相对简单或次要的结论, 用于证明其它的 proposition 和 theorem.
* Corollary. 推论。可以根据 theorem 和 proposition 快速推出来的结论。
* Proof
---
* Axiom. 公理。没有证明但假设为真的陈述/结论。
* Definition. 数学定义。
* Notation. 记号。规定所用的符号或表达式的形式。
* Convention. 特定领域的约定俗成的 rules. 
---
* Remark. 想写什么写什么。
* Note
* Example
* Warning
* Acknowledgments
---
* Exercise
* Problem 
* Qeustion
* Solution
* Answer

## 必知必会

* 插入 Appendix
	* `\section` -> 在工具栏中光标停留在 `structured variant` 之后选择 section 的类型为 `Appendix` 。同理也可以选择 `Chapter`, `Subsection`, `Paragraph` 等等。
* 多行公式的排版主要靠插入 `plain tabular` 解决, 但这也会造成和 latex 不兼容。单行公式可以很方便地导出为 latex 格式。
* 进入公式环境之后, 敲公式的方法和 latex 差不多。也可以用鼠标点点点。


## 快捷键

| shortcut | action |
|--|--|
| ctrl + shift + R | 更新 bib 引用 |
| \section  | 插入新章节 |
| \equation  | 插入带标号的公式 |
| \vect  | 插入矢量箭头符号, 或 `Insert -> Accent above -> Vector` |
| \label + 回车 | 插入 label |
| \ref + 回车 | 填入和 label 相同的内容即可引用 |





<!--stackedit_data:
eyJoaXN0b3J5IjpbLTExNDAyODM2MDYsLTM1MjAzNzQxNiwtNz
IwNzgxNzgyXX0=
-->