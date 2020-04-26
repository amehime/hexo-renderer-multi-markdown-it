const mermaid = require('mermaid')

const mermaidChart = (code) => {
  /*let svgGraph = ''
  let svgId = "render" + (Math.floor(Math.random() * 10000)).toString();*/
  try {
    /*const path = require('path')
    const puppeteer = require('puppeteer')

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.setViewport({ width: 800, height: 600 })
    await page.goto(`file://${path.join(__dirname, 'index.html')}`)

    await page.$eval('#container', (container, code, config) => {
      container.innerHTML = code
      window.mermaid.initialize(config)
      window.mermaid.init(undefined, container)
    }, code, config)
    const svg = await page.$eval('#container', container => container.innerHTML)
    browser.close()

    log.info(svg);*/
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