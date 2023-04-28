import { RequestHandler } from 'express'
import { run, getDot } from './compiler'
import { errors, tokens } from './reports/report'

export const testGrammar:RequestHandler = (req, res) => {
    res.json(run(req.body.code))
}

export const getErrors:RequestHandler = (req, res) => {
    res.json(errors.get())
}

export const getTokens:RequestHandler = (req, res) => {
    res.json(tokens.get())
}

export const getAST:RequestHandler = (req, res) => {
    res.json(getDot())
}