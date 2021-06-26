```

```

# Syntax & Playground

Language BNF Syntax:
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
