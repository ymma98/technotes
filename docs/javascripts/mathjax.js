/*
ref: https://squidfunk.github.io/mkdocs-material/reference/math/
https://docs.mathjax.org/en/latest/input/tex/extensions/mathtools.html
*/
window.MathJax = {
  loader: {load: ['[tex]/mathtools']},
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    packages: {'[+]': ['mathtools']},
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

MathJax = {
  tex: {
    mathtools: {
      multlinegap: '1em',
      multlined-pos: 'c',
      firstline-afterskip: '',
      lastline-preskip: '',
      smallmatrix-align: 'c',
      shortvdotsadjustabove: '.2em',
      shortvdotsadjustbelow: '.2em',
      centercolon: false,
      centercolon-offset: '.04em',
      thincolon-dx: '-.04em',
      thincolon-dw: '-.08em',
      use-unicode: false,
      prescript-sub-format: '',
      prescript-sup-format: '',
      prescript-arg-format: '',
      allow-mathtoolsset: true,
      pairedDelimiters: {},
      tagforms: {}
    }
  }
};

document$.subscribe(() => { 
  MathJax.startup.output.clearCache()
  MathJax.typesetClear()
  MathJax.texReset()
  MathJax.typesetPromise()
})
