/* global hexo */
'use strict';
var CleanCSS = require('clean-css'),
    UglifyJS = require('uglify-js'),
    Htmlminifier = require('html-minifier').minify;
var Promise = require('bluebird');
var minimatch = require('minimatch');


function logic_html(str, data) {
    var hexo = this,
        options = hexo.config.minify.html;
    // Return if disabled.
    if (false === options.enable) return;

    var path = data.path;
    var exclude = options.exclude;
    if (exclude && !Array.isArray(exclude)) exclude = [exclude];

    if (path && exclude && exclude.length) {
        for (var i = 0, len = exclude.length; i < len; i++) {
            if (minimatch(path, exclude[i], {matchBase: true})) return str;
        }
    }

    var result = Htmlminifier(str, options);
    var saved = ((str.length - result.length) / str.length * 100).toFixed(2);
    if (options.logger) {
        var log = hexo.log || console.log;
        log.log('minify the html: %s [ %s saved]', path, saved + '%');
    }
    if(options.stamp) {
      var prefix = '<!-- build time:' + Date() + " -->";
      var end = '<!-- rebuild by hrmmi -->';
      result = prefix + result + end;      
    }
    return result;
};

function logic_css(str, data) {
    var hexo = this,
        options = hexo.config.minify.css;
    // Return if disabled.
    if (false === options.enable) return;

    var path = data.path;
    var exclude = options.exclude;
    if (exclude && !Array.isArray(exclude)) exclude = [exclude];

    if (path && exclude && exclude.length) {
        for (var i = 0, len = exclude.length; i < len; i++) {
            if (minimatch(path, exclude[i], {matchBase: true})) return str;
        }
    }

    return new Promise(function (resolve, reject) {
        new CleanCSS(options).minify(str, function (err, result) {
            if (err) return reject(err);
            var saved = ((str.length - result.styles.length) / str.length * 100).toFixed(2);
            var css_result = result.styles;
            if(options.stamp) {
              var prefix = '/* build time:' + Date().toLocaleString() + "*/\n";
              var end = '\n/* rebuild by hrmmi */';
              css_result = prefix + css_result + end;
            }
            resolve(css_result);
            if (options.logger) {
                var log = hexo.log || console.log;
                log.log('minify the css: %s [ %s saved]', path, saved + '%');
            }
        });
    });
}

function logic_js(str, data) {
    var hexo = this,
        options = hexo.config.minify.js;
    // Return if disabled.
    if (false === options.enable) return;

    var path = data.path;
    var exclude = options.exclude;
    if (exclude && !Array.isArray(exclude)) exclude = [exclude];

    if (path && exclude && exclude.length) {
        for (var i = 0, len = exclude.length; i < len; i++) {
            if (minimatch(path, exclude[i], {matchBase: true})) return str;
        }
    }

    var result = UglifyJS.minify(str, options);
    var saved = ((str.length - result.code.length) / str.length * 100).toFixed(2);
    if (options.logger) {
        var log = hexo.log || console.log;
        log.log('minify the js: %s [ %s saved]', path, saved + '%');
    }
    var js_result = result.code;
    if(options.stamp) {
      var prefix = '// build time:' + Date().toLocaleString() + "\n";
      var end = '\n//rebuild by hrmmi ';
      js_result = prefix + js_result + end;
    }
    return js_result;
}

module.exports = {
    logic_html: logic_html,
    logic_css: logic_css,
    logic_js: logic_js,
};