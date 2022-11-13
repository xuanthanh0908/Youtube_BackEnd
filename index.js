import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectDB } from './connection/index.js'
import userRoutes from './routes/User.js'
import authRoutes from './routes/Auth.js'
import videoRoutes from './routes/Video.js'
import commentRoutes from './routes/Comment.js'
const app = express()

dotenv.config({ path: '.env' })

// CONFIG PORT SERVER
const PORT = process.env.PORT || 4000
// CONFIG BODY PASER SERVER
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// ROUTER
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/comment', commentRoutes)
// MIDDEWARE CHECK ERROR
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'something went wrong !!!'
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})
// LISTEN
app.listen(PORT, () => {
  // connect to DB mongoDB
  connectDB()
  console.log(`Server is running on PORT: ${PORT}`)
})
