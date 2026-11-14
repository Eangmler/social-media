"use client";

import React, { useState, useMemo } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SlidersHorizontal, Check } from "lucide-react";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  selectedCategorySlug: string;
  onSelectCategory: (categorySlug: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onAddToCart,
  onQuickView,
  selectedCategorySlug,
  onSelectCategory,
}) => {
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const filterTabs = [
    { label: "All Objects", slug: "all", count: 8 },
    { label: "Mobile & Desk", slug: "mobile-desk", count: 4 },
    { label: "Smart Home", slug: "smart-home", count: 1 },
    { label: "Automotive", slug: "automotive", count: 2 },
    { label: "Lifestyle", slug: "lifestyle", count: 1 },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];
    if (selectedCategorySlug !== "all") {
      list = list.filter((p) => p.categorySlug === selectedCategorySlug);
    }
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedCategorySlug, sortBy]);

  return (
    <section id="bestsellers" className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#EAEAEA] gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">
              <span className="w-2 h-[1px] bg-neutral-900" />
              <span>SECTION 03 // BROWSE HARDWARE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A]">
              Bestsellers Archive
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono text-neutral-500">
            <span className="uppercase tracking-widest">
              [ {filteredProducts.length} OBJECTS IN CATALOGUE ]
            </span>
            <div className="flex items-center space-x-2 border border-neutral-300 px-3 py-1.5 bg-white">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">Sort:</span>
              <select
                aria-label="Sort products by price or default order"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#1A1A1A] text-xs font-mono focus:outline-none cursor-pointer"
              >
                <option value="default">Catalogue Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs (Dieter Rams Monospace Minimalist Ribbon) */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-6 mb-12 scrollbar-none border-b border-neutral-200">
          {filterTabs.map((tab) => {
            const isActive = selectedCategorySlug === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => onSelectCategory(tab.slug)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] transition-all duration-200 border ${
                  isActive
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-white/80 text-neutral-600 border-neutral-300 hover:border-neutral-900 hover:text-black"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-2 text-[10px] ${isActive ? "text-neutral-300" : "text-neutral-400"}`}>
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Asymmetrical Editorial Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                priority={index < 4}
              />
            );
          })}
        </div>

        {/* Technical Blueprint Footnote */}
        <div className="mt-16 pt-8 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 gap-4">
          <div>
            <span>SPECIFICATION STANDARDS: CE / FCC / ROHS / GHANA STANDARDS AUTHORITY</span>
          </div>
          <div>
            <span>NEXT-DAY DELIVERY HUB // GREATER ACCRA REGION</span>
          </div>
        </div>
      </div>
    </section>
  );
};
