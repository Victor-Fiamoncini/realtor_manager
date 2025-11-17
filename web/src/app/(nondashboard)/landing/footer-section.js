import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const FooterSection = () => (
  <footer className="py-16">
    <div className="mx-auto max-w-4xl px-6 sm:px-8">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 flex items-center gap-4 text-xl font-bold">
          <Image
            className="rounded-md bg-gray-600 p-1"
            src="/logo.png"
            alt="Realtor Manager Logo"
            width={40}
            height={40}
          />

          <>Realtor Manager</>
        </div>

        <nav className="mb-4">
          <ul className="flex space-x-6">
            <li>
              <Link href="/about" title="About Us">
                About Us
              </Link>
            </li>

            <li>
              <Link href="/contact" title="Contact Us">
                Contact Us
              </Link>
            </li>

            <li>
              <Link href="/faq" title="Frequently Asked Questions">
                FAQ
              </Link>
            </li>

            <li>
              <Link href="/terms" title="Terms of Service">
                Terms
              </Link>
            </li>

            <li>
              <Link href="/privacy" title="Privacy Policy">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-8 flex justify-center space-x-4 text-center text-sm text-gray-500">
        <span>&copy; Realtor Manager. All rights reserved.</span>
      </div>
    </div>
  </footer>
)

export default FooterSection
