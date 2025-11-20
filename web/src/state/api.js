import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'

import { cleanParams, createNewUserInDatabase, withToast } from '@/lib/utils'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession()
      const { idToken } = session.tokens ?? {}

      if (idToken) headers.set('Authorization', `Bearer ${idToken}`)

      return headers
    },
  }),
  reducerPath: 'api',
  tagTypes: ['Applications', 'Leases', 'Managers', 'Properties', 'PropertyDetails', 'Tenants'],
  endpoints: (build) => ({
    getAuthUser: build.query({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession()

          const { idToken } = session.tokens ?? {}
          const userRole = idToken?.payload['custom:role']

          const user = await getCurrentUser()

          const endpoint = userRole === 'manager' ? `/managers/${user.userId}` : `/tenants/${user.userId}`

          let userDetailsResponse = await fetchWithBQ(endpoint)

          if (userDetailsResponse.error?.status === 404) {
            userDetailsResponse = await createNewUserInDatabase(user, idToken, userRole, fetchWithBQ)
          }

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data,
              userRole,
            },
          }
        } catch {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: 'Could not authenticate user',
            },
          }
        }
      },
    }),

    updateTenantSettings: build.mutation({
      query: ({ cognitoId, ...body }) => ({ url: `/tenants/${cognitoId}`, method: 'PUT', body }),
      invalidatesTags: (result) => [{ type: 'Tenants', id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: 'Tenant settings updated successfully!',
          error: 'Failed to update tenant settings.',
        })
      },
    }),

    updateManagerSettings: build.mutation({
      query: ({ cognitoId, ...body }) => ({ url: `/managers/${cognitoId}`, method: 'PUT', body }),
      invalidatesTags: (result) => [{ type: 'Managers', id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: 'Manager settings updated successfully!',
          error: 'Failed to update manager settings.',
        })
      },
    }),

    getProperties: build.query({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(','),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(','),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        })

        return { url: 'properties', params }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Properties', id })), { type: 'Properties', id: 'LIST' }]
          : [{ type: 'Properties', id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: 'Failed to fetch properties.' })
      },
    }),

    getProperty: build.query({
      query: (id) => `properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'PropertyDetails', id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: 'Failed to load property details.' })
      },
    }),

    getTenant: build.query({
      query: (cognitoId) => `tenants/${cognitoId}`,
      providesTags: (result) => [{ type: 'Tenants', id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: 'Failed to load tenant profile.' })
      },
    }),

    getCurrentResidences: build.query({
      query: (cognitoId) => `tenants/${cognitoId}/current-residences`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Properties', id })), { type: 'Properties', id: 'LIST' }]
          : [{ type: 'Properties', id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: 'Failed to fetch current residences.' })
      },
    }),

    addFavoriteProperty: build.mutation({
      query: ({ cognitoId, propertyId }) => ({ url: `tenants/${cognitoId}/favorites/${propertyId}`, method: 'POST' }),
      invalidatesTags: (result) => [
        { type: 'Tenants', id: result?.id },
        { type: 'Properties', id: 'LIST' },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: 'Added to favorites!',
          error: 'Failed to add to favorites',
        })
      },
    }),

    removeFavoriteProperty: build.mutation({
      query: ({ cognitoId, propertyId }) => ({ url: `tenants/${cognitoId}/favorites/${propertyId}`, method: 'DELETE' }),
      invalidatesTags: (result) => [
        { type: 'Tenants', id: result?.id },
        { type: 'Properties', id: 'LIST' },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: 'Removed from favorites!',
          error: 'Failed to remove from favorites.',
        })
      },
    }),

    createApplication: build.mutation({
      query: (body) => ({ url: `applications`, method: 'POST', body }),
      invalidatesTags: ['Applications'],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: 'Application created successfully!',
          error: 'Failed to create applications.',
        })
      },
    }),

    getLeases: build.query({
      query: () => 'leases',
      providesTags: ['Leases'],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: 'Failed to fetch leases.' })
      },
    }),

    getPropertyLeases: build.query({
      query: (propertyId) => `properties/${propertyId}/leases`,
      providesTags: ['Leases'],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: 'Failed to fetch property leases.' })
      },
    }),

    getManagerProperties: build.query({
      query: (cognitoId) => `managers/${cognitoId}/properties`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Properties', id })), { type: 'Properties', id: 'LIST' }]
          : [{ type: 'Properties', id: 'LIST' }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: 'Failed to load manager profile.' })
      },
    }),

    createProperty: build.mutation({
      query: (body) => ({ url: `properties`, method: 'POST', body }),
      invalidatesTags: (result) => [
        { type: 'Properties', id: 'LIST' },
        { type: 'Managers', id: result?.manager?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: 'Property created successfully!',
          error: 'Failed to create property.',
        })
      },
    }),

    getApplications: build.query({
      query: (params) => {
        const queryParams = new URLSearchParams()

        if (params.userId) queryParams.append('userId', params.userId.toString())

        if (params.userType) queryParams.append('userType', params.userType)

        return `applications?${queryParams.toString()}`
      },
      providesTags: ['Applications'],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: 'Failed to fetch applications.' })
      },
    }),

    updateApplicationStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `applications/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Applications', 'Leases'],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: 'Application status updated successfully!',
          error: 'Failed to update application settings.',
        })
      },
    }),
  }),
})

export const {
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetTenantQuery,
  useGetCurrentResidencesQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useCreateApplicationMutation,
  useGetLeasesQuery,
  useGetPropertyLeasesQuery,
  useGetManagerPropertiesQuery,
  useCreatePropertyMutation,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
} = api
