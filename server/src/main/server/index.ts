import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'

import routes from './routes'

dotenv.config()

const app = express()

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(cors())
app.use(morgan('common'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', routes)

const port = Number(process.env.API_PORT)

if (!port || isNaN(port)) {
  throw new Error('API_PORT is not set or is invalid in .env')
}

app.listen(port, '0.0.0.0', () => {
  console.log(`🏘️ Realtor Manager server is running on http://localhost:${port}`)
})
