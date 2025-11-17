'use client'

import { Authenticator } from '@aws-amplify/ui-react'

import AuthProvider from '@/app/(auth)/auth-provider'
import StoreProvider from '@/state/redux'

const Providers = ({ children }) => (
  <StoreProvider>
    <Authenticator.Provider>
      <AuthProvider>{children}</AuthProvider>
    </Authenticator.Provider>
  </StoreProvider>
)

export default Providers
