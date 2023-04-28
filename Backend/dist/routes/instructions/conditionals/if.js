"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const type_1 = require("../../types/type");
const symbolTable_1 = require("../../symbols/symbolTable");
const instruction_1 = require("../../types/instruction");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class If extends instruction_1.Instruction {
    constructor(condition, body, elseC, line, column) {
        super(line, column);
        this.condition = condition;
        this.body = body;
        this.elseC = elseC;
    }
    run(globalST, localST, methods, environment) {
        const condition = this.condition.run(globalST, localST, methods, environment);
        this.setError(condition);
        var control;
        if (condition.value) {
            control = this.runInstrucctions(globalST, localST, methods, environment + '_if', this.body);
        }
        else if (this.elseC) {
            if (this.elseC instanceof instruction_1.Instruction) {
                control = this.elseC.run(globalST, localST, methods, environment + '_else');
            }
            else {
                control = this.runInstrucctions(globalST, localST, methods, environment + '_else', this.elseC);
            }
        }
        //Sentencias de Control
        if (control !== null && control !== undefined) {
            if (control.type === type_1.ControlType.RETURN) {
                return control;
            }
        }
    }
    setError(condition) {
        if (condition.type != type_1.ValueType.BOOLEAN) {
            report_1.output.setOutput(`->Semántico, condicion no es de tipo BOOLEAN (${this.line}:${this.column}).`);
            throw new error_1.Error("Semántico", `Condicion no es de tipo BOOLEAN.`, this.line, this.column);
        }
    }
    runInstrucctions(globalST, localST, methods, environment, body) {
        var localST2 = new symbolTable_1.SymbolTable(localST.symbols);
        for (var i in body) {
            const control = body[i].run(globalST, localST2, methods, environment);
            if (control !== null && control !== undefined) {
                return control;
            }
        }
        return null;
    }
    getAST(methods) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        const value = this.condition.getAST(methods);
        const body = this.getBody(methods, this.body);
        let ast = `${value.ast}
        ${id} -> ${value.id};
        ${body.ast}
        ${id} -> ${body.id};\n`;
        if (this.elseC instanceof instruction_1.Instruction) {
            const elseif = this.elseC.getAST(methods);
            ast += `${elseif.ast}
            ${elseif.id} [label="Else If"];
            ${id} -> ${elseif.id};\n`;
        }
        else {
            if (this.elseC) {
                const elseb = this.getBody(methods, this.elseC);
                const id_else = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
                ast += `${elseb.ast}
                ${id_else} [label="Else"];
                ${id_else} -> ${elseb.id};
                ${id} -> ${id_else};\n`;
            }
        }
        ast = `${id} [label="If"];
        ${ast}`;
        return { id: id, ast: ast };
    }
    getBody(methods, body) {
        const id = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
        let ast = `${id} [label="Cuerpo"];\n`;
        for (var i in body) {
            const aux = body[i].getAST(methods);
            ast += `${aux.ast}
            ${id} -> ${aux.id};\n`;
        }
        return { id: id, ast: ast };
    }
}
exports.If = If;
