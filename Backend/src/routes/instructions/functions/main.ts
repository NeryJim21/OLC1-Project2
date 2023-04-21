export class Main{
    private method:Function

    constructor(method:Function){
        this.method = method
    }

    public run(methods:any[]){
        methods.push(this.method)
    }
}