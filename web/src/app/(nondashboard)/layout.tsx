import React, { PropsWithChildren } from 'react'

import Navbar from '@/components/navbar'
import { NAVBAR_HEIGHT } from '@/lib/constants'

const LandingLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="h-full">
    <Navbar />

    <main className="h-full flex flex-col w-full" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
      {children}
    </main>
  </div>
)

export default LandingLayout
