/**
 * UI Renderer & Event Controller Kasir POS Sate Klatak Mbak Lala
 */

// Helper to format currency to Indonesian Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number || 0).replace(/\s+/g, ' ');
}

// Category Food Icon Helper
function getCategoryIconSvg(category) {
  switch (category) {
    case 'sate':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M8 5h8M7 10h10M8 15h8"/></svg>`;
    case 'daging':
    case 'tulang':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 8v2M12 5v5M17 8v2"/></svg>`;
    case 'jeroan':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="m10 15 5-3-5-3v6Z"/></svg>`;
    case 'goreng':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M7 12a5 5 0 0 1 10 0M4 17h16M7 21h10"/></svg>`;
    case 'nasi':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11c0 4.97 4.03 9 9 9s9-4.03 9-9H3Z"/><path d="M12 2v5M8 4l2 3M16 4l-2 3"/></svg>`;
    case 'ayam_bebek':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
    case 'minum':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`;
    default:
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 21a6 6 0 0 0-12 0"/><circle cx="12" cy="11" r="4"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`;
  }
}

class PosUI {
  constructor(store) {
    this.store = store;
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.editingCartItemId = null;
    this.selectedPaymentMethod = 'cash';

    this.initDOMElements();
    this.bindEvents();
    this.render();

    // Start Live Clock
    this.startClock();
  }

  initDOMElements() {
    // Categories & Products
    this.categoryPillsContainer = document.getElementById('categoryPills');
    this.productsGrid = document.getElementById('productsGrid');
    this.searchInput = document.getElementById('searchInput');
    this.searchClearBtn = document.getElementById('searchClearBtn');
    this.catalogCountBadge = document.getElementById('catalogCountBadge');

    // Cart Elements
    this.cartItemsContainer = document.getElementById('cartItemsContainer');
    this.customerNameInput = document.getElementById('customerNameInput');
    this.tableSelectorBtn = document.getElementById('tableSelectorBtn');
    this.tableNumberText = document.getElementById('tableNumberText');
    this.orderTypeDineIn = document.getElementById('orderTypeDineIn');
    this.orderTypeTakeaway = document.getElementById('orderTypeTakeaway');
    
    // Billing Summary
    this.subtotalAmount = document.getElementById('subtotalAmount');
    this.discountRow = document.getElementById('discountRow');
    this.discountAmount = document.getElementById('discountAmount');
    this.taxRow = document.getElementById('taxRow');
    this.taxAmount = document.getElementById('taxAmount');
    this.grandTotalAmount = document.getElementById('grandTotalAmount');
    
    // Action Buttons
    this.btnHoldOrder = document.getElementById('btnHoldOrder');
    this.btnCheckout = document.getElementById('btnCheckout');
    this.savedOrdersCountBadge = document.getElementById('savedOrdersCountBadge');
    this.btnSavedOrders = document.getElementById('btnSavedOrders');
    this.btnHistory = document.getElementById('btnHistory');
    this.btnReports = document.getElementById('btnReports');

    // Mobile Elements
    this.mobileCartBar = document.getElementById('mobileCartBar');
    this.mobileCartPill = document.getElementById('mobileCartPill');
    this.mobileCartCount = document.getElementById('mobileCartCount');
    this.mobileCartTotal = document.getElementById('mobileCartTotal');
    this.mobileCartBackdrop = document.getElementById('mobileCartBackdrop');
    this.cartPanel = document.getElementById('cartPanel');

    // Cashier Profile Elements
    this.btnCashierProfile = document.getElementById('btnCashierProfile');
    this.headerCashierAvatar = document.getElementById('headerCashierAvatar');
    this.headerCashierInitials = document.getElementById('headerCashierInitials');
    this.headerCashierPhoto = document.getElementById('headerCashierPhoto');
    this.headerCashierName = document.getElementById('headerCashierName');
    
    // Modals
    this.modalPayment = document.getElementById('modalPayment');
    this.modalReceipt = document.getElementById('modalReceipt');
    this.modalNotes = document.getElementById('modalNotes');
    this.modalTables = document.getElementById('modalTables');
    this.modalSavedOrders = document.getElementById('modalSavedOrders');
    this.modalHistory = document.getElementById('modalHistory');
    this.modalReports = document.getElementById('modalReports');
    this.modalCashierProfile = document.getElementById('modalCashierProfile');
    this.modalCashierImgPreview = document.getElementById('modalCashierImgPreview');
    this.modalCashierInitials = document.getElementById('modalCashierInitials');
    this.cashierPhotoInput = document.getElementById('cashierPhotoInput');
    this.btnRemoveCashierPhoto = document.getElementById('btnRemoveCashierPhoto');
    this.cashierNameInputModal = document.getElementById('cashierNameInput');
    this.btnSaveCashierProfile = document.getElementById('btnSaveCashierProfile');
    this.tempCashierPhoto = null;
  }

  bindEvents() {
    // Re-render when store updates
    this.store.subscribe(() => {
      this.renderCart();
      this.renderProducts();
      this.updateCounters();
      this.renderCashierHeader();
    });

    // Search Input
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      if (this.searchQuery.length > 0) {
        this.searchClearBtn.classList.add('visible');
      } else {
        this.searchClearBtn.classList.remove('visible');
      }
      this.renderProducts();
    });

    this.searchClearBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.searchQuery = '';
      this.searchClearBtn.classList.remove('visible');
      this.renderProducts();
      this.searchInput.focus();
    });

    // Customer Name Change
    this.customerNameInput.addEventListener('change', (e) => {
      this.store.setCustomerName(e.target.value);
    });

    // Order Type Toggle
    this.orderTypeDineIn.addEventListener('click', () => {
      this.orderTypeDineIn.classList.add('active');
      this.orderTypeTakeaway.classList.remove('active');
      this.store.setOrderType('dine_in');
    });

    this.orderTypeTakeaway.addEventListener('click', () => {
      this.orderTypeTakeaway.classList.add('active');
      this.orderTypeDineIn.classList.remove('active');
      this.store.setOrderType('takeaway');
    });

    // Table Selector Modal Trigger
    this.tableSelectorBtn.addEventListener('click', () => {
      this.openTableModal();
    });

    // Hold Order Action
    this.btnHoldOrder.addEventListener('click', () => {
      const res = this.store.holdCurrentOrder();
      if (res.success) {
        notify.success(`Pesanan ${res.order.tableNumber} atas nama "${res.order.customerName}" berhasil disimpan ke daftar pesanan.`, 'Pesanan Disimpan');
        this.closeMobileCart();
      } else {
        notify.warning(res.message, 'Peringatan');
      }
    });

    // Checkout Action (Open Payment Modal)
    this.btnCheckout.addEventListener('click', () => {
      if (this.store.cart.length === 0) {
        notify.warning('Keranjang belanja masih kosong. Silakan pilih menu terlebih dahulu.', 'Keranjang Kosong');
        return;
      }
      this.openPaymentModal();
    });

    // Saved Orders Button
    this.btnSavedOrders.addEventListener('click', () => {
      this.openSavedOrdersModal();
    });

    // History Button
    this.btnHistory.addEventListener('click', () => {
      this.openHistoryModal();
    });

    // Reports Button
    this.btnReports.addEventListener('click', () => {
      this.openReportsModal();
    });

    // Mobile Bottom Bar View Cart Click
    this.mobileCartPill.addEventListener('click', () => {
      this.openMobileCart();
    });

    this.mobileCartBackdrop.addEventListener('click', () => {
      this.closeMobileCart();
    });

    // Payment Method Switching
    document.querySelectorAll('.payment-method-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.payment-method-pill').forEach(p => p.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        this.selectedPaymentMethod = target.dataset.method;
        this.updatePaymentModalView();
      });
    });

    // Toggle Full QRIS Poster in Payment Modal
    const btnToggleQris = document.getElementById('btnToggleFullQrisPoster');
    const fullQrisBox = document.getElementById('qrisFullPosterBox');
    const qrisBtnText = document.getElementById('qrisToggleBtnText');
    if (btnToggleQris && fullQrisBox) {
      btnToggleQris.addEventListener('click', () => {
        const isHidden = fullQrisBox.style.display === 'none';
        fullQrisBox.style.display = isHidden ? 'block' : 'none';
        if (qrisBtnText) {
          qrisBtnText.innerText = isHidden ? 'Sembunyikan Poster QRIS' : 'Lihat Poster Resmi QRIS';
        }
      });
    }

    // Cash Input Listener for Auto Change Calculation
    const cashInput = document.getElementById('cashReceivedInput');
    if (cashInput) {
      cashInput.addEventListener('input', () => {
        this.calculateCashChange();
      });
    }

    // Modal Close Buttons
    document.querySelectorAll('.modal-close-btn, .btn-modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
      });
    });

    // Cashier Profile Modal Trigger
    if (this.btnCashierProfile) {
      this.btnCashierProfile.addEventListener('click', () => {
        this.openCashierProfileModal();
      });
    }

    // Cashier Photo Upload (FileReader to Base64)
    if (this.cashierPhotoInput) {
      this.cashierPhotoInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            notify.warning('Ukuran file foto maksimal adalah 2 MB.', 'Foto Terlalu Besar');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            this.tempCashierPhoto = event.target.result;
            if (this.modalCashierImgPreview) {
              this.modalCashierImgPreview.src = this.tempCashierPhoto;
              this.modalCashierImgPreview.style.display = 'block';
            }
            if (this.modalCashierInitials) {
              this.modalCashierInitials.style.display = 'none';
            }
            notify.success('Foto profil berhasil diunggah. Klik "Simpan Profil" untuk menerapkan.', 'Foto Terunggah');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Remove Cashier Photo Button
    if (this.btnRemoveCashierPhoto) {
      this.btnRemoveCashierPhoto.addEventListener('click', () => {
        this.tempCashierPhoto = null;
        if (this.cashierPhotoInput) this.cashierPhotoInput.value = '';
        if (this.modalCashierImgPreview) this.modalCashierImgPreview.style.display = 'none';
        if (this.modalCashierInitials) {
          this.modalCashierInitials.style.display = 'block';
          const name = (this.cashierNameInputModal && this.cashierNameInputModal.value) || 'Mbak Lala';
          this.modalCashierInitials.innerText = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ML';
        }
        notify.info('Foto kasir telah dihapus.', 'Foto Dihapus');
      });
    }

    // Live update initials preview on typing name
    if (this.cashierNameInputModal) {
      this.cashierNameInputModal.addEventListener('input', (e) => {
        if (!this.tempCashierPhoto && this.modalCashierInitials) {
          const val = e.target.value.trim() || 'K';
          const initials = val.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'K';
          this.modalCashierInitials.innerText = initials;
        }
      });
    }

    // Save Cashier Profile Button
    if (this.btnSaveCashierProfile) {
      this.btnSaveCashierProfile.addEventListener('click', () => {
        const newName = (this.cashierNameInputModal && this.cashierNameInputModal.value.trim()) || 'Mbak Lala';
        this.store.updateCashierProfile(newName, this.tempCashierPhoto);
        this.renderCashierHeader();
        this.closeAllModals();
        notify.success(`Profil kasir "${newName}" berhasil diperbarui.`, 'Profil Disimpan');
        sound.playTap();
      });
    }
  }

  render() {
    this.renderCashierHeader();
    this.renderCategories();
    this.renderProducts();
    this.renderCart();
    this.updateCounters();
  }

  renderCashierHeader() {
    const name = this.store.settings.cashierName || 'Mbak Lala';
    const photo = this.store.settings.cashierPhoto;
    if (this.headerCashierName) {
      this.headerCashierName.innerText = name;
    }
    
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ML';
    
    if (photo && this.headerCashierPhoto) {
      this.headerCashierPhoto.src = photo;
      this.headerCashierPhoto.style.display = 'block';
      if (this.headerCashierInitials) this.headerCashierInitials.style.display = 'none';
    } else {
      if (this.headerCashierPhoto) this.headerCashierPhoto.style.display = 'none';
      if (this.headerCashierInitials) {
        this.headerCashierInitials.style.display = 'block';
        this.headerCashierInitials.innerText = initials;
      }
    }
  }

  openCashierProfileModal() {
    const currentName = this.store.settings.cashierName || 'Mbak Lala';
    const currentPhoto = this.store.settings.cashierPhoto;
    this.tempCashierPhoto = currentPhoto;

    if (this.cashierNameInputModal) {
      this.cashierNameInputModal.value = currentName;
    }

    const initials = currentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ML';

    if (currentPhoto && this.modalCashierImgPreview) {
      this.modalCashierImgPreview.src = currentPhoto;
      this.modalCashierImgPreview.style.display = 'block';
      if (this.modalCashierInitials) this.modalCashierInitials.style.display = 'none';
    } else {
      if (this.modalCashierImgPreview) this.modalCashierImgPreview.style.display = 'none';
      if (this.modalCashierInitials) {
        this.modalCashierInitials.style.display = 'block';
        this.modalCashierInitials.innerText = initials;
      }
    }

    if (this.modalCashierProfile) {
      this.modalCashierProfile.classList.add('active');
    }
  }

  // --- Clock ---
  startClock() {
    const clockElem = document.getElementById('liveClock');
    const update = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      if (clockElem) {
        clockElem.innerText = `${hours}:${mins}`;
      }
    };
    update();
    setInterval(update, 1000);
  }

  // --- Category Pills ---
  renderCategories() {
    this.categoryPillsContainer.innerHTML = '';
    
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `category-pill ${this.currentCategory === cat.id ? 'active' : ''}`;
      
      let count = 0;
      if (cat.id === 'all') {
        count = this.store.menu.length;
      } else {
        count = this.store.menu.filter(m => m.category === cat.id).length;
      }

      btn.innerHTML = `
        <span>${cat.name}</span>
        <span style="font-size:0.72rem; opacity:0.8;">(${count})</span>
      `;

      btn.addEventListener('click', () => {
        this.currentCategory = cat.id;
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        sound.playTap();
        this.renderProducts();
      });

      this.categoryPillsContainer.appendChild(btn);
    });
  }

  // --- Product Cards ---
  renderProducts() {
    this.productsGrid.innerHTML = '';

    let filtered = this.store.menu;

    // Filter by category
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.currentCategory);
    }

    // Filter by search
    if (this.searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(this.searchQuery) ||
        (item.description && item.description.toLowerCase().includes(this.searchQuery))
      );
    }

    if (this.catalogCountBadge) {
      this.catalogCountBadge.innerText = `${filtered.length} Menu`;
    }

    if (filtered.length === 0) {
      this.productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px; color:var(--text-light);"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <h4 style="font-weight:700; color:var(--text-main); margin-bottom:4px;">Menu Tidak Ditemukan</h4>
          <p style="font-size:0.85rem;">Tidak ada produk yang cocok dengan pencarian "${this.searchQuery}".</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const qtyInCart = this.store.getItemQtyInCart(item.id);
      const isCartActive = qtyInCart > 0;

      const card = document.createElement('div');
      card.className = `product-card ${isCartActive ? 'in-cart' : ''} ${!item.available ? 'out-of-stock' : ''}`;
      
      // Placeholder image box as requested: "untuk gambar menu nya di kosongkan dulu saja"
      const categoryIcon = getCategoryIconSvg(item.category);

      card.innerHTML = `
        ${isCartActive ? `<div class="card-cart-badge">${qtyInCart}</div>` : ''}
        ${!item.available ? `<div class="badge-out-of-stock">HABIS</div>` : ''}

        <div class="product-image-container">
          <div class="placeholder-art">
            <div class="placeholder-icon">
              ${categoryIcon}
            </div>
            <span class="placeholder-text">Menu Klatak</span>
          </div>
          <span class="card-category-tag">${item.category.replace('_', ' ')}</span>
        </div>

        <div class="product-card-body">
          <h3 class="product-name" title="${item.name}">${item.name}</h3>
          <div class="product-price-row">
            <span class="product-price">${formatRupiah(item.price)}</span>
            <button class="btn-quick-add" title="Tambah ke Pesanan" aria-label="Tambah ${item.name}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5v14"/></svg>
            </button>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (!item.available) return;
        this.store.addToCart(item.id);
      });

      this.productsGrid.appendChild(card);
    });
  }

  // --- Cart Rendering ---
  renderCart() {
    this.cartItemsContainer.innerHTML = '';
    const cart = this.store.cart;
    const calc = this.store.getCalculation();

    // Update customer name & table badge
    if (this.customerNameInput && document.activeElement !== this.customerNameInput) {
      this.customerNameInput.value = this.store.activeOrder.customerName || 'Mira Workman';
    }
    if (this.tableNumberText) {
      this.tableNumberText.innerText = this.store.activeOrder.tableNumber || 'Meja 01';
    }

    if (cart.length === 0) {
      this.cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h3>Keranjang Masih Kosong</h3>
          <p>Pilih menu sate klatak, tongseng, atau minuman dari daftar di samping untuk menambahkan.</p>
        </div>
      `;
      this.btnHoldOrder.disabled = true;
      this.btnCheckout.disabled = true;
    } else {
      this.btnHoldOrder.disabled = false;
      this.btnCheckout.disabled = false;

      cart.forEach(item => {
        const itemElem = document.createElement('div');
        itemElem.className = 'cart-item';

        itemElem.innerHTML = `
          <div class="cart-item-header">
            <span class="cart-item-title">
              ${item.name} <span class="cart-item-qty-badge">(${item.qty}x)</span>
            </span>
            <span class="cart-item-price">${formatRupiah(item.subtotal)}</span>
          </div>

          ${item.notes ? `
            <div class="cart-item-notes">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Catatan: ${item.notes}</span>
            </div>
          ` : ''}

          <div class="cart-item-actions">
            <button class="item-action-btn-note" data-id="${item.cartItemId}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>${item.notes ? 'Ubah Catatan' : '+ Catatan'}</span>
            </button>

            <div class="qty-stepper">
              <button class="qty-btn qty-minus" data-id="${item.cartItemId}">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn qty-plus" data-id="${item.cartItemId}">+</button>
            </div>
          </div>
        `;

        // Stepper events
        itemElem.querySelector('.qty-minus').addEventListener('click', (e) => {
          e.stopPropagation();
          this.store.updateItemQty(item.cartItemId, -1);
        });

        itemElem.querySelector('.qty-plus').addEventListener('click', (e) => {
          e.stopPropagation();
          this.store.updateItemQty(item.cartItemId, 1);
        });

        itemElem.querySelector('.item-action-btn-note').addEventListener('click', (e) => {
          e.stopPropagation();
          this.openNotesModal(item.cartItemId, item.name, item.notes);
        });

        this.cartItemsContainer.appendChild(itemElem);
      });
    }

    // Billing Breakdown
    this.subtotalAmount.innerText = formatRupiah(calc.subtotal);
    
    if (calc.discountAmount > 0) {
      this.discountRow.style.display = 'flex';
      this.discountAmount.innerText = `- ${formatRupiah(calc.discountAmount)}`;
    } else {
      this.discountRow.style.display = 'none';
    }

    if (calc.taxAmount > 0) {
      this.taxRow.style.display = 'flex';
      this.taxAmount.innerText = formatRupiah(calc.taxAmount);
    } else {
      this.taxRow.style.display = 'none';
    }

    this.grandTotalAmount.innerText = formatRupiah(calc.grandTotal);
    this.btnCheckout.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
      <span>Bayar ${calc.grandTotal > 0 ? formatRupiah(calc.grandTotal) : ''}</span>
    `;

    // Mobile floating bar update
    if (this.mobileCartCount) {
      this.mobileCartCount.innerText = calc.totalItems;
    }
    if (this.mobileCartTotal) {
      this.mobileCartTotal.innerText = formatRupiah(calc.grandTotal);
    }
  }

  updateCounters() {
    const savedCount = this.store.savedOrders.length;
    if (this.savedOrdersCountBadge) {
      this.savedOrdersCountBadge.innerText = savedCount;
      this.savedOrdersCountBadge.style.display = savedCount > 0 ? 'inline-block' : 'none';
    }
  }

  // --- Mobile Drawer Controls ---
  openMobileCart() {
    this.cartPanel.classList.add('mobile-open');
    this.mobileCartBackdrop.classList.add('active');
  }

  closeMobileCart() {
    this.cartPanel.classList.remove('mobile-open');
    this.mobileCartBackdrop.classList.remove('active');
  }

  // --- Modals Management ---
  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  // 1. Table Selection Modal
  openTableModal() {
    const listContainer = document.getElementById('tableOptionsList');
    listContainer.innerHTML = '';

    const sections = [
      {
        title: 'Area Meja (1 - 12)',
        desc: 'Meja kursi makan',
        items: [
          'Meja 01', 'Meja 02', 'Meja 03', 'Meja 04',
          'Meja 05', 'Meja 06', 'Meja 07', 'Meja 08',
          'Meja 09', 'Meja 10', 'Meja 11', 'Meja 12'
        ]
      },
      {
        title: 'Area Lesehan (1 - 8)',
        desc: 'Meja lesehan santai',
        items: [
          'Lesehan 01', 'Lesehan 02', 'Lesehan 03', 'Lesehan 04',
          'Lesehan 05', 'Lesehan 06', 'Lesehan 07', 'Lesehan 08'
        ]
      },
      {
        title: 'Bawa Pulang',
        desc: 'Pesanan tidak makan di tempat',
        items: ['Bungkus']
      }
    ];

    sections.forEach((sec, idx) => {
      const sectionWrapper = document.createElement('div');
      sectionWrapper.style.marginBottom = idx === sections.length - 1 ? '4px' : '16px';

      const headerDiv = document.createElement('div');
      headerDiv.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;';
      headerDiv.innerHTML = `
        <span style="font-size:0.8rem; font-weight:800; color:var(--text-main); text-transform:uppercase; letter-spacing:0.5px;">${sec.title}</span>
        <span style="font-size:0.72rem; color:var(--text-muted);">${sec.desc}</span>
      `;
      sectionWrapper.appendChild(headerDiv);

      const gridDiv = document.createElement('div');
      if (sec.items.length === 1 && sec.items[0] === 'Bungkus') {
        gridDiv.style.cssText = 'display:grid; grid-template-columns:1fr; gap:8px;';
      } else {
        gridDiv.style.cssText = 'display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;';
      }

      sec.items.forEach(tbl => {
        const isSelected = this.store.activeOrder.tableNumber === tbl;
        const btn = document.createElement('button');
        btn.className = `btn-table-choice ${isSelected ? 'selected' : ''}`;
        
        let iconPrefix = '';
        if (tbl === 'Bungkus') {
          iconPrefix = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/></svg>`;
        }

        btn.style.cssText = `
          padding: ${tbl === 'Bungkus' ? '12px 16px' : '10px 4px'};
          border-radius: 10px;
          border: 1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'};
          background: ${isSelected ? 'var(--primary-light)' : '#ffffff'};
          color: ${isSelected ? 'var(--primary)' : 'var(--text-main)'};
          font-weight: 700;
          font-size: ${tbl === 'Bungkus' ? '0.92rem' : '0.82rem'};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          box-shadow: ${isSelected ? '0 2px 6px rgba(22, 163, 74, 0.2)' : 'none'};
        `;
        btn.innerHTML = `${iconPrefix}<span>${tbl}</span>`;

        btn.addEventListener('click', () => {
          this.store.setTableNumber(tbl);
          if (tbl === 'Bungkus') {
            this.store.setOrderType('takeaway');
            if (this.orderTypeTakeaway && this.orderTypeDineIn) {
              this.orderTypeTakeaway.classList.add('active');
              this.orderTypeDineIn.classList.remove('active');
            }
          }
          this.closeAllModals();
          notify.info(`Area pesanan diubah ke "${tbl}".`, 'Area Meja');
          sound.playTap();
        });

        gridDiv.appendChild(btn);
      });

      sectionWrapper.appendChild(gridDiv);
      listContainer.appendChild(sectionWrapper);
    });

    this.modalTables.classList.add('active');
  }

  // 2. Item Custom Notes Modal
  openNotesModal(cartItemId, itemName, existingNotes) {
    this.editingCartItemId = cartItemId;
    document.getElementById('notesModalItemName').innerText = itemName;
    const textarea = document.getElementById('itemNotesTextarea');
    textarea.value = existingNotes || '';

    // Quick chips
    const chipsContainer = document.getElementById('quickNotesContainer');
    chipsContainer.innerHTML = '';
    QUICK_NOTES.forEach(chipText => {
      const chip = document.createElement('button');
      chip.className = 'quick-note-chip';
      chip.innerText = chipText;
      chip.addEventListener('click', () => {
        if (textarea.value.includes(chipText)) {
          textarea.value = textarea.value.replace(chipText, '').trim();
        } else {
          textarea.value = textarea.value ? `${textarea.value}, ${chipText}` : chipText;
        }
      });
      chipsContainer.appendChild(chip);
    });

    // Save button
    document.getElementById('btnSaveItemNotes').onclick = () => {
      this.store.updateItemNotes(this.editingCartItemId, textarea.value);
      this.closeAllModals();
      notify.success(`Catatan untuk ${itemName} berhasil disimpan.`, 'Catatan Disimpan');
      sound.playTap();
    };

    this.modalNotes.classList.add('active');
  }

  // 3. Payment Modal
  openPaymentModal() {
    const calc = this.store.getCalculation();
    document.getElementById('paymentTotalDisplay').innerText = formatRupiah(calc.grandTotal);
    
    // Reset cash received input
    const cashInput = document.getElementById('cashReceivedInput');
    cashInput.value = calc.grandTotal;

    // Reset method to cash
    this.selectedPaymentMethod = 'cash';
    document.querySelectorAll('.payment-method-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.method === 'cash');
    });

    const fullQrisBox = document.getElementById('qrisFullPosterBox');
    const qrisBtnText = document.getElementById('qrisToggleBtnText');
    if (fullQrisBox) fullQrisBox.style.display = 'none';
    if (qrisBtnText) qrisBtnText.innerText = 'Lihat Poster Resmi QRIS';

    // Populate cash shortcut chips
    this.renderCashShortcuts(calc.grandTotal);
    this.updatePaymentModalView();
    this.calculateCashChange();

    // Confirm button event
    document.getElementById('btnProcessPayment').onclick = () => {
      this.processCheckout();
    };

    this.modalPayment.classList.add('active');
  }

  renderCashShortcuts(total) {
    const container = document.getElementById('cashShortcutsGrid');
    container.innerHTML = '';

    // Standard Indonesian denominations
    const amounts = [
      { label: 'Uang Pas', val: total, isPas: true },
      { label: '50.000', val: 50000 },
      { label: '100.000', val: 100000 },
      { label: '150.000', val: 150000 },
      { label: '200.000', val: 200000 },
      { label: '500.000', val: 500000 }
    ].filter(a => a.isPas || a.val >= total);

    amounts.forEach(item => {
      const chip = document.createElement('button');
      chip.className = `cash-chip ${item.isPas ? 'chip-pas' : ''}`;
      chip.innerText = item.label;
      chip.addEventListener('click', () => {
        document.getElementById('cashReceivedInput').value = item.val;
        this.calculateCashChange();
        sound.playTap();
      });
      container.appendChild(chip);
    });
  }

  calculateCashChange() {
    const calc = this.store.getCalculation();
    const input = document.getElementById('cashReceivedInput');
    const cashReceived = Number(input.value) || 0;
    const change = cashReceived - calc.grandTotal;

    const changeElem = document.getElementById('cashChangeAmount');
    const boxElem = document.getElementById('changeDisplayBox');

    if (change >= 0) {
      changeElem.innerText = formatRupiah(change);
      boxElem.classList.add('has-change');
    } else {
      changeElem.innerText = `Kurang ${formatRupiah(Math.abs(change))}`;
      boxElem.classList.remove('has-change');
    }
  }

  updatePaymentModalView() {
    const cashSection = document.getElementById('paymentCashSection');
    const qrisSection = document.getElementById('paymentQrisSection');

    cashSection.style.display = this.selectedPaymentMethod === 'cash' ? 'block' : 'none';
    qrisSection.style.display = this.selectedPaymentMethod === 'qris' ? 'block' : 'none';
  }

  processCheckout() {
    const calc = this.store.getCalculation();
    let paymentData = {
      method: this.selectedPaymentMethod
    };

    if (this.selectedPaymentMethod === 'cash') {
      const cashReceived = Number(document.getElementById('cashReceivedInput').value) || 0;
      if (cashReceived < calc.grandTotal) {
        notify.warning(`Jumlah uang tunai (${formatRupiah(cashReceived)}) kurang dari total tagihan (${formatRupiah(calc.grandTotal)}).`, 'Uang Kurang');
        return;
      }
      paymentData.cashTendered = cashReceived;
      paymentData.change = cashReceived - calc.grandTotal;
    } else {
      // QRIS
      paymentData.method = 'qris';
      paymentData.cashTendered = calc.grandTotal;
      paymentData.change = 0;
      paymentData.referenceNumber = 'NMID-ID1026545930905';
    }

    const res = this.store.checkout(paymentData);
    if (res.success) {
      this.closeAllModals();
      this.closeMobileCart();
      notify.success(`Pembayaran ${formatRupiah(res.transaction.grandTotal)} (${res.transaction.paymentMethod === 'cash' ? 'TUNAI' : 'QRIS'}) berhasil!`, 'Transaksi Berhasil');
      this.showReceiptModal(res.transaction);
    }
  }

  // 4. Thermal Receipt Modal
  showReceiptModal(transaction) {
    const paper = document.getElementById('thermalReceiptPaper');
    const dateFormatted = new Date(transaction.createdAt).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    paper.innerHTML = `
      <div class="receipt-header">
        <img src="assets/logo.jpg" alt="Logo" class="receipt-logo-img">
        <div class="receipt-title">${this.store.settings.storeName}</div>
        <div style="font-size:0.72rem; line-height:1.2; margin:2px 0;">${this.store.settings.storeAddress}</div>
        <div>Telp: ${this.store.settings.storePhone}</div>
      </div>

      <div class="receipt-divider"></div>

      <div class="receipt-row">
        <span>No: ${transaction.invoiceNumber}</span>
        <span>${dateFormatted}</span>
      </div>
      <div class="receipt-row">
        <span>Kasir: ${transaction.cashier}</span>
        <span>${transaction.orderType === 'dine_in' ? 'Makan di Tempat' : 'Bawa Pulang'}</span>
      </div>
      <div class="receipt-row">
        <span>Pelanggan: ${transaction.customerName}</span>
        <span>${transaction.tableNumber}</span>
      </div>

      <div class="receipt-divider"></div>

      <div class="receipt-items-list">
        ${transaction.items.map(item => `
          <div class="receipt-item-row">
            <div class="receipt-item-title">${item.name}</div>
            <div class="receipt-item-calc">
              <span>${item.qty} x ${formatRupiah(item.price)}</span>
              <span>${formatRupiah(item.subtotal)}</span>
            </div>
            ${item.notes ? `<div class="receipt-item-note">(${item.notes})</div>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="receipt-divider"></div>

      <div class="receipt-row">
        <span>Subtotal</span>
        <span>${formatRupiah(transaction.subtotal)}</span>
      </div>

      ${transaction.discountAmount > 0 ? `
        <div class="receipt-row">
          <span>Diskon</span>
          <span>-${formatRupiah(transaction.discountAmount)}</span>
        </div>
      ` : ''}

      ${transaction.taxAmount > 0 ? `
        <div class="receipt-row">
          <span>Pajak (PB1)</span>
          <span>${formatRupiah(transaction.taxAmount)}</span>
        </div>
      ` : ''}

      <div class="receipt-row" style="font-weight:bold; font-size:1.05em; margin-top:4px;">
        <span>TOTAL</span>
        <span>${formatRupiah(transaction.grandTotal)}</span>
      </div>

      <div class="receipt-divider"></div>

      ${transaction.paymentMethod === 'cash' ? `
        <div class="receipt-row">
          <span>Bayar</span>
          <span>${formatRupiah(transaction.cashTendered)}</span>
        </div>
        <div class="receipt-row">
          <span>Kembalian</span>
          <span>${formatRupiah(transaction.change)}</span>
        </div>
      ` : `
        <div class="receipt-row">
          <span>Status</span>
          <span>LUNAS</span>
        </div>
      `}

      <div class="receipt-divider"></div>

      <div class="receipt-footer">
        <p style="font-weight:bold; margin-bottom:4px;">MATUR NUWUN SAMPUN RAWUH</p>
        <p>Terima Kasih Atas Kunjungan Anda</p>
      </div>
    `;

    // Print Receipt Event
    document.getElementById('btnPrintReceipt').onclick = () => {
      window.print();
    };

    this.modalReceipt.classList.add('active');
  }

  // 5. Saved Orders Modal (Hold Bills)
  openSavedOrdersModal() {
    const list = document.getElementById('savedOrdersListContainer');
    list.innerHTML = '';

    if (this.store.savedOrders.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:8px; color:var(--text-light);"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <p>Belum ada pesanan yang disimpan/ditangguhkan.</p>
        </div>
      `;
    } else {
      this.store.savedOrders.forEach(order => {
        const itemElem = document.createElement('div');
        itemElem.style.cssText = `
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 12px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
        `;

        const timeStr = new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        itemElem.innerHTML = `
          <div>
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">
              ${order.tableNumber} - ${order.customerName}
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
              ${order.cart.length} item • Disimpan jam ${timeStr}
            </div>
            <div style="font-weight: 800; color: var(--primary); font-size: 0.95rem; margin-top: 4px;">
              ${formatRupiah(order.totals.grandTotal)}
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-cancel-hold" style="background:var(--danger-light); color:var(--danger); border:none; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:700; font-size:0.8rem;">
              Batalkan
            </button>
            <button class="btn-recall-hold" style="background:var(--primary); color:#ffffff; border:none; padding:8px 14px; border-radius:8px; cursor:pointer; font-weight:700; font-size:0.8rem;">
              Buka Pesanan
            </button>
          </div>
        `;

        itemElem.querySelector('.btn-recall-hold').addEventListener('click', () => {
          this.store.recallOrder(order.orderId);
          this.closeAllModals();
          notify.success(`Pesanan ${order.tableNumber} atas nama "${order.customerName}" telah dimuat ke keranjang.`, 'Pesanan Dibuka');
        });

        itemElem.querySelector('.btn-cancel-hold').addEventListener('click', async () => {
          const ok = await notify.confirm({
            title: 'Batalkan Pesanan Tersimpan?',
            message: `Pesanan ${order.tableNumber} atas nama "${order.customerName}" (${formatRupiah(order.totals.grandTotal)}) akan dihapus dari daftar pesanan.`,
            confirmText: 'Ya, Batalkan',
            cancelText: 'Kembali',
            type: 'danger'
          });
          if (ok) {
            this.store.deleteSavedOrder(order.orderId);
            notify.info(`Pesanan ${order.tableNumber} (${order.customerName}) telah dibatalkan.`, 'Pesanan Dibatalkan');
            this.openSavedOrdersModal();
          }
        });

        list.appendChild(itemElem);
      });
    }

    this.modalSavedOrders.classList.add('active');
  }

  // 6. Transaction History Modal
  openHistoryModal() {
    const list = document.getElementById('historyListContainer');
    list.innerHTML = '';

    if (this.store.transactions.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; padding:36px; color:var(--text-muted);">
          <p>Belum ada riwayat transaksi penjualan.</p>
        </div>
      `;
    } else {
      this.store.transactions.forEach(tx => {
        const itemElem = document.createElement('div');
        itemElem.style.cssText = `
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 12px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
        `;

        const timeStr = new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        itemElem.innerHTML = `
          <div>
            <div style="font-weight:700; font-size:0.9rem;">${tx.invoiceNumber} • ${tx.tableNumber}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">${tx.customerName} • ${tx.items.length} Menu • ${timeStr}</div>
            <div style="font-weight:800; color:var(--primary); font-size:0.95rem; margin-top:2px;">
              ${formatRupiah(tx.grandTotal)} <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(${tx.paymentMethod.toUpperCase()})</span>
            </div>
          </div>
          <button class="btn-reprint" style="border:1px solid var(--border); background:var(--bg-surface); padding:7px 12px; border-radius:8px; cursor:pointer; font-size:0.8rem; font-weight:700;">
            Cetak Struk
          </button>
        `;

        itemElem.querySelector('.btn-reprint').addEventListener('click', () => {
          this.closeAllModals();
          this.showReceiptModal(tx);
        });

        list.appendChild(itemElem);
      });
    }

    this.modalHistory.classList.add('active');
  }

  // 7. Daily Reports Modal
  openReportsModal() {
    const stats = this.store.getDailyStats();

    document.getElementById('reportTotalRevenue').innerText = formatRupiah(stats.totalRevenue);
    document.getElementById('reportTotalTransactions').innerText = `${stats.totalTransactions} Transaksi`;

    document.getElementById('reportCashRevenue').innerText = formatRupiah(stats.paymentBreakdown.cash || 0);
    document.getElementById('reportQrisRevenue').innerText = formatRupiah(stats.paymentBreakdown.qris || 0);
    const debitElem = document.getElementById('reportDebitRevenue');
    if (debitElem) {
      debitElem.innerText = formatRupiah((stats.paymentBreakdown.debit || 0) + (stats.paymentBreakdown.transfer || 0));
    }

    const topList = document.getElementById('reportTopItemsList');
    topList.innerHTML = '';
    if (stats.topItems.length === 0) {
      topList.innerHTML = `<li style="color:var(--text-muted); font-size:0.85rem;">Belum ada penjualan hari ini</li>`;
    } else {
      stats.topItems.forEach((item, idx) => {
        const li = document.createElement('li');
        li.style.cssText = `
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.85rem;
        `;
        li.innerHTML = `
          <span><b>#${idx + 1}</b> ${item.name}</span>
          <span><b>${item.qty} porsi</b> (${formatRupiah(item.total)})</span>
        `;
        topList.appendChild(li);
      });
    }

    this.modalReports.classList.add('active');
  }
}
