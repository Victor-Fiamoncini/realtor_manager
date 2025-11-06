'use client'

import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const HeroSection = () => (
  <section className="relative h-screen">
    <Image
      className="object-cover object-center"
      src="/landing-splash.jpg"
      alt="Realtor Manager Hero Section"
      fill
      priority
    />

    <div className="absolute inset-0 bg-black opacity-60" />

    <div className="absolute top-1/3 w-full transform text-center">
      <div className="mx-auto max-w-4xl sm:px-12">
        <h1 className="mb-4 text-5xl font-bold text-white">Welcome to Realtor Manager</h1>

        <p className="mb-8 text-xl text-white">Find your dream home with our advanced search tools</p>

        <div className="flex justify-center">
          <Input
            className="h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white"
            type="text"
            value=""
            placeholder="Search by city, neighborhood or address"
            onChange={() => {}}
          />

          <Button className="bg-primary h-12 rounded-none rounded-r-xl" title="Search" onClick={() => {}}>
            Search
          </Button>
        </div>
      </div>
    </div>
  </section>
)

export default HeroSection
