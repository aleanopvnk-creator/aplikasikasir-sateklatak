/**
 * State & Business Logic Kasir POS Sate Klatak Mbak Lala
 */

class PosStore {
  constructor() {
    this.STORAGE_KEYS = {
      MENU: 'mbaklala_pos_menu_v1',
      CART: 'mbaklala_pos_active_cart',
      ACTIVE_ORDER: 'mbaklala_pos_active_order',
      SAVED_ORDERS: 'mbaklala_pos_saved_orders',
      TRANSACTIONS: 'mbaklala_pos_transactions',
      SETTINGS: 'mbaklala_pos_settings'
    };

    this.settings = this.loadSettings();
    this.menu = this.loadMenu();
    this.activeOrder = this.loadActiveOrder();
    this.cart = this.loadCart();
    this.savedOrders = this.loadSavedOrders();
    this.transactions = this.loadTransactions();
    this.listeners = [];
  }

  // --- Persistence Handlers ---
  loadSettings() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Otomatis perbarui alamat jika masih memakai alamat lama
        if (!parsed.storeAddress || parsed.storeAddress.includes('Imogiri')) {
          parsed.storeAddress = 'Parkiran Timur, Pasar Kolombo, Jl. Kaliurang Km. 7, Depok, Sleman';
        }
        if (!parsed.cashierName || parsed.cashierName === 'Mira Workman') {
          parsed.cashierName = 'Mbak Lala';
        }
        if (parsed.cashierPhoto === undefined) {
          parsed.cashierPhoto = null;
        }
        return parsed;
      }
    } catch (e) {}
    return {
      storeName: 'SATE KLATAK MBAK LALA',
      storeAddress: 'Parkiran Timur, Pasar Kolombo, Jl. Kaliurang Km. 7, Depok, Sleman',
      storePhone: '0812-3456-7890',
      cashierName: 'Mbak Lala',
      cashierPhoto: null,
      enableTax: false,
      taxPercent: 10,
      currency: 'IDR'
    };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    this.notify();
  }

  loadMenu() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.MENU);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    localStorage.setItem(this.STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU_ITEMS));
    return JSON.parse(JSON.stringify(INITIAL_MENU_ITEMS));
  }

  saveMenu() {
    localStorage.setItem(this.STORAGE_KEYS.MENU, JSON.stringify(this.menu));
    this.notify();
  }

  loadActiveOrder() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.ACTIVE_ORDER);
      return saved ? JSON.parse(saved) : {
        customerName: 'Mira Workman',
        orderType: 'dine_in', // dine_in | takeaway
        tableNumber: 'Meja 01',
        discountPercent: 0,
        discountNominal: 0,
        notes: ''
      };
    } catch (e) {
      return {
        customerName: 'Mira Workman',
        orderType: 'dine_in',
        tableNumber: 'Meja 01',
        discountPercent: 0,
        discountNominal: 0,
        notes: ''
      };
    }
  }

  saveActiveOrder() {
    localStorage.setItem(this.STORAGE_KEYS.ACTIVE_ORDER, JSON.stringify(this.activeOrder));
    this.notify();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(this.cart));
    this.notify();
  }

  loadSavedOrders() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.SAVED_ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveSavedOrders() {
    localStorage.setItem(this.STORAGE_KEYS.SAVED_ORDERS, JSON.stringify(this.savedOrders));
    this.notify();
  }

  loadTransactions() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveTransactions() {
    localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
    this.notify();
  }

  // --- Observer Pattern ---
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  // --- Cart Actions ---
  addToCart(menuId, customNotes = '') {
    const item = this.menu.find(m => m.id === menuId);
    if (!item) return false;
    if (!item.available) {
      if (window.notify) {
        notify.warning(`Menu "${item.name}" saat ini sedang habis stoknya.`, 'Stok Habis');
      }
      return false;
    }

    // Check if item already exists in cart with same notes
    const existingIndex = this.cart.findIndex(
      c => c.menuId === menuId && (c.notes || '') === (customNotes || '')
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].qty += 1;
      this.cart[existingIndex].subtotal = this.cart[existingIndex].qty * item.price;
    } else {
      this.cart.push({
        cartItemId: 'ci_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        menuId: item.id,
        name: item.name,
        price: item.price,
        qty: 1,
        notes: customNotes,
        category: item.category,
        subtotal: item.price
      });
    }

    sound.playAdd();
    this.saveCart();
    return true;
  }

  updateItemQty(cartItemId, delta) {
    const index = this.cart.findIndex(c => c.cartItemId === cartItemId);
    if (index === -1) return;

    this.cart[index].qty += delta;

    if (this.cart[index].qty <= 0) {
      this.cart.splice(index, 1);
      sound.playRemove();
    } else {
      this.cart[index].subtotal = this.cart[index].qty * this.cart[index].price;
      sound.playTap();
    }

    this.saveCart();
  }

  removeItem(cartItemId) {
    const index = this.cart.findIndex(c => c.cartItemId === cartItemId);
    if (index > -1) {
      this.cart.splice(index, 1);
      sound.playRemove();
      this.saveCart();
    }
  }

  updateItemNotes(cartItemId, newNotes) {
    const index = this.cart.findIndex(c => c.cartItemId === cartItemId);
    if (index > -1) {
      this.cart[index].notes = newNotes.trim();
      this.saveCart();
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // --- Order Details Modification ---
  setCustomerName(name) {
    this.activeOrder.customerName = name;
    this.saveActiveOrder();
  }

  setOrderType(type) {
    this.activeOrder.orderType = type;
    this.saveActiveOrder();
  }

  setTableNumber(table) {
    this.activeOrder.tableNumber = table;
    this.saveActiveOrder();
  }

  setDiscount(percent, nominal = 0) {
    this.activeOrder.discountPercent = Number(percent) || 0;
    this.activeOrder.discountNominal = Number(nominal) || 0;
    this.saveActiveOrder();
  }

  // --- Calculations ---
  getCalculation() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.subtotal || item.price * item.qty), 0);
    const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);

    let discountAmount = 0;
    if (this.activeOrder.discountPercent > 0) {
      discountAmount = Math.round(subtotal * (this.activeOrder.discountPercent / 100));
    } else if (this.activeOrder.discountNominal > 0) {
      discountAmount = Math.min(this.activeOrder.discountNominal, subtotal);
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

    let taxAmount = 0;
    if (this.settings.enableTax && this.settings.taxPercent > 0) {
      taxAmount = Math.round(subtotalAfterDiscount * (this.settings.taxPercent / 100));
    }

    const grandTotal = subtotalAfterDiscount + taxAmount;

    return {
      subtotal,
      totalItems,
      discountAmount,
      taxAmount,
      grandTotal
    };
  }

  getItemQtyInCart(menuId) {
    return this.cart
      .filter(item => item.menuId === menuId)
      .reduce((sum, item) => sum + item.qty, 0);
  }

  // --- Hold / Saved Orders (Open Bills) ---
  holdCurrentOrder() {
    if (this.cart.length === 0) {
      return { success: false, message: 'Keranjang belanja masih kosong.' };
    }

    const calc = this.getCalculation();
    const savedOrder = {
      orderId: 'HLD-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      customerName: this.activeOrder.customerName || 'Pelanggan',
      orderType: this.activeOrder.orderType,
      tableNumber: this.activeOrder.tableNumber,
      cart: JSON.parse(JSON.stringify(this.cart)),
      discountPercent: this.activeOrder.discountPercent,
      discountNominal: this.activeOrder.discountNominal,
      totals: calc
    };

    this.savedOrders.unshift(savedOrder);
    this.saveSavedOrders();

    // Reset active cart
    this.cart = [];
    this.activeOrder.customerName = 'Pelanggan Baru';
    this.activeOrder.discountPercent = 0;
    this.activeOrder.discountNominal = 0;
    this.saveCart();
    this.saveActiveOrder();

    sound.playTap();
    return { success: true, order: savedOrder };
  }

  recallOrder(orderId) {
    const index = this.savedOrders.findIndex(o => o.orderId === orderId);
    if (index === -1) return false;

    const orderToRecall = this.savedOrders[index];

    // If current cart has items, ask to replace or merge
    this.cart = orderToRecall.cart;
    this.activeOrder.customerName = orderToRecall.customerName;
    this.activeOrder.orderType = orderToRecall.orderType;
    this.activeOrder.tableNumber = orderToRecall.tableNumber;
    this.activeOrder.discountPercent = orderToRecall.discountPercent || 0;
    this.activeOrder.discountNominal = orderToRecall.discountNominal || 0;

    // Remove from saved list
    this.savedOrders.splice(index, 1);

    this.saveSavedOrders();
    this.saveCart();
    this.saveActiveOrder();
    sound.playTap();
    return true;
  }

  deleteSavedOrder(orderId) {
    const index = this.savedOrders.findIndex(o => o.orderId === orderId);
    if (index > -1) {
      this.savedOrders.splice(index, 1);
      this.saveSavedOrders();
      sound.playRemove();
      return true;
    }
    return false;
  }

  // --- Checkout & Transactions ---
  checkout(paymentData) {
    if (this.cart.length === 0) {
      return { success: false, message: 'Tidak ada item yang dibayar.' };
    }

    const calc = this.getCalculation();
    const now = new Date();

    const dateStr = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `SKL-${dateStr}-${randomSuffix}`;

    const transaction = {
      invoiceNumber,
      createdAt: now.toISOString(),
      cashier: this.settings.cashierName,
      customerName: this.activeOrder.customerName || 'Umum',
      orderType: this.activeOrder.orderType,
      tableNumber: this.activeOrder.tableNumber,
      items: JSON.parse(JSON.stringify(this.cart)),
      subtotal: calc.subtotal,
      discountAmount: calc.discountAmount,
      taxAmount: calc.taxAmount,
      grandTotal: calc.grandTotal,
      paymentMethod: paymentData.method, // cash | qris | debit | transfer
      cashTendered: paymentData.cashTendered || calc.grandTotal,
      change: paymentData.change || 0,
      paymentRef: paymentData.referenceNumber || ''
    };

    // Save to transactions history
    this.transactions.unshift(transaction);
    this.saveTransactions();

    // Clear active cart & reset
    this.cart = [];
    this.activeOrder.customerName = 'Mira Workman';
    this.activeOrder.discountPercent = 0;
    this.activeOrder.discountNominal = 0;
    this.saveCart();
    this.saveActiveOrder();

    sound.playSuccess();
    return { success: true, transaction };
  }

  // --- Reports & Daily Stats ---
  getDailyStats() {
    const today = new Date().toDateString();
    const todayTxs = this.transactions.filter(t => new Date(t.createdAt).toDateString() === today);

    const totalRevenue = todayTxs.reduce((sum, t) => sum + t.grandTotal, 0);
    const totalTransactions = todayTxs.length;

    const paymentBreakdown = {
      cash: 0,
      qris: 0,
      debit: 0,
      transfer: 0
    };

    const itemSalesMap = {};

    todayTxs.forEach(t => {
      paymentBreakdown[t.paymentMethod] = (paymentBreakdown[t.paymentMethod] || 0) + t.grandTotal;
      t.items.forEach(item => {
        if (!itemSalesMap[item.name]) {
          itemSalesMap[item.name] = { name: item.name, qty: 0, total: 0 };
        }
        itemSalesMap[item.name].qty += item.qty;
        itemSalesMap[item.name].total += (item.price * item.qty);
      });
    });

    const topItems = Object.values(itemSalesMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return {
      todayDate: today,
      totalRevenue,
      totalTransactions,
      paymentBreakdown,
      topItems
    };
  }

  // Toggle availability of menu item
  toggleMenuItemAvailability(menuId) {
    const item = this.menu.find(m => m.id === menuId);
    if (item) {
      item.available = !item.available;
      this.saveMenu();
      return item.available;
    }
    return null;
  }

  // Update item price
  updateMenuItemPrice(menuId, newPrice) {
    const item = this.menu.find(m => m.id === menuId);
    if (item && Number(newPrice) > 0) {
      item.price = Number(newPrice);
      this.saveMenu();
      return true;
    }
    return false;
  }

  // Update cashier name and photo
  updateCashierProfile(name, photo = null) {
    if (name) {
      this.settings.cashierName = name.trim();
    }
    if (photo !== undefined) {
      this.settings.cashierPhoto = photo;
    }
    this.saveSettings(this.settings);
    return true;
  }
}

// Global Store Instance
const posStore = new PosStore();
