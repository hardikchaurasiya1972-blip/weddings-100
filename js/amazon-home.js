// Riwaayat Royale — Amazon-Style Homepage Controller

document.addEventListener('DOMContentLoaded', () => {
  // 1. Synchronize Cart Counter
  const updateAmazonCartCount = () => {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('rr_cart') || '[]');
    } catch (e) {}
    const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const badge = document.getElementById('amazonCartCount');
    if (badge) badge.innerText = totalCount;
  };
  updateAmazonCartCount();

  // 2. Amazon Search Bar Action
  const searchForm = document.getElementById('amazonSearchForm');
  const searchInput = document.getElementById('amazonSearchInput');
  const searchCat = document.getElementById('amazonSearchCategory');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput ? searchInput.value.trim() : '';
      const cat = searchCat ? searchCat.value : 'all';

      // Route to dedicated page based on category or search
      const catMap = {
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

      if (catMap[cat]) {
        window.location.href = catMap[cat];
      } else if (q.toLowerCase().includes('haldi')) {
        window.location.href = 'haldi.html';
      } else if (q.toLowerCase().includes('mehendi')) {
        window.location.href = 'mehendi.html';
      } else if (q.toLowerCase().includes('sangeet')) {
        window.location.href = 'sangeet.html';
      } else if (q.toLowerCase().includes('wedding') || q.toLowerCase().includes('bridal')) {
        window.location.href = 'wedding.html';
      } else if (q.toLowerCase().includes('reception')) {
        window.location.href = 'reception.html';
      } else if (q.toLowerCase().includes('gown')) {
        window.location.href = 'gowns.html';
      } else if (q.toLowerCase().includes('sharara')) {
        window.location.href = 'shararas.html';
      } else {
        window.location.href = 'lehengas.html';
      }
    });
  }

  // 3. Amazon Hero Banner Auto-Rotator & Controls
  const slides = document.querySelectorAll('.amazon-hero-slide');
  let currentSlide = 0;
  const showSlide = (idx) => {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });
  };

  const nextHeroBtn = document.getElementById('heroNextBtn');
  const prevHeroBtn = document.getElementById('heroPrevBtn');
  if (nextHeroBtn && slides.length > 0) {
    nextHeroBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
  }
  if (prevHeroBtn && slides.length > 0) {
    prevHeroBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
  }

  if (slides.length > 1) {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 6000);
  }

  // 4. Populate Horizontal Carousels
  if (typeof PRODUCTS_DATA !== 'undefined') {
    // Carousel 1: Deals
    const dealsTrack = document.getElementById('dealsCarouselTrack');
    if (dealsTrack) {
      const dealProducts = PRODUCTS_DATA.slice(0, 10);
      dealsTrack.innerHTML = dealProducts.map((p, idx) => {
        const origPrice = p.originalPrice || Math.round(p.price * 1.25);
        const discount = Math.round(((origPrice - p.price) / origPrice) * 100);
        return `
          <div class="amazon-item-card">
            <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="amazon-item-img-wrap">
              <span class="amazon-deal-badge">-${discount}% OFF</span>
              <img src="${p.images[0]}" alt="${p.name}" class="amazon-item-img" loading="lazy" onerror="this.src='assets/images/wedding/imgi_180_golden-grace-in-red-silk-zari-embroidered-stone-sequins-lehenga-ghsli2574150-u.jpg'" />
            </a>
            <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="amazon-item-title" title="${p.name}">
              ${p.name}
            </a>
            <div class="amazon-item-rating-row">
              <span class="amazon-item-stars">★★★★★</span>
              <span>4.9 (${12 + idx * 3})</span>
            </div>
            <div class="amazon-item-price-row">
              <span class="amazon-item-price">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="amazon-item-mrp">₹${origPrice.toLocaleString('en-IN')}</span>
            </div>
            <div class="amazon-prime-delivery">
              <span class="amazon-prime-badge">PRIME</span>
              <span>FREE Express by Tomorrow</span>
            </div>
            <button class="amazon-add-btn" data-id="${p.id}">Add to Cart</button>
          </div>
        `;
      }).join('');
    }

    // Carousel 2: Best Sellers
    const bestSellersTrack = document.getElementById('bestSellersCarouselTrack');
    if (bestSellersTrack) {
      const bestProducts = PRODUCTS_DATA.filter(p => p.isBestSeller || p.rating >= 4.8).slice(0, 10);
      bestSellersTrack.innerHTML = bestProducts.map((p, idx) => {
        const origPrice = p.originalPrice || Math.round(p.price * 1.2);
        return `
          <div class="amazon-item-card">
            <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="amazon-item-img-wrap">
              <span class="amazon-deal-badge" style="background:#B12704;">#1 Best Seller</span>
              <img src="${p.images[0]}" alt="${p.name}" class="amazon-item-img" loading="lazy" onerror="this.src='assets/images/reception/imgi_189_classic-rose-gold-tissue-with-moti-and-gota-embroidered-sequins-lehenga-ghspf6062rgo-u.jpg'" />
            </a>
            <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="amazon-item-title" title="${p.name}">
              ${p.name}
            </a>
            <div class="amazon-item-rating-row">
              <span class="amazon-item-stars">★★★★★</span>
              <span>5.0 (${25 + idx * 4})</span>
            </div>
            <div class="amazon-item-price-row">
              <span class="amazon-item-price">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="amazon-item-mrp">₹${origPrice.toLocaleString('en-IN')}</span>
            </div>
            <div class="amazon-prime-delivery">
              <span class="amazon-prime-badge">PRIME</span>
              <span>48-Hour Dispatch</span>
            </div>
            <button class="amazon-add-btn" data-id="${p.id}">Add to Cart</button>
          </div>
        `;
      }).join('');
    }

    // Carousel 3: Trending Silhouettes
    const trendingTrack = document.getElementById('trendingCarouselTrack');
    if (trendingTrack) {
      const trending = PRODUCTS_DATA.slice(15, 25);
      trendingTrack.innerHTML = trending.map((p, idx) => {
        const origPrice = p.originalPrice || Math.round(p.price * 1.2);
        return `
          <div class="amazon-item-card">
            <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="amazon-item-img-wrap">
              <span class="amazon-deal-badge" style="background:#232F3E;">Trending</span>
              <img src="${p.images[0]}" alt="${p.name}" class="amazon-item-img" loading="lazy" onerror="this.src='assets/images/reception/imgi_165_indowestern-sets-for-women-in-purple-georgette-embroidered-sequins-iwsuscc47757096-u.jpg'" />
            </a>
            <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="amazon-item-title" title="${p.name}">
              ${p.name}
            </a>
            <div class="amazon-item-rating-row">
              <span class="amazon-item-stars">★★★★★</span>
              <span>4.9 (${18 + idx * 2})</span>
            </div>
            <div class="amazon-item-price-row">
              <span class="amazon-item-price">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="amazon-item-mrp">₹${origPrice.toLocaleString('en-IN')}</span>
            </div>
            <div class="amazon-prime-delivery">
              <span class="amazon-prime-badge">PRIME</span>
              <span>Custom Margin Included</span>
            </div>
            <button class="amazon-add-btn" data-id="${p.id}">Add to Cart</button>
          </div>
        `;
      }).join('');
    }

    // 5. Add to Cart on Carousel Cards
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.amazon-add-btn');
      if (!btn) return;
      e.stopPropagation();

      const prodId = btn.dataset.id;
      let cart = [];
      try {
        cart = JSON.parse(localStorage.getItem('rr_cart') || '[]');
      } catch (err) {}

      const existing = cart.find(item => item.id === prodId && item.size === 'M');
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({ id: prodId, size: 'M', qty: 1 });
      }
      localStorage.setItem('rr_cart', JSON.stringify(cart));
      updateAmazonCartCount();

      // Button feedback
      const originalText = btn.innerText;
      btn.innerText = '✓ Added to Cart';
      btn.style.background = '#4BB543';
      btn.style.color = '#FFFFFF';
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);

      // Open cart drawer if available
      const drawer = document.getElementById('cartDrawer');
      if (drawer && window.royalApp) {
        window.royalApp.cart = cart;
        window.royalApp.renderCart();
        window.royalApp.openCart();
      }
    });

    // 6. Horizontal Scroll Track Controls
    document.querySelectorAll('.amazon-carousel-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const trackId = btn.dataset.track;
        const track = document.getElementById(trackId);
        if (!track) return;
        const scrollAmount = btn.classList.contains('next') ? 650 : -650;
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    });
  }

  // 7. Back to Top Smooth Scroll
  const backToTopBtn = document.getElementById('amazonBackToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
