import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getTenant = async (request: Request, response: Response) => {
  const { cognitoId } = request.params

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true },
    })

    if (!tenant) return response.status(404).json({ message: 'Tenant not found' })

    return response.status(200).json(tenant)
  } catch {
    return response.status(500).json({ message: 'Error to get tenant' })
  }
}

export const createTenant = async (request: Request, response: Response) => {
  const { cognitoId, name, email, phoneNumber } = request.body

  try {
    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    })

    return response.status(201).json(tenant)
  } catch {
    return response.status(500).json({ message: 'Error to create tenant' })
  }
}
