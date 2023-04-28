import axios from 'axios'

const path = 'http://localhost:3000/'

export const getTokens = async() => {
    return await axios.get(path  + 'Tokens')
}

export const getErrors = async() => {
    return await axios.get(path + 'Errores')
}