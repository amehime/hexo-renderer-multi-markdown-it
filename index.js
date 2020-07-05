/* global hexo */

'use strict';

hexo.config.markdown = Object.assign({
  render: {},
  plugins: {}
}, hexo.config.markdown);

hexo.config.markdown.render = Object.assign({
  html: true,
  xhtmlOut: false,
  breaks: true,
  linkify: true,
  typographer: true,
  quotes: '“”‘’',
  tab: ''
}, hexo.config.markdown.render);


const renderer = require('./lib/renderer');

hexo.extend.renderer.register('md', 'html', renderer, true);
hexo.extend.renderer.register('markdown', 'html', renderer, true);
hexo.extend.renderer.register('mkd', 'html', renderer, true);
hexo.extend.renderer.register('mkdn', 'html', renderer, true);
hexo.extend.renderer.register('mdwn', 'html', renderer, true);
hexo.extend.renderer.register('mdtxt', 'html', renderer, true);
hexo.extend.renderer.register('mdtext', 'html', renderer, true);


if (hexo.config.minify) {
    // HTML minifier
    hexo.config.minify.html = Object.assign({
        enable: true,
        logger: true,
        stamp: true,
        exclude: [],
        ignoreCustomComments: [/^\s*more/],
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        minifyJS: true,
        minifyCSS: true,
    }, hexo.config.minify.html);

    // Css minifier
    hexo.config.minify.css = Object.assign({
        enable: true,
        logger: true,
        stamp: true,
        exclude: ['*.min.css']
    }, hexo.config.minify.css);

    // Js minifier
    hexo.config.minify.js = Object.assign({
        enable: true,
        mangle: true,
        logger: true,
        stamp: true,
        output: {},
        compress: {},
        exclude: ['*.min.js']
    }, hexo.config.minify.js, {
            fromString: true
    });


    var filter = require('./lib/filter');

	hexo.extend.filter.register('after_render:html', filter.logic_html);
    hexo.extend.filter.register('after_render:css', filter.logic_css);
    hexo.extend.filter.register('after_render:js', filter.logic_js);

}