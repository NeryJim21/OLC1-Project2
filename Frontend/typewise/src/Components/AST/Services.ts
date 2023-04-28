import axios from "axios";

const path = 'http://localhost:3000/'

export const getDot = async() => {
    return await axios.get(path + 'AST')
}