# hexo-renderer-markdown-it-ex


This renderer plugin uses [Markdown-it](https://github.com/markdown-it/markdown-it) as a render engine on [Hexo]. 

This renderer plugin is forked from hexo-renderer-markdown-it and hexo-renderer-markdown-it-plus. 

## Installation


## Options

``` yml
markdown:
  render:
    html: false
    xhtmlOut: true
    breaks: true
    linkify: true
    typographer: 
    quotes: '“”‘’'
    tab: ''
    gutter: true
  plugins:
    - plugin:
        name: markdown-it-toc-and-anchor
        enable: true
        options:
          tocClassName: 'header-toc'
          anchorClassName: 'header-anchor'
```


## default Supported Plugins and Examples

- [markdown-it-sub](https://www.npmjs.com/package/markdown-it-sub): `H~2~0` H<sub>2</sub>O
- [markdown-it-sup](https://www.npmjs.com/package/markdown-it-sup): `29^th^` 29<sup>th</sup>
- [markdown-it-ins](https://www.npmjs.com/package/markdown-it-ins): `++inserted++` <ins>inserted</ins>
- [markdown-it-mark](https://www.npmjs.com/package/markdown-it-mark): `==marked==` <mark>marked</mark>
- [markdown-it-abbr](https://www.npmjs.com/package/markdown-it-abbr)
- [markdown-it-bracketed-spans](https://www.npmjs.com/package/markdown-it-bracketed-spans)
- [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs)
- [markdown-it-deflist](https://www.npmjs.com/package/markdown-it-deflist)
- [markdown-it-emoji](https://www.npmjs.com/package/markdown-it-emoji)
- [markdown-it-footnote](https://www.npmjs.com/package/markdown-it-footnote)
- [markdown-it-task-checkbox](https://www.npmjs.com/package/markdown-it-task-checkbox)
- [markdown-it-toc-and-anchor](https://www.npmjs.com/package/markdown-it-toc-and-anchor)
- [markdown-it-katex](https://www.npmjs.com/package/@neilsustc/markdown-it-katex)

If you want to use katex, you must add this css style to your website: 
```
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/katex@0/dist/katex.min.css">
```

- [markdown-it-pangu](https://shigma.github.io/markdown-it-pangu/)

- markdown-it-prism

code highlighted by [Prism.js](https://prismjs.com/)

comment will be spaced by `pangu.js`

    - command ` command:{["[ee@s] $":1-2]["#":5-6,9-10]}`

    - 

- markdown-it-mermaid

Support for [Mermaid](https://github.com/mermaid-js/mermaid)

ToDO for cunstom theme
