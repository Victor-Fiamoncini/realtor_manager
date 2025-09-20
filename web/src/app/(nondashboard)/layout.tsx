import React, { PropsWithChildren } from 'react'

import Navbar from '@/components/navbar'
import { NAVBAR_HEIGHT } from '@/lib/constants'

const LandingLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="h-full">
    <Navbar />

    <main className="flex h-full w-full flex-col" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
      {children}
    </main>
  </div>
)

export default LandingLayout
