module.exports = function (md, options) {

    let plugin = require('markdown-it-container');
    
    md.use(plugin, 'note', {
        validate: function (params) {
            return params.trim().match(/^note\s+(default|primary|success|info|warning|danger)$/);
        },
        render: function (tokens, idx) {
            var m = tokens[idx].info.trim().match(/^note\s+(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<div class="note ' + m[1] + '">\n';

            } else {
                // closing tag
                return '</div>\n';
            }
        }
    });
}