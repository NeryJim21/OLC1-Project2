export class Token{
    public id:string
    public type:string
    public type2:string
    public environment:string
    public line:number
    public column:number


	constructor(id:string, type:string, type2:string, environment:string, line:number, column:number){
        this.id = id
        this.type = type
        this.type2 = type2
        this.environment = environment
        this.line = line
        this.column = column
    }

}