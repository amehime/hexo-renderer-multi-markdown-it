const default_plugins = [
    'markdown-it-abbr',
    'markdown-it-bracketed-spans',
    'markdown-it-attrs',
    'markdown-it-deflist',
    'markdown-it-emoji',
    'markdown-it-footnote',
    'markdown-it-ins',
    'markdown-it-mark',
    'markdown-it-multimd-table',
    'markdown-it-sub',
    'markdown-it-sup',
    'markdown-it-task-checkbox',
    'markdown-it-toc-and-anchor',
    'markdown-it-pangu',
    './markdown-it-container',
    './markdown-it-furigana',
    './markdown-it-katex',
    './markdown-it-mermaid',
    './markdown-it-graphviz',
    './markdown-it-prism',
    './markdown-it-chart',
    './markdown-it-spoiler',
    './markdown-it-excerpt'
];

/**
 * General default plugin config
 * @param  {List} plugins plugin List.
 * @return {List}        plugin List.
 */
function checkPlugins(plugins) {
    var default_plugins_list = {};
    for (var i = 0; i < default_plugins.length; i++) {
        default_plugins_list[default_plugins[i]] = { 'name': default_plugins[i], 'enable': true };
    }

    var _t = [];

    if (plugins) {
        for (var i = 0; i < plugins.length; i++) {
            if (!(plugins[i] instanceof Object) || !(plugins[i].plugin instanceof Object)) {
                continue;
            }
            var plugin_name = plugins[i].plugin.name;
            if (!plugin_name) {
                continue;
            }
            if (plugins[i].plugin.enable == null || plugins[i].plugin.enable == undefined || plugins[i].plugin.enable != true) {
                plugins[i].plugin.enable = false;
            }
            if (default_plugins_list[plugin_name]) {
                default_plugins_list[plugin_name] = plugins[i].plugin;
            } else {
                _t.push(plugins[i].plugin);
            }
        }
    }

    for (var i = default_plugins.length - 1; i >= 0; i--) {
        _t.unshift(default_plugins_list[default_plugins[i]]);
    }

    return _t;
}

module.exports = function (data, options) {
    const MdIt = require('markdown-it');
    const cfg = this.config.markdown;
    const opt = cfg ? cfg : 'default';
    let parser = opt === 'default' || opt === 'commonmark' || opt === 'zero' ?
        new MdIt(opt) :
        new MdIt(opt.render);


    let plugins = checkPlugins(opt.plugins);

    parser = plugins.reduce((parser, plugins) => {
        if (plugins.enable) {
            let plugin = require(plugins.name);

            if (typeof plugin !== 'function' && typeof plugin.default === 'function') {
                plugin = plugin.default;
            }

            if (plugins.options) {
                return parser.use(plugin, plugins.options);
            } else {
                return parser.use(plugin);
            }

        } else return parser;

    }, parser);


    return parser.render(data.text);
}