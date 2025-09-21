'use client'

import { motion } from 'framer-motion'
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

    <div className="absolute inset-0 bg-black bg-opacity-60" />

    <motion.div
      className="absolute top-1/3 w-full -translate-x-1/2 -translate-y-1/2 transform text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-auto max-w-4xl px-16 sm:px-12">
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

          <Button
            className="h-12 rounded-none rounded-r-xl border-none bg-secondary-500 text-white hover:bg-secondary-600"
            title="Search"
            onClick={() => {}}
          >
            Search
          </Button>
        </div>
      </div>
    </motion.div>
  </section>
)

export default HeroSection
