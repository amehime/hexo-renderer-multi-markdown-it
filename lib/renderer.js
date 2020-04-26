const def_pugs_lst = [
    'markdown-it-abbr',
    // 'markdown-it-cjk-breaks',
    'markdown-it-container',
    'markdown-it-deflist',
    'markdown-it-emoji',
    'markdown-it-footnote',
    'markdown-it-ins',
    'markdown-it-mark',
    'markdown-it-mathjax',
    'markdown-it-mermaid',
    'markdown-it-katex',
    'markdown-it-pangu',
    'markdown-it-prism',
    'markdown-it-sub',
    'markdown-it-sup',
    'markdown-it-task-checkbox',
    'markdown-it-toc-and-anchor'
];

/**
 * General default plugin config
 * @param  {List} pugs plugin List.
 * @return {List}        plugin List.
 */
function checkPlugins(pugs) {
    var def_pugs_obj = {};
    for (var i = 0; i < def_pugs_lst.length; i++)
        def_pugs_obj[def_pugs_lst[i]] = { 'name': def_pugs_lst[i], 'enable': true };
    var _t = [];
    if(pugs) {
      for (var i = 0; i < pugs.length; i++) {
          if (!(pugs[i] instanceof Object) || !(pugs[i].plugin instanceof Object)) continue;
          var pug_name = pugs[i].plugin.name;
          if (!pug_name) continue;
          if (pugs[i].plugin.enable == null || pugs[i].plugin.enable == undefined || pugs[i].plugin.enable != true)
              pugs[i].plugin.enable = false;
          if (def_pugs_obj[pug_name]) {
              def_pugs_obj[pug_name] = pugs[i].plugin;
          } else _t.push(pugs[i].plugin);
      }
    }

    for (var i = def_pugs_lst.length - 1; i >= 0; i--) {
        _t.unshift(def_pugs_obj[def_pugs_lst[i]]);
    }
    return _t;
}

module.exports = function(data, options) {
    const MdIt = require('./markdown-it');
    const cfg = this.config.markdown;
    const opt = cfg ? cfg : 'default';
    let parser = opt === 'default' || opt === 'commonmark' || opt === 'zero'
      ? new MdIt(opt)
      : new MdIt(opt.render);


    let plugins = checkPlugins(opt.plugins);

    parser = plugins.reduce((parser, pugs) => {
      if (pugs.enable) {
        let plugin = require('./'+pugs.name);
        if(typeof plugin !== 'function' && typeof plugin.default === 'function') {
          plugin = plugin.default;
        }
            
        if(pugs.options) {
          return parser.use(plugin, pugs.options);
        } else {
          return parser.use(plugin);
        }
      }
      else return parser;

    }, parser);


    return parser.render(data.text);
}
