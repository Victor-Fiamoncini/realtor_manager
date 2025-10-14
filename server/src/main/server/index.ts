import 'module-alias/register'

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

import { authMiddleware } from '@/main/middleware/auth'
import healthRoutes from '@/main/routes/health'
import leaseRoutes from '@/main/routes/lease'
import managerRoutes from '@/main/routes/manager'
import propertyRoutes from '@/main/routes/property'
import tenantRoutes from '@/main/routes/tenant'
import config from '@/main/server/config'

const app = express()

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(cors())
app.use(morgan('common'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/health', healthRoutes)
app.use('/leases', authMiddleware(['manager', 'tenant']), leaseRoutes)
app.use('/managers', authMiddleware(['manager']), managerRoutes)
app.use('/tenants', authMiddleware(['tenant']), tenantRoutes)
app.use('/properties', propertyRoutes)

if (!config.port || isNaN(config.port)) {
  throw new Error('PORT env is not set')
}

app.listen(config.port, '0.0.0.0', () => {
  console.log(`🏠 Realtor Manager server is running on http://localhost:${config.port}`)
})
