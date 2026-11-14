"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, X, ArrowRight } from "lucide-react";
import { PRODUCTS, Product } from "@/lib/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#F7F7F5] border border-neutral-300 shadow-2xl z-10 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#EAEAEA] flex items-center space-x-3 bg-white">
          <Search strokeWidth={1.5} className="w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by object name, category, or spec..."
            className="w-full text-base sm:text-lg font-mono text-[#1A1A1A] placeholder-neutral-400 focus:outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <X strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#EAEAEA] p-4 sm:p-6">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-400 space-y-2">
              <p>POPULAR SEARCHES: GaN 65W · ZIGBEE 3.0 · LIGHT BAR · USB-C · DJI AUDIO</p>
              <p className="text-[10px]">ESC TO EXIT</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-neutral-500">
              No matching hardware found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="py-3 px-2 flex items-center justify-between hover:bg-neutral-100 cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 bg-[#F0F0F0] border border-neutral-200 p-1 flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="48px"
                      className="object-contain mix-blend-multiply"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#1A1A1A] group-hover:text-black">
                      {product.title}
                    </h4>
                    <p className="text-xs font-mono text-neutral-500">
                      {product.priceFormatted} · {product.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400 group-hover:text-black transition-colors">
                  <span>View</span>
                  <ArrowRight strokeWidth={1.5} className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
