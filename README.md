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
#   - plugin:
#       name: markdown-it-something
#       enable: true
#       options:
#            this is plugin option
```


## Surpported Plugins and Examples
### markdown-it-abbr
    Markdown:
    ```
    *[HTML]: Hyper Text Markup Language
    *[W3C]:  World Wide Web Consortium
    The HTML specification
    is maintained by the W3C.
    ```

    HTML:
    ```html
    <p>The <abbr title="Hyper Text Markup Language">HTML</abbr> specification
    is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.</p>
    ```
### markdown-it-container
    Markdown:
    ```
    ::: warning
    *here be dragons*
    :::
    ```

    HTML:
    ```html
    <div class="warning">
        <em>here be dragons</em>
    </div>
    ```

### markdown-it-deflist
    Markdown:
    ```
    Apple:
      ~ Pomaceous fruit of plants of the genus Malus in the family Rosaceae.
      ~ An american computer company.
    Orange:
      ~ The fruit of an evergreen tree of the genus Citrus.
    ```

    HTML:
    ```
    <dl>
       <dt>Apple</dt>
       <dd>Pomaceous fruit of plants of the genus Malus in the family Rosaceae.</dd>
       <dd>An american computer company.</dd>
       <dt>Orange</dt>
       <dd>The fruit of an evergreen tree of the genus Citrus.</dd>
    </dl>
    ```
### markdown-it-emoji

    Two versions:
    - __Full__ (default), with all github supported emojis.
    - [Light](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/light.json), with only well-supported unicode emojis and reduced size.

### markdown-it-footnote
    __Normal footnote__:

    ```
    Here is a footnote reference,[^1] and another.[^longnote]

    [^1]: Here is the footnote.

    [^longnote]: Here's one with multiple blocks.

        Subsequent paragraphs are indented to show that they
    belong to the previous footnote.
    ```

    HTML:

    ```html
    <p>Here is a footnote reference,<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> and another.<sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup></p>
    <p>This paragraph won’t be part of the note, because it
    isn’t indented.</p>
    <hr class="footnotes-sep">
    <section class="footnotes">
    <ol class="footnotes-list">
    <li id="fn1"  class="footnote-item"><p>Here is the footnote. <a href="#fnref1" class="footnote-backref">↩</a></p>
    </li>
    <li id="fn2"  class="footnote-item"><p>Here’s one with multiple blocks.</p>
    <p>Subsequent paragraphs are indented to show that they
    belong to the previous footnote. <a href="#fnref2" class="footnote-backref">↩</a></p>
    </li>
    </ol>
    </section>
    ```

    __Inline footnote__:

    ```
    Here is an inline note.^[Inlines notes are easier to write, since
    you don't have to pick an identifier and move down to type the
    note.]
    ```

    HTML:

    ```html
    <p>Here is an inline note.<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup></p>
    <hr class="footnotes-sep">
    <section class="footnotes">
    <ol class="footnotes-list">
    <li id="fn1"  class="footnote-item"><p>Inlines notes are easier to write, since
    you don’t have to pick an identifier and move down to type the
    note. <a href="#fnref1" class="footnote-backref">↩</a></p>
    </li>
    </ol>
    </section>
    ```
### markdown-it-ins
    MarkDown:
    `++inserted++`

    HTML:
    `<ins>inserted</ins>`

### markdown-it-katex
    Support for [KaTeX](https://github.com/Khan/KaTeX)

### markdown-it-mark
    MarkDown:
    `==marked==`

    HTML:
    `<mark>inserted</mark>`

### markdown-it-mermaid
    Support for [Mermaid](https://github.com/mermaid-js/mermaid)

### markdown-it-pangu

### markdown-it-prism
    code highlight by Prism.js

### markdown-it-sub
    `H~2~0` => `H<sub>2</sub>O`

### markdown-it-sup
    `29^th^` => `29<sup>th</sup>`

### markdown-it-task-checkbox
    ```
     - [x] checked
     - [ ] unchecked
    ```

    ```
    <ul class="task-list">
        <li class="task-list-item">
            <div classname="checkbox">
            <input type="checkbox" id="cbx_0" checked="true" disabled="true">
            <label for="cbx_0">checked</label>
            </div>
        </li>
        <li class="task-list-item">
            <div classname="checkbox">
            <input type="checkbox" id="cbx_0" disabled="true">
            <label for="cbx_0">unchecked</label>
            </div>
        </li>
    </ul>
    ```

### markdown-it-toc-and-anchor
    
    ```
    @[toc]
    ```