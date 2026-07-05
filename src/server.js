import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import userRouter from './routers/userRouter.js'
import authRouter from './routers/authRouter.js'
import schoolsRouter from './routers/schoolRouter.js'
import ticketRouter from './routers/ticketRouter.js'
import { logger } from './middlewares/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { error404 } from './middlewares/error404.js'

const app = express()
const port = 3333

app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
)

app.use(logger)
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: "Olá Mundo Express API!" })
})

app.use('/users', userRouter)
app.use('/schools', schoolsRouter)
app.use('/auth', authRouter)
app.use(ticketRouter)

app.use(error404)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Servidor rondando em http://localhost:${port}`)
})
