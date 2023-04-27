import axios from 'axios'

const path = 'http://localhost:4000/'

export const getOutput = async(code:string) => {
    return await axios.post(path, {code: code})
}