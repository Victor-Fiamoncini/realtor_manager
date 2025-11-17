import axios from 'axios'
import { debounce } from 'lodash'
import { Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { AmenityIcons, PropertyTypeIcons } from '@/lib/constants'
import { cleanParams, cn, formatEnumString } from '@/lib/utils'
import { initialState, setFilters } from '@/state'
import { useAppSelector } from '@/state/hooks'

const FiltersFull = () => {
  const dispatch = useDispatch()

  const { filters, isFiltersFullOpen } = useAppSelector((state) => state.global)

  const [localFilters, setLocalFilters] = useState(initialState.filters)

  const router = useRouter()
  const pathname = usePathname()

  const updateURL = debounce((newFilters) => {
    const cleanFilters = cleanParams(newFilters)
    const updatedSearchParams = new URLSearchParams()

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(key, Array.isArray(value) ? value.join(',') : value.toString())
    })

    router.push(`${pathname}?${updatedSearchParams.toString()}`)
  })

  const handleSubmit = () => {
    dispatch(setFilters(localFilters))

    updateURL(localFilters)
  }

  const handleReset = () => {
    setLocalFilters(initialState.filters)

    dispatch(setFilters(initialState.filters))

    updateURL(initialState.filters)
  }

  const handleAmenityChange = (amenity) => {
    setLocalFilters((state) => ({
      ...state,
      amenities: state.amenities.includes(amenity)
        ? state.amenities.filter((a) => a !== amenity)
        : [...state.amenities, amenity],
    }))
  }

  const handleLocationSearch = async () => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(localFilters.location)}.json`

    try {
      const { data } = await axios.get(url, {
        params: { access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN, fuzzyMatch: 'true' },
      })

      if (data && data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center

        setLocalFilters((state) => ({ ...state, coordinates: [lng, lat] }))
      }
    } catch (error) {
      console.error('FiltersFull.handleLocationSearch error', error)
    }
  }

  if (!isFiltersFullOpen) return null

  return (
    <div className="h-full overflow-auto rounded-lg bg-white px-4 pb-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h4 className="mb-2 font-bold">Location</h4>

          <div className="flex items-center">
            <Input
              className="border-primary rounded-l-xl rounded-r-none border-r-0"
              placeholder="Enter location"
              value={filters.location}
              onChange={(event) =>
                setLocalFilters((state) => ({
                  ...state,
                  location: event.target.value,
                }))
              }
            />

            <Button
              className="border-l-none border-primary cursor-pointer rounded-l-none rounded-r-xl border shadow-none"
              title="Search"
              onClick={handleLocationSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-bold">Property Type</h4>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <div
                key={type}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4',
                  localFilters.propertyType === type ? 'border-primary' : 'border-gray-200'
                )}
                onClick={() =>
                  setLocalFilters((state) => ({
                    ...state,
                    propertyType: type,
                  }))
                }
              >
                <Icon className="mb-2 h-6 w-6" />

                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-bold">Price Range (Monthly)</h4>

          <Slider
            min={0}
            max={10000}
            step={100}
            value={[localFilters.priceRange[0] ?? 0, localFilters.priceRange[1] ?? 10000]}
            onValueChange={(value) =>
              setLocalFilters((state) => ({
                ...state,
                priceRange: value,
              }))
            }
          />

          <div className="mt-2 flex justify-between">
            <span>${localFilters.priceRange[0] ?? 0}</span>

            <span>${localFilters.priceRange[1] ?? 10000}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="mb-2 font-bold">Beds</h4>

            <Select
              value={localFilters.beds || 'any'}
              onValueChange={(value) => setLocalFilters((state) => ({ ...state, beds: value }))}
            >
              <SelectTrigger className="border-primary w-full rounded-xl">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="any">Any beds</SelectItem>

                <SelectItem value="1">1+ bed</SelectItem>

                <SelectItem value="2">2+ beds</SelectItem>

                <SelectItem value="3">3+ beds</SelectItem>

                <SelectItem value="4">4+ beds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <h4 className="mb-2 font-bold">Baths</h4>

            <Select
              value={localFilters.baths || 'any'}
              onValueChange={(value) => setLocalFilters((state) => ({ ...state, baths: value }))}
            >
              <SelectTrigger className="border-primary w-full rounded-xl">
                <SelectValue placeholder="Baths" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="any">Any baths</SelectItem>

                <SelectItem value="1">1+ bath</SelectItem>

                <SelectItem value="2">2+ baths</SelectItem>

                <SelectItem value="3">3+ baths</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-bold">Square Feet</h4>

          <Slider
            className="[&>.bar]:bg-primary"
            min={0}
            max={5000}
            step={100}
            value={[localFilters.squareFeet[0] ?? 0, localFilters.squareFeet[1] ?? 5000]}
            onValueChange={(value) =>
              setLocalFilters((state) => ({
                ...state,
                squareFeet: value,
              }))
            }
          />

          <div className="mt-2 flex justify-between">
            <span>{localFilters.squareFeet[0] ?? 0} sq ft</span>

            <span>{localFilters.squareFeet[1] ?? 5000} sq ft</span>
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-bold">Amenities</h4>

          <div className="flex flex-wrap gap-2">
            {Object.entries(AmenityIcons).map(([amenity, Icon]) => (
              <div
                key={amenity}
                className={cn(
                  'flex items-center space-x-2 rounded-lg border p-2 hover:cursor-pointer',
                  localFilters.amenities.includes(amenity) ? 'border-black' : 'border-gray-200'
                )}
                onClick={() => handleAmenityChange(amenity)}
              >
                <Icon className="h-5 w-5 hover:cursor-pointer" />

                <Label className="hover:cursor-pointer">{formatEnumString(amenity)}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-bold">Available From</h4>

          <Input
            className="border-primary rounded-xl"
            type="date"
            value={localFilters.availableFrom !== 'any' ? localFilters.availableFrom : ''}
            onChange={(event) =>
              setLocalFilters((state) => ({
                ...state,
                availableFrom: event.target.value ? event.target.value : 'any',
              }))
            }
          />
        </div>

        <div className="mt-6 flex gap-4">
          <Button className="flex-1 cursor-pointer rounded-xl" title="Apply" onClick={handleSubmit}>
            Apply
          </Button>

          <Button
            className="flex-1 cursor-pointer rounded-xl"
            variant="outline"
            title="Reset Filters"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FiltersFull
