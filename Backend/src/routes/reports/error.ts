export class Error{
    public type:string
    public description:string
    public line:number
    public column:number

    constructor(type:string, description:string, line:number, column:number){
        this.type = type
        this.description = description
        this.line = line
        this.column = column
    }
}