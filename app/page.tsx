"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { ProductGrid } from "@/components/ProductGrid";
import { BrandManifesto } from "@/components/BrandManifesto";
import { Footer } from "@/components/Footer";
import { ProductModal } from "@/components/ProductModal";
import { CartDrawer, CartItem } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { PRODUCTS, Product } from "@/lib/products";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Preload with Baseus 65W for immediate e-commerce realism
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.title} to bag`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    alert(
      "Shopify Sync Prototype // Order routing initialized for Greater Accra Region via Oura Logistics network."
    );
  };

  const handleShopClick = () => {
    const el = document.getElementById("bestsellers");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreProduct = (productId: string) => {
    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#F7F7F5]">
      {/* Navbar with Sticky States and Bag Drawer Link */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={(slug) => setActiveCategory(slug)}
        activeCategory={activeCategory}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          onShopClick={handleShopClick}
          onExploreProduct={handleExploreProduct}
        />

        {/* Featured Categories (Magazine Style Layout) */}
        <FeaturedCategories
          onSelectCategory={(slug) => setActiveCategory(slug)}
          activeCategory={activeCategory}
        />

        {/* Bestsellers Product Grid (The Core Experience) */}
        <ProductGrid
          onAddToCart={(prod) => handleAddToCart(prod, 1)}
          onQuickView={(prod) => setSelectedProduct(prod)}
          selectedCategorySlug={activeCategory}
          onSelectCategory={(slug) => setActiveCategory(slug)}
        />

        {/* Dieter Rams Manifesto & Editorial Photography */}
        <BrandManifesto />
      </main>

      {/* Severely Minimalist Footer */}
      <Footer />

      {/* Interactive Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer Slide-over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Minimalist Search Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* Tactile Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 shadow-xl font-mono text-xs uppercase tracking-wider flex items-center space-x-3 border border-neutral-700 animate-in slide-in-from-bottom-3 duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
