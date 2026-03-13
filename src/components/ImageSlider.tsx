// src/components/ImageSlider.tsx

"use client"; // This is important for client-side interactivity in Next.js App Router

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[]; // Array of image URLs
  interval?: number; // Optional: Interval for auto-slide in milliseconds (default 5000ms)
}

export default function ImageSlider({ images, interval = 5000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [images.length, interval]); // Re-run effect if images or interval change

  // Go to previous slide
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Go to next slide
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Go to a specific slide (for pagination dots)
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (images.length === 0) {
    return <div className="text-center py-10 text-gray-500">No images to display.</div>;
  }

  return (
    // Adjusted heights for a smaller slider. You can further tune these values.
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-lg shadow-lg">
      {/* Slider Inner Container */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          // Each slide item needs to be full width and height of the container
          // and relative for the Image fill prop
          <div key={index} className="relative w-full flex-shrink-0 h-full">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill // Replaces layout="responsive" and makes image fill parent
              className="object-cover rounded-lg" // Replaces objectFit="cover" and keeps rounded corners
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
              priority={index === 0} // Load the first image with high priority
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors duration-200 focus:outline-none z-10"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors duration-200 focus:outline-none z-10"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}