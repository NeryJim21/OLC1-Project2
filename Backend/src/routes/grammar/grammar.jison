//Análisis lexico
%lex

%options case-insensitive

%%

\s+                                 {} //Ignora espacios
[ \r\t]+                            {}
\n                                  {}
"//".*                              {} //Comentario simple
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] {} //Comentario multilínea

//PALABRAS RESERVADAS
//Tipos de datos
"int"               return 'PR_INT';
"double"            return 'PR_DOUBLE';
"boolean"           return 'PR_BOOLEAN';
"char"              return 'PR_CHAR';
"string"            return 'PR_STRING';

//Estructuras
"new"               return 'PR_NEW';
"list"              return 'PR_LIST';
"add"               return 'PR_ADD';

//Sentencias de control
"if"                return 'PR_IF';
"else"              return 'PR_ELSE';
"switch"            return 'PR_SWITCH';
"case"              return 'PR_CASE';
"default"           return 'DEFAULT';
"break"             return 'BREAK';

//Sentencias cíclicas
"while"             return 'PR_WHILE';
"for"               return 'PR_FOR';
"do"                return 'PR_DO';
"continue"          return 'PR_CONTINUE';

//Funciones - Metodos
"return"            return 'PR_RETURN';
"void"              return 'PR_VOID';

//Funciones Nativas
"print"             return 'PR_PRINT';
"toLower"           return 'PR_TOLOWER';
"toUpper"           return 'PR_TOUPPER';
"length"            return 'PR_LENGTH';
"truncate"          return 'PR_TRUNCATE';
"round"             return 'PR_ROUND';
"typeof"            return 'PR_TYPEOF';
"toString"          return 'PR_TOSTRING';
"toCharArray"       return 'PR_TOCHARARRAY';
"main"              return 'PR_MAIN';

//SIMBOLOS
//Secuancia de escape
//"\\n"               return '\\n';
//"\\\\"              return '\\\\';
//"\\\"               return '\\\"';
//"\\t"               return '\\t';
//"\\\'"              return '\\\'';

//Operadores relacionales
"="                 return '=';
"=="                return '==';
"!="                return '!=';
"<"                 return '<';
">"                 return '>';
"<="                return '<=';
">="                return '>=';

//Operador ternario
"?"                 return '?';

//Operadores lógicos
"||"                return '||';
"&&"                return '&&';
"!"                 return '!';

//Operadores aritméticos
"++"                return '++';
"--"                return '--';
"+"                 return '+';
"-"                 return '-';
"*"                 return '*';
"/"                 return '/';
"^"                 return '^';
"%"                 return '%';

//Caracteres de finalización y encapsulamiento
"("                 return '(';
")"                 return ')';
"{"                 return '{';
"}"                 return '}';
"["                 return '[';
"]"                 return ']';
";"                 return ';';
","                 return ',';
":"                 return ':';
"."                 return '.';

//Expresiones regulares
\"((\\\")|[^\"\n])*\"                           { yytext = yytext.substr(1, yyleng-2); return 'STR'; }
\'((\\\\)|(\\n)|(\\t)|(\\\")|(\\\')|[^\'\n])\'  { yytext = yytext.substr(1, yyleng-2); return 'CHAR'; }
[0-9]+"."[0-9]+\b               return 'DECIMAL';
[0-9]+\b                        return 'NUMBER';
"true"                          return 'TRUE';
"false"                         return 'FALSE';
([a-zA-Z])[a-zA-Z0-9_]*         return 'ID';

<<EOF>>                         return 'EOF';

.                               return 'INVALID';

/lex

//Precedencias
%left '?' ':'
%left '||'
%left '&&'
%right '!'
%left '==' '!=' '>=' '<=' '>' '<'
%left '+' '-'
%left '*' '/' '%'
%left '^'
%left '++' '--'
%right UCAST
%left UMINUS

// Análisis Sintactico
%start init

%%

init: cuerpo EOF
;

cuerpo:   cuerpo instruccion
        | instruccion
; 

instruccion:  declaracion ';'
            | asignacion ';'
;

declaracion:  tipo ID '=' expresion
            | tipo ID
;

tipo: PR_INT
    | PR_DOUBLE
    | PR_BOOLEAN
    | PR_CHAR
    | PR_STRING
;

expresion: valor
;

valor:    DECIMAL
        | NUMBER
        | FALSE
        | TRUE
        | CHAR
        | STR
        | ID
;

asignacion:   ID '=' expresion
            | ID '++'
            | ID '--'
;