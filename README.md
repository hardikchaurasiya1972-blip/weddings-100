# 👑 Riwaayat Royale — Royal Indian Women's Occasion-Wear E-Commerce

> *"Where Every Celebration Becomes A Statement."*

![Riwaayat Royale Banner](assets/branding/logo-main.svg)

Riwaayat Royale is a luxury Indian women's occasion-wear fashion and e-commerce platform designed to deliver an opulent shopping experience combining traditional royal aesthetics with 3D fashion atelier technology. Customers can explore high-end bridal couture, lehengas, Anarkalis, shararas, and Indo-Western outfits curated specifically for wedding functions and special Indian celebrations.

---

## ✨ Main Features

- **🎬 Cinematic Slow-Motion Opening Video & 3D Curtain Intro**:
  - Full-screen slow-motion particle physics engine with floating marigold/rose flower petals, volumetric light beams, and dual parting Royal Silk Curtains.

- **🌸 Dedicated Multi-Page Occasion & Garment Route Architecture**:
  - Direct individual storefronts for all key wedding functions and couture categories:
    - 🌸 **[Haldi Collection](haldi.html)**: Sunshine yellow organza sets & bright yellow shararas
    - 🌿 **[Mehendi Collection](mehendi.html)**: Teal green chiffon suits & lime silk ensembles
    - 🎶 **[Sangeet Collection](sangeet.html)**: Deep purple sequin lehengas & flared gowns
    - 👰 **[Wedding Collection](wedding.html)**: Crimson raw silk bridal lehengas with gold zardozi
    - 💍 **[Reception Collection](reception.html)**: Rose gold tissue lehengas & floral bridal gowns
    - ❤️ **[Anniversary Collection](anniversary.html)**: Regal wine front-slit velvet palazzo tunics
    - ✨ **[Festive & Party](festive.html)**: Mint blue printed lehengas & pure white Chikankari shararas
    - 👗 **[Bridal Lehengas](lehengas.html)**: Heavily embroidered royal lehenga sets
    - 💫 **[Designer Gowns](gowns.html)**: Pleated flared floor-length evening gowns
    - 🪡 **[Royal Shararas](shararas.html)**: Traditional and contemporary sharara silhouettes
    - 🌟 **[Indo-Western](indowestern.html)**: Contemporary fusion cape sets, drapes, and crop-top ensembles

- **🏛️ The Royal 3D Atelier & Interactive PDP (`product.html`)**:
  - Interactive 360° product rotation showcase with drag controls, Kundan lighting nodes, and high-tech presentation modes.
  - Multi-angle image switcher, high-resolution zoom viewer, and occasion-specific styling notes.
  - Real-time size recommendation engine, luxury fabric detail breakdown, and express bridal delivery estimator.

- **📽️ "A Celebration in Motion" Campaign Runway**:
  - 3D palace corridor canvas runway animation with atmospheric light shafts.

- **📸 Multi-Photo Lookbook & 60fps Photo Hover Flip**:
  - Editorial gallery showing real bridal photographs.
  - Hovering over any product card smoothly crossfades to its secondary uploaded photo angle.

- **🔍 Smart Catalog Filtering & Search**:
  - Dynamic multi-criteria filtering by occasion, garment category, price range slider, color tone, and keyword search.

- **🛍️ Persistent Wishlist & Slide-Out Shopping Bag**:
  - Seamless shopping drawer, quantity manager, and wishlist powered by browser `localStorage`.

- **💬 Floating Royal Bridal Stylist Concierge**:
  - Instant one-click consultation modal for custom tailoring, color matching, and express concierge requests.

- **⚙️ Royal Admin Panel**:
  - Built-in outfit uploader for publishing new garments dynamically to the live catalog.

- **📱 Progressive Web App (PWA) Offline Readiness**:
  - Built-in `manifest.json` and service worker (`sw.js`) for fast offline asset caching and home screen installability.

---

## 🛠️ Technologies Used

- **Markup & Structure**: HTML5 (Semantic elements, accessibility landmarks, SEO meta tags)
- **Styling**: Vanilla CSS3 with CSS Custom Properties (Variables), Glassmorphic effects, Flexbox, Grid, and hardware-accelerated transitions
- **Client Logic**: Vanilla JavaScript (ES6+ modular object-oriented architecture, zero heavy external framework overhead)
- **Graphics & Motion**: HTML5 2D Canvas API (Custom particle engines, petal physics, ray tracing, 360° drag canvas)
- **State & Storage**: Browser `localStorage` API for bag items and wishlist persistence
- **Offline & PWA**: Service Worker API (`sw.js`) and Web App Manifest (`manifest.json`)
- **Assets**: Scalable Vector Graphics (SVG) branding and curated high-resolution photography

---

## 📁 Project Structure

```
weddings/
├── assets/
│   ├── branding/              # SVG logos, monograms & favicon icons
│   └── images/                # Curated occasion photo collections
│       ├── festive/           # Festive wear & Indo-Western photographs
│       ├── haldi/             # Haldi ceremony outfits
│       ├── reception/         # Reception & Anniversary couture
│       ├── sangeet/           # Sangeet & Mehendi outfits
│       └── wedding/           # Bridal couture outfits
├── css/
│   ├── main.css               # Design system tokens, root color variables & typography
│   ├── components.css         # Responsive cards, modals, hero & lookbook styles
│   ├── amazon.css             # Amazon-inspired responsive product components & banners
│   └── atelier-pdp.css        # Interactive 3D Product Detail Page (PDP) styling
├── js/
│   ├── app.js                 # Main storefront e-commerce application engine
│   ├── data.js                # Centralized product catalog dataset & occasion metadata
│   ├── amazon-home.js         # Amazon-style storefront interactions & dynamic feeds
│   ├── product-detail.js      # PDP interactivity (360° viewer, size selector, cart sync)
│   ├── three-slowmo.js        # Slow-motion opening video & silk curtain splash engine
│   ├── three-hero.js          # Hero section 3D particle canvas
│   ├── three-atelier.js       # 360° interactive Atelier canvas engine
│   └── three-motion.js        # Campaign runway 3D corridor canvas
├── anniversary.html           # Dedicated Anniversary collection page
├── festive.html               # Dedicated Festive & Party collection page
├── gowns.html                 # Dedicated Designer Gowns collection page
├── haldi.html                 # Dedicated Haldi collection page
├── index.html                 # Main flagship storefront and hero portal
├── indowestern.html           # Dedicated Indo-Western collection page
├── lehengas.html              # Dedicated Bridal Lehengas collection page
├── mehendi.html               # Dedicated Mehendi collection page
├── product.html               # Luxury 3D Atelier Product Detail Page (PDP)
├── reception.html             # Dedicated Reception collection page
├── sangeet.html               # Dedicated Sangeet collection page
├── shararas.html              # Dedicated Royal Shararas collection page
├── wedding.html               # Dedicated Wedding bridal couture collection page
├── manifest.json              # Progressive Web App (PWA) manifest configuration
├── sw.js                      # Service worker for offline asset caching
├── .gitignore                 # Git ignore rules for clean repository hygiene
└── README.md                  # Comprehensive project documentation
```

---

## 🚀 Installation & Setup Steps

### Prerequisites
- Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari) with Canvas and WebGL support enabled.
- Git installed on your system.

### Steps to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/hardikchaurasiya1972-blip/wedding.git
   cd wedding
   ```

2. **Run Locally**:
   - **Option A (Direct in Browser)**: Double-click or open `index.html` directly in any web browser.
   - **Option B (Local Web Server - Recommended for full PWA Service Worker support)**:
     ```bash
     # Using Python:
     python -m http.server 8085
     
     # Or using Node.js / npx:
     npx serve .
     
     # Or using PHP:
     php -S localhost:8085
     ```
   - Open your browser and navigate to: `http://localhost:8085`

---

## ⚙️ Configuration Requirements & Notes

- **Service Worker & PWA**: Service Workers require a secure origin (`https://` or `http://localhost`). For full offline caching features, serve via a local web server rather than the `file://` protocol.
- **Persistent State**: The shopping cart and wishlist utilize browser `localStorage`. Cookies/storage must be enabled in your browser settings.
- **Canvas Hardware Acceleration**: Ensure hardware acceleration is enabled in your browser settings for optimal 60fps performance of the 3D particle curtain and 360° canvas atelier.
- **Sensitive Information**: The repository contains no API keys, credentials, or private authentication tokens. All client features run locally and securely.

---

## 📄 License & Credits

- Visual photography and garment assets are curated for high-fashion royal bridal presentation.
- © 2026 **Riwaayat Royale Maison de Couture**. All rights reserved.
