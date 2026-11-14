export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  priceFormatted: string;
  category: "Mobile & Desk Tech" | "Smart Home Automation" | "Automotive Upgrades" | "Minimalist Lifestyle";
  categorySlug: "mobile-desk" | "smart-home" | "automotive" | "lifestyle";
  image: string;
  fallbackImage?: string;
  badge?: string;
  specs: { label: string; value: string }[];
  tag: string;
  inStock: boolean;
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "prod-baseus-65w-car",
    title: "Baseus 65W Triple Port Car Charger",
    description: "Fast-charge laptops and phones on the go.",
    price: 180.00,
    priceFormatted: "GH₵ 180.00",
    category: "Automotive Upgrades",
    categorySlug: "automotive",
    image: "https://baseus.com.au/cdn/shop/files/tzcckx-0g-3_1000x.jpg?v=1736398705",
    fallbackImage: "https://www.baseus.com/cdn/shop/products/Baseus_USB-A_USB-C_Car_Charger_65W_1_front.jpg?v=1667906382",
    badge: "GaN Fast Charge",
    specs: [
      { label: "Output", value: "65W Max (USB-C1 + C2 + USB-A)" },
      { label: "Display", value: "Real-time LED voltage meter" },
      { label: "Compatibility", value: "12V-24V car sockets, PD 3.0 & QC 4.0" },
      { label: "Finish", value: "Matte space aluminum" }
    ],
    tag: "AUTO // 01",
    inStock: true,
    featured: true,
  },
  {
    id: "prod-apple-35w-dual",
    title: "Apple 35W Dual Port Power Adapter",
    description: "Compact dual USB-C charging brick.",
    price: 180.00,
    priceFormatted: "GH₵ 180.00",
    category: "Mobile & Desk Tech",
    categorySlug: "mobile-desk",
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MNWP3?wid=1144&hei=1144&fmt=jpeg&qlt=90",
    badge: "Official Spec",
    specs: [
      { label: "Ports", value: "2x USB-C (Intelligent power sharing)" },
      { label: "Power", value: "35W dynamic distribution" },
      { label: "Prongs", value: "Folding compact architectural pins" },
      { label: "Safety", value: "Overcurrent & thermal protection" }
    ],
    tag: "DESK // 02",
    inStock: true,
    featured: true,
  },
  {
    id: "prod-anker-100w-cable",
    title: "Anker 100W Braided USB-C Cable",
    description: "Ultra-durable nylon fast-charging cable.",
    price: 150.00,
    priceFormatted: "GH₵ 150.00",
    category: "Mobile & Desk Tech",
    categorySlug: "mobile-desk",
    image: "https://cdn.shopify.com/s/files/1/0831/7042/7131/files/white-01_2d4272ab-2d5a-428d-8f79-c52ac1e98345_2878x_1.png?v=1790582640",
    badge: "100W PowerDelivery",
    specs: [
      { label: "Throughput", value: "100W (20V/5A E-Marker Chip)" },
      { label: "Build", value: "Double-braided ballistic nylon" },
      { label: "Bend Rating", value: "25,000+ lifecycle bends" },
      { label: "Length", value: "1.8m (6ft) with silicone strap" }
    ],
    tag: "DESK // 03",
    inStock: true,
    featured: false,
  },
  {
    id: "prod-tuya-zigbee-hub",
    title: "Tuya Smart Zigbee 3.0 Hub",
    description: "The brain for your smart home ecosystem.",
    price: 300.00,
    priceFormatted: "GH₵ 300.00",
    category: "Smart Home Automation",
    categorySlug: "smart-home",
    image: "http://zigbeesmart.com/cdn/shop/files/be4aeff2-3b23-464e-88a5-eefbe098d3b1.png?v=1790695067",
    fallbackImage: "https://smartxbd.com/wp-content/uploads/2025/10/Tuya-ZigBee-3.0-Wired-LAN-Port-Gateway-Hub-RJ45-Port-Bridge-Hub-for-Smart-Home-01.jpg.webp",
    badge: "Zigbee 3.0 Mesh",
    specs: [
      { label: "Protocol", value: "Zigbee 3.0 + 2.4GHz Wi-Fi" },
      { label: "Device Capacity", value: "Up to 128 connected sub-devices" },
      { label: "Latency", value: "Ultra-low local offline execution" },
      { label: "Platform", value: "Smart Life / Tuya / Home Assistant" }
    ],
    tag: "HOME // 04",
    inStock: true,
    featured: true,
  },
  {
    id: "prod-monitor-light-bar",
    title: "Minimalist Monitor Light Bar",
    description: "Mechanical switch, anti-glare screen lighting.",
    price: 550.00,
    priceFormatted: "GH₵ 550.00",
    category: "Mobile & Desk Tech",
    categorySlug: "mobile-desk",
    image: "https://image.benq.com/is/image/benqco/black-45-nocable?$ResponsivePreset$",
    badge: "Asymmetric Optic",
    specs: [
      { label: "Optics", value: "Asymmetric optical design (Zero screen glare)" },
      { label: "Control", value: "Wireless weighted rotary dial switch" },
      { label: "Color Temp", value: "2700K - 6500K stepless adjustment" },
      { label: "Chassis", value: "CNC machined aviation-grade alloy" }
    ],
    tag: "DESK // 05",
    inStock: true,
    featured: true,
  },
  {
    id: "prod-xxl-desk-mat",
    title: "XXL Solid Color Desk Mat",
    description: "Premium faux leather workspace protector.",
    price: 190.00,
    priceFormatted: "GH₵ 190.00",
    category: "Mobile & Desk Tech",
    categorySlug: "mobile-desk",
    image: "https://www.thetlwh.com/cdn/shop/files/IMG_1145.jpg?v=1769607274",
    badge: "900 x 400 mm",
    specs: [
      { label: "Dimensions", value: "900mm x 400mm x 2.2mm" },
      { label: "Surface", value: "Waterproof vegan micro-textured grain" },
      { label: "Base", value: "Anti-slip suede underside" },
      { label: "Maintenance", value: "Wipe-clean spill-proof barrier" }
    ],
    tag: "DESK // 06",
    inStock: true,
    featured: false,
  },
  {
    id: "prod-mag-phone-mount",
    title: "Magnetic Dashboard Phone Mount",
    description: "360° rotating sleek car mount.",
    price: 150.00,
    priceFormatted: "GH₵ 150.00",
    category: "Automotive Upgrades",
    categorySlug: "automotive",
    image: "https://www.hubcart.co/cdn/shop/files/magsafe-car-phone-holder-product.webp?v=1787150395&width=240",
    fallbackImage: "https://baseus.com.au/cdn/shop/files/tzcckx-0g-3_1000x.jpg?v=1736398705",
    badge: "MagSafe Array",
    specs: [
      { label: "Magnets", value: "16x N52 Neodymium rare-earth ring" },
      { label: "Mounting", value: "3M VHB automotive aerospace adhesive" },
      { label: "Articulation", value: "Damped 360-degree ball joint" },
      { label: "Profile", value: "Ultra-slim 8mm dashboard footprint" }
    ],
    tag: "AUTO // 07",
    inStock: true,
    featured: false,
  },
  {
    id: "prod-dji-mic-mini",
    title: "DJI Mic Mini",
    description: "Discreet, ultra-light wireless audio.",
    price: 700.00,
    priceFormatted: "GH₵ 700.00",
    category: "Minimalist Lifestyle",
    categorySlug: "lifestyle",
    image: "https://www-cdn.djiits.com/cms/uploads/ccc4ffb9056d4089b73613bb2a1ae6ba@374*374.png",
    fallbackImage: "https://www-cdn.djiits.com/cms/uploads/03258b0feafa252996da77a7a0aaa14d@374*374.png",
    badge: "10g Featherweight",
    specs: [
      { label: "Weight", value: "10 grams (Virtually invisible)" },
      { label: "Audio", value: "48kHz 24-bit studio omnidirectional" },
      { label: "Transmission", value: "400m stable interference-free range" },
      { label: "Battery", value: "48 hours with charging case" }
    ],
    tag: "AUDIO // 08",
    inStock: true,
    featured: true,
  },
];

export const CATEGORIES = [
  {
    id: "mobile-desk",
    number: "01",
    name: "Mobile & Desk Tech",
    description: "Architectural accessories, precision charging, and ergonomic clarity engineered for the high-focus workstation.",
    count: "03 Objects",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
    headline: "Form follow function.",
    details: "High-speed GaN adapters, double-braided cabling, and glare-free illumination.",
  },
  {
    id: "smart-home",
    number: "02",
    name: "Smart Home Automation",
    description: "Unobtrusive intelligence that anticipates your habits without drawing attention to itself.",
    count: "01 System",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=1000&q=80",
    headline: "Quiet infrastructure.",
    details: "Ultra-low latency Zigbee 3.0 mesh gateways and automated climate controls.",
  },
  {
    id: "automotive",
    number: "03",
    name: "Automotive Upgrades",
    description: "Transform your daily commute into an extension of your minimalist living environment.",
    count: "02 Tools",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
    headline: "Travel with purpose.",
    details: "Aerospace magnetic car docks and 65W rapid triple-port chargers.",
  },
  {
    id: "lifestyle",
    number: "04",
    name: "Minimalist Lifestyle",
    description: "Discreet tools that integrate with your personal rhythm, from studio-grade acoustic capture to everyday carry.",
    count: "02 Essentials",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=1000&q=80",
    headline: "Daily precision.",
    details: "Featherweight wireless capture systems and tactile desk protection.",
  },
];
