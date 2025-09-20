'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const FeaturesSection = () => <section></section>

export default FeaturesSection
