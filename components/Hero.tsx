"use client";

import React from "react";
import Image from "next/image";
import { ArrowDown, Sparkles, ShieldCheck, Zap } from "lucide-react";

interface HeroProps {
  onShopClick: () => void;
  onExploreProduct: (productId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onExploreProduct }) => {
  return (
    <section className="relative w-full border-b border-[#EAEAEA] bg-[#F7F7F5] overflow-hidden">
      {/* Editorial Grid Lines overlay (very subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="max-w-[1440px] h-full mx-auto grid grid-cols-1 md:grid-cols-12 divide-x divide-[#EAEAEA]">
          <div className="md:col-span-6 h-full" />
          <div className="md:col-span-6 h-full" />
        </div>
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Bold Editorial Typography & Asymmetrical Negative Space */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8 md:space-y-12">
            {/* Meta indicator */}
            <div className="flex items-center space-x-3">
              <span className="h-[1px] w-8 bg-[#1A1A1A]" />
              <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-600">
                01 // CATALOGUE ESSENTIALS
              </span>
              <span className="text-neutral-300">/</span>
              <span className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400">
                ACCRA, GH
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-medium leading-[1.05] tracking-tight text-[#1A1A1A]">
                Curated technology and daily essentials, delivered seamlessly.
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 font-normal leading-relaxed max-w-xl">
                Upgrade your space and your commute with premium tech, delivered next-day via the Oura network.
              </p>
            </div>

            {/* CTA & Editorial Principles */}
            <div className="space-y-8 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                {/* Pill-shaped dark CTA */}
                <button
                  onClick={onShopClick}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#1A1A1A] text-[#F7F7F5] rounded-full text-xs font-mono uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.02] shadow-[0_4px_14px_0_rgba(0,0,0,0.12)] cursor-pointer"
                >
                  <span>Shop the Essentials</span>
                  <ArrowDown
                    strokeWidth={1.5}
                    className="w-3.5 h-3.5 ml-3 transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                </button>

                <button
                  onClick={() => onExploreProduct("prod-baseus-65w-car")}
                  className="inline-flex items-center justify-center px-6 py-4 rounded-full border border-neutral-300 text-xs font-mono uppercase tracking-[0.2em] text-[#1A1A1A] hover:bg-[#EAEAEA] transition-colors"
                >
                  <span>Featured: GaN 65W</span>
                </button>
              </div>

              {/* Rams Editorial Note & Service Specs */}
              <div className="pt-6 border-t border-[#EAEAEA] grid grid-cols-2 sm:grid-cols-3 gap-6 text-[11px] font-mono text-neutral-500">
                <div>
                  <span className="block text-[#1A1A1A] font-semibold tracking-wider uppercase mb-1">
                    01. DISPATCH
                  </span>
                  <span>Next-day across Greater Accra</span>
                </div>
                <div>
                  <span className="block text-[#1A1A1A] font-semibold tracking-wider uppercase mb-1">
                    02. AUTHENTIC
                  </span>
                  <span>Strictly verified OEM hardware</span>
                </div>
                <div className="hidden sm:block">
                  <span className="block text-[#1A1A1A] font-semibold tracking-wider uppercase mb-1">
                    03. ETHOS
                  </span>
                  <span>Weniger, aber besser</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Massive Floating Tech Product Showcase & High-End Lifestyle Shot */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto w-full max-w-[580px] lg:max-w-none">
              {/* Asymmetrical Gallery Container */}
              <div className="relative bg-[#EFEFEF] border border-[#E5E5E5] overflow-hidden p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                {/* Architectural Frame Markers */}
                <div className="absolute top-4 left-4 text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                  FIG. 01 / WORKSPACE INTEGRATION
                </div>
                <div className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                  GH // 2026
                </div>

                {/* Editorial Lifestyle Image strictly featuring Black/African professional */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200 mt-4 mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85"
                    alt="African professional at minimalist modern workspace curated by useoura living"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white text-[10px] font-mono tracking-widest uppercase">
                    <span>ACCRA RESIDENCE // TECH CURATION</span>
                    <span className="bg-black/60 px-2 py-0.5 backdrop-blur-sm">Oura Fleet</span>
                  </div>
                </div>

                {/* Floating Tech Product Overlay Card (Dieter Rams gallery floating effect) */}
                <div className="relative bg-[#F7F7F5] border border-[#EAEAEA] p-5 sm:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-5">
                    {/* Floating Product Image with mix-blend-multiply */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#F0F0F0] flex items-center justify-center p-3 border border-neutral-200/80">
                      <Image
                        src="https://www-cdn.djiits.com/cms/uploads/ccc4ffb9056d4089b73613bb2a1ae6ba@374*374.png"
                        alt="DJI Mic Mini Wireless Audio"
                        width={90}
                        height={90}
                        className="object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-neutral-400 block mb-1">
                        NOW IN ACCRA STOCK
                      </span>
                      <h4 className="text-sm sm:text-base font-medium text-[#1A1A1A]">
                        DJI Mic Mini Wireless
                      </h4>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">
                        GH₵ 700.00 <span className="text-neutral-400 font-normal">/ 10g Audio</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onExploreProduct("prod-dji-mic-mini")}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#1A1A1A] text-white hover:bg-neutral-800 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors"
                  >
                    Inspect
                  </button>
                </div>

                {/* Technical Blueprint Footnote */}
                <div className="mt-6 flex justify-between items-center text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase pt-4 border-t border-neutral-300">
                  <span>SCALE: 1:1 REVISED</span>
                  <span>BRAUN / RAMS AESTHETIC MODEL</span>
                  <span>SPEC: GH-2026</span>
                </div>
              </div>

              {/* Decorative Geometric Corner Accent */}
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#1A1A1A] pointer-events-none hidden sm:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
