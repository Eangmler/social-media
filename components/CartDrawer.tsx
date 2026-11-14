"use client";

import React from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 400;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F7F5] border-l border-[#EAEAEA] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#EAEAEA] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag strokeWidth={1.5} className="w-4 h-4 text-[#1A1A1A]" />
              <span className="text-sm font-mono uppercase tracking-[0.2em] font-semibold text-[#1A1A1A]">
                Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close bag drawer"
              className="p-1.5 hover:bg-neutral-200 text-neutral-600 transition-colors"
            >
              <X strokeWidth={1.5} className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Threshold Indicator */}
          <div className="bg-[#EFEFEF] px-6 py-3 border-b border-neutral-200 text-xs font-mono">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-700 font-medium">
                ✓ COMPLIMENTARY OURA DISPATCH UNLOCKED
              </span>
            ) : (
              <span className="text-neutral-600">
                ADD <strong className="text-[#1A1A1A]">GH₵ {remainingForFreeShipping.toFixed(2)}</strong> FOR FREE NEXT-DAY DELIVERY
              </span>
            )}
            <div className="w-full bg-neutral-300 h-1 mt-2 overflow-hidden">
              <div
                className="bg-[#1A1A1A] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#EAEAEA]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-200/60 flex items-center justify-center">
                  <ShoppingBag strokeWidth={1.25} className="w-8 h-8 text-neutral-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-[#1A1A1A]">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-neutral-500 font-mono">
                    Explore curated tech essentials for your space.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-5 flex space-x-4 items-center">
                  {/* Floating thumbnail */}
                  <div className="relative w-20 h-20 bg-[#F0F0F0] border border-neutral-200 p-2 shrink-0 flex items-center justify-center">
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      sizes="80px"
                      className="object-contain mix-blend-multiply p-1"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs sm:text-sm font-medium text-[#1A1A1A] leading-snug">
                      {item.product.title}
                    </h4>
                    <p className="text-xs font-mono font-semibold text-neutral-800">
                      GH₵ {(item.product.price * item.quantity).toFixed(2)}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center border border-neutral-300 bg-white">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                        >
                          <Minus strokeWidth={1.5} className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                        >
                          <Plus strokeWidth={1.5} className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        aria-label="Remove item"
                        className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                      >
                        <Trash2 strokeWidth={1.5} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#EAEAEA] bg-white space-y-4">
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>SUBTOTAL</span>
                  <span className="text-[#1A1A1A] font-medium">
                    GH₵ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>OURA FLEET DISPATCH</span>
                  <span className="text-[#1A1A1A] font-medium">
                    {subtotal >= freeShippingThreshold ? "COMPLIMENTARY" : "GH₵ 25.00"}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-semibold text-[#1A1A1A]">
                  <span>ESTIMATED TOTAL</span>
                  <span>
                    GH₵{" "}
                    {(
                      subtotal + (subtotal >= freeShippingThreshold ? 0 : 25)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-4 bg-[#1A1A1A] text-white font-mono text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
              </button>

              <p className="text-[10px] font-mono text-neutral-400 text-center tracking-wider uppercase">
                Pay on Delivery / MoMo / Visa / Mastercard
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
