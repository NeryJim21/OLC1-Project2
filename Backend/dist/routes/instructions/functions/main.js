"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
class Main {
    constructor(method) {
        this.method = method;
    }
    run(methods) {
        methods.push(this.method);
    }
}
exports.Main = Main;
