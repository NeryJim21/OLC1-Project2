"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssigVector = void 0;
const type_1 = require("../../types/type");
const instruction_1 = require("../../types/instruction");
const checks_1 = require("../checks");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class AssigVector extends instruction_1.Instruction {
    constructor(id, index, value, line, column) {
        super(line, column);
        this.id = id;
        this.index = index;
        this.value = value;
    }
    run(globalST, localST, methods, environment) {
        const index = this.index.run(globalST, localST, methods, environment);
        if (index.type !== type_1.ValueType.INT) {
            report_1.output.setOutput(`-->Semántico, tipos incompatibles: ${type_1.ValueType[index.type]} no se puede convertir a INT (${this.line}:${this.column}).`);
            throw new error_1.Error(`Semántico`, `Tipos incompatibles: ${type_1.ValueType[index.type]} no se puede convertir a INT.`, this.line, this.column);
        }
        const value = this.value.run(globalST, localST, methods, environment);
        let symbol = localST.get(this.id);
        if (symbol) {
            this.checkUpdate(localST, symbol, value, index.value);
        }
        else {
            symbol = globalST.get(this.id);
            if (symbol) {
                this.checkUpdate(globalST, symbol, value, index.value);
            }
            else {
                report_1.output.setOutput(`-->Semántico, no se pudo encontar el simbolo: ${this.id} (${this.line}:${this.column}).`);
                throw new error_1.Error("Semántico", `No se pudo encontar el simbolo: ${this.id}.`, this.line, this.column);
            }
        }
    }
    checkUpdate(st, symbol, value, index) {
        let vector = symbol.value;
        if (symbol.type !== type_1.ValueType.VECTOR) {
            report_1.output.setOutput(`-->Semántico, vector requerido, pero no enontrado (${this.line}:${this.column}).`);
            throw new error_1.Error(`Semántico`, `Vector requerido, pero no enontrado.`, this.line, this.column);
        }
        (0, checks_1.checkIndex)(index, vector, this.id, this.line, this.column);
        const aux = (0, checks_1.checkType)(vector[0].type, value, this.line, this.column);
        vector[index] = aux;
        st.upDate(this.id, vector);
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const id_id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const index = this.getIndex(methods);
        const value = this.value.getAST(methods);
        const ast = `${id} [label="Asignacion\\nVector"];
        ${id_id} [label="Identificador\\n${this.id}[]"];
        ${id} -> ${id_id};
        ${index.ast}
        ${id} -> ${index.id};
        ${value.ast}
        ${id} -> ${value.id};\n`;
        return { id: id, ast: ast };
    }
    getIndex(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const index = this.index.getAST(methods);
        const ast = `${id} [label="Indice"];
        ${index.ast}
        ${id} -> ${index.id}`;
        return { id: id, ast: ast };
    }
}
exports.AssigVector = AssigVector;
