"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="w-full bg-[#F7F7F5] border-t border-[#EAEAEA] text-[#1A1A1A]">
      {/* Main Grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-baseline space-x-1.5 text-2xl">
              <span className="font-semibold text-[#1A1A1A] tracking-tight">useoura</span>
              <span className="font-light text-neutral-400">living</span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm">
              Pure form, uncompromised utility. A curated catalog of modern tools engineered to elevate the daily workspace, commute, and home.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-4 space-y-3">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 block">
                Dispatch Gazette // Weekly Editions
              </span>
              <form onSubmit={handleSubscribe} className="flex max-w-md border border-neutral-300 bg-white">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 text-xs font-mono text-[#1A1A1A] placeholder-neutral-400 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to dispatch gazette"
                  className="px-5 bg-[#1A1A1A] text-white text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-1"
                >
                  {subscribed ? (
                    <>
                      <Check strokeWidth={1.5} className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <span>Join</span>
                      <ArrowRight strokeWidth={1.5} className="w-3 h-3" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Links Column 1: Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 block">
              CATALOGUE
            </span>
            <ul className="space-y-2.5 text-xs font-mono text-neutral-600">
              <li>
                <a href="#bestsellers" className="hover:text-black transition-colors">
                  Mobile & Desk
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-black transition-colors">
                  Smart Home
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-black transition-colors">
                  Automotive
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-black transition-colors">
                  Lifestyle
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-black transition-colors">
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Service & Support */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 block">
              SUPPORT & FLEET
            </span>
            <ul className="space-y-2.5 text-xs font-mono text-neutral-600">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  About useoura
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Accra Next-Day Fleet
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Track Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Warranty & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Shopify Guide Sync
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Logistics & Standards */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 block">
              OURA LOGISTICS ACCRA
            </span>
            <div className="text-xs font-mono text-neutral-600 space-y-2">
              <p>Airport City / Cantonments</p>
              <p>Greater Accra Region, Ghana</p>
              <p className="pt-2 text-neutral-400">
                Operating Hours: 08:00 – 18:00 GMT
              </p>
              <div className="pt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                <span className="text-[11px] text-neutral-700">All local dispatch routes active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Alignment Row */}
        <div className="mt-20 pt-8 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase gap-4">
          <div>
            © 2026 useoura living. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center space-x-6">
            <span>GHANA (GH₵ GHS)</span>
            <span>·</span>
            <span>DIETER RAMS MODEL</span>
            <span>·</span>
            <span>VERCEL PROTOTYPE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
