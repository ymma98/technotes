# windows 中使用 latex

windows 系统中使用 latex 体验非常非常糟糕，最大的问题是编译缓慢，至少比 linux 上编译慢 2 倍以上。于是不得不把编译过程迁移到 wsl 中，在 vscode 中编写 latex 文件。

## wsl 下载 Times New Roman 字体

在使用 hust [毕业论文模板](https://github.com/Lianghao93/HUST-PhD-Thesis-Latex-v3.1) 的时候 , 发现依赖一些只有 windows 上才有的字体。

为了在 wsl 环境下依然可以使用这个模板, 要安装这些只有 windows 才有的字体。
```bash
sudo apt install ttf-mscorefonts-installer
sudo fc-cache
``` 

```bash
fc-match Arial # 查看Arial 
fc-match Times # 查看Times New Roman
```


## vscode-latex


```json
    "latex-workshop.latex.autoBuild.run": "never",  // 是否自动编译latex
    "latex-workshop.showContextMenu": true,
    "latex-workshop.intellisense.package.enabled": true,
    "latex-workshop.message.error.show": false,        // 关闭弹窗error
    "latex-workshop.message.warning.show": false,      // 关闭弹窗error
    "latex-workshop.message.badbox.show": false,  // 不显示 Underfull \hbox (badness 10000)
    "latex-workshop.latex.tools": [
        {
            "name": "xelatex",
            "command": "xelatex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "%DOCFILE%"
            ],
        },
        {
            "name": "pdflatex",
            "command": "pdflatex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "%DOCFILE%"
            ]
        },
        {
            "name": "latexmk",
            "command": "latexmk",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-pdf",
                "-outdir=%OUTDIR%",
                "%DOCFILE%"
            ]
        },  
        {
            "name": "bibtex",
            "command": "bibtex",
            "args": [
                "%DOCFILE%"
            ]
        }
    ],
    "latex-workshop.latex.recipes": [
        {
            "name": "XeLaTeX",
            "tools": [
                "xelatex"
            ]
        },
        {
            "name": "PDFLaTeX",
            "tools": [
                "pdflatex"
            ]
        },
        {
            "name": "BibTeX",
            "tools": [
                "bibtex"
            ]
        },
        {
            "name": "LaTeXmk",
            "tools": [
                "latexmk"
            ]
        },
        {
            "name": "xelatex -> bibtex -> xelatex*2",
            "tools": [
                "xelatex",
                "bibtex",
                "xelatex",
                "xelatex"
            ]
        },
        {
            "name": "pdflatex -> bibtex -> pdflatex*2",
            "tools": [
                "pdflatex",
                "bibtex",
                "pdflatex",
                "pdflatex"
            ]
        },

        {"name": "xelatex*2",
            "tools": [
                "xelatex","xelatex"
            ]
        },
    ],
    "latex-workshop.latex.clean.fileTypes": [
        "*.aux",
        "*.bbl",
        "*.blg",
        "*.idx",
        "*.ind",
        "*.lof",
        "*.lot",
        "*.out",
        "*.toc",
        "*.acn",
        "*.acr",
        "*.alg",
        "*.glg",
        "*.glo",
        "*.gls",
        "*.ist",
        "*.fls",
        "*.log",
        "*.fdb_latexmk"
    ],
    "latex-workshop.latex.autoClean.run": "onFailed",
    "latex-workshop.latex.recipe.default": "lastUsed",
    "latex-workshop.view.pdf.internal.synctex.keybinding": "double-click",

```
<!--stackedit_data:
eyJoaXN0b3J5IjpbNjcxMDMyMzk3LDM2MTA4NTUwNF19
-->