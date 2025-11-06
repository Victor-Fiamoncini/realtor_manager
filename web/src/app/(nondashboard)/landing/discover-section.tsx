'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const DiscoverSection = () => (
  <motion.section
    className="mb-16 bg-white py-12"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.8 }}
    variants={containerVariants}
  >
    <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 xl:max-w-7xl xl:px-16">
      <motion.div className="my-12 text-center" variants={itemVariants}>
        <h2 className="leading-right text-3xl font-semibold text-gray-800">Discover</h2>

        <p className="mt-4 text-lg text-gray-600">Find you Dream Rental Property Today!</p>

        <p className="mx-auto mt-2 max-w-3xl text-gray-500">
          Searching for your dream rental property has never been easier. With our user-friendly search feature, you can
          quickly find the perfect home that meets all your needs. Start your search today and discover your dream
          rental property!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 lg:gap-12 xl:gap-16">
        {[
          {
            image: '/landing-icon-wand.png',
            title: 'Search for Properties',
            description: 'Browse through our extensive collection of rental properties in your desired location.',
          },
          {
            image: '/landing-icon-calendar.png',
            title: 'Book Your Rental',
            description: "Once you've found the perfect rental property, easily book it online with just a few clicks.",
          },
          {
            image: '/landing-icon-heart.png',
            title: 'Enjoy your New Home',
            description: 'Move into your new rental property and start enjoying your dream home.',
          },
        ].map((card, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
)

type CardProps = {
  image: string
  title: string
  description: string
}

const Card = ({ image, title, description }: CardProps) => (
  <div className="bg-secondary rounded-lg px-4 py-12 shadow-sm md:h-72">
    <div className="bg-primary mx-auto mb-4 h-10 w-10 rounded-full p-[0.6rem]">
      <Image className="h-full w-full" src={image} width={30} height={30} alt={title} />
    </div>

    <h3 className="text-primary mt-4 text-xl font-medium">{title}</h3>

    <p className="text-primary mt-2 text-base">{description}</p>
  </div>
)

export default DiscoverSection
