'use client'

import '@aws-amplify/ui-react/styles.css'

import { Authenticator, Heading, Radio, RadioGroupField, useAuthenticator, View } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
})

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      label: 'Email',
      isRequired: true,
      type: 'email',
    },
    password: {
      placeholder: 'Enter your password',
      label: 'Password',
      isRequired: true,
      type: 'password',
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: 'Choose a username',
      label: 'Username',
      isRequired: true,
      type: 'text',
    },
    email: {
      order: 2,
      placeholder: 'Enter your email address',
      label: 'Email',
      isRequired: true,
      type: 'email',
    },
    password: {
      order: 3,
      placeholder: 'Create a password',
      label: 'Password',
      isRequired: true,
      type: 'password',
    },
    confirm_password: {
      order: 4,
      placeholder: 'Confirm your password',
      label: 'Confirm Password',
      isRequired: true,
      type: 'password',
    },
  },
}

const components = {
  Header() {
    const { route } = useAuthenticator()

    let subtext = 'Please sign in to continue'

    if (route !== 'signIn' && route !== 'signUp') return null

    if (route === 'signUp') subtext = 'Sign up to get started'

    return (
      <View className="mt-4 mb-6">
        <Heading className="text-center! text-2xl! font-bold!" level={3}>
          Welcome to Realtor Manager
        </Heading>

        <p className="text-muted-foreground mt-2 text-center">{subtext}</p>
      </View>
    )
  },
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator()

      return (
        <View className="mt-4 text-center">
          <p className="text-muted-foreground">Don&apos;t have an account?</p>

          <button
            className="text-primary border-none bg-transparent p-0 hover:underline"
            onClick={toSignUp}
            title="Sign up here"
          >
            Sign up here
          </button>
        </View>
      )
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator()

      return (
        <>
          <Authenticator.SignUp.FormFields />

          <RadioGroupField
            legend="Role"
            defaultValue="tenant"
            name="custom:role"
            errorMessage={validationErrors?.['custom:role']}
            hasError={!!validationErrors?.['custom:role']}
            isRequired
          >
            <Radio value="tenant">Tenant</Radio>

            <Radio value="manager">Manager</Radio>
          </RadioGroupField>
        </>
      )
    },
    Footer() {
      const { toSignIn } = useAuthenticator()

      return (
        <View className="mt-4 text-center">
          <p className="text-muted-foreground">Already have an account?</p>

          <button
            className="text-primary border-none bg-transparent p-0 hover:underline"
            onClick={toSignIn}
            title="Sign in here"
          >
            Sign in here
          </button>
        </View>
      )
    },
  },
}

export default function AuthProvider({ children }) {
  const { route, user } = useAuthenticator((context) => [context.route, context.user])

  const router = useRouter()
  const pathname = usePathname()

  const isAuthPage = pathname === '/signin' || pathname === '/signup'
  const isLandingPage = pathname === '/landing'

  useEffect(() => {
    if (user && isAuthPage) {
      router.push('/landing', { scroll: false })
    }
  }, [user, isAuthPage, router])

  if ((route === 'authenticated' && user) || isLandingPage) return children

  if (isAuthPage) {
    return (
      <div className="h-full">
        <Authenticator
          initialState={pathname.includes('signup') ? 'signUp' : 'signIn'}
          components={components}
          formFields={formFields}
        >
          {() => <>{children}</>}
        </Authenticator>
      </div>
    )
  }

  return children
}
