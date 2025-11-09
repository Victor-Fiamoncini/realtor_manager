import axios from 'axios'
import { debounce } from 'lodash'
import { Filter, Grid, List, Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PropertyTypeIcons } from '@/lib/constants'
import { cleanParams, cn, formatPriceValue } from '@/lib/utils'
import { FiltersState, setFilters, setViewMode, toggleFiltersFullOpen } from '@/state'
import { useAppSelector } from '@/state/hooks'

const FiltersBar = () => {
  const dispatch = useDispatch()

  const { filters, isFiltersFullOpen, viewMode } = useAppSelector((state) => state.global)

  const [searchInput, setSearchInput] = useState(filters.location)

  const router = useRouter()
  const pathname = usePathname()

  const updateURL = debounce((newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters)
    const updatedSearchParams = new URLSearchParams()

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(key, Array.isArray(value) ? value.join(',') : value.toString())
    })

    router.push(`${pathname}?${updatedSearchParams.toString()}`)
  })

  const handleFilterChange = (key: string, value: any, isMin: boolean | null) => {
    let newValue = value

    if (key === 'priceRange' || key === 'squareFeet') {
      const currentArrayRange = [...filters[key]]

      if (isMin !== null) {
        const index = isMin ? 0 : 1

        currentArrayRange[index] = value === 'any' ? null : Number(value)
      }

      newValue = currentArrayRange
    } else if (key === 'coordinates') {
      newValue = value === 'any' ? [0, 0] : value.map(Number)
    } else {
      newValue = value === 'any' ? 'any' : value
    }

    const newFilters = { ...filters, [key]: newValue }

    dispatch(setFilters(newFilters))

    updateURL(newFilters)
  }

  const handleLocationSearch = async () => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json`

    try {
      const { data } = await axios.get(url, {
        params: { access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN, fuzzyMatch: 'true' },
      })

      if (data && data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center

        dispatch(setFilters({ location: searchInput, coordinates: [lng, lat] }))
      }
    } catch (error) {
      console.error('FiltersBar.handleLocationSearch error', error)
    }
  }

  return (
    <div className="flex w-full items-center justify-between py-5">
      <div className="flex items-center justify-between gap-4 p-2">
        <Button
          className={cn(
            'border-primary cursor-pointer gap-2 rounded-xl',
            isFiltersFullOpen && 'bg-primary-700 text-primary-100'
          )}
          variant="outline"
          title="All Filters"
          onClick={() => dispatch(toggleFiltersFullOpen())}
        >
          <Filter className="h-4 w-4" />

          <span>All Filters</span>
        </Button>

        <div className="flex items-center">
          <Input
            className="border-primary w-full min-w-44 rounded-l-xl rounded-r-none border-r-0"
            placeholder="Search location"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          <Button
            className="border-l-none border-primary cursor-pointer rounded-l-none rounded-r-xl border shadow-none"
            title="Search"
            onClick={handleLocationSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.priceRange[0]?.toString() || 'any'}
            onValueChange={(value) => handleFilterChange('priceRange', value, true)}
          >
            <SelectTrigger className="border-primary w-full rounded-xl">
              <SelectValue>{formatPriceValue(filters.priceRange[0], true)}</SelectValue>
            </SelectTrigger>

            <SelectContent className="bg-white">
              <SelectItem value="any">Any Min Price</SelectItem>

              {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  ${price / 1000}k+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priceRange[1]?.toString() || 'any'}
            onValueChange={(value) => handleFilterChange('priceRange', value, false)}
          >
            <SelectTrigger className="border-primary w-full rounded-xl">
              <SelectValue>{formatPriceValue(filters.priceRange[1], false)}</SelectValue>
            </SelectTrigger>

            <SelectContent className="bg-white">
              <SelectItem value="any">Any Max Price</SelectItem>

              {[1000, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  &lt;${price / 1000}k
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select value={filters.beds} onValueChange={(value) => handleFilterChange('beds', value, null)}>
            <SelectTrigger className="border-primary w-full rounded-xl">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>

            <SelectContent className="bg-white">
              <SelectItem value="any">Any Beds</SelectItem>

              <SelectItem value="1">1+ bed</SelectItem>

              <SelectItem value="2">2+ beds</SelectItem>

              <SelectItem value="3">3+ beds</SelectItem>

              <SelectItem value="4">4+ beds</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.baths} onValueChange={(value) => handleFilterChange('baths', value, null)}>
            <SelectTrigger className="border-primary w-full rounded-xl">
              <SelectValue placeholder="Baths" />
            </SelectTrigger>

            <SelectContent className="bg-white">
              <SelectItem value="any">Any Baths</SelectItem>

              <SelectItem value="1">1+ bath</SelectItem>

              <SelectItem value="2">2+ baths</SelectItem>

              <SelectItem value="3">3+ baths</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select
          value={filters.propertyType || 'any'}
          onValueChange={(value) => handleFilterChange('propertyType', value, null)}
        >
          <SelectTrigger className="border-primary w-full rounded-xl">
            <SelectValue placeholder="Home Type" />
          </SelectTrigger>

          <SelectContent className="bg-white">
            <SelectItem value="any">Any Property Type</SelectItem>

            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />

                  <span>{type}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-4 p-2">
        <div className="flex rounded-xl border">
          <Button
            className={cn(
              'cursor-pointer rounded-none rounded-l-xl px-3 py-1',
              viewMode === 'list' ? 'bg-primary text-secondary' : ''
            )}
            variant="ghost"
            onClick={() => dispatch(setViewMode('list'))}
          >
            <List className="h-5 w-5" />
          </Button>

          <Button
            className={cn(
              'cursor-pointer rounded-none rounded-r-xl px-3 py-1',
              viewMode === 'grid' ? 'bg-primary text-secondary' : ''
            )}
            variant="ghost"
            onClick={() => dispatch(setViewMode('grid'))}
          >
            <Grid className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FiltersBar
