import { PrismaClient } from '@prisma/client'
import { wktToGeoJSON } from '@terraformer/wkt'
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

export const updateTenant = async (request: Request, response: Response) => {
  const { cognitoId } = request.params
  const { name, email, phoneNumber } = request.body

  try {
    const tenant = await prisma.tenant.update({
      where: { cognitoId },
      data: { name, email, phoneNumber },
    })

    return response.status(200).json(tenant)
  } catch {
    return response.status(500).json({ message: 'Error to update tenant' })
  }
}

export const getCurrentResidences = async (request: Request, response: Response) => {
  const { cognitoId } = request.params

  try {
    const properties = await prisma.property.findMany({
      where: { tenants: { some: { cognitoId } } },
      include: { location: true },
    })

    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] = await prisma.$queryRaw`
          SELECT
            ST_asText(coordinates) AS coordinates
          FROM
            "Location"
          WHERE id = ${property.location.id}
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

    return response.status(200).json(residencesWithFormattedLocation)
  } catch {
    return response.status(500).json({ message: 'Error to get tenant residences' })
  }
}

export const addFavoriteProperty = async (request: Request, response: Response) => {
  const { cognitoId, propertyId } = request.params

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true },
    })

    if (!tenant) return response.status(404).json({ message: 'Tenant not found' })

    const propertyIdNumber = Number(propertyId)
    const existingFavorites = tenant.favorites || []

    if (!existingFavorites.some((favorite) => favorite.id === propertyIdNumber)) {
      const updatedTenant = await prisma.tenant.update({
        where: { cognitoId },
        data: { favorites: { connect: { id: propertyIdNumber } } },
        include: { favorites: true },
      })

      return response.status(200).json(updatedTenant)
    }

    return response.status(409).json({ message: 'Property already added as favorite' })
  } catch {
    return response.status(500).json({ message: 'Error to add favorite property' })
  }
}

export const removeFavoriteProperty = async (request: Request, response: Response) => {
  const { cognitoId, propertyId } = request.params

  try {
    const propertyIdNumber = Number(propertyId)

    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: { favorites: { disconnect: { id: propertyIdNumber } } },
      include: { favorites: true },
    })

    return response.status(200).json(updatedTenant)
  } catch {
    return response.status(500).json({ message: 'Error to remove favorite property' })
  }
}
