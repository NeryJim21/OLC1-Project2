"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const uuid_1 = require("uuid");
class Case {
    constructor(value, body, line, column) {
        this.value = value;
        this.body = body;
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.value.getAST(methods);
        const body = this.getBody(methods);
        const ast = `${id} [label="Case"];
        ${value.ast}
        ${id} -> ${value.id};
        ${body.ast}
        ${id} -> ${body.id};\n`;
        return { id: id, ast: ast };
    }
    getBody(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        let ast = `${id} [label="Cuerpo"];\n`;
        for (var i in this.body) {
            const aux = this.body[i].getAST(methods);
            ast += `${aux.ast}
            ${id} -> ${aux.id};\n`;
        }
        return { id: id, ast: ast };
    }
}
exports.Case = Case;
