const pangu = require('pangu')
const { escapeHtml, isWhiteSpace } = require('../markdown-it/lib/common/utils')

function getPrevChar (tokens, index) {
  let prevChar = ''
  for (let i = index - 1; i >= 0; i -= 1) {
    const { content, type } = tokens[i]
    if (type === 'html_inline') break
    if (content && content.length) {
      prevChar = content.slice(-1)
      break
    }
  }
  return prevChar
}

module.exports = (md, options = {}) => {
  const { additionalRules = ['code_inline'] } = options

  md.renderer.rules.text = (tokens, index, options, env, self) => {
    const prevChar = getPrevChar(tokens, index)
    return escapeHtml(pangu.spacing(prevChar + tokens[index].content).slice(prevChar.length))
  }

  additionalRules.forEach((type) => {
    const rule = md.renderer.rules[type]
    if (!rule) return

    md.renderer.rules[type] = (tokens, index, options, env, self) => {
      let output = rule(tokens, index, options, env, self)
      if (output.length) {
        if (index > 0 && !isWhiteSpace(output.charAt(0))) output = ' ' + output
        if (index < tokens.length - 1 && !isWhiteSpace(output.charAt(output.length - 1))) {
          output += ' '
        }
      }
      return output
    }
  })
}