"use client";

import React from "react";
import Image from "next/image";

export const BrandManifesto: React.FC = () => {
  return (
    <section className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-24 lg:py-36">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Dieter Rams Quote / Editorial Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400">
              <span className="w-2 h-[1px] bg-neutral-900" />
              <span>PHILOSOPHY // 04</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A] leading-tight">
              &ldquo;Weniger, aber besser.&rdquo;
              <span className="block text-neutral-400 font-light text-2xl sm:text-3xl mt-2">
                Less, but better.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
              At <strong className="text-[#1A1A1A]">useoura living</strong>, we reject planned obsolescence, garish branding, and disposable tech gimmicks. Our catalog is curated under the rigorous discipline of Dieter Rams and modern Ghanaian architectural minimalism.
            </p>

            <div className="pt-4 space-y-3 border-t border-[#EAEAEA]">
              <div className="flex items-start space-x-4">
                <span className="text-xs font-mono font-semibold text-[#1A1A1A]">01</span>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#1A1A1A]">
                    Uncompromising Utility
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Every watt, lumen, and millimeter is engineered to solve a daily friction point.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="text-xs font-mono font-semibold text-[#1A1A1A]">02</span>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#1A1A1A]">
                    Next-Day Oura Fleet
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Direct dispatch across Accra and Tema with verified authentic hardware.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Architectural & Demographic Photography */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden border border-neutral-300">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
                alt="African entrepreneur in architectural modern workspace"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#F7F7F5]/90 backdrop-blur-sm p-3 border border-neutral-300">
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-800">
                  WORKSPACE PROTOCOL // ACCRA
                </p>
              </div>
            </div>

            <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden border border-neutral-300 sm:translate-y-8">
              <Image
                src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=900&q=80"
                alt="Black creative with minimalist mobile audio setup"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#F7F7F5]/90 backdrop-blur-sm p-3 border border-neutral-300">
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-800">
                  MOBILE AUDIO // DISCREET CAPTURE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
