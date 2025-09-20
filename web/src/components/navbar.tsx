import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { NAVBAR_HEIGHT } from '@/lib/constants'

const Navbar = () => (
  <header className="fixed top-0 left-0 w-full z-50 shadow-xl" style={{ height: `${NAVBAR_HEIGHT}px` }}>
    <div className="flex justify-between items-center w-full h-full py-3 px-8 bg-primary-700 text-white">
      <Link className="cursor-pointer text-xl font-bold hover:text-primary-300" href="/" scroll={false}>
        Realtor Manager
      </Link>

      <p className="text-primary-200 hidden md:block">
        Discover your perfect rental apartment with our advanced search
      </p>

      <div className="flex items-center gap-5">
        <Link href="/sign-in">
          <Button
            className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
            variant="outline"
            title="Sign In to Realtor Manager"
          >
            Sign In
          </Button>
        </Link>

        <Link href="/sign-up">
          <Button
            className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
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
