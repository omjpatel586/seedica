"use client";

import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiChevronDown, HiMenu, HiOutlineGlobeAlt, HiX } from "react-icons/hi";

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const languages = [
    { code: routing.locales[0], name: "English" },
    { code: routing.locales[1], name: "ગુજરાતી" },
    { code: routing.locales[2], name: "हिन्दी" },
  ];

  const getLocalizedPath = (path: string) => {
    return `/${locale}${path}`;
  };

  const getNewLocalizedPath = (langCode: string) => {
    return `/${langCode}${pathname.slice(3)}`;
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: getLocalizedPath("/about-us") },
    { name: "Products", href: getLocalizedPath("/products") },
    { name: "Dealers", href: getLocalizedPath("/dealers") },
    { name: "Get In Touch", href: getLocalizedPath("/get-in-touch") },
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Background Decorative Top Bar */}
      <div className="w-full h-2 bg-[#16a34a]"></div>

      <div className="lg:mx-14 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* LOGO SECTION */}
          <Link href={getLocalizedPath("/")} className="flex flex-col justify-center">
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

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center text-stone-700 hover:text-green-600 focus:outline-none p-2 cursor-pointer"
              >
                <HiOutlineGlobeAlt className="h-6 w-6" />
                <HiChevronDown className="h-4 w-4 ml-1" />
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <Link
                        key={lang.code}
                        href={getNewLocalizedPath(lang.code)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsLangMenuOpen(false)}
                      >
                        {lang.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
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
            <div className="pt-4 mt-4 border-t border-stone-100">
              <p className="px-3 py-2 text-xs font-semibold text-stone-500 uppercase">Languages</p>
              {languages.map((lang) => (
                <Link
                  key={lang.code}
                  href={getNewLocalizedPath(lang.code)}
                  className="block px-3 py-2 text-base font-medium text-stone-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {lang.name}
                </Link>
              ))}
            </div>
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
