"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define links in an array for cleaner code and easy updates
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Products", href: "/products" },
    { name: "Dealers", href: "/dealers" },
    { name: "Get In Touch", href: "/get-in-touch" },
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Background Decorative Top Bar */}
      <div className="w-full h-2 bg-[#16a34a]"></div>

      <div className="lg:mx-14 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* LOGO SECTION */}
          <Link href="/" className="flex flex-col justify-center">
            <div className="relative w-40 h-12 md:w-48 md:h-14">
              <Image
                src="/assets/logo.webp"
                alt="Seedica Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            {/* Tagline - Adjusted to sit nicely below/near logo */}
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold mt-1">
              Agricultural Solutions
            </p>
          </Link>

          {/* DESKTOP NAVIGATION (Hidden on mobile) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-thin text-stone-700 hover:text-green-600 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* DESKTOP CTA BUTTON (Hidden on mobile) */}
          <div className="hidden md:block">
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
              Download Brochure
            </button>
          </div>

          {/* MOBILE MENU BUTTON (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-700 hover:text-green-600 focus:outline-none p-2"
            >
              {isMenuOpen ? (
                // Close Icon (X)
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {/* This renders only when isMenuOpen is true */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)} // Close menu on click
                className="block px-3 py-3 text-base font-medium text-stone-700 hover:text-green-600 hover:bg-green-50 rounded-md"
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile CTA Button */}
            <div className="pt-4 mt-4 border-t border-stone-100">
              <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
