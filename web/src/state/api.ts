import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'

import { createNewUserInDatabase } from '@/lib/utils'
import { Manager, Tenant } from '@/types/prismaTypes'

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
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession()

          const { idToken } = session.tokens ?? {}
          const userRole = idToken?.payload['custom:role'] as string

          const user = await getCurrentUser()

          const endpoint = userRole === 'manager' ? `/managers/${user.userId}` : `/tenants/${user.userId}`

          let userDetailsResponse = await fetchWithBQ(endpoint)

          if (userDetailsResponse.error?.status === 404) {
            userDetailsResponse = await createNewUserInDatabase(user, idToken, userRole, fetchWithBQ)
          }

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data as Tenant | Manager,
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
  }),
})

export const { useGetAuthUserQuery } = api
