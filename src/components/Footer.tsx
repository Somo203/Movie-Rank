"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto shadow-lg">
  <div className="container mx-auto max-w-6xl px-4 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-between">
    {/* Company Info Section */}
    <div className="col-span-1 text-center md:text-left">
      {/* Logo */}
      <img
        src="assets/logo.png"
        alt="Your Company Logo"
        className="h-20 md:h-28 lg:h-36 rounded-md mx-auto md:mx-0 mb-4"
        onError={(e) => {
          e.currentTarget.src = "https://placehold.co/150x50/FFFFFF/000000?text=Logo+Error";
        }}
      />
      <p className="text-gray-400 text-sm max-w-xs md:max-w-sm mx-auto md:mx-0">
        SEARCH AND RANK NOW!
      </p>
    </div>

    {/* Contact & Social Media Section */}
    <div className="col-span-1 text-center md:text-right">
      <h4 className="text-lg font-semibold mb-4 text-orange-400">Connect With Us</h4>
      <p className="text-gray-400 text-sm mb-2">
        Email:{" "}
        <a
          href="mailto:info@yourcompany.com"
          className="hover:text-orange-400 transition duration-300 ease-in-out"
        >
          info@movierank.com
        </a>
      </p>
      <p className="text-gray-400 text-sm mb-4">
        Phone:{" "}
        <a
          href="tel:+12345678900"
          className="hover:text-orange-400 transition duration-300 ease-in-out"
        >
          (+975) 7777777
        </a>
      </p>
      <div className="flex justify-center md:justify-end space-x-4">
        {/* Social icons here if needed */}
      </div>
    </div>
  </div>

  {/* Copyright Section */}
  <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-500 text-sm">
    &copy; {currentYear} MOVIERANK. All rights reserved.
  </div>
</footer>

  );
}
