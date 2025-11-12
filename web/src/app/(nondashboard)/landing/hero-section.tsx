'use client'

import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { setFilters } from '@/state'
import { useAppDispatch } from '@/state/hooks'

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const dispatch = useAppDispatch()

  const router = useRouter()

  const handleLocationSearch = async () => {
    const trimmedQuery = searchQuery.trim()

    if (!trimmedQuery) return

    try {
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmedQuery)}.json`,
        {
          params: {
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            fuzzyMatch: 'true',
          },
        }
      )

      if (data && data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center

        dispatch(setFilters({ location: trimmedQuery, coordinates: [lat, lng] }))

        const params = new URLSearchParams({
          location: trimmedQuery,
          lat: lat.toString(),
          lng: lng.toString(),
        })

        router.push(`/search?${params.toString()}`)
      }
    } catch (error) {
      console.error('HeroSection.handleLocationSearch error', error)
    }
  }

  return (
    <section className="relative h-screen">
      <Image
        className="object-cover object-center"
        src="/landing-splash.jpg"
        alt="Realtor Manager Hero Section"
        fill
        priority
      />

      <div className="absolute inset-0 bg-black opacity-60" />

      <div className="absolute top-1/3 w-full transform text-center">
        <div className="mx-auto max-w-4xl sm:px-12">
          <h1 className="mb-4 text-5xl font-bold text-white">Welcome to Realtor Manager</h1>

          <p className="mb-8 text-xl text-white">Find your dream home with our advanced search tools</p>

          <div className="flex justify-center">
            <Input
              className="h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white"
              type="text"
              placeholder="Search by city, neighborhood or address"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />

            <Button className="bg-primary h-12 rounded-none rounded-r-xl" title="Search" onClick={handleLocationSearch}>
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
