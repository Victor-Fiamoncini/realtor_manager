'use client'

import { PropsWithChildren } from 'react'

import StoreProvider from '@/state/redux'

const Providers = ({ children }: PropsWithChildren) => <StoreProvider>{children}</StoreProvider>

export default Providers
