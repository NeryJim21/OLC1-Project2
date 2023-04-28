"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Output = void 0;
class Output {
    constructor() {
        this.output = '';
    }
    clear() {
        this.output = '';
    }
    getOutput() {
        return this.output;
    }
    setOutput(output) {
        this.output += output + "\n";
    }
}
exports.Output = Output;
