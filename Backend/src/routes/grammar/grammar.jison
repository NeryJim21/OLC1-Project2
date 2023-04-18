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
"default"           return 'PR_DEFAULT';
"break"             return 'PR_BREAK';

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

init:             globalBody EOF
;

globalBody:       globalBody global
                | global
; 

global:           assigment ';'
                | statment ';'
                | vector ';'
                | list ';'
                | main ';'
                | method
                | error ';'
                | error '}'
;

localBody:        localBody local
                | local
;

local:            callmethod ';'
                | assigment ';'
                | conditionals
                | statment ';'
                | control ';'
                | vector ';'
                | cyclicals
                | print ';'
                | list ';'
;

main:             PR_MAIN callmethod
;

method:           PR_VOID ID '(' parameters ')' '{' localBody '}'
                | type ID '(' parameters ')' '{' localBody '}'
                | PR_VOID ID '(' ')' '{' localBody '}'
                | type ID '(' ')' '{' localBody '}'
;

callmethod:       ID '(' attributes ')'
                | ID '(' ')'
;

callfunction:     ID '(' attributes ')'
                | ID '(' ')'
;

parameters:       parameters ',' type ID
                | type ID
;

attributes:       attributes ',' expression
                | expression
;

print:            PR_PRINT '(' expression ')'
                | PR_PRINT '(' ')'
;

statment:         type ID '=' expression
                | tipo ID
;

assigment:        ID '=' expression
                | ID '++'
                | ID '--'
;

vector:           vectorStatment
                | assigVector
;

vectorStatment:   type '[' ']' ID '=' PR_NEW type '[' expression ']' 
                | type '[' ']' ID '=' '{' attributes '}'
                | type '[' ']' ID '=' toChar
;

assigVector:      ID '[' expression ']' '=' expression 
;

list:             listStarment
                | assigList
;

listStarment:     PR_LIST  '<' type '>' ID '=' PR_NEW PR_LIST '<' type '>'
                | PR_LIST  '<' type '>' ID '=' toChar
;

assigList:        ID '.' PR_ADD '(' expression ')'
                | ID '[' '[' expression ']' ']' '=' expression
;

valuetype:        DECIMAL
                | NUMBER
                | FALSE
                | TRUE
                | CHAR
                | STR
                | ID
;

type:             PR_INT
                | PR_DOUBLE
                | PR_BOOLEAN
                | PR_CHAR
                | PR_STRING
;


expression:       expression '&&' expression
                | expression '||' expression
                | '!' expression
                | expression '==' expression
                | expression '!=' expression
                | expression '<=' expression
                | expression '>=' expression
                | expression '<' expression
                | expression '>' expression
                | expression '+' expression
                | expression '-' expression
                | expression '*' expression
                | expression '/' expression
                | expression '%' expression
                | expression '^' expression
                | '-' expression %prec UMINUS
                | expression '++'
                | expression '--'
                | ternary
                | casting
                | function
                | valuetype
                | structures
                | callfunction
                | '(' expression ')'
;

casting:          '(' type ')' expression %prec UCAST
;

structures:       ID '[' expression ']'
                | ID '[' '[' expression ']' ']'
;

ternary:          expression '?' expression ':' expression
;

function:         PR_TRUNCATE '(' expression ')'
                | PR_LENGTH '(' expression')'
                | PR_TYPEOF '(' expression')'
                | PR_TOLOWER '(' expression')'
                | PR_TOUPPER '(' expression')'
                | PR_ROUND '(' expression')'
                | PR_TOSTRING '(' expression')'
;

toChar:           PR_TOCHARARRAY '(' expression ')'
;

conditionals:     ifcondition
                | switchcondition
;

ifcondition:      PR_IF '(' expression ')' '{' localBody '}' elsecondition
                | PR_IF '(' expression ')' '{' localBody '}'
                | PR_IF '(' expression ')' '{' '}' elsecondition
                | PR_IF '(' expression ')' '{' '}'
;

elsecondition:    PR_ELSE ifcondition
                | PR_ELSE '{' localBody '}'
                | PR_ELSE '{' '}'
;

switchcondition:  PR_SWITCH '(' expression ')' '{' casecondition defaultcondition '}'
                | PR_SWITCH '(' expression ')' '{' casecondition '}'
                | PR_SWITCH '(' expression ')' '{' default '}'
                | PR_SWITCH '(' expression ')' '{' '}'
;

casecondition:    casecondition PR_CASE expression ':' localBody
                | casecondition PR_CASE expression ':'
                | PR_CASE expression ':' localBody
                | PR_CASE expression ':'
;

defaultcondition: PR_DEFAULT ':' localBody
                | PR_DEFAULT ':'
;

cyclicals:        whilecycle
                | forcycle
;

whilecycle:       PR_DO '{' localBody '}' PR_WHILE '(' expression ')' ';'
                | PR_WHILE '(' expression ')' '{' localBody '}'
                | PR_DO '{' '}' PR_WHILE '(' expression ')' ';'
                | PR_WHILE '(' expression ')' '{' '}'
;

forcycle:         PR_FOR '(' assigmentFor ';' expression ';' assigment ')' '{' localBody '}'
                | PR_FOR '(' statmentFor ';' expression ';' assigment ')' '{' localBody '}'
;

statmentFor:      type ID '=' expression
;

assigmentFor:     ID '=' expression
;

control:          PR_RETURN expression
                | PR_RETURN
                | PR_CONTINUE
                | PR_BREAK
;
