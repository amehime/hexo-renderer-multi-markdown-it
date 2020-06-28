
/*
 * @Descripttion: markdown-it-graphviz
 * @version: 1.0.0
 * @Author: aiyoudiao
 * @Date: 2020-03-07 04:43:27
 * @LastEditTime: 2020-03-08 09:21:51
 * @LastEditors: aiyoudiao
 * @FilePath: \markdown-it-graphviz\index.js
 */

// #region 方式一 Code Module

const Viz = require ('./common/viz.es-changed.js');
const { render, Module } = require ('./common/full.render-changed.js');

// #endregion 方式一 Code Module End
// ------------------------分割线用来分割不同的使用方式---------------------------
// #region 方式二 Code Module

// const Viz = window.Viz;

// #endregion 方式二 Code Module End

module.exports = function markdownItGraphViz (md, options = {}) {
  // console.log(`@md`, md);

  const temp = md.renderer.rules.fence.bind (md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    try {
      const { content, info } = tokens[idx];
      if (info === 'graphviz') {
        // console.log(`@content`, content);

        // #region 方式一 Code Module

        var viz = new Viz ({ render, Module });

        // #endregion 方式一 Code Module End
        // ------------------------分割线用来分割不同的使用方式---------------------------
        // #region 方式二 Code Module

        // var viz = new Viz({});

        // #endregion 方式二 Code Module End

        const $svg = viz.wrapper.render (content, { format: 'svg', engine: 'dot', files: [], images: [], yInvert: false, nop: 0 });

        return $svg;
      }
    } catch (error) {
      return `<p style="border: 2px dashed red">Failed to render graphviz<span>${md.utils.escapeHtml (error.toString ())}</span></p>`;
    }
    return temp (tokens, idx, options, env, slf);
  };
};