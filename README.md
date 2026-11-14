# useoura living

> **"Weniger, aber besser." — Less, but better.**  
> A Dieter Rams / Braun-inspired minimalist e-commerce prototype engineered in Next.js (App Router), Tailwind CSS, and Lucide Icons. Designed as an editorial visual guide and interactive architectural prototype for deployment to Vercel and manual translation into a custom Shopify theme.

---

## 1. Brand Identity & Design System

* **Brand Wordmark:** `useoura living` (`useoura` in medium/bold sans-serif, `living` in a lighter/thinner font weight, all lowercase).
* **Aesthetic Philosophy:** Strict Dieter Rams ten principles of good design. Heavy asymmetrical negative space, architectural grid alignments (hairline borders `#EAEAEA`), and an uncompromising high-focus editorial aesthetic.
* **Palette:**
  * Background: Soft warm off-white (`#F7F7F5`)
  * Gallery Canvas: Muted architectural silver/gray (`#F0F0F0` / `#EFEFEF`)
  * Text & Accents: Deep slate/off-black (`#1A1A1A`), secondary muted gray (`#737373`)
  * Grid hairlines: `#EAEAEA` / `#E5E5E5`
* **Typography:** Clean sans-serif (Inter / system neo-grotesque) paired with crisp monospaced coordinates and specification tags (`JetBrains Mono`).

---

## 2. Demographic Representation & Floating Image System

* **Demographic Accuracy (Ghana / West Africa):** All lifestyle imagery featuring human interaction strictly features Black/African models and professionals in modern, minimal architectural workspaces and commute environments.
* **The "Floating" Museum Effect:**
  ```jsx
  <div className="relative w-full aspect-square bg-[#F0F0F0] flex items-center justify-center p-10 sm:p-12 overflow-hidden">
    <Image
      src={product.image}
      alt={product.title}
      fill
      className="object-contain mix-blend-multiply p-4"
    />
  </div>
  ```
  By enclosing the products inside `bg-[#F0F0F0]` cards and applying `mix-blend-multiply` with generous `p-10`/`p-12` padding, white product backdrops dissolve seamlessly into the card, rendering the gadgets like curated artifacts in an industrial design gallery.

---

## 3. Product Catalog

All 8 core hardware objects are priced in Ghanaian Cedis (`GH₵`) with next-day dispatch via Oura Fleet across Greater Accra:

| Ref | Product Title | Category | Price | Key Specs |
|---|---|---|---|---|
| AUTO // 01 | **Baseus 65W Triple Port Car Charger** | Automotive Upgrades | GH₵ 180.00 | 65W GaN, Real-time LED voltage, Dual USB-C + USB-A |
| DESK // 02 | **Apple 35W Dual Port Power Adapter** | Mobile & Desk Tech | GH₵ 180.00 | Dual USB-C dynamic power sharing, folding pins |
| DESK // 03 | **Anker 100W Braided USB-C Cable** | Mobile & Desk Tech | GH₵ 150.00 | 100W E-marker, double-braided nylon, 25k bends |
| HOME // 04 | **Tuya Smart Zigbee 3.0 Hub** | Smart Home Automation | GH₵ 300.00 | Zigbee 3.0 + Wi-Fi mesh, up to 128 local sub-devices |
| DESK // 05 | **Minimalist Monitor Light Bar** | Mobile & Desk Tech | GH₵ 550.00 | Asymmetric optics (zero glare), 2.4G wireless dial |
| DESK // 06 | **XXL Solid Color Desk Mat** | Mobile & Desk Tech | GH₵ 190.00 | 900x400mm waterproof textured vegan leather |
| AUTO // 07 | **Magnetic Dashboard Phone Mount** | Automotive Upgrades | GH₵ 150.00 | 16x N52 Neodymium MagSafe array, 360° ball joint |
| AUDIO // 08 | **DJI Mic Mini** | Minimalist Lifestyle | GH₵ 700.00 | 10g featherweight, 48kHz studio audio, 400m range |

---

## 4. Page Architecture & Components

* **`components/Navbar.tsx`:** Sticky minimal bar with live logistics status (`NEXT-DAY DISPATCH ACCRA`), wordmark, uppercase tracked collection links, quick search, and interactive shopping bag drawer counter.
* **`components/Hero.tsx`:** Editorial asymmetrical split hero with bold typography, pill CTA button ("Shop the Essentials"), Rams design index, and museum-grade product + lifestyle showcase.
* **`components/FeaturedCategories.tsx`:** 4 magazine-style blocks with off-center breathing room, category numbering (`01`, `02`, `03`, `04`), and architectural photography.
* **`components/ProductGrid.tsx`:** Asymmetrical grid with live category filters, price sorting, and quick inspection triggers.
* **`components/ProductCard.tsx`:** Gallery card utilizing `mix-blend-multiply` floating effect, technical tags, and instant "Add to Bag" button.
* **`components/ProductModal.tsx`:** Technical blueprint detail sheet with hardware specification tables and quantity selector.
* **`components/CartDrawer.tsx`:** Slide-over bag drawer with real-time GH₵ subtotal, complimentary shipping progress threshold (GH₵ 400), and checkout trigger.
* **`components/SearchModal.tsx`:** Fast real-time catalog search overlay with keyboard shortcuts (`Esc`).
* **`components/BrandManifesto.tsx`:** Tribute to Dieter Rams' "Weniger, aber besser" philosophy and Accra workspace protocols.
* **`components/Footer.tsx`:** Severely minimalist footer with newsletter dispatch, strict grid utility links, and GMT timezone coordinates.

---

## 5. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser
http://localhost:3000
```

---

## 6. Vercel Deployment

Connect this repository to Vercel for zero-config automatic deployment:
1. Push to GitHub (`git push origin main` or your new repo).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Click **Deploy**. Next.js App Router and Tailwind CSS will automatically build and publish to a fast edge CDN.

---

## 7. Shopify Theme Mapping Guide

When translating this prototype into Liquid/Shopify OS 2.0 sections:
* `Hero.tsx` ➔ `sections/hero-editorial.liquid`
* `FeaturedCategories.tsx` ➔ `sections/featured-collections-magazine.liquid`
* `ProductGrid.tsx` + `ProductCard.tsx` ➔ `sections/main-collection-asymmetric.liquid` + `snippets/card-product-floating.liquid`
* `CartDrawer.tsx` ➔ `snippets/cart-drawer.liquid`
* `BrandManifesto.tsx` ➔ `sections/brand-manifesto.liquid`
* `Footer.tsx` ➔ `sections/footer-minimalist.liquid`
