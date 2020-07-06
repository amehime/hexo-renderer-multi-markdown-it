'use strict'
const exMark = 0x21 /* ! */

const tokenize = config => (state, silent) => {
  if (silent) return false

  const start = state.pos
  const marker = state.src.charCodeAt(start)

  if (marker !== exMark) return false

  const scanned = state.scanDelims(state.pos, true)
  let len = scanned.length
  const ch = String.fromCharCode(marker)

  if (len < 2) return false

  let isOdd = false
  if (len % 2) {
    isOdd = true
    if (!config.frontPriorMode) {
      const token = state.push("text", "", 0)
      token.content = ch
    }
    len--
  }

  for (let i = 0; i < len; i += 2) {
    const token = state.push("text", "", 0)
    token.content = ch + ch

    state.delimiters.push({
      marker,
      length: 0, // disable "rule of 3" length checks meant for emphasis
      jump: i,
      token: state.tokens.length - 1,
      end: -1,
      open: scanned.can_open,
      close: scanned.can_close
    })
  }

  state.pos += scanned.length
  if (isOdd && config.frontPriorMode) {
    state.pos--
  }

  return true
}

const postProcess = (state, delimiters, config) => {
  const loneMarkers = []

  for (const startDelim of delimiters) {
    if (startDelim.marker !== exMark) continue
    if (startDelim.end === -1) continue

    const endDelim = delimiters[startDelim.end]

    const tokenO = state.tokens[startDelim.token]
    tokenO.type = "spoiler_open"
    tokenO.tag = "span"
    tokenO.attrs = [["class", "spoiler"], ["title", config.title]]
    tokenO.nesting = 1
    tokenO.markup = "!!"
    tokenO.content = ""

    const tokenC = state.tokens[endDelim.token]
    tokenC.type = "spoiler_close"
    tokenC.tag = "span"
    tokenC.nesting = -1
    tokenC.markup = "!!"
    tokenC.content = ""

    if (
      state.tokens[endDelim.token - 1].type === "text" &&
      state.tokens[endDelim.token - 1].content === "!"
    ) {
      loneMarkers.push(endDelim.token - 1)
    }
  }

  // If a marker sequence has an odd number of characters, it's splitted
  // like this: `!!!!!` -> `!` + `!!` + `!!`, leaving one marker at the
  // start of the sequence.
  //
  // So, we have to move all those markers after subsequent spoiler_close tags.
  //
  while (loneMarkers.length) {
    const i = loneMarkers.pop()
    let j = i + 1

    while (
      j < state.tokens.length &&
      state.tokens[j].type === "spoiler_close"
    ) {
      j++
    }

    j--

    if (i !== j) {
      const token = state.tokens[j]
      state.tokens[j] = state.tokens[i]
      state.tokens[i] = token
    }
  }
}

module.exports = function(md, options) {

  const config = {
      frontPriorMode: false,
      title: "...",
      ...options
    }

  md.inline.ruler.before("emphasis", "spoiler", tokenize(config))
  md.inline.ruler2.before("emphasis", "spoiler", state => {
    postProcess(state, state.delimiters, config)

    if (!state.tokens_meta) return
    for (const meta of state.tokens_meta) {
      if (meta && meta.delimiters) {
        postProcess(state, meta.delimiters, config)
      }
    }
  })
}