module.exports = function (md, options) {

    let plugin = require('markdown-it-container');
    
    md.use(plugin, 'note', {
        validate: function (params) {
            return params.trim().match(/^(default|primary|success|info|warning|danger)(.*)$/);
        },
        render: function (tokens, idx) {
            var m = tokens[idx].info.trim().match(/^(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<div class="note ' + m[1].trim() + '">\n';

            } else {
                // closing tag
                return '</div>\n';
            }
        }
    });

    md.use(plugin, 'tab', {
      marker: ';',

      validate: function(params) {
        return params.trim().match(/^(\w+)+(.*)$/);
      },

      render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^(\w+)+(.*)$/);

        if (tokens[idx].nesting === 1) {
          // opening tag
          return '<div class="tab" data-id="'+m[1].trim()+'" data-title="'+m[2].trim()+'">\n';

        } else {
          // closing tag
          return '</div>\n';
        }
      }
    });

    md.use(plugin, 'collapse', {
      marker: '+',

      validate: function(params) {
        return params.match(/^(primary|success|info|warning|danger|\s)(.*)$/);
      },

      render: function (tokens, idx) {
        var m = tokens[idx].info.match(/^(primary|success|info|warning|danger|\s)(.*)$/);

        if (tokens[idx].nesting === 1) {
          // opening tag
          var style = m[1].trim()
          return '<details' + (style ? ' class="'+style+'"' : '') +'><summary>'+m[2].trim()+'</summary><div>\n';
        } else {
          // closing tag
          return '</div></details>\n';
        }
      }
    });
}