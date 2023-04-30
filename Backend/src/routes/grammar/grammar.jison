//Imports
%{
    //Errores
    const { errors, output } = require('../reports/report');
    const { Error } = require('../reports/report')

    // Tipos
    const { ValueType } = require('../types/type');

    // Declaraciones
    const { NewVector } = require('../instructions/statment/newVector');
    const { Statment } = require('../instructions/statment/statment');
    const { NewList } = require('../instructions/statment/newList');

    // Asignaciones
    const { AssingCrement, AssigType } = require('../instructions/assigment/assingCrement.ts');
    const { AssigVector } = require('../instructions/assigment/assigVector');
    const { AssigList } = require('../instructions/assigment/assigList');
    const { Assigment } = require('../instructions/assigment/assigment');
    const { PushList } = require('../instructions/assigment/pushList');

    // Funciones
    const { CallMethod } = require('../instructions/functions/callMethod');
    const { Parameters } = require('../instructions/functions/parameters');
    const { Function } = require('../instructions/functions/function');
    const { CallFunction } = require('../expressions/callFunction');
    const { Main } = require('../instructions/functions/main');

    // Control
    const { Continue } = require('../instructions/control/continue');
    const { Return } = require('../instructions/control/return');
    const { Break } = require('../instructions/control/break');

    // Condicionales
    const { Switch } = require('../instructions/conditionals/switch');
    const { Case } = require('../instructions/conditionals/case');
    const { If } = require('../instructions/conditionals/if');

    // Bucles
    const { DoWhile } = require('../instructions/loops/doWhile');
    const { While } = require('../instructions/loops/while');
    const { For } = require('../instructions/loops/for');

    // Valores
    const { GetVector } = require('../expressions/values/getVector');
    const { GetValue } = require('../expressions/values/getValue');
    const { SetValue } = require('../expressions/values/setValue'); 
    const { GetList } = require('../expressions/values/getList');

    // Operadores
    const { RelationalType, Relational } = require('../expressions/operators/relational');
    const { ArithmeticType, Arithmetic } = require('../expressions/operators/arithmetic');
    const { LogicalType, Logical } = require('../expressions/operators/logical');
    const { UnaryType, Unary } = require('../expressions/operators/unary');
    const { Ternary } = require('../expressions/operators/ternary');
    const { Casting } = require('../expressions/casting');

    //Funciones Nativas
    const { Truncate } = require('../expressions/nativeFunc/truncate');
    const { ToString } = require('../expressions/nativeFunc/toString');
    const { ToUpper } = require('../expressions/nativeFunc/toUpper');
    const { ToLower } = require('../expressions/nativeFunc/toLower');
    const { TypeOf } = require('../expressions/nativeFunc/typeOf');
    const { Length } = require('../expressions/nativeFunc/length');
    const { ToChar } = require('../expressions/nativeFunc/toChar');
    const { Round } = require('../expressions/nativeFunc/round');
    const { WriteLine } = require('../instructions/writeLine');
%}

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
([a-zA-Z_])[a-zA-Z0-9_ñÑ]*      return 'ID';

<<EOF>>                         return 'EOF';

.   { output.setOutput(`-->Léxico, caracter: ${yytext} no pertenece al lenguaje (${yylloc.first_line}:${yylloc.first_column}).`); 
      errors.add(new Error("Léxico", `Caracter: ${yytext} no pertenece al lenguaje.`, yylloc.first_line, yylloc.first_column)); }

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

init:             globalBody EOF                                                                { return $1; }
;

globalBody:       globalBody global                                                             { $1.push($2); $$ = $1; }
                | global                                                                        { $$ = [$1]; }
; 

global:           assigment ';'                                                                 { $$ = $1; }
                | statment ';'                                                                  { $$ = $1; }
                | vector ';'                                                                    { $$ = $1; }
                | list ';'                                                                      { $$ = $1; }
                | main ';'                                                                      { $$ = $1; }
                | method                                                                        { $$ = $1; }
                | error ';'                                                                     { output.setOutput(`-->Sintáctico, se esperaba: ${yytext} (${this._$.first_line}:${this._$.first_column}).`); 
                                                                                                errors.add(new Error("Sintáctico", `Se esperaba: ${yytext}`, this._$.first_line, this._$.first_column)); }
                | error '}'                                                                     { output.setOutput(`-->Sintáctico, se esperaba, ${yytext} (${this._$.first_line}:${this._$.first_column}).`); 
                                                                                                errors.add(new Error("Sintáctico", `Se esperaba: ${yytext}`, this._$.first_line, this._$.first_column)); }
;

localBody:        localBody local                                                               { $1.push($2); $$ = $1; }
                | local                                                                         { $$ = [$1]; }
;

local:            callmethod ';'                                                                { $$ = $1; }
                | assigment ';'                                                                 { $$ = $1; }
                | conditionals                                                                  { $$ = $1; }
                | statment ';'                                                                  { $$ = $1; }
                | control ';'                                                                   { $$ = $1; }
                | vector ';'                                                                    { $$ = $1; }
                | cyclicals                                                                     { $$ = $1; }
                | print ';'                                                                     { $$ = $1; }
                | list ';'                                                                      { $$ = $1; }
;

main:             PR_MAIN callmethod                                                            { $$ = new Main($2); }
;

method:           PR_VOID ID '(' parameters ')' '{' localBody '}'                               { $$ = new Function(ValueType.VOID, $2, $4, $7, @1.first_line, @1.first_column); }
                | type ID '(' parameters ')' '{' localBody '}'                                  { $$ = new Function($1, $2, $4, $7, @1.first_line, @1.first_column); }
                | PR_VOID ID '(' ')' '{' localBody '}'                                          { $$ = new Function(ValueType.VOID, $2, [], $6, @1.first_line, @1.first_column); }
                | type ID '(' ')' '{' localBody '}'                                             { $$ = new Function($1, $2, [], $6, @1.first_line, @1.first_column); }
;

callmethod:       ID '(' attributes ')'                                                         { $$ = new CallMethod($1, $3, @1.first_line, @1.first_column); }
                | ID '(' ')'                                                                    { $$ = new CallMethod($1, [], @1.first_line, @1.first_column); }
;

callfunction:     ID '(' attributes ')'                                                         { $$ = new CallFunction($1, $3, @1.first_line, @1.first_column); }
                | ID '(' ')'                                                                    { $$ = new CallFunction($1, [], @1.first_line, @1.first_column); }
;

parameters:       parameters ',' type ID                                                        { $1.push(new Parameters($3, null, $4)); $$ = $1; }
                | type ID                                                                       { $$ = [new Parameters($1, null, $2)]; }
;

attributes:       attributes ',' expression                                                     { $1.push($3); $$ = $1; }
                | expression                                                                    { $$ = [$1]; }
;

print:            PR_PRINT '(' expression ')'                                                   { $$ = new WriteLine($3, @1.first_line, @1.first_column); }
                | PR_PRINT '(' ')'                                                              { $$ = new WriteLine(null, @1.first_line, @1.first_column); }
;

statment:         type ID '=' expression                                                        { $$ = new Statment($1, $2, $4, @1.first_line, @1.first_column); }
                | tipo ID                                                                       { $$ = new Statment($1, $2, null, @1.first_line, @1.first_column);}
;

assigment:        ID '=' expression                                                             { $$ = new Assigment($1, $3, @1.first_line, @1.first_column); }
                | ID '++'                                                                       { $$ = new AssingCrement($1, AssigType.INCREMENT, @1.first_line, @1.first_column);}
                | ID '--'                                                                       { $$ = new AssingCrement($1, AssigType.DECREMENT, @1.first_line, @1.first_column);}
;

vector:           vectorStatment                                                                {$$ = $1; }
                | assigVector                                                                   {$$ = $1; }
;

vectorStatment:   type '[' ']' ID '=' PR_NEW type '[' expression ']'                            { $$ = new NewVector($4, $1, $7, $9, @1.first_line, @1.first_column); } 
                | type '[' ']' ID '=' '{' attributes '}'                                        { $$ = new NewVector($4, $1, null, $7, @1.first_line, @1.first_column); }
                | type '[' ']' ID '=' toChar                                                    { $$ = new NewVector($4, $1, null, $6, @1.first_line, @1.first_column); }
;

assigVector:      ID '[' expression ']' '=' expression                                          { $$ = new AssigVector($1, $3, $6, @1.first_line, @1.first_column); }
;

list:             listStarment                                                                  { $$ = $1; }
                | assigList                                                                     { $$ = $1; }
;

listStarment:     PR_LIST  '<' type '>' ID '=' PR_NEW PR_LIST '<' type '>'                      { $$ = new NewList($5, $3, $10, null, @1.first_line, @1.first_column); }
                | PR_LIST  '<' type '>' ID '=' toChar                                           { $$ = new NewList($5, $3, null, $7, @1.first_line, @1.first_column); }
;

assigList:        ID '.' PR_ADD '(' expression ')'                                              { $$ = new PushList($1, $5, @1.first_line, @1.first_column); }
                | ID '[' '[' expression ']' ']' '=' expression                                  { $$ = new AssigList($1, $4, $8, @1.first_line, @1.first_column); }
;

valuetype:        DECIMAL                                                                       { $$ = new SetValue(ValueType.DOUBLE, Number($1), @1.first_line, @1.first_column); }
                | NUMBER                                                                        { $$ = new SetValue(ValueType.INT, Number($1), @1.first_line, @1.first_column); }
                | FALSE                                                                         { $$ = new SetValue(ValueType.BOOLEAN, false, @1.first_line, @1.first_column); }
                | TRUE                                                                          { $$ = new SetValue(ValueType.BOOLEAN, true, @1.first_line, @1.first_column); }
                | CHAR                                                                          { $$ = new SetValue(ValueType.CHAR, $1, @1.first_line, @1.first_column); }
                | STR                                                                           { $$ = new SetValue(ValueType.STRING, $1, @1.first_line, @1.first_column); }
                | ID                                                                            { $$ = new GetValue($1, @1.first_line, @1.first_column); }
;

type:             PR_INT                                                                        { $$ = ValueType.INT; }
                | PR_DOUBLE                                                                     { $$ = ValueType.DOUBLE; }
                | PR_BOOLEAN                                                                    { $$ = ValueType.BOOLEAN; }
                | PR_CHAR                                                                       { $$ = ValueType.CHAR; }
                | PR_STRING                                                                     { $$ = ValueType.STRING; }
;


expression:       expression '&&' expression                                                    { $$ = new Logical(LogicalType.AND, $1, $3, @1.first_line, @1.first_column); }
                | expression '||' expression                                                    { $$ = new Logical(LogicalType.OR, $1, $3, @1.first_line, @1.first_column); }
                | '!' expression                                                                { $$ = new Logical(LogicalType.NOT, $2, null, @1.first_line, @1.first_column); }
                | expression '==' expression                                                    { $$ = new Relational(RelationalType.EQUALS, $1, $3, @1.first_line, @1.first_column); }
                | expression '!=' expression                                                    { $$ = new Relational(RelationalType.NEQUALS, $1, $3, @1.first_line, @1.first_column); }
                | expression '<=' expression                                                    { $$ = new Relational(RelationalType.LEQUALS, $1, $3, @1.first_line, @1.first_column); }
                | expression '>=' expression                                                    { $$ = new Relational(RelationalType.GEQUALS, $1, $3, @1.first_line, @1.first_column); }
                | expression '<' expression                                                     { $$ = new Relational(RelationalType.LESS, $1, $3, @1.first_line, @1.first_column); }
                | expression '>' expression                                                     { $$ = new Relational(RelationalType.GREATER, $1, $3, @1.first_line, @1.first_column); }
                | expression '+' expression                                                     { $$ = new Arithmetic(ArithmeticType.SUM, $1, $3, @1.first_line, @1.first_column); }
                | expression '-' expression                                                     { $$ = new Arithmetic(ArithmeticType.SUBTRACCION, $1, $3, @1.first_line, @1.first_column); }
                | expression '*' expression                                                     { $$ = new Arithmetic(ArithmeticType.MULTIPLICATION, $1, $3, @1.first_line, @1.first_column); }
                | expression '/' expression                                                     { $$ = new Arithmetic(ArithmeticType.DIVISION, $1, $3, @1.first_line, @1.first_column); }
                | expression '%' expression                                                     { $$ = new Arithmetic(ArithmeticType.MODULE, $1, $3, @1.first_line, @1.first_column); }
                | expression '^' expression                                                     { $$ = new Arithmetic(ArithmeticType.POWER, $1, $3, @1.first_line, @1.first_column); }
                | '-' expression %prec UMINUS                                                   { $$ = new Unary(UnaryType.NEGATION, $2, @1.first_line, @1.first_column); }
                | expression '++'                                                               { $$ = new Unary(UnaryType.INCREMENT, $1, @1.first_line, @1.first_column); }
                | expression '--'                                                               { $$ = new Unary(UnaryType.DECREMENT, $1, @1.first_line, @1.first_column); }
                | ternary                                                                       { $$ = $1; }
                | casting                                                                       { $$ = $1; }
                | function                                                                      { $$ = $1; }
                | valuetype                                                                     { $$ = $1; }
                | structures                                                                    { $$ = $1; }
                | callfunction                                                                  { $$ = $1; }
                | '(' expression ')'                                                            { $$ = $2; }
;

casting:          '(' type ')' expression %prec UCAST                                           { $$ = new Casting($2, $4, @1.first_line, @1.first_column); }
;

structures:       ID '[' expression ']'                                                         { $$ = new GetVector($1, $3, @1.first_line, @1.first_column); }
                | ID '[' '[' expression ']' ']'                                                 { $$ = new GetList($1, $4, @1.first_line, @1.first_column); }
;

ternary:          expression '?' expression ':' expression                                      { $$ = new Ternary($1, $3, $5, @1.first_line, @1.first_column); }
;

function:         PR_TRUNCATE '(' expression ')'                                                { $$ = new Truncate($3, @1.first_line, @1.first_column); }
                | PR_LENGTH '(' expression')'                                                   { $$ = new Length($3, @1.first_line, @1.first_column); }
                | PR_TYPEOF '(' expression')'                                                   { $$ = new TypeOf($3, @1.first_line, @1.first_column); }
                | PR_TOLOWER '(' expression')'                                                  { $$ = new ToLower($3, @1.first_line, @1.first_column); }
                | PR_TOUPPER '(' expression')'                                                  { $$ = new ToUpper($3, @1.first_line, @1.first_column); }
                | PR_ROUND '(' expression')'                                                    { $$ = new Round($3, @1.first_line, @1.first_column); }
                | PR_TOSTRING '(' expression')'                                                 { $$ = new ToString($3, @1.first_line, @1.first_column); }
;

toChar:           PR_TOCHARARRAY '(' expression ')'                                             { $$ = new ToChar($3, @1.first_line, @1.first_column); }
;

conditionals:     ifcondition                                                                   { $$ = $1; }
                | switchcondition                                                               { $$ = $1; }
;

ifcondition:      PR_IF '(' expression ')' '{' localBody '}' elsecondition                      { $$ = new If($3, $6, $8, @1.first_line, @1.first_column); }
                | PR_IF '(' expression ')' '{' localBody '}'                                    { $$ = new If($3, $6, null, @1.first_line, @1.first_column); }
                | PR_IF '(' expression ')' '{' '}' elsecondition                                { $$ = new If($3, [], $7, @1.first_line, @1.first_column); }
                | PR_IF '(' expression ')' '{' '}'                                              { $$ = new If($3, [], null, @1.first_line, @1.first_column); }
;

elsecondition:    PR_ELSE ifcondition                                                           { $$ = $2; }
                | PR_ELSE '{' localBody '}'                                                     { $$ = $3; }
                | PR_ELSE '{' '}'                                                               { $$ = []; }
;

switchcondition:  PR_SWITCH '(' expression ')' '{' casecondition defaultcondition '}'           { $$ = new Switch($3, $6, $7, @1.first_line, @1.first_column); }
                | PR_SWITCH '(' expression ')' '{' casecondition '}'                            { $$ = new Switch($3, $6, [], @1.first_line, @1.first_column); }
                | PR_SWITCH '(' expression ')' '{' defaultcondition '}'                         { $$ = new Switch($3, [], $6, @1.first_line, @1.first_column); }
                | PR_SWITCH '(' expression ')' '{' '}'                                          { $$ = new Switch($3, [], [], @1.first_line, @1.first_column); }
;

casecondition:    casecondition PR_CASE expression ':' localBody                                { $1.push(new Case($3, $5, @1.first_line, @1.first_column)); $$ = $1}
                | casecondition PR_CASE expression ':'                                          { $1.push(new Case($3, [], @1.first_line, @1.first_column)); $$ = $1}
                | PR_CASE expression ':' localBody                                              { $$ = [new Case($2, $4, @1.first_line, @1.first_column)]; }
                | PR_CASE expression ':'                                                        { $$ = [new Case($2, [], @1.first_line, @1.first_column)]; }
;

defaultcondition: PR_DEFAULT ':' localBody                                                      { $$ = $3; }
                | PR_DEFAULT ':'                                                                { $$ = []; }
;

cyclicals:        whilecycle                                                                    { $$ = $1; }
                | forcycle                                                                      { $$ = $1; }
;

whilecycle:       PR_DO '{' localBody '}' PR_WHILE '(' expression ')' ';'                       { $$ = new DoWhile($7, $3, @1.first_line, @1.first_column); }         
                | PR_WHILE '(' expression ')' '{' localBody '}'                                 { $$ = new While($3, $6, @1.first_line, @1.first_column); }
                | PR_DO '{' '}' PR_WHILE '(' expression ')' ';'                                 { $$ = new DoWhile($6, [], @1.first_line, @1.first_column); }
                | PR_WHILE '(' expression ')' '{' '}'                                           { $$ = new While($3, [], @1.first_line, @1.first_column); }
;

forcycle:         PR_FOR '(' assigmentFor ';' expression ';' assigment ')' '{' localBody '}'    { $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column); }
                | PR_FOR '(' statmentFor ';' expression ';' assigment ')' '{' localBody '}'     { $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column); }
;

statmentFor:      type ID '=' expression                                                        { $$ = new Statment($1, [$2], $4, @1.first_line, @1.first_column); }
;

assigmentFor:     ID '=' expression                                                             { $$ = new Assigment($1, $3, @1.first_line, @1.first_column); }
;

control:          PR_RETURN expression                                                          { $$ = new Return($2, @1.first_line, @1.first_column); }
                | PR_RETURN                                                                     { $$ = new Return(null, @1.first_line, @1.first_column); }
                | PR_CONTINUE                                                                   { $$ = new Continue(@1.first_line, @1.first_column); }
                | PR_BREAK                                                                      { $$ = new Break(@1.first_line, @1.first_column); }
;
