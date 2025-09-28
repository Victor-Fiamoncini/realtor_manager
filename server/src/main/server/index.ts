import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

import config from './config'
import routes from './routes'

const app = express()

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(cors())
app.use(morgan('common'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', routes)

if (!config.port || isNaN(config.port)) {
  throw new Error('PORT env is not set')
}

app.listen(config.port, '0.0.0.0', () => {
  console.log(`🏠 Realtor Manager server is running on http://localhost:${config.port}`)
})
