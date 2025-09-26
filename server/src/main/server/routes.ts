import { Request, Response, Router } from 'express'

const router = Router()

router.get('/health', (request: Request, response: Response) => {
  response.status(200).send('OK')
})

export default router
