import React from 'react'

import Card from '@/components/card'
import CardCompact from '@/components/card-compact'
import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from '@/state/api'
import { useAppSelector } from '@/state/hooks'

const Listings = () => {
  const { data: user } = useGetAuthUserQuery()
  const { data: tenant } = useGetTenantQuery(user.cognitoInfo.userId || '', {
    skip: !user.cognitoInfo.userId,
  })

  const [addFavorite] = useAddFavoritePropertyMutation()
  const [removeFavorite] = useRemoveFavoritePropertyMutation()

  const { filters, viewMode } = useAppSelector((state) => state.global)

  const { data: properties, isLoading, isError } = useGetPropertiesQuery(filters)

  const handleFavoriteToggle = async (propertyId) => {
    if (!user) throw new Error('User must be logged in to favorite a property')

    if (user.userRole !== 'tenant') throw new Error('Only tenants can favorite properties')

    const isFavorite = Array.isArray(tenant?.favorites)
      ? tenant.favorites.some((favorite) => favorite.id === propertyId)
      : false

    if (isFavorite) {
      await removeFavorite({ cognitoId: user.cognitoInfo.userId, propertyId })

      return
    }

    await addFavorite({ cognitoId: user.cognitoInfo.userId, propertyId })
  }

  if (isLoading) return 'Loading...'

  if (isError || !properties) return <div>Failed to fetch properties</div>

  return (
    <div className="w-full">
      <h3 className="px-4 text-sm font-bold">
        {properties.length} <span className="text-primary font-normal">Places in {filters.location}</span>
      </h3>

      <div className="flex">
        <div className="w-full p-4">
          {properties.length > 0
            ? properties.map((property) =>
                viewMode === 'grid' ? (
                  <Card
                    key={property.id}
                    property={property}
                    isFavorite={
                      Array.isArray(tenant?.favorites)
                        ? tenant.favorites.some((favorite) => favorite.id === property.id)
                        : false
                    }
                    onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                    showFavoriteButton={user && user.userRole === 'tenant'}
                    propertyLink={`/search/${property.id}`}
                  />
                ) : (
                  <CardCompact
                    key={property.id}
                    property={property}
                    isFavorite={
                      Array.isArray(tenant?.favorites)
                        ? tenant.favorites.some((favorite) => favorite.id === property.id)
                        : false
                    }
                    onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                    showFavoriteButton={user && user.userRole === 'tenant'}
                    propertyLink={`/search/${property.id}`}
                  />
                )
              )
            : null}
        </div>
      </div>
    </div>
  )
}

export default Listings
