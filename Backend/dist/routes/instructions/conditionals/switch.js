"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const type_1 = require("../../types/type");
const symbolTable_1 = require("../../symbols/symbolTable");
const instruction_1 = require("../../types/instruction");
const report_1 = require("../../reports/report");
const error_1 = require("../../reports/error");
const uuid_1 = require("uuid");
class Switch extends instruction_1.Instruction {
    constructor(condition, body, def, line, column) {
        super(line, column);
        this.condition = condition;
        this.body = body;
        this.def = def;
    }
    run(globalST, localST, methods, environment) {
        const condition = this.condition.run(globalST, localST, methods, environment);
        var control = this.runCase(condition, globalST, localST, methods, environment);
        if (control === null) {
            control = this.runBody(this.def, globalST, localST, methods, environment);
        }
        if (control !== null) {
            if (control.type === type_1.ControlType.CONTINUE) {
                report_1.output.setOutput(`-->Semántico, CONTINUE fuera de ciclo (${control.line}:${control.column}).`);
                throw new error_1.Error("Semántico", `CONTINUE fuera de ciclo.`, control.line, control.column);
            }
            else if (control.type === type_1.ControlType.RETURN) {
                return control;
            }
        }
    }
    runCase(condition, globalST, localST, methods, environment) {
        let flag = false;
        for (var i in this.body) {
            const value = this.body[i].value.run(globalST, localST, methods, environment);
            if ((value.value === condition.value) || flag) {
                flag = true;
                const control = this.runBody(this.body[i].body, globalST, localST, methods, environment + "_case");
                if (control !== null)
                    return control;
            }
        }
        return null;
    }
    runBody(body, globalST, localST, methods, environment) {
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
        const body = this.getBody(methods);
        const ast = `${id} [label="Switch"];
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
        if (this.def) {
            const aux = `n${(0, uuid_1.v4)().replace(/\-/g, "")}`;
            ast += `${aux} [label="Default"];\n
            ${id} -> ${aux};\n`;
            for (var i in this.def) {
                const def = this.def[i].getAST(methods);
                ast += `${def.ast}
                ${aux} -> ${def.id};\n`;
            }
        }
        return { id: id, ast: ast };
    }
}
exports.Switch = Switch;
