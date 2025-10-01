import '@aws-amplify/ui-react/styles.css'

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import React, { PropsWithChildren } from 'react'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
})

export default function AuthProvider({ children }: PropsWithChildren) {
  const { user } = useAuthenticator((context) => [context.user])

  return (
    <div className="h-full">
      <Authenticator>{() => <>{children}</>}</Authenticator>
    </div>
  )
}
