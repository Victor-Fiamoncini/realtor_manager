import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { NAVBAR_HEIGHT } from '@/lib/constants'

const Navbar = () => (
  <header className="fixed left-0 top-0 z-50 w-full shadow-xl" style={{ height: `${NAVBAR_HEIGHT}px` }}>
    <div className="flex h-full w-full items-center justify-between bg-primary-700 px-8 py-3 text-white">
      <Link className="cursor-pointer text-xl font-bold hover:text-primary-300" href="/" scroll={false}>
        Realtor Manager
      </Link>

      <p className="hidden text-primary-200 md:block">
        Discover your perfect rental apartment with our advanced search
      </p>

      <div className="flex items-center gap-5">
        <Link href="/sign-in">
          <Button
            className="rounded-lg border-white bg-transparent text-white hover:bg-white hover:text-primary-700"
            variant="outline"
            title="Sign In to Realtor Manager"
          >
            Sign In
          </Button>
        </Link>

        <Link href="/sign-up">
          <Button
            className="rounded-lg bg-secondary-600 text-white hover:bg-white hover:text-primary-700"
            variant="secondary"
            title="Sign Up for Realtor Manager"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  </header>
)

export default Navbar
