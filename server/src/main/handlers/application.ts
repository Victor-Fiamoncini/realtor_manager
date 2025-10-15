import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export const getApplications = async (request: Request, response: Response) => {
  const { userId, userType } = request.query

  try {
    let whereClause = {}

    if (userId && userType) {
      if (userType === 'tenant') {
        whereClause = { tenantCognitoId: String(userId) }
      } else if (userType === 'manager') {
        whereClause = { property: { managerCognitoId: String(userId) } }
      }
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        property: {
          include: { location: true, manager: true },
        },
        tenant: true,
      },
    })

    function calculateNextPaymentDate(startDate: Date) {
      const today = new Date()
      const nextPaymentDate = new Date(startDate)

      while (nextPaymentDate <= today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
      }

      return nextPaymentDate
    }

    const formattedApplications = await Promise.all(
      applications.map(async (application) => {
        const lease = await prisma.lease.findFirst({
          where: {
            tenant: { cognitoId: application.tenantCognitoId },
            propertyId: application.propertyId,
          },
          orderBy: { startDate: 'desc' },
        })

        return {
          ...application,
          property: {
            ...application.property,
            address: application.property.location.address,
          },
          manager: application.property.manager,
          lease: lease
            ? {
                ...lease,
                nextPaymentDate: calculateNextPaymentDate(lease.startDate),
              }
            : null,
        }
      })
    )

    return response.status(200).json(formattedApplications)
  } catch {
    return response.status(500).json({ message: 'Error to get applications' })
  }
}

export const createApplication = async (request: Request, response: Response) => {
  const { applicationDate, status, propertyId, tenantCognitoId, name, email, phoneNumber, message } = request.body

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { pricePerMonth: true, securityDeposit: true },
    })

    if (!property) return response.status(404).json({ message: 'Property not found' })

    const application = await prisma.$transaction(async (prisma) => {
      // 1 year from today
      const startDate = new Date()
      const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))

      const lease = await prisma.lease.create({
        data: {
          startDate,
          endDate,
          rent: property.pricePerMonth,
          deposit: property.securityDeposit,
          property: { connect: { id: propertyId } },
          tenant: { connect: { cognitoId: tenantCognitoId } },
        },
      })

      const application = await prisma.application.create({
        data: {
          applicationDate: new Date(applicationDate),
          status,
          name,
          email,
          phoneNumber,
          message,
          property: { connect: { id: propertyId } },
          tenant: { connect: { cognitoId: tenantCognitoId } },
          lease: { connect: { id: lease.id } },
        },
        include: { property: true, tenant: true, lease: true },
      })

      return application
    })

    return response.status(201).json(application)
  } catch {
    return response.status(500).json({ message: 'Error to create application' })
  }
}

export const updateApplicationStatus = async (request: Request, response: Response) => {
  const { id } = request.params
  const { status } = request.body

  try {
    let application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: { property: true, tenant: true },
    })

    if (!application) return response.status(404).json({ message: 'Application not found' })

    if (status === 'Approved') {
      // 1 year from today
      const startDate = new Date()
      const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))

      const newLease = await prisma.lease.create({
        data: {
          startDate,
          endDate,
          rent: application.property.pricePerMonth,
          deposit: application.property.securityDeposit,
          propertyId: application.propertyId,
          tenantCognitoId: application.tenantCognitoId,
        },
      })

      await prisma.property.update({
        where: { id: application.propertyId },
        data: {
          tenants: {
            connect: { cognitoId: application.tenantCognitoId },
          },
        },
      })

      await prisma.application.update({
        where: { id: Number(id) },
        data: { status, leaseId: newLease.id },
        include: { property: true, tenant: true, lease: true },
      })
    } else {
      await prisma.application.update({ where: { id: Number(id) }, data: { status } })
    }

    application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: { property: true, tenant: true, lease: true },
    })

    return response.status(200).json(application)
  } catch {
    return response.status(500).json({ message: 'Error to update application status' })
  }
}
