# 👑 Riwaayat Royale — Royal Indian Women's Occasion-Wear E-Commerce

> *"Where Every Celebration Becomes A Statement."*

![Riwaayat Royale Banner](assets/branding/logo-main.svg)

Riwaayat Royale is a luxury Indian women's occasion-wear couture and e-commerce platform combining traditional royal palace aesthetics with modern 3D fashion atelier technology and mobile ergonomics. Customers can explore handcrafted bridal couture, lehengas, evening gowns, shararas, Anarkalis, and Indo-Western outfits curated specifically for all major Indian wedding celebrations.

---

## ✨ Main Features

- **📱 Complete Mobile-First & Touch Experience**:
  - **Native-App-Style Bottom Navigation Bar**: Fixed bottom bar featuring 🏠 *Home*, 👑 *Occasions*, 🔍 *Search*, 🛒 *Cart* (with live count badge), and ⚙️ *Admin*.
  - **Mobile Occasions Drawer**: Bottom sheet drawer sliding up with one-tap access to all 7 celebrations and 4 couture silhouettes.
  - **Adaptive Amazon Header**: Seamless multi-row header on mobile devices with full-width search input and clean touch targets.
  - **Fluid 2-Column Mobile Product Grids**: High-density 2-card product display on smartphones with clear pricing, ratings, and instant "Add to Cart" buttons.
  - **Mobile Filter & Sort Modal**: Department filter sidebar automatically adapts into a slide-up modal with an "Apply Filters" bar.
  - **Sticky PDP Action Bar**: Pinned price, "Add to Cart", and "Buy Now" bottom bar on the product detail page for fast mobile purchasing.

- **🚀 1-Click Zero-Dependency Mobile Wi-Fi Server (`START_MOBILE_SERVER.bat`)**:
  - Built-in zero-dependency local web server powered by Windows PowerShell (`System.Net.Sockets.TcpListener`).
  - Automatically discovers local Wi-Fi IP address and displays a scannable **QR Code** on your computer screen.
  - Scan the QR code with any smartphone camera to open the store instantly over Wi-Fi without needing Node.js or Python.

- **🎬 Cinematic Slow-Motion Opening Video & 3D Curtain Intro**:
  - Full-screen slow-motion particle physics engine with floating marigold/rose petals, volumetric light beams, and dual parting Royal Silk Curtains.

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

- **📸 Multi-Photo Lookbook & 60fps Photo Hover Flip**:
  - Editorial gallery showing real bridal photographs.
  - Hovering or tapping over any product card smoothly crossfades to its secondary angle.

- **🔍 Smart Catalog Filtering & Search**:
  - Dynamic multi-criteria filtering by occasion, garment category, price range slider, color tone, and keyword search.

- **🛍️ Persistent Wishlist & Slide-Out Shopping Bag**:
  - Seamless shopping drawer, quantity manager, and wishlist powered by browser `localStorage`.

- **⚙️ Royal Admin Panel**:
  - Built-in outfit uploader for publishing new garments dynamically to the live catalog.

- **📱 Progressive Web App (PWA) Offline Readiness**:
  - Built-in `manifest.json` and service worker (`sw.js`) for offline asset caching and home screen installability.

---

## 🛠️ Technologies Used

- **Markup & Structure**: HTML5 (Semantic elements, accessibility landmarks, SEO meta tags)
- **Styling**: Vanilla CSS3 with CSS Custom Properties (Variables), Glassmorphism, Flexbox, CSS Grid, and hardware-accelerated transitions
- **Client Logic**: Vanilla JavaScript (ES6+ modular object-oriented architecture, zero external runtime framework overhead)
- **Graphics & Motion**: HTML5 2D Canvas API (Custom particle engines, petal physics, ray tracing, 360° drag canvas)
- **State & Storage**: Browser `localStorage` API for bag items and wishlist persistence
- **Local Mobile Server**: Windows PowerShell (`System.Net.Sockets.TcpListener`) with automatic local IP discovery and QR code generation
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
│   ├── components.css         # Mobile bottom nav, occasions drawer, sticky bars & modals
│   ├── amazon.css             # Amazon-inspired mobile header, 2-column cards & filters
│   └── atelier-pdp.css        # Interactive 3D Product Detail Page (PDP) styling
├── js/
│   ├── app.js                 # Main storefront engine, mobile bottom nav & filter drawer
│   ├── data.js                # Centralized product catalog dataset & occasion metadata
│   ├── amazon-home.js         # Amazon-style storefront interactions & dynamic feeds
│   ├── product-detail.js      # PDP interactivity (360° viewer, size selector, mobile bar)
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
├── mobile-connect.html        # QR Code connection screen for smartphone scanning
├── START_MOBILE_SERVER.bat    # 1-Click launcher for zero-dependency local mobile server
├── server.ps1                 # Zero-dependency PowerShell HTTP server for Wi-Fi access
├── manifest.json              # Progressive Web App (PWA) manifest configuration
├── sw.js                      # Service worker for offline asset caching
├── .gitignore                 # Git ignore rules for clean repository hygiene
└── README.md                  # Comprehensive project documentation
```

---

## 🚀 Installation & Setup Steps

### Prerequisites
- Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
- Git installed on your system.

### Steps to Run the Project

1. **Live Website (Mobile & Desktop)**:
   - **Live Store URL**: [https://hardikchaurasiya1972-blip.github.io/weddings-100/](https://hardikchaurasiya1972-blip.github.io/weddings-100/)
   - Works instantly on any mobile phone, tablet, or desktop browser with 0 setup needed!

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/hardikchaurasiya1972-blip/weddings-100.git
   cd weddings-100
   ```

2. **Run on Mobile Phone (1-Click Local Wi-Fi)**:
   - Double-click **`START_MOBILE_SERVER.bat`**.
   - A browser window will open on your PC showing a **scannable QR Code** and your local Wi-Fi IP address (`http://<YOUR_IP>:8080`).
   - Connect your phone to the same Wi-Fi, open your phone's **Camera**, and scan the QR code to open the site directly on your phone!

3. **Run on Desktop**:
   - **Option A**: Double-click `index.html` directly in any web browser.
   - **Option B (Recommended for full PWA & Service Worker features)**:
     Double-click `START_MOBILE_SERVER.bat` or run:
     ```bash
     # Using Python:
     python -m http.server 8080
     
     # Or using Node.js:
     npx serve .
     ```
   - Navigate to: `http://localhost:8080`

---

## ⚙️ Configuration Requirements & Notes

- **Zero External Dependencies**: The project requires zero npm packages, zero compilers, and zero runtime installations.
- **Service Worker & PWA**: Service Workers require an HTTP/HTTPS origin (`http://localhost` or `http://<IP>:8080`). Use `START_MOBILE_SERVER.bat` for offline caching features.
- **Persistent State**: The shopping cart and wishlist utilize browser `localStorage`. Storage must be enabled in your browser settings.
- **Sensitive Information**: The repository contains no API keys, credentials, or private authentication tokens. All client features run locally and securely.

---

## 📄 License & Credits

- Visual photography and garment assets are curated for high-fashion royal bridal presentation.
- © 2026 Riwaayat Royale Maison de Couture Inc. All rights reserved.
