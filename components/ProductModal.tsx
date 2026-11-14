"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check, Shield, Truck, RotateCcw } from "lucide-react";
import { Product } from "@/lib/products";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F7F7F5] border border-neutral-300 shadow-2xl z-10 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close detail modal"
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-neutral-900 hover:text-white transition-colors border border-neutral-300"
        >
          <X strokeWidth={1.5} className="w-5 h-5" />
        </button>

        {/* Left Side: Floating Gallery Presentation */}
        <div className="md:w-1/2 bg-[#F0F0F0] border-b md:border-b-0 md:border-r border-[#EAEAEA] p-8 sm:p-12 flex flex-col justify-between relative">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
            <span>SCHEMATIC // {product.tag}</span>
            <span>MUSEUM SPEC</span>
          </div>

          <div className="relative w-full aspect-square my-8 flex items-center justify-center">
            <Image
              src={imageError && product.fallbackImage ? product.fallbackImage : product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => setImageError(true)}
              className="object-contain mix-blend-multiply p-6"
            />
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-neutral-400 uppercase pt-4 border-t border-neutral-300/60">
            <span>DIETER RAMS AESTHETIC</span>
            <span>ACCRA STOCK READY</span>
          </div>
        </div>

        {/* Right Side: Editorial Specifications & Action */}
        <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase block">
                {product.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1A1A]">
                {product.title}
              </h2>
              <div className="pt-2 text-xl font-mono font-semibold text-[#1A1A1A]">
                {product.priceFormatted}
              </div>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Technical Specifications Table */}
            <div className="pt-4 border-t border-[#EAEAEA] space-y-2">
              <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block mb-3">
                Hardware Specifications
              </span>
              <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white/60">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between py-2 px-3 text-xs font-mono">
                    <span className="text-neutral-500 uppercase">{spec.label}</span>
                    <span className="text-[#1A1A1A] font-medium text-right max-w-[60%]">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics Guarantees */}
            <div className="space-y-2 pt-2 text-[11px] font-mono text-neutral-600">
              <div className="flex items-center space-x-2">
                <Truck strokeWidth={1.5} className="w-3.5 h-3.5 text-neutral-700" />
                <span>Next-day dispatch via Oura Fleet across Greater Accra</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield strokeWidth={1.5} className="w-3.5 h-3.5 text-neutral-700" />
                <span>6-Month Official Replacement Guarantee</span>
              </div>
            </div>
          </div>

          {/* Add to Bag Controls */}
          <div className="pt-6 border-t border-[#EAEAEA] space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-neutral-300 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="p-2 hover:bg-neutral-100 text-[#1A1A1A]"
                >
                  <Minus strokeWidth={1.5} className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-mono font-medium text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="p-2 hover:bg-neutral-100 text-[#1A1A1A]"
                >
                  <Plus strokeWidth={1.5} className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-grow py-3.5 px-6 font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  added
                    ? "bg-emerald-700 text-white"
                    : "bg-[#1A1A1A] text-white hover:bg-neutral-800"
                }`}
              >
                {added ? (
                  <>
                    <Check strokeWidth={1.5} className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>Add to Bag — GH₵ {(product.price * quantity).toFixed(2)}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
