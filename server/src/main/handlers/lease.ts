import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getLeases = async (request: Request, response: Response) => {
  try {
    const leases = await prisma.lease.findMany({
      include: { tenant: true, property: true },
    })

    return response.status(200).json(leases)
  } catch {
    return response.status(500).json({ message: 'Error to get leases' })
  }
}

export const getLeasePayments = async (request: Request, response: Response) => {
  const { id } = request.params

  try {
    const payments = await prisma.payment.findMany({
      where: { leaseId: Number(id) },
    })

    return response.status(200).json(payments)
  } catch {
    return response.status(500).json({ message: 'Error to get lease payments' })
  }
}
