import { TokenTable } from "./tokenTable";
import { ErrorTable } from "./errorTable";
import { Output } from "./output";

export const output = new Output()
export const tokens = new TokenTable()
export const errors = new ErrorTable()

export function clearAll(){
    output.clear()
    tokens.clear()
    errors.clear()
}