module.exports = function (md, options) {

    const defaultRenderer = md.renderer.rules.text.bind(md.renderer.rules)

    const rExcerpt = /<!--+\s*more\s*--+>/i;

    md.renderer.rules.text = (tokens, index, options, env, self) => {
    	const content = tokens[index].content
        if (rExcerpt.test(content)) {
            return content
        } else {
        	return defaultRenderer(tokens, index, options, env, self)
        }
    }
}