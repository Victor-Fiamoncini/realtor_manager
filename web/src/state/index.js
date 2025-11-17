import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  filters: {
    location: 'Los Angeles',
    beds: 'any',
    baths: 'any',
    propertyType: 'any',
    amenities: [],
    availableFrom: 'any',
    priceRange: [null, null],
    squareFeet: [null, null],
    coordinates: [-118.25, 34.05],
  },
  isFiltersFullOpen: false,
  viewMode: 'grid',
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
  },
})

export const { setFilters, toggleFiltersFullOpen, setViewMode } = globalSlice.actions

export default globalSlice.reducer
