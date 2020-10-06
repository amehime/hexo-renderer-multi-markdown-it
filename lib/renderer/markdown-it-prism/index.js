const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
const pangu = require('pangu');
const LanguagesTip = require('./lang');
const { escapeHTML, unescapeHTML } = require('hexo-util');
const escapeSwigTag = str => str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
const unescapeSwigTag =  str => str.replace(/&#123;/g, '{').replace(/&#125;/g, '}');

loadLanguages.silent = true;

/**
 * Initialisation function of the plugin. This function is not called directly by clients, but is rather provided
 * to MarkdownIt’s {@link MarkdownIt.use} function.
 *
 * @param {MarkdownIt} markdownit
 *        The markdown it instance the plugin is being registered to.
 * @param {MarkdownItPrismOptions} options
 *        The options this plugin is being initialised with.
 */
module.exports = function (md, options) {
    config = {
        plugins: ['autolinker', 'show-invisibles', 'normalize-whitespace', 'diff-highlight'], // {String[]} Names of Prism plugins to load
        init: () => {}, // Callback for Prism initialisation
        defaultLanguageForUnknown: undefined, // The language to use for code blocks that specify a language that Prism does not know
        defaultLanguageForUnspecified: undefined, // The language to use for code block that do not specify a language
        defaultLanguage: undefined, // Shorthand to set both {@code defaultLanguageForUnknown} and {@code defaultLanguageForUnspecified} to the same value
        line_number: true,
        ...options
    };

    checkLanguageOption(config, 'defaultLanguage');
    checkLanguageOption(config, 'defaultLanguageForUnknown');
    checkLanguageOption(config, 'defaultLanguageForUnspecified');
    config.defaultLanguageForUnknown = config.defaultLanguageForUnknown || config.defaultLanguage;
    config.defaultLanguageForUnspecified = config.defaultLanguageForUnspecified || config.defaultLanguage;

    config.plugins.forEach(loadPrismPlugin);


    Prism.hooks.add('wrap', function (env) {
        if (env.type == 'comment') {
            env.content = pangu.spacing(env.content)
        }
    });

    config.init(Prism);

    const defaultRenderer = md.renderer.rules.fence.bind(md.renderer.rules)

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = token.info
        const text = token.content.trim()
        const lang = info.trim().split(" ")[0]
        var code = null

        let [langToUse, langShow, prismLang] = selectLanguage(config, lang);

        const {
            firstLine = 1,
                caption = '',
                mark = false,
                command = false
        } = getOptions(info.slice(lang.length));

        if (prismLang) {
            code = Prism.highlight(unescapeSwigTag(text), prismLang, langToUse);            
        } else if(lang == 'raw') {
            code = escapeHTML(pangu.spacing(unescapeSwigTag(text)));
            langShow = null;
        }

        if(code) {
            code = escapeSwigTag(code);
            const lines = code.split('\n');

            let content = '';

            for (let i = 0, len = lines.length; i < len; i++) {
                let line = lines[i];
                let append = '';

                let lineno = Number(firstLine) + i

                if (mark && mark.includes(lineno)) {
                    content += `<tr class="marked">`;
                } else {
                    content += `<tr>`;
                }

                content += `<td data-num="${lineno}"></td>`;

                if (command) {
                    content += `<td data-command="${command[lineno]||""}"></td>`;
                }

                content += `<td><pre>${line}</pre></td></tr>`;
            }

            let result = `<figure class="highlight${langToUse ? ` ${langToUse}` : ''}">`;

            result += `<figcaption data-lang="${langShow ? langShow:''}">${caption}</figcaption>`;

            result += `<table>${content}</table></figure>`;

            return result;
        }

        if (lang == 'info') {
            return `<pre class="info"><code>${escapeHTML(pangu.spacing(unescapeSwigTag(text)))}</code></pre>`;
        } else {
            return defaultRenderer(tokens, idx, options, env, self);
        }
    }
}


/**
 * Loads the provided Prism plugin.a
 * @param name
 *        Name of the plugin to load
 * @throws {Error} If there is no plugin with the provided {@code name}
 */
function loadPrismPlugin(name) {
    try {
        require(`prismjs/plugins/${name}/prism-${name}`);
    } catch (e) {
        throw new Error(`Cannot load Prism plugin "${name}". Please check the spelling.`);
    }
}

/**
 * Checks whether an option represents a valid Prism language
 *
 * @param {MarkdownItPrismOptions} options
 *        The options that have been used to initialise the plugin.
 * @param optionName
 *        The key of the option insides {@code options} that shall be checked.
 * @throws {Error} If the option is not set to a valid Prism language.
 */
function checkLanguageOption(options, optionName) {
    const language = options[optionName];
    if (language !== undefined && loadPrismLang(language) === undefined) {
        throw new Error(`Bad option ${optionName}: There is no Prism language '${language}'.`);
    }
}

/**
 * Select the language to use for highlighting, based on the provided options and the specified language.
 *
 * @param {Object} options
 *        The options that were used to initialise the plugin.
 * @param {String} lang
 *        Code of the language to highlight the text in.
 * @return {Array} An array where the first element is the name of the language to use, and the second element is the PRISM language object for that language.
 */
function selectLanguage(options, lang) {
    let langToUse = lang;
    if (langToUse === '' && options.defaultLanguageForUnspecified !== undefined) {
        langToUse = options.defaultLanguageForUnspecified;
    }
    let langShow = LanguagesTip[langToUse] || langToUse;
    let prismLang = loadPrismLang(langToUse);
    if (prismLang === undefined && options.defaultLanguageForUnknown !== undefined) {
        langToUse = options.defaultLanguageForUnknown;
        prismLang = loadPrismLang(langToUse);
    }
    return [langToUse, langShow, prismLang];
}



/**
 * Loads the provided {@code lang} into prism.
 *
 * @param {String} lang
 *        Code of the language to load.
 * @return {Object} The Prism language object for the provided {@code lang} code. {@code undefined} if the language is not known to Prism.
 */
function loadPrismLang(lang) {
    if (!lang) return undefined;
    let langObject = Prism.languages[lang];
    if (langObject === undefined) {
        loadLanguages([lang]);
        langObject = Prism.languages[lang];
    }
    return langObject;
}

function getOptions(info) {

    const rFirstLine = /\s*first_line:(\d+)/i;
    const rMark = /\s*mark:([0-9,-]+)/i;
    const rCommand = /\s*command:\((\S[\S\s]*)\)/i;
    const rSubCommand = /"+(\S[\S\s]*)"(:([0-9,-]+))?/i;
    const rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
    const rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i;
    const rCaption = /(\S[\S\s]*)/;

    let first_line = 1;
    if (rFirstLine.test(info)) {
        info = info.replace(rFirstLine, (match, _first_line) => {
            first_line = _first_line;
            return '';
        });
    }

    let mark = false;
    if (rMark.test(info)) {
        mark = [];
        info = info.replace(rMark, (match, _mark) => {
            mark = _mark.split(',').reduce(
                (prev, cur) => lineRange(prev, cur, false), mark);
            return '';
        })
    }

    let command = false;
    if (rCommand.test(info)) {
        command = {}
        info = info.replace(rCommand, (match, _command) => {
            _command.split('||').forEach((cmd) => {
                if (rSubCommand.test(cmd)) {
                    const match = cmd.match(rSubCommand);

                    if (match[1]) {
                        command = match[3].split(',').reduce(
                            (prev, cur) => lineRange(prev, cur, match[1]), command);
                    } else {
                        command[1] = match[1];
                    }
                }
            })
            return '';
        });
    }

    let caption = '';
    if (rCaptionUrlTitle.test(info)) {
        const match = info.match(rCaptionUrlTitle);
        caption = `<span>${match[1]}</span><a href="${match[2]}${match[3]}">${match[4]}</a>`;
    } else if (rCaptionUrl.test(info)) {
        const match = info.match(rCaptionUrl);
        caption = `<span>${match[1]}</span><a href="${match[2]}${match[3]}">link</a>`;
    } else if (rCaption.test(info)) {
        const match = info.match(rCaption);
        caption = `<span>${match[1]}</span>`;
    }

    return {
        firstLine: first_line,
        caption,
        mark,
        command
    };
}

function lineRange(prev, cur, value) {
    let prevd = function (key) {
        if (value) {
            prev[key] = value;
        } else {
            prev.push(key)
        }
    }
    if (/-/.test(cur)) {
        let a = Number(cur.substr(0, cur.indexOf('-')));
        let b = Number(cur.substr(cur.indexOf('-') + 1));
        if (b < a) { // switch a & b
            const temp = a;
            a = b;
            b = temp;
        }

        for (; a <= b; a++) {
            prevd(a)
            // prev[a] = value;
        }

        return prev;
    }
    prevd(Number(cur))
    return prev;
}

function replaceTabs(str, tab) {
  return str.replace(/^\t+/gm, match => {
    let result = '';

    for (let i = 0, len = match.length; i < len; i++) {
      result += tab;
    }

    return result;
  });
}