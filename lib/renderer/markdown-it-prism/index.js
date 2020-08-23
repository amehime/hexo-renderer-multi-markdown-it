const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
const pangu = require('pangu');

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
        const lang = info.split(" ")[0]
        var code = null

        let [langToUse, langShow, prismLang] = selectLanguage(config, lang);

        const {
            firstLine = 1,
                caption = '',
                mark = false,
                command = false
        } = getOptions(info.slice(lang.length));

        if (prismLang) {
            code = Prism.highlight(text.replace(/&#123;/g, '{').replace(/&#125;/g, '}'), prismLang, langToUse).replace(/{/g, '&#123;').replace(/}/g, '&#125;');
        } else if(lang == 'raw') {
            code = pangu.spacing(text);
            langShow = null;
        }

        if(code) {
            const lines = code.split('\n');

            let numbers = '';
            let content = '';

            for (let i = 0, len = lines.length; i < len; i++) {
                let line = lines[i];
                let append = '';

                let lineno = Number(firstLine) + i

                if (mark && mark.includes(lineno)) {
                    append = `<span class="marked`;
                    numbers += `<span class="marked">${lineno}</span><br>`;
                } else {
                    numbers += `${lineno}<br>`;
                }
                if (command && command[lineno]) {
                    append += `" data-command="${command[lineno]}`;
                }

                if (append) {
                    content += `${append}">${line}</span><br>`;
                } else {
                    content += `${line}<br>`;
                }                
            }

            let result = `<figure class="highlight${langToUse ? ` ${langToUse}` : ''}">`;

            result += `<figcaption data-lang="${langShow ? langShow:''}" data-title="${caption}"></figcaption>`;

            result += `<div class="code-container"><pre class="gutter">${numbers}</pre>`;

            result += `<pre class="code">${content}</pre></div></figure>`;

            return result;
        }

        if (lang == 'info') {
            return `<pre class="info"><code>${pangu.spacing(text)}</code></pre>`;
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
    // The languages map is built automatically with gulp
    const Languages = /*languages_placeholder[*/ {
        "html": "HTML",
        "xml": "XML",
        "svg": "SVG",
        "mathml": "MathML",
        "css": "CSS",
        "clike": "C-like",
        "js": "JavaScript",
        "abap": "ABAP",
        "abnf": "Augmented Backus–Naur form",
        "antlr4": "ANTLR4",
        "g4": "ANTLR4",
        "apacheconf": "Apache Configuration",
        "apl": "APL",
        "aql": "AQL",
        "arff": "ARFF",
        "asciidoc": "AsciiDoc",
        "adoc": "AsciiDoc",
        "asm6502": "6502 Assembly",
        "aspnet": "ASP.NET (C#)",
        "autohotkey": "AutoHotkey",
        "autoit": "AutoIt",
        "shell": "Bash",
        "basic": "BASIC",
        "bbcode": "BBcode",
        "shortcode": "BBcode",
        "bnf": "Backus–Naur form",
        "rbnf": "Routing Backus–Naur form",
        "conc": "Concurnas",
        "csharp": "C#",
        "cs": "C#",
        "dotnet": "C#",
        "cpp": "C++",
        "cil": "CIL",
        "coffee": "CoffeeScript",
        "cmake": "CMake",
        "csp": "Content-Security-Policy",
        "css-extras": "CSS Extras",
        "dax": "DAX",
        "django": "Django/Jinja2",
        "jinja2": "Django/Jinja2",
        "dns-zone-file": "DNS zone file",
        "dns-zone": "DNS zone file",
        "dockerfile": "Docker",
        "ebnf": "Extended Backus–Naur form",
        "ejs": "EJS",
        "etlua": "Embedded Lua templating",
        "erb": "ERB",
        "excel-formula": "Excel Formula",
        "xlsx": "Excel Formula",
        "xls": "Excel Formula",
        "fsharp": "F#",
        "firestore-security-rules": "Firestore security rules",
        "ftl": "FreeMarker Template Language",
        "gcode": "G-code",
        "gdscript": "GDScript",
        "gedcom": "GEDCOM",
        "glsl": "GLSL",
        "gml": "GameMaker Language",
        "gamemakerlanguage": "GameMaker Language",
        "graphql": "GraphQL",
        "hs": "Haskell",
        "hcl": "HCL",
        "http": "HTTP",
        "hpkp": "HTTP Public-Key-Pins",
        "hsts": "HTTP Strict-Transport-Security",
        "ichigojam": "IchigoJam",
        "inform7": "Inform 7",
        "javadoc": "JavaDoc",
        "javadoclike": "JavaDoc-like",
        "javastacktrace": "Java stack trace",
        "jq": "JQ",
        "jsdoc": "JSDoc",
        "js-extras": "JS Extras",
        "js-templates": "JS Templates",
        "json": "JSON",
        "jsonp": "JSONP",
        "json5": "JSON5",
        "latex": "LaTeX",
        "tex": "TeX",
        "context": "ConTeXt",
        "lilypond": "LilyPond",
        "ly": "LilyPond",
        "emacs": "Lisp",
        "elisp": "Lisp",
        "emacs-lisp": "Lisp",
        "llvm": "LLVM IR",
        "lolcode": "LOLCODE",
        "md": "Markdown",
        "markup-templating": "Markup templating",
        "matlab": "MATLAB",
        "mel": "MEL",
        "moon": "MoonScript",
        "n1ql": "N1QL",
        "n4js": "N4JS",
        "n4jsd": "N4JS",
        "nand2tetris-hdl": "Nand To Tetris HDL",
        "nasm": "NASM",
        "neon": "NEON",
        "nginx": "nginx",
        "nsis": "NSIS",
        "objectivec": "Objective-C",
        "ocaml": "OCaml",
        "opencl": "OpenCL",
        "parigp": "PARI/GP",
        "objectpascal": "Object Pascal",
        "pcaxis": "PC-Axis",
        "px": "PC-Axis",
        "php": "PHP",
        "phpdoc": "PHPDoc",
        "php-extras": "PHP Extras",
        "plsql": "PL/SQL",
        "powerquery": "PowerQuery",
        "pq": "PowerQuery",
        "mscript": "PowerQuery",
        "powershell": "PowerShell",
        "properties": ".properties",
        "protobuf": "Protocol Buffers",
        "py": "Python",
        "q": "Q (kdb+ database)",
        "qml": "QML",
        "jsx": "React JSX",
        "tsx": "React TSX",
        "renpy": "Ren'py",
        "rest": "reST (reStructuredText)",
        "robotframework": "Robot Framework",
        "robot": "Robot Framework",
        "rb": "Ruby",
        "sas": "SAS",
        "sass": "Sass (Sass)",
        "scss": "Sass (Scss)",
        "shell-session": "Shell session",
        "solidity": "Solidity (Ethereum)",
        "solution-file": "Solution file",
        "sln": "Solution file",
        "soy": "Soy (Closure Template)",
        "sparql": "SPARQL",
        "rq": "SPARQL",
        "splunk-spl": "Splunk SPL",
        "sqf": "SQF: Status Quo Function (Arma 3)",
        "sql": "SQL",
        "tap": "TAP",
        "toml": "TOML",
        "tt2": "Template Toolkit 2",
        "trig": "TriG",
        "ts": "TypeScript",
        "t4-cs": "T4 Text Templates (C#)",
        "t4": "T4 Text Templates (C#)",
        "t4-vb": "T4 Text Templates (VB)",
        "t4-templating": "T4 templating",
        "vbnet": "VB.Net",
        "vhdl": "VHDL",
        "vim": "vim",
        "visual-basic": "Visual Basic",
        "vb": "Visual Basic",
        "wasm": "WebAssembly",
        "wiki": "Wiki markup",
        "xeoracube": "XeoraCube",
        "xojo": "Xojo (REALbasic)",
        "xquery": "XQuery",
        "yaml": "YAML",
        "yml": "YAML"
    } /*]*/ ;
    let langToUse = lang;
    if (langToUse === '' && options.defaultLanguageForUnspecified !== undefined) {
        langToUse = options.defaultLanguageForUnspecified;
    }
    let langShow = Languages[langToUse] || langToUse;
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
    const rCommand = /\s*command:\{\[(\S[\S\s]*)\]\}/i;
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
            _command.split('][').forEach((cmd) => {
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