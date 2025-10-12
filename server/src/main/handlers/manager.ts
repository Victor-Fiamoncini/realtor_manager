import { PrismaClient } from '@prisma/client'
import { wktToGeoJSON } from '@terraformer/wkt'
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

export const updateManager = async (request: Request, response: Response) => {
  const { cognitoId } = request.params
  const { name, email, phoneNumber } = request.body

  try {
    const manager = await prisma.manager.update({
      where: { cognitoId },
      data: { name, email, phoneNumber },
    })

    return response.status(200).json(manager)
  } catch {
    return response.status(500).json({ message: 'Error to update manager' })
  }
}

export const getManagerProperties = async (request: Request, response: Response) => {
  const { cognitoId } = request.params

  try {
    const properties = await prisma.property.findMany({
      where: { managerCognitoId: cognitoId },
      include: { location: true },
    })

    const propertiesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] = await prisma.$queryRaw`
          SELECT
            ST_asText(coordinates) AS coordinates
          FROM
            "Location"
          WHERE
            id = ${property.location.id}
        `

        const geoJSON = wktToGeoJSON(coordinates[0]?.coordinates || '') as unknown as { coordinates: [number, number] }

        const longitude = geoJSON.coordinates[0]
        const latitude = geoJSON.coordinates[1]

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: { longitude, latitude },
          },
        }
      })
    )

    return response.status(200).json(propertiesWithFormattedLocation)
  } catch {
    return response.status(500).json({ message: 'Error to get manager properties' })
  }
}
