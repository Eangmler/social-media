"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Check, Eye } from "lucide-react";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  priority?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  priority = false,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className={`group cursor-pointer flex flex-col justify-between bg-[#F7F7F5] border border-[#EAEAEA] hover:border-neutral-900 transition-all duration-300 ${className}`}
    >
      {/* Top Header of Card: Technical Serial Tag & Category */}
      <div className="p-5 pb-3 flex items-center justify-between border-b border-[#EAEAEA]/80 text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400">
        <span>{product.tag}</span>
        {product.badge && (
          <span className="text-[#1A1A1A] font-medium bg-neutral-200/70 px-1.5 py-0.5">
            {product.badge}
          </span>
        )}
      </div>

      {/* Floating Image Container (Dieter Rams Museum Gallery Effect) */}
      <div className="relative w-full aspect-square bg-[#F0F0F0] flex items-center justify-center p-10 sm:p-12 overflow-hidden transition-colors group-hover:bg-[#EBEBEB]">
        {/* Subtle grid background inside image card */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#999_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Floating Gadget Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageError && product.fallbackImage ? product.fallbackImage : product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            onError={() => setImageError(true)}
            className="object-contain mix-blend-multiply p-4 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Hover Quick View pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-3.5 py-1.5 bg-[#1A1A1A] text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-full flex items-center space-x-1.5 shadow-md hover:bg-neutral-800"
        >
          <Eye strokeWidth={1.5} className="w-3 h-3" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Information Body */}
      <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-base sm:text-lg font-medium text-[#1A1A1A] tracking-tight group-hover:text-neutral-700 transition-colors">
              {product.title}
            </h3>
          </div>
          <p className="text-xs text-neutral-500 font-normal leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-widest">
              PRICE
            </span>
            <span className="text-sm sm:text-base font-semibold text-[#1A1A1A] font-mono">
              {product.priceFormatted}
            </span>
          </div>

          <button
            onClick={handleAdd}
            aria-label={`Add ${product.title} to bag`}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
              added
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
            }`}
          >
            {added ? (
              <>
                <Check strokeWidth={2} className="w-3.5 h-3.5" />
                <span className="text-[10px]">Added</span>
              </>
            ) : (
              <>
                <Plus strokeWidth={1.5} className="w-3.5 h-3.5" />
                <span className="text-[10px]">Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
