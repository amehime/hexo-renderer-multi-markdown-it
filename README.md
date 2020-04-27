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


## default Supported Plugins and Examples

### [markdown-it-sub](https://www.npmjs.com/package/markdown-it-sub)
MarkDown:
```
H~2~0
```
HTML:
```html
H<sub>2</sub>O
```
H<sub>2</sub>O

### [markdown-it-sup](https://www.npmjs.com/package/markdown-it-sup)
MarkDown:
```
29^th^
```
HTML:
```html
29<sup>th</sup>
```
29<sup>th</sup>

### [markdown-it-ins](https://www.npmjs.com/package/markdown-it-ins)
MarkDown:
```
++inserted++
```
HTML:
```html
<ins>inserted</ins>
```
<ins>inserted</ins>

### [markdown-it-mark](https://www.npmjs.com/package/markdown-it-mark)
MarkDown:
```
==marked==
```
HTML:
```
<mark>marked</mark>
```
<mark>marked</mark>

### [markdown-it-container](https://www.npmjs.com/package/markdown-it-container)
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
<div class="warning">
    <em>here be dragons</em>
</div>

### [markdown-it-abbr](https://www.npmjs.com/package/markdown-it-abbr)
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
<p>The <abbr title="Hyper Text Markup Language">HTML</abbr> specification
is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.</p>

### [markdown-it-deflist](https://www.npmjs.com/package/markdown-it-deflist)
Markdown:
```
Term 1

:   Definition 1

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.
```
```
Term 1

:   Definition
with lazy continuation.

    Second paragraph of the definition.
```
```
Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b
```
HTML:
```
<dl>
    <dt>Term 1</dt>
    <dd>
        <p>Definition 1</p>
    </dd>
    <dt>Term 2 with <em>inline markup</em></dt>
    <dd>
        <p>Definition 2</p>
        <pre><code>  { some code, part of Definition 2 }
        </code></pre>
        <p>Third paragraph of definition 2.</p>
    </dd>
</dl>
```
```
<dl>
    <dt>Term 1</dt>
    <dd>
        <p>Definition<br>
        with lazy continuation.</p>
        <p>Second paragraph of the definition.</p>
    </dd>
</dl>
```
```
<dl>
    <dt>Term 1</dt>
    <dd>Definition 1</dd>
    <dt>Term 2</dt>
    <dd>Definition 2a</dd>
    <dd>Definition 2b</dd>
</dl>
```
### [markdown-it-emoji](https://www.npmjs.com/package/markdown-it-emoji)

Two versions:
- __Full__ (default), with all github supported emojis.
- [Light](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/light.json), with only well-supported unicode emojis and reduced size.

### [markdown-it-footnote](https://www.npmjs.com/package/markdown-it-footnote)
Markdown:
```
Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.
```
```
Here is an inline note.^[Inlines notes are easier to write, since
you don't have to pick an identifier and move down to type the
note.]
```
HTML:
```html
<p>Here is a footnote reference,<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> and another.<sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup></p>
<p>This paragraph won’t be part of the note, because it
isn’t indented.</p>
<hr class="footnotes-sep">
<section class="footnotes">
    <ol class="footnotes-list">
        <li id="fn1"  class="footnote-item">
            <p>Here is the footnote. <a href="#fnref1" class="footnote-backref">↩</a></p>
        </li>
        <li id="fn2"  class="footnote-item">
            <p>Here’s one with multiple blocks.</p>
            <p>Subsequent paragraphs are indented to show that they
            belong to the previous footnote. <a href="#fnref2" class="footnote-backref">↩</a></p>
        </li>
    </ol>
</section>
```
```html
<p>Here is an inline note.<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup></p>
<hr class="footnotes-sep">
<section class="footnotes">
    <ol class="footnotes-list">
    <li id="fn1"  class="footnote-item">
        <p>Inlines notes are easier to write, since
        you don’t have to pick an identifier and move down to type the
        note. <a href="#fnref1" class="footnote-backref">↩</a></p>
    </li>
    </ol>
</section>
```

### [markdown-it-task-checkbox](https://www.npmjs.com/package/markdown-it-task-checkbox)
Markdown:
```
 - [x] checked
 - [ ] unchecked
```
HTML:
```html
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

### [markdown-it-toc-and-anchor](https://www.npmjs.com/package/markdown-it-toc-and-anchor)
Support for `@[toc]` and add anchor links in headings


### [markdown-it-katex](https://github.com/yzhang-gh/markdown-it-katex)
Support for [KaTeX](https://github.com/Khan/KaTeX)

If you want to use katex, you must add this css style to your website: 
```
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/katex@0/dist/katex.min.css">
```

### markdown-it-mermaid
Support for [Mermaid](https://github.com/mermaid-js/mermaid)

ToDO for cunstom theme

### markdown-it-prism
code highlighted by [Prism.js](https://prismjs.com/)
comment will be spaced by `pangu.js`

### [markdown-it-pangu](https://shigma.github.io/markdown-it-pangu/)
For more information: [Pangu](https://github.com/vinta/pangu.js)
