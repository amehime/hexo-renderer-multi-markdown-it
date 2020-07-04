"use strict";

module.exports = function(md, options) {
  md.inline.ruler.push("furigana", require("./lib/furigana")(options));
};
