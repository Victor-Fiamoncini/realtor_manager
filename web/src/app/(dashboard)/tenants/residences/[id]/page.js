'use client'

import { Download, MapPin, User } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

import AppPageLoading from '@/components/app-page-loading'
import { useGetAuthUserQuery, useGetLeasesQuery, useGetPropertyQuery } from '@/state/api'
import Image from 'next/image'

const ResidenceCard = ({ property, currentLease }) => (
  <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-md">
    <div className="flex gap-5">
      <Image
        className="h-32 w-64 rounded-xl bg-slate-500 object-cover"
        src="/placeholder.jpg"
        width={300}
        height={200}
        alt={property.name}
      />

      <div className="flex flex-col justify-between">
        <div>
          <div className="w-fit rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white">
            Active Leases
          </div>

          <h2 className="my-2 text-2xl font-bold">{property.name}</h2>

          <div className="mb-2 flex items-center">
            <MapPin className="mr-1 h-5 w-5" />

            <span>
              {property.location.city}, {property.location.country}
            </span>
          </div>
        </div>

        <div className="text-xl font-bold">
          ${currentLease.rent} <span className="text-sm font-normal text-gray-500">/ night</span>
        </div>
      </div>
    </div>

    <div>
      <hr className="my-4" />

      <div className="flex items-center justify-between">
        <div className="xl:flex">
          <div className="mr-2 text-gray-500">Start Date: </div>

          <div className="font-semibold">{new Date(currentLease.startDate).toLocaleDateString()}</div>
        </div>

        <div className="border-primary-300 h-4 border-[0.5px]" />

        <div className="xl:flex">
          <div className="mr-2 text-gray-500">End Date: </div>

          <div className="font-semibold">{new Date(currentLease.endDate).toLocaleDateString()}</div>
        </div>

        <div className="border-primary-300 h-4 border-[0.5px]" />

        <div className="xl:flex">
          <div className="mr-2 text-gray-500">Next Payment: </div>

          <div className="font-semibold">{new Date(currentLease.endDate).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  </div>
)

const ResidencePage = () => {
  const { id } = useParams()

  const { data: user } = useGetAuthUserQuery()
  const { data: property, isLoading: propertyLoading, error: propertyError } = useGetPropertyQuery(Number(id))

  const { data: leases, isLoading: leasesLoading } = useGetLeasesQuery(parseInt(user?.cognitoInfo?.userId || '0'), {
    skip: !user?.cognitoInfo?.userId,
  })

  if (propertyLoading || leasesLoading) return <AppPageLoading />

  if (!property || propertyError) return <div>Error loading property</div>

  const currentLease = leases?.find((lease) => lease.propertyId === property.id)

  return (
    <div className="dashboard-container">
      <div className="mx-auto w-full">
        <div className="gap-10 md:flex">
          {currentLease && <ResidenceCard property={property} currentLease={currentLease} />}
        </div>
      </div>
    </div>
  )
}

export default ResidencePage
