'use client'

import React from 'react'

import AppDashboardHeader from '@/components/app-dashboard-header'
import AppPageLoading from '@/components/app-page-loading'
import Card from '@/components/card'
import { useGetAuthUserQuery, useGetPropertiesQuery, useGetTenantQuery } from '@/state/api'

const FavoritesPage = () => {
  const { data: user } = useGetAuthUserQuery()
  const { data: tenant } = useGetTenantQuery(user.cognitoInfo.userId || '', {
    skip: !user.cognitoInfo.userId,
  })

  const {
    data: favoriteProperties,
    isLoading,
    error,
  } = useGetPropertiesQuery(
    { favoriteIds: tenant?.favorites ? tenant.favorites.map((favorite) => favorite.id) : [] },
    { skip: !tenant?.favorites || tenant?.favorites?.length === 0 }
  )

  if (isLoading) return <AppPageLoading />

  if (error) return <div>Error loading favorites</div>

  return (
    <div className="dashboard-container">
      <AppDashboardHeader title="Favorited Properties" subtitle="Browse and manage your saved property listings" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteProperties &&
          favoriteProperties.map((property) => (
            <Card key={property.id} property={property} isFavorite={true} showFavoriteButton={false} />
          ))}
      </div>

      {(!favoriteProperties || favoriteProperties?.length === 0) && (
        <p>You don&lsquo;t have any favorited properties</p>
      )}
    </div>
  )
}

export default FavoritesPage
