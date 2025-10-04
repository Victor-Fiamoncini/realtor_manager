import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

type UserFromToken = {
  id: string
  role: string
}

type DecodedToken = JwtPayload & {
  sub: string
  'custom:role'?: string
}

declare global {
  namespace Express {
    interface Request {
      user: UserFromToken | null
    }
  }
}

export const authMiddleware = (allowedRules: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.headers?.authorization) return response.status(401).json({ message: 'Unauthorized' })

    const [_, token] = request.headers.authorization.split(' ')

    if (!token) return response.status(401).json({ message: 'Unauthorized' })

    try {
      const decodedToken = jwt.decode(token) as DecodedToken
      const role = decodedToken['custom:role'] || ''

      request.user = { id: decodedToken.sub, role }

      const hasAccess = allowedRules.includes(role.toLowerCase())

      if (!hasAccess) return response.status(403).json({ message: 'Access Denied' })

      return next()
    } catch {
      return response.status(400).json({ message: 'Invalid token' })
    }
  }
}
