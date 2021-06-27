```

```

# Syntax & Playground

### List of Type Functions
```
#!/out
func tfun(t) {
    all = debug.globals()
    out = list()
    each fn, name of all {
        if fn.type() /= Func {
            continue
        }
        parts = name.split("@")
        if Str(t) == parts.1 {
            out.add("\(parts.1).\(parts.2)(\(fn.params().join(", ")))")
        }
    }
    return out.sort().join("\n")
}

types = list(Num, Str, Bool, List, Dict, Func)
each t of types {
    say("[\(t)]")
    say(tfun(t))
    say(" ")
}
```

### Global Modules
```
#!/out
all = debug.globals()
out = list()
each module, name of all {
    if module.type() /= Dict {
        continue
    }
    say("[\(name)]")
    each value, key of module {
        if value.is(Func) {
            say("\(name).\(key)(\(value.params().join(", ")))")
        } else {
            say("\(name).\(key) = \(value.type())")
        }
    }
    say(" ")
}
```

### Special Function
```
#!/out
all = debug.globals()
each fn, name of all {
    if fn.type() /= Func {
        continue
    }
    if name.have("@") {
        continue
    }
    say("\(name)(\(fn.params().join(", ")))")
}
```


### Language BNF Syntax:
```
#!/raw
program     ::= statement* EOF

statement   ::= (block | function | type | impl | import | export | return | continue | break | if | each | loop | while | for | match | expression) (";"? LF | ";")

block       ::= "{" statement* "}"
function    ::= "func" VARIABLE "(" param? ")" block
impl        ::= "impl" VARIABLE "(" param? ")" "for" expression block
import      ::= "import" path ( "as" VARIABLE | "select" ( "*" | param) )
export      ::= "export" expression
type        ::= "type" VARIABLE "(" param ")"

return      ::= "return" expression?
break       ::= "break"
continue    ::= "continue"

if          ::= "if" expression block ("elif" expression block)* ("else" block)? 
each        ::= "each" VARIABLE ("," VARIABLE)? "in" expression block
loop        ::= "loop" expression? block
while       ::= "while" expression block
for         ::= "for" expression? ";" expression? ";" expression? block
match       ::= "match" expression "{" ( "case" expression block | "default" block )* "}"

expression  ::= equals

equals      ::= ( call "." ) VARIABLE "=" equals | primary
logical     ::= compare ( ( "and" | "or" ) compare )*
compare     ::= plus ( ( ">" | ">=" | "<" | "<=" | "==" | "/=" ) plus )*
plus        ::= mult ( ( "+" | "-" ) mult )*
mult        ::= prefix ( ( "*" | "/" ) prefix )*
prefix      ::= ( "not" | "-" | "+" ) prefix | postfix
postfix     ::= call ( "++" | "--" )*
call        ::= primary (( "(" args? ")" | "." VARIABLE | args? )*
primary     ::= VARIABLE | INTEGER | BOOLEAN | NULL | STRING | list | dict | closure | "(" expression ")"
list        ::= "list" "(" args? ")"
dict        ::= "dict" "(" ( pair ( "," pair )* )? ")"
closure     ::= "func" "(" param? ")" (block | expression)

folder      ::= ("." | ".." | VARIABLE)
path        ::= folder ( "/" folder ) *
param       ::= VARIABLE ("," VARIABLE)*
args        ::= expression ("," expression)
pair        ::= ( VARIABLE | INTEGER ) ":" expression

INTEGER     ::= "regexp:\d+"
BOOLEAN     ::= "regexp:(true|false)"
NULL        ::= "regexp:null"
STRING      ::= "regexp:\"(\\.|[^"])*\""
VARIABLE    ::= "regexp:[a-zA-Z_][\w?!_]*"
EOF         ::= ""
LF          ::= "regexp:\r?\n"
```
