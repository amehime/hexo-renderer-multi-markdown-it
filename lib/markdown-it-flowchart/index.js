const flowChart = (code, config) => {
    const deasyncPromise = require('deasync-promise')

    return deasyncPromise((async () => {
        try {
            const path = require('path')
            const puppeteer = require('puppeteer')
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                  '--disable-gpu',
                  '--disable-dev-shm-usage',
                  '--disable-setuid-sandbox',
                  '--no-first-run',
                  '--no-sandbox',
                  '--no-zygote',
                  '--single-process'
                ]
            })
            const page = await browser.newPage()
            page.setViewport({ width: 800, height: 600 })
            await page.goto(`file://${path.join(__dirname, 'index.html')}`)

            await page.$eval('#container', (container, code, config) => {
                window.flowchart.parse(code).drawSVG('container');
            }, code, config)
            const svg = await page.$eval('#container', container => {
                return container.innerHTML
            })
            browser.close()

            return `<pre class="flowchart">${svg}</pre>`
        } catch (e) {
            return `<pre>${e}</pre>`
        }
    })())

}

module.exports = (md, options) => {

    const config = {
        startOnLoad: false,
        theme: "default",
        flowchart: {
            htmlLabels: false,
            useMaxWidth: true,
        },
        ...options
    }

    const defaultRenderer = md.renderer.rules.fence.bind(md.renderer.rules)

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const code = token.content.trim()

        if (token.info === 'flow') {
            return flowChart(code, config)
        }
        return defaultRenderer(tokens, idx, options, env, self)
    }
}