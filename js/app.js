// Riwaayat Royale - Main E-Commerce Application Engine
// Handles: Routing, Catalog Filtering, Sorting, Wishlist, Cart Drawer, Checkout, Product Detail Modal, Admin Panel

class RiwaayatRoyaleApp {
  constructor() {
    this.products = [...PRODUCTS_DATA];
    this.occasions = [...OCCASIONS_DATA];

    // Check if loaded on a dedicated occasion page (e.g. haldi.html, mehendi.html)
    if (typeof window !== 'undefined' && window.OCCASION_PAGE_KEY) {
      this.currentOccasion = window.OCCASION_PAGE_KEY;
    } else {
      this.currentOccasion = 'ALL';
    }

    // Check if loaded on a dedicated silhouette category page (e.g. lehengas.html, gowns.html)
    if (typeof window !== 'undefined' && window.CATEGORY_PAGE_KEY) {
      this.currentCategory = window.CATEGORY_PAGE_KEY;
    } else {
      this.currentCategory = 'ALL';
    }
    this.searchQuery = '';
    this.maxPrice = 200000;
    this.selectedSizes = [];
    this.sortBy = 'featured';

    this.wishlist = JSON.parse(localStorage.getItem('rr_wishlist') || '[]');
    this.cart = JSON.parse(localStorage.getItem('rr_cart') || '[]');

    window.royalApp = this;
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderOccasions();
    this.renderProducts();
    this.renderLookbook();
    this.updateBadges();
    this.setupNavbarScroll();
    this.registerServiceWorker();
    this.setupMobileExperience();
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('Riwaayat Royale PWA Service Worker Registered:', reg.scope))
          .catch(err => console.warn('Service Worker registration skipped:', err));
      });
    }
  }

  renderLookbook() {
    const lookbookGrid = document.getElementById('lookbookGrid');
    if (!lookbookGrid || typeof LOOKBOOK_IMAGES === 'undefined') return;

    lookbookGrid.innerHTML = LOOKBOOK_IMAGES.map((item, idx) => `
      <div class="lookbook-card" onclick="if(appInstance && appInstance.products.length > 0){appInstance.openProductModal(appInstance.products[${idx % 20}].id);}">
        <img src="${item.src}" alt="${item.title}" class="lookbook-img" loading="lazy" onerror="this.src='assets/images/reception/imgi_145_off-white-dupion-silk-lehenga-with-pearl-hand-embroidery-for-wedding-wear-llcv125036-1_1.jpg'" />
        <div class="lookbook-card-overlay">
          <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: #FDE2E4; font-weight: 700;">${item.tag}</span>
          <h3 class="heading-serif" style="font-size: 1.4rem; color: #FFFFFF; margin-top: 0.3rem;">${item.title}</h3>
        </div>
      </div>
    `).join('');
  }

  setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  bindEvents() {
    // URL Query Parameter handling (e.g. ?q=lehenga)
    if (typeof window !== 'undefined' && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('q')) {
        this.searchQuery = urlParams.get('q').toLowerCase().trim();
        const searchInp = document.getElementById('amazonSearchInput') || document.getElementById('filterSearch');
        if (searchInp) searchInp.value = urlParams.get('q');
      }
    }

    // Maison / Global Search Bar Handler
    const amazonSearchForm = document.getElementById('maisonSearchForm') || document.getElementById('amazonSearchForm');
    const amazonSearchCategory = document.getElementById('maisonSearchCategory') || document.getElementById('amazonSearchCategory');
    const amazonSearchInput = document.getElementById('maisonSearchInput') || document.getElementById('amazonSearchInput');
    if (amazonSearchForm) {
      amazonSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = amazonSearchInput ? amazonSearchInput.value.trim() : '';
        const cat = amazonSearchCategory ? amazonSearchCategory.value : 'all';

        const categoryRoutes = {
          'Lehenga': 'lehengas.html',
          'Gown': 'gowns.html',
          'Sharara': 'shararas.html',
          'Indo-Western': 'indowestern.html',
          'Haldi': 'haldi.html',
          'Mehendi': 'mehendi.html',
          'Sangeet': 'sangeet.html',
          'Wedding': 'wedding.html',
          'Reception': 'reception.html'
        };

        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        if (cat !== 'all' && categoryRoutes[cat] && currentFile !== categoryRoutes[cat]) {
          window.location.href = `${categoryRoutes[cat]}${q ? '?q=' + encodeURIComponent(q) : ''}`;
          return;
        }

        this.searchQuery = q.toLowerCase();
        this.renderProducts();
      });
    }

    // Amazon Sort Select Handler
    const amazonSort = document.getElementById('amazonSortSelect');
    if (amazonSort) {
      amazonSort.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProducts();
      });
    }

    // Sidebar Price Filters
    document.querySelectorAll('input[name="amazonPriceFilter"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'all') this.maxPrice = 200000;
        else if (val === '25000') this.maxPrice = 25000;
        else if (val === '50000') this.maxPrice = 50000;
        else if (val === '75000') this.maxPrice = 75000;
        this.renderProducts();
      });
    });

    // Sidebar Fabric Filters
    document.querySelectorAll('input[name="amazonFabricFilter"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(document.querySelectorAll('input[name="amazonFabricFilter"]:checked')).map(c => c.value.toLowerCase());
        this.selectedFabrics = checked;
        this.renderProducts();
      });
    });

    // Theme selector handler (legacy fallback)
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
      const savedTheme = localStorage.getItem('rr_theme') || 'baby-pink';
      themeSelector.value = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);

      themeSelector.addEventListener('change', (e) => {
        const selected = e.target.value;
        document.documentElement.setAttribute('data-theme', selected);
        localStorage.setItem('rr_theme', selected);
      });
    }

    // Search input (legacy fallback)
    const searchInput = document.getElementById('filterSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderProducts();
      });
    }

    // Price range slider (legacy fallback)
    const priceSlider = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceRangeValue');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.maxPrice = parseInt(e.target.value, 10);
        if (priceValue) priceValue.textContent = `₹${this.maxPrice.toLocaleString('en-IN')}`;
        this.renderProducts();
      });
    }

    // Sort select (legacy fallback)
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProducts();
      });
    }

    // Cart bucket drawer toggle
    const cartBtn = document.getElementById('cartNavBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const floatingBucketBtn = document.getElementById('floatingBucketBtn');
    const drawerOverlay = document.getElementById('cartDrawerOverlay');

    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCart();
      });
    }
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => this.closeCart());
    }
    if (floatingBucketBtn) {
      floatingBucketBtn.addEventListener('click', () => this.openCart());
    }
    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', () => this.closeCart());
    }

    // Admin panel launcher
    const adminBtn = document.getElementById('adminNavBtn');
    const adminModal = document.getElementById('adminModal');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    if (adminBtn && adminModal) {
      adminBtn.addEventListener('click', () => adminModal.classList.add('active'));
    }
    if (closeAdminBtn && adminModal) {
      closeAdminBtn.addEventListener('click', () => adminModal.classList.remove('active'));
    }

    // Admin product form submit
    const adminForm = document.getElementById('adminProductForm');
    if (adminForm) {
      adminForm.addEventListener('submit', (e) => this.handleAdminAddProduct(e));
    }
  }

  renderOccasions() {
    // Render tabs in catalog
    const tabsContainer = document.getElementById('occasionTabsContainer');
    if (tabsContainer) {
      let tabsHTML = `<button class="occasion-tab-btn ${this.currentOccasion === 'ALL' ? 'active' : ''}" data-occasion="ALL">All Collections</button>`;
      this.occasions.forEach(occ => {
        tabsHTML += `<button class="occasion-tab-btn ${this.currentOccasion === occ.key ? 'active' : ''}" data-occasion="${occ.key}">${occ.icon} ${occ.title}</button>`;
      });
      tabsContainer.innerHTML = tabsHTML;

      tabsContainer.querySelectorAll('.occasion-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const occKey = e.currentTarget.dataset.occasion;
          if (typeof window !== 'undefined' && window.OCCASION_PAGE_KEY) {
            // When browsing on a dedicated occasion page, clicking a different tab navigates to that page
            if (occKey === 'ALL') {
              window.location.href = 'index.html#catalogSection';
              return;
            } else {
              const targetOcc = this.occasions.find(o => o.key === occKey);
              if (targetOcc && targetOcc.url && targetOcc.key !== window.OCCASION_PAGE_KEY) {
                window.location.href = targetOcc.url;
                return;
              }
            }
          }
          this.currentOccasion = occKey;
          this.renderOccasions();
          this.renderProducts();
        });
      });
    }

    // Render "FIND YOUR OCCASION" grid cards
    const gridContainer = document.getElementById('occasionsGrid');
    if (gridContainer) {
      gridContainer.innerHTML = this.occasions.map(occ => `
        <div class="occasion-card" data-occasion="${occ.key}">
          <img src="${occ.image}" alt="${occ.title}" class="occasion-card-img" />
          <div class="occasion-card-overlay">
            <span class="occasion-icon">${occ.icon}</span>
            <h3 class="occasion-card-title heading-serif">${occ.title}</h3>
            <p class="occasion-card-tagline">"${occ.tagline}"</p>
            <span class="occasion-card-btn">Explore Collection →</span>
          </div>
        </div>
      `).join('');

      gridContainer.querySelectorAll('.occasion-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const occKey = e.currentTarget.dataset.occasion;
          const occ = this.occasions.find(o => o.key === occKey);
          if (occ && occ.url) {
            // Opens the dedicated occasion page (e.g. haldi.html, mehendi.html)
            window.location.href = occ.url;
          } else {
            this.currentOccasion = occKey;
            this.renderOccasions();
            this.renderProducts();
            const catalogSection = document.getElementById('catalogSection');
            if (catalogSection) catalogSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
  }

  filterProducts() {
    return this.products.filter(p => {
      // Occasion filter
      if (this.currentOccasion !== 'ALL') {
        if (!p.occasion.includes(this.currentOccasion)) return false;
      }

      // Category filter
      if (this.currentCategory !== 'ALL') {
        if (p.category !== this.currentCategory) return false;
      }

      // Search query
      if (this.searchQuery) {
        const matchesName = p.name.toLowerCase().includes(this.searchQuery);
        const matchesCat = p.category.toLowerCase().includes(this.searchQuery);
        const matchesFabric = p.fabric.toLowerCase().includes(this.searchQuery);
        if (!matchesName && !matchesCat && !matchesFabric) return false;
      }

      // Fabric filter
      if (this.selectedFabrics && this.selectedFabrics.length > 0) {
        const fabricLower = (p.fabric || '').toLowerCase();
        const matchesFab = this.selectedFabrics.some(f => fabricLower.includes(f));
        if (!matchesFab) return false;
      }

      // Price filter
      if (p.price > this.maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (this.sortBy === 'price-low') return a.price - b.price;
      if (this.sortBy === 'price-high') return b.price - a.price;
      if (this.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (this.sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0; // Default featured
    });
  }

  renderProducts() {
    const grid = document.getElementById('productsGrid') || document.getElementById('productGrid');
    if (!grid) return;

    const filtered = this.filterProducts();

    // Update Amazon department results counter
    const resultsCountEl = document.getElementById('amazonResultsCount') || document.getElementById('catalogCountText');
    if (resultsCountEl) {
      const activeLabel = this.currentCategory !== 'ALL' ? this.currentCategory : (this.currentOccasion !== 'ALL' ? this.currentOccasion : 'Indian Wedding Couture');
      resultsCountEl.innerHTML = `Showing 1–${filtered.length} of ${filtered.length} results for <strong>"${activeLabel}"</strong>`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <h3 class="heading-serif" style="font-size: 1.5rem; color: #0F1111; margin-bottom: 0.5rem;">No Outfits Found</h3>
          <p style="color: #565959;">Try adjusting your occasion, category, or search filters.</p>
        </div>
      `;
      return;
    }

    const isAmazon = document.body.classList.contains('amazon-theme');

    if (isAmazon) {
      grid.innerHTML = filtered.map(p => {
        const discountPct = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 20;
        const reviewCount = Math.floor((p.price % 300) + 24);

        return `
          <div class="amazon-product-card" data-id="${p.id}">
            <div class="amazon-card-badge-wrap">
              ${p.isBestSeller ? '<span class="amazon-badge-bestseller">#1 Best Seller</span>' : ''}
              ${p.isNew ? '<span class="amazon-badge-choice"><span>Riwaayat\'s</span> Choice</span>' : ''}
            </div>

            <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="amazon-card-img-wrap" title="Open ${p.name} in new tab">
              <img src="${p.images[0]}" alt="${p.name}" class="amazon-card-img" loading="lazy" onerror="this.src='assets/images/reception/imgi_145_off-white-dupion-silk-lehenga-with-pearl-hand-embroidery-for-wedding-wear-llcv125036-1_1.jpg'" />
            </a>

            <span class="amazon-card-category">${p.category} • ${p.occasion[0]}</span>

            <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="amazon-card-title" title="${p.name}">
              ${p.name}
            </a>

            <div class="amazon-card-rating">
              <span class="amazon-stars">★★★★★</span>
              <span class="amazon-rating-val">${p.rating || '4.9'}</span>
              <span class="amazon-review-count">(${p.reviewsCount || reviewCount})</span>
            </div>

            <div class="amazon-card-price-row">
              <span class="amazon-card-price">
                <span class="amazon-currency-symbol">₹</span>${p.price.toLocaleString('en-IN')}
              </span>
              ${p.originalPrice ? `
                <span class="amazon-card-mrp">M.R.P: ₹${p.originalPrice.toLocaleString('en-IN')}</span>
                <span class="amazon-card-discount">(${discountPct}% off)</span>
              ` : ''}
            </div>

            <div class="amazon-card-prime">
              <span class="amazon-prime-tag">✓prime</span>
              <span>Get it by Tomorrow, 2 PM</span>
            </div>

            <div class="amazon-card-alteration-note">
              ✂️ Complimentary 4" alteration margin built-in
            </div>

            <div class="amazon-card-actions">
              <button class="amazon-card-add-btn add-cart-btn" data-id="${p.id}">Add to Cart</button>
              <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="amazon-card-view-btn">Details ↗</a>
            </div>
          </div>
        `;
      }).join('');
    } else {
      grid.innerHTML = filtered.map(p => {
        const isWishlisted = this.wishlist.includes(p.id);
        const hasMultiplePhotos = p.images && p.images.length > 1;
        return `
          <div class="product-card glass-card" data-id="${p.id}">
            <div class="product-image-container" title="Open product in new page like Amazon">
              <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" style="display:block; width:100%; height:100%;">
                <img src="${p.images[0]}" alt="${p.name}" class="product-img main-img" loading="lazy" onerror="this.src='assets/images/reception/imgi_145_off-white-dupion-silk-lehenga-with-pearl-hand-embroidery-for-wedding-wear-llcv125036-1_1.jpg'" />
                <img src="${p.images[1] || p.images[0]}" alt="${p.name}" class="product-img hover-img" loading="lazy" onerror="this.src='${p.images[0]}'" />
              </a>
              <div class="product-badge-stack">
                ${p.isNew ? `<span class="badge-gold">New Arrival</span>` : ''}
                ${p.isBestSeller ? `<span class="badge-rose">Best Seller</span>` : ''}
              </div>
              ${hasMultiplePhotos ? `<div class="product-angle-badge"><span>📸</span> 2 Angles</div>` : ''}
              <button class="wishlist-card-btn ${isWishlisted ? 'active' : ''}" data-id="${p.id}" title="Add to Wishlist">
                ${isWishlisted ? '❤️' : '🤍'}
              </button>
              <div class="product-card-quickview" data-id="${p.id}" title="Quick modal preview">Quick View</div>
            </div>

            <div class="product-details-wrap">
              <span class="product-category-tag">${p.category} • ${p.occasion[0]}</span>
              <h4 class="product-title heading-serif">
                <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" style="color:inherit; text-decoration:none;">${p.name}</a>
              </h4>

              <div class="product-price-row">
                <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
                ${p.originalPrice ? `<span class="product-original-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
              </div>

              <div class="product-card-actions">
                <button class="add-cart-btn" data-id="${p.id}">Add to Bag</button>
                <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="view-pdp-link" title="Open in new page like Amazon" style="padding: 0.55rem 0.9rem; background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); border-radius: 999px; color: #FFF5D6; font-size: 0.8rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center;">
                  Details ↗
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Attach card event listeners
    grid.querySelectorAll('.add-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addToCart(btn.dataset.id, 'M');
      });
    });

    grid.querySelectorAll('.wishlist-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleWishlist(btn.dataset.id);
      });
    });

    grid.querySelectorAll('.product-card-quickview').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = e.currentTarget.closest('.product-card');
        if (card) this.openProductModal(card.dataset.id);
      });
    });
  }

  toggleWishlist(id) {
    if (this.wishlist.includes(id)) {
      this.wishlist = this.wishlist.filter(i => i !== id);
    } else {
      this.wishlist.push(id);
    }
    localStorage.setItem('rr_wishlist', JSON.stringify(this.wishlist));
    this.updateBadges();
    this.renderProducts();
  }

  updateBadges() {
    const cartBadge = document.getElementById('cartCountBadge');
    const maisonCartBadge = document.getElementById('maisonCartCount');
    const amazonCartBadge = document.getElementById('amazonCartCount');
    const floatingCartBadge = document.getElementById('floatingBucketCount');
    const bucketItemCountText = document.getElementById('bucketItemCountText');
    const wishBadge = document.getElementById('wishCountBadge');

    const totalCartItems = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    if (cartBadge) cartBadge.textContent = totalCartItems;
    if (maisonCartBadge) maisonCartBadge.textContent = totalCartItems;
    if (amazonCartBadge) amazonCartBadge.textContent = totalCartItems;
    if (floatingCartBadge) floatingCartBadge.textContent = totalCartItems;
    const mobileBottomBadge = document.getElementById('mobileBottomCartCount');
    if (mobileBottomBadge) mobileBottomBadge.textContent = totalCartItems;
    if (bucketItemCountText) {
      bucketItemCountText.textContent = `${totalCartItems} item${totalCartItems === 1 ? '' : 's'}`;
    }
    if (wishBadge) wishBadge.textContent = this.wishlist.length;
  }

  addToCart(id, size = 'M', color = '', quantity = 1) {
    let product = this.products.find(p => p.id === id);
    // Fallback search if id is slightly different or bundle
    if (!product && window.CURRENT_PDP_PRODUCT && window.CURRENT_PDP_PRODUCT.id === id) {
      product = window.CURRENT_PDP_PRODUCT;
    }

    if (!product) {
      // Special bundle items
      if (id === 'bundle-choker') {
        product = {
          id: 'bundle-choker',
          name: 'Royal Heritage Kundan Choker Set',
          price: 14500,
          images: ['assets/images/wedding/imgi_180_golden-grace-in-red-silk-zari-embroidered-stone-sequins-lehenga-ghsli2574150-u.jpg'],
          category: 'Bridal Jewelry'
        };
      } else if (id === 'bundle-potli') {
        product = {
          id: 'bundle-potli',
          name: 'Embroidered Zari Trousseau Potli',
          price: 4200,
          images: ['assets/images/reception/imgi_189_classic-rose-gold-tissue-with-moti-and-gota-embroidered-sequins-lehenga-ghspf6062rgo-u.jpg'],
          category: 'Accessories'
        };
      } else {
        return;
      }
    }

    const itemColor = color || (Array.isArray(product.colors) ? product.colors[0] : 'Royal Classic');
    const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);

    const existing = this.cart.find(item => item.id === id && item.size === size && (item.color || '') === itemColor);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + parsedQty;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || Math.round(product.price * 1.2),
        image: (product.images && product.images[0]) ? product.images[0] : 'assets/images/wedding/imgi_180_golden-grace-in-red-silk-zari-embroidered-stone-sequins-lehenga-ghsli2574150-u.jpg',
        category: product.category || 'Couture',
        size: size || 'M',
        color: itemColor,
        quantity: parsedQty
      });
    }

    localStorage.setItem('rr_cart', JSON.stringify(this.cart));
    this.updateBadges();
    this.renderCart();
    this.showToast(`✨ Added ${parsedQty > 1 ? parsedQty + 'x ' : ''}"${product.name}" to your Royal Bucket!`, product.images ? product.images[0] : null);
    this.openCart();
  }

  updateCartQuantity(id, size, color, delta) {
    const item = this.cart.find(i => i.id === id && i.size === size && (i.color || '') === (color || ''));
    if (!item) return;

    item.quantity = (item.quantity || 1) + delta;
    if (item.quantity <= 0) {
      this.cart = this.cart.filter(i => !(i.id === id && i.size === size && (i.color || '') === (color || '')));
      this.showToast(`Removed "${item.name}" from your Royal Bucket.`);
    }

    localStorage.setItem('rr_cart', JSON.stringify(this.cart));
    this.updateBadges();
    this.renderCart();
  }

  removeFromCart(id, size, color) {
    const item = this.cart.find(i => i.id === id && i.size === size && (color ? (i.color || '') === color : true));
    const itemName = item ? item.name : 'Garment';
    this.cart = this.cart.filter(i => !(i.id === id && i.size === size && (color ? (i.color || '') === color : true)));
    localStorage.setItem('rr_cart', JSON.stringify(this.cart));
    this.updateBadges();
    this.renderCart();
    this.showToast(`Removed "${itemName}" from bucket.`);
  }

  clearCart() {
    if (this.cart.length === 0) return;
    this.cart = [];
    localStorage.setItem('rr_cart', JSON.stringify(this.cart));
    this.updateBadges();
    this.renderCart();
    this.showToast(`Your Royal Bucket has been cleared.`);
  }

  openCart() {
    const drawer = document.getElementById('cartDrawer');
    let overlay = document.getElementById('cartDrawerOverlay') || document.getElementById('cartOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'cartDrawerOverlay';
      overlay.className = 'cart-drawer-overlay';
      document.body.appendChild(overlay);
    }
    overlay.onclick = () => this.closeCart();
    if (drawer) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('cart-drawer-open');
    }
    this.renderCart();
  }

  closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay') || document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('cart-drawer-open');
  }

  showToast(message, imgSrc) {
    let toast = document.getElementById('royalFloatingToast') || document.getElementById('royalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'royalFloatingToast';
      toast.className = 'royal-floating-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <div class="royal-toast-content">
        ${imgSrc ? `<img src="${imgSrc}" class="royal-toast-img" alt="Garment" onerror="this.style.display='none'" />` : '<span style="color:#10B981; font-size:1.2rem;">✓</span>'}
        <div class="royal-toast-text">${message}</div>
      </div>
    `;
    toast.classList.add('show');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  renderCart() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotal');
    const mrpSubtotalEl = document.getElementById('bucketMrpSubtotal');
    const savingsSubtotalEl = document.getElementById('bucketSavingsSubtotal');
    const headerCountPill = document.getElementById('bucketHeaderCountPill');
    const finalTotalEl = document.getElementById('cartFinalTotal');
    const savingsEl = document.getElementById('cartSavingsAmount');
    if (!cartItemsContainer) return;

    const totalQty = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (headerCountPill) {
      headerCountPill.textContent = `${totalQty} item${totalQty === 1 ? '' : 's'}`;
    }

    if (this.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="bucket-empty-state">
          <div class="bucket-empty-icon">👑</div>
          <h4 class="heading-serif" style="font-size: 1.25rem; color: #111827; margin-bottom: 0.5rem;">Your Royal Bucket is Empty</h4>
          <p style="color: #6B7280; font-size: 0.88rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Explore handcrafted bridal lehengas, silk shararas, and evening gowns to start building your bespoke trousseau.
          </p>
          <a href="index.html#catalogSection" class="btn-royal-primary" style="display:inline-block; text-decoration:none; padding: 0.75rem 1.6rem;" onclick="if(window.royalApp) window.royalApp.closeCart();">
            Discover Royal Catalog →
          </a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (mrpSubtotalEl) mrpSubtotalEl.textContent = '₹0';
      if (savingsSubtotalEl) savingsSubtotalEl.textContent = '-₹0';
      if (finalTotalEl) finalTotalEl.textContent = '₹0';
      if (savingsEl) savingsEl.textContent = '₹0';
      return;
    }

    let subtotal = 0;
    let mrpTotal = 0;

    cartItemsContainer.innerHTML = this.cart.map((item, index) => {
      const qty = item.quantity || 1;
      const itemTotal = item.price * qty;
      const origUnitPrice = item.originalPrice || Math.round(item.price * 1.2);
      const origItemTotal = origUnitPrice * qty;
      subtotal += itemTotal;
      mrpTotal += origItemTotal;

      return `
        <div class="bucket-item-row" data-index="${index}">
          <div class="bucket-item-img-wrap">
            <img src="${item.image}" alt="${item.name}" class="bucket-item-img" onerror="this.src='assets/images/wedding/imgi_180_golden-grace-in-red-silk-zari-embroidered-stone-sequins-lehenga-ghsli2574150-u.jpg'" />
          </div>
          <div class="bucket-item-info">
            <div class="bucket-item-top">
              <span class="bucket-item-category">${item.category || 'Haute Couture'}</span>
              <button type="button" class="bucket-item-remove-btn" title="Remove from bucket" onclick="if(window.royalApp) window.royalApp.removeFromCart('${item.id}', '${item.size}', '${item.color || ''}')">
                🗑️
              </button>
            </div>
            <h5 class="bucket-item-name heading-serif">${item.name}</h5>
            <div class="bucket-item-options">
              <span class="bucket-opt-pill">Size: <strong>${item.size}</strong></span>
              ${item.color ? `<span class="bucket-opt-pill">Color: <strong>${item.color}</strong></span>` : ''}
            </div>
            <div class="bucket-item-bottom">
              <!-- Quantity Stepper Controls -->
              <div class="bucket-qty-stepper">
                <button type="button" class="bucket-qty-btn" title="Decrease quantity" onclick="if(window.royalApp) window.royalApp.updateCartQuantity('${item.id}', '${item.size}', '${item.color || ''}', -1)">−</button>
                <span class="bucket-qty-val">${qty}</span>
                <button type="button" class="bucket-qty-btn" title="Increase quantity" onclick="if(window.royalApp) window.royalApp.updateCartQuantity('${item.id}', '${item.size}', '${item.color || ''}', 1)">+</button>
              </div>
              <div class="bucket-item-price-wrap">
                <span class="bucket-item-price">₹${itemTotal.toLocaleString('en-IN')}</span>
                ${qty > 1 ? `<span class="bucket-unit-price">(₹${item.price.toLocaleString('en-IN')} each)</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const totalSavings = Math.max(0, mrpTotal - subtotal);
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (mrpSubtotalEl) mrpSubtotalEl.textContent = `₹${mrpTotal.toLocaleString('en-IN')}`;
    if (savingsSubtotalEl) savingsSubtotalEl.textContent = `-₹${totalSavings.toLocaleString('en-IN')}`;
    if (finalTotalEl) finalTotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (savingsEl) savingsEl.textContent = `₹${totalSavings.toLocaleString('en-IN')}`;

    // Bind action buttons in bucket footer
    const clearBtn = document.getElementById('bucketClearAllBtn');
    if (clearBtn) {
      clearBtn.onclick = () => this.clearCart();
    }
    const contBtn = document.getElementById('bucketContinueShoppingBtn');
    if (contBtn) {
      contBtn.onclick = () => this.closeCart();
    }
    const checkoutBtn = document.getElementById('bucketCheckoutBtn');
    if (checkoutBtn) {
      checkoutBtn.onclick = () => {
        this.closeCart();
        const buyNowBtn = document.getElementById('pdpBuyNowBtn');
        if (buyNowBtn) {
          buyNowBtn.click();
        } else {
          alert(`👑 Royal Order Checkout Initiated!\nTotal Amount: ₹${subtotal.toLocaleString('en-IN')}\n\nOur master couturier concierge will verify measurements.`);
        }
      };
    }
  }

  openProductModal(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) return;

    const modal = document.getElementById('productDetailModal');
    const modalContent = document.getElementById('productDetailModalContent');
    if (!modal || !modalContent) return;

    let selectedSize = 'M';

    modalContent.innerHTML = `
      <div class="modal-product-layout">
        <div class="modal-gallery-col">
          <div class="modal-main-img-wrap">
            <img id="mainDetailImg" src="${product.images[0]}" alt="${product.name}" class="modal-main-img" onerror="this.src='assets/images/reception/imgi_145_off-white-dupion-silk-lehenga-with-pearl-hand-embroidery-for-wedding-wear-llcv125036-1_1.jpg'" />
          </div>
          <div class="modal-thumbnails-track">
            ${product.images.map((img, idx) => `
              <button class="modal-thumb-btn ${idx === 0 ? 'active' : ''}" type="button" onclick="
                const mainImg = document.getElementById('mainDetailImg');
                if (mainImg) {
                  mainImg.style.opacity = '0.3';
                  setTimeout(() => { mainImg.src = '${img}'; mainImg.style.opacity = '1'; }, 150);
                }
                this.parentElement.querySelectorAll('.modal-thumb-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
              ">
                <img src="${img}" alt="Thumbnail ${idx + 1}" onerror="this.src='assets/images/reception/imgi_145_off-white-dupion-silk-lehenga-with-pearl-hand-embroidery-for-wedding-wear-llcv125036-1_1.jpg'" />
              </button>
            `).join('')}
          </div>
        </div>

        <div class="modal-info-col">
          <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--gold-light); font-weight: 700;">${product.category} • ${product.occasion.join(', ')}</span>
          <h2 class="heading-serif" style="font-size: 1.8rem; color: #FFFFFF; margin: 0.4rem 0 0.8rem 0; line-height: 1.2;">${product.name}</h2>
          
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem;">
            <span style="font-size: 1.5rem; font-weight: 800; color: var(--gold-light);">₹${product.price.toLocaleString('en-IN')}</span>
            ${product.originalPrice ? `<span style="text-decoration: line-through; color: rgba(255,255,255,0.4); font-size: 0.95rem;">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>

          <p style="font-size: 0.92rem; color: var(--color-ivory-muted); line-height: 1.6; margin-bottom: 1.4rem;">${product.description}</p>

          <div style="margin-bottom: 1.2rem;">
            <div style="font-size: 0.82rem; font-weight: 700; color: #FFFFFF; margin-bottom: 0.5rem;">Select Size:</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${product.sizes.map(sz => `
                <button class="size-btn ${sz === 'M' ? 'active' : ''}" style="padding: 0.45rem 0.85rem; border-radius: 6px; border: 1px solid var(--glass-border); background: rgba(45,10,30,0.6); color: #FFFFFF; font-size: 0.82rem; font-weight: 700;" onclick="selectedSize='${sz}'; this.parentElement.querySelectorAll('button').forEach(b=>{ b.style.background='rgba(45,10,30,0.6)'; b.style.color='#FFFFFF'; }); this.style.background='var(--gold-grad)'; this.style.color='#1A0512';">${sz}</button>
              `).join('')}
            </div>
          </div>

          <div style="padding: 1rem; background: rgba(18,3,14,0.6); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 1.5rem; font-size: 0.85rem; color: #FFFFFF; display: grid; gap: 0.4rem;">
            <div><strong>Fabric:</strong> ${product.fabric}</div>
            <div><strong>Work & Details:</strong> ${product.work}</div>
          </div>

          <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
            <button class="btn-royal-primary" style="flex: 1 1 180px;" onclick="appInstance.addToCart('${product.id}', selectedSize); document.getElementById('productDetailModal').classList.remove('active');">Add To Bag</button>
            <button class="btn-royal-outline" style="flex: 1 1 180px;" onclick="if (atelierEngineInstance) { atelierEngineInstance.setProductImage('${product.images[0]}'); } document.getElementById('productDetailModal').classList.remove('active'); document.getElementById('atelierSection').scrollIntoView({behavior:'smooth'});">View In 3D Atelier ✨</button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    const closeBtn = document.getElementById('closeProductModalBtn');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
  }

  handleAdminAddProduct(e) {
    e.preventDefault();
    const name = document.getElementById('adminProdName').value;
    const category = document.getElementById('adminProdCat').value;
    const occasion = document.getElementById('adminProdOccasion').value;
    const price = parseInt(document.getElementById('adminProdPrice').value, 10);
    const image = document.getElementById('adminProdImage').value || "assets/images/haldi/imgi_140_yellow-organza-silk-embroidered-gorgeous-indowestern-skirt-set-iwsuscc48265562-u.jpg";
    const fabric = document.getElementById('adminProdFabric').value;
    const work = document.getElementById('adminProdWork').value;

    const newProduct = {
      id: `rr-custom-${Date.now()}`,
      name,
      category,
      occasion: [occasion],
      price,
      originalPrice: Math.round(price * 1.2),
      colors: ["Royal Custom"],
      sizes: ["XS", "S", "M", "L", "XL", "Custom Stitching"],
      images: [image],
      isNew: true,
      isBestSeller: false,
      fabric,
      work,
      description: "Custom royal edition outfit uploaded via Riwaayat Royale Atelier.",
      rating: 5.0,
      reviewsCount: 1
    };

    this.products.unshift(newProduct);
    this.renderProducts();

    alert('Royal Outfit Successfully Added to Catalog!');
    document.getElementById('adminModal').classList.remove('active');
    e.target.reset();
  }

  /* ==========================================================================
     MOBILE-FIRST EXPERIENCE SUITE
     ========================================================================== */
  setupMobileExperience() {
    this.injectMobileBottomNav();
    this.injectMobileOccasionsSheet();
    this.setupMobileFilterDrawer();
    this.setupDesktopMobileConnect();
  }

  injectMobileBottomNav() {
    if (document.getElementById('mobileBottomNav')) return;

    const nav = document.createElement('nav');
    nav.className = 'amazon-mobile-bottom-nav';
    nav.id = 'mobileBottomNav';

    const path = window.location.pathname.toLowerCase();
    const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '';
    const totalCartItems = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    nav.innerHTML = `
      <a href="index.html" class="mobile-nav-btn ${isHome ? 'active' : ''}">
        <span class="mobile-nav-icon">🏠</span>
        <span>Home</span>
      </a>
      <button class="mobile-nav-btn" id="mobileNavOccasionsBtn">
        <span class="mobile-nav-icon">👑</span>
        <span>Occasions</span>
      </button>
      <button class="mobile-nav-btn" id="mobileNavSearchBtn">
        <span class="mobile-nav-icon">🔍</span>
        <span>Search</span>
      </button>
      <button class="mobile-nav-btn" id="mobileNavCartBtn">
        <span class="mobile-nav-icon">🛒</span>
        <span>Cart</span>
        <span class="mobile-nav-badge" id="mobileBottomCartCount">${totalCartItems}</span>
      </button>
      <button class="mobile-nav-btn" id="mobileNavAdminBtn">
        <span class="mobile-nav-icon">⚙️</span>
        <span>Admin</span>
      </button>
    `;

    document.body.appendChild(nav);

    // Event listeners
    document.getElementById('mobileNavOccasionsBtn')?.addEventListener('click', () => {
      this.toggleOccasionsSheet(true);
    });

    document.getElementById('mobileNavSearchBtn')?.addEventListener('click', () => {
      const searchInput = document.getElementById('amazonSearchInput') || 
                          document.querySelector('.amazon-search-input') || 
                          document.getElementById('maisonSearchInput');
      if (searchInput) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => searchInput.focus(), 300);
      }
    });

    document.getElementById('mobileNavCartBtn')?.addEventListener('click', () => {
      this.openCart();
    });

    document.getElementById('mobileNavAdminBtn')?.addEventListener('click', () => {
      const adminModal = document.getElementById('adminModal');
      if (adminModal) adminModal.classList.add('active');
    });
  }

  injectMobileOccasionsSheet() {
    if (document.getElementById('mobileOccasionsSheetOverlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'mobile-occasions-sheet-overlay';
    overlay.id = 'mobileOccasionsSheetOverlay';

    overlay.innerHTML = `
      <div class="mobile-occasions-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <span class="sheet-title">Royal Celebrations</span>
          <button class="sheet-close-btn" id="closeOccasionsSheetBtn">✕</button>
        </div>
        <div class="sheet-grid">
          <a href="wedding.html" class="sheet-item">
            <span class="sheet-item-icon">👰</span>
            <span class="sheet-item-label">Bridal Wedding</span>
          </a>
          <a href="reception.html" class="sheet-item">
            <span class="sheet-item-icon">💍</span>
            <span class="sheet-item-label">Grand Reception</span>
          </a>
          <a href="sangeet.html" class="sheet-item">
            <span class="sheet-item-icon">🎶</span>
            <span class="sheet-item-label">Sangeet Gala</span>
          </a>
          <a href="mehendi.html" class="sheet-item">
            <span class="sheet-item-icon">🌿</span>
            <span class="sheet-item-label">Mehendi Henna</span>
          </a>
          <a href="haldi.html" class="sheet-item">
            <span class="sheet-item-icon">🌸</span>
            <span class="sheet-item-label">Haldi Morning</span>
          </a>
          <a href="festive.html" class="sheet-item">
            <span class="sheet-item-icon">✨</span>
            <span class="sheet-item-label">Festive Outfits</span>
          </a>
          <a href="lehengas.html" class="sheet-item">
            <span class="sheet-item-icon">👑</span>
            <span class="sheet-item-label">Royal Lehengas</span>
          </a>
          <a href="gowns.html" class="sheet-item">
            <span class="sheet-item-icon">👗</span>
            <span class="sheet-item-label">Evening Gowns</span>
          </a>
          <a href="shararas.html" class="sheet-item">
            <span class="sheet-item-icon">🌿</span>
            <span class="sheet-item-label">Shararas & Suits</span>
          </a>
          <a href="indowestern.html" class="sheet-item">
            <span class="sheet-item-icon">✨</span>
            <span class="sheet-item-label">Indo-Western</span>
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.toggleOccasionsSheet(false);
    });
    document.getElementById('closeOccasionsSheetBtn')?.addEventListener('click', () => {
      this.toggleOccasionsSheet(false);
    });
  }

  toggleOccasionsSheet(show) {
    const overlay = document.getElementById('mobileOccasionsSheetOverlay');
    if (overlay) {
      if (show) overlay.classList.add('active');
      else overlay.classList.remove('active');
    }
  }

  setupMobileFilterDrawer() {
    const sidebar = document.querySelector('.amazon-filter-sidebar');
    const resultsContainer = document.querySelector('.amazon-results-container');
    if (!sidebar || !resultsContainer) return;

    // Inject mobile filter trigger bar before results bar
    if (!document.querySelector('.mobile-dept-filter-bar')) {
      const filterBar = document.createElement('div');
      filterBar.className = 'mobile-dept-filter-bar';
      filterBar.innerHTML = `
        <button class="mobile-filter-toggle-btn" id="mobileFilterToggleBtn">
          <span>⚡</span>
          <span>Filters &amp; Sort</span>
        </button>
        <span style="font-size:0.8rem; color:#565959;">Refine luxury catalog</span>
      `;
      resultsContainer.insertBefore(filterBar, resultsContainer.firstChild);

      filterBar.querySelector('#mobileFilterToggleBtn')?.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
      });
    }

    // Add mobile close header inside sidebar if missing
    if (!sidebar.querySelector('.amazon-filter-mobile-header')) {
      const mobileHeader = document.createElement('div');
      mobileHeader.className = 'amazon-filter-mobile-header';
      mobileHeader.innerHTML = `
        <span class="amazon-filter-mobile-title">Filters &amp; Refinements</span>
        <button class="amazon-filter-mobile-close" id="mobileFilterCloseBtn">✕</button>
      `;
      sidebar.insertBefore(mobileHeader, sidebar.firstChild);

      const applyFooter = document.createElement('div');
      applyFooter.className = 'amazon-filter-mobile-apply';
      applyFooter.innerHTML = `
        <button class="btn-royal-primary" style="flex:1; padding:0.75rem;" id="mobileFilterApplyBtn">Apply Filters</button>
      `;
      sidebar.appendChild(applyFooter);

      sidebar.querySelector('#mobileFilterCloseBtn')?.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
      });
      sidebar.querySelector('#mobileFilterApplyBtn')?.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
      });
    }
  }

  setupDesktopMobileConnect() {
    if (document.getElementById('desktopMobileTriggerPill')) return;

    // Detect host or fallback
    const host = window.location.hostname || '192.168.1.39';
    const port = window.location.port || '8080';
    const phoneUrl = `http://${host}:${port}/index.html`;

    const pill = document.createElement('button');
    pill.className = 'desktop-mobile-trigger-pill';
    pill.id = 'desktopMobileTriggerPill';
    pill.title = 'Open on Mobile Phone';
    pill.innerHTML = `<span>📱</span><span>View on Phone</span>`;

    const modal = document.createElement('div');
    modal.className = 'mobile-qr-modal-overlay';
    modal.id = 'desktopMobileQrModal';
    modal.innerHTML = `
      <div class="mobile-qr-modal-card">
        <button class="mobile-qr-close-btn" id="closeMobileQrModalBtn">✕</button>
        <div style="font-family:'Cinzel',serif; font-size:1.4rem; color:#D4AF37; margin-bottom:0.25rem;">RIWAAYAT ROYALE</div>
        <div style="font-size:0.9rem; color:#F3EBE1; margin-bottom:1.2rem;">📱 Instant Mobile Phone Access</div>
        <div style="background:#FFF; padding:1rem; border-radius:16px; display:inline-block; margin-bottom:1.2rem;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(phoneUrl)}" alt="Mobile QR Code" style="width:200px; height:200px; display:block;" />
        </div>
        <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(212,175,55,0.4); padding:0.6rem 1rem; border-radius:20px; font-family:monospace; font-size:0.95rem; color:#FEB800; margin-bottom:1.2rem; word-break:break-all;">
          ${phoneUrl}
        </div>
        <div style="font-size:0.82rem; color:#EAEAEA; line-height:1.5; text-align:left; background:rgba(255,255,255,0.06); padding:0.8rem 1rem; border-radius:10px; margin-bottom:1.2rem;">
          1. Ensure your phone is connected to the <strong>same Wi-Fi</strong>.<br/>
          2. Open your phone's <strong>Camera app</strong> and scan the QR code above!
        </div>
        <button class="btn-royal-primary" style="width:100%;" id="copyPhoneLinkBtn">Copy Phone Link</button>
      </div>
    `;

    document.body.appendChild(pill);
    document.body.appendChild(modal);

    pill.addEventListener('click', () => modal.classList.add('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
    document.getElementById('closeMobileQrModalBtn')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    document.getElementById('copyPhoneLinkBtn')?.addEventListener('click', function() {
      navigator.clipboard.writeText(phoneUrl).then(() => {
        this.textContent = 'Link Copied!';
        setTimeout(() => { this.textContent = 'Copy Phone Link'; }, 2000);
      });
    });
  }
}

let appInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  appInstance = new RiwaayatRoyaleApp();
});
