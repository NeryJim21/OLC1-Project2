export class Output{
    private output:string

    constructor(){
        this.output = ''
    }

    clear(){
        this.output = ''
    }

    public getOutput(){
        return this.output
    }

    public setOutput(output:string){
        this.output += output + "\n"
    }
}