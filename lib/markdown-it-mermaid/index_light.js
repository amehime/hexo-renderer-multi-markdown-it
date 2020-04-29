const mermaid = require('mermaid')

const mermaidChart = (code) => {
  try {
    mermaid.parse(code)
    return `<pre class="mermaid">${code}</pre>`
  } catch (e) {
    return `<pre>${code}</pre>`
  }
}

const MermaidPlugin = (md, options) => {

  mermaid.initialize(Object.assign(MermaidPlugin.default, options));

  const defaultRenderer = md.renderer.rules.fence.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const code = token.content.trim()

    if (token.info === 'mermaid') {
      return mermaidChart(code)
    }
    const firstLine = code.split(/\n/)[0].trim()
    if (firstLine === 'gantt' || firstLine === 'sequenceDiagram' || firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
      return mermaidChart(code)
    }
    return defaultRenderer(tokens, idx, options, env, self)
  }
}

MermaidPlugin.default={
  startOnLoad: false,
  securityLevel: 'true',
    theme: "default",
    flowchart:{
      htmlLabels: false,
      useMaxWidth: true,
    }
}

module.exports = MermaidPlugin