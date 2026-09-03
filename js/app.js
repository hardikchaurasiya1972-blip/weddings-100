// Riwaayat Royale - Main E-Commerce Application Engine
// Handles: Routing, Catalog Filtering, Sorting, Wishlist, Cart Drawer, Checkout, Product Detail Modal, Admin Panel

class RiwaayatRoyaleApp {
  constructor() {
    this.products = [...PRODUCTS_DATA];
    this.occasions = [...OCCASIONS_DATA];

    this.currentOccasion = 'ALL';
    this.currentCategory = 'ALL';
    this.searchQuery = '';
    this.maxPrice = 200000;
    this.selectedSizes = [];
    this.sortBy = 'featured';

    this.wishlist = JSON.parse(localStorage.getItem('rr_wishlist') || '[]');
    this.cart = JSON.parse(localStorage.getItem('rr_cart') || '[]');

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderOccasions();
    this.renderProducts();
    this.renderLookbook();
    this.updateBadges();
    this.setupNavbarScroll();
  }

  renderLookbook() {
    const lookbookGrid = document.getElementById('lookbookGrid');
    if (!lookbookGrid || typeof LOOKBOOK_IMAGES === 'undefined') return;

    lookbookGrid.innerHTML = LOOKBOOK_IMAGES.map(item => `
      <div style="position: relative; height: 420px; border-radius: 16px; overflow: hidden; border: 1px solid var(--glass-border); box-shadow: 0 12px 30px rgba(216,90,117,0.18); cursor: pointer;" onclick="if(appInstance){appInstance.openProductModal(appInstance.products[0].id);}">
        <img src="${item.src}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1.0)'" />
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(74,18,36,0.9) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1.8rem;">
          <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: #FDE2E4;">${item.tag}</span>
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
    // Theme selector handler
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

    // Search input
    const searchInput = document.getElementById('filterSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderProducts();
      });
    }

    // Price range slider
    const priceSlider = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceRangeValue');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.maxPrice = parseInt(e.target.value, 10);
        if (priceValue) priceValue.textContent = `₹${this.maxPrice.toLocaleString('en-IN')}`;
        this.renderProducts();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProducts();
      });
    }

    // Cart drawer toggle
    const cartBtn = document.getElementById('cartNavBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (cartBtn && cartDrawer) {
      cartBtn.addEventListener('click', () => {
        this.renderCart();
        cartDrawer.classList.add('active');
      });
    }
    if (closeCartBtn && cartDrawer) {
      closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('active'));
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
          this.currentOccasion = e.currentTarget.dataset.occasion;
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
          this.currentOccasion = e.currentTarget.dataset.occasion;
          this.renderOccasions();
          this.renderProducts();

          const catalogSection = document.getElementById('catalogSection');
          if (catalogSection) catalogSection.scrollIntoView({ behavior: 'smooth' });
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

      // Price filter
      if (p.price > this.maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (this.sortBy === 'price-low') return a.price - b.price;
      if (this.sortBy === 'price-high') return b.price - a.price;
      if (this.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // Default featured
    });
  }

  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = this.filterProducts();

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <h3 class="heading-serif" style="font-size: 1.5rem; color: var(--gold-light); margin-bottom: 0.5rem;">No Outfits Found</h3>
          <p style="color: var(--color-ivory-muted);">Try adjusting your occasion, category, or search filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isWishlisted = this.wishlist.includes(p.id);
      return `
        <div class="product-card glass-card" data-id="${p.id}">
          <div class="product-image-container">
            <img src="${p.images[0]}" alt="${p.name}" class="product-img main-img" />
            <img src="${p.images[1] || p.images[0]}" alt="${p.name}" class="product-img hover-img" />
            <div class="product-badge-stack">
              ${p.isNew ? `<span class="badge-gold">New Arrival</span>` : ''}
              ${p.isBestSeller ? `<span class="badge-rose">Best Seller</span>` : ''}
            </div>
            <button class="wishlist-card-btn ${isWishlisted ? 'active' : ''}" data-id="${p.id}" title="Add to Wishlist">
              ${isWishlisted ? '❤️' : '🤍'}
            </button>
            <div class="product-card-quickview" data-id="${p.id}">Quick View</div>
          </div>

          <div class="product-details-wrap">
            <span class="product-category-tag">${p.category} • ${p.occasion[0]}</span>
            <h4 class="product-title heading-serif">${p.name}</h4>

            <div class="product-price-row">
              <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
              ${p.originalPrice ? `<span class="product-original-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>

            <div class="product-card-actions">
              <button class="add-cart-btn" data-id="${p.id}">Add to Bag</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card event listeners
    grid.querySelectorAll('.product-card-quickview, .product-img, .product-title').forEach(el => {
      el.addEventListener('click', (e) => {
        const card = e.currentTarget.closest('.product-card');
        if (card) this.openProductModal(card.dataset.id);
      });
    });

    grid.querySelectorAll('.wishlist-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleWishlist(btn.dataset.id);
      });
    });

    grid.querySelectorAll('.add-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addToCart(btn.dataset.id, 'M');
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

  addToCart(id, size = 'M') {
    const product = this.products.find(p => p.id === id);
    if (!product) return;

    const existing = this.cart.find(item => item.id === id && item.size === size);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: size,
        quantity: 1
      });
    }

    localStorage.setItem('rr_cart', JSON.stringify(this.cart));
    this.updateBadges();
    this.renderCart();

    const drawer = document.getElementById('cartDrawer');
    if (drawer) drawer.classList.add('active');
  }

  updateBadges() {
    const cartBadge = document.getElementById('cartCountBadge');
    const wishBadge = document.getElementById('wishCountBadge');

    const totalCartItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartBadge) cartBadge.textContent = totalCartItems;
    if (wishBadge) wishBadge.textContent = this.wishlist.length;
  }

  renderCart() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotal');
    if (!cartItemsContainer) return;

    if (this.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <p style="color: var(--color-ivory-muted); margin-bottom: 1rem;">Your shopping bag is empty.</p>
          <button class="btn-royal-outline" onclick="document.getElementById('cartDrawer').classList.remove('active')">Explore Couture</button>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '₹0';
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = this.cart.map(item => {
      subtotal += item.price * item.quantity;
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div style="flex-grow: 1;">
            <h5 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem;">${item.name}</h5>
            <span style="font-size: 0.8rem; color: var(--gold-light);">Size: ${item.size} • Qty: ${item.quantity}</span>
            <div style="font-weight: 700; color: var(--color-ivory); margin-top: 0.4rem;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
          </div>
          <button style="color: var(--rose-gold-light); font-size: 1.2rem;" onclick="appInstance.removeFromCart('${item.id}', '${item.size}')">✕</button>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  }

  removeFromCart(id, size) {
    this.cart = this.cart.filter(item => !(item.id === id && item.size === size));
    localStorage.setItem('rr_cart', JSON.stringify(this.cart));
    this.updateBadges();
    this.renderCart();
  }

  openProductModal(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) return;

    const modal = document.getElementById('productDetailModal');
    const modalContent = document.getElementById('productDetailModalContent');
    if (!modal || !modalContent) return;

    let selectedSize = 'M';

    modalContent.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start;">
        <div>
          <img id="mainDetailImg" src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 480px; object-fit: cover; border-radius: 12px; border: 1px solid var(--glass-border);" />
          <div style="display: flex; gap: 0.6rem; margin-top: 1rem;">
            ${product.images.map(img => `
              <img src="${img}" alt="Thumbnail" style="width: 70px; height: 90px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 1px solid var(--glass-border);" onclick="document.getElementById('mainDetailImg').src = '${img}'" />
            `).join('')}
          </div>
        </div>

        <div>
          <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--gold-light); font-weight: 700;">${product.category} • ${product.occasion.join(', ')}</span>
          <h2 class="heading-serif" style="font-size: 2rem; color: #FFFFFF; margin: 0.5rem 0 1rem 0;">${product.name}</h2>
          
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <span style="font-size: 1.6rem; font-weight: 800; color: var(--gold-light);">₹${product.price.toLocaleString('en-IN')}</span>
            ${product.originalPrice ? `<span style="text-decoration: line-through; color: rgba(255,255,255,0.4);">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>

          <p style="font-size: 0.95rem; color: var(--color-ivory-muted); line-height: 1.6; margin-bottom: 1.8rem;">${product.description}</p>

          <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: #FFFFFF; margin-bottom: 0.6rem;">Select Size:</div>
            <div style="display: flex; gap: 0.6rem;">
              ${product.sizes.map(sz => `
                <button class="size-btn ${sz === 'M' ? 'active' : ''}" style="padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid var(--glass-border); background: rgba(45,10,30,0.6); color: #FFFFFF; font-size: 0.85rem; font-weight: 700;" onclick="selectedSize='${sz}'; this.parentElement.querySelectorAll('button').forEach(b=>{ b.style.background='rgba(45,10,30,0.6)'; b.style.color='#FFFFFF'; }); this.style.background='var(--gold-grad)'; this.style.color='#1A0512';">${sz}</button>
              `).join('')}
            </div>
          </div>

          <div style="padding: 1.2rem; background: rgba(18,3,14,0.6); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 1.8rem; font-size: 0.88rem; color: #FFFFFF; display: grid; gap: 0.5rem;">
            <div><strong>Fabric:</strong> ${product.fabric}</div>
            <div><strong>Work & Details:</strong> ${product.work}</div>
          </div>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn-royal-primary" style="flex-grow: 1;" onclick="appInstance.addToCart('${product.id}', selectedSize); document.getElementById('productDetailModal').classList.remove('active');">Add To Bag</button>
            <button class="btn-royal-outline" onclick="if (atelierEngineInstance) { atelierEngineInstance.setProductImage('${product.images[0]}'); } document.getElementById('productDetailModal').classList.remove('active'); document.getElementById('atelierSection').scrollIntoView({behavior:'smooth'});">View In 3D Atelier ✨</button>
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
    const image = document.getElementById('adminProdImage').value || "haldi/imgi_140_yellow-organza-silk-embroidered-gorgeous-indowestern-skirt-set-iwsuscc48265562-u.jpg";
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
}

let appInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  appInstance = new RiwaayatRoyaleApp();
});
