'use client'

import { useParams } from 'next/navigation'
import React, { useState } from 'react'

import ApplicationModal from '@/app/(nondashboard)/search/[id]/application-modal'
import ContactWidget from '@/app/(nondashboard)/search/[id]/contact-widget'
import ImagePreviews from '@/app/(nondashboard)/search/[id]/image-previews'
import PropertyDetails from '@/app/(nondashboard)/search/[id]/property-details'
import PropertyLocation from '@/app/(nondashboard)/search/[id]/property-location'
import PropertyOverview from '@/app/(nondashboard)/search/[id]/property-overview'
import { useGetAuthUserQuery } from '@/state/api'

const PropertyDetailsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: user } = useGetAuthUserQuery()

  const { id } = useParams()
  const propertyId = Number(id)

  return (
    <div>
      <ImagePreviews images={['/singlelisting-2.jpg', '/singlelisting-3.jpg']} />

      <div className="mx-10 mt-16 mb-8 flex flex-col justify-center gap-10 md:mx-auto md:w-2/3 md:flex-row">
        <div className="order-2 md:order-1">
          <PropertyOverview propertyId={propertyId} />

          <PropertyDetails propertyId={propertyId} />

          <PropertyLocation propertyId={propertyId} />
        </div>

        <div className="order-1 md:order-2">
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>

      {user && <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} propertyId={propertyId} />}
    </div>
  )
}

export default PropertyDetailsPage
