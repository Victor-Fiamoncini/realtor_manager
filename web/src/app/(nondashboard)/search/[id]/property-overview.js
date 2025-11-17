import { MapPin, Star } from 'lucide-react'
import React from 'react'

import { useGetPropertyQuery } from '@/state/api'

const PropertyOverview = ({ propertyId }) => {
  const { data: property, isError, isLoading } = useGetPropertyQuery(propertyId)

  if (isLoading) return 'Loading...'

  if (isError || !property) return 'Property not found'

  return (
    <div>
      <div className="mb-4">
        <div className="mb-1 text-sm text-gray-500">
          {property.location?.country} / {property.location?.state} /{' '}
          <span className="font-semibold text-gray-600">{property.location?.city}</span>
        </div>

        <h1 className="my-5 text-3xl font-bold">{property.name}</h1>

        <div className="flex items-center justify-between">
          <span className="flex items-center text-gray-500">
            <MapPin className="mr-1 h-4 w-4 text-gray-700" />
            {property.location?.city}, {property.location?.state}, {property.location?.country}
          </span>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center text-yellow-500">
              <Star className="mr-1 h-4 w-4 fill-current" />
              {property.averageRating.toFixed(1)} ({property.numberOfReviews} Reviews)
            </span>

            <span className="text-green-600">Verified Listing</span>
          </div>
        </div>
      </div>

      <div className="border-primary-200 mb-6 rounded-xl border p-6">
        <div className="flex items-center justify-between gap-4 px-5">
          <div>
            <div className="text-sm text-gray-500">Monthly Rent</div>

            <div className="font-semibold">${property.pricePerMonth.toLocaleString()}</div>
          </div>

          <div className="h-10 border-l border-gray-300"></div>

          <div>
            <div className="text-sm text-gray-500">Bedrooms</div>

            <div className="font-semibold">{property.beds} bd</div>
          </div>

          <div className="h-10 border-l border-gray-300"></div>

          <div>
            <div className="text-sm text-gray-500">Bathrooms</div>

            <div className="font-semibold">{property.baths} ba</div>
          </div>

          <div className="h-10 border-l border-gray-300"></div>

          <div>
            <div className="text-sm text-gray-500">Square Feet</div>

            <div className="font-semibold">{property.squareFeet.toLocaleString()} sq ft</div>
          </div>
        </div>
      </div>

      <div className="my-16">
        <h2 className="mb-5 text-xl font-semibold">About {property.name}</h2>

        <p className="leading-7 text-gray-500">{property.description}</p>
      </div>
    </div>
  )
}

export default PropertyOverview
