'use client'

import React from 'react'

import AppDashboardHeader from '@/components/app-dashboard-header'
import AppPageLoading from '@/components/app-page-loading'
import Card from '@/components/card'
import { useGetAuthUserQuery, useGetCurrentResidencesQuery, useGetTenantQuery } from '@/state/api'

const ResidencesPage = () => {
  const { data: user } = useGetAuthUserQuery()
  const { data: tenant } = useGetTenantQuery(user?.cognitoInfo?.userId || '', {
    skip: !user?.cognitoInfo?.userId,
  })

  const {
    data: currentResidences,
    isLoading,
    error,
  } = useGetCurrentResidencesQuery(user?.cognitoInfo?.userId || '', {
    skip: !user?.cognitoInfo?.userId,
  })

  if (isLoading) return <AppPageLoading />

  if (error) return <div>Error loading current residences</div>

  return (
    <div className="dashboard-container">
      <AppDashboardHeader title="Current Residences" subtitle="View and manage your current living spaces" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentResidences &&
          currentResidences.map((property) => (
            <Card
              key={property.id}
              property={property}
              isFavorite={tenant?.favorites ? tenant.favorites.includes(property.id) : false}
              onFavoriteToggle={() => {}}
              showFavoriteButton={false}
              propertyLink={`/tenants/residences/${property.id}`}
            />
          ))}
      </div>

      {(!currentResidences || currentResidences?.length === 0) && <p>You don&lsquo;t have any current residences</p>}
    </div>
  )
}

export default ResidencesPage
