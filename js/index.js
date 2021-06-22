var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("inout/path", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("inout/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isNode = void 0;
    exports.isNode = typeof process !== 'undefined' &&
        process.versions != null &&
        process.versions.node != null;
    let inout;
    if (exports.isNode) {
        inout = require("./nodeInout");
    }
    else {
        inout = require('./otherInout');
    }
    exports.default = inout;
});
define("extension/types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isvariablerest = exports.isvariablefirst = exports.tonum = exports.iscap = exports.isalphanum = exports.isalpha = exports.isnum = exports.isblank = exports.isws = void 0;
    function isws(c) {
        return c === ' ' || c === '\t' || c === '\r' || c === '\n' || c === '\f';
    }
    exports.isws = isws;
    function isblank(c) {
        return c === ' ' || c === '\t';
    }
    exports.isblank = isblank;
    function isnum(c) {
        return c >= '0' && c <= '9';
    }
    exports.isnum = isnum;
    function isalpha(c) {
        return (c >= 'A' && c <= 'Z') ||
            (c >= 'a' && c <= 'z');
    }
    exports.isalpha = isalpha;
    function isalphanum(c) {
        return isalpha(c) || isnum(c);
    }
    exports.isalphanum = isalphanum;
    function iscap(c) {
        return c >= 'A' && c <= 'Z';
    }
    exports.iscap = iscap;
    function tonum(c) {
        return c - '0';
    }
    exports.tonum = tonum;
    function isvariablefirst(c) {
        return isalpha(c) || c === '_' || c === '@' || c === '$';
    }
    exports.isvariablefirst = isvariablefirst;
    function isvariablerest(c) {
        return isalphanum(c) || c == '?' || c == '_' || c == '!';
    }
    exports.isvariablerest = isvariablerest;
});
define("extension/text", ["require", "exports", "extension/types"], function (require, exports, types_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.capitalize = exports.shallowJSON = exports.lineWrap = exports.dddString = exports.chunkString = exports.escapeString = exports.replaceForAll = void 0;
    function replaceForAll(source, value, newValue) {
        return source.split(value).join(newValue);
    }
    exports.replaceForAll = replaceForAll;
    function escapeChar(c) {
        switch (c) {
            case '\n': {
                return '\\n';
            }
            case '\r': {
                return '\\r';
            }
            case '\t': {
                return '\\r';
            }
            case '\f': {
                return '\\f';
            }
            default: {
                return c;
            }
        }
    }
    function escapeString(source) {
        return source.split('').map(c => {
            if (types_1.isalphanum(c)) {
                return c;
            }
            return escapeChar(c);
        }).join('');
    }
    exports.escapeString = escapeString;
    function chunkString(str, n) {
        var ret = [];
        var i;
        var len;
        for (i = 0, len = str.length; i < len; i += n) {
            ret.push(str.substr(i, n));
        }
        if (ret.length == 0) {
            ret.push('');
        }
        return ret;
    }
    exports.chunkString = chunkString;
    function dddString(source, limit = 20) {
        if (source.length <= limit) {
            return source;
        }
        return source.substring(0, limit - 3) + '...';
    }
    exports.dddString = dddString;
    function lineWrap(s, w) {
        return s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n');
    }
    exports.lineWrap = lineWrap;
    function shallowJSON(object) {
        return JSON.stringify(object, function (k, v) {
            return k && v && typeof v !== "number" ? (Array.isArray(v) ? `[array ${v.length}]` : "" + v) : v;
        }, 2);
    }
    exports.shallowJSON = shallowJSON;
    function capitalize(str) {
        return str[0].toUpperCase() + str.slice(1);
    }
    exports.capitalize = capitalize;
});
define("inout/file", ["require", "exports", "extension/text"], function (require, exports, text_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NewPlFile = void 0;
    function cleanupFile(content) {
        content = text_1.replaceForAll(content, '\r\n', '\n');
        content = text_1.replaceForAll(content, '\r', '\n');
        content = text_1.replaceForAll(content, '\t', '    ');
        return content;
    }
    function NewPlFile(filename, content) {
        content = cleanupFile(content);
        return {
            filename, content
        };
    }
    exports.NewPlFile = NewPlFile;
});
define("compiler/lexing/info", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NewFileInfo = exports.NewEmptyFileInfo = void 0;
    function NewEmptyFileInfo(filename) {
        return {
            row: 0,
            col: 0,
            length: 0,
            filename
        };
    }
    exports.NewEmptyFileInfo = NewEmptyFileInfo;
    function NewFileInfo(row, col, length, filename) {
        return {
            row,
            col,
            length,
            filename
        };
    }
    exports.NewFileInfo = NewFileInfo;
});
define("compiler/lexing/token", ["require", "exports", "compiler/lexing/info", "extension/text"], function (require, exports, info_1, text_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlTokenToString = exports.NewFakePlToken = exports.NewPlToken = exports.PlTokenToPlVariable = exports.TOKEN_VAR_BLACKLIST = exports.TOKEN_OPERATORS = exports.NAME_BLACKLIST = exports.PlTokenType = void 0;
    var PlTokenType;
    (function (PlTokenType) {
        PlTokenType[PlTokenType["FUNC"] = 0] = "FUNC";
        PlTokenType[PlTokenType["IMPL"] = 1] = "IMPL";
        PlTokenType[PlTokenType["IMPORT"] = 2] = "IMPORT";
        PlTokenType[PlTokenType["AS"] = 3] = "AS";
        PlTokenType[PlTokenType["SELECT"] = 4] = "SELECT";
        PlTokenType[PlTokenType["EXPORT"] = 5] = "EXPORT";
        PlTokenType[PlTokenType["RETURN"] = 6] = "RETURN";
        PlTokenType[PlTokenType["BREAK"] = 7] = "BREAK";
        PlTokenType[PlTokenType["CONTINUE"] = 8] = "CONTINUE";
        PlTokenType[PlTokenType["IF"] = 9] = "IF";
        PlTokenType[PlTokenType["ELIF"] = 10] = "ELIF";
        PlTokenType[PlTokenType["ELSE"] = 11] = "ELSE";
        PlTokenType[PlTokenType["EACH"] = 12] = "EACH";
        PlTokenType[PlTokenType["OF"] = 13] = "OF";
        PlTokenType[PlTokenType["LOOP"] = 14] = "LOOP";
        PlTokenType[PlTokenType["WHILE"] = 15] = "WHILE";
        PlTokenType[PlTokenType["FOR"] = 16] = "FOR";
        PlTokenType[PlTokenType["MATCH"] = 17] = "MATCH";
        PlTokenType[PlTokenType["CASE"] = 18] = "CASE";
        PlTokenType[PlTokenType["DEFAULT"] = 19] = "DEFAULT";
        PlTokenType[PlTokenType["AND"] = 20] = "AND";
        PlTokenType[PlTokenType["OR"] = 21] = "OR";
        PlTokenType[PlTokenType["NOT"] = 22] = "NOT";
        PlTokenType[PlTokenType["DOT"] = 23] = "DOT";
        PlTokenType[PlTokenType["ADD"] = 24] = "ADD";
        PlTokenType[PlTokenType["SUB"] = 25] = "SUB";
        PlTokenType[PlTokenType["MUL"] = 26] = "MUL";
        PlTokenType[PlTokenType["DIV"] = 27] = "DIV";
        PlTokenType[PlTokenType["ASGN"] = 28] = "ASGN";
        PlTokenType[PlTokenType["INC"] = 29] = "INC";
        PlTokenType[PlTokenType["DEC"] = 30] = "DEC";
        PlTokenType[PlTokenType["GT"] = 31] = "GT";
        PlTokenType[PlTokenType["LT"] = 32] = "LT";
        PlTokenType[PlTokenType["GTE"] = 33] = "GTE";
        PlTokenType[PlTokenType["LTE"] = 34] = "LTE";
        PlTokenType[PlTokenType["EQ"] = 35] = "EQ";
        PlTokenType[PlTokenType["NEQ"] = 36] = "NEQ";
        PlTokenType[PlTokenType["LBRACE"] = 37] = "LBRACE";
        PlTokenType[PlTokenType["RBRACE"] = 38] = "RBRACE";
        PlTokenType[PlTokenType["LPAREN"] = 39] = "LPAREN";
        PlTokenType[PlTokenType["RPAREN"] = 40] = "RPAREN";
        PlTokenType[PlTokenType["COMMA"] = 41] = "COMMA";
        PlTokenType[PlTokenType["COLON"] = 42] = "COLON";
        PlTokenType[PlTokenType["SEMICOLON"] = 43] = "SEMICOLON";
        PlTokenType[PlTokenType["TYPE"] = 44] = "TYPE";
        PlTokenType[PlTokenType["NUMBER"] = 45] = "NUMBER";
        PlTokenType[PlTokenType["BOOLEAN"] = 46] = "BOOLEAN";
        PlTokenType[PlTokenType["VARIABLE"] = 47] = "VARIABLE";
        PlTokenType[PlTokenType["NULL"] = 48] = "NULL";
        PlTokenType[PlTokenType["STR"] = 49] = "STR";
        PlTokenType[PlTokenType["LF"] = 50] = "LF";
        PlTokenType[PlTokenType["EOF"] = 51] = "EOF";
        PlTokenType[PlTokenType["SPAN"] = 52] = "SPAN";
        PlTokenType[PlTokenType["ERR"] = 53] = "ERR";
    })(PlTokenType = exports.PlTokenType || (exports.PlTokenType = {}));
    exports.NAME_BLACKLIST = [
        PlTokenType.LPAREN,
        PlTokenType.RPAREN,
        PlTokenType.LBRACE,
        PlTokenType.RBRACE,
        PlTokenType.COMMA,
        PlTokenType.COLON,
        PlTokenType.SEMICOLON,
        PlTokenType.DOT,
        PlTokenType.ADD,
        PlTokenType.SUB,
        PlTokenType.MUL,
        PlTokenType.DIV,
        PlTokenType.ASGN,
        PlTokenType.INC,
        PlTokenType.DEC,
        PlTokenType.GT,
        PlTokenType.LT,
        PlTokenType.GTE,
        PlTokenType.LTE,
        PlTokenType.EQ,
        PlTokenType.NEQ,
        PlTokenType.LF, PlTokenType.EOF
    ];
    exports.TOKEN_OPERATORS = [
        PlTokenType.ADD,
        PlTokenType.SUB,
        PlTokenType.MUL,
        PlTokenType.DIV,
        PlTokenType.GT,
        PlTokenType.GTE,
        PlTokenType.LT,
        PlTokenType.LTE,
        PlTokenType.EQ,
        PlTokenType.NEQ,
    ];
    exports.TOKEN_VAR_BLACKLIST = [
        PlTokenType.COLON,
        PlTokenType.LBRACE,
        PlTokenType.RBRACE,
        PlTokenType.LPAREN,
        PlTokenType.RPAREN,
        PlTokenType.COMMA,
        PlTokenType.DOT,
        PlTokenType.LF,
        PlTokenType.EOF,
        PlTokenType.SEMICOLON,
    ];
    function PlTokenToPlVariable(token) {
        if (token.type == PlTokenType.VARIABLE) {
            return token;
        }
        if (exports.TOKEN_VAR_BLACKLIST.includes(token.type)) {
            return null;
        }
        return NewPlToken(PlTokenType.VARIABLE, token.content, token.info);
    }
    exports.PlTokenToPlVariable = PlTokenToPlVariable;
    function NewPlToken(type, content, info) {
        return {
            type,
            content,
            info
        };
    }
    exports.NewPlToken = NewPlToken;
    function NewFakePlToken(type, content) {
        return {
            type,
            content,
            info: info_1.NewEmptyFileInfo('')
        };
    }
    exports.NewFakePlToken = NewFakePlToken;
    function PlTokenToString(token) {
        return `[${token.type}|'${text_2.escapeString(token.content)}'|${token.info.row}:${token.info.col - token.info.length}-${token.info.col},<${token.info.filename}>]`;
    }
    exports.PlTokenToString = PlTokenToString;
});
define("problem/codes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PCFullName = exports.PCHint = void 0;
    const templates = {
        LE0001: "unrecognized character '%0'",
        LE0002: "reached newline with unclosed double quote",
        LE0003: "unrecognized escape sequence '%0'",
        LE0004: "reached newline with unclosed left parenthesis",
        ET0001: "expected a newline or ';' after a statement",
        ET0002: "expected a variable on the left side of assignment",
        ET0003: "expected a variable after the dot",
        ET0004: "unexpected character '%0' during expression",
        ET0005: "expected a variable before postfix operators",
        ET0006: "expected ',' between list items",
        ET0007: "expected '(' when creating a list",
        ET0008: "expected ',' between function arguments",
        ET0009: "expected a variable as the key in a dictionary",
        ET0010: "expected  '(' when creating a dictionary",
        ET0011: "expected ':' between dictionary pairs",
        ET0012: "expected ',' between dictionary pairs",
        ET0013: "expected a name in a function definition",
        ET0014: "expected '(' around the function parameters",
        ET0015: "expected variables for function or impl parameters",
        ET0016: "expected ',' between function or impl parameters",
        ET0017: "expected '{' after function or impl parameters",
        ET0018: "expected '{' after loop keyword or amount",
        ET0019: "expected '{' after while loop conditions",
        ET0020: "expected an expression after export",
        ET0021: "expected '{' after if conditions",
        ET0022: "expected '{' after elif conditions",
        ET0023: "expected '{' after else",
        ET0024: "expected variables for the value or key in each..of statement",
        ET0025: "expected keyword 'of' in each..of statement",
        ET0026: "expected '{' after each..of statement",
        ET0027: "expected a variable as the imply name",
        ET0028: "expected '(' around impl parameters",
        ET0029: "expected keyword 'for' after impl parameters",
        ET0030: "expected '{' after impl definitions",
        ET0043: "expected a target type in an impl definition",
        ET0031: "expected ';' between pre-condition-post expressions",
        ET0032: "expected '{' after for-loop expressions",
        ET0033: "expected '{' after match or match value",
        ET0034: "expected ':' between case expressions in a match",
        ET0035: "expected '{' after a keyword default or a case expression",
        ET0042: "expected keyword 'case' or 'default' in a match statement",
        ET0036: "expected a correct path in an import statement",
        ET0037: "expected the keyword select, as, or newline after an import path",
        ET0038: "expected variable name for an import alias",
        ET0039: "expected commas between import select variables",
        ET0040: "expected variables for import select items",
        ET0041: "expected at least one select item in an import statement",
        ET0044: "expected a variable as the type name",
        ET0045: "expected '(' after the keyword 'type'",
        ET0046: "expected ',' between type members",
        ET0047: "expected variables for type members",
        ET0048: "expected a variable",
        CE0001: "reached newline with unclosed '}'",
        CE0002: "reached newline with unclosed ')'",
        CE0003: "reached newline with unclosed ')'",
        CE0004: "reached newline with unclosed ')'",
        CE0005: "reached newline with unclosed ')'",
        CE0006: "reached newline with unclosed ')'",
        CE0007: "reached newline with unclosed '}'",
        CE0008: "reached newline with unclosed '\"\"\"'",
        CE0009: "reached newline with unclosed ')'",
        LP0001: "more than one default cases in a match statement",
        LP0002: "zero parameters for an impl definition",
        LP0003: "no conditions for a case statement",
        DE0001: "problem during compiling\n%0",
        DE0002: "problem during interpreting\n%0",
        RE0001: "encountered unknown bytecode: '%0'",
        RE0002: "problem on line '%0'",
        RE0003: "no variable named '%0' found",
        RE0004: "no function '%0' on type '%1'",
        RE0005: "cannot negate '%0'",
        RE0006: "incorrect arity for a function call, needs %0 but got %1",
        RE0007: "%0",
        RE0008: "calling an uncallable value of type '%0'",
        RE0009: "'continue' or 'break' used outside a loop",
        RE0010: "not a boolean needed for jump, got type '%0'",
        RE0011: "non numeral loop iterations of type '%0'",
        RE0012: "no key '%0' on target of type '%1'",
        RE0013: "cannot assign to target of type '%0'",
        RE0014: "not a boolean, got type '%0'",
        RE0015: "not a number, got type '%0'",
        RE0016: "need '.%0' type function on value of type '%1'",
        RE0017: "use of 'not' on a non-boolean value of type '%0'",
        RE0018: "'%1' argument failed to satisfy '%0', got '%2' instead",
        RE0019: "no parameter guard named '%0' found",
    };
    function simplyPutA(item = "left brace '{'", where = "'here' is pointing to") {
        return `simply put a ${item} after where ${where}`;
    }
    function INeedA(what) {
        return `I need a ${what}, sticking to the english alphabet is the best bet here`;
    }
    function tryPutting(prefix) {
        return `${prefix}, try putting one after 'here'`;
    }
    function followingSyntax(statement, syntax, need) {
        return `${statement} have the following syntax:\n${syntax}\nI found that you are missing ${need}`;
    }
    function haveYouClosed(type, w) {
        return `${type}(s) not closed, try adding ${w}`;
    }
    const hints = {
        LE0001: 'I do not understand this character, try removing it',
        LE0002: haveYouClosed("string", "a closing '\"'"),
        LE0003: "if you intended to type '\\', write two forward-slashes '\\\\' to escape the first slash",
        LE0004: "string replacement parens not closed, try adding a closing ')'",
        ET0001: "a newline or ';' is needed between statements - this might also be a syntax error",
        ET0002: "the left side of '=' must be a variable",
        ET0003: "to access field(s) that contain symbols, try '<t>.get(<key>)'",
        ET0004: "this expression have the wrong syntax, take a look at the documentation to see what is the valid syntax for Deviation",
        ET0005: "'++' and '--' cannot be used on expressions, I can only increase or decrease variables",
        ET0006: "list items are separated by ',', try putting one after 'here'",
        ET0007: simplyPutA("left paren '('"),
        ET0008: "evoking arguments are separated by ',', try putting one after 'here'",
        ET0009: "a dictionary needs keys that are valid variables, I cannot set operators or symbols as keys of the dictionary",
        ET0010: simplyPutA("left paren '('"),
        ET0011: tryPutting("a dictionary key,value pair is separated with ':'"),
        ET0012: tryPutting("dictionary key,value pairs are separated by ','"),
        ET0013: INeedA("valid variable name to name the function"),
        ET0014: "function parameters are separated by ',', try putting one after 'here'. And if the function doesn't take any parameters, place an empty set of '()' after the function name",
        ET0015: INeedA("valid name for the parameters of a (type) function"),
        ET0016: tryPutting("(type) function parameters are separated by ','"),
        ET0017: simplyPutA(),
        ET0018: simplyPutA(),
        ET0019: simplyPutA(),
        ET0020: "you cannot export nothing. To export every thing, remove this statement",
        ET0021: simplyPutA(),
        ET0022: simplyPutA(),
        ET0023: simplyPutA(),
        ET0024: INeedA("valid name for the value and key in a each..of statement"),
        ET0025: followingSyntax("an each..of statement", "each value, key of target {}", "the 'of' keyword"),
        ET0026: simplyPutA(),
        ET0027: INeedA("valid variable name to name the type function"),
        ET0028: simplyPutA("a parenthesis '('"),
        ET0029: followingSyntax("an impl statement", "impl hello(self) for Num {}", "the 'for' keyword"),
        ET0030: simplyPutA(),
        ET0043: followingSyntax("an impl statement", "impl hello(self) for Num {}", "a type after the 'for' keyword"),
        ET0031: "the conditions of a for loop needs to be separated by semicolons ';', simply put one after 'here'",
        ET0032: simplyPutA(),
        ET0033: simplyPutA(),
        ET0034: tryPutting("match case options must be separated by ','"),
        ET0035: simplyPutA(),
        ET0042: followingSyntax("a match statement", `match item {
    case 1, 2 {}
}`, "the keyword 'case' or 'default' here"),
        ET0036: "a correct path is made of variables or . or .. separated by a slash '/'",
        ET0037: "maybe check your import syntax",
        ET0038: "an alias must be a valid variable that begins with an underscore '_' or a character",
        ET0039: "import select variables must have a comma ',' between them",
        ET0040: "import select variables must be valid variables",
        ET0041: "you cannot select no variables, if importing all variables are needed, try the 'select *' syntax",
        ET0044: INeedA("valid variable name to name the type"),
        ET0045: simplyPutA("left parenthesis '('"),
        ET0046: tryPutting("type members are separated with ','"),
        ET0047: INeedA("valid variable name for the type members"),
        ET0048: "",
        CE0001: haveYouClosed("blocks", "a closing '}'"),
        CE0002: haveYouClosed("groups", "a closing ')'"),
        CE0003: haveYouClosed("dictionary", "a closing ')'"),
        CE0004: haveYouClosed("list", "a closing ')'"),
        CE0005: haveYouClosed("argument list", "a closing ')'"),
        CE0006: haveYouClosed("parameter list", "a closing ')'"),
        CE0007: haveYouClosed("match statement", "a closing '}'"),
        CE0008: haveYouClosed("multiline string", "a closing '\"\"\"'"),
        CE0009: haveYouClosed("type member", "a closing ')'"),
        LP0001: "there can be only one default block in a match statement, try removing all other default cases",
        LP0002: "the first parameter in an impl statement is by convention 'self'",
        LP0003: "a case statement with no expressions will match nothing, if matching nothing is intended, try the 'default {}' syntax",
        DE0001: "the developer made a mistake, please report this",
        DE0002: "the developer made a mistake, please report this",
        RE0001: "there is an unknown bytecode in the program, please report this",
        RE0002: "try running the interpreter with '--mode-debug' flag",
        RE0003: "this variable is not defined anywhere that I've looked",
        RE0004: "I cannot do this operation with these types",
        RE0005: "I can only negate numbers",
        RE0006: "check the number of arguments for the function call, there might be a few missing or a few extras",
        RE0007: "a function panicked, the message is below",
        RE0008: "I can only call a function, what the value that is stored in this variable?",
        RE0009: "the keywords 'continue' and 'break' needs to be used inside a loop",
        RE0010: "I saw a jump instruction but the value is not a boolean",
        RE0011: "I need a number as the amount of times to run this loop statement",
        RE0012: "I cannot find this key in the value, maybe check your spelling?",
        RE0013: "I cannot assign to a non dictionary or type target, if you are trying to make a new type function, try the 'impl' statement",
        RE0014: "I want a boolean here",
        RE0015: "I can only increment or decrement numbers",
        RE0016: "only a value with the '.iter' type function can be used for an each..of loop",
        RE0017: "I can only 'negate' booleans",
        RE0018: "is the type what you expected?",
        RE0019: "this guard is not defined anywhere that I've looked",
    };
    const problemFullName = {
        LE: "LexerError",
        ET: "BadToken",
        CE: "ClosingError",
        LP: "LogicalProblem",
        DE: "DevError",
        RE: "ExeProblem",
    };
    function PCHint(pc) {
        const hint = hints[pc];
        if (hint.length == 0) {
            return "there are no hints";
        }
        return hint;
    }
    exports.PCHint = PCHint;
    function PCFullName(pc) {
        return problemFullName[pc.substring(0, 2)];
    }
    exports.PCFullName = PCFullName;
    exports.default = templates;
});
define("problem/problem", ["require", "exports", "problem/codes", "extension/text"], function (require, exports, codes_1, text_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NewPlProblemAt = exports.NewPlProblem = exports.HTMessage = void 0;
    const hereMessage = {
        before: "before here",
        here: "here",
        after: "after here",
    };
    function HTMessage(hereType) {
        return hereMessage[hereType];
    }
    exports.HTMessage = HTMessage;
    function replaceArgs(content, args) {
        for (let i = 0; i < args.length; ++i) {
            content = content.replace('%' + i, text_3.escapeString(args[i]));
        }
        return content;
    }
    function NewPlProblem(code, fileInfo, ...args) {
        return {
            info: fileInfo,
            message: replaceArgs(codes_1.default[code], args),
            code,
            here: "here"
        };
    }
    exports.NewPlProblem = NewPlProblem;
    function NewPlProblemAt(code, fileInfo, here = "here", ...args) {
        return {
            info: fileInfo,
            message: replaceArgs(codes_1.default[code], args),
            code,
            here
        };
    }
    exports.NewPlProblemAt = NewPlProblemAt;
});
define("compiler/lexing/index", ["require", "exports", "compiler/lexing/token", "compiler/lexing/info", "extension/types", "problem/problem"], function (require, exports, token_1, info_2, types_2, problem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlLexer {
        constructor(file) {
            this.filename = file.filename;
            this.content = file.content;
            this.contentSize = this.content.length;
            this.charPointer = 0;
            this.currentRow = 0;
            this.currentCol = 0;
            this.problems = [];
            this.buffer = [];
        }
        currentChar() {
            return this.content[this.charPointer];
        }
        nextChar() {
            return this.content[this.charPointer + 1];
        }
        currentFileInfo(length) {
            return info_2.NewFileInfo(this.currentRow, this.currentCol, length, this.filename);
        }
        eofFileInfo() {
            return info_2.NewFileInfo(this.currentRow, this.currentCol + 1, 1, this.filename);
        }
        errFileInfo() {
            return info_2.NewFileInfo(this.currentRow, this.currentCol + 1, 1, this.filename);
        }
        advancePointer() {
            ++this.currentCol;
            ++this.charPointer;
            return this.currentChar();
        }
        advanceRow() {
            ++this.currentRow;
            this.currentCol = 0;
        }
        isEOF() {
            return this.charPointer >= this.contentSize;
        }
        isNextEOF() {
            return this.charPointer + 1 >= this.contentSize;
        }
        testNextChars(chars, tokenType) {
            const size = chars.length;
            let i;
            for (i = 0; i < size; ++i) {
                if (!this.isEOF()) {
                    let c = this.currentChar();
                    if (c === chars[i]) {
                        this.advancePointer();
                        continue;
                    }
                }
                this.currentCol -= i;
                this.charPointer -= i;
                return null;
            }
            return token_1.NewPlToken(tokenType, chars, this.currentFileInfo(i));
        }
        testNextKeyword(keyword, tokenType) {
            const size = keyword.length;
            let i;
            for (i = 0; i < size; ++i) {
                if (!this.isEOF()) {
                    let c = this.currentChar();
                    if (c === keyword[i]) {
                        this.advancePointer();
                        continue;
                    }
                }
                this.currentCol -= i;
                this.charPointer -= i;
                return null;
            }
            if (!this.isEOF() && types_2.isvariablerest(this.currentChar())) {
                this.currentCol -= i;
                this.charPointer -= i;
                return null;
            }
            return token_1.NewPlToken(tokenType, keyword, this.currentFileInfo(i));
        }
        newErrorToken(code, info, ...args) {
            this.problems.push(problem_1.NewPlProblem(code, info, ...args));
            return token_1.NewPlToken(token_1.PlTokenType.ERR, "", info);
        }
        addBuffer(token) {
            this.buffer.push(token);
        }
        popBuffer() {
            return this.buffer.shift();
        }
        haveBuffered() {
            return this.buffer.length > 0;
        }
        nextToken(consume = true) {
            if (consume && this.haveBuffered()) {
                return this.popBuffer();
            }
            if (this.isEOF()) {
                return token_1.NewPlToken(token_1.PlTokenType.EOF, "eof", this.eofFileInfo());
            }
            while (types_2.isblank(this.currentChar())) {
                this.advancePointer();
            }
            if (this.isEOF()) {
                return token_1.NewPlToken(token_1.PlTokenType.EOF, "eof", this.eofFileInfo());
            }
            while (!this.isEOF() && this.currentChar() === '#') {
                do {
                    this.advancePointer();
                } while (!this.isEOF() && this.currentChar() !== '\n');
            }
            if (this.isEOF()) {
                return token_1.NewPlToken(token_1.PlTokenType.EOF, "eof", this.eofFileInfo());
            }
            let c = this.currentChar();
            if (types_2.isnum(c)) {
                let content = '';
                const oldCol = this.currentCol;
                do {
                    content += c;
                    this.advancePointer();
                    c = this.currentChar();
                } while (types_2.isnum(c) && !this.isEOF());
                if (!this.isEOF() && !this.isNextEOF() && c === '.' && types_2.isnum(this.nextChar())) {
                    do {
                        content += c;
                        this.advancePointer();
                        c = this.currentChar();
                    } while (types_2.isnum(c) && !this.isEOF());
                }
                if (!this.isEOF() && !this.isNextEOF() && (c == 'e' || c == 'E') && (types_2.isnum(this.nextChar()) || this.nextChar() == '-')) {
                    if (this.nextChar() == '-') {
                        content += c;
                        this.advancePointer();
                        c = this.currentChar();
                    }
                    do {
                        content += c;
                        this.advancePointer();
                        c = this.currentChar();
                    } while (types_2.isnum(c) && !this.isEOF());
                }
                return token_1.NewPlToken(token_1.PlTokenType.NUMBER, content, this.currentFileInfo(this.currentCol - oldCol));
            }
            const singleSymbolMap = {
                '.': token_1.PlTokenType.DOT,
                '{': token_1.PlTokenType.LBRACE,
                '}': token_1.PlTokenType.RBRACE,
                '(': token_1.PlTokenType.LPAREN,
                ')': token_1.PlTokenType.RPAREN,
                ',': token_1.PlTokenType.COMMA,
                ':': token_1.PlTokenType.COLON,
                ';': token_1.PlTokenType.SEMICOLON,
            };
            if (singleSymbolMap.hasOwnProperty(c)) {
                this.advancePointer();
                return token_1.NewPlToken(singleSymbolMap[c], c, this.currentFileInfo(1));
            }
            switch (c) {
                case '+': {
                    let token = this.testNextChars("++", token_1.PlTokenType.INC);
                    if (token) {
                        return token;
                    }
                    this.advancePointer();
                    return token_1.NewPlToken(token_1.PlTokenType.ADD, c, this.currentFileInfo(1));
                }
                case '-': {
                    let token = this.testNextChars("--", token_1.PlTokenType.DEC);
                    if (token) {
                        return token;
                    }
                    this.advancePointer();
                    return token_1.NewPlToken(token_1.PlTokenType.SUB, c, this.currentFileInfo(1));
                }
                case '*': {
                    this.advancePointer();
                    return token_1.NewPlToken(token_1.PlTokenType.MUL, c, this.currentFileInfo(1));
                }
                case '/': {
                    let token = this.testNextChars("/=", token_1.PlTokenType.NEQ);
                    if (token) {
                        return token;
                    }
                    this.advancePointer();
                    return token_1.NewPlToken(token_1.PlTokenType.DIV, c, this.currentFileInfo(1));
                }
                case '=': {
                    let token = this.testNextChars("==", token_1.PlTokenType.EQ);
                    if (token) {
                        return token;
                    }
                    this.advancePointer();
                    return token_1.NewPlToken(token_1.PlTokenType.ASGN, c, this.currentFileInfo(1));
                }
                case '>': {
                    let token = this.testNextChars(">=", token_1.PlTokenType.GTE);
                    if (token) {
                        return token;
                    }
                    this.advancePointer();
                    return token_1.NewPlToken(token_1.PlTokenType.GT, c, this.currentFileInfo(1));
                }
                case '<': {
                    let token = this.testNextChars("<=", token_1.PlTokenType.LTE);
                    if (token) {
                        return token;
                    }
                    this.advancePointer();
                    return token_1.NewPlToken(token_1.PlTokenType.LT, c, this.currentFileInfo(1));
                }
                case 'f': {
                    for (const pair of [["func", token_1.PlTokenType.FUNC], ["for", token_1.PlTokenType.FOR], ["false", token_1.PlTokenType.BOOLEAN]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'i': {
                    for (const pair of [["impl", token_1.PlTokenType.IMPL], ["import", token_1.PlTokenType.IMPORT], ["if", token_1.PlTokenType.IF]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'a': {
                    for (const pair of [["as", token_1.PlTokenType.AS], ["and", token_1.PlTokenType.AND]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 't': {
                    for (const pair of [["true", token_1.PlTokenType.BOOLEAN], ["type", token_1.PlTokenType.TYPE]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'e': {
                    for (const pair of [["export", token_1.PlTokenType.EXPORT], ["elif", token_1.PlTokenType.ELIF], ["else", token_1.PlTokenType.ELSE], ["each", token_1.PlTokenType.EACH]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'r': {
                    for (const pair of [["return", token_1.PlTokenType.RETURN]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'b': {
                    for (const pair of [["break", token_1.PlTokenType.BREAK]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'c': {
                    for (const pair of [["continue", token_1.PlTokenType.CONTINUE], ["case", token_1.PlTokenType.CASE]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'l': {
                    for (const pair of [["loop", token_1.PlTokenType.LOOP]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'w': {
                    for (const pair of [["while", token_1.PlTokenType.WHILE]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'm': {
                    for (const pair of [["match", token_1.PlTokenType.MATCH]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'd': {
                    for (const pair of [["default", token_1.PlTokenType.DEFAULT]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'o': {
                    for (const pair of [["or", token_1.PlTokenType.OR], ["of", token_1.PlTokenType.OF]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 'n': {
                    for (const pair of [["not", token_1.PlTokenType.NOT], ["null", token_1.PlTokenType.NULL]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case 's': {
                    for (const pair of [["select", token_1.PlTokenType.SELECT]]) {
                        const [str, type] = pair;
                        const token = this.testNextKeyword(str, type);
                        if (token) {
                            return token;
                        }
                    }
                    break;
                }
                case '\n': {
                    this.advancePointer();
                    const token = token_1.NewPlToken(token_1.PlTokenType.LF, '\n', this.currentFileInfo(1));
                    this.advanceRow();
                    return token;
                }
            }
            if (c === '"') {
                let content = '';
                if (this.testNextChars('"""', token_1.PlTokenType.STR) != null) {
                    const oldRow = this.currentRow;
                    const oldCol = this.currentCol;
                    while (true) {
                        if (this.isEOF()) {
                            return this.newErrorToken("CE0008", info_2.NewFileInfo(oldRow, oldCol, 3, this.filename));
                        }
                        c = this.currentChar();
                        content += c;
                        if (this.testNextChars('"""', token_1.PlTokenType.STR) != null) {
                            break;
                        }
                        if (c == '\n') {
                            this.advanceRow();
                            ++this.charPointer;
                        }
                        else {
                            this.advancePointer();
                        }
                    }
                    let fi;
                    if (this.currentRow != oldRow) {
                        fi = this.currentFileInfo(3);
                    }
                    else {
                        fi = this.currentFileInfo(this.currentCol - oldCol);
                    }
                    return token_1.NewPlToken(token_1.PlTokenType.STR, content.substring(0, content.length - 1), fi);
                }
                this.advancePointer();
                let oldCol = this.currentCol;
                let lastCol = oldCol;
                const lastBuffer = this.buffer.length;
                const info = this.currentFileInfo(1);
                while (true) {
                    if (this.isEOF()) {
                        return this.newErrorToken("LE0002", info);
                    }
                    c = this.currentChar();
                    if (c == '\n') {
                        return this.newErrorToken("LE0002", info);
                    }
                    if (c === '\\') {
                        this.advancePointer();
                        c = this.currentChar();
                        switch (c) {
                            case 'n': {
                                content += "\n";
                                break;
                            }
                            case 't': {
                                content += '\t';
                                break;
                            }
                            case 'r': {
                                content += '\r';
                                break;
                            }
                            case 'f': {
                                content += '\f';
                                break;
                            }
                            case '"': {
                                content += '"';
                                break;
                            }
                            case '\\': {
                                content += "\\";
                                break;
                            }
                            case '(': {
                                this.addBuffer(token_1.NewPlToken(token_1.PlTokenType.STR, content.substring(0, content.length), this.currentFileInfo(this.currentCol - lastCol + 1)));
                                content = '';
                                this.advancePointer();
                                this.addBuffer(token_1.NewPlToken(token_1.PlTokenType.ADD, '+', this.currentFileInfo(2)));
                                this.addBuffer(token_1.NewPlToken(token_1.PlTokenType.VARIABLE, 'Str', this.currentFileInfo(1)));
                                this.addBuffer(token_1.NewPlToken(token_1.PlTokenType.LPAREN, '(', this.currentFileInfo(1)));
                                const lparen = this.currentFileInfo(2);
                                let lparens = 0;
                                while (true) {
                                    const last = this.buffer.length;
                                    const token = this.nextToken(false);
                                    if (token.type == token_1.PlTokenType.ERR) {
                                        return token;
                                    }
                                    if (token.type === token_1.PlTokenType.EOF || token.type == token_1.PlTokenType.LF) {
                                        return this.newErrorToken("LE0004", lparen);
                                    }
                                    if (this.buffer.length - last > 1) {
                                        this.buffer.splice(last, 0, token);
                                    }
                                    else {
                                        this.addBuffer(token);
                                        if (token.type == token_1.PlTokenType.LPAREN) {
                                            lparens++;
                                        }
                                        else if (token.type === token_1.PlTokenType.RPAREN) {
                                            if (lparens == 0) {
                                                break;
                                            }
                                            lparens--;
                                        }
                                    }
                                }
                                this.addBuffer(token_1.NewPlToken(token_1.PlTokenType.ADD, '+', this.currentFileInfo(1)));
                                lastCol = this.currentCol;
                                continue;
                            }
                            default: {
                                return this.newErrorToken("LE0003", info_2.NewFileInfo(this.currentRow, this.currentCol + 1, 2, this.filename), c);
                            }
                        }
                        this.advancePointer();
                        continue;
                    }
                    content += c;
                    if (c == '"') {
                        this.advancePointer();
                        break;
                    }
                    this.advancePointer();
                }
                const hasMore = this.buffer.length - lastBuffer > 1;
                this.addBuffer(token_1.NewPlToken(token_1.PlTokenType.STR, content.substring(0, content.length - 1), this.currentFileInfo(this.currentCol - lastCol + (hasMore ? 0 : 1))));
                if (hasMore) {
                    this.addBuffer(token_1.NewPlToken(token_1.PlTokenType.RPAREN, ")", this.currentFileInfo(1)));
                    return token_1.NewPlToken(token_1.PlTokenType.LPAREN, "(", info);
                }
                return this.buffer.pop();
            }
            if (types_2.isvariablefirst(c)) {
                let content = '';
                const oldCol = this.currentCol;
                do {
                    content += c;
                    this.advancePointer();
                    c = this.currentChar();
                } while (!this.isEOF() && types_2.isvariablerest(c));
                return token_1.NewPlToken(token_1.PlTokenType.VARIABLE, content, this.currentFileInfo(this.currentCol - oldCol));
            }
            return this.newErrorToken("LE0001", this.errFileInfo(), c);
        }
        parseAll() {
            let tokens = [];
            while (true) {
                const token = this.nextToken();
                tokens.push(token);
                if (token.type === token_1.PlTokenType.EOF || token.type === token_1.PlTokenType.ERR) {
                    break;
                }
            }
            return tokens;
        }
        getProblems() {
            return this.problems;
        }
    }
    exports.default = PlLexer;
});
define("inout/color", ["require", "exports", "inout/index"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.colors = void 0;
    const COLORS = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
    if (index_1.isNode) {
        exports.colors = (function (colors) {
            const fn = (code, str) => `\x1b[${code}m${str}\x1b[39m`;
            const obj = { grey: fn.bind(null, 90) };
            for (let i = 0; i < colors.length; i++)
                obj[colors[i]] = fn.bind(null, 30 + i);
            return obj;
        })(COLORS);
    }
    else {
        exports.colors = {};
        for (const color of [...COLORS, 'grey']) {
            exports.colors[color] = (str) => `<span\\style='color:${color}'>${str}</span>`;
        }
    }
});
define("problem/trace", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NewPlTraceFrame = void 0;
    function NewPlTraceFrame(name, info = null) {
        return {
            name,
            info
        };
    }
    exports.NewPlTraceFrame = NewPlTraceFrame;
});
define("problem/printer", ["require", "exports", "problem/problem", "problem/codes", "inout/color", "extension/text"], function (require, exports, problem_2, codes_2, color_1, text_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogProblemList = exports.LogTrace = exports.CreateFrame = exports.LogProblemShort = exports.LogCallbackProblem = exports.LogProblem = exports.CreateProblemMessage = exports.CreateProblemBody = exports.CreateProblemTitle = void 0;
    const NLINESUP = 1;
    const NLINESDOWN = 2;
    const CHARWRAP = 60;
    const TRACE_MAX = 3;
    const NEWLINE_SYMBOL = " ";
    function multiLine(line, prefix, offset) {
        return text_4.replaceForAll(text_4.lineWrap(line, CHARWRAP - offset), '\n', '\n' + prefix);
    }
    function getLine(lines, targetRow) {
        if (targetRow >= 0 && targetRow < lines.length) {
            return text_4.dddString(lines[targetRow], CHARWRAP);
        }
        return null;
    }
    function getLines(lines, targetRow) {
        let linesUp = [];
        let linesDown = [];
        for (let i = 0; i < NLINESUP; ++i) {
            linesUp.push(getLine(lines, targetRow - i - 1));
        }
        for (let i = 0; i < NLINESDOWN; ++i) {
            linesDown.push(getLine(lines, targetRow + i + 1));
        }
        return [
            linesUp,
            getLine(lines, targetRow),
            linesDown,
        ];
    }
    function CreateProblemTitle(code, info) {
        const buffer = [];
        if (info == null) {
            buffer.push(`[${code}]`);
        }
        else {
            buffer.push(`[${code}] In "${info.filename}" on line ${info.row + 1}`);
        }
        return buffer;
    }
    exports.CreateProblemTitle = CreateProblemTitle;
    function CreateProblemBody(here, info, content, grey = color_1.colors.grey) {
        const buffer = [];
        const actualCol = info.col - info.length;
        const largestLineNumberLength = (info.row + NLINESDOWN).toString().length;
        const contentLines = content.split('\n');
        const [linesUp, targetLine, linesDown] = getLines(contentLines, info.row);
        let startLine = info.row - NLINESUP + 1;
        for (const line of linesUp) {
            if (line !== null) {
                buffer.push(grey(startLine.toString().padStart(largestLineNumberLength) + '| ' + line));
            }
            ++startLine;
        }
        buffer.push(startLine.toString().padStart(largestLineNumberLength) + '| ' + targetLine);
        ++startLine;
        buffer.push(' '.repeat(largestLineNumberLength) + grey('| ') + ' '.repeat(actualCol) + color_1.colors.red('^'.repeat(info.length) + ' ' + problem_2.HTMessage(here)));
        for (const line of linesDown) {
            if (line !== null) {
                buffer.push(grey(startLine.toString().padStart(largestLineNumberLength) + '| ' + line));
            }
            ++startLine;
        }
        return buffer;
    }
    exports.CreateProblemBody = CreateProblemBody;
    function CreateProblemMessage(code, message) {
        const buffer = [];
        const hint = codes_2.PCHint(code);
        buffer.push(`${color_1.colors.yellow("Hint")}: ${multiLine(text_4.capitalize(hint), `    ${NEWLINE_SYMBOL} `, 6)}`);
        const fullname = codes_2.PCFullName(code);
        buffer.push(`${color_1.colors.cyan(fullname)}: ${multiLine(text_4.capitalize(message), ' '.repeat(fullname.length) + `${NEWLINE_SYMBOL} `, fullname.length + 2)}`);
        return buffer;
    }
    exports.CreateProblemMessage = CreateProblemMessage;
    function LogProblem(problem, content) {
        let buffer = [];
        const { code, info, message, here } = problem;
        buffer.push(...CreateProblemTitle(code, info));
        if (info != null) {
            buffer.push(...CreateProblemBody(here, info, content));
        }
        buffer.push('');
        buffer.push(...CreateProblemMessage(code, message));
        return buffer.join('\n');
    }
    exports.LogProblem = LogProblem;
    function LogCallbackProblem(problem) {
        let buffer = [];
        const { code, info, message, here } = problem;
        buffer.push(...CreateProblemTitle(code, info));
        buffer.push('');
        buffer.push(...CreateProblemMessage(code, message));
        return buffer.join('\n');
    }
    exports.LogCallbackProblem = LogCallbackProblem;
    function LogProblemShort(problem) {
        return `${color_1.colors.cyan(codes_2.PCFullName(problem.code))}: ${text_4.capitalize(problem.message)}`;
    }
    exports.LogProblemShort = LogProblemShort;
    function CreateFrame(name, info) {
        let text = `In frame '${name}'`;
        if (info) {
            text += ` on line ${info.row + 1}`;
        }
        return text;
    }
    exports.CreateFrame = CreateFrame;
    function LogTrace(trace) {
        let buffer = [];
        for (const frame of trace) {
            if (buffer.length == TRACE_MAX) {
                buffer.push(`... ${trace.length - TRACE_MAX} frame(s) omitted`);
                break;
            }
            buffer.push(CreateFrame(frame.name, frame.info));
        }
        buffer.reverse();
        return buffer.join('\n');
    }
    exports.LogTrace = LogTrace;
    function ShowProblem(code) {
        const message = codes_2.default[code];
        if (message == undefined) {
            return `[${code}]\nNo entry found for ${code}`;
        }
        const hint = codes_2.PCHint(code);
        const name = codes_2.PCFullName(code);
        return `[${code}]
Type: ${color_1.colors.cyan(name)}
Hint: ${color_1.colors.yellow(text_4.lineWrap(hint, 80))}
Template: ${text_4.lineWrap(message, 80)}`;
    }
    function LogProblemList(filters) {
        const problemCodes = Object.keys(codes_2.default);
        const out = [];
        if (filters.length == 0) {
            for (const key of problemCodes) {
                out.push(ShowProblem(key));
            }
        }
        else {
            for (const code of filters) {
                out.push(ShowProblem(code));
            }
        }
        return out.join('\n\n');
    }
    exports.LogProblemList = LogProblemList;
});
define("problem/index", ["require", "exports", "problem/printer", "inout/index", "inout/color"], function (require, exports, printer_1, inout_1, color_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReportCallbackProblems = exports.ReportProblems = exports.ReportProblem = void 0;
    function ReportProblem(problem, content) {
        inout_1.default.print(color_2.colors.red("Problem(s) Occurred"));
        inout_1.default.print(printer_1.LogProblem(problem, content));
        inout_1.default.flush();
    }
    exports.ReportProblem = ReportProblem;
    function ReportProblems(content, problems, trace) {
        inout_1.default.print(color_2.colors.red("Problem(s) Occurred"));
        if (trace && trace.length > 1) {
            inout_1.default.print(color_2.colors.red('Callframes (Most Recent Last)'));
            inout_1.default.print(printer_1.LogTrace(trace));
            inout_1.default.print('');
        }
        try {
            for (const problem of problems) {
                inout_1.default.print(printer_1.LogProblem(problem, content));
            }
        }
        catch (e) {
            inout_1.default.print(`${color_2.colors.red("Exception")} in reporting the problems: ${e}`);
            inout_1.default.print("This is a developer error, please report this to him");
            inout_1.default.flush();
            return false;
        }
        if (inout_1.default.options["mode"] != "debug") {
            inout_1.default.print(color_2.colors.green("\nTo see a more detailed error, pass '--mode-debug' when running from cli"));
        }
        inout_1.default.flush();
        return true;
    }
    exports.ReportProblems = ReportProblems;
    function ReportCallbackProblems(problem, trace) {
        inout_1.default.print(color_2.colors.red("Callback Problem(s) Occurred"));
        if (trace.length == 0) {
            inout_1.default.print(color_2.colors.red('No Callframes'));
        }
        else {
            inout_1.default.print(color_2.colors.red('Callframes:'));
            inout_1.default.print(printer_1.LogTrace(trace));
        }
        inout_1.default.print('');
        try {
            inout_1.default.print(printer_1.LogCallbackProblem(problem));
        }
        catch (e) {
            inout_1.default.print(`Exception in reporting the problems: ${e}`);
            inout_1.default.print("This is a developer error, please report this to him");
            inout_1.default.flush();
            return false;
        }
        inout_1.default.flush();
        return true;
    }
    exports.ReportCallbackProblems = ReportCallbackProblems;
});
define("compiler/parsing/ast", ["require", "exports", "compiler/lexing/token", "compiler/lexing/info"], function (require, exports, token_2, info_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASTVariable = exports.ASTNull = exports.ASTString = exports.ASTBoolean = exports.ASTNumber = exports.ASTClosure = exports.ASTDict = exports.ASTList = exports.ASTType = exports.ASTUnary = exports.ASTBinary = exports.ASTCall = exports.ASTDot = exports.ASTCreate = exports.ASTAssign = exports.ASTMatch = exports.ASTFor = exports.ASTWhile = exports.ASTLoop = exports.ASTEach = exports.ASTIf = exports.ASTContinue = exports.ASTBreak = exports.ASTReturn = exports.ASTExport = exports.ASTImport = exports.ASTImpl = exports.ASTFunction = exports.ASTBlock = exports.ASTExpression = exports.ASTStatement = exports.ASTNode = exports.ASTAttributes = exports.CreateSpanToken = exports.ASTProgramToString = void 0;
    function ASTProgramToString(program) {
        let statements = [];
        for (const statement of program) {
            statements.push(JSON.stringify(statement));
        }
        return statements.map((str, line) => `Line ${line + 1}| ${str}`).join('\n');
    }
    exports.ASTProgramToString = ASTProgramToString;
    function CreateSpanToken(firstToken, lastToken, content = null) {
        if (content == null) {
            content = firstToken.content + lastToken.content;
        }
        return token_2.NewPlToken(token_2.PlTokenType.SPAN, content, info_3.NewFileInfo(firstToken.info.row, lastToken.info.col, lastToken.info.col - firstToken.info.col + firstToken.info.length, firstToken.info.filename));
    }
    exports.CreateSpanToken = CreateSpanToken;
    var ASTAttributes;
    (function (ASTAttributes) {
        ASTAttributes["ASTCondition"] = "ASTCondition";
    })(ASTAttributes = exports.ASTAttributes || (exports.ASTAttributes = {}));
    class ASTNode {
        constructor(tokens) {
            this.tokens = tokens;
            this.attribute = null;
        }
        firstToken() {
            return this.tokens[0];
        }
        lastToken() {
            return this.tokens[this.tokens.length - 1];
        }
        getSpanToken() {
            try {
                const firstToken = this.firstToken();
                const lastToken = this.lastToken();
                if (lastToken.info.row != firstToken.info.row) {
                    return firstToken;
                }
                return CreateSpanToken(firstToken, lastToken, this.tokens.map(t => t.content).join(''));
            }
            catch (e) {
                if (this.tokens.length == 0) {
                    return token_2.NewFakePlToken(token_2.PlTokenType.SPAN, '');
                }
            }
        }
        is(type) {
            return this instanceof type;
        }
    }
    exports.ASTNode = ASTNode;
    class ASTStatement extends ASTNode {
    }
    exports.ASTStatement = ASTStatement;
    class ASTExpression extends ASTNode {
    }
    exports.ASTExpression = ASTExpression;
    class ASTBlock extends ASTStatement {
        constructor(tokens, statements) {
            super(tokens);
            this.statements = statements;
        }
    }
    exports.ASTBlock = ASTBlock;
    class ASTFunction extends ASTStatement {
        constructor(tokens, name, args, guards, block) {
            super(tokens);
            this.name = name;
            this.args = args;
            this.guards = guards;
            this.block = block;
        }
        lastToken() {
            return this.block.getSpanToken();
        }
    }
    exports.ASTFunction = ASTFunction;
    class ASTImpl extends ASTStatement {
        constructor(tokens, name, args, guards, target, block) {
            super(tokens);
            this.name = name;
            this.args = args;
            this.guards = guards;
            this.target = target;
            this.block = block;
        }
        lastToken() {
            return this.block.getSpanToken();
        }
    }
    exports.ASTImpl = ASTImpl;
    class ASTImport extends ASTStatement {
        constructor(tokens, path, alias, select) {
            super(tokens);
            this.path = path;
            this.alias = alias;
            this.select = select;
        }
    }
    exports.ASTImport = ASTImport;
    class ASTExport extends ASTStatement {
        constructor(tokens, content) {
            super(tokens);
            this.content = content;
        }
    }
    exports.ASTExport = ASTExport;
    class ASTReturn extends ASTStatement {
        constructor(tokens, content) {
            super(tokens);
            this.content = content;
        }
    }
    exports.ASTReturn = ASTReturn;
    class ASTBreak extends ASTStatement {
        constructor(tokens) {
            super(tokens);
        }
    }
    exports.ASTBreak = ASTBreak;
    class ASTContinue extends ASTStatement {
        constructor(tokens) {
            super(tokens);
        }
    }
    exports.ASTContinue = ASTContinue;
    class ASTIf extends ASTStatement {
        constructor(tokens, conditions, blocks, other) {
            super(tokens);
            this.conditions = conditions;
            this.blocks = blocks;
            this.other = other;
        }
        lastToken() {
            if (this.other) {
                return this.other.getSpanToken();
            }
            return this.blocks[this.blocks.length - 1].getSpanToken();
        }
    }
    exports.ASTIf = ASTIf;
    class ASTEach extends ASTStatement {
        constructor(tokens, value, iterator, block, key) {
            super(tokens);
            this.value = value;
            this.key = key;
            this.iterator = iterator;
            this.block = block;
        }
        lastToken() {
            return this.block.getSpanToken();
        }
    }
    exports.ASTEach = ASTEach;
    class ASTLoop extends ASTStatement {
        constructor(tokens, block, amount) {
            super(tokens);
            this.amount = amount;
            this.block = block;
        }
        lastToken() {
            return this.block.getSpanToken();
        }
    }
    exports.ASTLoop = ASTLoop;
    class ASTWhile extends ASTStatement {
        constructor(tokens, condition, block) {
            super(tokens);
            this.condition = condition;
            this.block = block;
        }
        lastToken() {
            return this.block.getSpanToken();
        }
    }
    exports.ASTWhile = ASTWhile;
    class ASTFor extends ASTStatement {
        constructor(tokens, block, start, condition, after) {
            super(tokens);
            this.start = start;
            this.condition = condition;
            this.after = after;
            this.block = block;
        }
        lastToken() {
            return this.block.getSpanToken();
        }
    }
    exports.ASTFor = ASTFor;
    class ASTMatch extends ASTStatement {
        constructor(tokens, value, cases, blocks, other) {
            super(tokens);
            this.value = value;
            this.cases = cases;
            this.blocks = blocks;
            this.other = other;
        }
    }
    exports.ASTMatch = ASTMatch;
    class ASTAssign extends ASTExpression {
        constructor(tokens, pre, variable, value) {
            super(tokens);
            this.pre = pre;
            this.variable = variable;
            this.value = value;
        }
        firstToken() {
            return this.pre == null ? this.variable.getSpanToken() : this.pre.getSpanToken();
        }
        lastToken() {
            return this.value.getSpanToken();
        }
    }
    exports.ASTAssign = ASTAssign;
    class ASTCreate extends ASTAssign {
    }
    exports.ASTCreate = ASTCreate;
    class ASTDot extends ASTExpression {
        constructor(tokens, left, right) {
            super(tokens);
            this.left = left;
            this.right = right;
        }
        firstToken() {
            return this.left.getSpanToken();
        }
        lastToken() {
            return this.right.getSpanToken();
        }
    }
    exports.ASTDot = ASTDot;
    class ASTCall extends ASTExpression {
        constructor(tokens, target, args) {
            super(tokens);
            this.target = target;
            this.args = args;
        }
        firstToken() {
            return this.target.getSpanToken();
        }
        lastToken() {
            return this.target.getSpanToken();
        }
    }
    exports.ASTCall = ASTCall;
    class ASTBinary extends ASTExpression {
        constructor(tokens, left, right, operator) {
            super(tokens);
            this.left = left;
            this.right = right;
            this.operator = operator;
        }
        firstToken() {
            return this.left.getSpanToken();
        }
        lastToken() {
            return this.right.getSpanToken();
        }
    }
    exports.ASTBinary = ASTBinary;
    class ASTUnary extends ASTExpression {
        constructor(tokens, operator, value) {
            super(tokens);
            this.operator = operator;
            this.value = value;
        }
        isPostfix() {
            return this.operator.type == token_2.PlTokenType.INC || this.operator.type == token_2.PlTokenType.DEC;
        }
        firstToken() {
            if (this.isPostfix()) {
                return this.value.getSpanToken();
            }
            return this.operator;
        }
        lastToken() {
            if (this.isPostfix()) {
                return this.operator;
            }
            return this.value.getSpanToken();
        }
    }
    exports.ASTUnary = ASTUnary;
    class ASTType extends ASTExpression {
        constructor(tokens, name, members) {
            super(tokens);
            this.name = name;
            this.members = members;
        }
        firstToken() {
            return this.name.getSpanToken();
        }
        lastToken() {
            return this.name.getSpanToken();
        }
    }
    exports.ASTType = ASTType;
    class ASTList extends ASTExpression {
        constructor(tokens, values) {
            super(tokens);
            this.values = values;
        }
    }
    exports.ASTList = ASTList;
    class ASTDict extends ASTExpression {
        constructor(tokens, keys, values) {
            super(tokens);
            this.keys = keys;
            this.values = values;
        }
    }
    exports.ASTDict = ASTDict;
    class ASTClosure extends ASTExpression {
        constructor(tokens, args, guards, block) {
            super(tokens);
            this.args = args;
            this.guards = guards;
            this.block = block;
        }
    }
    exports.ASTClosure = ASTClosure;
    class ASTNumber extends ASTExpression {
        constructor(tokens, value) {
            super(tokens);
            this.value = value;
        }
    }
    exports.ASTNumber = ASTNumber;
    class ASTBoolean extends ASTExpression {
        constructor(tokens, value) {
            super(tokens);
            this.value = value;
        }
    }
    exports.ASTBoolean = ASTBoolean;
    class ASTString extends ASTExpression {
        constructor(tokens, content) {
            super(tokens);
            this.content = content;
        }
    }
    exports.ASTString = ASTString;
    class ASTNull extends ASTExpression {
        constructor(tokens) {
            super(tokens);
        }
    }
    exports.ASTNull = ASTNull;
    class ASTVariable extends ASTExpression {
        constructor(tokens, content) {
            super(tokens);
            this.content = content;
        }
    }
    exports.ASTVariable = ASTVariable;
});
define("compiler/parsing/index", ["require", "exports", "problem/problem", "compiler/parsing/ast", "compiler/lexing/token"], function (require, exports, problem_3, ast_1, token_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlAstParser = exports.CREATE_MAGIC = void 0;
    class ErrTokenException {
    }
    exports.CREATE_MAGIC = '@';
    function stripSep(ast) {
        if (ast.content.startsWith(exports.CREATE_MAGIC)) {
            ast.content = ast.content.slice(1);
        }
    }
    class PlAstParser {
        constructor(lexer) {
            this.lexer = lexer;
            this.cacheToken = [];
            this.problems = [];
        }
        getProblems() {
            return [...this.problems, ...this.lexer.getProblems()];
        }
        parseOnce() {
            try {
                return this.pStatement();
            }
            catch (e) {
                if (e instanceof ErrTokenException) {
                    return null;
                }
                this.newProblem(this.getToken(), "DE0001", '' + e);
                return null;
            }
        }
        parseAll() {
            let statements = [];
            while (true) {
                try {
                    if (this.isEOF()) {
                        break;
                    }
                }
                catch (e) {
                    return null;
                }
                const statement = this.parseOnce();
                if (statement == null) {
                    return null;
                }
                statements.push(statement);
            }
            return statements;
        }
        isEOF() {
            this.clearLF();
            const peekToken = this.peekToken();
            return peekToken.type == token_3.PlTokenType.EOF;
        }
        getToken() {
            if (this.cacheToken.length != 0) {
                return this.cacheToken.pop();
            }
            return this.lexer.nextToken();
        }
        nextToken() {
            const token = this.getToken();
            if (token.type == token_3.PlTokenType.ERR) {
                throw new ErrTokenException();
            }
            return token;
        }
        peekToken() {
            const token = this.getToken();
            this.cacheToken.push(token);
            if (token.type == token_3.PlTokenType.ERR) {
                throw new ErrTokenException();
            }
            return token;
        }
        pushToken(token) {
            this.cacheToken.push(token);
        }
        expectedPeekToken(expected, code, token, ...args) {
            const result = this.tryPeekToken(expected, code, token, ...args);
            if (result == null) {
                return null;
            }
            return this.nextToken();
        }
        tryPeekToken(expected, code, errorToken, ...args) {
            const peekToken = this.peekToken();
            if (peekToken.type != expected) {
                if (errorToken == null) {
                    this.problems.push(problem_3.NewPlProblem(code, peekToken.info, ...args));
                }
                else {
                    this.problems.push(problem_3.NewPlProblemAt(code, errorToken.info, "after", ...args));
                }
                return null;
            }
            return peekToken;
        }
        tryPeekTokens(expects, code, errorToken, ...args) {
            const peekToken = this.peekToken();
            let found = false;
            for (const type of expects) {
                if (peekToken.type == type) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                if (errorToken == null) {
                    this.problems.push(problem_3.NewPlProblem(code, peekToken.info, ...args));
                }
                else {
                    this.problems.push(problem_3.NewPlProblemAt(code, errorToken.info, "after", ...args));
                }
                return null;
            }
            return peekToken;
        }
        peekMatch(types) {
            const peekToken = this.peekToken();
            for (const type of types) {
                if (peekToken.type == type) {
                    return true;
                }
            }
            return false;
        }
        clearLF() {
            while (true) {
                const token = this.peekToken();
                if (token.type == token_3.PlTokenType.LF) {
                    this.nextToken();
                }
                else {
                    break;
                }
            }
        }
        newProblem(token, code, ...args) {
            this.problems.push(problem_3.NewPlProblem(code, token.info, ...args));
            return null;
        }
        newProblemAt(token, code, here, ...args) {
            this.problems.push(problem_3.NewPlProblemAt(code, token.info, here, ...args));
            return null;
        }
        pStatement() {
            const leadingToken = this.peekToken();
            if (leadingToken == null) {
                return null;
            }
            let statement;
            switch (leadingToken.type) {
                case token_3.PlTokenType.LBRACE:
                    statement = this.pBlock();
                    break;
                case token_3.PlTokenType.FUNC:
                    statement = this.pFunction();
                    break;
                case token_3.PlTokenType.IMPL:
                    statement = this.pImpl();
                    break;
                case token_3.PlTokenType.IMPORT:
                    statement = this.pImport();
                    break;
                case token_3.PlTokenType.EXPORT:
                    statement = this.pExport();
                    break;
                case token_3.PlTokenType.RETURN:
                    statement = this.pReturn();
                    break;
                case token_3.PlTokenType.BREAK:
                    statement = this.pBreak();
                    break;
                case token_3.PlTokenType.CONTINUE:
                    statement = this.pContinue();
                    break;
                case token_3.PlTokenType.IF:
                    statement = this.pIf();
                    break;
                case token_3.PlTokenType.EACH:
                    statement = this.pEach();
                    break;
                case token_3.PlTokenType.LOOP:
                    statement = this.pLoop();
                    break;
                case token_3.PlTokenType.WHILE:
                    statement = this.pWhile();
                    break;
                case token_3.PlTokenType.FOR:
                    statement = this.pFor();
                    break;
                case token_3.PlTokenType.MATCH:
                    statement = this.pMatch();
                    break;
                case token_3.PlTokenType.TYPE:
                    statement = this.pType();
                    break;
                default:
                    statement = this.pExpression();
                    break;
            }
            if (statement == null) {
                return null;
            }
            const peekToken = this.peekToken();
            if (peekToken.type != token_3.PlTokenType.LF) {
                if (peekToken.type == token_3.PlTokenType.SEMICOLON) {
                    this.nextToken();
                }
                else if (peekToken.type != token_3.PlTokenType.EOF) {
                    this.newProblemAt(peekToken, "ET0001", "before");
                    return null;
                }
            }
            else {
                this.nextToken();
            }
            return statement;
        }
        pBlock() {
            const tokens = [this.nextToken()];
            let statements = [];
            while (true) {
                this.clearLF();
                const peekToken = this.peekToken();
                if (peekToken.type == token_3.PlTokenType.RBRACE) {
                    break;
                }
                if (peekToken.type == token_3.PlTokenType.EOF) {
                    this.newProblem(tokens[0], "CE0001");
                    return null;
                }
                const statement = this.pStatement();
                if (statement == null) {
                    return null;
                }
                statements.push(statement);
            }
            tokens.push(this.nextToken());
            return new ast_1.ASTBlock(tokens, statements);
        }
        pFunction() {
            let tokens = [this.nextToken()];
            const nameToken = this.tryPeekToken(token_3.PlTokenType.VARIABLE, "ET0013", null);
            if (nameToken == null) {
                return null;
            }
            const name = this.pVariable();
            stripSep(name);
            const nextToken = this.expectedPeekToken(token_3.PlTokenType.LPAREN, "ET0014", nameToken);
            if (nextToken == null) {
                return null;
            }
            const param = this.pParam(nextToken, "ET0016", "ET0015");
            if (param == null) {
                return null;
            }
            const lastParen = param.tokens[param.tokens.length - 1];
            if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0017", lastParen) == null) {
                return null;
            }
            const block = this.pBlock();
            if (block == null) {
                return null;
            }
            return new ast_1.ASTFunction(tokens, name, param.params, param.guards, block);
        }
        pImpl() {
            const tokens = [this.nextToken()];
            let name;
            const peekToken = this.peekToken();
            if (peekToken.type == token_3.PlTokenType.VARIABLE) {
                name = this.pVariable();
                stripSep(name);
            }
            else if (token_3.TOKEN_OPERATORS.includes(peekToken.type) || peekToken.type == token_3.PlTokenType.TYPE) {
                this.nextToken();
                const token = token_3.PlTokenToPlVariable(peekToken);
                name = new ast_1.ASTVariable([token], token.content);
            }
            else {
                this.newProblem(peekToken, "ET0027");
                return null;
            }
            const nextToken = this.expectedPeekToken(token_3.PlTokenType.LPAREN, "ET0028", name.getSpanToken());
            if (nextToken == null) {
                return null;
            }
            const param = this.pParam(nextToken, "ET0016", "ET0015");
            if (param == null) {
                return null;
            }
            const lastParen = param.tokens[param.tokens.length - 1];
            const forToken = this.expectedPeekToken(token_3.PlTokenType.FOR, "ET0029", lastParen);
            if (forToken == null) {
                return null;
            }
            if (this.peekToken().type == token_3.PlTokenType.EOF) {
                this.newProblemAt(forToken, "ET0043", "after");
                return null;
            }
            const type = this.pVariable();
            stripSep(type);
            if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0030", type.getSpanToken()) == null) {
                return null;
            }
            const block = this.pBlock();
            if (block == null) {
                return null;
            }
            return new ast_1.ASTImpl([...tokens, forToken], name, param.params, param.guards, type, block);
        }
        pType() {
            const tokens = [this.nextToken()];
            const nameToken = this.peekToken();
            if (token_3.NAME_BLACKLIST.includes(nameToken.type)) {
                return this.newProblem(nameToken, "ET0044");
            }
            const name = this.pVariable();
            stripSep(name);
            const peekToken = this.peekToken();
            let members;
            if (peekToken.type == token_3.PlTokenType.LPAREN) {
                this.nextToken();
                const param = this.pParam(peekToken, "ET0046", "ET0047", "CE0009");
                members = param.params;
            }
            else {
                members = [];
            }
            return new ast_1.ASTType(tokens, name, members);
        }
        pImport() {
            const tokens = [this.nextToken()];
            const path = this.pPath();
            if (path == null) {
                return null;
            }
            tokens.push(...path[1]);
            let alias = null;
            let select = null;
            const peekToken = this.peekToken();
            switch (peekToken.type) {
                case token_3.PlTokenType.AS: {
                    tokens.push(this.nextToken());
                    if (this.tryPeekToken(token_3.PlTokenType.VARIABLE, "ET0038", null) == null) {
                        return null;
                    }
                    alias = this.pVariable();
                    stripSep(alias);
                    break;
                }
                case token_3.PlTokenType.SELECT: {
                    tokens.push(this.nextToken());
                    const peek = this.peekToken();
                    if (peek.type == token_3.PlTokenType.MUL) {
                        tokens.push(this.nextToken());
                        select = [];
                        break;
                    }
                    if (peek.type == token_3.PlTokenType.LF) {
                        this.newProblemAt(peekToken, "ET0041", "after");
                        return null;
                    }
                    let param = this.pParam(peekToken, "ET0039", "ET0040", "CE0006", token_3.PlTokenType.LF);
                    if (param == null) {
                        return null;
                    }
                    select = param.params;
                    break;
                }
            }
            return new ast_1.ASTImport(tokens, path[0], alias, select);
        }
        pExport() {
            const token = this.nextToken();
            if (this.peekMatch([token_3.PlTokenType.LF, token_3.PlTokenType.EOF])) {
                this.newProblem(token, "ET0020");
                return null;
            }
            const value = this.pExpression();
            if (value == null) {
                return null;
            }
            return new ast_1.ASTExport([token], value);
        }
        pReturn() {
            const token = [this.nextToken()];
            if (this.peekToken().type == token_3.PlTokenType.LF) {
                return new ast_1.ASTReturn(token);
            }
            const value = this.pExpression();
            if (value == null) {
                return null;
            }
            return new ast_1.ASTReturn(token, value);
        }
        pBreak() {
            return new ast_1.ASTBreak([this.nextToken()]);
        }
        pContinue() {
            return new ast_1.ASTContinue([this.nextToken()]);
        }
        pIf() {
            let tokens = [this.nextToken()];
            let conditions = [];
            let blocks = [];
            let condition = this.pExpression();
            if (condition == null) {
                return null;
            }
            conditions.push(condition);
            if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0021", condition.getSpanToken()) == null) {
                return null;
            }
            let block = this.pBlock();
            if (block == null) {
                return null;
            }
            blocks.push(block);
            while (true) {
                const token = this.peekToken();
                if (token.type != token_3.PlTokenType.ELIF) {
                    break;
                }
                tokens.push(token);
                this.nextToken();
                condition = this.pExpression();
                if (condition == null) {
                    return null;
                }
                conditions.push(condition);
                if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0022", condition.getSpanToken()) == null) {
                    return null;
                }
                block = this.pBlock();
                if (block == null) {
                    return null;
                }
                blocks.push(block);
            }
            let other = null;
            const token = this.peekToken();
            if (token.type == token_3.PlTokenType.ELSE) {
                tokens.push(token);
                this.nextToken();
                if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0023", token) == null) {
                    return null;
                }
                other = this.pBlock();
                if (other == null) {
                    return null;
                }
            }
            return new ast_1.ASTIf(tokens, conditions, blocks, other);
        }
        pEach() {
            const tokens = [this.nextToken()];
            if (this.tryPeekToken(token_3.PlTokenType.VARIABLE, "ET0024", null) == null) {
                return null;
            }
            const value = this.pVariable();
            stripSep(value);
            let key = null;
            if (this.peekToken().type == token_3.PlTokenType.COMMA) {
                this.nextToken();
                if (this.tryPeekToken(token_3.PlTokenType.VARIABLE, "ET0024", null) == null) {
                    return null;
                }
                key = this.pVariable();
                stripSep(key);
            }
            if (this.tryPeekToken(token_3.PlTokenType.OF, "ET0025", key == null ? value.getSpanToken() : key.getSpanToken()) == null) {
                return null;
            }
            tokens.push(this.nextToken());
            const array = this.pExpression();
            if (array == null) {
                return null;
            }
            if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0025", array.getSpanToken()) == null) {
                return null;
            }
            const block = this.pBlock();
            if (block == null) {
                return null;
            }
            return new ast_1.ASTEach(tokens, value, array, block, key);
        }
        pLoop() {
            const tokens = [this.nextToken()];
            const peekToken = this.peekToken();
            let expression = null;
            if (peekToken.type != token_3.PlTokenType.LBRACE) {
                expression = this.pExpression();
            }
            const eToken = expression == null ? tokens[0] : expression.getSpanToken();
            if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0018", eToken) == null) {
                return null;
            }
            const block = this.pBlock();
            if (block == null) {
                return null;
            }
            return new ast_1.ASTLoop(tokens, block, expression);
        }
        pWhile() {
            const tokens = [this.nextToken()];
            const condition = this.pExpression();
            if (condition == null) {
                return null;
            }
            if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0019", condition.getSpanToken()) == null) {
                return null;
            }
            const block = this.pBlock();
            if (block == null) {
                return null;
            }
            return new ast_1.ASTWhile(tokens, condition, block);
        }
        pFor() {
            let tokens = [this.nextToken()];
            let pre = null;
            let condition = null;
            let post = null;
            if (this.peekToken().type == token_3.PlTokenType.SEMICOLON) {
                this.nextToken();
            }
            else {
                pre = this.pExpression();
                if (pre == null) {
                    return null;
                }
                const semi = this.expectedPeekToken(token_3.PlTokenType.SEMICOLON, "ET0031", pre.getSpanToken());
                if (semi == null) {
                    return null;
                }
            }
            if (this.peekToken().type == token_3.PlTokenType.SEMICOLON) {
                this.nextToken();
            }
            else {
                condition = this.pExpression();
                if (condition == null) {
                    return null;
                }
                const semi = this.expectedPeekToken(token_3.PlTokenType.SEMICOLON, "ET0031", condition.getSpanToken());
                if (semi == null) {
                    return null;
                }
            }
            if (this.peekToken().type != token_3.PlTokenType.LBRACE) {
                post = this.pExpression();
                if (post == null) {
                    return null;
                }
                if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0032", post.getSpanToken()) == null) {
                    return null;
                }
            }
            let block = this.pBlock();
            if (block == null) {
                return null;
            }
            return new ast_1.ASTFor(tokens, block, pre, condition, post);
        }
        pMatch() {
            let tokens = [this.nextToken()];
            let value = null;
            let expressions = [];
            let blocks = [];
            let other = null;
            if (this.peekToken().type != token_3.PlTokenType.LBRACE) {
                value = this.pExpression();
                if (value == null) {
                    return null;
                }
            }
            const lbrace = this.expectedPeekToken(token_3.PlTokenType.LBRACE, "ET0033", value == null ? tokens[0] : value.getSpanToken());
            if (lbrace == null) {
                return;
            }
            while (true) {
                this.clearLF();
                let exitWhile = false;
                const nextToken = this.peekToken();
                switch (nextToken.type) {
                    case token_3.PlTokenType.CASE: {
                        tokens.push(this.nextToken());
                        const args = this.pArgs(nextToken, "ET0034", "ET0035", token_3.PlTokenType.LBRACE);
                        if (args == null) {
                            return null;
                        }
                        if (args[0].length == 0) {
                            this.newProblemAt(nextToken, "LP0003", "after");
                            return null;
                        }
                        const block = this.pBlock();
                        if (block == null) {
                            return null;
                        }
                        expressions.push(args[0]);
                        blocks.push(block);
                        break;
                    }
                    case token_3.PlTokenType.DEFAULT: {
                        if (other != null) {
                            this.newProblem(nextToken, "LP0001");
                            return null;
                        }
                        tokens.push(this.nextToken());
                        if (this.tryPeekToken(token_3.PlTokenType.LBRACE, "ET0035", nextToken) == null) {
                            return null;
                        }
                        const block = this.pBlock();
                        if (block == null) {
                            return null;
                        }
                        other = block;
                        break;
                    }
                    case token_3.PlTokenType.RBRACE: {
                        this.nextToken();
                        exitWhile = true;
                        break;
                    }
                    default: {
                        if (nextToken.type == token_3.PlTokenType.LF || nextToken.type == token_3.PlTokenType.EOF) {
                            this.newProblem(lbrace, "CE0007");
                        }
                        else {
                            this.newProblem(nextToken, "ET0042");
                        }
                        return null;
                    }
                }
                if (exitWhile) {
                    break;
                }
            }
            return new ast_1.ASTMatch(tokens, value, expressions, blocks, other);
        }
        pExpression() {
            return this.pAssign();
        }
        pAssign() {
            const left = this.pLogical();
            if (left == null)
                return null;
            const peekToken = this.peekToken();
            if (peekToken.type == token_3.PlTokenType.ASGN) {
                let pre;
                let variable;
                if (left instanceof ast_1.ASTVariable) {
                    pre = null;
                    variable = left;
                }
                else if (left instanceof ast_1.ASTDot) {
                    let right = left;
                    while (right.right instanceof ast_1.ASTDot) {
                        right = right.right;
                    }
                    pre = left.left;
                    variable = right.right;
                }
                else {
                    this.newProblem(left.getSpanToken(), "ET0002");
                    return null;
                }
                this.nextToken();
                const value = this.pExpression();
                if (value == null) {
                    return null;
                }
                if (variable.content.startsWith(exports.CREATE_MAGIC)) {
                    variable.content = variable.content.slice(1);
                    return new ast_1.ASTCreate([peekToken], pre, variable, value);
                }
                return new ast_1.ASTAssign([peekToken], pre, variable, value);
            }
            return left;
        }
        pLogical() {
            let left = this.pCompare();
            if (left == null) {
                return null;
            }
            while (this.peekMatch([token_3.PlTokenType.AND, token_3.PlTokenType.OR])) {
                const token = this.nextToken();
                const right = this.pCompare();
                if (right == null) {
                    return null;
                }
                left = new ast_1.ASTBinary([token], left, right, token);
            }
            return left;
        }
        pCompare() {
            let left = this.pPlus();
            if (left == null) {
                return null;
            }
            while (this.peekMatch([token_3.PlTokenType.GT, token_3.PlTokenType.GTE, token_3.PlTokenType.LT, token_3.PlTokenType.LTE, token_3.PlTokenType.EQ, token_3.PlTokenType.NEQ])) {
                const token = this.nextToken();
                const right = this.pPlus();
                if (right == null) {
                    return null;
                }
                left = new ast_1.ASTBinary([token], left, right, token);
            }
            return left;
        }
        pPlus() {
            let left = this.pMult();
            if (left == null) {
                return null;
            }
            while (this.peekMatch([token_3.PlTokenType.ADD, token_3.PlTokenType.SUB])) {
                const token = this.nextToken();
                const right = this.pMult();
                if (right == null) {
                    return null;
                }
                left = new ast_1.ASTBinary([token], left, right, token);
            }
            return left;
        }
        pMult() {
            let left = this.pPrefix();
            if (left == null) {
                return null;
            }
            while (this.peekMatch([token_3.PlTokenType.MUL, token_3.PlTokenType.DIV])) {
                const token = this.nextToken();
                const right = this.pPrefix();
                if (right == null) {
                    return null;
                }
                left = new ast_1.ASTBinary([token], left, right, token);
            }
            return left;
        }
        pPrefix() {
            if (this.peekMatch([token_3.PlTokenType.NOT, token_3.PlTokenType.ADD, token_3.PlTokenType.SUB])) {
                const token = this.nextToken();
                const value = this.pPrefix();
                return new ast_1.ASTUnary([token], token, value);
            }
            return this.pPostfix();
        }
        pPostfix() {
            let left = this.pCall();
            if (left == null) {
                return null;
            }
            while (this.peekMatch([token_3.PlTokenType.INC, token_3.PlTokenType.DEC])) {
                if (!(left instanceof ast_1.ASTVariable) && !(left instanceof ast_1.ASTUnary)) {
                    this.newProblem(left.getSpanToken(), "ET0005");
                    return null;
                }
                const token = this.nextToken();
                left = new ast_1.ASTUnary([token], token, left);
            }
            return left;
        }
        pCall() {
            let left = this.pPrimary();
            if (left == null) {
                return null;
            }
            while (true) {
                const peekToken = this.peekToken();
                if (peekToken.type == token_3.PlTokenType.LPAREN) {
                    this.nextToken();
                    const args = this.pArgs(peekToken, "ET0008");
                    if (args == null) {
                        return null;
                    }
                    left = new ast_1.ASTCall([peekToken], left, args[0]);
                    continue;
                }
                if (peekToken.type == token_3.PlTokenType.DOT) {
                    this.nextToken();
                    const peek = this.peekToken();
                    if (token_3.NAME_BLACKLIST.includes(peek.type)) {
                        return this.newProblem(peek, "ET0003");
                    }
                    const right = this.pVariable();
                    stripSep(right);
                    left = new ast_1.ASTDot([peekToken], left, right);
                    continue;
                }
                const args = this.pArgsNoParen();
                if (args == null) {
                    return null;
                }
                if (args[0].length > 0) {
                    left = new ast_1.ASTCall([peekToken], left, args[0]);
                }
                break;
            }
            return left;
        }
        pPrimary() {
            const token = this.peekToken();
            switch (token.type) {
                case token_3.PlTokenType.LPAREN:
                    return this.pGroup();
                case token_3.PlTokenType.VARIABLE: {
                    this.nextToken();
                    let type = "";
                    if (token.content == "list") {
                        if (this.peekToken().type == token_3.PlTokenType.LPAREN) {
                            type = "l";
                        }
                    }
                    else if (token.content == "dict") {
                        if (this.peekToken().type == token_3.PlTokenType.LPAREN) {
                            type = "d";
                        }
                    }
                    this.pushToken(token);
                    switch (type) {
                        case 'l':
                            return this.pList();
                        case 'd':
                            return this.pDict();
                        default:
                            return this.pVariable();
                    }
                }
                case token_3.PlTokenType.NUMBER:
                    return this.pNumber();
                case token_3.PlTokenType.STR:
                    return this.pString();
                case token_3.PlTokenType.BOOLEAN:
                    return this.pBoolean();
                case token_3.PlTokenType.NULL:
                    return this.pNull();
                case token_3.PlTokenType.FUNC:
                    return this.pClosure();
            }
            this.newProblem(token, "ET0004", token.content);
            return null;
        }
        pClosure() {
            const token = this.nextToken();
            if (this.expectedPeekToken(token_3.PlTokenType.LPAREN, "ET0014", token) == null) {
                return null;
            }
            const param = this.pParam(token, "ET0016", "ET0015");
            if (param == null) {
                return null;
            }
            let block;
            if (this.peekToken().type != token_3.PlTokenType.LBRACE) {
                const expression = this.pExpression();
                if (expression == null) {
                    return null;
                }
                block = new ast_1.ASTBlock([], [
                    new ast_1.ASTReturn([], expression)
                ]);
            }
            else {
                block = this.pBlock();
                if (block == null) {
                    return null;
                }
            }
            return new ast_1.ASTClosure([token], param.params, param.guards, block);
        }
        pVariable() {
            const v = this.nextToken();
            const token = token_3.PlTokenToPlVariable(v);
            if (token == null) {
                return this.newProblem(v, "ET0048");
            }
            return new ast_1.ASTVariable([token], token.content);
        }
        pNumber() {
            const token = this.nextToken();
            return new ast_1.ASTNumber([token], token.content);
        }
        pBoolean() {
            const token = this.nextToken();
            return new ast_1.ASTBoolean([token], token.content == 'true' ? '1' : '0');
        }
        pNull() {
            const token = this.nextToken();
            return new ast_1.ASTNull([token]);
        }
        pString() {
            const token = this.nextToken();
            return new ast_1.ASTString([token], token.content);
        }
        pList() {
            let tokens = [this.nextToken()];
            let peek = this.expectedPeekToken(token_3.PlTokenType.LPAREN, "ET0007", tokens[0]);
            if (peek == null) {
                return null;
            }
            tokens.push(peek);
            const result = this.pArgs(peek, "ET0006", "CE0004");
            if (result == null) {
                return null;
            }
            return new ast_1.ASTList(tokens, result[0]);
        }
        pDict() {
            let tokens = [this.nextToken()];
            let peek = this.expectedPeekToken(token_3.PlTokenType.LPAREN, "ET0010", tokens[0]);
            if (peek == null) {
                return null;
            }
            tokens.push(peek);
            let keys = [];
            let values = [];
            while (true) {
                this.clearLF();
                const token = this.peekToken();
                if (token.type == token_3.PlTokenType.RPAREN) {
                    break;
                }
                if (token.type == token_3.PlTokenType.EOF) {
                    this.newProblem(peek, "CE0003");
                    return null;
                }
                const result = this.pPair();
                if (result == null) {
                    return null;
                }
                this.clearLF();
                const peekToken = this.peekToken();
                if (peekToken.type == token_3.PlTokenType.COMMA) {
                    this.nextToken();
                }
                else if (peekToken.type != token_3.PlTokenType.RPAREN) {
                    this.newProblem(result[2].getSpanToken(), peekToken.type == token_3.PlTokenType.EOF ? "CE0003" : "ET0012");
                    return null;
                }
                keys.push(result[0]);
                values.push(result[2]);
            }
            this.nextToken();
            return new ast_1.ASTDict(tokens, keys, values);
        }
        pGroup() {
            const left = this.nextToken();
            const expression = this.pExpression();
            if (expression == null) {
                return null;
            }
            if (this.expectedPeekToken(token_3.PlTokenType.RPAREN, "CE0002", left) == null) {
                return null;
            }
            return expression;
        }
        pPair() {
            const token = this.peekToken();
            if (token_3.NAME_BLACKLIST.includes(token.type)) {
                this.newProblem(token, "ET0009");
                return null;
            }
            const key = this.pVariable();
            if (key == null) {
                return null;
            }
            stripSep(key);
            const colon = this.expectedPeekToken(token_3.PlTokenType.COLON, "ET0011", token);
            if (colon == null) {
                return null;
            }
            const value = this.pExpression();
            if (value == null) {
                return null;
            }
            return [key, colon, value];
        }
        pArgs(startToken, commaCode, endTokenCode = "CE0005", endToken = token_3.PlTokenType.RPAREN) {
            let expressions = [];
            let tokens = [];
            while (true) {
                this.clearLF();
                const token = this.peekToken();
                if (token.type == endToken) {
                    break;
                }
                if (token.type == token_3.PlTokenType.EOF) {
                    this.newProblem(startToken, endTokenCode);
                    return null;
                }
                const expression = this.pExpression();
                if (expression == null) {
                    return null;
                }
                this.clearLF();
                const peekToken = this.peekToken();
                if (peekToken.type == token_3.PlTokenType.COMMA) {
                    this.nextToken();
                }
                else if (peekToken.type == token_3.PlTokenType.EOF) {
                    this.newProblem(startToken, endTokenCode);
                    return null;
                }
                else if (peekToken.type != endToken) {
                    this.newProblemAt(expression.getSpanToken(), commaCode, "after");
                    return null;
                }
                tokens.push(peekToken);
                expressions.push(expression);
            }
            tokens.push(this.nextToken());
            return [expressions, tokens];
        }
        pArgsNoParen() {
            let expressions = [];
            let tokens = [];
            while (true) {
                if (!this.peekMatch([token_3.PlTokenType.VARIABLE, token_3.PlTokenType.STR, token_3.PlTokenType.BOOLEAN, token_3.PlTokenType.NUMBER, token_3.PlTokenType.TYPE, token_3.PlTokenType.FUNC, token_3.PlTokenType.NOT, token_3.PlTokenType.NULL])) {
                    break;
                }
                const expression = this.pExpression();
                if (expression == null) {
                    return null;
                }
                expressions.push(expression);
                const peekToken = this.peekToken();
                if (peekToken.type == token_3.PlTokenType.COMMA) {
                    this.nextToken();
                    tokens.push(peekToken);
                }
                else {
                    break;
                }
            }
            return [expressions, tokens];
        }
        pParam(startToken, commaCode, variableError, endTokenCode = "CE0006", endToken = token_3.PlTokenType.RPAREN, keep = false) {
            let variables = [];
            let tokens = [];
            let guards = [];
            while (true) {
                if (!keep) {
                    this.clearLF();
                }
                const token = this.peekToken();
                if (token.type == endToken) {
                    break;
                }
                const variableToken = this.peekToken();
                if (variableToken.type == token_3.PlTokenType.EOF) {
                    this.newProblem(variableToken, variableError);
                    return null;
                }
                const variable = this.pVariable();
                stripSep(variable);
                if (!keep) {
                    this.clearLF();
                }
                let peekToken = this.peekToken();
                if (peekToken.type == token_3.PlTokenType.COLON) {
                    this.nextToken();
                    const guard = this.pVariable();
                    if (guard == null) {
                        return null;
                    }
                    guards.push(guard);
                    peekToken = this.peekToken();
                }
                else {
                    guards.push(null);
                }
                if (peekToken.type == token_3.PlTokenType.COMMA) {
                    this.nextToken();
                }
                else if (peekToken.type == token_3.PlTokenType.EOF) {
                    this.newProblem(startToken, endTokenCode);
                    return null;
                }
                else if (peekToken.type != endToken) {
                    this.newProblem(peekToken, commaCode);
                    return null;
                }
                tokens.push(peekToken);
                variables.push(variable);
            }
            if (!keep) {
                tokens.push(this.nextToken());
            }
            return {
                params: variables,
                guards,
                tokens,
            };
        }
        pPath() {
            let tokens = [];
            let path = [];
            while (true) {
                let peekToken = this.peekToken();
                switch (peekToken.type) {
                    case token_3.PlTokenType.VARIABLE: {
                        const variable = this.pVariable();
                        if (variable == null) {
                            return null;
                        }
                        path.push(variable);
                        break;
                    }
                    case token_3.PlTokenType.DOT: {
                        this.nextToken();
                        let spanToken = peekToken;
                        const nextToken = this.peekToken();
                        if (nextToken.type == token_3.PlTokenType.DOT) {
                            this.nextToken();
                            spanToken = ast_1.CreateSpanToken(peekToken, nextToken);
                        }
                        path.push(new ast_1.ASTVariable([spanToken], spanToken.content));
                        break;
                    }
                    default: {
                        this.newProblem(peekToken, "ET0036");
                        return null;
                    }
                }
                let breakSwitch = false;
                peekToken = this.peekToken();
                switch (peekToken.type) {
                    case token_3.PlTokenType.DIV: {
                        tokens.push(this.nextToken());
                        break;
                    }
                    case token_3.PlTokenType.AS:
                    case token_3.PlTokenType.SELECT:
                    case token_3.PlTokenType.LF:
                    case token_3.PlTokenType.EOF: {
                        breakSwitch = true;
                        break;
                    }
                    default: {
                        this.newProblemAt(path[path.length - 1].getSpanToken(), "ET0037", "after");
                        return null;
                    }
                }
                if (breakSwitch) {
                    break;
                }
            }
            return [path, tokens];
        }
    }
    exports.PlAstParser = PlAstParser;
});
define("extension/tstypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tsEnumKeys = void 0;
    function tsEnumKeys(e) {
        const out = [];
        for (const mem in e) {
            if (parseInt(mem, 10) >= 0) {
                out.push(e[mem]);
            }
        }
        return out;
    }
    exports.tsEnumKeys = tsEnumKeys;
});
define("vm/emitter/bytecode", ["require", "exports", "extension/tstypes", "extension/text"], function (require, exports, tstypes_1, text_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BytecodeToString = exports.BytecodeTypeToString = exports.NewBytecode = exports.PlBytecodeType = void 0;
    var PlBytecodeType;
    (function (PlBytecodeType) {
        PlBytecodeType[PlBytecodeType["DEFNUM"] = 0] = "DEFNUM";
        PlBytecodeType[PlBytecodeType["DEFVAR"] = 1] = "DEFVAR";
        PlBytecodeType[PlBytecodeType["DEFFUN"] = 2] = "DEFFUN";
        PlBytecodeType[PlBytecodeType["DEFNUL"] = 3] = "DEFNUL";
        PlBytecodeType[PlBytecodeType["DEFBOL"] = 4] = "DEFBOL";
        PlBytecodeType[PlBytecodeType["DEFSTR"] = 5] = "DEFSTR";
        PlBytecodeType[PlBytecodeType["DEFTYP"] = 6] = "DEFTYP";
        PlBytecodeType[PlBytecodeType["DEFETY"] = 7] = "DEFETY";
        PlBytecodeType[PlBytecodeType["DEFLST"] = 8] = "DEFLST";
        PlBytecodeType[PlBytecodeType["DEFDIC"] = 9] = "DEFDIC";
        PlBytecodeType[PlBytecodeType["JMPIFT"] = 10] = "JMPIFT";
        PlBytecodeType[PlBytecodeType["JMPIFF"] = 11] = "JMPIFF";
        PlBytecodeType[PlBytecodeType["JMPICT"] = 12] = "JMPICT";
        PlBytecodeType[PlBytecodeType["JMPICF"] = 13] = "JMPICF";
        PlBytecodeType[PlBytecodeType["JMPREL"] = 14] = "JMPREL";
        PlBytecodeType[PlBytecodeType["DOFDCL"] = 15] = "DOFDCL";
        PlBytecodeType[PlBytecodeType["DOCALL"] = 16] = "DOCALL";
        PlBytecodeType[PlBytecodeType["DORETN"] = 17] = "DORETN";
        PlBytecodeType[PlBytecodeType["DOASGN"] = 18] = "DOASGN";
        PlBytecodeType[PlBytecodeType["DOCRET"] = 19] = "DOCRET";
        PlBytecodeType[PlBytecodeType["DOFIND"] = 20] = "DOFIND";
        PlBytecodeType[PlBytecodeType["DOOINC"] = 21] = "DOOINC";
        PlBytecodeType[PlBytecodeType["DOODEC"] = 22] = "DOODEC";
        PlBytecodeType[PlBytecodeType["DONEGT"] = 23] = "DONEGT";
        PlBytecodeType[PlBytecodeType["DOLNOT"] = 24] = "DOLNOT";
        PlBytecodeType[PlBytecodeType["DOBRAK"] = 25] = "DOBRAK";
        PlBytecodeType[PlBytecodeType["DOCONT"] = 26] = "DOCONT";
        PlBytecodeType[PlBytecodeType["STKPOP"] = 27] = "STKPOP";
        PlBytecodeType[PlBytecodeType["STKENT"] = 28] = "STKENT";
        PlBytecodeType[PlBytecodeType["STKEXT"] = 29] = "STKEXT";
    })(PlBytecodeType = exports.PlBytecodeType || (exports.PlBytecodeType = {}));
    const allEnumKeys = tstypes_1.tsEnumKeys(PlBytecodeType);
    function NewBytecode(type, value = null) {
        return {
            type,
            value
        };
    }
    exports.NewBytecode = NewBytecode;
    function BytecodeTypeToString(bct) {
        return allEnumKeys[bct];
    }
    exports.BytecodeTypeToString = BytecodeTypeToString;
    function BytecodeToString(bc) {
        return `${allEnumKeys[bc.type]}` + (bc.value == null ? '' : ` |${text_5.dddString(text_5.escapeString(bc.value), 7)}|`);
    }
    exports.BytecodeToString = BytecodeToString;
});
define("vm/emitter/debug", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlDebugProgramWithin = exports.PlDebugWithin = exports.PlDebugToString = exports.NewPlDebugStretch = exports.NewPlDebugSingle = exports.NewPlDebug = void 0;
    function NewPlDebug(node, endLine, length) {
        const name = node.attribute == null ? node.constructor.name : node.attribute;
        return {
            span: node.getSpanToken(),
            name,
            endLine,
            length
        };
    }
    exports.NewPlDebug = NewPlDebug;
    function NewPlDebugSingle(node) {
        return NewPlDebug(node, 0, 1);
    }
    exports.NewPlDebugSingle = NewPlDebugSingle;
    function NewPlDebugStretch(node, length) {
        return NewPlDebug(node, 0, length);
    }
    exports.NewPlDebugStretch = NewPlDebugStretch;
    function PlDebugToString(debug) {
        return `${debug.name}@${debug.span.info.row}:${debug.span.info.col}`;
    }
    exports.PlDebugToString = PlDebugToString;
    function PlDebugWithin(debug, start, end) {
        return debug.endLine <= end && (debug.endLine - debug.length) >= start;
    }
    exports.PlDebugWithin = PlDebugWithin;
    function PlDebugProgramWithin(debug, start, end) {
        const debugs = [];
        for (const info of debug) {
            if (PlDebugWithin(info, start, end)) {
                debugs.push(info);
            }
        }
        return debugs;
    }
    exports.PlDebugProgramWithin = PlDebugProgramWithin;
});
define("vm/emitter/index", ["require", "exports", "vm/emitter/bytecode", "compiler/parsing/ast", "vm/emitter/debug", "compiler/lexing/token", "inout/index"], function (require, exports, bytecode_1, ast_2, debug_1, token_4, inout_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EmitStatement = exports.EmitProgram = exports.MATCH_VALUE = exports.EACH_ITER = exports.LOOP_INDEX = exports.METHOD_SEP = void 0;
    exports.METHOD_SEP = '@';
    exports.LOOP_INDEX = 'i@';
    exports.EACH_ITER = 'iter@';
    exports.MATCH_VALUE = 'value@';
    function EmitProgram(ast, addReturn = false) {
        let programBuilder = new ProgramBuilder();
        for (const statement of ast) {
            programBuilder.addPWD(EmitStatement(statement));
        }
        const program = programBuilder.toProgram();
        if (addReturn && (program.program.length == 0 || program.program[program.program.length - 1].type != bytecode_1.PlBytecodeType.DORETN)) {
            program.program.push(makeNull(), bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DORETN));
        }
        return program;
    }
    exports.EmitProgram = EmitProgram;
    function EmitStatement(statement) {
        return (new ProgramBuilder())
            .addPWD(traverseAST(statement))
            .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKPOP))
            .toProgram();
    }
    exports.EmitStatement = EmitStatement;
    class ProgramBuilder {
        constructor() {
            this.emitDebug = inout_2.default.options['mode'] == 'debug';
            this.code = [];
            this.debugs = [];
            this.line = 0;
        }
        addPWDNoDebug(program) {
            this.code.push(...program.program);
            this.line += program.program.length;
            return this;
        }
        addPWD(program, debug) {
            this.code.push(...program.program);
            if (this.emitDebug) {
                program.debug.forEach(d => {
                    d.endLine += this.line;
                });
                this.debugs.push(...program.debug);
            }
            this.line += program.program.length;
            if (this.emitDebug && debug) {
                debug.endLine += this.line;
                this.debugs.push(debug);
            }
            return this;
        }
        addPWDStretch(program, node, length = null) {
            return this.addPWD(program, debug_1.NewPlDebugStretch(node, length == null ? this.code.length + program.program.length : length));
        }
        addBytecode(bc, debug) {
            this.code.push(bc);
            this.line += 1;
            if (this.emitDebug && debug) {
                debug.endLine += this.line;
                this.debugs.push(debug);
            }
            return this;
        }
        addBytecodeSingle(bc, node) {
            return this.addBytecode(bc, debug_1.NewPlDebugSingle(node));
        }
        addBytecodeStretch(bc, node) {
            return this.addBytecode(bc, debug_1.NewPlDebugStretch(node, this.code.length + 1));
        }
        addEmpty() {
            return this.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFETY));
        }
        addStretch(node, length = null) {
            if (!this.emitDebug)
                return this;
            let debug = debug_1.NewPlDebugStretch(node, length == null ? this.code.length : length);
            debug.endLine += this.line;
            this.debugs.push(debug);
            return this;
        }
        popDebug() {
            if (!this.emitDebug)
                return this;
            this.debugs.pop();
            return this;
        }
        toProgram() {
            return { program: this.code, debug: this.debugs };
        }
    }
    function replaceBC(block, extra) {
        let surround = 0;
        const length = block.program.length;
        for (let i = 0; i < length; ++i) {
            const byte = block.program[i];
            switch (byte.type) {
                case bytecode_1.PlBytecodeType.DOBRAK: {
                    if (byte.value == null)
                        block.program[i] = bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOBRAK, `${(length + extra - i)},${surround}`);
                    break;
                }
                case bytecode_1.PlBytecodeType.DOCONT: {
                    if (byte.value == null)
                        block.program[i] = bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOCONT, `${(length + extra - i - 1)},${surround}`);
                    break;
                }
                case bytecode_1.PlBytecodeType.STKENT:
                    surround += 1;
                    break;
                case bytecode_1.PlBytecodeType.STKEXT:
                    surround -= 1;
                    break;
            }
        }
    }
    function traverseAST(node) {
        let programBuilder = new ProgramBuilder();
        if (node instanceof ast_2.ASTNumber) {
            return programBuilder.addBytecode(makeNumber(node)).toProgram();
        }
        else if (node instanceof ast_2.ASTVariable) {
            return programBuilder.addBytecodeSingle(makeEvalVariable(node), node).toProgram();
        }
        else if (node instanceof ast_2.ASTNull) {
            return programBuilder.addBytecode(makeNull(node)).toProgram();
        }
        else if (node instanceof ast_2.ASTBoolean) {
            return programBuilder.addBytecode(makeBool(node)).toProgram();
        }
        else if (node instanceof ast_2.ASTString) {
            return programBuilder.addBytecode(makeString(node)).toProgram();
        }
        else if (node instanceof ast_2.ASTBreak) {
            return programBuilder.addBytecodeSingle(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOBRAK), node).toProgram();
        }
        else if (node instanceof ast_2.ASTContinue) {
            return programBuilder.addBytecodeSingle(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOCONT), node).toProgram();
        }
        else if (node instanceof ast_2.ASTList) {
            for (const item of node.values.reverse()) {
                programBuilder.addPWD(traverseAST(item));
            }
            return programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUM, "" + node.values.length))
                .addBytecodeStretch(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFLST), node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTDict) {
            for (let i = node.keys.length - 1; i >= 0; --i) {
                programBuilder.addPWD(traverseAST(node.values[i]));
                const key = node.keys[i];
                let value;
                if (key instanceof ast_2.ASTVariable) {
                    value = key.content;
                }
                else if (key instanceof ast_2.ASTString) {
                    value = key.content;
                }
                else if (key instanceof ast_2.ASTNumber) {
                    value = key.value;
                }
                programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFSTR, value));
            }
            return programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUM, "" + node.keys.length))
                .addBytecodeStretch(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFDIC), node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTType) {
            const length = node.members.length;
            for (let i = length - 1; i >= 0; i--) {
                programBuilder.addBytecode(makeVariable(node.members[i]));
            }
            return programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUM, '' + length))
                .addBytecode(makeVariable(node.name))
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFTYP))
                .addEmpty()
                .addBytecode(makeVariable(node.name))
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOCRET))
                .toProgram();
        }
        else if (node instanceof ast_2.ASTCreate) {
            programBuilder.addPWD(traverseAST(node.value));
            if (node.pre) {
                programBuilder.addPWD(traverseAST(node.pre));
            }
            else {
                programBuilder.addEmpty();
            }
            programBuilder.addBytecode(makeVariable(node.variable));
            programBuilder.addBytecodeStretch(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOCRET), node);
            return programBuilder.toProgram();
        }
        else if (node instanceof ast_2.ASTAssign) {
            programBuilder.addPWD(traverseAST(node.value));
            if (node.pre) {
                programBuilder.addPWD(traverseAST(node.pre));
            }
            else {
                programBuilder.addEmpty();
            }
            programBuilder.addBytecode(makeVariable(node.variable));
            programBuilder.addBytecodeStretch(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOASGN), node);
            return programBuilder.toProgram();
        }
        else if (node instanceof ast_2.ASTDot) {
            return programBuilder
                .addPWD(traverseAST(node.left))
                .addBytecode(makeVariable(node.right))
                .addBytecodeStretch(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOFIND), node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTBinary) {
            if (node.operator.type == token_4.PlTokenType.AND) {
                let right = traverseAST(node.right);
                const left = traverseAST(node.left);
                node.left.attribute = ast_2.ASTAttributes.ASTCondition;
                return programBuilder
                    .addPWD(left)
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPIFF, '' + (right.program.length + 1)))
                    .addStretch(node.left, left.program.length + 1)
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKPOP))
                    .addPWDStretch(right, node)
                    .toProgram();
            }
            else if (node.operator.type == token_4.PlTokenType.OR) {
                let right = traverseAST(node.right);
                const left = traverseAST(node.left);
                node.left.attribute = ast_2.ASTAttributes.ASTCondition;
                return programBuilder
                    .addPWD(left)
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPIFT, '' + (right.program.length + 1)))
                    .addStretch(node.left, left.program.length + 1)
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKPOP))
                    .addPWDStretch(right, node)
                    .toProgram();
            }
            return programBuilder
                .addPWD(traverseAST(node.right))
                .addPWD(traverseAST(node.left))
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUM, '2'))
                .addBytecodeStretch(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOFDCL, node.operator.content), node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTUnary) {
            programBuilder.addPWD(traverseAST(node.value));
            let bc;
            switch (node.operator.type) {
                case token_4.PlTokenType.INC: {
                    bc = bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOOINC);
                    break;
                }
                case token_4.PlTokenType.DEC: {
                    bc = bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOODEC);
                    break;
                }
                case token_4.PlTokenType.SUB: {
                    bc = bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DONEGT);
                    break;
                }
                case token_4.PlTokenType.NOT: {
                    bc = bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOLNOT);
                    break;
                }
            }
            if (bc) {
                programBuilder
                    .addBytecodeStretch(bc, node);
            }
            return programBuilder.toProgram();
        }
        else if (node instanceof ast_2.ASTReturn) {
            if (node.content) {
                programBuilder.addPWD(traverseAST(node.content));
            }
            else {
                programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUL));
            }
            return programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DORETN))
                .addStretch(node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTFunction) {
            const block = makePureBlock(node.block);
            node.guards.reverse();
            for (const guard of node.guards) {
                if (guard == null)
                    programBuilder.addEmpty();
                else
                    programBuilder.addBytecode(makeVariable(guard))
                        .addStretch(guard, 1);
            }
            node.args.reverse();
            for (const param of node.args) {
                programBuilder.addBytecode(makeVariable(param));
            }
            let extraReturn = false;
            if (block.program.length == 0 || block.program[block.program.length - 1].type != bytecode_1.PlBytecodeType.DORETN) {
                extraReturn = true;
            }
            programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUM, '' + node.args.length))
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFFUN, '' + (block.program.length + +(extraReturn ? 2 : 0))))
                .addPWD(block);
            if (extraReturn) {
                programBuilder
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUL))
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DORETN));
            }
            return programBuilder.addEmpty()
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFSTR, node.name.content))
                .addBytecodeStretch(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOCRET), node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTClosure) {
            const block = makePureBlock(node.block);
            node.guards.reverse();
            for (const guard of node.guards) {
                if (guard == null)
                    programBuilder.addEmpty();
                else
                    programBuilder.addBytecode(makeVariable(guard))
                        .addStretch(guard, 1);
            }
            node.args.reverse();
            for (const param of node.args) {
                programBuilder.addBytecode(makeVariable(param));
            }
            let extraReturn = false;
            if (block.program.length == 0 || block.program[block.program.length - 1].type != bytecode_1.PlBytecodeType.DORETN) {
                extraReturn = true;
            }
            programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUM, '' + node.args.length))
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFFUN, '' + (block.program.length + +(extraReturn ? 2 : 0))))
                .addPWD(block);
            if (extraReturn) {
                programBuilder
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUL))
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DORETN));
            }
            return programBuilder.toProgram();
        }
        else if (node instanceof ast_2.ASTImpl) {
            programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFVAR, node.target.content))
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKPOP))
                .addStretch(node.target);
            const block = makePureBlock(node.block);
            node.guards.reverse();
            for (const guard of node.guards) {
                if (guard == null)
                    programBuilder.addEmpty();
                else
                    programBuilder.addBytecode(makeVariable(guard))
                        .addStretch(guard, 1);
            }
            node.args.reverse();
            for (const param of node.args) {
                programBuilder.addBytecode(makeVariable(param));
            }
            let extraReturn = false;
            if (block.program.length == 0 || block.program[block.program.length - 1].type != bytecode_1.PlBytecodeType.DORETN) {
                extraReturn = true;
            }
            programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUM, '' + node.args.length))
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFFUN, '' + (block.program.length + +(extraReturn ? 2 : 0))))
                .addPWD(block);
            if (extraReturn) {
                programBuilder
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUL))
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DORETN));
            }
            programBuilder.addEmpty();
            const value = `${node.target.content}${exports.METHOD_SEP}${node.name.content}`;
            programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFSTR, value));
            programBuilder.addBytecodeStretch(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOCRET), node);
            return programBuilder.toProgram();
        }
        else if (node instanceof ast_2.ASTCall) {
            node.args.reverse();
            for (const arg of node.args) {
                programBuilder.addPWD(traverseAST(arg));
            }
            programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUM, '' + node.args.length))
                .addPWD(traverseAST(node.target))
                .addBytecodeStretch(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DOCALL), node);
            return programBuilder.toProgram();
        }
        else if (node instanceof ast_2.ASTBlock) {
            return programBuilder
                .addPWD(makeEvalBlock(node))
                .addEmpty()
                .addStretch(node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTIf) {
            programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKENT));
            for (let i = 0; i < node.conditions.length; ++i) {
                let condition = traverseAST(node.conditions[i]);
                let block = makePureBlock(node.blocks[i]);
                if (i != 0) {
                    programBuilder
                        .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPREL, '' + (condition.program.length + 1 + block.program.length)));
                }
                let length = block.program.length + 1;
                if (node.conditions.length - i == 1 && !node.other) {
                    length -= 1;
                }
                node.conditions[i].attribute = ast_2.ASTAttributes.ASTCondition;
                programBuilder
                    .addPWD(condition)
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPICF, '' + length))
                    .addStretch(node.conditions[i], condition.program.length + 1)
                    .addPWD(block);
            }
            if (node.other) {
                let other = makePureBlock(node.other);
                programBuilder
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPREL, '' + other.program.length))
                    .addPWD(other);
            }
            return programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKEXT))
                .addEmpty()
                .addStretch(node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTFor) {
            programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKENT));
            if (node.start) {
                programBuilder
                    .addPWD(traverseAST(node.start))
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKPOP));
            }
            let cond;
            let after;
            let condLength = 0;
            let afterLength = 0;
            if (node.condition) {
                cond = traverseAST(node.condition);
                condLength = cond.program.length + 1;
            }
            if (node.after) {
                after = traverseAST(node.after);
                afterLength = after.program.length + 1;
            }
            let block = makePureBlock(node.block);
            replaceBC(block, afterLength);
            if (cond) {
                node.condition.attribute = ast_2.ASTAttributes.ASTCondition;
                programBuilder
                    .addPWD(cond)
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPICF, '' + (block.program.length + afterLength + 1)))
                    .addStretch(node.condition, cond.program.length + 1);
            }
            programBuilder
                .addPWD(block);
            if (after) {
                programBuilder
                    .addPWD(after)
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKPOP));
            }
            programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPREL, '-' + (block.program.length + afterLength + condLength + 1)));
            return programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKEXT))
                .addEmpty()
                .addStretch(node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTWhile) {
            programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKENT));
            let cond = traverseAST(node.condition);
            let block = makePureBlock(node.block);
            replaceBC(block, 0);
            node.condition.attribute = ast_2.ASTAttributes.ASTCondition;
            programBuilder
                .addPWD(cond)
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPICF, '' + (block.program.length + 1)))
                .addStretch(node.condition, cond.program.length + 1)
                .addPWD(block)
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPREL, '-' + (cond.program.length + block.program.length + 2)));
            return programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKEXT))
                .addEmpty()
                .addStretch(node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTLoop) {
            programBuilder.addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKENT));
            let block = makePureBlock(node.block);
            let bodySize = block.program.length;
            if (node.amount) {
                const target = node.amount.getSpanToken();
                const assignment = new ast_2.ASTCreate([], undefined, new ast_2.ASTVariable([], exports.LOOP_INDEX), node.amount);
                programBuilder
                    .addPWD(traverseAST(assignment))
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKPOP));
                const cond = new ast_2.ASTBinary([], new ast_2.ASTUnary([target], token_4.NewFakePlToken(token_4.PlTokenType.DEC, "--"), new ast_2.ASTVariable([], exports.LOOP_INDEX)), new ast_2.ASTNumber([], '0'), token_4.NewFakePlToken(token_4.PlTokenType.GTE, ">="));
                const out = traverseAST(cond);
                node.amount.attribute = ast_2.ASTAttributes.ASTCondition;
                programBuilder
                    .addPWDNoDebug(out)
                    .addStretch(node.amount, out.program.length)
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPICF, '' + (bodySize + 1)));
                bodySize += out.program.length + 1;
            }
            replaceBC(block, 0);
            programBuilder.addPWD(block)
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPREL, '-' + (bodySize + 1)));
            return programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKEXT))
                .addEmpty()
                .addStretch(node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTMatch) {
            let value = null;
            if (node.value) {
                value = new ast_2.ASTVariable([], exports.MATCH_VALUE);
                const assignment = new ast_2.ASTCreate([], undefined, value, node.value);
                programBuilder
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKENT))
                    .addPWD(traverseAST(assignment))
                    .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKPOP));
            }
            let conditions = [];
            for (const branch of node.cases) {
                let cases = null;
                for (const kase of branch) {
                    const compare = value == null
                        ? kase
                        : new ast_2.ASTBinary([], value, kase, token_4.NewFakePlToken(token_4.PlTokenType.EQ, '=='));
                    if (cases == null) {
                        cases = compare;
                    }
                    else {
                        cases = new ast_2.ASTBinary([], cases, compare, token_4.NewFakePlToken(token_4.PlTokenType.OR, 'or'));
                    }
                }
                conditions.push(cases);
            }
            const astIf = new ast_2.ASTIf([], conditions, node.blocks, node.other);
            const ifProgram = traverseAST(astIf);
            if (value) {
                ifProgram.program.shift();
                ifProgram.debug.forEach(d => d.endLine -= 1);
            }
            return programBuilder
                .addPWD(ifProgram)
                .popDebug()
                .addStretch(node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTEach) {
            programBuilder
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKENT));
            const iter = new ast_2.ASTVariable([], exports.EACH_ITER);
            const index = new ast_2.ASTVariable([], exports.LOOP_INDEX);
            const target = node.iterator.getSpanToken();
            const dot = new ast_2.ASTDot([], node.iterator, new ast_2.ASTVariable([target], "iter"));
            dot.attribute = ast_2.ASTAttributes.ASTCondition;
            const assignment = new ast_2.ASTCreate([], undefined, iter, new ast_2.ASTCall([], dot, []));
            programBuilder
                .addPWD(traverseAST(assignment))
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKPOP));
            const one = new ast_2.ASTVariable([], '1');
            const two = new ast_2.ASTVariable([], '2');
            const condition = new ast_2.ASTDot([], new ast_2.ASTCreate([], undefined, index, new ast_2.ASTCall([target], new ast_2.ASTDot([], iter, new ast_2.ASTVariable([], "next")), [])), two);
            let inBlock = [];
            const valueAssign = new ast_2.ASTCreate([], undefined, node.value, new ast_2.ASTDot([], new ast_2.ASTDot([], index, one), one));
            inBlock.push(valueAssign);
            if (node.key) {
                const keyAssign = new ast_2.ASTCreate([], undefined, node.key, new ast_2.ASTDot([], new ast_2.ASTDot([], index, one), two));
                inBlock.push(keyAssign);
            }
            const cond = traverseAST(condition);
            const kvBlock = makePureBlock(new ast_2.ASTBlock([], inBlock));
            const block = makePureBlock(node.block);
            replaceBC(block, 0);
            return programBuilder
                .addPWD(cond)
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPICF, '' + (block.program.length + kvBlock.program.length + 1)))
                .addPWD(kvBlock)
                .addPWD(block)
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.JMPREL, '-' + (cond.program.length + block.program.length + kvBlock.program.length + 2)))
                .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKEXT))
                .addEmpty()
                .addStretch(node)
                .toProgram();
        }
        else if (node instanceof ast_2.ASTImport) {
        }
        else if (node instanceof ast_2.ASTExport) {
        }
        console.log("DEBUG WARNING!");
        return programBuilder
            .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUL))
            .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DORETN)).toProgram();
    }
    function makeNumber(node) {
        return bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUM, '' + node.value);
    }
    function makeEvalVariable(node) {
        return bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFVAR, node.content);
    }
    function makeVariable(node) {
        return bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFSTR, node.content);
    }
    function makeNull(node) {
        return bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFNUL, null);
    }
    function makeBool(node) {
        return bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFBOL, "" + +node.value);
    }
    function makeString(node) {
        return bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.DEFSTR, `${node.content}`);
    }
    function makeEvalBlock(node) {
        return (new ProgramBuilder())
            .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKENT))
            .addPWD(EmitProgram(node.statements, false))
            .addBytecode(bytecode_1.NewBytecode(bytecode_1.PlBytecodeType.STKEXT))
            .toProgram();
    }
    function makePureBlock(node) {
        return (new ProgramBuilder())
            .addPWD(EmitProgram(node.statements, false))
            .toProgram();
    }
});
define("extension/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const x = "";
    const t = typeof x;
});
define("vm/machine/memory", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlStackFrame = void 0;
    class PlStackFrame {
        constructor(outer, trace = null) {
            this.trace = trace;
            this.outer = outer;
            this.values = {};
        }
        get isShallow() {
            return this.trace == null;
        }
        setTraceName(name) {
            if (this.trace == null) {
                return this;
            }
            this.trace.name = name;
            return this;
        }
        setTraceInfo(info) {
            if (this.trace == null) {
                return this;
            }
            this.trace.info = info;
            return this;
        }
        findValue(key) {
            let outer = this;
            do {
                const value = outer.values[key];
                if (value)
                    return value;
                if (!outer.isShallow) {
                    return null;
                }
                outer = outer.outer;
            } while (outer != null);
            return null;
        }
        findValueDeep(key) {
            let outer = this;
            do {
                const value = outer.values[key];
                if (value)
                    return value;
                outer = outer.outer;
            } while (outer != null);
            return null;
        }
        setValue(key, value) {
            if (key in this.values) {
                this.values[key] = value;
                return;
            }
            if (this.outer == null || this.outer.findValueDeep(key) == null) {
                this.createValue(key, value);
                return;
            }
            let outer = this.outer;
            while (outer != null) {
                if (key in outer.values) {
                    outer.values[key] = value;
                    return;
                }
                outer = outer.outer;
            }
        }
        createValue(key, value) {
            this.values[key] = value;
        }
    }
    exports.PlStackFrame = PlStackFrame;
});
define("vm/machine/stuff", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlStuffNull = exports.PlStuffFalse = exports.PlStuffTrue = exports.PlStuffGetType = exports.PlStuffTypeToString = exports.PlStuffTypeToJsString = exports.PlStuffTypeFromJsString = exports.PlStuffTypeFromString = exports.NewPlStuff = exports.PlStuffTypes = exports.PlStuffTypeRest = exports.PlStuffTypeAny = exports.PlStuffType = void 0;
    var PlStuffType;
    (function (PlStuffType) {
        PlStuffType[PlStuffType["Num"] = 0] = "Num";
        PlStuffType[PlStuffType["Str"] = 1] = "Str";
        PlStuffType[PlStuffType["Bool"] = 2] = "Bool";
        PlStuffType[PlStuffType["Null"] = 3] = "Null";
        PlStuffType[PlStuffType["Type"] = 4] = "Type";
        PlStuffType[PlStuffType["Func"] = 5] = "Func";
        PlStuffType[PlStuffType["NFunc"] = 6] = "NFunc";
        PlStuffType[PlStuffType["List"] = 7] = "List";
        PlStuffType[PlStuffType["Dict"] = 8] = "Dict";
        PlStuffType[PlStuffType["Inst"] = 9] = "Inst";
        PlStuffType[PlStuffType["Raw"] = 10] = "Raw";
    })(PlStuffType = exports.PlStuffType || (exports.PlStuffType = {}));
    exports.PlStuffTypeAny = "*";
    exports.PlStuffTypeRest = "...";
    exports.PlStuffTypes = ["Num", "Str", "Bool", "Null", "Type", "Func", "List", "Dict", "Inst"];
    function NewPlStuff(type, value) {
        return {
            type,
            value
        };
    }
    exports.NewPlStuff = NewPlStuff;
    function PlStuffTypeFromString(string) {
        if (string in PlStuffType) {
            return PlStuffType[string];
        }
        throw new Error(`PlStuffTypeFromString failed to match with value ${string}`);
    }
    exports.PlStuffTypeFromString = PlStuffTypeFromString;
    function PlStuffTypeFromJsString(string) {
        switch (string) {
            case "boolean":
                return PlStuffType.Bool;
            case "function":
                return PlStuffType.Func;
            case "number":
                return PlStuffType.Num;
            case "string":
                return PlStuffType.Str;
            case "undefined":
                return PlStuffType.Null;
            case "object":
                return PlStuffType.Dict;
        }
        throw new Error(`PlStuffTypeFromJsString failed to match with value ${string}`);
    }
    exports.PlStuffTypeFromJsString = PlStuffTypeFromJsString;
    function PlStuffTypeToJsString(type) {
        switch (type) {
            case PlStuffType.Inst:
                return "object";
            case PlStuffType.NFunc:
            case PlStuffType.Func:
                return "function";
            case PlStuffType.Str:
                return "string";
            case PlStuffType.Num:
                return "number";
            case PlStuffType.Bool:
                return "boolean";
            case PlStuffType.Type:
                return "object";
            case PlStuffType.Null:
                return "object";
            case PlStuffType.List:
                return "object";
        }
    }
    exports.PlStuffTypeToJsString = PlStuffTypeToJsString;
    function PlStuffTypeToString(stuffType) {
        switch (stuffType) {
            case PlStuffType.Num:
                return "Num";
            case PlStuffType.Type:
                return "Type";
            case PlStuffType.Func:
            case PlStuffType.NFunc:
                return "Func";
            case PlStuffType.Bool:
                return "Bool";
            case PlStuffType.Str:
                return "Str";
            case PlStuffType.Null:
                return "Null";
            case PlStuffType.List:
                return "List";
            case PlStuffType.Inst:
                return "Inst";
            case PlStuffType.Dict:
                return "Dict";
            case PlStuffType.Raw:
                return "Raw";
        }
        throw new Error(`PlStuffTypeToString failed to match with value ${stuffType}`);
    }
    exports.PlStuffTypeToString = PlStuffTypeToString;
    function PlStuffGetType(stuff) {
        switch (stuff.type) {
            case PlStuffType.Inst:
                return stuff.value.type;
        }
        return PlStuffTypeToString(stuff.type);
    }
    exports.PlStuffGetType = PlStuffGetType;
    exports.PlStuffTrue = Object.freeze(NewPlStuff(PlStuffType.Bool, true));
    exports.PlStuffFalse = Object.freeze(NewPlStuff(PlStuffType.Bool, false));
    exports.PlStuffNull = Object.freeze(NewPlStuff(PlStuffType.Null, null));
});
define("vm/machine/scrambler", ["require", "exports", "vm/emitter/index", "vm/machine/stuff"], function (require, exports, emitter_1, stuff_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnscrambleFunction = exports.ScrambleName = exports.ScrambleImpl = exports.ScrambleType = void 0;
    function ScrambleType(name, impl) {
        return `${impl != undefined ? stuff_1.PlStuffTypeToString(impl) + emitter_1.METHOD_SEP : ''}${name}`;
    }
    exports.ScrambleType = ScrambleType;
    function ScrambleImpl(name, impl) {
        return `${stuff_1.PlStuffGetType(impl)}${emitter_1.METHOD_SEP}${name}`;
    }
    exports.ScrambleImpl = ScrambleImpl;
    function ScrambleName(name, type) {
        return `${type}${emitter_1.METHOD_SEP}${name}`;
    }
    exports.ScrambleName = ScrambleName;
    function UnscrambleFunction(scrambled) {
        if (scrambled.includes(emitter_1.METHOD_SEP)) {
            const out = scrambled.split('@');
            if (out.length != 2) {
                throw new Error(`UnscrambleFunction unscrambled a name that contains more than two @, scrambled: '${scrambled}'`);
            }
            return [out[0], out[1]];
        }
        return ['', scrambled];
    }
    exports.UnscrambleFunction = UnscrambleFunction;
});
define("vm/machine/native/messeger", ["require", "exports", "vm/machine/stuff"], function (require, exports, stuff_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MakeNoTypeFunctionMessage = exports.MakeNotFoundMessage = exports.MakeOutOfRangeMessage = exports.MakeOperatorMessage = exports.MakeArityMessage = exports.MakeTypeMessage = void 0;
    function MakeTypeMessage(name, expected, got, position) {
        return `'${name}' requires the ${position}th argument to be of type ${stuff_2.PlStuffTypeToString(expected)} - got ${stuff_2.PlStuffTypeToString(got.type)} instead`;
    }
    exports.MakeTypeMessage = MakeTypeMessage;
    function MakeArityMessage(name, expected, got) {
        return `'${name}' received an incorrect amount of arguments - it needed ${expected} but got ${got}`;
    }
    exports.MakeArityMessage = MakeArityMessage;
    function MakeOperatorMessage(name, left, right) {
        return `the operator '${name}' cannot operate on different types on the left and the right - left is ${stuff_2.PlStuffTypeToString(left)}, right is ${stuff_2.PlStuffTypeToString(right)}`;
    }
    exports.MakeOperatorMessage = MakeOperatorMessage;
    function MakeOutOfRangeMessage(name, type, length, got) {
        return `'${name}' accessed an element out of range on a ${stuff_2.PlStuffTypeToString(type)}: expected ${length == 0 ? '0' : '1'}-${length}, got ${got + 1}`;
    }
    exports.MakeOutOfRangeMessage = MakeOutOfRangeMessage;
    function MakeNotFoundMessage(name, type, key) {
        return `'${name}' cannot find the key '${key}' on a ${stuff_2.PlStuffTypeToString(type)}`;
    }
    exports.MakeNotFoundMessage = MakeNotFoundMessage;
    function MakeNoTypeFunctionMessage(name, method, got) {
        return `'${name}' need the method '${method}' on ${stuff_2.PlStuffTypeToString(got.type)}, but none was found`;
    }
    exports.MakeNoTypeFunctionMessage = MakeNoTypeFunctionMessage;
});
define("vm/machine/native/converter", ["require", "exports", "vm/machine/stuff", "problem/index"], function (require, exports, stuff_3, problem_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlActions = exports.PlConverter = void 0;
    function protectPlangCall(callback, sm) {
        return (...args) => {
            const caller = (new Error()).stack.split("\n")[2].trim().split(" ")[1];
            if (caller == undefined || !caller.includes("PlStackMachine")) {
                const saved = sm.saveState();
                try {
                    return callback(...args);
                }
                catch (e) {
                    debugger;
                    sm.restoreState(saved);
                    const problem = sm.problems.pop();
                    const trace = sm.getTrace();
                    problem_4.ReportProblems(sm.file.content, [problem], trace);
                    return null;
                }
            }
            return callback(...args);
        };
    }
    var PlConverter;
    (function (PlConverter) {
        PlConverter.VERSION = 1;
        function instanceToJs(instance, sm) {
            const out = {};
            Object.entries(instance.value).forEach(([key, value]) => {
                out[key] = PlToJs(value, sm);
            });
            return {
                _version: PlConverter.VERSION,
                type: "Instance",
                value: {
                    type: instance.type,
                    value: out
                }
            };
        }
        function jsIsCustom(js) {
            if ("_version" in js) {
                switch (js["_version"]) {
                    case 1:
                        if ("type" in js && typeof js["type"] == "string") {
                            if ("value" in js && js["value"] !== null) {
                                return true;
                            }
                        }
                        return false;
                    default:
                        return false;
                }
            }
            return false;
        }
        function jsToInstance(js, sm) {
            const out = {};
            for (const [key, value] of Object.entries(js.value.value)) {
                out[key] = JsToPl(value, sm);
            }
            return stuff_3.NewPlStuff(stuff_3.PlStuffType.Inst, {
                type: js.value.type,
                value: out
            });
        }
        function typeToJs(type) {
            return {
                _version: PlConverter.VERSION,
                type: "Type",
                value: {
                    type: type.value.type,
                    format: type.value.format
                }
            };
        }
        function jsToType(js) {
            return stuff_3.NewPlStuff(stuff_3.PlStuffType.Type, {
                type: js.value.type,
                format: js.value.value
            });
        }
        function jsToRaw(js) {
            return stuff_3.NewPlStuff(stuff_3.PlStuffType.Raw, js.value);
        }
        function rawToJs(raw) {
            return {
                _version: PlConverter.VERSION,
                type: "Raw",
                value: raw.value
            };
        }
        function PlToJs(object, sm) {
            switch (object.type) {
                case stuff_3.PlStuffType.Str: {
                    return object.value;
                }
                case stuff_3.PlStuffType.Num: {
                    return +object.value;
                }
                case stuff_3.PlStuffType.Type: {
                    return typeToJs(object);
                }
                case stuff_3.PlStuffType.Bool: {
                    return object.value;
                }
                case stuff_3.PlStuffType.Null: {
                    return null;
                }
                case stuff_3.PlStuffType.List: {
                    return object.value.map(v => PlToJs(v, sm));
                }
                case stuff_3.PlStuffType.Inst: {
                    const value = object.value;
                    return instanceToJs(value, sm);
                }
                case stuff_3.PlStuffType.Dict: {
                    const out = {};
                    Object.entries(object.value).forEach(([key, value]) => {
                        out[key] = PlToJs(value, sm);
                    });
                    return out;
                }
                case stuff_3.PlStuffType.NFunc: {
                    return (...args) => {
                        return PlToJs(object.value.native(...args.map(a => JsToPl(a, sm))), sm);
                    };
                }
                case stuff_3.PlStuffType.Func: {
                    const callPointer = sm.pointer;
                    return protectPlangCall((...args) => {
                        return PlToJs(sm.runFunction(object, args.map(arg => JsToPl(arg, sm)), callPointer), sm);
                    }, sm);
                }
                case stuff_3.PlStuffType.Raw:
                    return rawToJs(object);
            }
            throw new Error(`PlConvert.PlToJs failed to match object of type ${stuff_3.PlStuffTypeToString(object.type)}`);
        }
        PlConverter.PlToJs = PlToJs;
        function JsToPl(object, sm) {
            switch (typeof object) {
                case "number": {
                    return stuff_3.NewPlStuff(stuff_3.PlStuffType.Num, object);
                }
                case "string": {
                    return stuff_3.NewPlStuff(stuff_3.PlStuffType.Str, object);
                }
                case "boolean": {
                    if (object) {
                        return stuff_3.PlStuffTrue;
                    }
                    return stuff_3.PlStuffFalse;
                }
                case "function": {
                    return stuff_3.NewPlStuff(stuff_3.PlStuffType.NFunc, {
                        native: (...args) => {
                            return JsToPl(object.bind(sm)(...args.map(a => PlToJs(a, sm))), sm);
                        },
                        name: "native",
                        parameters: [stuff_3.PlStuffTypeRest],
                        self: null,
                    });
                }
                case "undefined": {
                    return stuff_3.PlStuffNull;
                }
                case "object": {
                    if (object == null) {
                        return stuff_3.PlStuffNull;
                    }
                    if (Array.isArray(object)) {
                        return stuff_3.NewPlStuff(stuff_3.PlStuffType.List, object.map(i => JsToPl(i, sm)));
                    }
                    if (jsIsCustom(object)) {
                        switch (object.type) {
                            case "Instance":
                                return jsToInstance(object, sm);
                            case "Type":
                                return jsToType(object);
                            case "Raw":
                                return jsToRaw(object);
                        }
                    }
                    const obj = {};
                    for (const [key, value] of Object.entries(object)) {
                        obj[key] = JsToPl(value, sm);
                    }
                    return stuff_3.NewPlStuff(stuff_3.PlStuffType.Dict, obj);
                }
            }
            throw new Error(`PlConvert.JsToPl failed to match object of type ${typeof object}`);
        }
        PlConverter.JsToPl = JsToPl;
        function PlToPl(source, target, sm) {
            if (target.format != null) {
                return stuff_3.PlStuffNull;
            }
            const sourceStr = stuff_3.PlStuffGetType(source);
            const targetStr = target.type;
            if (sourceStr == targetStr) {
                return source;
            }
            const targetType = stuff_3.PlStuffTypeFromString(targetStr);
            switch (targetType) {
                case stuff_3.PlStuffType.Dict:
                case stuff_3.PlStuffType.Inst:
                case stuff_3.PlStuffType.Func:
                case stuff_3.PlStuffType.NFunc:
                case stuff_3.PlStuffType.List:
                case stuff_3.PlStuffType.Null:
                case stuff_3.PlStuffType.Type:
                    return stuff_3.PlStuffNull;
                case stuff_3.PlStuffType.Bool: {
                    let out;
                    switch (source.type) {
                        case stuff_3.PlStuffType.Num:
                            out = source.value != 0;
                            break;
                        case stuff_3.PlStuffType.List:
                        case stuff_3.PlStuffType.Str:
                            out = source.value.length != 0;
                            break;
                        case stuff_3.PlStuffType.Dict:
                            out = Object.keys(source.value).length != 0;
                            break;
                        case stuff_3.PlStuffType.NFunc:
                        case stuff_3.PlStuffType.Inst:
                        case stuff_3.PlStuffType.Func:
                        case stuff_3.PlStuffType.Type:
                            out = true;
                            break;
                        case stuff_3.PlStuffType.Null:
                            out = false;
                            break;
                    }
                    return out == true ? stuff_3.PlStuffTrue : stuff_3.PlStuffFalse;
                }
                case stuff_3.PlStuffType.Num: {
                    let num = null;
                    switch (source.type) {
                        case stuff_3.PlStuffType.Bool:
                            num = source.value == true ? 1 : 0;
                            break;
                        case stuff_3.PlStuffType.Str: {
                            const out = parseFloat(source.value);
                            if (!isNaN(out)) {
                                num = out;
                                break;
                            }
                            else
                                return stuff_3.PlStuffNull;
                        }
                        case stuff_3.PlStuffType.Null:
                            num = 0;
                            break;
                        case stuff_3.PlStuffType.Inst:
                        case stuff_3.PlStuffType.NFunc:
                        case stuff_3.PlStuffType.Dict:
                        case stuff_3.PlStuffType.List:
                        case stuff_3.PlStuffType.Func:
                        case stuff_3.PlStuffType.Type:
                            return stuff_3.PlStuffNull;
                    }
                    return stuff_3.NewPlStuff(stuff_3.PlStuffType.Num, num);
                }
                case stuff_3.PlStuffType.Str: {
                    return stuff_3.NewPlStuff(stuff_3.PlStuffType.Str, PlToString(source, sm));
                }
            }
            return stuff_3.PlStuffNull;
        }
        PlConverter.PlToPl = PlToPl;
        function PlToString(object, sm, quote = false) {
            switch (object.type) {
                case stuff_3.PlStuffType.Bool:
                    return object.value ? "true" : "false";
                case stuff_3.PlStuffType.Dict:
                    return `dict(${Object.entries(object.value).map(([key, value]) => `${key}: ${PlToString(value, sm, true)}`).join(', ')})`;
                case stuff_3.PlStuffType.NFunc:
                case stuff_3.PlStuffType.Func:
                    return `[function]`;
                case stuff_3.PlStuffType.List:
                    return `list(${object.value.map(v => PlToString(v, sm, true)).join(', ')})`;
                case stuff_3.PlStuffType.Null:
                    return "null";
                case stuff_3.PlStuffType.Num:
                    return "" + object.value;
                case stuff_3.PlStuffType.Str:
                    if (quote) {
                        return `"${object.value}"`;
                    }
                    return object.value;
                case stuff_3.PlStuffType.Type:
                    return object.value.type;
                case stuff_3.PlStuffType.Raw:
                    return "[raw]";
                case stuff_3.PlStuffType.Inst: {
                    let fn;
                    if ((fn = sm.findFunction("str", object))) {
                        const out = sm.runFunction(fn, [object]);
                        return PlToString(out, sm, quote);
                    }
                    else {
                        return `${object.value.type}(${Object.entries(object.value.value).map(([key, value]) => `${key}: ${PlToString(value, sm, true)}`).join(', ')})`;
                    }
                }
            }
            throw new Error(`PlActions.PlToString failed to match object of type ${stuff_3.PlStuffTypeToString(object.type)}`);
        }
        PlConverter.PlToString = PlToString;
        function PlToDebugString(object) {
            switch (object.type) {
                case stuff_3.PlStuffType.Bool:
                    return object.value ? "true" : 'false';
                case stuff_3.PlStuffType.Dict:
                    return `Dict(${Object.entries(object.value).map(([key, value]) => `${key}: ${PlToDebugString(value)}`).join(', ')})`;
                case stuff_3.PlStuffType.Null:
                    return "null";
                case stuff_3.PlStuffType.Inst:
                    return `${object.value.type}(${Object.entries(object.value.value).map(([key, value]) => `${key}: ${PlToDebugString(value)}`).join(',\n')}\n)`;
                case stuff_3.PlStuffType.List:
                    return `List(${object.value.map(v => PlToDebugString(v)).join(', ')})`;
                case stuff_3.PlStuffType.Raw:
                    return '[raw]';
                case stuff_3.PlStuffType.Func: {
                    const params = [];
                    if (object.value.self)
                        params.push(`self=${PlToDebugString(object.value.self)}`);
                    for (const param of object.value.parameters) {
                        params.push(param);
                    }
                    return `Func(${params.join(', ')}) -> Any`;
                }
                case stuff_3.PlStuffType.NFunc: {
                    const params = [];
                    if (object.value.self)
                        params.push(`self=${PlToDebugString(object.value.self)}`);
                    for (const type of object.value.parameters) {
                        if (typeof type == "string") {
                            params.push(type);
                            continue;
                        }
                        params.push(stuff_3.PlStuffTypeToString(type));
                    }
                    return `NFunc(${params.join(', ')}) -> Any`;
                }
                case stuff_3.PlStuffType.Num:
                    return "" + object.value;
                case stuff_3.PlStuffType.Str:
                    return `"${object.value}"`;
                case stuff_3.PlStuffType.Type:
                    return `Type(${object.value.type})`;
            }
            throw new Error("PlToDebugString failed to match an object");
        }
        PlConverter.PlToDebugString = PlToDebugString;
    })(PlConverter = exports.PlConverter || (exports.PlConverter = {}));
    var PlActions;
    (function (PlActions) {
        function PlCopy(object) {
            const { type, value } = object;
            switch (type) {
                case stuff_3.PlStuffType.Num:
                case stuff_3.PlStuffType.Str:
                case stuff_3.PlStuffType.List:
                case stuff_3.PlStuffType.Dict:
                    return stuff_3.NewPlStuff(type, value);
                case stuff_3.PlStuffType.Raw:
                case stuff_3.PlStuffType.Inst:
                case stuff_3.PlStuffType.Type:
                case stuff_3.PlStuffType.Bool:
                case stuff_3.PlStuffType.Null:
                    return object;
                case stuff_3.PlStuffType.Func:
                case stuff_3.PlStuffType.NFunc:
                    return stuff_3.NewPlStuff(type, Object.assign({}, value));
            }
            throw new Error(`PlActions.PlCopy failed to match type ${stuff_3.PlStuffTypeToString(object.type)}`);
        }
        PlActions.PlCopy = PlCopy;
        function PlClone(object) {
            const { type, value } = object;
            switch (type) {
                case stuff_3.PlStuffType.Num:
                case stuff_3.PlStuffType.Str:
                    return stuff_3.NewPlStuff(type, value);
                case stuff_3.PlStuffType.List:
                    return stuff_3.NewPlStuff(type, value.map(v => PlClone(v)));
                case stuff_3.PlStuffType.Func:
                case stuff_3.PlStuffType.NFunc:
                    return stuff_3.NewPlStuff(type, Object.assign({}, value));
                case stuff_3.PlStuffType.Inst: {
                    const newObj = {};
                    Object.entries(value.value).forEach(([k, v]) => {
                        newObj[k] = PlClone(v);
                    });
                    return stuff_3.NewPlStuff(type, {
                        type: value.type,
                        value: newObj
                    });
                }
                case stuff_3.PlStuffType.Dict: {
                    const newObj = {};
                    Object.entries(value).forEach(([k, v]) => {
                        newObj[k] = PlClone(v);
                    });
                    return stuff_3.NewPlStuff(type, newObj);
                }
                case stuff_3.PlStuffType.Raw:
                case stuff_3.PlStuffType.Type:
                case stuff_3.PlStuffType.Null:
                case stuff_3.PlStuffType.Bool:
                    return object;
            }
            throw new Error(`PlActions.PlClone failed to match type ${stuff_3.PlStuffTypeToString(object.type)}`);
        }
        PlActions.PlClone = PlClone;
    })(PlActions = exports.PlActions || (exports.PlActions = {}));
});
define("vm/machine/native/helpers", ["require", "exports", "vm/machine/scrambler", "vm/machine/stuff", "vm/machine/native/messeger", "vm/machine/native/converter"], function (require, exports, scrambler_1, stuff_4, messeger_1, converter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GenerateForSome = exports.GenerateExceptInst = exports.GenerateForAll = exports.GenerateGuardedTypeFunction = exports.GenerateGuardedFunction = exports.ExpectedNArguments = exports.AssertTypeEqual = exports.AssertOperatorsSide = exports.AssertType = exports.AssertTypeof = void 0;
    var JsToPl = converter_1.PlConverter.JsToPl;
    function AssertTypeof(name, got, expected, position = 1) {
        if (typeof got != expected) {
            throw new Error(messeger_1.MakeTypeMessage(name, stuff_4.PlStuffTypeFromJsString(expected), JsToPl(got, null), position));
        }
    }
    exports.AssertTypeof = AssertTypeof;
    function AssertType(name, got, expected, position = 1) {
        if (got.type != expected) {
            throw new Error(messeger_1.MakeTypeMessage(name, expected, got, position));
        }
    }
    exports.AssertType = AssertType;
    function AssertOperatorsSide(name, closure) {
        return (l, r) => {
            if (typeof l != typeof r) {
                throw new Error(messeger_1.MakeOperatorMessage(name, JsToPl(l, null).type, JsToPl(r, null).type));
            }
            return closure(l, r);
        };
    }
    exports.AssertOperatorsSide = AssertOperatorsSide;
    function AssertTypeEqual(name, closure) {
        return (l, r) => {
            if (l.type != r.type) {
                throw new Error(messeger_1.MakeOperatorMessage(name, l.type, r.type));
            }
            return closure(l, r);
        };
    }
    exports.AssertTypeEqual = AssertTypeEqual;
    function ExpectedNArguments(name, got, expected) {
        if (expected != got) {
            throw new Error(messeger_1.MakeArityMessage(name, expected, got));
        }
    }
    exports.ExpectedNArguments = ExpectedNArguments;
    function GenerateGuardedFunction(name, guards, func) {
        return {
            name,
            parameters: guards,
            native: func,
            self: null,
        };
    }
    exports.GenerateGuardedFunction = GenerateGuardedFunction;
    function GenerateGuardedTypeFunction(name, guards, func) {
        return {
            name,
            parameters: [stuff_4.PlStuffTypeAny, ...guards],
            self: null,
            native: func
        };
    }
    exports.GenerateGuardedTypeFunction = GenerateGuardedTypeFunction;
    function GenerateForAll(name, func) {
        const out = {};
        for (const item of stuff_4.PlStuffTypes) {
            out[scrambler_1.ScrambleName(name, item)] = func;
        }
        return out;
    }
    exports.GenerateForAll = GenerateForAll;
    function GenerateExceptInst(name, func) {
        const out = {};
        for (const item of stuff_4.PlStuffTypes) {
            if (item == "Inst")
                continue;
            out[scrambler_1.ScrambleName(name, item)] = func;
        }
        return out;
    }
    exports.GenerateExceptInst = GenerateExceptInst;
    function GenerateForSome(name, types, func) {
        const strs = types.map(t => stuff_4.PlStuffTypeToString(t));
        const out = {};
        for (const item of stuff_4.PlStuffTypes) {
            if (strs.includes(item)) {
                out[scrambler_1.ScrambleName(name, item)] = func;
            }
        }
        return out;
    }
    exports.GenerateForSome = GenerateForSome;
});
define("vm/machine/native/types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("vm/machine/native/operators", ["require", "exports", "vm/machine/scrambler", "vm/machine/stuff", "vm/machine/native/helpers"], function (require, exports, scrambler_2, stuff_5, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.operators = exports.jsOperators = exports.equals = void 0;
    function equals(l, r) {
        if (l.type != r.type) {
            return false;
        }
        let out = false;
        switch (l.type) {
            case stuff_5.PlStuffType.Num:
            case stuff_5.PlStuffType.Bool:
            case stuff_5.PlStuffType.Str:
                out = l.value === r.value;
                break;
            case stuff_5.PlStuffType.Type:
                out = l.value.type == r.value.type;
                break;
            case stuff_5.PlStuffType.Null:
                out = true;
                break;
            case stuff_5.PlStuffType.List:
            case stuff_5.PlStuffType.Dict:
            case stuff_5.PlStuffType.NFunc:
            case stuff_5.PlStuffType.Func:
                out = false;
                break;
        }
        return out;
    }
    exports.equals = equals;
    function greater(l, r) {
        return l.value > r.value;
    }
    function generateOperation(name, operand, func) {
        return helpers_1.GenerateGuardedTypeFunction(name, [operand], func);
    }
    function wrapBool(value) {
        return (...args) => {
            return value(...args) == true ? stuff_5.PlStuffTrue : stuff_5.PlStuffFalse;
        };
    }
    function generateCompare(type, eq = null, gt = null) {
        let equals;
        let nequals;
        let greater;
        let ngreater;
        if (eq) {
            equals = helpers_1.GenerateGuardedTypeFunction("==", [stuff_5.PlStuffTypeAny], wrapBool(eq));
            nequals = helpers_1.GenerateGuardedTypeFunction("!=", [stuff_5.PlStuffTypeAny], wrapBool((l, r) => !eq(l, r)));
        }
        if (gt) {
            greater = generateOperation(">", type, wrapBool(gt));
            ngreater = generateOperation("<=", type, wrapBool((l, r) => !gt(l, r)));
        }
        let out = {};
        if (equals) {
            out = Object.assign(Object.assign({}, out), { [scrambler_2.ScrambleType("==", type)]: equals, [scrambler_2.ScrambleType("/=", type)]: nequals });
        }
        if (greater) {
            out = Object.assign(Object.assign({}, out), { [scrambler_2.ScrambleType(">", type)]: greater, [scrambler_2.ScrambleType("<=", type)]: ngreater });
        }
        if (equals && greater) {
            out = Object.assign(Object.assign({}, out), { [scrambler_2.ScrambleType("<", type)]: generateOperation("<", type, wrapBool((l, r) => !eq(l, r) && !gt(l, r))), [scrambler_2.ScrambleType(">=", type)]: generateOperation("<", type, wrapBool((l, r) => eq(l, r) || gt(l, r))) });
        }
        return out;
    }
    exports.jsOperators = {
        [scrambler_2.ScrambleType("+", stuff_5.PlStuffType.Num)]: generateOperation("+", stuff_5.PlStuffType.Num, (l, r) => l + r),
        [scrambler_2.ScrambleType("-", stuff_5.PlStuffType.Num)]: generateOperation("-", stuff_5.PlStuffType.Num, (l, r) => l - r),
        [scrambler_2.ScrambleType("*", stuff_5.PlStuffType.Num)]: generateOperation("*", stuff_5.PlStuffType.Num, (l, r) => l * r),
        [scrambler_2.ScrambleType("/", stuff_5.PlStuffType.Num)]: generateOperation("/", stuff_5.PlStuffType.Num, (l, r) => l / r),
        [scrambler_2.ScrambleType("mod", stuff_5.PlStuffType.Num)]: generateOperation("mod", stuff_5.PlStuffType.Num, (l, r) => l % r),
        [scrambler_2.ScrambleType("+", stuff_5.PlStuffType.Str)]: generateOperation("+", stuff_5.PlStuffType.Str, (l, r) => l + r),
        [scrambler_2.ScrambleType("*", stuff_5.PlStuffType.Str)]: helpers_1.GenerateGuardedTypeFunction("*", [stuff_5.PlStuffType.Num], (l, r) => {
            return l.repeat(r);
        }),
    };
    exports.operators = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, generateCompare(stuff_5.PlStuffType.Num, equals, greater)), generateCompare(stuff_5.PlStuffType.Str, equals, greater)), generateCompare(stuff_5.PlStuffType.Bool, equals)), generateCompare(stuff_5.PlStuffType.Null, equals)), generateCompare(stuff_5.PlStuffType.Type, equals)), generateCompare(stuff_5.PlStuffType.Func, equals)), generateCompare(stuff_5.PlStuffType.List, equals)), generateCompare(stuff_5.PlStuffType.Dict, equals)), generateCompare(stuff_5.PlStuffType.Inst, equals));
});
define("vm/machine/native/impl/list", ["require", "exports", "vm/machine/scrambler", "vm/machine/stuff", "vm/machine/native/helpers", "vm/machine/native/operators", "vm/machine/native/messeger", "vm/machine/native/converter"], function (require, exports, scrambler_3, stuff_6, helpers_2, operators_1, messeger_2, converter_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.list = exports.jsList = void 0;
    var PlToString = converter_2.PlConverter.PlToString;
    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.jsList = {
        [scrambler_3.ScrambleType("size", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("size", [], function (lst) {
            return lst.length;
        })
    };
    exports.list = {
        [scrambler_3.ScrambleType("iter", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("iter", [], function (self) {
            let index = 0;
            return stuff_6.NewPlStuff(stuff_6.PlStuffType.Dict, {
                next: stuff_6.NewPlStuff(stuff_6.PlStuffType.NFunc, {
                    parameters: [],
                    self: null,
                    name: "iter",
                    native: () => {
                        if (index >= self.value.length) {
                            return stuff_6.NewPlStuff(stuff_6.PlStuffType.List, [stuff_6.PlStuffNull, stuff_6.PlStuffFalse]);
                        }
                        return stuff_6.NewPlStuff(stuff_6.PlStuffType.List, [
                            stuff_6.NewPlStuff(stuff_6.PlStuffType.List, [self.value[index++], stuff_6.NewPlStuff(stuff_6.PlStuffType.Num, index)]),
                            stuff_6.PlStuffTrue
                        ]);
                    }
                })
            });
        }),
        [scrambler_3.ScrambleType("get", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("get", [stuff_6.PlStuffType.Num], function (self, index) {
            if (index.type != stuff_6.PlStuffType.List && index.type != stuff_6.PlStuffType.Num) {
                throw new Error("'get' requires a number or a list as argument");
            }
            const list = self.value;
            const idx = index.value - 1;
            if (idx < 0 || idx >= list.length) {
                throw new Error(messeger_2.MakeOutOfRangeMessage("get", stuff_6.PlStuffType.List, list.length, index.value));
            }
            return list[idx];
        }),
        [scrambler_3.ScrambleType("add", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("add", [stuff_6.PlStuffTypeAny], function (self, value) {
            self.value.push(value);
            return stuff_6.NewPlStuff(stuff_6.PlStuffType.Num, self.value.length);
        }),
        [scrambler_3.ScrambleType("insert", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("insert", [stuff_6.PlStuffType.Num, stuff_6.PlStuffTypeAny], function (self, index, value) {
            if (index.value == self.value.length + 1) {
                self.value.push(value);
                return self;
            }
            const idx = index.value - 1;
            if (idx < 0 || idx >= self.value.length) {
                throw new Error(messeger_2.MakeOutOfRangeMessage("insert", stuff_6.PlStuffType.List, self.value.length, index.value));
            }
            self.value.splice(idx, 0, value);
            return self;
        }),
        [scrambler_3.ScrambleType("pop", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("pop", [], function (self) {
            return self.value.pop();
        }),
        [scrambler_3.ScrambleType("shift", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("shift", [], function (self) {
            return self.value.shift();
        }),
        [scrambler_3.ScrambleType("set", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("set", [stuff_6.PlStuffType.Num, stuff_6.PlStuffTypeAny], function (self, index, value) {
            const idx = index.value - 1;
            const list = self.value;
            if (idx < 0 || idx >= list.length) {
                throw new Error(messeger_2.MakeOutOfRangeMessage("set", stuff_6.PlStuffType.List, list.length, index.value));
            }
            list[idx] = value;
            return self;
        }),
        [scrambler_3.ScrambleType("have", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("have", [stuff_6.PlStuffTypeAny], function (self, value) {
            for (const item of self.value) {
                if (operators_1.equals(item, value)) {
                    return stuff_6.PlStuffTrue;
                }
            }
            return stuff_6.PlStuffFalse;
        }),
        [scrambler_3.ScrambleType("index", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("index", [stuff_6.PlStuffTypeAny], function (self, value) {
            for (let i = 0; i < self.value.length; i++) {
                if (operators_1.equals(self.value[i], value)) {
                    return stuff_6.NewPlStuff(stuff_6.PlStuffType.Num, i + 1);
                }
            }
            return stuff_6.NewPlStuff(stuff_6.PlStuffType.Num, 0);
        }),
        [scrambler_3.ScrambleType("shuffle", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("shuffle", [], function (self) {
            self.value = shuffle(self.value);
            return self;
        }),
        [scrambler_3.ScrambleType("remove", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("remove", [stuff_6.PlStuffType.Num], function (self, index) {
            const list = self.value;
            const idx = index.value - 1;
            if (idx < 0 || idx >= list.length) {
                throw new Error(messeger_2.MakeOutOfRangeMessage("remove", stuff_6.PlStuffType.List, list.length, index.value));
            }
            const [out] = list.splice(idx, 1);
            return out;
        }),
        [scrambler_3.ScrambleType("join", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("join", [stuff_6.PlStuffType.Str], function (self, sep) {
            const strs = self.value.map(item => {
                return PlToString(item, this);
            });
            return stuff_6.NewPlStuff(stuff_6.PlStuffType.Str, strs.join(sep.value));
        }),
        [scrambler_3.ScrambleType("random", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("random", [], function (self) {
            const lower = 0;
            const upper = self.value.length;
            return self.value[Math.floor(Math.random() * (upper - lower) + lower)];
        }),
        [scrambler_3.ScrambleType("reverse", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("reverse", [], function (self) {
            const items = [...self.value];
            items.reverse();
            return stuff_6.NewPlStuff(stuff_6.PlStuffType.List, items);
        }),
        [scrambler_3.ScrambleType("sort", stuff_6.PlStuffType.List)]: helpers_2.GenerateGuardedTypeFunction("sort", [], function (self) {
            self.value.sort((l, r) => {
                const gt = this.findFunction(">", l);
                if (gt == null) {
                    throw new Error(messeger_2.MakeNoTypeFunctionMessage("sort", ">", l));
                }
                const eq = this.findFunction("==", l);
                if (eq == null) {
                    throw new Error(messeger_2.MakeNoTypeFunctionMessage("sort", "==", l));
                }
                let result = this.runFunction(gt, [l, r]);
                if (result.value == true) {
                    return 1;
                }
                result = this.runFunction(eq, [l, r]);
                if (result.value == true) {
                    return 0;
                }
                return -1;
            });
            return self;
        }),
    };
});
define("vm/machine/native/impl/all", ["require", "exports", "vm/machine/native/helpers", "vm/machine/native/converter", "vm/machine/stuff", "vm/machine/scrambler", "vm/machine/native/messeger"], function (require, exports, helpers_3, converter_3, stuff_7, scrambler_4, messeger_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.all = void 0;
    exports.all = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, helpers_3.GenerateForAll("copy", helpers_3.GenerateGuardedTypeFunction("copy", [], object => {
        return converter_3.PlActions.PlCopy(object);
    }))), helpers_3.GenerateForAll("clone", helpers_3.GenerateGuardedTypeFunction("clone", [], object => {
        return converter_3.PlActions.PlClone(object);
    }))), helpers_3.GenerateForSome("isNative", [stuff_7.PlStuffType.Func], helpers_3.GenerateGuardedTypeFunction("isNative", [], object => {
        return object.type == stuff_7.PlStuffType.NFunc ? stuff_7.PlStuffTrue : stuff_7.PlStuffFalse;
    }))), helpers_3.GenerateForAll("is", helpers_3.GenerateGuardedTypeFunction("is", [stuff_7.PlStuffType.Type], (object, type) => {
        let otypestr = stuff_7.PlStuffGetType(object);
        return otypestr == type.value.type ? stuff_7.PlStuffTrue : stuff_7.PlStuffFalse;
    }))), helpers_3.GenerateForAll("to", helpers_3.GenerateGuardedTypeFunction("to", [stuff_7.PlStuffType.Type], function (self, type) {
        return converter_3.PlConverter.PlToPl(self, type.value, this);
    }))), helpers_3.GenerateExceptInst("bool", helpers_3.GenerateGuardedTypeFunction("bool", [], function (self) {
        return converter_3.PlConverter.PlToPl(self, { format: null, type: "Bool" }, this);
    }))), helpers_3.GenerateExceptInst("str", helpers_3.GenerateGuardedTypeFunction("str", [], function (self) {
        return converter_3.PlConverter.PlToPl(self, { format: null, type: "Str" }, this);
    }))), helpers_3.GenerateForSome("num", [stuff_7.PlStuffType.Bool, stuff_7.PlStuffType.Str, stuff_7.PlStuffType.Null, stuff_7.PlStuffType.Num], helpers_3.GenerateGuardedTypeFunction("num", [], function (self) {
        return converter_3.PlConverter.PlToPl(self, { format: null, type: "Num" }, this);
    }))), helpers_3.GenerateForAll("type", helpers_3.GenerateGuardedTypeFunction("type", [], (object) => {
        if (object.type == stuff_7.PlStuffType.NFunc) {
            return stuff_7.NewPlStuff(stuff_7.PlStuffType.Type, {
                type: "Func",
                format: null,
            });
        }
        else if (object.type == stuff_7.PlStuffType.Inst) {
            const format = Object.keys(object.value);
            return stuff_7.NewPlStuff(stuff_7.PlStuffType.Type, {
                type: stuff_7.PlStuffGetType(object),
                format,
            });
        }
        return stuff_7.NewPlStuff(stuff_7.PlStuffType.Type, {
            type: stuff_7.PlStuffGetType(object),
            format: null
        });
    }))), helpers_3.GenerateForAll("in", helpers_3.GenerateGuardedTypeFunction("in", [stuff_7.PlStuffTypeAny], function (self, other) {
        const value = this.findValue(scrambler_4.ScrambleType("have", other.type));
        if (value.type == stuff_7.PlStuffType.NFunc) {
            return value.value.native(other, self);
        }
        else if (value.type == stuff_7.PlStuffType.Func) {
            return this.runFunction(value, [other, self]);
        }
        throw new Error(messeger_3.MakeNoTypeFunctionMessage("in", "have", other));
    }))), helpers_3.GenerateForAll("from", helpers_3.GenerateGuardedTypeFunction("from", [stuff_7.PlStuffTypeAny], function (self, other) {
        const value = this.findValue(scrambler_4.ScrambleType("get", other.type));
        if (value.type == stuff_7.PlStuffType.NFunc) {
            return value.value.native(other, self);
        }
        else if (value.type == stuff_7.PlStuffType.Func) {
            return this.runFunction(value, [other, self]);
        }
        throw new Error(messeger_3.MakeNoTypeFunctionMessage("from", "get", other));
    })));
});
define("vm/machine/native/impl/str", ["require", "exports", "vm/machine/scrambler", "vm/machine/stuff", "vm/machine/native/helpers", "vm/machine/native/messeger", "extension/text"], function (require, exports, scrambler_5, stuff_8, helpers_4, messeger_4, text_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.str = exports.jsStr = void 0;
    exports.jsStr = {
        [scrambler_5.ScrambleType("size", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("size", [], function (self) {
            return self.length;
        }),
        [scrambler_5.ScrambleType("have", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("size", [stuff_8.PlStuffType.Str], function (l, r) {
            return l.indexOf(r) != -1;
        }),
        [scrambler_5.ScrambleType("get", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("get", [stuff_8.PlStuffType.Num], function (self, index) {
            index--;
            if (index < 0 || index >= self.length) {
                throw new Error(messeger_4.MakeOutOfRangeMessage("get", stuff_8.PlStuffType.Str, self.length, index + 1));
            }
            return self[index];
        }),
        [scrambler_5.ScrambleType("replace", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("replace", [stuff_8.PlStuffType.Str, stuff_8.PlStuffType.Str], function (self, source, target) {
            return self.split(source).join(target);
        }),
        [scrambler_5.ScrambleType("insert", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("insert", [stuff_8.PlStuffType.Num, stuff_8.PlStuffType.Str], function (self, index, value) {
            if (index == self.length + 1) {
                return self + value;
            }
            index--;
            if (index < 0 || index >= self.length) {
                throw new Error(messeger_4.MakeOutOfRangeMessage("insert", stuff_8.PlStuffType.Str, self.length, index + 1));
            }
            return self.substring(0, index) + value + self.substring(index);
        }),
        [scrambler_5.ScrambleType("find", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("find", [stuff_8.PlStuffType.Str], function (self, value) {
            const result = self.indexOf(value);
            return result == -1 ? null : result + 1;
        }),
        [scrambler_5.ScrambleType("iter", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("iter", [], function (self) {
            let index = 0;
            return {
                next: () => {
                    if (index >= self.length) {
                        return [null, false];
                    }
                    return [[self[index++], index], true];
                }
            };
        }),
        [scrambler_5.ScrambleType("upper", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("upper", [], function (self) {
            return self.toUpperCase();
        }),
        [scrambler_5.ScrambleType("lower", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("lower", [], function (self) {
            return self.toLowerCase();
        }),
        [scrambler_5.ScrambleType("capitalize", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("capitalize", [], function (self) {
            return text_6.capitalize(self);
        }),
        [scrambler_5.ScrambleType("reverse", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("reverse", [], function (self) {
            return self.split('').reverse().join('');
        })
    };
    exports.str = {
        [scrambler_5.ScrambleType("split", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("split", [stuff_8.PlStuffType.Str], function (self, sep) {
            const list = self.value.split(sep.value).map(value => stuff_8.NewPlStuff(stuff_8.PlStuffType.Str, value));
            return stuff_8.NewPlStuff(stuff_8.PlStuffType.List, list);
        }),
        [scrambler_5.ScrambleType("remove", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("remove", [stuff_8.PlStuffType.Num], (self, index) => {
            const value = self.value;
            const idx = index.value - 1;
            if (idx < 0 || idx >= value.length) {
                throw new Error(messeger_4.MakeOutOfRangeMessage("remove", stuff_8.PlStuffType.Str, value.length, index.value));
            }
            const out = value.substring(0, idx) + value.substring(idx + 1);
            return stuff_8.NewPlStuff(stuff_8.PlStuffType.Str, out);
        }),
        [scrambler_5.ScrambleType("substring", stuff_8.PlStuffType.Str)]: helpers_4.GenerateGuardedTypeFunction("substring", [stuff_8.PlStuffType.Num, stuff_8.PlStuffType.Num], (self, start, end) => {
            return stuff_8.NewPlStuff(stuff_8.PlStuffType.Str, self.value.substring(start.value - 1, end.value));
        })
    };
});
define("vm/machine/native/impl/dict", ["require", "exports", "vm/machine/scrambler", "vm/machine/stuff", "vm/machine/native/helpers", "vm/machine/native/converter", "vm/machine/native/messeger"], function (require, exports, scrambler_6, stuff_9, helpers_5, converter_4, messeger_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.jsDict = exports.dict = void 0;
    var PlToString = converter_4.PlConverter.PlToString;
    exports.dict = {
        [scrambler_6.ScrambleType("get", stuff_9.PlStuffType.Dict)]: helpers_5.GenerateGuardedTypeFunction("get", [stuff_9.PlStuffTypeAny], function (self, key) {
            const skey = PlToString(key, this);
            if (skey in self.value) {
                return self.value[skey];
            }
            throw new Error(messeger_5.MakeNotFoundMessage("get", stuff_9.PlStuffType.Dict, skey));
        }),
        [scrambler_6.ScrambleType("set", stuff_9.PlStuffType.Dict)]: helpers_5.GenerateGuardedTypeFunction("set", [stuff_9.PlStuffTypeAny, stuff_9.PlStuffTypeAny], function (self, key, value) {
            const skey = PlToString(key, this);
            self.value[skey] = value;
            return self;
        }),
        [scrambler_6.ScrambleType("delete", stuff_9.PlStuffType.Dict)]: helpers_5.GenerateGuardedTypeFunction("delete", [stuff_9.PlStuffTypeAny], function (self, key) {
            const skey = PlToString(key, this);
            if (skey in self.value) {
                delete self.value[skey];
                return self;
            }
            throw new Error(messeger_5.MakeNotFoundMessage("delete", stuff_9.PlStuffType.Dict, skey));
        }),
        [scrambler_6.ScrambleType("size", stuff_9.PlStuffType.Dict)]: helpers_5.GenerateGuardedTypeFunction("size", [], function (self) {
            return stuff_9.NewPlStuff(stuff_9.PlStuffType.Num, Object.keys(self.value).length);
        }),
        [scrambler_6.ScrambleType("have", stuff_9.PlStuffType.Dict)]: helpers_5.GenerateGuardedTypeFunction("have", [stuff_9.PlStuffTypeAny], function (self, value) {
            for (const key of Object.keys(self.value)) {
                if (key == PlToString(value, this)) {
                    return stuff_9.PlStuffTrue;
                }
            }
            return stuff_9.PlStuffFalse;
        }),
        [scrambler_6.ScrambleType("iter", stuff_9.PlStuffType.Dict)]: helpers_5.GenerateGuardedTypeFunction("iter", [], function (self) {
            const keys = Object.keys(self.value);
            let index = 0;
            return stuff_9.NewPlStuff(stuff_9.PlStuffType.Dict, {
                next: stuff_9.NewPlStuff(stuff_9.PlStuffType.NFunc, {
                    parameters: [],
                    self: null,
                    name: "iter",
                    native: () => {
                        if (index >= keys.length) {
                            return stuff_9.NewPlStuff(stuff_9.PlStuffType.List, [stuff_9.PlStuffNull, stuff_9.PlStuffFalse]);
                        }
                        const key = keys[index++];
                        return stuff_9.NewPlStuff(stuff_9.PlStuffType.List, [
                            stuff_9.NewPlStuff(stuff_9.PlStuffType.List, [self.value[key], stuff_9.NewPlStuff(stuff_9.PlStuffType.Str, key)]),
                            stuff_9.PlStuffTrue
                        ]);
                    }
                })
            });
        }),
    };
    exports.jsDict = {
        [scrambler_6.ScrambleType("iter", stuff_9.PlStuffType.Dict)]: helpers_5.GenerateGuardedTypeFunction("iter", [], function (self) {
            const keys = Object.keys(self);
            let index = 0;
            return {
                next: () => {
                    if (index >= keys.length) {
                        return [null, false];
                    }
                    const key = keys[index++];
                    return [[self[key], key], true];
                }
            };
        }),
        [scrambler_6.ScrambleType("keys", stuff_9.PlStuffType.Dict)]: helpers_5.GenerateGuardedTypeFunction("keys", [], function (self) {
            return Object.keys(self);
        }),
        [scrambler_6.ScrambleType("values", stuff_9.PlStuffType.Dict)]: helpers_5.GenerateGuardedTypeFunction("values", [], function (self) {
            return Object.values(self);
        })
    };
});
define("vm/machine/native/special", ["require", "exports", "vm/machine/native/converter", "vm/machine/stuff", "vm/machine/native/helpers", "vm/machine/native/messeger", "inout/index"], function (require, exports, converter_5, stuff_10, helpers_6, messeger_6, inout_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.special = exports.jsSpecial = void 0;
    var PlToString = converter_5.PlConverter.PlToString;
    var VERSION = converter_5.PlConverter.VERSION;
    exports.jsSpecial = {
        "range": helpers_6.GenerateGuardedFunction("range", [stuff_10.PlStuffTypeRest], function (start, end, step) {
            if (start != undefined)
                helpers_6.AssertTypeof("range", start, "number", 1);
            if (end != undefined)
                helpers_6.AssertTypeof("range", end, "number", 2);
            if (step != undefined)
                helpers_6.AssertTypeof("range", step, "number", 3);
            if (arguments.length > 3) {
                throw new Error("'range' can only take a maximum of three arguments - start, end, step");
            }
            if (arguments.length == 2) {
                step = 1;
            }
            if (arguments.length == 1) {
                end = start;
                start = step = 1;
            }
            let forward = true;
            if (step < 0) {
                forward = false;
            }
            let current = start;
            return {
                iter: () => {
                    return {
                        next: () => {
                            if (forward ? current > end : current < end) {
                                return [[null, null], false];
                            }
                            const out = [[current, current], true];
                            current += step;
                            return out;
                        }
                    };
                }
            };
        }),
        "try": helpers_6.GenerateGuardedFunction("try", [stuff_10.PlStuffType.Func, stuff_10.PlStuffType.Func], function (attempt, error) {
            const saved = this.saveState();
            try {
                return attempt();
            }
            catch (e) {
                this.restoreState(saved);
                return error(this.problems.pop());
            }
        }),
    };
    exports.special = {
        "eval": helpers_6.GenerateGuardedFunction("eval", [stuff_10.PlStuffTypeAny], function (target) {
            let iter = null;
            if (target.type == stuff_10.PlStuffType.Dict
                && "iter" in target.value
                && (target.value.iter.type == stuff_10.PlStuffType.Func
                    || target.value.iter.type == stuff_10.PlStuffType.NFunc)) {
                iter = target.value.iter;
            }
            else {
                iter = this.findFunction("iter", target);
            }
            if (iter == null) {
                throw new Error(messeger_6.MakeNoTypeFunctionMessage("eval", "iter", target));
            }
            let iterator = this.runFunction(iter, [target]);
            const next = iterator.value.next;
            let out = [];
            let result;
            while ((result = this.runFunction(next, [])).value[1].value == true) {
                out.push(result.value[0].value[0]);
            }
            return stuff_10.NewPlStuff(stuff_10.PlStuffType.List, out);
        }),
        "ask": helpers_6.GenerateGuardedFunction("ask", [stuff_10.PlStuffTypeRest], function (...message) {
            const str = this.inout.input(message.map(m => PlToString(m, this)).join('\n'));
            if (str == null) {
                return stuff_10.PlStuffNull;
            }
            return stuff_10.NewPlStuff(stuff_10.PlStuffType.Str, str);
        }),
        "javascript": helpers_6.GenerateGuardedFunction("javascript", [stuff_10.PlStuffType.Str], function (code) {
            const _import = (function (key) {
                const value = this.findValue(key);
                if (value == null) {
                    return null;
                }
                return converter_5.PlConverter.PlToJs(value, this);
            }).bind(this);
            const _export = (function (key, value) {
                this.createValue(key, converter_5.PlConverter.JsToPl(value, this));
                return null;
            }).bind(this);
            try {
                this.inout.execute(code.value, {
                    pl: {
                        import: _import,
                        export: _export
                    }
                });
            }
            catch (e) {
                if (e == null) {
                    throw null;
                }
                throw new Error(`[Javascript ${e.name}] ${e.message}`);
            }
        }),
        "panic": helpers_6.GenerateGuardedFunction("panic", [stuff_10.PlStuffTypeRest], function (...message) {
            throw new Error(message.map(m => PlToString(m, this)).join(' '));
        }),
        "say": helpers_6.GenerateGuardedFunction("say", [stuff_10.PlStuffTypeRest], function (...message) {
            if (message.length == 0) {
                this.inout.print('\n');
            }
            else {
                const combined = message.map(mess => PlToString(mess, this)).join(' ');
                this.inout.print(combined);
            }
            return stuff_10.PlStuffNull;
        }),
        "log": helpers_6.GenerateGuardedFunction("log", [stuff_10.PlStuffTypeRest], function (...message) {
            if (message.length == 0) {
                console.log('\n');
            }
            else {
                const combined = message.map(mess => PlToString(mess, this)).join(' ');
                console.log(combined);
            }
            return stuff_10.PlStuffNull;
        })
    };
    function sanitizeOptions(options) {
        const method = 'method' in options ? options["method"] : 'GET';
        const headers = 'headers' in options ? options["headers"] : {};
        const body = 'body' in options ? options["body"] : null;
        return {
            method,
            headers,
            body
        };
    }
    function callbackFetch(fetch) {
        return function (url, options, callback) {
            let d;
            fetch(url, options)
                .then(data => {
                d = data;
                return data.text();
            })
                .then(text => {
                callback(null, {
                    text,
                    ok: d.ok,
                    status: d.status,
                });
            })
                .catch(err => {
                callback(null, {
                    text: err.message,
                    ok: false,
                    status: err.status ? err.status : '404'
                });
            });
        };
    }
    if (inout_3.isNode) {
        const deasync = require('deasync');
        const fetch = require('node-fetch');
        const syncFetch = deasync(callbackFetch(fetch));
        exports.jsSpecial['fetch'] = helpers_6.GenerateGuardedFunction('fetch', [stuff_10.PlStuffType.Str, stuff_10.PlStuffType.Dict], function (url, options) {
            const opt = sanitizeOptions(options);
            return syncFetch(url, opt);
        });
        const path = require('path');
        const fs = require('fs');
        const cp = require('child_process');
        exports.jsSpecial['$'] = helpers_6.GenerateGuardedFunction("$", [stuff_10.PlStuffType.Str, stuff_10.PlStuffType.Dict], function (command, rel) {
            const targetPath = path.join(this.inout.paths.rootPath, rel);
            if (!fs.existsSync(targetPath)) {
                return {
                    text: `the target path '${targetPath}' does not exist`,
                    ok: false
                };
            }
            try {
                cp.execSync(command, {
                    stdio: 'inherit',
                    cwd: targetPath
                });
                return {
                    text: "",
                    ok: true,
                };
            }
            catch (e) {
                return {
                    text: e.toString(),
                    ok: false
                };
            }
        });
        exports.jsSpecial['exec'] = helpers_6.GenerateGuardedFunction("exec", [stuff_10.PlStuffType.Str, stuff_10.PlStuffType.Dict], function (command, rel) {
            const targetPath = path.join(this.inout.paths.rootPath, rel);
            if (!fs.existsSync(targetPath)) {
                return {
                    text: `the target path '${targetPath}' does not exist`,
                    ok: false
                };
            }
            try {
                const out = cp.execSync(command, {
                    stdio: [0, 'pipe', 'pipe'],
                    cwd: targetPath
                }).toString();
                return {
                    text: out,
                    ok: true,
                };
            }
            catch (e) {
                return {
                    text: e.toString(),
                    ok: false
                };
            }
        });
        exports.jsSpecial["require"] = helpers_6.GenerateGuardedFunction("require", [stuff_10.PlStuffType.Str], function (p) {
            try {
                if (/^\w+$/.test(p)) {
                    return {
                        ok: true,
                        data: require(p),
                    };
                }
                return {
                    ok: true,
                    data: require(path.join(this.inout.paths.rootPath, p)),
                };
            }
            catch (e) {
                return {
                    ok: false,
                    data: `cannot import js file '${p}'`
                };
            }
        });
        exports.jsSpecial['sleep'] = helpers_6.GenerateGuardedFunction("sleep", [stuff_10.PlStuffType.Num], (duration) => {
            deasync((callback) => {
                setTimeout(() => {
                    callback();
                }, duration * 1000);
            })();
            return null;
        });
    }
    else {
        exports.jsSpecial['sleep'] = helpers_6.GenerateGuardedFunction('sleep', [stuff_10.PlStuffType.Num], (duration) => {
            const syncWait = ms => {
                const end = Date.now() + ms;
                while (Date.now() < end)
                    continue;
            };
            syncWait(duration * 1000);
        });
        exports.jsSpecial['fetch'] = helpers_6.GenerateGuardedFunction('fetch', [stuff_10.PlStuffType.Str, stuff_10.PlStuffTypeRest], function (url, options) {
            const opt = sanitizeOptions(options ? options : {});
            const request = new XMLHttpRequest();
            request.open(opt.method, url, false);
            for (const [key, value] of Object.entries(opt.headers)) {
                request.setRequestHeader(key, value);
            }
            request.send(opt.body);
            return {
                ok: Math.floor(request.status / 100) === 2,
                status: request.status,
                text: request.responseText
            };
        });
        function nf(fn) {
            return stuff_10.NewPlStuff(stuff_10.PlStuffType.NFunc, fn);
        }
        function makeElement(items, selector, sm) {
            let result = items;
            function toPl(any) {
                return converter_5.PlConverter.JsToPl(any, sm);
            }
            let self = stuff_10.NewPlStuff(stuff_10.PlStuffType.Dict, {
                selector: selector,
                new: helpers_6.GenerateGuardedFunction("new", [], () => {
                    result = [document.createElement(selector)];
                    return self;
                }),
                attach: helpers_6.GenerateGuardedFunction("attach", [stuff_10.PlStuffType.Dict], function (node) {
                    const nf = node.value['#raw'];
                    if (!nf) {
                        throw new Error('cannot attach a none-node type');
                    }
                    const other = nf.value.get();
                    result[0].appendChild(other.result[0]);
                    return self;
                }),
                detach: helpers_6.GenerateGuardedFunction("detach", [stuff_10.PlStuffType.Dict], (node) => {
                    const nf = node.value['#raw'];
                    if (!nf) {
                        throw new Error('cannot detach a none-node type');
                    }
                    const other = nf.value.get();
                    result[0].removeChild(other.result[0]);
                    return self;
                }),
                clear: helpers_6.GenerateGuardedFunction("clear", [], () => {
                    while (result[0].firstChild) {
                        result[0].firstChild.remove();
                    }
                    return self;
                }),
                setStyle: helpers_6.GenerateGuardedFunction("setStyle", [stuff_10.PlStuffType.Str, stuff_10.PlStuffType.Str], (attr, text) => {
                    result[0].style[attr.value] = text.value;
                    return self;
                }),
                removeStyle: helpers_6.GenerateGuardedFunction("removeStyle", [stuff_10.PlStuffType.Str], (attr) => {
                    result[0].style[attr.value] = null;
                    return self;
                }),
                class: helpers_6.GenerateGuardedFunction("class", [], () => {
                    return stuff_10.NewPlStuff(stuff_10.PlStuffType.Str, result[0].className);
                }),
                setClass: helpers_6.GenerateGuardedFunction("setClass", [stuff_10.PlStuffType.Str], (newClass) => {
                    result[0].className = newClass.value;
                    return self;
                }),
                id: helpers_6.GenerateGuardedFunction("id", [], () => {
                    return stuff_10.NewPlStuff(stuff_10.PlStuffType.Str, result[0].id);
                }),
                setId: helpers_6.GenerateGuardedFunction("setId", [stuff_10.PlStuffType.Str], (newId) => {
                    result[0].id = newId.value;
                    return self;
                }),
                any: helpers_6.GenerateGuardedFunction("any", [], () => result.length > 0 ? stuff_10.PlStuffTrue : stuff_10.PlStuffFalse),
                size: helpers_6.GenerateGuardedFunction("size", [], () => stuff_10.NewPlStuff(stuff_10.PlStuffType.Num, result.length)),
                all: helpers_6.GenerateGuardedFunction("all", [], function () {
                    return stuff_10.NewPlStuff(stuff_10.PlStuffType.List, result.map(r => makeElement([r], selector, sm)));
                }),
                text: helpers_6.GenerateGuardedFunction("text", [], function () {
                    return toPl(result[0].innerText);
                }),
                setText: helpers_6.GenerateGuardedFunction("setText", [stuff_10.PlStuffType.Str], function (text) {
                    result[0].innerText = text.value;
                    return self;
                }),
                html: helpers_6.GenerateGuardedFunction("text", [], function () {
                    return toPl(result[0].innerHTML);
                }),
                setHtml: helpers_6.GenerateGuardedFunction("setHTML", [stuff_10.PlStuffType.Str], function (text) {
                    result[0].innerHTML = text.value;
                    return self;
                }),
                key: helpers_6.GenerateGuardedFunction("key", [stuff_10.PlStuffType.Str], function (attr) {
                    return toPl(result[0][attr.value]);
                }),
                setKey: helpers_6.GenerateGuardedFunction("setKey", [stuff_10.PlStuffType.Str, stuff_10.PlStuffTypeAny], function (attr, value) {
                    result[0][attr.value] = value.value;
                    return self;
                }),
                attr: helpers_6.GenerateGuardedFunction("attr", [stuff_10.PlStuffType.Str], function (attr) {
                    return toPl(result[0].getAttribute(attr.value));
                }),
                setAttr: helpers_6.GenerateGuardedFunction("setAttr", [stuff_10.PlStuffType.Str, stuff_10.PlStuffTypeAny], function (attr, value) {
                    result[0].setAttribute(attr.value, value.value);
                    return self;
                }),
                listen: helpers_6.GenerateGuardedFunction("listen", [stuff_10.PlStuffType.Str, stuff_10.PlStuffType.Func], function (event, callback) {
                    for (const node of result) {
                        node.addEventListener(event.value, (event) => {
                            const e = {
                                preventDefault: () => event.preventDefault(),
                                "#raw": {
                                    _version: VERSION,
                                    type: "Raw",
                                    value: event
                                },
                            };
                            if (event.currentTarget) {
                                e.location = {
                                    x: event.clientX - event.currentTarget.getBoundingClientRect().left,
                                    y: event.clientY - event.currentTarget.getBoundingClientRect().top,
                                };
                            }
                            if (event.key) {
                                e.key = event.key;
                            }
                            converter_5.PlConverter.PlToJs(callback, sm)(e);
                        });
                    }
                    return self;
                }),
                children: helpers_6.GenerateGuardedFunction("children", [], () => {
                    const out = [];
                    for (const child of result[0].children) {
                        out.push(makeElement([child], '', sm));
                    }
                    return stuff_10.NewPlStuff(stuff_10.PlStuffType.List, out);
                }),
                remove: helpers_6.GenerateGuardedFunction("remove", [stuff_10.PlStuffType.Num], (index) => {
                    const idx = index.value - 1;
                    result[0].removeChild(result[0].children[idx]);
                    return self;
                }),
                insert: helpers_6.GenerateGuardedFunction("insert", [stuff_10.PlStuffType.Num, stuff_10.PlStuffTypeAny], (index, node) => {
                    const nf = node.value['#raw'];
                    if (!nf) {
                        throw new Error('cannot detach a none-node type');
                    }
                    const idx = index.value - 1;
                    if (idx == result[0].children.length) {
                        return self.value["attach"].value.native(node);
                    }
                    const other = nf.value.get();
                    result[0].insertBefore(other.result[0], result[0].children[idx]);
                    return self;
                }),
                $: helpers_6.GenerateGuardedFunction("$", [stuff_10.PlStuffType.Str], (selector) => {
                    return makeElement(Array.from(result[0].querySelectorAll(selector.value)), selector.value, sm);
                }),
                parent: helpers_6.GenerateGuardedFunction("parent", [], () => {
                    return makeElement([result[0].parentElement], selector + ":parent", sm);
                })
            });
            for (const key of Object.keys(self.value)) {
                self.value[key] = nf(self.value[key]);
            }
            self.value["#raw"] = stuff_10.NewPlStuff(stuff_10.PlStuffType.Raw, {
                get() {
                    return {
                        result,
                    };
                }
            });
            return self;
        }
        exports.special["$"] = helpers_6.GenerateGuardedFunction("$", [stuff_10.PlStuffType.Str], function (selector) {
            const sm = this;
            return makeElement(Array.from(document.querySelectorAll(selector.value)), selector.value, sm);
        });
    }
});
define("vm/machine/native/modules/maths", ["require", "exports", "vm/machine/native/helpers", "vm/machine/stuff"], function (require, exports, helpers_7, stuff_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.maths = void 0;
    function generateBindings(target, converter) {
        const out = {};
        for (const [key, entry] of Object.entries(converter)) {
            if (typeof target[entry] == "function") {
                out[key] = helpers_7.GenerateGuardedFunction(key, [stuff_11.PlStuffType.Num], target[entry]);
            }
            else {
                out[key] = target[entry];
            }
        }
        return out;
    }
    exports.maths = {
        maths: generateBindings(Math, {
            sin: "sin",
            cos: "cos",
            tan: "tan",
            log2: "log2",
            ln: "log",
            exp: "exp",
            pi: "PI",
            e: "E",
        })
    };
});
define("vm/machine/native/impl/num", ["require", "exports", "vm/machine/scrambler", "vm/machine/stuff", "vm/machine/native/helpers"], function (require, exports, scrambler_7, stuff_12, helpers_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.jsNum = void 0;
    exports.jsNum = {
        [scrambler_7.ScrambleType("abs", stuff_12.PlStuffType.Num)]: helpers_8.GenerateGuardedTypeFunction("abs", [], function (self) {
            if (self < 0)
                return -self;
            return self;
        }),
        [scrambler_7.ScrambleType("floor", stuff_12.PlStuffType.Num)]: helpers_8.GenerateGuardedTypeFunction("floor", [], function (self) {
            return Math.floor(self);
        }),
        [scrambler_7.ScrambleType("ceil", stuff_12.PlStuffType.Num)]: helpers_8.GenerateGuardedTypeFunction("ceil", [], function (self) {
            return Math.ceil(self);
        }),
        [scrambler_7.ScrambleType("int", stuff_12.PlStuffType.Num)]: helpers_8.GenerateGuardedTypeFunction("int", [stuff_12.PlStuffType.Num], function (self, threshold) {
            if ((self - Math.floor(self)) > threshold) {
                return Math.ceil(self);
            }
            return Math.floor(self);
        }),
        [scrambler_7.ScrambleType("round", stuff_12.PlStuffType.Num)]: helpers_8.GenerateGuardedTypeFunction("round", [stuff_12.PlStuffType.Num], function (self, precision) {
            return Number.parseFloat(self).toPrecision(precision);
        }),
        [scrambler_7.ScrambleType("pow", stuff_12.PlStuffType.Num)]: helpers_8.GenerateGuardedTypeFunction("pow", [stuff_12.PlStuffType.Num], function (base, power) {
            return Math.pow(base, power);
        }),
    };
});
define("vm/machine/native/modules/time", ["require", "exports", "vm/machine/native/helpers", "vm/machine/stuff"], function (require, exports, helpers_9, stuff_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.time = void 0;
    exports.time = {
        time: {
            now: helpers_9.GenerateGuardedFunction("now", [], () => {
                return (new Date()).getTime();
            }),
            measure: helpers_9.GenerateGuardedFunction("measure", [stuff_13.PlStuffType.Func], (closure) => {
                const start = (new Date()).getTime();
                closure();
                return (new Date()).getTime() - start;
            }),
            benchmark: helpers_9.GenerateGuardedFunction("benchmark", [stuff_13.PlStuffType.Num, stuff_13.PlStuffType.Func], (amount, closure) => {
                const trial = [];
                for (let i = 0; i < amount; i++) {
                    const start = (new Date()).getTime();
                    closure();
                    trial.push((new Date()).getTime() - start);
                }
                return trial;
            })
        }
    };
});
define("vm/machine/native/modules/random", ["require", "exports", "vm/machine/native/helpers", "vm/machine/stuff"], function (require, exports, helpers_10, stuff_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.random = void 0;
    function randomNumber(lower, upper) {
        if (lower != null) {
            helpers_10.AssertTypeof("number", lower, "number", 1);
        }
        if (upper != null) {
            helpers_10.AssertTypeof("number", upper, "number", 2);
        }
        if (lower == null && upper == null) {
            lower = 1;
            upper = 100;
        }
        else if (upper == null) {
            upper = lower;
            lower = 1;
        }
        else if (lower == null) {
            lower = 1;
        }
        return Math.floor(Math.random() * (upper - lower + 1) + lower);
    }
    exports.random = {
        random: {
            number: helpers_10.GenerateGuardedFunction("number", [stuff_14.PlStuffTypeRest], randomNumber),
            list: helpers_10.GenerateGuardedFunction("list", [stuff_14.PlStuffType.Num, stuff_14.PlStuffType.Num, stuff_14.PlStuffType.Num], function (lower, upper, n) {
                let out = [];
                for (let i = 0; i < n; i++) {
                    out.push(randomNumber(lower, upper));
                }
                return out;
            })
        }
    };
});
define("vm/emitter/printer", ["require", "exports", "vm/emitter/bytecode", "vm/emitter/debug"], function (require, exports, bytecode_2, debug_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlProgramToString = void 0;
    function PlProgramToString(program, debug = program.debug.length > 0) {
        let bytecodes = program.program.map(b => bytecode_2.BytecodeToString(b));
        if (debug) {
            let max = Number.MIN_VALUE;
            bytecodes.forEach(bc => {
                let length = bc.length;
                if (length > max)
                    max = length;
            });
            bytecodes = bytecodes.map(bc => {
                return bc + ' '.repeat(max - bc.length) + ' #';
            });
            for (const debug of program.debug) {
                const { endLine, length } = debug;
                const startLine = endLine - length;
                let max = Number.MIN_VALUE;
                for (let i = 0; i < length; ++i) {
                    let length = bytecodes[startLine + i].length;
                    if (length > max)
                        max = length;
                }
                const append = ` + ${debug_2.PlDebugToString(debug)} `;
                const remain = ' |' + ' '.repeat(append.length - 2);
                bytecodes[startLine] += ' '.repeat(max - bytecodes[startLine].length) + append;
                for (let i = 1; i < length; ++i) {
                    let length = bytecodes[startLine + i].length;
                    bytecodes[startLine + i] += ' '.repeat(max - length) + remain;
                }
            }
        }
        return bytecodes.join('\n');
    }
    exports.PlProgramToString = PlProgramToString;
});
define("problem/interactive/index", ["require", "exports", "inout/index"], function (require, exports, inout_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IACTSync = exports.IACTPrepare = void 0;
    function IACTPrepare() {
        if (!inout_4.isNode) {
            return false;
        }
        try {
            require('blessed');
            return true;
        }
        catch (e) {
            return false;
        }
    }
    exports.IACTPrepare = IACTPrepare;
    function IACTSync(fn) {
        const deasync = require('deasync');
        return deasync(function (callback) {
            fn
                .then(res => {
                callback(res);
            })
                .catch(err => {
                callback(err);
            });
        })();
    }
    exports.IACTSync = IACTSync;
});
define("problem/interactive/debugger", ["require", "exports", "vm/machine/native/converter", "extension/text", "vm/emitter/index", "vm/machine/scrambler", "vm/machine/stuff", "vm/emitter/bytecode", "inout/file", "compiler/parsing/index", "compiler/lexing/index"], function (require, exports, converter_6, text_7, emitter_2, scrambler_8, stuff_15, bytecode_3, file_1, parsing_1, lexing_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IACTDebugger = void 0;
    var PlToString = converter_6.PlConverter.PlToString;
    var PlToDebugString = converter_6.PlConverter.PlToDebugString;
    let isDebugging = false;
    function IACTDebugger(machine) {
        return __awaiter(this, void 0, void 0, function* () {
            machine.stack.push(null);
            if (isDebugging) {
                return Promise.resolve(null);
            }
            isDebugging = true;
            const blessed = require('blessed');
            const isWindows = process.platform == "win32";
            const FOCUSED = '{yellow-fg}[F]{/}';
            const addFocus = (text) => {
                if (text.startsWith(FOCUSED))
                    return text;
                return `${FOCUSED} ${text}`;
            };
            const removeFocus = (text) => {
                if (!text.startsWith(FOCUSED))
                    return text;
                return text.substring(FOCUSED.length + 1);
            };
            let palette = {
                selected: {
                    bg: 'grey',
                    fg: 'white',
                },
                scrollbar: {
                    bg: 'grey',
                }
            };
            if (isWindows) {
                palette = {
                    selected: {
                        bg: 'cyan',
                        fg: 'white',
                    },
                    scrollbar: {
                        bg: 'cyan',
                    }
                };
            }
            return new Promise(resolve => {
                const screen = blessed.screen({
                    smartCSR: true,
                    title: "Interactive Debugger",
                });
                const headerBox = blessed.box({
                    parent: screen,
                    top: 0,
                    left: 0,
                    tags: true,
                    content: "{bold}Interactive Debugger{/bold} Press 'Ctrl-C' or 'q' to exit\nPress 'Up' and 'Down' to choose the callframes and locals, press 'Enter' to select",
                    shrink: true,
                });
                if (isWindows) {
                    headerBox.setContent(headerBox.getContent() + "\n[F] shows the focused panel, press 'Tab' to switch panels");
                }
                else {
                    headerBox.setContent(headerBox.getContent() + "\nClick on a panel to focus it");
                }
                const headerHeight = headerBox.content.split('\n').length;
                const debugBox = blessed.box({
                    parent: screen,
                    top: headerHeight,
                    left: 0,
                    height: 3,
                    label: "{bold}Functions{/}",
                    border: 'line',
                    tags: true,
                    padding: {
                        left: 1,
                        right: 1,
                    }
                });
                const stepNextButton = blessed.button({
                    parent: debugBox,
                    content: "Step [N]",
                    height: 1,
                    top: 0,
                    left: 0,
                    mouse: true,
                    shrink: true,
                    style: {
                        fg: 'green',
                        focus: {
                            fg: 'white'
                        }
                    }
                });
                let line = machine.pointer;
                let currentLineDebug = null;
                for (const debug of machine.program.debug) {
                    if (line <= debug.endLine && line >= (debug.endLine - debug.length)) {
                        if (currentLineDebug == null)
                            currentLineDebug = debug;
                        else {
                            if (currentLineDebug.length > debug.length)
                                currentLineDebug = debug;
                        }
                    }
                }
                const stepNext = function () {
                    const program = machine.program.program;
                    if (program[machine.pointer].type == bytecode_3.PlBytecodeType.DORETN)
                        return;
                    const oldLine = currentLineDebug.span.info.row;
                    let surround = 0;
                    let lastState = machine.saveState();
                    let first = true;
                    const out = machine.runProgram(machine.pointer, (lastPointer, thisPointer) => {
                        if (first) {
                            first = false;
                            return false;
                        }
                        const lastByte = program[lastPointer];
                        if (lastByte.type == bytecode_3.PlBytecodeType.DOCALL) {
                            const fn = lastState.stack[lastState.stack.length - 1];
                            if (fn && fn.type == stuff_15.PlStuffType.Func) {
                                surround += 1;
                            }
                        }
                        const thisByte = program[thisPointer];
                        if ([bytecode_3.PlBytecodeType.JMPREL, bytecode_3.PlBytecodeType.STKEXT, bytecode_3.PlBytecodeType.STKENT].includes(thisByte.type)) {
                            return false;
                        }
                        if (lastByte.type == bytecode_3.PlBytecodeType.DORETN) {
                            if (surround > 0)
                                surround -= 1;
                        }
                        else if (lastByte.type == bytecode_3.PlBytecodeType.STKPOP || lastByte.type == bytecode_3.PlBytecodeType.JMPICF) {
                            if (surround <= 0) {
                                let found = null;
                                for (const debug of machine.program.debug) {
                                    if (thisPointer <= debug.endLine && (debug.endLine - debug.length) <= thisPointer) {
                                        if (debug.span.info.row != oldLine) {
                                            if (found == null) {
                                                found = debug;
                                            }
                                            else if (debug.length < found.length) {
                                                found = debug;
                                            }
                                            break;
                                        }
                                    }
                                }
                                if (found && found.name != "ASTCondition" && found.span.info.filename.length > 0) {
                                    currentLineDebug = found;
                                    line = thisPointer;
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                        lastState = machine.saveState();
                        return false;
                    });
                    if (machine.problems.length != 0) {
                        cleanup();
                        throw null;
                    }
                    if (out != null) {
                        if (typeof out.value == "number")
                            return cleanup(out.value);
                        return cleanup(0);
                    }
                    updateContents();
                    updateFrames();
                    updateLocals();
                };
                stepNextButton.on('press', stepNext);
                screen.key(['n'], stepNext);
                const stepIntoButton = blessed.button({
                    parent: debugBox,
                    content: "Step Into [M]",
                    height: 1,
                    top: 0,
                    left: stepNextButton.content.length + 2,
                    mouse: true,
                    shrink: true,
                    style: {
                        fg: 'green',
                        focus: {
                            fg: 'white'
                        }
                    }
                });
                const stepInto = function () {
                    const program = machine.program.program;
                    if (program[machine.pointer].type == bytecode_3.PlBytecodeType.DORETN)
                        return;
                    const oldLine = currentLineDebug.span.info.row;
                    let surround = 0;
                    let lastState = machine.saveState();
                    let first = true;
                    const out = machine.runProgram(machine.pointer, (lastPointer, thisPointer) => {
                        if (first) {
                            first = false;
                            return false;
                        }
                        const lastByte = program[lastPointer];
                        const thisByte = program[thisPointer];
                        if ([bytecode_3.PlBytecodeType.JMPREL, bytecode_3.PlBytecodeType.STKEXT, bytecode_3.PlBytecodeType.STKENT].includes(thisByte.type)) {
                            return false;
                        }
                        if (lastByte.type == bytecode_3.PlBytecodeType.STKPOP || lastByte.type == bytecode_3.PlBytecodeType.JMPICF) {
                            if (surround <= 0) {
                                let found = null;
                                for (const debug of machine.program.debug) {
                                    if (thisPointer <= debug.endLine && (debug.endLine - debug.length) <= thisPointer) {
                                        if (debug.span.info.row != oldLine) {
                                            if (found == null) {
                                                found = debug;
                                            }
                                            else if (debug.length < found.length) {
                                                found = debug;
                                            }
                                            break;
                                        }
                                    }
                                }
                                if (found && found.name != "ASTCondition" && found.span.info.filename.length > 0) {
                                    currentLineDebug = found;
                                    line = thisPointer;
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                        lastState = machine.saveState();
                        return false;
                    });
                    if (machine.problems.length != 0) {
                        cleanup();
                        throw null;
                    }
                    if (out != null) {
                        if (typeof out.value == "number")
                            return cleanup(out.value);
                        return cleanup(0);
                    }
                    updateContents();
                    updateFrames();
                    updateLocals();
                };
                stepIntoButton.on('press', stepInto);
                screen.key(['m'], stepInto);
                const contentHeight = `100%-${headerHeight + 3}`;
                const contentLabel = `"${machine.file.filename}"`;
                const contentBox = blessed.box({
                    parent: screen,
                    bottom: 0,
                    left: 0,
                    tags: true,
                    keys: true,
                    scrollable: true,
                    alwaysScroll: true,
                    scrollbar: {
                        style: Object.assign({}, palette.scrollbar)
                    },
                    label: contentLabel,
                    width: '75%',
                    height: contentHeight,
                    border: 'line',
                    padding: {
                        left: 1,
                        right: 1,
                    },
                    style: {
                        focus: {
                            scrollbar: {
                                bg: 'white'
                            }
                        }
                    }
                });
                contentBox.data.label = contentLabel;
                const updateContents = function () {
                    const fileContent = machine.file.content.split('\n');
                    const margin = ('' + (fileContent.length)).length;
                    const text = fileContent.map((line, index) => {
                        index += 1;
                        const prefix = `${' '.repeat(margin - ('' + index).length)}${index}`;
                        const newLine = `${prefix}|  ${line}`;
                        if (currentLineDebug.span.info.row + 1 == index) {
                            return `{red-bg}{white-fg}${newLine}{/white-fg}{/red-bg}`;
                        }
                        return newLine;
                    }).join('\n');
                    contentBox.setContent(text);
                    contentBox.setScroll(currentLineDebug.span.info.row - 1);
                    screen.render();
                };
                updateContents();
                const infoContainer = blessed.box({
                    parent: screen,
                    bottom: 0,
                    left: '75%',
                    tags: true,
                    width: '25%',
                    height: contentHeight,
                });
                const frameLabel = '{bold}Callframes{/bold}';
                const frameContainer = blessed.box({
                    parent: infoContainer,
                    label: frameLabel,
                    tags: true,
                    height: '35%',
                    border: 'line',
                    padding: {
                        left: 1,
                        right: 1,
                    }
                });
                frameContainer.data.label = frameLabel;
                const frameList = blessed.list({
                    parent: frameContainer,
                    top: 0,
                    left: 0,
                    height: '100%-2',
                    scrollable: true,
                    alwaysScroll: true,
                    scrollbar: {
                        style: Object.assign({}, palette.scrollbar)
                    },
                    style: {
                        focus: {
                            scrollbar: {
                                bg: 'white'
                            }
                        },
                        selected: Object.assign({}, palette.selected)
                    },
                    keys: true,
                    tags: true,
                });
                let selectedFrame;
                let frames;
                const updateFrames = function () {
                    frameList.clearItems();
                    const framesText = [];
                    frames = machine.getFrames();
                    frames.reverse();
                    for (const frame of frames) {
                        if (frame.trace) {
                            if (frame.trace.info == null) {
                                framesText.push(`'${frame.trace.name}'`);
                            }
                            else {
                                framesText.push(`'${frame.trace.name}' at line ${frame.trace.info.row + 1}`);
                            }
                        }
                        else {
                            framesText.push(`|frame|`);
                        }
                    }
                    frameList.setItems(framesText);
                    frameList.select(frames.length - 1);
                    selectedFrame = frames[frames.length - 1];
                    screen.render();
                };
                frameList.on('select', function (item, index) {
                    selectedFrame = frames[index];
                    updateLocals();
                });
                updateFrames();
                const localsLabel = "{bold}Locals{/bold}";
                const localsContainer = blessed.text({
                    parent: infoContainer,
                    height: '65%+1',
                    top: '35%',
                    left: 0,
                    label: localsLabel,
                    tags: true,
                    border: "line",
                    padding: {
                        left: 1,
                        right: 1,
                    },
                });
                localsContainer.data.label = localsLabel;
                const localsBox = blessed.list({
                    parent: localsContainer,
                    height: '100%-2',
                    top: 0,
                    left: 0,
                    scrollable: true,
                    alwaysScroll: true,
                    tags: true,
                    scrollbar: {
                        style: Object.assign({}, palette.scrollbar)
                    },
                    style: {
                        focus: {
                            scrollbar: {
                                bg: 'white'
                            }
                        },
                        selected: Object.assign({}, palette.selected)
                    },
                    keys: true,
                });
                const additional = blessed.text({
                    parent: localsContainer,
                    bottom: 0,
                    height: 1,
                });
                additional.hide();
                let items = {};
                const updateLocals = () => {
                    let newLabel = `${localsLabel} of '|frame|'`;
                    if (selectedFrame.trace) {
                        newLabel = `${localsLabel} of '${selectedFrame.trace.name}'`;
                    }
                    localsContainer.setLabel(newLabel);
                    localsContainer.data.label = newLabel;
                    const localsBuffer = [];
                    const frame = selectedFrame;
                    items = {};
                    let std = 0;
                    for (const [key, value] of Object.entries(frame.values)) {
                        if (machine.standard.includes(key)) {
                            std++;
                            continue;
                        }
                        items[key] = value;
                        const v = text_7.dddString(converter_6.PlConverter.PlToString(value, machine, true), contentBox.width - key.length - 6);
                        if (key.includes(emitter_2.METHOD_SEP)) {
                            const total = scrambler_8.UnscrambleFunction(key);
                            if (total[1].length == 0) {
                                localsBuffer.push(`{yellow-fg}[H]{/} {cyan-fg}${stuff_15.PlStuffTypeToString(value.type)}{/cyan-fg} ${total[0]}: ${v}`);
                            }
                            else {
                                localsBuffer.push(`{cyan-fg}${total[0]}{/cyan-fg}.${total[1]}: ${v}`);
                            }
                            continue;
                        }
                        localsBuffer.push(`{cyan-fg}${stuff_15.PlStuffTypeToString(value.type)}{/cyan-fg} ${key}: ${v}`);
                    }
                    if (std > 0) {
                        additional.setContent(`... and ${std} standard values`);
                        additional.show();
                        localsBox.height = '100%-3';
                    }
                    else {
                        additional.hide();
                        localsBox.height = '100%-2';
                    }
                    localsBox.setItems(localsBuffer);
                    localsBox.select(0);
                    screen.render();
                };
                localsBox.on('select', function (_, index) {
                    detailed.content = detailedHeader + '\nLoading...';
                    detailed.show();
                    const item = Object.values(items)[index];
                    const key = Object.keys(items)[index];
                    const json = text_7.shallowJSON(item.value);
                    const contentBuffer = [detailedHeader];
                    contentBuffer.push(`Name: '${key}'`);
                    contentBuffer.push(`Type: {cyan-fg}${stuff_15.PlStuffGetType(item)}{/}`);
                    contentBuffer.push(`Str(${key}): {green-fg}${PlToString(item, machine, true)}{/}`);
                    contentBuffer.push(`Debug: {red-fg}${PlToDebugString(item)}{/}`);
                    contentBuffer.push(`Internals: {yellow-fg}${json}{/}`);
                    detailed.content = contentBuffer.join('\n');
                    detailed.focus();
                    detailed.render();
                });
                updateLocals();
                const evalButton = blessed.button({
                    parent: debugBox,
                    height: 1,
                    left: stepNextButton.content.length + stepIntoButton.content.length + 4,
                    top: 0,
                    content: "Eval [E]",
                    shrink: true,
                    mouse: true,
                    style: {
                        fg: 'green',
                        focus: {
                            fg: 'white'
                        }
                    }
                });
                const evalAlert = blessed.box({
                    parent: screen,
                    tags: true,
                    top: '25%',
                    left: '25%',
                    width: '50%',
                    height: '75%',
                    border: 'line',
                    draggable: true,
                    padding: {
                        left: 1,
                        right: 1,
                    }
                });
                evalAlert.key(['escape', 'x'], function () {
                    evalAlert.hide();
                });
                evalAlert.hide();
                const evalHeader = blessed.text({
                    parent: evalAlert,
                    content: "{bold}Eval{/}{|}('esc' or 'x' to close)",
                    tags: true,
                    top: 0,
                    left: 0,
                    height: 1,
                    shrink: true,
                });
                const openEval = function () {
                    evalOutput.setContent('');
                    evalOutput.hide();
                    evalOutput.show();
                    evalAlert.show();
                    evalInput.focus();
                    evalAlert.render();
                };
                evalButton.on('click', openEval);
                screen.key(['e'], openEval);
                const evalInput = blessed.textbox({
                    parent: evalAlert,
                    inputOnFocus: true,
                    top: 1,
                    left: 0,
                    height: 3,
                    border: 'line',
                    padding: {
                        left: 1,
                        right: 1,
                    }
                });
                evalInput.key(['escape'], () => evalAlert.focus());
                const evalOutput = blessed.box({
                    parent: evalAlert,
                    top: 4,
                    left: 0,
                    border: 'line',
                    height: '100%-6',
                    tags: true,
                    label: "{bold}Output{/}",
                    padding: {
                        left: 1,
                        right: 1,
                    }
                });
                evalInput.on('submit', function () {
                    const value = evalInput.value;
                    evalInput.clearValue();
                    const file = file_1.NewPlFile("debugger", value);
                    const lexer = new lexing_1.default(file);
                    const parser = new parsing_1.PlAstParser(lexer);
                    const ast = parser.parseAll();
                    if (ast == null) {
                        evalOutput.setContent('{red-fg}failed to parse input{/}');
                        evalOutput.hide();
                        evalOutput.show();
                        evalInput.focus();
                        evalOutput.render();
                        return;
                    }
                    const startPointer = machine.program.program.length;
                    const program = emitter_2.EmitProgram(ast, false);
                    program.program.pop();
                    program.debug = [];
                    machine.addProgram(program);
                    const oldPointer = machine.pointer;
                    machine.runProgram(startPointer);
                    machine.pointer = oldPointer;
                    if (machine.problems.length > 0) {
                        evalOutput.setContent('{red-fg}failed to interpret input{/}');
                        machine.problems = [];
                        evalOutput.hide();
                        evalOutput.show();
                        evalInput.focus();
                        evalOutput.render();
                        return;
                    }
                    const out = machine.stack.pop();
                    const json = text_7.shallowJSON(out.value);
                    const contentBuffer = [];
                    contentBuffer.push(`Type: {cyan-fg}${stuff_15.PlStuffGetType(out)}{/}`);
                    contentBuffer.push(`Str(input): {green-fg}${PlToString(out, machine, true)}{/}`);
                    contentBuffer.push(`Debug: {red-fg}${PlToDebugString(out)}{/}`);
                    contentBuffer.push(`Internals: {yellow-fg}${json}{/}`);
                    evalOutput.content = contentBuffer.join('\n');
                    evalOutput.hide();
                    evalOutput.show();
                    evalInput.focus();
                    evalOutput.render();
                });
                const detailedHeader = "{bold}Detailed View{/}{|}('ESC' or 'x' to close)";
                const detailed = blessed.box({
                    parent: screen,
                    top: '25%',
                    left: '25%',
                    width: '50%',
                    shrink: true,
                    border: 'line',
                    draggable: true,
                    tags: true,
                    padding: {
                        left: 1,
                        right: 1,
                    }
                });
                detailed.key(['escape', 'x'], function () {
                    detailed.hide();
                });
                detailed.hide();
                contentBox.on('click', () => contentBox.focus());
                frameList.on('click', () => frameList.focus());
                localsBox.on('click', () => localsBox.focus());
                const elements = [contentBox, frameContainer, localsContainer];
                let index = 0;
                const maxIndex = elements.length - 1;
                elements.forEach(function (box, i) {
                    box.on('click', function () {
                        const oldElement = elements[index];
                        oldElement.setLabel(removeFocus(oldElement.data.label));
                        oldElement.data.label = removeFocus(oldElement.data.label);
                        index = i;
                        screen.render();
                    });
                });
                screen.key(['tab'], function () {
                    const oldElement = elements[index];
                    if (index == maxIndex) {
                        index = 0;
                    }
                    else {
                        index += 1;
                    }
                    const newElement = elements[index];
                    newElement.focus();
                    if (newElement.children.length > 1) {
                        newElement.children[1].focus();
                    }
                    newElement.setLabel(addFocus(newElement.data.label));
                    newElement.data.label = addFocus(newElement.data.label);
                    oldElement.setLabel(removeFocus(oldElement.data.label));
                    oldElement.data.label = removeFocus(oldElement.data.label);
                    screen.render();
                });
                elements[0].setLabel(`${FOCUSED} ` + elements[0].data.label);
                elements[0].data.label = `${FOCUSED} ` + elements[0].data.label;
                machine.pointer += 1;
                const cleanup = function (code) {
                    isDebugging = false;
                    screen.destroy();
                    machine.pointer -= 1;
                    if (code != undefined)
                        machine.returnCode = code;
                    resolve(null);
                };
                screen.key(['C-c', 'q'], cleanup);
                contentBox.focus();
                screen.render();
                screen.program.hideCursor();
            });
        });
    }
    exports.IACTDebugger = IACTDebugger;
});
define("vm/machine/native/modules/debug", ["require", "exports", "vm/machine/native/helpers", "vm/machine/native/converter", "vm/emitter/printer", "problem/interactive/index", "problem/interactive/debugger", "inout/index"], function (require, exports, helpers_11, converter_7, printer_2, index_2, debugger_1, inout_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.jsdebug = void 0;
    const debug = {
        stack: helpers_11.GenerateGuardedFunction("stack", [], function () {
            return this.stack.map(i => converter_7.PlConverter.PlToJs(i, this));
        }),
        closure: helpers_11.GenerateGuardedFunction("closure", [], function () {
            const values = {};
            for (const [key, value] of Object.entries(this.closureFrame.values)) {
                values[key] = converter_7.PlConverter.PlToJs(value, this);
            }
            return values;
        }),
        locals: helpers_11.GenerateGuardedFunction("locals", [], function () {
            const values = {};
            for (const [key, value] of Object.entries(this.stackFrame.values)) {
                values[key] = converter_7.PlConverter.PlToJs(value, this);
            }
            return values;
        }),
        globals: helpers_11.GenerateGuardedFunction("globals", [], function () {
            let out = {};
            let sf = this.stackFrame;
            do {
                const values = {};
                for (const [key, value] of Object.entries(sf.values)) {
                    values[key] = converter_7.PlConverter.PlToJs(value, this);
                }
                out = Object.assign(Object.assign({}, out), values);
            } while ((sf = sf.outer) != null);
            return out;
        }),
        program: helpers_11.GenerateGuardedFunction("program", [], function () {
            return printer_2.PlProgramToString(this.program, false).split('\n');
        }),
        pointer: helpers_11.GenerateGuardedFunction("pointer", [], function () {
            return this.pointer;
        }),
    };
    if (inout_5.isNode) {
        debug['debugger'] = helpers_11.GenerateGuardedFunction("debugger", [], function () {
            if (this.inout.options['mode'] == 'release' || this.inout.options["run"] == "repl")
                return null;
            index_2.IACTSync(debugger_1.IACTDebugger(this));
            throw "debugger";
        });
    }
    exports.jsdebug = {
        debug
    };
});
define("vm/machine/native/impl/func", ["require", "exports", "vm/machine/scrambler", "vm/machine/stuff", "vm/machine/native/helpers", "vm/machine/native/converter"], function (require, exports, scrambler_9, stuff_16, helpers_12, converter_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.func = void 0;
    exports.func = {
        [scrambler_9.ScrambleType("call", stuff_16.PlStuffType.Func)]: helpers_12.GenerateGuardedTypeFunction("call", [stuff_16.PlStuffType.List], function (self, args) {
            try {
                return this.runFunction(self, args.value);
            }
            catch (e) {
                throw null;
            }
        }),
        [scrambler_9.ScrambleType("bind", stuff_16.PlStuffType.Func)]: helpers_12.GenerateGuardedTypeFunction("bind", [stuff_16.PlStuffTypeAny], function (self, newSelf) {
            const newFunc = converter_8.PlActions.PlCopy(self);
            newFunc.value.self = newSelf;
            newFunc.value.name += '.bind';
            return newFunc;
        }),
        [scrambler_9.ScrambleType("arity", stuff_16.PlStuffType.Func)]: helpers_12.GenerateGuardedTypeFunction("arity", [], function (self) {
            return stuff_16.NewPlStuff(stuff_16.PlStuffType.Num, (self.value).parameters.length);
        }),
        [scrambler_9.ScrambleType("name", stuff_16.PlStuffType.Func)]: helpers_12.GenerateGuardedTypeFunction("name", [], (self) => {
            if (self.type == stuff_16.PlStuffType.Func) {
                return stuff_16.NewPlStuff(stuff_16.PlStuffType.Str, self.value.closure.trace.name);
            }
            return stuff_16.NewPlStuff(stuff_16.PlStuffType.Str, self.value.name);
        })
    };
});
define("vm/machine/native/index", ["require", "exports", "vm/machine/native/operators", "vm/machine/native/impl/list", "vm/machine/native/impl/all", "vm/machine/native/impl/str", "vm/machine/native/impl/dict", "vm/machine/native/special", "vm/machine/native/modules/maths", "vm/machine/native/impl/num", "vm/machine/native/modules/time", "vm/machine/native/modules/random", "vm/machine/native/modules/debug", "vm/machine/native/impl/func"], function (require, exports, operators_2, list_1, all_1, str_1, dict_1, special_1, maths_1, num_1, time_1, random_1, debug_3, func_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.jsModules = exports.natives = exports.jsNatives = void 0;
    exports.jsNatives = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, operators_2.jsOperators), dict_1.jsDict), list_1.jsList), str_1.jsStr), num_1.jsNum), special_1.jsSpecial);
    exports.natives = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, operators_2.operators), str_1.str), list_1.list), dict_1.dict), func_1.func), all_1.all), special_1.special);
    exports.jsModules = Object.assign(Object.assign(Object.assign(Object.assign({}, maths_1.maths), time_1.time), random_1.random), debug_3.jsdebug);
});
define("vm/machine/index", ["require", "exports", "vm/emitter/bytecode", "problem/problem", "vm/machine/stuff", "vm/machine/native/index", "vm/machine/scrambler", "vm/machine/native/converter", "problem/trace", "vm/machine/memory"], function (require, exports, bytecode_4, problem_5, stuff_17, native_1, scrambler_10, converter_9, trace_1, memory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlStackMachine = exports.CTOR_NAME = void 0;
    const JUMP_ERRORS = {
        "*": "RE0010",
        "ASTCondition": "RE0014",
    };
    exports.CTOR_NAME = "new";
    class PlStackMachine {
        constructor(inout, file, args = []) {
            this.inout = inout;
            this.file = file;
            this.standard = [];
            this.returnCode = null;
            this.stackFrame = new memory_1.PlStackFrame(null, trace_1.NewPlTraceFrame("|file|"));
            this.closureFrames = [];
            this.program = { program: [], debug: [] };
            this.rearm();
            this.seedFrame(args);
        }
        get closureFrame() {
            return this.closureFrames[this.closureFrames.length - 1];
        }
        addProgram(program, content) {
            this.program.program.push(...program.program);
            this.program.debug.push(...program.debug);
            if (content)
                this.file.content += content + '\n';
        }
        rearm() {
            this.problems = [];
            this.stack = [];
            this.pointer = this.program.program.length;
            let sf = this.stackFrame;
            while (sf.outer != null) {
                sf = sf.outer;
            }
            this.stackFrame = sf;
        }
        saveState() {
            return {
                stack: [...this.stack],
                stackFrame: this.stackFrame,
                closureFrames: [...this.closureFrames],
                pointer: this.pointer
            };
        }
        restoreState(state) {
            this.stack = state.stack;
            this.stackFrame = state.stackFrame;
            this.closureFrames = state.closureFrames;
            this.pointer = state.pointer;
        }
        findFunction(name, target) {
            let value = this.findValue(scrambler_10.ScrambleImpl(name, target));
            if (value == null) {
                if (target.type == stuff_17.PlStuffType.Inst) {
                    value = this.findValue(scrambler_10.ScrambleType(name, target.type));
                    if (value == null)
                        return null;
                }
                else {
                    return null;
                }
            }
            if (value.type == stuff_17.PlStuffType.NFunc || value.type == stuff_17.PlStuffType.Func) {
                return value;
            }
            return null;
        }
        runNFunction(func, args, callDebug = null) {
            const value = func.value;
            const parameters = value.parameters;
            let hasRest = false;
            for (let i = 0; i < parameters.length; i++) {
                const param = parameters[i];
                if (param == stuff_17.PlStuffTypeRest) {
                    hasRest = true;
                    break;
                }
                if (i >= args.length) {
                    break;
                }
                if (param == stuff_17.PlStuffTypeAny) {
                    continue;
                }
                if (stuff_17.PlStuffTypeToString(args[i].type) != stuff_17.PlStuffTypeToString(param)) {
                    this.newProblem("RE0018", this.pointer, stuff_17.PlStuffTypeToString(param), "" + (i + 1), stuff_17.PlStuffTypeToString(args[i].type));
                    throw null;
                }
            }
            if (!hasRest) {
                if (args.length != value.parameters.length) {
                    debugger;
                    this.newProblem("RE0006", this.pointer, '' + value.parameters.length, '' + args.length);
                    throw null;
                }
            }
            const stackFrame = this.stackFrame;
            try {
                const out = value.native(...args);
                return out;
            }
            catch (e) {
                if (e == "debugger") {
                    return null;
                }
                const info = callDebug == null ? null : callDebug.span.info;
                if (stackFrame == this.stackFrame) {
                    this.stackFrame = new memory_1.PlStackFrame(this.stackFrame, trace_1.NewPlTraceFrame(value.name, info));
                }
                else {
                    let sf = this.stackFrame;
                    while (sf.outer != stackFrame) {
                        sf = sf.outer;
                    }
                    sf.outer = new memory_1.PlStackFrame(stackFrame, trace_1.NewPlTraceFrame(value.name, info));
                }
                if (e != null) {
                    this.newProblem("RE0007", this.pointer, e.message);
                }
                throw null;
            }
        }
        runFunction(func, args, callPointer) {
            const oldPointer = this.pointer;
            if (callPointer) {
                this.pointer = callPointer;
            }
            const callDebug = this.getCallDebug(this.pointer);
            if (func.type == stuff_17.PlStuffType.NFunc) {
                try {
                    const out = this.runNFunction(func, args, callDebug);
                    this.pointer = oldPointer;
                    return out;
                }
                catch (e) {
                    this.pointer = oldPointer;
                    throw null;
                }
            }
            const value = func.value;
            const parameters = value.parameters;
            if (parameters.length != args.length) {
                console.log(parameters);
                this.newProblem("RE0006", this.pointer, '' + parameters.length, '' + args.length);
                this.pointer = oldPointer;
                throw null;
            }
            this.closureFrames.push(value.closure);
            this.stackFrame = new memory_1.PlStackFrame(this.stackFrame, value.closure.trace);
            if (callDebug != null) {
                this.stackFrame.setTraceInfo(callDebug.span.info);
            }
            for (let i = 0; i < args.length; ++i) {
                this.createValue(parameters[i], args[i]);
            }
            this.createValue(value.closure.trace.name, func);
            this.pushStack(null);
            const out = this.runProgram(value.index + 1);
            this.stackFrame = this.stackFrame.outer;
            this.closureFrames.pop();
            this.pointer = oldPointer;
            if (out == null) {
                throw null;
            }
            return out;
        }
        jumpFunction(func, args, callDebug) {
            const value = func.value;
            const parameters = value.parameters;
            if (parameters.length != args.length) {
                console.log(parameters);
                this.newProblem("RE0006", this.pointer, '' + parameters.length, '' + args.length);
                return false;
            }
            this.closureFrames.push(value.closure);
            this.stackFrame = new memory_1.PlStackFrame(this.stackFrame, value.closure.trace);
            if (callDebug) {
                this.stackFrame.setTraceInfo(callDebug.span.info);
            }
            for (let i = 0; i < args.length; ++i) {
                this.createValue(parameters[i], args[i]);
            }
            this.createValue(value.closure.trace.name, func);
            this.pushStack(stuff_17.NewPlStuff(stuff_17.PlStuffType.Num, this.pointer));
            this.pointer = value.index;
            return true;
        }
        convertBasicTypes(value, args) {
            if (args.length != 1) {
                this.newProblem("RE0006", this.pointer, '1', '' + args.length);
                return null;
            }
            const got = args[0];
            const fn = this.findFunction(value.type.toLowerCase(), got);
            if (fn != null) {
                return this.runFunction(fn, [got]);
            }
            return converter_9.PlConverter.PlToPl(got, value, this);
        }
        verifyGuards(func, args) {
            const value = func.value;
            for (let i = 0; i < args.length; i++) {
                const guard = value.guards[i];
                if (guard == null) {
                    continue;
                }
                switch (guard.type) {
                    case stuff_17.PlStuffType.NFunc:
                    case stuff_17.PlStuffType.Func: {
                        let supplied = [];
                        const need = guard.value.parameters.length;
                        switch (need) {
                            case 0:
                                break;
                            case 1:
                                supplied = [args[i]];
                                break;
                            case 2:
                                supplied = [func, args[i]];
                                break;
                            case 3:
                                supplied = [func, args[i], i];
                                break;
                            default:
                                supplied = [func, args[i], i];
                                for (let i = 3; i < need; i++)
                                    supplied.push(stuff_17.PlStuffNull);
                                break;
                        }
                        if (guard.type == stuff_17.PlStuffType.Func) {
                            supplied = this.verifyGuards(guard, supplied);
                            if (supplied == null)
                                return null;
                        }
                        const oldStack = this.stackFrame;
                        try {
                            args[i] = this.runFunction(guard, supplied);
                        }
                        catch (e) {
                            this.stackFrame = oldStack;
                            return null;
                        }
                    }
                }
            }
            return args;
        }
        callSomething(func, args, callDebug) {
            switch (func.type) {
                case stuff_17.PlStuffType.Type: {
                    const value = func.value;
                    if (value.format == null) {
                        const out = this.convertBasicTypes(value, args);
                        if (out == null) {
                            return false;
                        }
                        this.pushStack(out);
                        break;
                    }
                    const obj = {};
                    for (const member of value.format) {
                        obj[member] = stuff_17.PlStuffNull;
                    }
                    const instance = stuff_17.NewPlStuff(stuff_17.PlStuffType.Inst, {
                        type: value.type,
                        value: obj
                    });
                    const ctor = this.findFunction(exports.CTOR_NAME, instance);
                    if (ctor == null) {
                        if (args.length == 0) {
                            this.pushStack(instance);
                            break;
                        }
                        if (args.length == value.format.length) {
                            for (let i = 0; i < value.format.length; i++) {
                                instance.value.value[value.format[i]] = args[i];
                            }
                            this.pushStack(instance);
                            break;
                        }
                        this.newProblem("RE0006", this.pointer, `0 or ${value.format.length}`, '' + args.length);
                        return false;
                    }
                    try {
                        this.runFunction(ctor, [instance, ...args]);
                    }
                    catch (e) {
                        return false;
                    }
                    this.pushStack(instance);
                    break;
                }
                case stuff_17.PlStuffType.NFunc: {
                    try {
                        this.pushStack(this.runNFunction(func, args, callDebug));
                    }
                    catch (e) {
                        return false;
                    }
                    break;
                }
                case stuff_17.PlStuffType.Func: {
                    const value = func.value;
                    args = this.verifyGuards(func, args);
                    if (args == null) {
                        return false;
                    }
                    if (!this.jumpFunction(func, args, callDebug))
                        return false;
                    break;
                }
            }
            return true;
        }
        getCallDebug(pointer) {
            const { debug } = this.program;
            if (debug) {
                for (const d of debug) {
                    if (d.endLine == pointer + 1) {
                        return d;
                    }
                }
                return null;
            }
            return null;
        }
        seedFrame(args) {
            for (const [key, entry] of Object.entries(native_1.jsNatives)) {
                const fn = Object.assign(Object.assign({}, entry), { native: converter_9.PlConverter.JsToPl(entry.native, this).value.native });
                this.stackFrame.createValue(key, stuff_17.NewPlStuff(stuff_17.PlStuffType.NFunc, fn));
                this.standard.push(key);
            }
            for (const [key, entry] of Object.entries(native_1.natives)) {
                const fn = Object.assign(Object.assign({}, entry), { native: entry.native.bind(this) });
                this.stackFrame.createValue(key, stuff_17.NewPlStuff(stuff_17.PlStuffType.NFunc, fn));
                this.standard.push(key);
            }
            for (const [moduleName, module] of Object.entries(native_1.jsModules)) {
                const obj = {};
                for (const [methodName, method] of Object.entries(module)) {
                    if (typeof method != "object") {
                        obj[methodName] = converter_9.PlConverter.JsToPl(method, this);
                        continue;
                    }
                    const fn = Object.assign(Object.assign({}, method), { native: converter_9.PlConverter.JsToPl(method.native, this).value.native });
                    obj[methodName] = stuff_17.NewPlStuff(stuff_17.PlStuffType.NFunc, fn);
                }
                this.stackFrame.createValue(moduleName, stuff_17.NewPlStuff(stuff_17.PlStuffType.Dict, obj));
                this.standard.push(moduleName);
            }
            this.stackFrame.createValue("process", converter_9.PlConverter.JsToPl({
                arguments: args,
                exit: code => {
                    this.returnCode = +code;
                    return null;
                }
            }, this));
            this.standard.push('process');
            for (const key of stuff_17.PlStuffTypes) {
                if (key == "Inst")
                    continue;
                const value = stuff_17.NewPlStuff(stuff_17.PlStuffType.Type, {
                    type: key,
                    format: null
                });
                this.stackFrame.createValue(key, value);
                const newName = scrambler_10.ScrambleName("new", key);
                this.stackFrame.createValue(newName, stuff_17.NewPlStuff(stuff_17.PlStuffType.NFunc, {
                    native: (...args) => {
                        const out = this.convertBasicTypes(value.value, args);
                        if (out == null)
                            throw null;
                        return out;
                    },
                    name: "new",
                    self: null,
                    parameters: [stuff_17.PlStuffTypeAny],
                    guards: [null],
                }));
                this.standard.push(key, newName);
            }
        }
        peekStack(degree = 0) {
            const index = this.stack.length - 1 - degree;
            if (index < 0)
                return null;
            return this.stack[index];
        }
        pushStack(stuff) {
            this.stack.push(stuff);
        }
        popStack() {
            return this.stack.pop();
        }
        newProblem(code, line, ...args) {
            const { debug } = this.program;
            if (!debug) {
                this.problems.push(problem_5.NewPlProblem(typeof code == "string" ? code : code["*"], null, ...args));
                return null;
            }
            let surrounding = null;
            for (const d of debug) {
                if (line < (d.endLine) && line >= (d.endLine - d.length)) {
                    if (surrounding == null) {
                        surrounding = d;
                    }
                    else if (d.length < surrounding.length) {
                        surrounding = d;
                    }
                }
            }
            if (surrounding == null) {
                this.problems.push(problem_5.NewPlProblem(typeof code == "string" ? code : code["*"], null, ...args));
                return null;
            }
            if (typeof code == "string") {
                this.problems.push(problem_5.NewPlProblem(code, surrounding.span.info, ...args));
                return null;
            }
            if (surrounding.name in code) {
                this.problems.push(problem_5.NewPlProblem(code[surrounding.name], surrounding.span.info, ...args));
                return null;
            }
            if ("*" in code) {
                this.problems.push(problem_5.NewPlProblem(code["*"], surrounding.span.info, ...args));
                return null;
            }
            throw new Error("newProblem did not find a matching code, there is a missing default case");
        }
        getProblems() {
            return this.problems;
        }
        getTrace() {
            const trace = [];
            let frame = this.stackFrame;
            while (true) {
                if (frame.trace != null)
                    trace.push(frame.trace);
                if ((frame = frame.outer) == null) {
                    break;
                }
            }
            return trace;
        }
        getFrames() {
            const frames = [];
            let frame = this.stackFrame;
            while (true) {
                frames.push(frame);
                if ((frame = frame.outer) == null) {
                    break;
                }
            }
            return frames;
        }
        findValue(key) {
            let value = this.stackFrame.findValue(key);
            if (value != null) {
                return value;
            }
            if (this.closureFrames.length != 0) {
                value = this.closureFrame.findValueDeep(key);
                if (value != null) {
                    return value;
                }
            }
            return this.stackFrame.findValueDeep(key);
        }
        createValue(key, value) {
            return this.stackFrame.createValue(key, value);
        }
        setValue(key, value) {
            if (this.stackFrame.findValue(key) == null && this.closureFrames.length != 0 && this.closureFrame.findValueDeep(key) != null) {
                return this.closureFrame.setValue(key, value);
            }
            return this.stackFrame.setValue(key, value);
        }
        runProgram(position = this.pointer, until) {
            const { program } = this.program;
            this.pointer = position;
            try {
                let lastPointer = this.pointer - 1;
                while (this.pointer < program.length) {
                    if (this.returnCode != null)
                        return stuff_17.NewPlStuff(stuff_17.PlStuffType.Num, this.returnCode);
                    if (until) {
                        if (until(lastPointer, this.pointer)) {
                            return null;
                        }
                    }
                    const byte = program[this.pointer];
                    lastPointer = this.pointer;
                    switch (byte.type) {
                        case bytecode_4.PlBytecodeType.STKPOP: {
                            this.popStack();
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DEFNUM: {
                            this.pushStack(stuff_17.NewPlStuff(stuff_17.PlStuffType.Num, +byte.value));
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DEFSTR: {
                            this.pushStack(stuff_17.NewPlStuff(stuff_17.PlStuffType.Str, byte.value));
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DEFBOL: {
                            if (byte.value == '1')
                                this.pushStack(stuff_17.PlStuffTrue);
                            else
                                this.pushStack(stuff_17.PlStuffFalse);
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DEFNUL: {
                            this.pushStack(stuff_17.PlStuffNull);
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DEFTYP: {
                            const name = this.popStack();
                            const arity = this.popStack();
                            const members = [];
                            for (let i = 0; i < arity.value; i++)
                                members.push(this.popStack().value);
                            this.pushStack(stuff_17.NewPlStuff(stuff_17.PlStuffType.Type, {
                                type: name.value,
                                format: members
                            }));
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DEFETY: {
                            this.pushStack(null);
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DEFVAR: {
                            const name = byte.value;
                            const value = this.findValue(name);
                            if (value != null) {
                                this.pushStack(value);
                                break;
                            }
                            return this.newProblem("RE0003", this.pointer, name);
                        }
                        case bytecode_4.PlBytecodeType.DEFLST: {
                            const length = this.popStack();
                            let values = [];
                            for (let i = 0; i < length.value; ++i) {
                                values.push(converter_9.PlActions.PlCopy(this.popStack()));
                            }
                            this.pushStack(stuff_17.NewPlStuff(stuff_17.PlStuffType.List, values));
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DEFDIC: {
                            let object = {};
                            const amount = this.popStack();
                            for (let i = 0; i < +amount.value; ++i) {
                                const key = this.popStack();
                                object[key.value] = converter_9.PlActions.PlCopy(this.popStack());
                            }
                            this.pushStack(stuff_17.NewPlStuff(stuff_17.PlStuffType.Dict, object));
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DEFFUN: {
                            const arity = this.popStack();
                            const parameters = [];
                            for (let i = 0; i < arity.value; ++i) {
                                parameters.push(this.popStack().value);
                            }
                            const guards = [];
                            for (let i = 0; i < arity.value; ++i) {
                                const g = this.popStack();
                                if (g == null) {
                                    guards.push(null);
                                    continue;
                                }
                                const name = g.value;
                                let guard = this.findValue(name);
                                if (guard == null) {
                                    return this.newProblem("RE0019", this.pointer - 2 - arity.value - i, name);
                                }
                                if (guard.type == stuff_17.PlStuffType.Type) {
                                    const gtf = this.findValue(scrambler_10.ScrambleName("guard", guard.value.type));
                                    if (gtf != null) {
                                        guard = gtf;
                                    }
                                    else {
                                        const type = guard;
                                        const sm = this;
                                        guard = stuff_17.NewPlStuff(stuff_17.PlStuffType.NFunc, {
                                            native: (fn, arg, i) => {
                                                if (stuff_17.PlStuffGetType(arg) != type.value.type) {
                                                    this.newProblem("RE0018", sm.pointer, type.value.type, '' + (i + 1), stuff_17.PlStuffGetType(arg));
                                                    throw null;
                                                }
                                                return arg;
                                            },
                                            name: "guard",
                                            parameters: [stuff_17.PlStuffTypeAny, stuff_17.PlStuffTypeAny, stuff_17.PlStuffTypeAny],
                                            self: null
                                        });
                                    }
                                }
                                guards.push(guard);
                            }
                            const length = +byte.value;
                            this.pushStack(stuff_17.NewPlStuff(stuff_17.PlStuffType.Func, {
                                closure: new memory_1.PlStackFrame(this.stackFrame, trace_1.NewPlTraceFrame("|closure|")),
                                parameters,
                                index: this.pointer,
                                self: null,
                                guards,
                            }));
                            this.pointer += length;
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DOOINC: {
                            const value = this.popStack();
                            if (value.type == stuff_17.PlStuffType.Num) {
                                value.value++;
                                this.pushStack(value);
                                break;
                            }
                            return this.newProblem("RE0015", this.pointer, stuff_17.PlStuffGetType(value));
                        }
                        case bytecode_4.PlBytecodeType.DOODEC: {
                            const value = this.popStack();
                            if (value.type == stuff_17.PlStuffType.Num) {
                                value.value--;
                                this.pushStack(value);
                                break;
                            }
                            return this.newProblem({
                                "*": "RE0015",
                                "ASTCondition": "RE0011",
                            }, this.pointer, stuff_17.PlStuffGetType(value));
                        }
                        case bytecode_4.PlBytecodeType.DONEGT: {
                            const value = this.popStack();
                            if (value.type == stuff_17.PlStuffType.Num) {
                                this.pushStack(stuff_17.NewPlStuff(stuff_17.PlStuffType.Num, -value.value));
                                break;
                            }
                            return this.newProblem("RE0005", this.pointer, stuff_17.PlStuffGetType(value));
                        }
                        case bytecode_4.PlBytecodeType.DOLNOT: {
                            const value = this.popStack();
                            if (value.type == stuff_17.PlStuffType.Bool) {
                                this.pushStack(value.value == true ? stuff_17.PlStuffFalse : stuff_17.PlStuffTrue);
                                break;
                            }
                            return this.newProblem("RE0017", this.pointer, stuff_17.PlStuffGetType(value));
                        }
                        case bytecode_4.PlBytecodeType.DOCRET:
                        case bytecode_4.PlBytecodeType.DOASGN: {
                            const name = this.popStack();
                            const target = this.popStack();
                            const value = converter_9.PlActions.PlCopy(this.popStack());
                            if (target == null) {
                                if (value.type == stuff_17.PlStuffType.Func) {
                                    const content = value.value;
                                    content.closure.setTraceName(name.value);
                                }
                                if (byte.type == bytecode_4.PlBytecodeType.DOCRET) {
                                    this.createValue(name.value, value);
                                }
                                else {
                                    this.setValue(name.value, value);
                                }
                                this.pushStack(value);
                                break;
                            }
                            if (target.type == stuff_17.PlStuffType.Dict) {
                                if (name.value in target.value) {
                                    target.value[name.value] = value;
                                    this.pushStack(value);
                                    break;
                                }
                            }
                            else if (target.type == stuff_17.PlStuffType.List) {
                                let parsed = Number.parseFloat('' + name.value);
                                if (!Number.isNaN(parsed)) {
                                    parsed--;
                                    if (parsed in target.value) {
                                        target.value[parsed] = value;
                                        this.pushStack(value);
                                        break;
                                    }
                                }
                            }
                            else if (target.type == stuff_17.PlStuffType.Inst) {
                                if (name.value in target.value.value) {
                                    target.value.value[name.value] = value;
                                    this.pushStack(value);
                                    break;
                                }
                            }
                            return this.newProblem("RE0013", this.pointer, stuff_17.PlStuffGetType(target));
                        }
                        case bytecode_4.PlBytecodeType.DOFDCL: {
                            const name = byte.value;
                            const arity = this.popStack();
                            const target = this.popStack();
                            const fn = this.findFunction(name, target);
                            if (fn == null) {
                                return this.newProblem("RE0004", this.pointer, name, stuff_17.PlStuffGetType(target));
                            }
                            const args = [target];
                            const remain = (+arity.value) - 1;
                            for (let i = 0; i < remain; ++i) {
                                args.push(converter_9.PlActions.PlCopy(this.popStack()));
                            }
                            const ok = this.callSomething(fn, args, this.getCallDebug(this.pointer));
                            if (!ok) {
                                return null;
                            }
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DOCALL: {
                            const func = this.popStack();
                            if (func.type != stuff_17.PlStuffType.Func && func.type != stuff_17.PlStuffType.NFunc && func.type != stuff_17.PlStuffType.Type) {
                                return this.newProblem("RE0008", this.pointer, stuff_17.PlStuffGetType(func));
                            }
                            const arity = this.popStack();
                            const args = [];
                            if (func.value.self) {
                                args.push(func.value.self);
                            }
                            for (let i = 0; i < +arity.value; ++i) {
                                args.push(converter_9.PlActions.PlCopy(this.popStack()));
                            }
                            const ok = this.callSomething(func, args, this.getCallDebug(this.pointer));
                            if (!ok) {
                                return null;
                            }
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DOFIND: {
                            const bKey = this.popStack();
                            const bTarget = this.popStack();
                            const name = bKey.value;
                            if (bTarget.type == stuff_17.PlStuffType.Dict) {
                                const value = bTarget.value[name];
                                if (value) {
                                    this.pushStack(value);
                                    break;
                                }
                            }
                            else if (bTarget.type == stuff_17.PlStuffType.List) {
                                let parsed = Number.parseFloat('' + name);
                                if (!Number.isNaN(parsed)) {
                                    parsed--;
                                    const value = bTarget.value[parsed];
                                    if (value) {
                                        this.pushStack(value);
                                        break;
                                    }
                                }
                            }
                            else if (bTarget.type == stuff_17.PlStuffType.Inst) {
                                const instance = bTarget.value;
                                let value = instance.value[name];
                                if (value) {
                                    this.pushStack(value);
                                    break;
                                }
                            }
                            else if (bTarget.type == stuff_17.PlStuffType.Type) {
                                const value = this.findValue(scrambler_10.ScrambleName(name, bTarget.value.type));
                                if (value != null) {
                                    const fn = converter_9.PlActions.PlCopy(value);
                                    fn.value.self = null;
                                    this.pushStack(fn);
                                    break;
                                }
                            }
                            const value = this.findValue(scrambler_10.ScrambleImpl(name, bTarget));
                            if (value != null) {
                                const fn = converter_9.PlActions.PlCopy(value);
                                fn.value.self = bTarget;
                                this.pushStack(fn);
                                break;
                            }
                            if (bTarget.type == stuff_17.PlStuffType.Inst) {
                                const value = this.findValue(scrambler_10.ScrambleType(name, bTarget.type));
                                if (value != null) {
                                    const fn = converter_9.PlActions.PlCopy(value);
                                    fn.value.self = bTarget;
                                    this.pushStack(fn);
                                    break;
                                }
                            }
                            return this.newProblem({
                                "*": "RE0012",
                                "ASTCondition": "RE0016",
                            }, this.pointer, name, stuff_17.PlStuffGetType(bTarget));
                        }
                        case bytecode_4.PlBytecodeType.DORETN: {
                            const retVal = this.popStack();
                            const address = this.popStack();
                            if (address == null) {
                                return retVal;
                            }
                            let outer = this.stackFrame;
                            while (outer.trace == null) {
                                outer = outer.outer;
                            }
                            this.stackFrame = outer.outer;
                            this.closureFrames.pop();
                            this.pointer = address.value;
                            this.stack.push(retVal);
                            break;
                        }
                        case bytecode_4.PlBytecodeType.DOCONT:
                        case bytecode_4.PlBytecodeType.DOBRAK: {
                            const data = byte.value;
                            if (data == null) {
                                return this.newProblem("RE0009", this.pointer);
                            }
                            const [offset, pops] = data.split(',');
                            for (let i = 0; i < +pops; i++) {
                                this.stackFrame = this.stackFrame.outer;
                            }
                            this.pointer += +offset;
                            break;
                        }
                        case bytecode_4.PlBytecodeType.STKENT: {
                            this.stackFrame = new memory_1.PlStackFrame(this.stackFrame);
                            break;
                        }
                        case bytecode_4.PlBytecodeType.STKEXT: {
                            this.stackFrame = this.stackFrame.outer;
                            break;
                        }
                        case bytecode_4.PlBytecodeType.JMPREL: {
                            this.pointer += +byte.value;
                            break;
                        }
                        case bytecode_4.PlBytecodeType.JMPIFT: {
                            const peek = this.peekStack();
                            if (peek.type == stuff_17.PlStuffType.Bool) {
                                if (peek.value == true) {
                                    this.pointer += +byte.value;
                                }
                                break;
                            }
                            return this.newProblem(JUMP_ERRORS, this.pointer, stuff_17.PlStuffGetType(peek));
                        }
                        case bytecode_4.PlBytecodeType.JMPIFF: {
                            const peek = this.peekStack();
                            if (peek.type == stuff_17.PlStuffType.Bool) {
                                if (peek.value == false) {
                                    this.pointer += +byte.value;
                                }
                                break;
                            }
                            return this.newProblem(JUMP_ERRORS, this.pointer, stuff_17.PlStuffGetType(peek));
                        }
                        case bytecode_4.PlBytecodeType.JMPICT: {
                            const peek = this.popStack();
                            if (peek.type == stuff_17.PlStuffType.Bool) {
                                if (peek.value == true) {
                                    this.pointer += +byte.value;
                                }
                                break;
                            }
                            return this.newProblem(JUMP_ERRORS, this.pointer, stuff_17.PlStuffGetType(peek));
                        }
                        case bytecode_4.PlBytecodeType.JMPICF: {
                            const peek = this.popStack();
                            if (peek.type == stuff_17.PlStuffType.Bool) {
                                if (peek.value == false) {
                                    this.pointer += +byte.value;
                                }
                                break;
                            }
                            return this.newProblem(JUMP_ERRORS, this.pointer, stuff_17.PlStuffGetType(peek));
                        }
                        default: {
                            return this.newProblem("RE0001", this.pointer, bytecode_4.BytecodeTypeToString(byte.type));
                        }
                    }
                    ++this.pointer;
                }
                return stuff_17.PlStuffNull;
            }
            catch (e) {
                debugger;
                return this.newProblem("DE0002", this.pointer, '' + e);
            }
        }
    }
    exports.PlStackMachine = PlStackMachine;
});
define("problem/interactive/trace", ["require", "exports", "problem/printer", "inout/color"], function (require, exports, printer_3, color_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IACTTrace = void 0;
    const TRACE_MAX = 8;
    function IACTTrace(content, problems, trace) {
        return __awaiter(this, void 0, void 0, function* () {
            const blessed = require('blessed');
            return new Promise((resolve) => {
                const screen = blessed.screen({
                    smartCSR: true,
                    title: "Interactive Frame Viewer"
                });
                const maxIndex = trace.length - 1;
                const minIndex = 0;
                let traceIndex = 0;
                const renderText = (index) => {
                    const buffer = ['{bold}Interactive Frame Viewer{/bold}', "Press 'Ctrl-C' to exit", "Press 'w' or 's' to navigate through the callframes", ''];
                    buffer.push(color_3.colors.red('\nCallframes (Most Recent Last)'));
                    let line = maxIndex - index;
                    let above = minIndex;
                    let below = maxIndex;
                    if (TRACE_MAX < trace.length) {
                        above = line - Math.floor((TRACE_MAX - 1) / 2);
                        below = line + Math.floor(TRACE_MAX / 2);
                        if (above < minIndex) {
                            above = 0;
                        }
                        if (below > maxIndex)
                            below = maxIndex;
                    }
                    if (above > minIndex) {
                        buffer.push(`...omitted ${above - minIndex} frame(s)`);
                    }
                    for (let i = above; i <= below; ++i) {
                        let out = printer_3.CreateFrame(trace[maxIndex - i].name, trace[maxIndex - i].info);
                        if (i == line) {
                            out = `{white-bg}{black-fg}${out}{/black-fg}{/white-bg}`;
                        }
                        buffer.push(out);
                    }
                    if (below < maxIndex) {
                        buffer.push(`...omitted ${maxIndex - below} frames(s)`);
                    }
                    buffer.push('');
                    const frame = trace[index];
                    const code = frame.name;
                    const info = frame.info;
                    buffer.push(...printer_3.CreateProblemTitle(code, info));
                    if (info != null) {
                        if (process.platform == "win32") {
                            buffer.push(...printer_3.CreateProblemBody("here", info, content, message => message));
                        }
                        else {
                            buffer.push(...printer_3.CreateProblemBody("here", info, content));
                        }
                    }
                    buffer.push('');
                    buffer.push(...printer_3.CreateProblemMessage(problems[0].code, problems[0].message));
                    return buffer.join('\n');
                };
                const box = blessed.box({
                    content: renderText(traceIndex),
                    tags: true,
                    scrollable: true,
                    alwaysScroll: true,
                    scrollbar: {
                        style: {
                            bg: 'yellow'
                        }
                    },
                    keys: true,
                });
                screen.append(box);
                box.key(['w', 's'], function (ch, key) {
                    if (key.name == 'w')
                        traceIndex += 1;
                    else
                        traceIndex -= 1;
                    if (traceIndex < 0)
                        traceIndex = 0;
                    else if (traceIndex > trace.length - 1)
                        traceIndex = trace.length - 1;
                    box.setContent(renderText(traceIndex));
                    screen.render();
                });
                screen.key(['C-c', 'q'], function (ch, key) {
                    resolve(0);
                });
                box.focus();
                screen.render();
            });
        });
    }
    exports.IACTTrace = IACTTrace;
});
define("compiler/parsing/ops", ["require", "exports", "compiler/lexing/token"], function (require, exports, token_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IsPreLower = exports.IsPreHigher = void 0;
    const OpPrecedence = {
        [token_5.PlTokenType.ASGN]: 0,
        [token_5.PlTokenType.AND]: 1,
        [token_5.PlTokenType.OR]: 1,
        [token_5.PlTokenType.LT]: 2,
        [token_5.PlTokenType.LTE]: 2,
        [token_5.PlTokenType.GT]: 2,
        [token_5.PlTokenType.GTE]: 2,
        [token_5.PlTokenType.EQ]: 2,
        [token_5.PlTokenType.NEQ]: 2,
        [token_5.PlTokenType.ADD]: 3,
        [token_5.PlTokenType.SUB]: 3,
        [token_5.PlTokenType.MUL]: 4,
        [token_5.PlTokenType.DIV]: 4,
    };
    function IsPreHigher(left, right) {
        if (!(left in OpPrecedence) || !(right in OpPrecedence)) {
            return false;
        }
        return OpPrecedence[right] > OpPrecedence[left];
    }
    exports.IsPreHigher = IsPreHigher;
    function IsPreLower(left, right) {
        if (!(left in OpPrecedence) || !(right in OpPrecedence)) {
            return false;
        }
        return OpPrecedence[right] < OpPrecedence[left];
    }
    exports.IsPreLower = IsPreLower;
});
define("compiler/parsing/visualizer", ["require", "exports", "compiler/parsing/ast", "compiler/lexing/token", "inout/color", "compiler/parsing/ops"], function (require, exports, ast_3, token_6, color_4, ops_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASTProgramToString = exports.HIGHLIGHT = void 0;
    const PPINDENT = 4;
    const HIGHLIGHT_TYPES = ["kw", "sr", "mt", "nu"];
    exports.HIGHLIGHT = {
        kw: 'magenta',
        sr: 'green',
        mt: 'yellow',
        nu: 'cyan',
    };
    let c = {
        kw: color_4.colors[exports.HIGHLIGHT.kw],
        sr: color_4.colors[exports.HIGHLIGHT.sr],
        mt: color_4.colors[exports.HIGHLIGHT.mt],
        nu: color_4.colors[exports.HIGHLIGHT.nu],
    };
    function ASTProgramToString(program) {
        return program.map(statement => ats(statement)).join("\n\n");
    }
    exports.ASTProgramToString = ASTProgramToString;
    function indentString(input, amount = PPINDENT) {
        return input.split('\n').map(l => ' '.repeat(amount) + l).join('\n');
    }
    function atss(nodes, join = ', ') {
        return nodes.map(n => ats(n)).join(join);
    }
    function ats(node) {
        if (node == null) {
            return '';
        }
        if (node instanceof ast_3.ASTBlock) {
            if (node.statements.length == 0) {
                return '{}';
            }
            const inside = node.statements.map(n => indentString(ats(n))).join('\n');
            return `{\n${inside}\n}`;
        }
        else if (node instanceof ast_3.ASTBinary) {
            const left = ats(node.left);
            const right = ats(node.right);
            if (node.left instanceof ast_3.ASTBinary) {
                if (ops_1.IsPreLower(node.operator.type, node.left.operator.type)) {
                    return `(${left}) ${node.operator.content} ${right}`;
                }
            }
            return `${left} ${node.operator.content} ${right}`;
        }
        else if (node instanceof ast_3.ASTUnary) {
            const value = ats(node.value);
            const op = node.operator;
            if (op.type == token_6.PlTokenType.INC || op.type == token_6.PlTokenType.DEC) {
                return `${value}${op.content}`;
            }
            if (op.type == token_6.PlTokenType.NOT) {
                return `${op.content} ${value}`;
            }
            return `${op.content}${value}`;
        }
        else if (node instanceof ast_3.ASTList) {
            return `${c.mt('list')}(${node.values.map(v => ats(v)).join(', ')})`;
        }
        else if (node instanceof ast_3.ASTDict) {
            return `${c.mt('dict')}(\n${indentString(node.keys.map((k, i) => ats(k) + ': ' + ats(node.values[i])).join(',\n'))}\n)`;
        }
        else if (node instanceof ast_3.ASTType) {
            return `${c.kw('type')} ${ats(node.name)} (\n${indentString(node.members.map(m => ats(m)).join(',\n'))}\n)`;
        }
        else if (node instanceof ast_3.ASTCall) {
            if (node.target instanceof ast_3.ASTDot) {
                return `${ats(node.target.left)}.${c.mt(ats(node.target.right))}(${node.args.map(v => ats(v)).join(', ')})`;
            }
            return `${c.mt(ats(node.target))}(${node.args.map(v => ats(v)).join(', ')})`;
        }
        else if (node instanceof ast_3.ASTAssign) {
            let out = "";
            if (node.pre) {
                out += ats(node.pre) + ".";
            }
            out += `${ats(node.variable)} = ${ats(node.value)}`;
            return out;
        }
        else if (node instanceof ast_3.ASTDot) {
            return `${ats(node.left)}.${ats(node.right)}`;
        }
        else if (node instanceof ast_3.ASTFunction) {
            return `${c.kw('func')} ${ats(node.name)}(${atss(node.args)}) ${ats(node.block)}`;
        }
        else if (node instanceof ast_3.ASTImpl) {
            return `${c.kw('impl')} ${ats(node.name)}(${atss(node.args)}) ${c.kw('for')} ${ats(node.target)} ${ats(node.block)}`;
        }
        else if (node instanceof ast_3.ASTImport) {
            let out = `${c.kw('import')} ${atss(node.path, '/')}`;
            if (node.alias) {
                out += ` ${c.kw('as')} ${ats(node.alias)}`;
            }
            else if (node.select) {
                out += ` ${c.kw('select')} ${atss(node.select)}`;
                if (node.select.length == 0) {
                    out += '*';
                }
            }
            return out;
        }
        else if (node instanceof ast_3.ASTExport) {
            return `${c.kw('export')} ${ats(node.content)}`;
        }
        else if (node instanceof ast_3.ASTReturn) {
            return `${c.kw('return')} ${ats(node.content)}`;
        }
        else if (node instanceof ast_3.ASTIf) {
            let out = node.conditions.map((e, i) => {
                let text = `${ats(e)} ${ats(node.blocks[i])}`;
                if (i == 0) {
                    text = c.kw('if') + ' ' + text;
                }
                else {
                    text = c.kw('elif') + ' ' + text;
                }
                return text;
            }).join(' ');
            if (node.other) {
                out += ` ${c.kw('else')} ${ats(node.other)}`;
            }
            return out;
        }
        else if (node instanceof ast_3.ASTEach) {
            let out = `${c.kw('each')} ${ats(node.value)}`;
            if (node.key) {
                out += `, ${ats(node.key)}`;
            }
            return out + ` ${c.kw('in')} ${ats(node.iterator)} ${ats(node.block)}`;
        }
        else if (node instanceof ast_3.ASTLoop) {
            let out = `${c.kw('loop')}`;
            if (node.amount) {
                out += ` ${ats(node.amount)}`;
            }
            return out + ` ${ats(node.block)}`;
        }
        else if (node instanceof ast_3.ASTWhile) {
            return `${c.kw('while')} ${ats(node.condition)} ${ats(node.block)}`;
        }
        else if (node instanceof ast_3.ASTFor) {
            return `${c.kw('for')} ${ats(node.start)}; ${ats(node.condition)}; ${ats(node.after)} ${ats(node.block)}`;
        }
        else if (node instanceof ast_3.ASTMatch) {
            let cases = node.cases.map((e, i) => {
                return indentString(`${c.kw('case')} ${atss(e)} ${ats(node.blocks[i])}`);
            }).join('\n');
            let other = '';
            if (node.other) {
                other = indentString(`\n${c.kw('default')} ${ats(node.other)}`);
            }
            return `${c.kw('match')} ${ats(node.value)} {\n${cases}${other}\n}`;
        }
        else if (node instanceof ast_3.ASTString) {
            return c.sr(`"${node.content}"`);
        }
        else if (node instanceof ast_3.ASTClosure) {
            return `${c.kw('func')}(${atss(node.args)}) ${ats(node.block)}`;
        }
        else if (node instanceof ast_3.ASTNumber) {
            return c.nu(node.value);
        }
        else if (node instanceof ast_3.ASTBreak || node instanceof ast_3.ASTContinue) {
            return c.kw(node.getSpanToken().content);
        }
        else {
            return node.getSpanToken().content;
        }
    }
});
define("compiler/parsing/highlighter", ["require", "exports", "compiler/parsing/visualizer", "compiler/parsing/ast", "inout/color", "compiler/lexing/token"], function (require, exports, visualizer_1, ast_4, color_5, token_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASTProgramHighlight = exports.ASTProgramToColorRegions = void 0;
    function NewPlColorRegion(info, color) {
        return {
            info,
            color
        };
    }
    function regionFits(row, col, region) {
        return row == region.info.row && (col >= (region.info.col - region.info.length) && col < (region.info.col));
    }
    function ASTProgramToColorRegions(ast) {
        const regions = [];
        function visitor(node) {
            if (node instanceof ast_4.ASTString) {
                const info = node.getSpanToken().info;
                regions.push(NewPlColorRegion(info, visualizer_1.HIGHLIGHT.sr));
            }
            else if (node instanceof ast_4.ASTImpl) {
                let info = node.tokens[0].info;
                regions.push(NewPlColorRegion(info, visualizer_1.HIGHLIGHT.kw));
                info = node.tokens[1].info;
                regions.push(NewPlColorRegion(info, visualizer_1.HIGHLIGHT.kw));
            }
            else if (node instanceof ast_4.ASTIf) {
                for (let i = 0; i < node.conditions.length; i++) {
                    const info = node.tokens[i].info;
                    regions.push(NewPlColorRegion(info, visualizer_1.HIGHLIGHT.kw));
                }
                if (node.other) {
                    const info = node.tokens[node.tokens.length - 1].info;
                    regions.push(NewPlColorRegion(info, visualizer_1.HIGHLIGHT.kw));
                }
            }
            else if (node instanceof ast_4.ASTReturn) {
                if (node.tokens.length > 0) {
                    const info = node.tokens[0].info;
                    regions.push(NewPlColorRegion(info, visualizer_1.HIGHLIGHT.kw));
                }
            }
            else if (node instanceof ast_4.ASTBinary) {
                const info = node.operator.info;
                if (node.operator.type == token_7.PlTokenType.AND || node.operator.type == token_7.PlTokenType.OR) {
                    regions.push(NewPlColorRegion(info, visualizer_1.HIGHLIGHT.kw));
                }
                else {
                    regions.push(NewPlColorRegion(info, visualizer_1.HIGHLIGHT.mt));
                }
            }
            else if (node instanceof ast_4.ASTAssign || node instanceof ast_4.ASTCreate) {
                const info = node.tokens[0].info;
                regions.push(NewPlColorRegion(info, visualizer_1.HIGHLIGHT.mt));
            }
            else if (node instanceof ast_4.ASTEach) {
                regions.push(NewPlColorRegion(node.tokens[0].info, visualizer_1.HIGHLIGHT.kw));
                regions.push(NewPlColorRegion(node.tokens[1].info, visualizer_1.HIGHLIGHT.kw));
            }
            else if (node instanceof ast_4.ASTLoop) {
                regions.push(NewPlColorRegion(node.tokens[0].info, visualizer_1.HIGHLIGHT.kw));
            }
            else if (node instanceof ast_4.ASTCall) {
                regions.push(NewPlColorRegion(node.target.lastToken().info, visualizer_1.HIGHLIGHT.mt));
            }
            else if (node instanceof ast_4.ASTBreak || node instanceof ast_4.ASTContinue
                || node instanceof ast_4.ASTBoolean || node instanceof ast_4.ASTNull
                || node instanceof ast_4.ASTFor || node instanceof ast_4.ASTWhile || node instanceof ast_4.ASTLoop
                || node instanceof ast_4.ASTFunction || node instanceof ast_4.ASTType || node instanceof ast_4.ASTClosure
                || node instanceof ast_4.ASTList || node instanceof ast_4.ASTDict) {
                regions.push(NewPlColorRegion(node.tokens[0].info, visualizer_1.HIGHLIGHT.kw));
            }
            else if (node instanceof ast_4.ASTNumber) {
                regions.push(NewPlColorRegion(node.getSpanToken().info, visualizer_1.HIGHLIGHT.nu));
            }
            else if (node instanceof ast_4.ASTUnary) {
                regions.push(NewPlColorRegion(node.operator.info, visualizer_1.HIGHLIGHT.mt));
            }
        }
        for (const s of ast) {
            visit(s, visitor);
        }
        return regions.sort((r1, r2) => {
            if (r1.info.row > r2.info.row) {
                return 1;
            }
            if (r2.info.row > r1.info.row) {
                return -1;
            }
            const r1col = r1.info.col - r1.info.length;
            const r2col = r2.info.col - r2.info.length;
            if (r1col > r2col)
                return 1;
            if (r2col > r1col)
                return -1;
            return 0;
        });
    }
    exports.ASTProgramToColorRegions = ASTProgramToColorRegions;
    function ASTProgramHighlight(regions, content) {
        const source = content.split('\n');
        let out = '';
        let regionOffset = 0;
        let state = null;
        for (let row = 0; row < source.length; row++) {
            const text = source[row];
            for (let col = 0; col < text.length; col++) {
                const newRegion = regions[regionOffset];
                const oldRegion = regions[regionOffset - 1];
                if (newRegion != null && regionFits(row, col, newRegion)) {
                    state = newRegion.color;
                    regionOffset += 1;
                }
                else if (oldRegion != null && !regionFits(row, col, oldRegion)) {
                    state = null;
                }
                if (state == null) {
                    out += text[col];
                }
                else {
                    out += color_5.colors[state](text[col]);
                }
            }
            out += '\n';
        }
        return out;
    }
    exports.ASTProgramHighlight = ASTProgramHighlight;
    function visit(node, closure) {
        if (node === null || node === undefined) {
            return;
        }
        closure(node);
        if (node instanceof ast_4.ASTBlock) {
            for (const s of node.statements) {
                visit(s, closure);
            }
        }
        else if (node instanceof ast_4.ASTBinary) {
            visit(node.left, closure);
            visit(node.right, closure);
        }
        else if (node instanceof ast_4.ASTUnary) {
            visit(node.value, closure);
        }
        else if (node instanceof ast_4.ASTList) {
            for (const v of node.values) {
                visit(v, closure);
            }
        }
        else if (node instanceof ast_4.ASTDict) {
            for (const v of Object.values(node.values)) {
                visit(v, closure);
            }
        }
        else if (node instanceof ast_4.ASTType) {
            visit(node.name, closure);
            for (const m of node.members) {
                visit(m, closure);
            }
        }
        else if (node instanceof ast_4.ASTCall) {
            visit(node.target, closure);
            for (const a of node.args) {
                visit(a, closure);
            }
        }
        else if (node instanceof ast_4.ASTDot) {
            visit(node.left, closure);
            visit(node.right, closure);
        }
        else if (node instanceof ast_4.ASTFunction) {
            visit(node.name, closure);
            for (const a of node.args) {
                visit(a, closure);
            }
            visit(node.block, closure);
        }
        else if (node instanceof ast_4.ASTImpl) {
            visit(node.name, closure);
            for (const a of node.args) {
                visit(a, closure);
            }
            visit(node.block, closure);
        }
        else if (node instanceof ast_4.ASTReturn) {
            visit(node.content, closure);
        }
        else if (node instanceof ast_4.ASTIf) {
            for (let i = 0; i < node.conditions.length; i++) {
                visit(node.conditions[i], closure);
                visit(node.blocks[i], closure);
            }
            visit(node.other, closure);
        }
        else if (node instanceof ast_4.ASTWhile) {
            visit(node.condition, closure);
            visit(node.block, closure);
        }
        else if (node instanceof ast_4.ASTFor) {
            visit(node.start, closure);
            visit(node.condition, closure);
            visit(node.after, closure);
            visit(node.block, closure);
        }
        else if (node instanceof ast_4.ASTMatch) {
            visit(node.value, closure);
            for (let i = 0; i < node.cases.length; i++) {
                for (const cond of node.cases[i]) {
                    visit(cond, closure);
                }
                visit(node.blocks[i], closure);
            }
        }
        else if (node instanceof ast_4.ASTClosure) {
            for (const a of node.args) {
                visit(a, closure);
            }
            visit(node.block, closure);
        }
        else if (node instanceof ast_4.ASTEach) {
            visit(node.key, closure);
            visit(node.value, closure);
            visit(node.iterator, closure);
            visit(node.block, closure);
        }
        else if (node instanceof ast_4.ASTLoop) {
            visit(node.amount, closure);
            visit(node.block, closure);
        }
        else if (node instanceof ast_4.ASTAssign || node instanceof ast_4.ASTCreate) {
            visit(node.pre, closure);
            visit(node.variable, closure);
            visit(node.value, closure);
        }
    }
});
define("linking/index", ["require", "exports", "compiler/lexing/index", "problem/index", "inout/file", "inout/index", "compiler/parsing/index", "vm/emitter/index", "vm/machine/index", "problem/interactive/index", "compiler/parsing/highlighter"], function (require, exports, lexing_2, problem_6, file_2, inout_6, parsing_2, emitter_3, machine_1, index_3, highlighter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReadFile = exports.RunVM = exports.RunVmFast = exports.RunFile = exports.RunOnce = exports.RunHighlighter = exports.TryRunParser = exports.RunEmitter = exports.RunParser = void 0;
    function RunParser(file) {
        const lexer = new lexing_2.default(file);
        const parser = new parsing_2.PlAstParser(lexer);
        const result = parser.parseAll();
        const problems = parser.getProblems();
        if (problems.length != 0) {
            problem_6.ReportProblems(file.content, problems);
            return null;
        }
        return result;
    }
    exports.RunParser = RunParser;
    function RunEmitter(file) {
        const ast = RunParser(file);
        if (ast == null) {
            return null;
        }
        return emitter_3.EmitProgram(ast, true);
    }
    exports.RunEmitter = RunEmitter;
    function TryRunParser(file) {
        const lexer = new lexing_2.default(file);
        const parser = new parsing_2.PlAstParser(lexer);
        const ast = parser.parseAll();
        if (ast == null) {
            return parser.getProblems();
        }
        return null;
    }
    exports.TryRunParser = TryRunParser;
    function RunHighlighter(file) {
        const lexer = new lexing_2.default(file);
        const parser = new parsing_2.PlAstParser(lexer);
        const ast = parser.parseAll();
        const problems = parser.getProblems();
        if (problems.length != 0) {
            problem_6.ReportProblems(file.content, problems);
            return;
        }
        const regions = highlighter_1.ASTProgramToColorRegions(ast);
        const out = highlighter_1.ASTProgramHighlight(regions, file.content);
        inout_6.default.print(out);
    }
    exports.RunHighlighter = RunHighlighter;
    function RunOnce(vm, file) {
        const lexer = new lexing_2.default(file);
        const parser = new parsing_2.PlAstParser(lexer);
        const ast = parser.parseAll();
        if (ast == null) {
            const problems = parser.getProblems();
            problem_6.ReportProblems(file.content, problems);
            return null;
        }
        const program = emitter_3.EmitProgram(ast);
        program.program.pop();
        for (const debug of program.debug) {
            debug.endLine += vm.program.program.length;
        }
        vm.addProgram(program, file.content);
        const out = vm.runProgram();
        if (out == null) {
            const trace = vm.getTrace();
            const problems = vm.getProblems();
            problem_6.ReportProblems(file.content, problems, trace);
            return null;
        }
        return vm.popStack();
    }
    exports.RunOnce = RunOnce;
    function RunFile(vm, file) {
        const lexer = new lexing_2.default(file);
        const parser = new parsing_2.PlAstParser(lexer);
        const ast = parser.parseAll();
        if (ast == null) {
            const problems = parser.getProblems();
            problem_6.ReportProblems(file.content, problems);
            return null;
        }
        const program = emitter_3.EmitProgram(ast);
        for (const debug of program.debug) {
            debug.endLine += vm.program.program.length;
        }
        vm.addProgram(program, file.content);
        const out = vm.runProgram();
        if (out == null) {
            const trace = vm.getTrace();
            const problems = vm.getProblems();
            problem_6.ReportProblems(file.content, problems, trace);
            return 1;
        }
        inout_6.default.flush();
        if (typeof out.value == "number")
            return out.value;
        return 0;
    }
    exports.RunFile = RunFile;
    function RunVmFast(file, args) {
        const lexer = new lexing_2.default(file);
        const parser = new parsing_2.PlAstParser(lexer);
        const vm = new machine_1.PlStackMachine(Object.assign(Object.assign({}, inout_6.default), { print: message => {
                inout_6.default.print(message);
                inout_6.default.flush();
            } }), file, args);
        let out = null;
        while (!parser.isEOF()) {
            const statement = parser.parseOnce();
            if (statement == null) {
                const problems = parser.getProblems();
                problem_6.ReportProblems(file.content, problems);
                return 1;
            }
            vm.addProgram(emitter_3.EmitStatement(statement));
            out = vm.runProgram();
            if (out == null) {
                const trace = vm.getTrace();
                const problems = vm.getProblems();
                problem_6.ReportProblems(file.content, problems, trace);
                return 1;
            }
        }
        if (typeof out.value == "number")
            return out.value;
        return 0;
    }
    exports.RunVmFast = RunVmFast;
    function RunVM(file, args) {
        const lexer = new lexing_2.default(file);
        const parser = new parsing_2.PlAstParser(lexer);
        const ast = parser.parseAll();
        if (ast == null) {
            const problems = parser.getProblems();
            problem_6.ReportProblems(file.content, problems);
            return 1;
        }
        const program = emitter_3.EmitProgram(ast, true);
        const vm = new machine_1.PlStackMachine(Object.assign(Object.assign({}, inout_6.default), { print: message => {
                inout_6.default.print(message);
                inout_6.default.flush();
            } }), file, args);
        vm.addProgram(program);
        const out = vm.runProgram();
        if (out == null) {
            const trace = vm.getTrace();
            const problems = vm.getProblems();
            const ok = problem_6.ReportProblems(file.content, problems, trace);
            if (ok && inout_6.default.options["mode"] == "debug" && ok && trace.length > 2 && index_3.IACTPrepare()) {
            }
            return 1;
        }
        inout_6.default.flush();
        if (typeof out.value == "number")
            return out.value;
        return 0;
    }
    exports.RunVM = RunVM;
    function ReadFile(filePath) {
        const path = require('path');
        inout_6.default.setRootPath(filePath);
        const filename = path.basename(filePath);
        const content = inout_6.default.readFile(filename, "rootPath");
        if (content === null) {
            inout_6.default.print(`Cannot read file '${filePath}'`);
            inout_6.default.print(`Reason: file doesn't exist or can't be read`);
            inout_6.default.flush();
            return null;
        }
        return file_2.NewPlFile(filename, content);
    }
    exports.ReadFile = ReadFile;
});
define("timestamp/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.timestamp = void 0;
    exports.timestamp = '2021-06-18T09:59:52.767Z';
});
define("repl/index", ["require", "exports", "inout/index", "linking/index", "problem/printer", "inout/color", "vm/machine/native/converter", "vm/machine/index", "inout/file", "timestamp/index", "compiler/lexing/index", "compiler/parsing/index", "vm/emitter/index", "compiler/parsing/visualizer", "vm/emitter/printer"], function (require, exports, inout_7, linking_1, printer_4, color_6, converter_10, machine_2, file_3, timestamp_1, lexing_3, parsing_3, emitter_4, visualizer_2, printer_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StartDemo = exports.StartREPL = exports.GetLine = void 0;
    function GetLine(filename) {
        let content = "";
        let firstPrompt = true;
        let linenum = 1;
        completer: while (true) {
            let out = firstPrompt ? `${filename}> ` : `${('' + linenum).padStart(filename.length, ' ')}| `;
            linenum += 1;
            const message = inout_7.default.input(out);
            if (message === null) {
                if (firstPrompt) {
                    return null;
                }
                break;
            }
            let oldContent = content;
            content += message;
            const file = file_3.NewPlFile(filename, content);
            const outcome = linking_1.TryRunParser(file);
            content += '\n';
            let oldFirstPrompt = firstPrompt;
            if (firstPrompt) {
                firstPrompt = false;
            }
            if (outcome != null) {
                for (const problem of outcome) {
                    if (problem.code.startsWith('CE')) {
                        continue completer;
                    }
                }
                if (!oldFirstPrompt) {
                    inout_7.default.print(`${printer_4.LogProblemShort(outcome[0])}`);
                    const result = inout_7.default.input(color_6.colors.magenta(`Undo line ${linenum - 1}? `) + `[${color_6.colors.green('y')}/n]: `);
                    if (result != 'n') {
                        linenum -= 1;
                        content = oldContent;
                        continue;
                    }
                }
            }
            break;
        }
        return content.slice(0, content.length - 1);
    }
    exports.GetLine = GetLine;
    function StartREPL(filename) {
        inout_7.default.print(`Welcome to the Deviation interactive console (version ${timestamp_1.timestamp})`);
        if (inout_7.isNode) {
            const os = require('os');
            inout_7.default.print(`Running on ${os.platform()}-${os.arch()}. Hello ${os.hostname()}!`);
            inout_7.default.print(`Press Ctrl+C to quit`);
        }
        let stream = false;
        const vm = new machine_2.PlStackMachine(Object.assign(Object.assign({}, inout_7.default), { input: message => {
                stream = true;
                return inout_7.default.input(message);
            }, print: message => {
                stream = true;
                inout_7.default.print(message);
                inout_7.default.flush();
            } }), file_3.NewPlFile('repl', ''));
        while (true) {
            stream = false;
            const line = GetLine(filename);
            if (line == null) {
                break;
            }
            const file = file_3.NewPlFile(filename, line);
            const result = linking_1.RunOnce(vm, file);
            if (stream == false && result != null) {
                inout_7.default.print(`${' '.repeat(filename.length)}> ${converter_10.PlConverter.PlToString(result, vm)}`);
            }
            vm.rearm();
        }
        inout_7.default.print("Input Terminated, Goodbye");
        inout_7.default.flush();
        return 0;
    }
    exports.StartREPL = StartREPL;
    function StartDemo(filename) {
        inout_7.default.print(`Running Deviation in demo mode (version ${timestamp_1.timestamp})`);
        if (inout_7.isNode) {
            inout_7.default.print("Press Ctrl-C to quit");
        }
        const vm = new machine_2.PlStackMachine(Object.assign(Object.assign({}, inout_7.default), { input: _ => { return ''; }, print: _ => { } }), file_3.NewPlFile('demo', ''));
        while (true) {
            const line = GetLine(filename);
            if (line == null) {
                break;
            }
            const file = file_3.NewPlFile(filename, line);
            inout_7.default.print("[Running] Lexing and Parsing...");
            const lexer = new lexing_3.default(file);
            const parser = new parsing_3.PlAstParser(lexer);
            const ast = parser.parseAll();
            if (ast == null) {
                inout_7.default.print("[Error] Parser error found, try again?");
                continue;
            }
            inout_7.default.print("[Display] Printing Parser output");
            inout_7.default.print(visualizer_2.ASTProgramToString(ast));
            inout_7.default.print('');
            inout_7.default.print("[Running] Emitting bytecodes...");
            const program = emitter_4.EmitProgram(ast);
            inout_7.default.print("[Display] Printing bytecodes");
            inout_7.default.print(printer_5.PlProgramToString(program));
            inout_7.default.print('');
            inout_7.default.print("[Running] Executing Virtual Machine");
            program.program.pop();
            vm.addProgram(program, file.content);
            const result = vm.runProgram();
            if (result == null) {
                inout_7.default.print("[Error] VM error found, try again?");
                vm.rearm();
                continue;
            }
            const out = vm.popStack();
            let str = "empty";
            if (out != null) {
                str = converter_10.PlConverter.PlToString(out, vm);
            }
            inout_7.default.print("[Display] Printing expression result");
            inout_7.default.print(`${' '.repeat(filename.length)}> ${str}`);
            vm.rearm();
        }
        inout_7.default.print("Input Terminated, demo stopped");
        inout_7.default.flush();
        return 0;
    }
    exports.StartDemo = StartDemo;
});
define("cli/constants", ["require", "exports", "inout/index"], function (require, exports, inout_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PNAME = void 0;
    exports.PNAME = null;
    if (inout_8.isNode) {
        const path = require('path');
        exports.PNAME = path.relative(inout_8.default.paths.cliPath, process.argv[0]);
        if (process.platform == "win32") {
            exports.PNAME += ".exe";
        }
        else {
            exports.PNAME = `./${exports.PNAME}`;
        }
    }
});
define("cli/error", ["require", "exports", "inout/index", "inout/color", "cli/constants"], function (require, exports, inout_9, color_7, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogCliError = exports.NewCliError = void 0;
    function NewCliError(index, reason) {
        return {
            index,
            reason
        };
    }
    exports.NewCliError = NewCliError;
    function LogCliError(args, error) {
        const { index, reason } = error;
        inout_9.default.print(color_7.colors.red(`CLI Problems:`));
        inout_9.default.print(`> ${constants_1.PNAME} ${args.join(' ')}`);
        let offset = constants_1.PNAME.length + 3;
        for (let i = 0; i < index; i++) {
            offset += args[i].length + 1;
        }
        inout_9.default.print(' '.repeat(offset) + color_7.colors.red('^'.repeat(args[index].length) + " here"));
        inout_9.default.print('');
        inout_9.default.print(`${color_7.colors.yellow('Tip')}: run '${constants_1.PNAME} --help' to see the correct usages`);
        inout_9.default.print(`${color_7.colors.cyan('Reason')}: ${reason}`);
    }
    exports.LogCliError = LogCliError;
});
define("cli/options", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MatchOption = exports.CLI_OPTIONS = exports.MatchFlag = exports.MatchPrefix = exports.CLI_FLAGS = exports.CLI_PREFIX = void 0;
    exports.CLI_PREFIX = "--";
    exports.CLI_FLAGS = [
        "run-demo",
        "run-repl",
        "run-compiler",
        "run-emitter",
        "run-highlighter",
        "help",
        "mode-release",
        "mode-debug",
        "view-problems"
    ];
    function MatchPrefix(raw) {
        if (!raw.startsWith(exports.CLI_PREFIX)) {
            return null;
        }
        return raw.substring(exports.CLI_PREFIX.length);
    }
    exports.MatchPrefix = MatchPrefix;
    function MatchFlag(flag) {
        return exports.CLI_FLAGS.includes(flag);
    }
    exports.MatchFlag = MatchFlag;
    exports.CLI_OPTIONS = [
        "lib"
    ];
    function MatchOption(text) {
        return exports.CLI_OPTIONS.includes(text);
    }
    exports.MatchOption = MatchOption;
});
define("cli/index", ["require", "exports", "cli/error", "cli/options"], function (require, exports, error_1, options_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CliArguments = void 0;
    class CliArguments {
        constructor(error, raw = [], flags = [], options = {}) {
            this.raw = raw;
            this.flags = flags;
            this.options = options;
            this.error = error;
        }
        is(flag) {
            return this.flags.includes(flag);
        }
        option(key) {
            return this.options[key];
        }
        getError() {
            return this.error;
        }
        getArgSize() {
            return this.raw.length;
        }
        getArgFirst() {
            return this.raw[0];
        }
        getArgRest() {
            return this.raw.slice(1);
        }
        getArgs() {
            return this.raw;
        }
        static Parse(args) {
            let parsingRaw = false;
            const raw = [], flags = [], options = {};
            for (let i = 0; i < args.length; i++) {
                let arg = args[i];
                if (parsingRaw) {
                    raw.push(arg);
                    continue;
                }
                const flag = options_1.MatchPrefix(arg);
                if (flag == null) {
                    raw.push(arg);
                    parsingRaw = true;
                    continue;
                }
                const index = flag.indexOf("=");
                if (index == -1) {
                    if (options_1.MatchFlag(flag)) {
                        flags.push(flag);
                    }
                    else {
                        return new CliArguments(error_1.NewCliError(i, `no flag called '${arg}'`));
                    }
                }
                else {
                    const key = flag.substring(0, index);
                    if (!options_1.MatchOption(key)) {
                        return new CliArguments(error_1.NewCliError(i, `no option called '${key}'`));
                    }
                    const value = flag.substring(index + 1);
                    options[key] = value;
                }
            }
            return new CliArguments(null, raw, flags, options);
        }
    }
    exports.CliArguments = CliArguments;
});
define("cli/magic", ["require", "exports", "repl/index", "inout/index", "inout/color", "cli/constants", "problem/printer"], function (require, exports, repl_1, inout_10, color_8, constants_2, printer_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CliHandleMagicFlags = void 0;
    function CliHandleMagicFlags(args) {
        if (args.is("help")) {
            inout_10.default.print(`Usage: ${constants_2.PNAME} ...flags [file] ...program_arguments

${color_8.colors.cyan('Examples')}
${constants_2.PNAME} code.de                  ~ Run the file called [code.de]
${constants_2.PNAME}                          ~ Start the repl
${constants_2.PNAME} --run-emitter code.de    ~ Run the file called [code.de] with the emitter only 

${color_8.colors.cyan('Flags')} (all flags begin with '--')
help            ~ Show this message

run-repl        ~ Start the repl (default method if no [file] is supplied
run-demo        ~ Start the repl in demo mode
run-compiler    ~ Run [file] with the compiler only
run-emitter     ~ Run [file] with the emitter only
run-highlighter ~ Display [file] contents with a syntax highlighter

view-problems   ~ View problems in detail. View all problems if there is no arguments.

mode-debug      ~ Run [file] in debug mode, will show more detailed errors
mode-release    ~ Run [file] in release mode, have no detailed errors
`);
            return false;
        }
        if (args.is("view-problems")) {
            inout_10.default.print(printer_6.LogProblemList(args.getArgs()));
            return false;
        }
        if (args.is("run-demo")) {
            repl_1.StartDemo("demo");
            return false;
        }
        if (args.is("mode-release")) {
            inout_10.default.options["mode"] = "release";
        }
        if (args.is("run-demo") || args.is("run-repl") || args.raw.length == 0) {
            inout_10.default.options["run"] = "repl";
        }
        return true;
    }
    exports.CliHandleMagicFlags = CliHandleMagicFlags;
});
define("index", ["require", "exports", "repl/index", "inout/index", "linking/index", "cli/index", "cli/magic", "cli/error", "compiler/parsing/visualizer", "vm/emitter/printer"], function (require, exports, repl_2, inout_11, linking_2, cli_1, magic_1, error_2, visualizer_3, printer_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const striped = process.argv.slice(2);
    const args = cli_1.CliArguments.Parse(striped);
    let error;
    if ((error = args.getError()) != null) {
        error_2.LogCliError(striped, error);
        process.exit(1);
    }
    const cont = magic_1.CliHandleMagicFlags(args);
    if (!cont) {
        process.exit(0);
    }
    if (!inout_11.isNode || args.getArgSize() == 0 || args.is("run-repl")) {
        const result = repl_2.StartREPL("repl");
        process.exit(result);
    }
    else {
        const filePath = args.getArgFirst();
        const file = linking_2.ReadFile(filePath);
        if (file == null) {
            process.exit(1);
        }
        const extras = args.option("lib");
        if (extras) {
            for (const fp of extras.split(',')) {
                const f = linking_2.ReadFile(fp);
                if (f == null) {
                    process.exit(1);
                }
                file.content = f.content + '\n' + file.content;
            }
        }
        if (args.is("run-compiler")) {
            const out = linking_2.RunParser(file);
            if (out != null) {
                inout_11.default.print(visualizer_3.ASTProgramToString(linking_2.RunParser(file)));
            }
            process.exit(0);
        }
        if (args.is("run-emitter")) {
            const out = linking_2.RunEmitter(file);
            if (out != null) {
                inout_11.default.print(printer_7.PlProgramToString(out));
                inout_11.default.print(`Emitted ${out.program.length} instructions, with ${out.debug.length} debug messages`);
            }
            process.exit(0);
        }
        if (args.is('run-highlighter')) {
            linking_2.RunHighlighter(file);
            process.exit(0);
        }
        if (args.is("mode-release")) {
            const code = linking_2.RunVmFast(file, args.getArgRest());
            process.exit(code);
        }
        const result = linking_2.RunVM(file, args.getArgRest());
        process.exit(result);
    }
});
define("browser/exports", ["require", "exports", "inout/file", "compiler/lexing/index", "compiler/parsing/index", "compiler/parsing/highlighter", "vm/emitter/index", "vm/machine/index", "inout/index", "problem/printer", "extension/types", "linking/index"], function (require, exports, file_4, lexing_4, parsing_4, highlighter_2, emitter_5, machine_3, inout_12, printer_8, types_3, linking_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IsVariableRest = exports.IsVariableHead = exports.Errors = exports.Execute = exports.Highlight = void 0;
    function Highlight(text) {
        const file = file_4.NewPlFile("highlighter", text);
        const lexer = new lexing_4.default(file);
        const parser = new parsing_4.PlAstParser(lexer);
        const ast = parser.parseAll();
        const problems = parser.getProblems();
        if (problems.length != 0) {
            return null;
        }
        return highlighter_2.ASTProgramToColorRegions(ast);
    }
    exports.Highlight = Highlight;
    function Execute(text, std) {
        const file = file_4.NewPlFile("execute", text);
        const lexer = new lexing_4.default(file);
        const parser = new parsing_4.PlAstParser(lexer);
        const ast = parser.parseAll();
        if (ast == null) {
            const problems = parser.getProblems();
            const buffer = [];
            for (const p of problems) {
                buffer.push(printer_8.LogProblemShort(p));
            }
            std.print(buffer.join("\n"));
            std.flush();
            return 1;
        }
        const program = emitter_5.EmitProgram(ast, true);
        const vm = new machine_3.PlStackMachine(Object.assign(Object.assign(Object.assign({}, inout_12.default), std), { print: message => {
                std.print(message);
                std.flush();
            } }), file, []);
        vm.addProgram(program);
        const out = vm.runProgram();
        if (out == null) {
            const problems = vm.getProblems();
            const buffer = [];
            for (const p of problems) {
                buffer.push(printer_8.LogProblemShort(p));
            }
            std.print(buffer.join("\n"));
            std.flush();
            return 1;
        }
        std.flush();
        if (typeof out.value == "number")
            return out.value;
        return 0;
    }
    exports.Execute = Execute;
    function Errors(text) {
        return linking_3.TryRunParser(file_4.NewPlFile("errors", text));
    }
    exports.Errors = Errors;
    function IsVariableHead(c) {
        return types_3.isvariablefirst(c);
    }
    exports.IsVariableHead = IsVariableHead;
    function IsVariableRest(c) {
        return types_3.isvariablerest(c);
    }
    exports.IsVariableRest = IsVariableRest;
});
define("browser/index", ["require", "exports", "linking/index", "inout/file", "vm/machine/index", "inout/index"], function (require, exports, linking_4, file_5, machine_4, inout_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const attribute = "application/devia";
    function getSources() {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = Array.from(document.querySelectorAll(`script[type="${attribute}"]`));
            const out = [];
            let i = 0;
            for (const node of nodes) {
                i++;
                const src = node.getAttribute('src');
                if (src != null) {
                    try {
                        const path = window.location.pathname.split('/');
                        path.pop();
                        const data = yield fetch(`${window.location.origin + path.join('/')}/${src}`);
                        if (!data.ok) {
                            throw null;
                        }
                        const text = yield data.text();
                        out.push(file_5.NewPlFile(src, text));
                        console.debug(`loaded external script '${src}'`);
                    }
                    catch (e) {
                        alert(`there is no file called ${src}\nhalting devia interpreter...`);
                        return [];
                    }
                }
                else {
                    out.push(file_5.NewPlFile(`browser${i}`, node.innerText));
                }
            }
            return out;
        });
    }
    function ready(fn) {
        if (document.readyState != 'loading') {
            fn();
        }
        else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        }
        else {
            document.attachEvent('onreadystatechange', function () {
                if (document.readyState != 'loading')
                    fn();
            });
        }
    }
    ready(() => __awaiter(void 0, void 0, void 0, function* () {
        const sources = yield getSources();
        const vm = new machine_4.PlStackMachine(Object.assign(Object.assign({}, inout_13.default), { print: message => {
                inout_13.default.print(message);
                inout_13.default.flush();
            } }), file_5.NewPlFile('browser.de', ''), []);
        for (const source of sources) {
            const code = linking_4.RunFile(vm, source);
            console.debug(`[${source.filename}] sync return code: ${code}`);
            if (code !== 0) {
                break;
            }
        }
    }));
});
define("browser/repl", ["require", "exports", "repl/index"], function (require, exports, repl_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    repl_3.StartREPL("repl");
});
define("inout/buffer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlBuffer = void 0;
    const MAXBUFFER = 5;
    class PlBuffer {
        constructor(limit = MAXBUFFER) {
            this.limit = limit;
            this.buffer = [];
        }
        push(item) {
            this.buffer.push(item);
            return this.buffer.length > this.limit;
        }
        isEmpty() {
            return this.buffer.length === 0;
        }
        empty() {
            const out = this.buffer;
            this.buffer = [];
            return out;
        }
    }
    exports.PlBuffer = PlBuffer;
});
define("inout/proxy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MaskedEval = void 0;
    function MaskedEval(src, ctx = {}) {
        ctx = new Proxy(ctx, {
            has: () => true
        });
        let func = (new Function("with(this) { " + src + "}"));
        func.call(ctx);
    }
    exports.MaskedEval = MaskedEval;
});
define("inout/nodeInout", ["require", "exports", "fs", "path", "prompt-sync", "prompt-sync-history", "inout/proxy"], function (require, exports, fs, path, ps, psh, proxy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.options = exports.execute = exports.readFile = exports.setRootPath = exports.paths = exports.input = exports.flush = exports.print = void 0;
    function complete(commands) {
        return function (str) {
            if (str.length == 0) {
                return [];
            }
            let ret = [];
            for (let i = 0; i < commands.length; i++) {
                if (commands[i] == str) {
                    return [];
                }
                if (commands[i].indexOf(str) == 0)
                    ret.push(commands[i]);
            }
            return ret;
        };
    }
    const ac = "func impl import for as select export return break continue if elif else each loop while match case default and or not in print input list dict true false null Int Str Null List Dict Func Type";
    const prompt = ps({
        history: psh(),
        autocomplete: complete(ac.split(' '))
    });
    function print(message) {
        console.log(message);
    }
    exports.print = print;
    function flush() {
        return;
    }
    exports.flush = flush;
    function input(message) {
        return prompt(message);
    }
    exports.input = input;
    exports.paths = {
        cliPath: process.cwd(),
        exePath: process.execPath,
        rootPath: process.execPath
    };
    function setRootPath(rootFile) {
        exports.paths.rootPath = path.join(exports.paths.cliPath, path.dirname(rootFile));
    }
    exports.setRootPath = setRootPath;
    function readFile(filePath, type) {
        try {
            const absPath = path.join(exports.paths[type], filePath);
            return fs.readFileSync(absPath, { encoding: 'utf8', flag: 'r' });
        }
        catch (_a) {
            return null;
        }
    }
    exports.readFile = readFile;
    function execute(code, vars) {
        proxy_1.MaskedEval(code, Object.assign({ console,
            Math,
            Date,
            Object,
            Number,
            Array,
            String,
            Function,
            Boolean,
            Symbol,
            Error,
            BigInt,
            RegExp,
            Map,
            Set,
            JSON,
            Promise, require: p => {
                return require(path.join(exports.paths.rootPath, p));
            }, global }, vars));
    }
    exports.execute = execute;
    exports.options = {
        mode: "debug",
        run: "file",
    };
});
define("inout/otherInout", ["require", "exports", "inout/buffer", "inout/proxy"], function (require, exports, buffer_1, proxy_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.options = exports.execute = exports.readFile = exports.setRootPath = exports.paths = exports.flush = exports.input = exports.print = void 0;
    const g = Function('return this')();
    const extern = g ? g.extern : globalThis.extern;
    const buffer = new buffer_1.PlBuffer();
    function print(message) {
        if (extern && extern.print) {
            return extern.print(message);
        }
        if (buffer.push(message)) {
            alert(buffer.empty().join('\n'));
        }
    }
    exports.print = print;
    function input(message) {
        if (extern && extern.input) {
            return extern.input(message);
        }
        flush();
        return prompt(message);
    }
    exports.input = input;
    function flush() {
        if (extern && extern.flush) {
            return extern.flush();
        }
        if (!buffer.isEmpty()) {
            alert(buffer.empty().join('\n'));
        }
    }
    exports.flush = flush;
    exports.paths = {
        cliPath: '/',
        exePath: '/',
        rootPath: '/'
    };
    function setRootPath(rootFile) {
        exports.paths.rootPath = rootFile;
    }
    exports.setRootPath = setRootPath;
    function readFile(filePath, type) {
        return null;
    }
    exports.readFile = readFile;
    function execute(code, vars) {
        proxy_2.MaskedEval(code, Object.assign({ console,
            Math,
            Date,
            Object,
            Number,
            Array,
            String,
            Function,
            Boolean,
            Symbol,
            Error,
            BigInt,
            RegExp,
            Map,
            Set,
            JSON,
            Promise,
            document,
            window,
            navigator }, vars));
    }
    exports.execute = execute;
    exports.options = {
        mode: "debug",
        run: "file",
    };
});
//# sourceMappingURL=index.js.map