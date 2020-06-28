
const Viz = require ('./common/viz.es.js');
const { render, Module } = require ('./common/full.render.js');


module.exports = function markdownItGraphViz (md, options = {}) {
  // console.log(`@md`, md);

  const temp = md.renderer.rules.fence.bind (md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    try {
      const { content, info } = tokens[idx];
      if (info === 'graphviz') {

        var viz = new Viz ({ render, Module });

        const svg = viz.wrapper.render (content, { format: 'svg', engine: 'dot', files: [], images: [], yInvert: false, nop: 0 });

        var code = svg.replace(/[\r\n]/g,"").split('<svg', 2);

        return `<pre class="graphviz"><svg${code[1]}</pre>`;
      }
    } catch (error) {
      return `<pre>${md.utils.escapeHtml (error.toString ())}</pre>`;
    }
    return temp (tokens, idx, options, env, slf);
  };
};