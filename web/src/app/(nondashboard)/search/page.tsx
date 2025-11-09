'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import FiltersBar from '@/app/(nondashboard)/search/filters-bar'
import FiltersFull from '@/app/(nondashboard)/search/filters-full'
import Listings from '@/app/(nondashboard)/search/listings'
import Map from '@/app/(nondashboard)/search/map'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { cleanParams } from '@/lib/utils'
import { setFilters } from '@/state'
import { useAppDispatch, useAppSelector } from '@/state/hooks'

const SearchPage = () => {
  const dispatch = useAppDispatch()
  const { isFiltersFullOpen } = useAppSelector((state) => state.global)

  const searchParams = useSearchParams()

  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce((acc: any, [key, value]) => {
      if (key === 'priceRange' || key === 'squareFeet') {
        acc[key] = value.split(',').map((v) => (v === '' ? null : Number(v)))
      } else if (key === 'coordinates') {
        acc[key] = value.split(',').map(Number)
      } else {
        acc[key] = value === 'any' ? null : value
      }

      return acc
    }, {})

    const cleanedFilters = cleanParams(initialFilters)

    dispatch(setFilters(cleanedFilters))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto flex w-full flex-col px-5" style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}>
      <FiltersBar />

      <div className="mb-5 flex flex-1 justify-between gap-3 overflow-hidden">
        <div
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${
            isFiltersFullOpen ? 'visible w-3/12 opacity-100' : 'invisible w-0 opacity-0'
          }`}
        >
          <FiltersFull />
        </div>

        <Map />

        <div className="basis-4/12 overflow-y-auto">
          <Listings />
        </div>
      </div>
    </div>
  )
}

export default SearchPage
