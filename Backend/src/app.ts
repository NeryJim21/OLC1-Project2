import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import config  from "./config"
import grammarRoutes from './routes/grammar.routes'

const app = express()

app.set('port', config.PORT)

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(grammarRoutes)

export default app