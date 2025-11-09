'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

const ImagePreviews = ({ images }: ImagePreviewsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePrev = () => {
    setCurrentImageIndex((state) => (state === 0 ? images.length - 1 : state - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex((state) => (state === images.length - 1 ? 0 : state + 1))
  }

  return (
    <div className="relative h-[450px] w-full">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            className="cursor-pointer object-cover transition-transform duration-500 ease-in-out"
            src={image}
            alt={`Property Image ${index + 1}`}
            priority={index === 0}
            fill
          />
        </div>
      ))}

      <button
        className="bg-primary-700 bg-opacity-50 focus:ring-secondary-300 absolute top-1/2 left-0 -translate-y-1/2 transform rounded-full p-2 focus:ring focus:outline-none"
        title="Previous Image"
        aria-label="Previous image"
        onClick={handlePrev}
      >
        <ChevronLeft className="text-white" />
      </button>

      <button
        className="bg-primary-700 bg-opacity-50 focus:ring-secondary-300 absolute top-1/2 right-0 -translate-y-1/2 transform rounded-full p-2 focus:ring focus:outline-none"
        title="Next Image"
        aria-label="Next image"
        onClick={handleNext}
      >
        <ChevronRight className="text-white" />
      </button>
    </div>
  )
}

export default ImagePreviews
