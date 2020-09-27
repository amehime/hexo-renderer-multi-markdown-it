# hexo-renderer-multi-markdown-it

This renderer plugin uses [Markdown-it](https://github.com/markdown-it/markdown-it) as a render engine on [Hexo]. 

This renderer plugin is forked from [hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it) and [hexo-renderer-markdown-it-plus](https://www.npmjs.com/package/hexo-renderer-markdown-it-plus). 

And minify tool is forked from [hexo-neat](https://github.com/rozbo/hexo-neat).

[中文使用说明](https://shoka.lostyu.me/computer-science/note/theme-shoka-doc/)

## Installation
Warning: make sure you're inside the main hexo directory before starting this guide.

A default Hexo installation will include a markdown renderer plugin which uses marked, so you will have to remove it if you want to use this renderer.

```
npm un hexo-renderer-marked --save
```

or

```
yarn remove hexo-renderer-marked
```

If you have already removed the default renderer, and others you might of added, you can now safely install `hexo-renderer-multi-markdown-it`

```
npm i hexo-renderer-multi-markdown-it --save
```

or

```
yarn add hexo-renderer-multi-markdown-it
```

if an error is reported as
```
ERROR: Failed to download Chromium r515411! Set "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD" env variable to skip download.
```

please try again with the following command 

```
yarn add hexo-renderer-multi-markdown-it --ignore-scripts
```

## Options

Configuring the renderer is a fairly simple task because all the settings are in the main hexo `_config.yml` file.

You just need to open it in your favourite text editor and write down your configuration.

``` yml
# opitions for renderer
markdown:
  render:
    html: false
    xhtmlOut: true
    breaks: true
    linkify: true
    typographer: 
    quotes: '“”‘’'
  plugins:
    - plugin:
        name: markdown-it-toc-and-anchor
        enable: true
        options:
          tocClassName: 'toc'
          anchorClassName: 'anchor'
    - plugin:
        name: markdown-it-multimd-table
        enable: true
        options:
          multiline: true
          rowspan: true
          headerless: true
    - plugin:
        name: ./markdown-it-furigana
        enable: true
        options:
          fallbackParens: "()"
    - plugin:
        name: ./markdown-it-spoiler
        enable: true
        options:
          title: "你知道得太多了"

# options for minify
minify:
  html:
    enable: true
    exclude:
      - '**/json.ejs'
      - '**/atom.ejs'
      - '**/rss.ejs'
  css:
    enable: true
    exclude:
      - '**/*.min.css'
  js:
    enable: true
    mangle:
      toplevel: true
    output:
    compress:
    exclude:
      - '**/*.min.js'
```

disable the highlight of site `_config.yml`

```
# Writing
...
highlight:
  enable: false

prismjs:
  enable: false
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
- [markdown-it-container](https://www.npmjs.com/package/markdown-it-container)
- [markdown-it-multimd-table](https://www.npmjs.com/package/markdown-it-multimd-table)
- [markdown-it-katex](https://www.npmjs.com/package/@neilsustc/markdown-it-katex)

  If you want to use katex, you must add this css style to your website: 
  ```
  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/katex@0/dist/katex.min.css">
  ```

- [markdown-it-pangu](https://shigma.github.io/markdown-it-pangu/)

- markdown-it-prism

  code highlighted by [Prism.js](https://prismjs.com/)

  comments will be spaced by `pangu.js`

  - marked line ` mark:1,3-4`
  
  - command ` command:{["[ee@s] $":1-2]["#":5-6,9-10]}`

- markdown-it-mermaid

  Support for [Mermaid](https://github.com/mermaid-js/mermaid)

  You should add [css style](https://github.com/mermaid-js/mermaid/tree/develop/src/themes) for mermaid.

- markdown-it-graphviz
  
  Based on [Graphviz](http://www.graphviz.org/)

- markdown-it-chart

  Based on [Frappe Charts](https://frappe.io/charts)

- markdown-it-furigana
  
  Modified from [furigana-markdown-it](https://www.npmjs.com/package/furigana-markdown-it) and [markdown-it-ruby](https://www.npmjs.com/package/markdown-it-ruby)

  eg. `{可愛い犬^か+わい・い・いぬ}`

- markdown-it-spoiler

  Modified from [markdown-it-spoiler](https://www.npmjs.com/package/@traptitech/markdown-it-spoiler)

  `!!spoiler!!`  => `<span class="spoiler" title="...">spoiler</span>`