import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const sessionResponse = await fetchAuthSession()
      const { idToken } = sessionResponse.tokens || {}

      if (idToken) headers.set('Authorization', `Bearer ${idToken}`)

      return headers
    },
  }),
  reducerPath: 'api',
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const sessionResponse = await fetchAuthSession()
          const { idToken } = sessionResponse.tokens || {}
          const userRole = idToken?.payload['custom:role'] as string

          const userResponse = await getCurrentUser()
          const userDetailsResponse = await fetchWithBQ(
            userRole === 'manager' ? `/managers/${userResponse.userId}` : `/tenants/${userResponse.userId}`
          )

          return {
            data: {
              cognitoInfo: { ...userResponse },
              userInfo: userDetailsResponse.data as Tenant | Manager,
              userRole: userRole as Tenant | Manager,
            },
          }
        } catch {
          return { error: 'Could not fetch user data' }
        }
      },
    }),
  }),
})

export const {} = api
