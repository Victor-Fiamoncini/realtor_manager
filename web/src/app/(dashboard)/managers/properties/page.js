'use client'

import React from 'react'

import AppDashboardHeader from '@/components/app-dashboard-header'
import AppPageLoading from '@/components/app-page-loading'
import Card from '@/components/card'
import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from '@/state/api'

const PropertiesPage = () => {
  const { data: user } = useGetAuthUserQuery()
  const {
    data: managerProperties,
    isLoading,
    error,
  } = useGetManagerPropertiesQuery(user?.cognitoInfo?.userId || '', {
    skip: !user?.cognitoInfo?.userId,
  })

  if (isLoading) return <AppPageLoading />

  if (error) return <div>Error loading manager properties</div>

  return (
    <div className="dashboard-container">
      <AppDashboardHeader title="My Properties" subtitle="View and manage your property listings" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {managerProperties?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={false}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/managers/properties/${property.id}`}
          />
        ))}
      </div>

      {(!managerProperties || managerProperties.length === 0) && <p>You don&lsquo;t manage any properties</p>}
    </div>
  )
}

export default PropertiesPage
