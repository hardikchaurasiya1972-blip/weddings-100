# 👑 Riwaayat Royale — Royal Indian Women's Occasion-Wear E-Commerce

> *"Where Every Celebration Becomes A Statement."*

![Riwaayat Royale Banner](assets/branding/logo-main.svg)

Riwaayat Royale is a luxury Indian women's occasion-wear fashion platform designed to deliver an opulent shopping experience combining traditional royal aesthetics with 3D fashion atelier technology. Customers can explore high-end bridal couture, lehengas, Anarkalis, shararas, and Indo-Western outfits curated specifically for wedding functions and special Indian celebrations.

---

## ✨ Key Features

- **🎬 Slow-Motion Opening Video & 3D Curtain Intro**:
  - Full-screen slow-motion particle physics engine with floating marigold/rose flower petals, volumetric light beams, and dual parting Royal Silk Curtains.

- **🌸 Occasion & Function Discovery**:
  - Dedicated collection views for all key Indian wedding functions:
    - 🌸 **Haldi**: Sunshine yellow organza sets & bright yellow shararas
    - 🌿 **Mehendi**: Teal green chiffon suits & lime silk ensembles
    - 🎶 **Sangeet**: Deep purple sequin lehengas & flared gowns
    - 👰 **Wedding**: Crimson raw silk bridal lehengas with gold zardozi
    - 💍 **Reception**: Rose gold tissue lehengas & floral bridal gowns
    - ❤️ **Anniversary**: Regal wine front-slit velvet palazzo tunics
    - ✨ **Party & Festive**: Mint blue printed lehengas & pure white Chikankari shararas

- **🏛️ The Royal 3D Atelier**:
  - Interactive 360° product rotation showcase with drag controls, Kundan lighting nodes, and high-tech presentation modes.

- **📽️ "A Celebration in Motion" Campaign**:
  - 3D palace corridor canvas runway animation with atmospheric light shafts.

- **📸 Multi-Photo Lookbook & 60fps Photo Hover Flip**:
  - Editorial gallery showing real wedding photographs.
  - Hovering over any product card smoothly crossfades to its 2nd uploaded photo angle.

- **🔍 Smart Catalog Filtering & Search**:
  - Filter by function occasion, garment category (Lehenga, Anarkali, Sharara, Suit, Gown, Indo-Western), price range slider, and search query.

- **🛍️ Wishlist & Slide-out Shopping Bag**:
  - Persistent shopping bag drawer and wishlist powered by `localStorage`.

- **💬 Floating Royal Bridal Stylist Concierge**:
  - One-click instant consultation button for custom sizes, color matching, and express bridal delivery.

- **⚙️ Royal Admin Panel**:
  - Built-in outfit uploader for publishing new garments directly to the live catalog.

---

## 🛠️ Technology Stack

- **Frontend Core**: HTML5 & JavaScript (ES6+ Object-Oriented Architecture)
- **Styling**: Vanilla CSS3 with CSS Custom Properties (Variables), Glassmorphic Cards, and Hardware-Accelerated Animations
- **Graphics & Motion**: HTML5 2D Canvas API (Custom Particle Engines, Petal Physics, Ray Tracing, 360° Drag Canvas)
- **Assets**: Custom SVG Monograms & High-Resolution Garment Photography

---

## 📁 Project Structure

```
weddings/
├── assets/
│   ├── branding/         # SVG logos, monograms & favicon
│   └── images/           # Centralized occasion photo collections
│       ├── haldi/        # Haldi ceremony outfits (112 photos)
│       ├── sangeet/      # Sangeet & Mehendi outfits (98 photos)
│       ├── wedding/      # Bridal couture outfits (133 photos)
│       ├── reception/    # Reception & Anniversary couture (113 photos)
│       └── festive/      # Festive wear & Indo-Western (121 photos)
├── css/
│   ├── main.css          # Design system tokens, root color variables & themes
│   └── components.css    # Responsive cards, modals, hero & lookbook styles
├── js/
│   ├── data.js           # Divided 100+ product dataset & occasion metadata
│   ├── three-slowmo.js   # Slow-motion opening video & silk curtain splash engine
│   ├── three-hero.js     # Hero section 3D particle canvas
│   ├── three-atelier.js  # 360° interactive Atelier canvas engine
│   ├── three-motion.js   # Campaign runway 3D corridor canvas
│   └── app.js            # Main e-commerce application engine
├── index.html            # Main single-page web application
├── manifest.json         # Progressive Web App (PWA) manifest
├── sw.js                 # PWA service worker & offline asset caching
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

---

## 🚀 How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/hardikchaurasiya1972-blip/wedding.git
   cd wedding
   ```

2. **Launch the Application**:
   - Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).
   - Alternatively, serve using a static web server:
     ```bash
     # Using Python
     python -m http.server 8085
     
     # Or using Node.js static server
     npx serve .
     ```
   - Open `http://localhost:8085` in your browser.

---

## 📄 License & Credits

- All garment photographs are preserved as the source-of-truth for visual accuracy.
- © 2026 **Riwaayat Royale Maison de Couture**. All rights reserved.
