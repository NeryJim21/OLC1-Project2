const fs = require('fs');
const parser = require('./grammar.js');

const entrada = fs.readFileSync('input.txt', 'utf-8');

const resultado = parser.parse(entrada);

console.log(resultado);