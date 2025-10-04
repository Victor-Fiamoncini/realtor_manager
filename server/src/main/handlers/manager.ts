import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getManager = async (request: Request, response: Response) => {
  const { cognitoId } = request.params

  try {
    const manager = await prisma.manager.findUnique({
      where: { cognitoId },
    })

    if (!manager) return response.status(404).json({ message: 'Manager not found' })

    return response.status(200).json(manager)
  } catch {
    return response.status(500).json({ message: 'Error to get manager' })
  }
}

export const createManager = async (request: Request, response: Response) => {
  const { cognitoId, name, email, phoneNumber } = request.body

  try {
    const manager = await prisma.manager.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    })

    return response.status(201).json(manager)
  } catch {
    return response.status(500).json({ message: 'Error to create manager' })
  }
}
