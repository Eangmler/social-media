"use client";

import React, { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onSelectCategory?: (categorySlug: string) => void;
  activeCategory?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onSelectCategory,
  activeCategory = "all",
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Mobile & Desk", slug: "mobile-desk" },
    { name: "Smart Home", slug: "smart-home" },
    { name: "Auto", slug: "automotive" },
    { name: "Lifestyle", slug: "lifestyle" },
  ];

  const handleNavClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
    setMobileMenuOpen(false);
    const gridEl = document.getElementById("bestsellers");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top Utility Announcement Bar */}
      <div className="w-full bg-[#1A1A1A] text-[#F7F7F5] py-2 px-4 text-[10px] uppercase font-mono tracking-[0.25em] flex justify-between items-center border-b border-neutral-800">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">OURA LOGISTICS ACCRA //</span>
            <span>NEXT-DAY DISPATCH TO ACCRA & TEMA</span>
          </div>
          <div className="flex items-center space-x-4 text-neutral-400">
            <span className="hidden md:inline">FREE DELIVERY ON ORDERS &gt; GH₵ 400</span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-300 font-medium">GHANA (GH₵)</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#F7F7F5]/95 backdrop-blur-md border-b border-[#EAEAEA] shadow-[0_1px_0_0_#EAEAEA]"
            : "bg-[#F7F7F5] border-b border-[#EAEAEA]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 md:h-20 flex items-center justify-between">
          {/* Left: Wordmark */}
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="group flex items-baseline space-x-1.5 text-xl md:text-2xl transition-opacity hover:opacity-85"
            >
              <span className="font-semibold text-[#1A1A1A] tracking-tight">useoura</span>
              <span className="font-light text-neutral-400">living</span>
            </a>
            <span className="hidden xl:inline-block text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase border border-neutral-300/80 px-1.5 py-0.5 rounded-none">
              CAT. 26
            </span>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navLinks.map((link) => {
              const isActive = activeCategory === link.slug;
              return (
                <button
                  key={link.slug}
                  onClick={() => handleNavClick(link.slug)}
                  className={`relative py-1 text-xs uppercase font-mono tracking-[0.2em] transition-colors duration-200 ${
                    isActive
                      ? "text-[#1A1A1A] font-semibold"
                      : "text-neutral-500 hover:text-[#1A1A1A]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1A1A1A]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={onOpenSearch}
              aria-label="Search catalog"
              className="p-2 text-[#1A1A1A] hover:bg-[#EAEAEA]/80 rounded-full transition-colors"
            >
              <Search strokeWidth={1.25} className="w-5 h-5" />
            </button>

            <button
              aria-label="Account sign in"
              onClick={() => alert("Account portal // Order tracking available for existing customers.")}
              className="p-2 text-[#1A1A1A] hover:bg-[#EAEAEA]/80 rounded-full transition-colors hidden sm:flex"
            >
              <User strokeWidth={1.25} className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenCart}
              aria-label="Shopping bag"
              className="relative flex items-center space-x-2 px-3 py-2 bg-[#1A1A1A] text-[#F7F7F5] hover:bg-neutral-800 transition-colors text-xs font-mono uppercase tracking-wider rounded-none"
            >
              <ShoppingBag strokeWidth={1.25} className="w-4 h-4" />
              <span className="font-medium text-[11px]">Bag</span>
              <span className="inline-flex items-center justify-center bg-white text-[#1A1A1A] w-4 h-4 text-[10px] font-bold rounded-full ml-1">
                {cartCount}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 text-[#1A1A1A] md:hidden hover:bg-[#EAEAEA] transition-colors"
            >
              {mobileMenuOpen ? (
                <X strokeWidth={1.25} className="w-6 h-6" />
              ) : (
                <Menu strokeWidth={1.25} className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAEAEA] bg-[#F7F7F5] px-6 py-8 space-y-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400">
                Collections
              </span>
              {navLinks.map((link) => (
                <button
                  key={link.slug}
                  onClick={() => handleNavClick(link.slug)}
                  className="flex items-center justify-between text-left py-2 text-base font-medium text-[#1A1A1A] border-b border-neutral-200"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight strokeWidth={1.25} className="w-4 h-4 text-neutral-400" />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-200 flex flex-col space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400">
                Logistics & Support
              </span>
              <div className="text-xs text-neutral-600 space-y-1 font-mono">
                <p>Oura Hub: Accra, Ghana</p>
                <p>Dispatch: Monday – Saturday (8:00 – 18:00)</p>
                <p>Support: +233 50 000 0000</p>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
