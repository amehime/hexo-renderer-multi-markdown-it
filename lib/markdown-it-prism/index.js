const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
const pangu = require('pangu');

const rMark = /\s*\[mark(:(\w+))?\]/i;
const rFirstLine = /\s*first_line:(\d+)/i;
const rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i;
const rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i;
const rCaption = /(\S[\S\s]*)/;

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
        init: () => {}, // Callback for Prism initialisation
        defaultLanguageForUnknown: undefined, // The language to use for code blocks that specify a language that Prism does not know
        defaultLanguageForUnspecified: undefined, // The language to use for code block that do not specify a language
        defaultLanguage: undefined, // Shorthand to set both {@code defaultLanguageForUnknown} and {@code defaultLanguageForUnspecified} to the same value
        line_number: true,
        tab_replace: '',
        ...options
    };

    checkLanguageOption(config, 'defaultLanguage');
    checkLanguageOption(config, 'defaultLanguageForUnknown');
    checkLanguageOption(config, 'defaultLanguageForUnspecified');
    config.defaultLanguageForUnknown = config.defaultLanguageForUnknown || config.defaultLanguage;
    config.defaultLanguageForUnspecified = config.defaultLanguageForUnspecified || config.defaultLanguage;

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

        lang = info.split(" ")[0]

        let [langToUse, prismLang] = selectLanguage(config, lang);

        if (prismLang) {

            let first_line = 1;
            if (rFirstLine.test(info)) {
                info = info.replace(rFirstLine, (match, _first_line) => {
                    first_line = _first_line;
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
                if (match[1] !== lang)
                    caption = `<span>${match[1]}</span>`;
            }

            const code = Prism.highlight(text, prismLang);
            const lines = code.split('\n');

            let numbers = '';
            let content = '';


            for (let i = 0, len = lines.length; i < len; i++) {
                let line = lines[i];
                if (config.tab_replace) line = replaceTabs(line, config.tab_replace);

                content += '<span class="line';
                if (rMark.test(line)) {
                    const match = line.match(rMark);
                    content += ` marked ${match[1]}">${line.replace(rMark, '')}</span>`;
                } else {
                    content += `">${line}</span>`;
                }
                content += '<br>';

                numbers += `<span class="line">${Number(first_line) + i}</span><br>`;
            }

            let result = `<figure class="highlight${langToUse ? ` ${langToUse}` : ''}">`;

            if (caption) {
                result += `<figcaption>${caption}</figcaption>`;
            }

            result += '<table><tr>';

            if (config.line_number) {
                result += `<td class="gutter"><pre>${numbers}</pre></td>`;
            }

            result += `<td class="code"><pre>${content}</pre></td>`;
            result += '</tr></table></figure>';

            return result;
        } else {
            return defaultRenderer(tokens, idx, options, env, self)
        }
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
    let prismLang = loadPrismLang(langToUse);
    if (prismLang === undefined && options.defaultLanguageForUnknown !== undefined) {
        langToUse = options.defaultLanguageForUnknown;
        prismLang = loadPrismLang(langToUse);
    }
    return [langToUse, prismLang];
}


function replaceTabs(str, tab) {
    return str.replace(/^\t+/, match => {
        let result = '';

        for (let i = 0, len = match.length; i < len; i++) {
            result += tab;
        }

        return result;
    });
}