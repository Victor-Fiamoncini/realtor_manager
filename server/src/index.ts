import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'

const main = async () => {
  dotenv.config()

  const apiPort = process.env.API_PORT

  const app = express()

  app.use(helmet())
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
  app.use(cors())
  app.use(morgan('common'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.get('/', (req, res) => {
    res.send('Hello, World!')
  })

  app.listen(apiPort, () => {
    console.log(`🏘️ Realtor Manager server is running on http://localhost:${apiPort}`)
  })
}

main().catch((error) => {
  console.error('Error starting Realtor Manager server:', error)
})
