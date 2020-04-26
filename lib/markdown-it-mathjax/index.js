'use strict'

import markdownitfence from '../markdown-it-fence'
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { FindTeX } from 'mathjax-full/js/input/tex/FindTeX';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';

const render = (code) => {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const findTex = new FindTeX({
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [
        ['$$', '$$'],
        ['\\[', '\\]']
    ]
  });

  const tex = new TeX({packages: AllPackages, 'FindTeX': findTex});
  const svg = new SVG({fontCache: 'global', mtextInheritFont: false, mathmlSpacing: false});
  const html = mathjax.document(code, {InputJax: tex, OutputJax: svg});

  html.findMath()
    .compile()
    .getMetrics()
    .typeset()
    .updateDocument();

  return adaptor.innerHTML(adaptor.body(html.document));
}

const MathJaxRender = (generateSourceUrl) => {
  return (tokens, idx, options, env) => {
    const token = tokens[idx]
    const diag_type = token.info.trim()
    const code = token.content.trim()
    return render(code)
  }
}

const MathJaxValidate = (params) => {
  const diag_types = [
    "mathjax"
  ]

  var type = params.trim().split(' ', 2)[0]
  return diag_types.includes(type)
}

const MathJaxPlugin = (md, options) => {
  options = options || {}

  var render = options.render || md.renderer.rules.image
  var marker = options.marker || '```'

  return markdownitfence(md, 'mathjax', {
    marker: marker,
    render: MathJaxRender(),
    validate: MathJaxValidate,
  })

}

module.exports = MathJaxPlugin