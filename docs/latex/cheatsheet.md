# cheatsheet

## 字体大小

```tex
\tiny
\scriptsize
\footnotesize
\small
\normalsize
\large
\Large
\LARGE
\huge
\Huge
```

## 检查 bib file 中没被引用的文献

```bash
checkcites my_document.aux
```

## includeonly

```latex
\documentclass{book}

% 只编译 introduction 和 chapter1
\includeonly{introduction,chapter1}

\begin{document}

\include{introduction} % 这个会被编译
\include{chapter1}     % 这个也会被编译
\include{chapter2}     % 这个不会被编译

\end{document}
```

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTMwNzM1OTU3MV19
-->