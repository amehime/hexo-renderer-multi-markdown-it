module.exports = function (md, options) {

    let plugin = require('markdown-it-multimd-table');
    
    md.use(plugin, {
              multiline:  true,
              rowspan:    true,
              headerless: true,
            });
}