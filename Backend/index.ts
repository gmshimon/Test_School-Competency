import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import connectDB from './src/Config/db'
import path from 'path'
import dotenv from 'dotenv'

const app: Application = express()

dotenv.config()
app.use(cors())

//parse
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

import userRouter from './src/Modules/User/user.routes'

app.use('/api/v1/user', userRouter)

app.get('/', async (req: Request, res: Response, nest: NextFunction) => {
  res.send('Hello from Express Server')
})

app.listen(8000, () => {
  console.log(`App is listening on port ${8000}`)
})
export default app
