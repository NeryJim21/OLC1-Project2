import { Router } from 'express'
import * as grammarCtrl from './grammar.controller'

const router = Router()

router.post('/', grammarCtrl.testGrammar)

router.get('/Tokens', grammarCtrl.getTokens)

router.get('/Errores', grammarCtrl.getErrors)

router.get('/AST', grammarCtrl.getAST)

export default router