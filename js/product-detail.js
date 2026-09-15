// Riwaayat Royale — Amazon-Style Product Detail Page (PDP) Controller

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'rr-wedd-1';

  // Retrieve custom uploaded admin products if any
  let allProducts = [...PRODUCTS_DATA];
  try {
    const custom = JSON.parse(localStorage.getItem('rr_custom_products') || '[]');
    if (Array.isArray(custom)) {
      allProducts = [...custom, ...allProducts];
    }
  } catch (e) {
    console.error('Error loading custom products', e);
  }

  // Find product by ID
  let product = allProducts.find(p => p.id === productId);
  if (!product) {
    product = allProducts[0]; // Graceful fallback to first product
  }
  window.CURRENT_PDP_PRODUCT = product;

  // 1. Page Head & Title
  document.title = `${product.name} — Riwaayat Royale Maison de Couture`;
  const metaTitleEl = document.getElementById('pdpMetaTitle');
  if (metaTitleEl) metaTitleEl.innerText = `${product.name} — Riwaayat Royale`;
  const metaDescEl = document.getElementById('pdpMetaDesc');
  if (metaDescEl && product.description) {
    metaDescEl.setAttribute('content', product.description);
  }

  // 2. Breadcrumbs
  const bCat = document.getElementById('pdpBreadcrumbCategory');
  if (bCat) {
    bCat.innerText = product.category || 'Silhouettes';
    bCat.href = `index.html#categoriesSection`;
  }
  const bOcc = document.getElementById('pdpBreadcrumbOccasion');
  const occName = Array.isArray(product.occasion) ? product.occasion[0] : (product.occasion || 'Wedding');
  if (bOcc) {
    bOcc.innerText = occName;
    const occSlugMap = {
      'Haldi': 'haldi.html',
      'Mehendi': 'mehendi.html',
      'Sangeet': 'sangeet.html',
      'Wedding': 'wedding.html',
      'Reception': 'reception.html',
      'Anniversary': 'anniversary.html',
      'Party & Festive': 'festive.html'
    };
    bOcc.href = occSlugMap[occName] || 'wedding.html';
  }
  const bTitle = document.getElementById('pdpBreadcrumbTitle');
  if (bTitle) bTitle.innerText = product.name;

  // 3. Product Header & Ratings
  const pdpTitle = document.getElementById('pdpTitle');
  if (pdpTitle) pdpTitle.innerText = product.name;

  const brandTag = document.getElementById('pdpBrandTag');
  if (brandTag) brandTag.innerText = `RIWAAYAT ROYALE • ${product.category.toUpperCase()}`;

  const ratingNum = document.getElementById('pdpRatingNum');
  if (ratingNum) ratingNum.innerText = (product.rating || 4.9).toFixed(1);

  const reviewScoreBig = document.getElementById('reviewScoreBig');
  if (reviewScoreBig) reviewScoreBig.innerText = (product.rating || 4.9).toFixed(1);

  const reviewCountText = document.getElementById('pdpReviewCountText');
  const rCount = product.reviewsCount || 24;
  if (reviewCountText) reviewCountText.innerText = `${rCount + 6} ratings & ${rCount} verified reviews`;

  // 4. Pricing Calculation
  const currentPriceEl = document.getElementById('pdpCurrentPrice');
  if (currentPriceEl) currentPriceEl.innerText = `₹${product.price.toLocaleString('en-IN')}`;

  const origPrice = product.originalPrice || Math.round(product.price * 1.22);
  const mrpEl = document.getElementById('pdpMrpPrice');
  if (mrpEl) mrpEl.innerText = `₹${origPrice.toLocaleString('en-IN')}`;

  const discountPercent = Math.round(((origPrice - product.price) / origPrice) * 100);
  const discountBadge = document.getElementById('pdpDiscountBadge');
  if (discountBadge) discountBadge.innerText = `-${discountPercent}%`;

  const savingsNote = document.getElementById('pdpSavingsNote');
  const savingsAmt = origPrice - product.price;
  if (savingsNote) {
    savingsNote.innerText = `You Save: ₹${savingsAmt.toLocaleString('en-IN')} (${discountPercent}% OFF)`;
  }

  const emiAmount = document.getElementById('pdpEmiAmount');
  if (emiAmount) {
    emiAmount.innerText = `₹${Math.round(product.price / 3).toLocaleString('en-IN')}`;
  }

  // 5. Highlights Box
  const fabEl = document.getElementById('pdpFabricHighlight');
  if (fabEl) fabEl.innerText = product.fabric || 'Pure Organza Silk & Satin Chiffon';

  const workEl = document.getElementById('pdpWorkHighlight');
  if (workEl) workEl.innerText = product.work || 'Hand Dori Embroidery, Gota Patti & Zardozi Work';

  // 6. Visual Gallery Setup
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['assets/images/wedding/imgi_180_golden-grace-in-red-silk-zari-embroidered-stone-sequins-lehenga-ghsli2574150-u.jpg'];

  const mainImg = document.getElementById('pdpMainImg');
  if (mainImg) {
    mainImg.src = images[0];
    mainImg.alt = product.name;
  }

  let currentPhotoIdx = 0;
  const thumbRail = document.getElementById('pdpThumbRail');
  if (thumbRail) {
    thumbRail.innerHTML = images.map((imgSrc, idx) => `
      <button type="button" class="pdp-thumb-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}" title="Angle ${idx + 1}">
        <img src="${imgSrc}" alt="${product.name} angle ${idx + 1}" loading="lazy" onerror="this.src='${images[0]}'" />
      </button>
    `).join('');

    const updateActiveThumb = (idx) => {
      currentPhotoIdx = idx;
      thumbRail.querySelectorAll('.pdp-thumb-btn').forEach(b => b.classList.remove('active'));
      const activeBtn = thumbRail.querySelector(`[data-index="${idx}"]`);
      if (activeBtn) activeBtn.classList.add('active');
      if (mainImg && images[idx]) {
        mainImg.src = images[idx];
      }
    };

    thumbRail.querySelectorAll('.pdp-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        updateActiveThumb(idx);
      });

      // Hover preview support on desktop
      btn.addEventListener('mouseenter', () => {
        const idx = parseInt(btn.dataset.index, 10);
        updateActiveThumb(idx);
      });
    });
  }

  // Gallery interactive zoom lens on hover
  const viewport = document.getElementById('pdpViewport');
  if (viewport && mainImg) {
    viewport.addEventListener('mousemove', (e) => {
      const rect = viewport.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImg.style.transformOrigin = `${x}% ${y}%`;
    });
    viewport.addEventListener('mouseleave', () => {
      mainImg.style.transformOrigin = 'center center';
    });
  }

  // 6b. High-Definition Lightbox Modal
  const lightboxModal = document.getElementById('imageLightboxModal');
  const lightboxMainImg = document.getElementById('lightboxMainImg');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxCaptionTitle = document.getElementById('lightboxCaptionTitle');
  const lightboxAngleIndicator = document.getElementById('lightboxAngleIndicator');

  const updateLightboxContent = () => {
    if (!lightboxModal || !lightboxMainImg) return;
    lightboxMainImg.src = images[currentPhotoIdx];
    if (lightboxCaptionTitle) lightboxCaptionTitle.textContent = product.name;
    if (lightboxAngleIndicator) {
      lightboxAngleIndicator.textContent = `Angle ${currentPhotoIdx + 1} of ${images.length}`;
    }
  };

  const openLightbox = (idx = 0) => {
    currentPhotoIdx = idx;
    updateLightboxContent();
    if (lightboxModal) lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (lightboxModal) lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (viewport) {
    viewport.addEventListener('click', (e) => {
      // Don't open if clicked badges
      if (e.target.closest('#pdpBadgeStack')) return;
      openLightbox(currentPhotoIdx);
    });
  }

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentPhotoIdx = (currentPhotoIdx - 1 + images.length) % images.length;
      updateLightboxContent();
    });
  }
  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentPhotoIdx = (currentPhotoIdx + 1) % images.length;
      updateLightboxContent();
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrevBtn) lightboxPrevBtn.click();
    if (e.key === 'ArrowRight' && lightboxNextBtn) lightboxNextBtn.click();
  });

  // 7. Color Swatches
  const colorContainer = document.getElementById('pdpColorSwatches');
  const colorNameEl = document.getElementById('pdpSelectedColorName');
  const colors = Array.isArray(product.colors) && product.colors.length > 0 
    ? product.colors 
    : ['Royal Crimson', 'Antique Gold'];

  let selectedColor = colors[0];
  if (colorNameEl) colorNameEl.innerText = selectedColor;

  if (colorContainer) {
    colorContainer.innerHTML = colors.map((col, idx) => `
      <button type="button" class="pdp-size-pill ${idx === 0 ? 'active' : ''}" data-color="${col}" style="font-size: 0.85rem; padding: 0.4rem 0.9rem;">
        ✦ ${col}
      </button>
    `).join('');

    colorContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        colorContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedColor = btn.dataset.color;
        if (colorNameEl) colorNameEl.innerText = selectedColor;
      });
    });
  }

  // 8. Size Selector
  let selectedSize = 'M';
  const sizePillsContainer = document.getElementById('pdpSizePills');
  const sizeNameEl = document.getElementById('pdpSelectedSizeName');
  if (sizePillsContainer) {
    sizePillsContainer.querySelectorAll('.pdp-size-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        sizePillsContainer.querySelectorAll('.pdp-size-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedSize = pill.dataset.size;
        if (sizeNameEl) {
          const descMap = {
            'XS': 'XS (32" Bust)',
            'S': 'S (34" Bust)',
            'M': 'M (36" Bust)',
            'L': 'L (38" Bust)',
            'XL': 'XL (40" Bust)',
            'Custom Stitching': 'Bespoke Tailoring to your exact measurements'
          };
          sizeNameEl.innerText = descMap[selectedSize] || selectedSize;
        }
      });
    });
  }

  // Size Guide Modal Trigger
  const sizeGuideBtn = document.getElementById('pdpSizeGuideBtn');
  const sizeGuideModal = document.getElementById('sizeGuideModal');
  const closeSizeGuideBtn = document.getElementById('closeSizeGuideBtn');
  if (sizeGuideBtn && sizeGuideModal) {
    sizeGuideBtn.addEventListener('click', () => sizeGuideModal.classList.add('open'));
  }
  if (closeSizeGuideBtn && sizeGuideModal) {
    closeSizeGuideBtn.addEventListener('click', () => sizeGuideModal.classList.remove('open'));
  }
  if (sizeGuideModal) {
    sizeGuideModal.addEventListener('click', (e) => {
      if (e.target === sizeGuideModal) sizeGuideModal.classList.remove('open');
    });
  }

  // 8b. Delivery Pincode Checker
  const pincodeInput = document.getElementById('pdpPincodeInput');
  const pincodeCheckBtn = document.getElementById('pdpPincodeCheckBtn');
  const pincodeResult = document.getElementById('pdpPincodeResult');

  const checkPincode = () => {
    if (!pincodeInput || !pincodeResult) return;
    const pin = pincodeInput.value.trim();
    if (!/^\d{6}$/.test(pin)) {
      pincodeResult.innerHTML = '<span style="color: #DC2626; font-weight: 600;">⚠️ Please enter a valid 6-digit pincode</span>';
      return;
    }

    const arrival = new Date();
    arrival.setDate(arrival.getDate() + 3);
    const dateStr = arrival.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    pincodeResult.innerHTML = `<span style="color: #059669; font-weight: 700;">✓ Free Express Delivery by ${dateStr}</span> <span style="color:#4B5563;">• COD &amp; Alteration Guarantee</span>`;
  };

  if (pincodeCheckBtn) pincodeCheckBtn.addEventListener('click', checkPincode);
  if (pincodeInput) {
    pincodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkPincode();
      }
    });
  }

  // 8c. PDP Quantity Stepper
  let currentPdpQty = 1;
  const pdpQtyMinus = document.getElementById('pdpQtyMinus');
  const pdpQtyPlus = document.getElementById('pdpQtyPlus');
  const pdpQtyInput = document.getElementById('pdpQtyInput');

  if (pdpQtyMinus) {
    pdpQtyMinus.addEventListener('click', () => {
      if (currentPdpQty > 1) {
        currentPdpQty--;
        if (pdpQtyInput) pdpQtyInput.value = currentPdpQty;
      }
    });
  }
  if (pdpQtyPlus) {
    pdpQtyPlus.addEventListener('click', () => {
      if (currentPdpQty < 10) {
        currentPdpQty++;
        if (pdpQtyInput) pdpQtyInput.value = currentPdpQty;
      }
    });
  }

  // 9. Specifications Table
  const specSilhouette = document.getElementById('specSilhouette');
  if (specSilhouette) specSilhouette.innerText = product.category;

  const specOccasion = document.getElementById('specOccasion');
  if (specOccasion) specOccasion.innerText = Array.isArray(product.occasion) ? product.occasion.join(', ') : product.occasion;

  const specFabric = document.getElementById('specFabric');
  if (specFabric) specFabric.innerText = product.fabric || 'Pure Organza Silk & Satin Chiffon';

  const specWork = document.getElementById('specWork');
  if (specWork) specWork.innerText = product.work || 'Hand Dori Embroidery, Gota Patti & Moti Work';

  // 10. Frequently Bought Together (Complete The Royal Trousseau)
  const bundleMainImg = document.getElementById('bundleMainImg');
  if (bundleMainImg) bundleMainImg.src = images[0];

  const bundleMainName = document.getElementById('bundleMainName');
  if (bundleMainName) bundleMainName.innerText = product.name;

  const bundleMainPrice = document.getElementById('bundleMainPrice');
  if (bundleMainPrice) bundleMainPrice.innerText = `₹${product.price.toLocaleString('en-IN')}`;

  const bundleTotal = product.price + 14500 + 4200 - 2500;
  const bundleTotalPrice = document.getElementById('bundleTotalPrice');
  if (bundleTotalPrice) bundleTotalPrice.innerText = `₹${bundleTotal.toLocaleString('en-IN')}`;

  const addBundleBtn = document.getElementById('addBundleBtn');
  if (addBundleBtn) {
    addBundleBtn.addEventListener('click', () => {
      if (window.royalApp) {
        window.royalApp.addToCart(product.id, selectedSize, selectedColor, currentPdpQty);
        window.royalApp.addToCart('bundle-choker', 'Free Size', 'Gold Kundan', 1);
        window.royalApp.addToCart('bundle-potli', 'Free Size', 'Embroidered Zari', 1);
        window.royalApp.openCart();
      }
    });
  }

  // 11. Buy Box Actions: Add to Bag (Shopping Bucket)
  const addBagBtn = document.getElementById('pdpAddToCartBtn');
  if (addBagBtn) {
    addBagBtn.addEventListener('click', () => {
      if (window.royalApp) {
        window.royalApp.addToCart(product.id, selectedSize, selectedColor, currentPdpQty);
        window.royalApp.openCart();
      } else {
        alert(`✅ Added ${currentPdpQty}x ${product.name} (Size: ${selectedSize}, Color: ${selectedColor}) to your Shopping Bucket!`);
      }
    });
  }

  // 11b. 1-Click Buy Now Express Checkout Modal
  const buyNowBtn = document.getElementById('pdpBuyNowBtn');
  const buyNowModal = document.getElementById('buyNowModal');
  const closeBuyNowBtn = document.getElementById('closeBuyNowBtn');
  const buyNowMainBody = document.getElementById('buyNowMainBody');
  const buyNowSuccessView = document.getElementById('buyNowSuccessView');
  const buyNowForm = document.getElementById('buyNowCheckoutForm');
  const btnPlaceRoyalOrder = document.getElementById('btnPlaceRoyalOrder');
  const btnPrintReceiptBtn = document.getElementById('btnPrintReceiptBtn');
  const btnContinueAfterOrderBtn = document.getElementById('btnContinueAfterOrderBtn');

  // Fields to populate in Buy Now Modal
  const buyNowItemImg = document.getElementById('buyNowItemImg');
  const buyNowItemTitle = document.getElementById('buyNowItemTitle');
  const buyNowItemSize = document.getElementById('buyNowItemSize');
  const buyNowItemColor = document.getElementById('buyNowItemColor');
  const buyNowItemQty = document.getElementById('buyNowItemQty');
  const buyNowItemUnitPrice = document.getElementById('buyNowItemUnitPrice');
  const buyNowItemQtyText = document.getElementById('buyNowItemQtyText');
  const buyNowItemTotal = document.getElementById('buyNowItemTotal');

  let selectedPaymentMethod = 'Cash on Delivery';

  const openBuyNowModal = () => {
    if (!buyNowModal) return;

    // Populate garment details
    if (buyNowItemImg) buyNowItemImg.src = images[0];
    if (buyNowItemTitle) buyNowItemTitle.textContent = product.name;
    if (buyNowItemSize) buyNowItemSize.textContent = selectedSize;
    if (buyNowItemColor) buyNowItemColor.textContent = selectedColor;
    if (buyNowItemQty) buyNowItemQty.textContent = currentPdpQty;
    if (buyNowItemUnitPrice) buyNowItemUnitPrice.textContent = `₹${product.price.toLocaleString('en-IN')}`;
    if (buyNowItemQtyText) buyNowItemQtyText.textContent = `× ${currentPdpQty}`;
    
    const grandTotal = product.price * currentPdpQty;
    if (buyNowItemTotal) buyNowItemTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

    // Reset view state
    if (buyNowMainBody) buyNowMainBody.style.display = 'grid';
    if (buyNowSuccessView) buyNowSuccessView.style.display = 'none';

    buyNowModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeBuyNowModal = () => {
    if (!buyNowModal) return;
    buyNowModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', openBuyNowModal);
  }

  if (closeBuyNowBtn) {
    closeBuyNowBtn.addEventListener('click', closeBuyNowModal);
  }

  if (buyNowModal) {
    buyNowModal.addEventListener('click', (e) => {
      if (e.target === buyNowModal) closeBuyNowModal();
    });
  }

  // Payment method pills in Buy Now
  document.querySelectorAll('.buy-now-payment-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.buy-now-payment-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedPaymentMethod = pill.dataset.pay || 'Cash on Delivery';
    });
  });

  // Buy Now Form Submission (Instant Order Confirmation)
  if (buyNowForm) {
    buyNowForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const custName = document.getElementById('buyNowCustomerName')?.value.trim() || 'Valued Patron';
      const custPhone = document.getElementById('buyNowCustomerPhone')?.value.trim() || '';
      const custPincode = document.getElementById('buyNowCustomerPincode')?.value.trim() || '';
      const custAddress = document.getElementById('buyNowCustomerAddress')?.value.trim() || '';
      const grandTotal = product.price * currentPdpQty;

      if (btnPlaceRoyalOrder) {
        btnPlaceRoyalOrder.disabled = true;
        btnPlaceRoyalOrder.innerHTML = '<span>⏳ Booking Master Atelier Slot...</span>';
      }

      setTimeout(() => {
        const orderId = `RR-2026-${Math.floor(10000 + Math.random() * 90000)}`;

        // Populate Confirmation Card
        const confirmedOrderId = document.getElementById('confirmedOrderId');
        const confirmedRecipient = document.getElementById('confirmedRecipient');
        const confirmedOutfitName = document.getElementById('confirmedOutfitName');
        const confirmedSizeQty = document.getElementById('confirmedSizeQty');
        const confirmedPaymentMode = document.getElementById('confirmedPaymentMode');
        const confirmedTotalAmount = document.getElementById('confirmedTotalAmount');
        const confirmedDeliveryDate = document.getElementById('confirmedDeliveryDate');

        if (confirmedOrderId) confirmedOrderId.textContent = `ORDER #${orderId}`;
        if (confirmedRecipient) confirmedRecipient.textContent = custName;
        if (confirmedOutfitName) confirmedOutfitName.textContent = product.name;
        if (confirmedSizeQty) confirmedSizeQty.textContent = `Size ${selectedSize} (${selectedColor}) • Qty: ${currentPdpQty}`;
        if (confirmedPaymentMode) confirmedPaymentMode.textContent = selectedPaymentMethod;
        if (confirmedTotalAmount) confirmedTotalAmount.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

        const delDate = new Date();
        delDate.setDate(delDate.getDate() + 4);
        if (confirmedDeliveryDate) {
          confirmedDeliveryDate.textContent = `by ${delDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}`;
        }

        // Switch to Confirmation view
        if (buyNowMainBody) buyNowMainBody.style.display = 'none';
        if (buyNowSuccessView) buyNowSuccessView.style.display = 'flex';

        if (btnPlaceRoyalOrder) {
          btnPlaceRoyalOrder.disabled = false;
          btnPlaceRoyalOrder.innerHTML = '<span>🔒 Confirm &amp; Place Royal Order</span>';
        }

        if (window.royalApp) {
          window.royalApp.showToast(`🎉 Order #${orderId} confirmed for ${custName}!`, images[0]);
        }
      }, 450);
    });
  }

  // Print Receipt
  if (btnPrintReceiptBtn) {
    btnPrintReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Continue Shopping after order
  if (btnContinueAfterOrderBtn) {
    btnContinueAfterOrderBtn.addEventListener('click', () => {
      closeBuyNowModal();
      if (buyNowForm) buyNowForm.reset();
    });
  }

  // 11c. Wishlist Button on PDP
  const pdpWishBtn = document.getElementById('pdpWishlistBtn');
  const updatePdpWishBtn = () => {
    let wishes = [];
    try { wishes = JSON.parse(localStorage.getItem('rr_wishlist') || '[]'); } catch(e){}
    const isWished = wishes.includes(product.id);
    if (pdpWishBtn) {
      pdpWishBtn.innerHTML = isWished ? '<span>❤️ In Wishlist</span>' : '<span>🤍 Add to Wishlist</span>';
      pdpWishBtn.style.borderColor = isWished ? '#D85A75' : '';
    }
  };
  updatePdpWishBtn();

  if (pdpWishBtn) {
    pdpWishBtn.addEventListener('click', () => {
      if (window.royalApp) {
        window.royalApp.toggleWishlist(product.id);
        updatePdpWishBtn();
      }
    });
  }

  // 12. "Customers Also Viewed" (4 Related Outfits)
  const relatedGrid = document.getElementById('relatedProductsGrid');
  if (relatedGrid) {
    const related = allProducts.filter(p => p.id !== product.id && (p.category === product.category || p.occasion.includes(occName))).slice(0, 4);
    
    relatedGrid.innerHTML = related.map(p => {
      const hasMultiplePhotos = p.images && p.images.length > 1;
      return `
        <div class="product-card glass-card" data-id="${p.id}">
          <div class="product-image-container">
            <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" style="display:block; width:100%; height:100%;">
              <img src="${p.images[0]}" alt="${p.name}" class="product-img main-img" loading="lazy" onerror="this.src='${images[0]}'" />
              <img src="${p.images[1] || p.images[0]}" alt="${p.name}" class="product-img hover-img" loading="lazy" onerror="this.src='${p.images[0]}'" />
            </a>
            <div class="product-badge-stack">
              ${p.isNew ? `<span class="badge-gold">New Arrival</span>` : ''}
              ${p.isBestSeller ? `<span class="badge-rose">Best Seller</span>` : ''}
            </div>
            ${hasMultiplePhotos ? `<div class="product-angle-badge"><span>📸</span> 2 Angles</div>` : ''}
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
              <a href="product.html?id=${encodeURIComponent(p.id)}" target="_blank" class="btn-royal-primary" style="text-align:center; font-size:0.85rem; padding:0.6rem;">
                View Outfit Details →
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // 13. MAISON MULTI-LANGUAGE CONTROLLER (EN, HI, GU, PA, AR, FR)
  // ==========================================================================
  const maisonLangWrap = document.getElementById('maisonLangSelectorWrap');
  const maisonLangBtn = document.getElementById('maisonLangBtn');
  const maisonLangDropdown = document.getElementById('maisonLangDropdown');
  const maisonLangFlag = document.getElementById('maisonLangFlag');
  const maisonLangText = document.getElementById('maisonLangText');

  const LANG_FLAGS = {
    en: '🇮🇳',
    hi: '🇮🇳',
    gu: '🇮🇳',
    pa: '🇮🇳',
    ar: '🇦🇪',
    fr: '🇫🇷'
  };

  const LANG_CODES = {
    en: 'EN',
    hi: 'HI',
    gu: 'GU',
    pa: 'PA',
    ar: 'AR',
    fr: 'FR'
  };

  const TRANSLATIONS = {
    en: {
      concierge: '👑 Concierge Desk',
      cartLabel: 'Royal Bucket',
      searchPlaceholder: 'Search bespoke bridal lehengas, silk shararas, reception gowns...',
      addToBag: '✦ Add to Royal Shopping Bucket',
      buyNow: '⚡ 1-Click Bespoke Order (Fast Track)',
      saveWishlist: '🤍 Save to Wishlist',
      inWishlist: '❤️ In Wishlist',
      stylistWhatsApp: '💬 Stylist WhatsApp',
      checkDeliveryBtn: 'Check Delivery',
      pincodePlaceholder: 'Enter Pincode',
      stockStatus: '✓ Ready in Master Atelier Production',
      sizeGuideBtn: '📏 Measurement Guide',
      addBundleBtn: 'Add Complete Ensemble To Bucket',
      bundleHeading: 'The Complete Trousseau Ensemble — Master Stylist Curation',
      bundleSubtitle: 'Complete your celebration look with hand-matched heritage jewelry and an embroidered zari potli crafted by our senior atelier stylists.',
      specsHeading: 'Garment Architecture & Artisanal Specifications',
      specsSubtitle: 'Detailed weave density, inner shantoon silk lining, custom alteration margins, and couturier measurements.',
      reviewsHeading: 'Patron Reviews & Verified Bridal Testimonials',
      reviewsSubtitle: 'Read experiences from real brides and families celebrating grand celebrations in Riwaayat Royale couture.',
      recommendationsHeading: 'More from this Atelier',
      recommendationsSubtitle: 'Explore complementing silhouettes handcrafted by the same master artisanal workshop.',
      toastSwitch: 'Language updated to English'
    },
    hi: {
      concierge: '👑 दरबारी सहायता',
      cartLabel: 'शाही बकेट',
      searchPlaceholder: 'हस्तनिर्मित ब्राइडल लहंगे, रेशमी शरारा, रिसेप्शन गाउन खोजें...',
      addToBag: '✦ शाही शॉपिंग बकेट में जोड़ें',
      buyNow: '⚡ 1-क्लिक बेस्पोक ऑर्डर (फास्ट ट्रैक)',
      saveWishlist: '🤍 विशलिस्ट में सहेजें',
      inWishlist: '❤️ विशलिस्ट में शामिल',
      stylistWhatsApp: '💬 स्टाइलिस्ट व्हाट्सएप',
      checkDeliveryBtn: 'डिलीवरी जांचें',
      pincodePlaceholder: 'पिनकोड दर्ज करें',
      stockStatus: '✓ मास्टर अटेलियर उत्पादन में तैयार',
      sizeGuideBtn: '📏 माप गाइड',
      addBundleBtn: 'पूरा पहनावा बकेट में जोड़ें',
      bundleHeading: 'पूर्ण ब्राइडल पहनावा — मास्टर स्टाइलिस्ट संकलन',
      bundleSubtitle: 'हमारे वरिष्ठ स्टाइलिस्टों द्वारा हाथ से चुने गए कुंदन चोकर और ज़री पोटली के साथ अपना लुक पूरा करें।',
      specsHeading: 'वस्त्र वास्तुकला एवं कारीगरी विवरण',
      specsSubtitle: 'विस्तृत बुनाई घनत्व, शुद्ध शांतून सिल्क इनर अस्तर, 4-इंच कस्टम मार्जिन और दर्जी माप।',
      reviewsHeading: 'ग्राहकों की समीक्षाएं एवं दुल्हन प्रशंसापत्र',
      reviewsSubtitle: 'रिवायत रॉयल के वस्त्रों में अपनी खुशियां मनाने वाली दुल्हनों और परिवारों के वास्तविक अनुभव।',
      recommendationsHeading: 'इस अटेलियर से और अधिक डिजाइन',
      recommendationsSubtitle: 'इसी मास्टर कारीगर कार्यशाला द्वारा हस्तनिर्मित अन्य पूरक सिल्हूट देखें।',
      toastSwitch: 'भाषा बदलकर हिन्दी (Hindi) कर दी गई है'
    },
    gu: {
      concierge: '👑 કન્સિયર્જ ડેસ્ક',
      cartLabel: 'રોયલ બકેટ',
      searchPlaceholder: 'હાથવણાટ બ્રાઇડલ લહેંગા, સિલ્ક શરારા, ઇવનિંગ ગાઉન શોધો...',
      addToBag: '✦ રોયલ શોપિંગ બકેટમાં ઉમેરો',
      buyNow: '⚡ 1-ક્લિક બેસ્પોક ઓર્ડર (ફાસ્ટ ટ્રેક)',
      saveWishlist: '🤍 વિશલિસ્ટમાં ઉમેરો',
      inWishlist: '❤️ વિશલિસ્ટમાં છે',
      stylistWhatsApp: '💬 સ્ટાઇલિસ્ટ વ્હોટ્સએપ',
      checkDeliveryBtn: 'ડિલિવરી તપાસો',
      pincodePlaceholder: 'પિનકોડ દાખલ કરો',
      stockStatus: '✓ માસ્ટર અટેલિયર પ્રોડક્શનમાં તૈયાર',
      sizeGuideBtn: '📏 માપ ગાઇડ',
      addBundleBtn: 'સંપૂર્ણ સેટ બકેટમાં ઉમેરો',
      bundleHeading: 'સંપૂર્ણ બ્રાઇડલ પહેરવેશ — માસ્ટર સ્ટાઈલિસ્ટ ક્યુરેશન',
      bundleSubtitle: 'અમારા વરિષ્ઠ સ્ટાઈલિસ્ટ્સ દ્વારા પસંદ કરાયેલ કુંદન ચોકર અને ઝરી પોટલી સાથે તમારો લુક પૂર્ણ કરો.',
      specsHeading: 'વસ્ત્ર નિર્માણ અને કારીગરી વિશિષ્ટતાઓ',
      specsSubtitle: 'વિગતવાર વણાટ ઘનતા, શુદ્ધ શાંતૂન સિલ્ક અસ્તર, 4-ઇંચ ઓલ્ટરેશન માર્જિન અને માપ.',
      reviewsHeading: 'ગ્રાહક સમીક્ષાઓ અને બ્રાઇડલ અનુભવો',
      reviewsSubtitle: 'રિવાયત રોયલના વસ્ત્રો પહેરીને ઉજવણી કરનાર સાચા દુલ્હનો અને પરિવારોના અનુભવો.',
      recommendationsHeading: 'આ અટેલિયરની વધુ ડિઝાઇન્સ',
      recommendationsSubtitle: 'આ જ માસ્ટર કારીગરો દ્વારા હસ્તનિર્મિત અન્ય રોયલ આઉટફિટ્સ શોધો.',
      toastSwitch: 'ભાષા બદલીને ગુજરાતી (Gujarati) કરવામાં આવી છે'
    },
    pa: {
      concierge: '👑 ਸ਼ਾਹੀ ਸਹਾਇਤਾ',
      cartLabel: 'ਸ਼ਾਹੀ ਬਕੇਟ',
      searchPlaceholder: 'ਹੱਥੀਂ ਤਿਆਰ ਬ੍ਰਾਈਡਲ ਲਹਿੰਗੇ, ਰੇਸ਼ਮੀ ਸ਼ਰਾਰੇ, ਰਿਸੈਪਸ਼ਨ ਗਾਊਨ ਖੋਜੋ...',
      addToBag: '✦ ਸ਼ਾਹੀ ਸ਼ਾਪਿੰਗ ਬਕੇਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ',
      buyNow: '⚡ 1-ਕਲਿੱਕ ਬੇਸਪੋਕ ਆਰਡਰ (ਫਾਸਟ ਟਰੈਕ)',
      saveWishlist: '🤍 ਵਿਸ਼ਲਿਸਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ',
      inWishlist: '❤️ ਵਿਸ਼ਲਿਸਟ ਵਿੱਚ ਸ਼ਾਮਲ',
      stylistWhatsApp: '💬 ਸਟਾਈਲਿਸਟ ਵਟਸਐਪ',
      checkDeliveryBtn: 'ਡਿਲੀਵਰੀ ਜਾਂਚੋ',
      pincodePlaceholder: 'ਪਿੰਨਕੋਡ ਦਰਜ ਕਰੋ',
      stockStatus: '✓ ਮਾਸਟਰ ਅਟੈਲੀਅਰ ਉਤਪਾਦਨ ਵਿੱਚ ਤਿਆਰ',
      sizeGuideBtn: '📏 ਨਾਪ ਗਾਈਡ',
      addBundleBtn: 'ਪੂਰਾ ਸੈੱਟ ਬਕੇਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ',
      bundleHeading: 'ਸੰਪੂਰਨ ਸ਼ਾਹੀ ਪਹਿਰਾਵਾ — ਮਾਸਟਰ ਸਟਾਈਲਿਸਟ ਚੋਣ',
      bundleSubtitle: 'ਕੁੰਦਨ ਚੋਕਰ ਅਤੇ ਕਢਾਈ ਵਾਲੀ ਜ਼ਰੀ ਪੋਟਲੀ ਦੇ ਨਾਲ ਆਪਣਾ ਵਿਆਹ ਦਾ ਲੁੱਕ ਪੂਰਾ ਕਰੋ।',
      specsHeading: 'ਪੁਸ਼ਾਕ ਆਰਕੀਟੈਕਚਰ ਅਤੇ ਵੇਰਵੇ',
      specsSubtitle: 'ਸ਼ੁੱਧ ਸ਼ਾਨਤੂਨ ਰੇਸ਼ਮ ਅਸਤਰ, 4-ਇੰਚ ਕਸਟਮ ਮਾਰਜਿਨ ਅਤੇ ਮਾਸਟਰ ਦਰਜ਼ੀ ਨਾਪ।',
      reviewsHeading: 'ਗਾਹਕ ਸਮੀਖਿਆਵਾਂ ਅਤੇ ਲਾੜੀ ਪ੍ਰਸੰਸਾ ਪੱਤਰ',
      reviewsSubtitle: 'ਰਵਾਇਤ ਰਾਇਲ ਦੇ ਪਹਿਰਾਵੇ ਵਿੱਚ ਵਿਆਹ ਮਨਾਉਣ ਵਾਲੀਆਂ ਲਾੜੀਆਂ ਦੇ ਸੱਚੇ ਅਨੁਭਵ।',
      recommendationsHeading: 'ਇਸ ਅਟੈਲੀਅਰ ਤੋਂ ਹੋਰ ਪੁਸ਼ਾਕਾਂ',
      recommendationsSubtitle: 'ਇਸੇ ਮਾਸਟਰ ਕਾਰੀਗਰਾਂ ਦੁਆਰਾ ਹੱਥੀਂ ਤਿਆਰ ਕੀਤੇ ਗਏ ਹੋਰ ਸ਼ਾਹੀ ਡਿਜ਼ਾਈਨ।',
      toastSwitch: 'ਭਾਸ਼ਾ ਬਦਲ ਕੇ ਪੰਜਾਬੀ (Punjabi) ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ'
    },
    ar: {
      concierge: '👑 مكتب المساعدة الملكي',
      cartLabel: 'السلة الملكية',
      searchPlaceholder: 'ابحث عن فساتين الزفاف الهندية المصنوعة يدويًا، الشارارا، العبايات...',
      addToBag: '✦ أضف إلى سلة التسوق الملكية',
      buyNow: '⚡ طلب ملكي بنقرة واحدة (المسار السريع)',
      saveWishlist: '🤍 حفظ في قائمة الرغبات',
      inWishlist: '❤️ في قائمة الرغبات',
      stylistWhatsApp: '💬 استشارة المصمم عبر واتساب',
      checkDeliveryBtn: 'تحقق من التوصيل',
      pincodePlaceholder: 'الرمز البريدي',
      stockStatus: '✓ متوفر وجاهز في ورشة المشغل الملكي',
      sizeGuideBtn: '📏 دليل القياسات',
      addBundleBtn: 'أضف الطقم الكامل إلى السلة',
      bundleHeading: 'طقم الزفاف المتكامل — تنسيق كبار المصممين',
      bundleSubtitle: 'أكملي إطلالتك الاحتفالية مع طوق الكوندان الملكي وحقيبة البوتلي المزركشة يدويًا.',
      specsHeading: 'المواصفات الفنية وهندسة القماش',
      specsSubtitle: 'كثافة النسيج، بطانة حرير شانتون خالص، هامش تعديل 4 بوصات وقياسات مفصلة.',
      reviewsHeading: 'تقييمات العرائس وآراء الزبائن الموثقة',
      reviewsSubtitle: 'تجارب حقيقية من عرائس وعائلات احتفلت بأجمل اللحظات مع تصاميم ريوايات رويال.',
      recommendationsHeading: 'المزيد من هذا المشغل',
      recommendationsSubtitle: 'استكشف تصاميم مكملة صممتها نفس الورشة الحرفية المرموقة.',
      toastSwitch: 'تم تغيير اللغة إلى العربية (Arabic)'
    },
    fr: {
      concierge: '👑 Concierge Privé',
      cartLabel: 'Panier Royal',
      searchPlaceholder: 'Rechercher lehengas de mariée, shararas en soie, robes de réception...',
      addToBag: '✦ Ajouter au Panier Royal',
      buyNow: '⚡ Commande Sur-Mesure en 1-Clic',
      saveWishlist: '🤍 Ajouter aux Favoris',
      inWishlist: '❤️ Dans les Favoris',
      stylistWhatsApp: '💬 Styliste Privé WhatsApp',
      checkDeliveryBtn: 'Vérifier la Livraison',
      pincodePlaceholder: 'Code Postal',
      stockStatus: '✓ Prêt en Confection Haute Couture',
      sizeGuideBtn: '📏 Guide des Mesures',
      addBundleBtn: 'Ajouter l’Ensemble au Panier',
      bundleHeading: 'Le Trousseau Nuptial Complet — Sélection Styliste',
      bundleSubtitle: 'Complétez votre silhouette avec la parure ras-du-cou Kundan et l’aumônière brodée en fil d’or.',
      specsHeading: 'Architecture du Vêtement & Spécifications',
      specsSubtitle: 'Densité du tissage, doublure en pure soie shantoon, marge de retouche de 4 pouces et patronage couturier.',
      reviewsHeading: 'Avis des Mariées & Témoignages Authentifiés',
      reviewsSubtitle: 'Découvrez les retours de véritables mariées ayant célébré leurs noces parées de créations Riwaayat Royale.',
      recommendationsHeading: 'Plus de cet Atelier',
      recommendationsSubtitle: 'Découvrez les créations coordonnées confectionnées au sein du même atelier d’art.',
      toastSwitch: 'Langue changée en Français'
    }
  };

  const applyLanguage = (lang, showNotification = false) => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // 1. Update Button Flag & Code
    if (maisonLangFlag) maisonLangFlag.textContent = LANG_FLAGS[lang] || '🌐';
    if (maisonLangText) maisonLangText.textContent = LANG_CODES[lang] || 'EN';

    // 2. Update active option in dropdown
    if (maisonLangDropdown) {
      maisonLangDropdown.querySelectorAll('.maison-lang-opt').forEach(opt => {
        if (opt.dataset.lang === lang) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });
    }

    // 3. Update Key Header Labels
    const conciergeLabel = document.getElementById('conciergeDeskLabel');
    if (conciergeLabel) conciergeLabel.textContent = t.concierge;

    const searchInput = document.getElementById('amazonSearchInput');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;

    const cartNavBtn = document.getElementById('cartNavBtn');
    if (cartNavBtn) {
      const spanLabel = cartNavBtn.querySelector('span:not(.maison-bucket-badge)');
      if (spanLabel) spanLabel.textContent = t.cartLabel;
    }

    // 4. Update PDP Buttons & Actions
    if (addBagBtn) {
      addBagBtn.innerHTML = `<span>${t.addToBag}</span>`;
    }
    if (buyNowBtn) {
      buyNowBtn.innerHTML = `<span>${t.buyNow}</span>`;
    }
    if (sizeGuideBtn) {
      sizeGuideBtn.innerHTML = t.sizeGuideBtn;
    }

    const pinBtn = document.getElementById('pdpPincodeCheckBtn');
    if (pinBtn) pinBtn.textContent = t.checkDeliveryBtn;

    const pinInput = document.getElementById('pdpPincodeInput');
    if (pinInput) pinInput.placeholder = t.pincodePlaceholder;

    const stockEl = document.querySelector('.pdp-stock-status');
    if (stockEl) stockEl.textContent = t.stockStatus;

    // 5. Update Headings
    const bundleHeadingEl = document.querySelector('#bundleSection h3');
    if (bundleHeadingEl) bundleHeadingEl.textContent = t.bundleHeading;
    const bundleSubEl = document.querySelector('#bundleSection p');
    if (bundleSubEl) bundleSubEl.textContent = t.bundleSubtitle;
    const addBundleBtnEl = document.getElementById('addBundleBtn');
    if (addBundleBtnEl) addBundleBtnEl.textContent = t.addBundleBtn;

    const specsHeadingEl = document.querySelector('.pdp-specs-section h3');
    if (specsHeadingEl) specsHeadingEl.textContent = t.specsHeading;
    const specsSubEl = document.querySelector('.pdp-specs-section p');
    if (specsSubEl) specsSubEl.textContent = t.specsSubtitle;

    const reviewsHeadingEl = document.querySelector('#reviewsSection h3');
    if (reviewsHeadingEl) reviewsHeadingEl.textContent = t.reviewsHeading;
    const reviewsSubEl = document.querySelector('#reviewsSection p');
    if (reviewsSubEl) reviewsSubEl.textContent = t.reviewsSubtitle;

    const recsHeadingEl = document.querySelector('.section .section-title');
    if (recsHeadingEl) recsHeadingEl.textContent = t.recommendationsHeading;
    const recsSubEl = document.querySelector('.section .section-description');
    if (recsSubEl) recsSubEl.textContent = t.recommendationsSubtitle;

    // Persist Language
    localStorage.setItem('rr_language', lang);

    // Toast alert on change
    if (showNotification && window.royalApp) {
      window.royalApp.showToast(`🌐 ${t.toastSwitch}`);
    }
  };

  // Toggle Dropdown
  if (maisonLangBtn && maisonLangWrap) {
    maisonLangBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      maisonLangWrap.classList.toggle('open');
    });
  }

  // Option Click
  if (maisonLangDropdown) {
    maisonLangDropdown.querySelectorAll('.maison-lang-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedLang = opt.dataset.lang || 'en';
        applyLanguage(selectedLang, true);
        if (maisonLangWrap) maisonLangWrap.classList.remove('open');
      });
    });
  }

  // Close when clicking outside or pressing Escape
  document.addEventListener('click', (e) => {
    if (maisonLangWrap && !maisonLangWrap.contains(e.target)) {
      maisonLangWrap.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && maisonLangWrap) {
      maisonLangWrap.classList.remove('open');
    }
  });

  // Initialize saved language
  const savedLang = localStorage.getItem('rr_language') || 'en';
  applyLanguage(savedLang, false);

  // =========================================================================
  // 13. INTERACTIVE ATELIER LOCATIONS & DELIVERY LOGISTICS MAP CONTROLLER
  // =========================================================================
  const LOCATIONS_DATA = {
    mumbai: {
      id: 'mumbai',
      city: 'Mumbai',
      badge: 'Central Flagship',
      title: 'Mumbai Flagship Atelier & Central Vault',
      address: 'Riwaayat Royale Mansion, Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
      dispatch: 'Next-Day (24h) Hand Courier',
      transit: 'Armored Trunk + Tailor Escort',
      fitting: 'In-Salon & At-Home Available',
      hours: '11:00 AM – 8:30 PM Daily',
      region: 'india',
      pincode: '400001'
    },
    delhi: {
      id: 'delhi',
      city: 'Delhi NCR',
      badge: 'Heritage Salon',
      title: 'New Delhi Mehrauli Heritage Atelier',
      address: 'Kalka Das Marg, Near Qutub Minar, Mehrauli, New Delhi 110030',
      dispatch: 'Same-Day / 24h Express Dispatch',
      transit: 'Bespoke Trousseau Casket',
      fitting: 'Private Bridal Suite Fitting',
      hours: '10:30 AM – 8:00 PM Daily',
      region: 'india',
      pincode: '110001'
    },
    jaipur: {
      id: 'jaipur',
      city: 'Jaipur',
      badge: 'Master Weavery',
      title: 'Jaipur Johari Palace Master Weavery',
      address: 'M.I. Road, Near Johari Bazaar, Jaipur, Rajasthan 302001',
      dispatch: 'Direct From Master Loom (24-48h)',
      transit: 'Heritage Lacquer Storage Box',
      fitting: 'Master Zari Craftsman Fitting',
      hours: '11:00 AM – 7:30 PM (Closed Tue)',
      region: 'india',
      pincode: '302001'
    },
    kolkata: {
      id: 'kolkata',
      city: 'Kolkata',
      badge: 'Bespoke Salon',
      title: 'Kolkata Camac Street Salon',
      address: 'Park Centre, Camac Street, Elgin, Kolkata, West Bengal 700016',
      dispatch: '48h Priority Air Transit',
      transit: 'Silk Trousseau Sealed Trunk',
      fitting: 'Senior Draping Stylist Fitting',
      hours: '11:00 AM – 8:00 PM Daily',
      region: 'india',
      pincode: '700001'
    },
    bengaluru: {
      id: 'bengaluru',
      city: 'Bengaluru',
      badge: 'Tech & Luxury Salon',
      title: 'Bengaluru Lavelle Road Salon',
      address: 'Vittal Mallya Road, Near UB City, Lavelle Road, Bengaluru 560001',
      dispatch: 'Next-Day Express Air Courier',
      transit: 'Climate-Controlled Vault Case',
      fitting: '3D Silhouette & Live Tailor Fitting',
      hours: '10:30 AM – 8:30 PM Daily',
      region: 'india',
      pincode: '560001'
    },
    hyderabad: {
      id: 'hyderabad',
      city: 'Hyderabad',
      badge: 'Nizami Couture Salon',
      title: 'Hyderabad Banjara Hills Salon',
      address: 'Road No. 10, Banjara Hills, Hyderabad, Telangana 500034',
      dispatch: '24-48h White-Glove Transit',
      transit: 'Handcrafted Velvet Keepsake Trunk',
      fitting: 'Royal Begum Bridal Suite Fitting',
      hours: '11:00 AM – 8:00 PM Daily',
      region: 'india',
      pincode: '500001'
    },
    dubai: {
      id: 'dubai',
      city: 'Dubai',
      badge: 'International Embassy',
      title: 'Dubai Downtown Fashion Avenue Flagship',
      address: 'Fashion Avenue, The Dubai Mall, Downtown Dubai, UAE',
      dispatch: '48h DHL Royal Gold Express',
      transit: 'Customs-Cleared Armored Trunk',
      fitting: 'VIP Private Majlis Fitting',
      hours: '10:00 AM – 10:00 PM Daily',
      region: 'middle-east',
      pincode: '00000'
    },
    london: {
      id: 'london',
      city: 'London',
      badge: 'European Atelier',
      title: 'London Mayfair Couture Salon',
      address: '42 Old Bond Street, Mayfair, London W1S 4QR, United Kingdom',
      dispatch: '3 Business Days Worldwide Express',
      transit: 'Diplomatic Courier Air Pouch',
      fitting: 'Savile Row Trained Master Draping',
      hours: '10:00 AM – 6:30 PM (Mon-Sat)',
      region: 'uk-europe',
      pincode: 'W1S 4QR'
    },
    newyork: {
      id: 'newyork',
      city: 'New York',
      badge: 'Americas Embassy',
      title: 'New York 5th Avenue Couture Suite',
      address: '745 Fifth Avenue, Suite 1400, New York, NY 10151, USA',
      dispatch: '3-4 Business Days DHL Express',
      transit: 'Tamper-Evident Bridal Vault Cask',
      fitting: 'Manhattan Haute Couture Salon',
      hours: '10:00 AM – 7:00 PM (By Appointment)',
      region: 'north-america',
      pincode: '10151'
    }
  };

  const deliveryMapContainer = document.getElementById('deliveryMapContainer');
  const activeLocationCard = document.getElementById('activeLocationCard');
  const locCardTitle = document.getElementById('locCardTitle');
  const locCardAddress = document.getElementById('locCardAddress');
  const locCardBadge = document.getElementById('locCardBadge');
  const locCardDispatch = document.getElementById('locCardDispatch');
  const locCardTransit = document.getElementById('locCardTransit');
  const locCardFitting = document.getElementById('locCardFitting');
  const locCardHours = document.getElementById('locCardHours');
  const headerDeliveryCityVal = document.getElementById('headerDeliveryCityVal');
  const deliveryLookupInput = document.getElementById('deliveryLookupInput');
  const deliveryLookupForm = document.getElementById('deliveryLookupForm');
  const cityQuickPills = document.querySelectorAll('.city-quick-pill');
  const mapPins = document.querySelectorAll('.map-pin');
  const regionTabs = document.querySelectorAll('.delivery-tab-btn');

  const selectDeliveryLocation = (locKey, syncPincode = true) => {
    const loc = LOCATIONS_DATA[locKey];
    if (!loc) return;

    // 1. Update Map Pins
    mapPins.forEach(pin => {
      if (pin.dataset.loc === locKey) {
        pin.classList.add('active');
      } else {
        pin.classList.remove('active');
      }
    });

    // 2. Update City Quick Pills
    cityQuickPills.forEach(pill => {
      if (pill.dataset.loc === locKey) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // 3. Update Detail Card
    if (locCardTitle) locCardTitle.textContent = loc.title;
    if (locCardAddress) locCardAddress.textContent = loc.address;
    if (locCardBadge) locCardBadge.textContent = loc.badge;
    if (locCardDispatch) locCardDispatch.textContent = loc.dispatch;
    if (locCardTransit) locCardTransit.textContent = loc.transit;
    if (locCardFitting) locCardFitting.textContent = loc.fitting;
    if (locCardHours) locCardHours.textContent = loc.hours;

    // 4. Update Header Location Indicator
    if (headerDeliveryCityVal) {
      headerDeliveryCityVal.textContent = `${loc.city} ${loc.pincode ? loc.pincode : ''}`.trim();
    }

    // 5. Sync with Buy Box Pincode
    if (syncPincode && loc.pincode && /^\d{6}$/.test(loc.pincode)) {
      const buyBoxPinInput = document.getElementById('pdpPincodeInput');
      if (buyBoxPinInput) {
        buyBoxPinInput.value = loc.pincode;
        if (typeof checkPincode === 'function') checkPincode();
      }
    }

    // 6. Sync lookup input text
    if (deliveryLookupInput) {
      deliveryLookupInput.value = loc.pincode && /^\d{6}$/.test(loc.pincode) ? loc.pincode : loc.city;
    }
  };

  // Wire Map Pin Clicks
  mapPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const locKey = pin.dataset.loc;
      if (locKey) selectDeliveryLocation(locKey, true);
    });
  });

  // Wire City Quick Pills Clicks
  cityQuickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const locKey = pill.dataset.loc;
      if (locKey) selectDeliveryLocation(locKey, true);
    });
  });

  // Wire Region Filter Tabs
  regionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      regionTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const region = tab.dataset.region || 'all';

      let firstMatched = null;
      mapPins.forEach(pin => {
        const pinRegion = pin.dataset.region;
        if (region === 'all' || pinRegion === region) {
          pin.style.display = 'block';
          if (!firstMatched) firstMatched = pin.dataset.loc;
        } else {
          pin.style.display = 'none';
        }
      });

      if (firstMatched) {
        selectDeliveryLocation(firstMatched, false);
      }
    });
  });

  // Wire Delivery Lookup Search / Submission
  const handleDeliverySearch = () => {
    if (!deliveryLookupInput) return;
    const query = deliveryLookupInput.value.trim().toLowerCase();
    if (!query) return;

    // Check direct pincode prefix or city match
    let matchedKey = null;
    if (query.startsWith('400') || query.includes('mumbai') || query.includes('bombay') || query.includes('thane')) {
      matchedKey = 'mumbai';
    } else if (query.startsWith('110') || query.includes('delhi') || query.includes('noida') || query.includes('gurgaon') || query.includes('gurugram')) {
      matchedKey = 'delhi';
    } else if (query.startsWith('302') || query.includes('jaipur') || query.includes('rajasthan')) {
      matchedKey = 'jaipur';
    } else if (query.startsWith('560') || query.includes('bengaluru') || query.includes('bangalore')) {
      matchedKey = 'bengaluru';
    } else if (query.startsWith('700') || query.includes('kolkata') || query.includes('calcutta')) {
      matchedKey = 'kolkata';
    } else if (query.startsWith('500') || query.includes('hyderabad') || query.includes('secunderabad')) {
      matchedKey = 'hyderabad';
    } else if (query.includes('dubai') || query.includes('uae') || query.includes('abu dhabi')) {
      matchedKey = 'dubai';
    } else if (query.includes('london') || query.includes('uk') || query.includes('w1s')) {
      matchedKey = 'london';
    } else if (query.includes('york') || query.includes('ny') || query.includes('10151') || query.includes('usa')) {
      matchedKey = 'newyork';
    }

    if (matchedKey) {
      selectDeliveryLocation(matchedKey, true);
      if (window.royalApp) {
        window.royalApp.showToast(`📍 Located Nearest Atelier Salon: ${LOCATIONS_DATA[matchedKey].city}`);
      }
    } else {
      // Custom Indian pincode or global destination
      if (/^\d{6}$/.test(query)) {
        if (locCardTitle) locCardTitle.textContent = `Express Domestic Delivery to Pincode ${query}`;
        if (locCardAddress) locCardAddress.textContent = `Dispatched directly from Central Vault to Postal Zone ${query} via BlueDart Apex Air Couture`;
        if (locCardDispatch) locCardDispatch.textContent = 'Guaranteed 2-3 Business Days Delivery';
        if (locCardTransit) locCardTransit.textContent = 'Armored Sealed Wardrobe Trunk';
        if (locCardFitting) locCardFitting.textContent = 'Virtual Master Tailor Video Fitting Included';
        if (headerDeliveryCityVal) headerDeliveryCityVal.textContent = `PIN ${query}`;
        
        const buyBoxPinInput = document.getElementById('pdpPincodeInput');
        if (buyBoxPinInput) {
          buyBoxPinInput.value = query;
          if (typeof checkPincode === 'function') checkPincode();
        }

        if (window.royalApp) {
          window.royalApp.showToast(`✓ Express Delivery available for Pincode ${query}`);
        }
      } else {
        if (window.royalApp) {
          window.royalApp.showToast(`✈️ Worldwide bespoke shipping confirmed for: ${query}`);
        }
      }
    }
  };

  if (deliveryLookupForm) {
    deliveryLookupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleDeliverySearch();
    });
  }

  const deliveryLookupSubmitBtn = document.getElementById('deliveryLookupSubmitBtn');
  if (deliveryLookupSubmitBtn) {
    deliveryLookupSubmitBtn.addEventListener('click', handleDeliverySearch);
  }

  // Header quick nav button
  const maisonDeliveryBtn = document.getElementById('maisonDeliveryBtn');
  if (maisonDeliveryBtn) {
    maisonDeliveryBtn.addEventListener('click', () => {
      const targetSec = document.getElementById('deliveryMapSection');
      if (targetSec) targetSec.scrollIntoView({ behavior: 'smooth' });
    });
  }
});


