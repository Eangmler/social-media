"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/products";

interface FeaturedCategoriesProps {
  onSelectCategory: (categorySlug: string) => void;
  activeCategory: string;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <section className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header with Dieter Rams Editorial Monospace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#EAEAEA] gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">
              <span className="w-2 h-[1px] bg-neutral-900" />
              <span>SECTION 02 // CURATION ARCHIVES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A]">
              Featured Categories
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
            Organized across four functional domains. Minimalist hardware deliberately chosen to reduce cognitive load in your home, vehicle, and workspace.
          </div>
        </div>

        {/* Magazine Style Editorial Grid: Asymmetrical Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {CATEGORIES.map((category, index) => {
            const isSelected = activeCategory === category.id;
            // Provide asymmetrical spans to give true editorial magazine rhythm:
            // Item 1: lg:col-span-7, Item 2: lg:col-span-5
            // Item 3: lg:col-span-5, Item 4: lg:col-span-7
            const colSpanClass =
              index === 0
                ? "lg:col-span-7"
                : index === 1
                ? "lg:col-span-5"
                : index === 2
                ? "lg:col-span-5"
                : "lg:col-span-7";

            return (
              <div
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.id);
                  const el = document.getElementById("bestsellers");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group cursor-pointer relative bg-[#F0F0F0] border transition-all duration-500 flex flex-col justify-between overflow-hidden p-8 sm:p-10 lg:p-12 ${colSpanClass} ${
                  isSelected
                    ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A] shadow-md"
                    : "border-[#E5E5E5] hover:border-neutral-400"
                }`}
              >
                {/* Top Metas */}
                <div className="flex justify-between items-start mb-10 z-10">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-semibold tracking-[0.2em] text-[#1A1A1A] block">
                      ARCHIVE // {category.number}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                      {category.count}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center bg-white/70 backdrop-blur-sm group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-300">
                    <ArrowUpRight
                      strokeWidth={1.25}
                      className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>

                {/* Editorial Lifestyle Image strictly featuring Black individuals or clean architectural space */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-neutral-200 mb-8 z-10 border border-neutral-300/40">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale contrast-105 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Floating Tag */}
                  <div className="absolute bottom-3 left-3 bg-[#F7F7F5]/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-mono tracking-[0.2em] uppercase text-neutral-800">
                    {category.headline}
                  </div>
                </div>

                {/* Bottom Editorial Content with Off-Center Breathing Room */}
                <div className="space-y-3 z-10">
                  <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1A1A] group-hover:text-neutral-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed max-w-lg">
                    {category.description}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-300/60 uppercase tracking-wider">
                    {category.details}
                  </p>
                </div>

                {/* Subtle Dieter Rams background watermark number */}
                <div className="absolute -bottom-10 -right-6 text-[140px] font-light font-mono text-neutral-300/20 select-none pointer-events-none group-hover:text-neutral-400/25 transition-colors">
                  {category.number}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
