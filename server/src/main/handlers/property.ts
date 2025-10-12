import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Location, Prisma, PrismaClient } from '@prisma/client'
import { wktToGeoJSON } from '@terraformer/wkt'
import axios from 'axios'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export const getProperties = async (request: Request, response: Response) => {
  const {
    favoriteIds,
    priceMin,
    priceMax,
    beds,
    baths,
    propertyType,
    squareFeetMin,
    squareFeetMax,
    amenities,
    availableFrom,
    latitude,
    longitude,
  } = request.params

  try {
    const whereConditions: Prisma.Sql[] = []

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string).split(',').map(Number)

      whereConditions.push(Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`)
    }

    if (priceMin) {
      whereConditions.push(Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`)
    }

    if (priceMax) {
      whereConditions.push(Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`)
    }

    if (beds && beds !== 'any') {
      whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`)
    }

    if (baths && baths !== 'any') {
      whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`)
    }

    if (squareFeetMin) {
      whereConditions.push(Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`)
    }

    if (squareFeetMax) {
      whereConditions.push(Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`)
    }

    if (propertyType && propertyType !== 'any') {
      whereConditions.push(Prisma.sql`p."propertyType" <= ${propertyType}::PropertyType`)
    }

    if (amenities && amenities !== 'any') {
      const amenitiesArray = (amenities as string).split(',')

      whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`)
    }

    if (availableFrom && availableFrom !== 'any') {
      const availableFromDate = typeof availableFrom === 'string' ? availableFrom : null

      if (availableFromDate) {
        const date = new Date(availableFromDate)

        if (!isNaN(date.getTime())) {
          whereConditions.push(
            Prisma.sql`
              EXISTS (
                SELECT
                  1
                FROM
                  "Lease" l
                WHERE
                  l."propertyId" = p.id AND l."startDate" <= ${date.toISOString()}
              )
            `
          )
        }
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      const radiusInKilometers = 1000
      const degrees = radiusInKilometers / 111 // Kilometers to degrees

      whereConditions.push(
        Prisma.sql`
          ST_DWithin(
            l.coordinates::geometry,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
            ${degrees}
          )
        `
      )
    }

    const query = Prisma.sql`
      SELECT
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) AS location
      FROM
        "Property" p
      JOIN
        "Location" l ON p."locationId" = l.id
      ${whereConditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereConditions, ' AND ')}` : Prisma.empty}
    `

    const properties = await prisma.$queryRaw(query)

    return response.status(200).json(properties)
  } catch {
    return response.status(500).json({ message: 'Error to get properties' })
  }
}

export const getProperty = async (request: Request, response: Response) => {
  const { id } = request.params

  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: { location: true },
    })

    if (property) {
      const coordinates: { coordinates: string }[] = await prisma.$queryRaw`
        SELECT
          ST_asText(coordinates) AS coordinates
        FROM
          "Location"
        WHERE
          id = ${property.location.id}
      `

      const geoJson = wktToGeoJSON(coordinates[0]?.coordinates || '') as unknown as { coordinates: [number, number] }

      const longitude = geoJson.coordinates[0]
      const latitude = geoJson.coordinates[1]

      const propertyWithCoordinates = {
        ...property,
        location: { ...property.location, coordinates: { longitude, latitude } },
      }

      return response.status(200).json(propertyWithCoordinates)
    }

    return response.status(404).json({ message: 'Property not found' })
  } catch {
    return response.status(500).json({ message: 'Error to get property' })
  }
}

export const createProperty = async (request: Request, response: Response) => {
  const files = request.files as Express.Multer.File[]
  const { address, city, state, country, postalCode, managerCognitoId, ...property } = request.body

  try {
    const photoUrls = await Promise.all(
      files.map(async (file) => {
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: `properties/${Date.now()}-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        }

        const uploadResult = await new Upload({ client: s3Client, params: uploadParams }).done()

        return uploadResult.Location
      })
    )

    const openStreetMapParams = new URLSearchParams({
      street: address,
      city,
      country,
      postalcode: postalCode,
      format: 'json',
      limit: '1',
    }).toString()

    const openStreetMapResponse = await axios.get(`https://nominatim.openstreetmap.org/search?${openStreetMapParams}`, {
      headers: { 'User-Agent': 'RealtorManagerApp (victor.fiamoncnii@gmail.com)' },
    })

    const [longitude, latitude] =
      openStreetMapResponse.data[0]?.lon && openStreetMapResponse.data[0]?.lat
        ? [parseFloat(openStreetMapResponse.data[0]?.lon), parseFloat(openStreetMapResponse.data[0]?.lat)]
        : [0, 0]

    const [location] = await prisma.$queryRaw<Location[]>`
      INSERT INTO
        "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES
        (
          ${address},
          ${city},
          ${state},
          ${country},
          ${postalCode},
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)
        )
      RETURNING
        id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `

    const newProperty = await prisma.property.create({
      data: {
        ...property,
        photoUrls,
        locationId: location.id,
        managerCognitoId,
        amenities: typeof property.amenities === 'string' ? property.amenities.split(',') : [],
        highlights: typeof property.highlights === 'string' ? property.highlights.split(',') : [],
        isPetsAllowed: property.isPetsAllowed === 'true',
        isParkingIncluded: property.isParkingIncluded === 'true',
        pricePerMonth: parseFloat(property.pricePerMonth),
        securityDeposit: parseFloat(property.securityDeposit),
        applicationFee: parseFloat(property.applicationFee),
        beds: parseInt(property.beds),
        baths: parseFloat(property.baths),
        squareFeet: parseInt(property.squareFeet),
      },
      include: { location: true, manager: true },
    })

    return response.status(201).json(newProperty)
  } catch {
    return response.status(500).json({ message: 'Error to create property' })
  }
}
