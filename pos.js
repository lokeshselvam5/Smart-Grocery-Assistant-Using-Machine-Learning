/**
 * pos.js - Point of Sale Logic
 */

function isEgg(item) {
    if (!item) return false;
    const category = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    return category.includes('egg') || category.includes('முட்டை') || name.includes('egg') || name.includes('முட்டை');
}

let cart = [];
let selectedCategory = 'All';

function initPOS() {
    renderCategories();
    renderProducts();
    renderCart();

    // UI Event Listeners
    document.getElementById('pos-search').addEventListener('input', (e) => {
        renderProducts(e.target.value);
    });

    document.getElementById('checkout-btn').onclick = handleCheckout;

    document.getElementById('clear-cart').onclick = () => {
        cart = [];
        renderCart();
    };

    // Category scroll handlers
    const tabsContainer = document.getElementById('category-tabs');
    document.getElementById('cat-scroll-left').onclick = () => {
        tabsContainer.scrollBy({ left: -200, behavior: 'smooth' });
    };
    document.getElementById('cat-scroll-right').onclick = () => {
        tabsContainer.scrollBy({ left: 200, behavior: 'smooth' });
    };
}

function renderCategories() {
    const products = window.store.getProducts();
    const storeCategories = window.store.getCategories();

    // Get unique categories from current products
    const uniqueCategoryNames = [...new Set(products.map(p => p.category))].filter(Boolean);

    const categories = [
        { name: 'All', icon: '🛍️' }
    ];

    uniqueCategoryNames.forEach(name => {
        const found = storeCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
        categories.push({
            name: name,
            icon: found ? found.icon : '📦'
        });
    });

    const container = document.getElementById('category-tabs');

    container.innerHTML = categories.map(cat => `
        <button class="category-tab ${cat.name === selectedCategory ? 'active' : ''}" 
                onclick="filterCategory('${cat.name}')">
            <span class="cat-icon">${cat.icon}</span>
            ${cat.name}
        </button>
    `).join('');
}

window.filterCategory = (category) => {
    selectedCategory = category;
    renderCategories();
    renderProducts();
};

function renderProducts(searchTerm = '') {
    const products = window.store.getProducts();
    const container = document.getElementById('product-grid');

    const filtered = products.filter(p => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query);
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    const renderCard = p => {
        return `
        <div class="product-card" onclick="addToCart('${p.id}')">
            ${p.image ?
                `<img src="${p.image}" class="product-img" alt="${p.name}">` :
                `<div class="product-image-placeholder">${p.icon}</div>`
            }
            <div class="product-info">
                <span style="font-size: 0.7rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">${p.subCategory || ''}</span>
                <h4>${p.name}</h4>
                <div class="price">₹${p.price.toFixed(2)}</div>
            </div>
        </div>
    `;
    };

    if ((selectedCategory === 'Loose Items KG' || selectedCategory === 'Loose Items Grams') && !searchTerm) {
        const groups = {};
        filtered.forEach(p => {
            const sub = p.subCategory || 'Other';
            if (!groups[sub]) groups[sub] = [];
            groups[sub].push(p);
        });

        let html = '';
        for (const [sub, items] of Object.entries(groups)) {
            html += `
                <div style="grid-column: 1 / -1; margin-top: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">
                    <h3 style="color: var(--primary); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">${sub}</h3>
                </div>
            `;
            html += items.map(renderCard).join('');
        }
        container.innerHTML = html;
    } else {
        container.innerHTML = filtered.map(renderCard).join('');
    }
}

window.addToCart = (productId) => {
    const product = window.store.getProducts().find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    renderCart();
};

window.addToCartWithOptions = (productId, qty) => {
    const product = window.store.getProducts().find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.qty = qty;
    } else {
        cart.push({ ...product, qty: qty });
    }

    renderCart();
};

window.updateQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        const product = window.store.getProducts().find(p => p.id === id);
        const isLoose = product && product.category === 'Loose Items KG';
        const newQty = isLoose ? (item.qty + delta) : Math.round(item.qty + delta);
        if (newQty <= 0) {
            cart = cart.filter(i => i.id !== id);
        } else {
            item.qty = newQty;
        }
    }
    renderCart();
};

window.setQty = (id, qty) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        const newQty = parseFloat(qty);
        if (isNaN(newQty) || newQty <= 0) {
            cart = cart.filter(i => i.id !== id);
        } else {
            item.qty = newQty;
        }
    }
    renderCart();
};

window.handleQtyInput = (id, value) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        const newQty = parseFloat(value);
        if (!isNaN(newQty) && newQty > 0) {
            item.qty = newQty;
            updateTotals();

            const lineTotal = document.getElementById(`line-total-${id}`);
            if (lineTotal) {
                const totalVal = isEgg(item) ? (item.price * item.qty) : Math.round(item.price * item.qty);
                lineTotal.textContent = `₹${totalVal.toFixed(2)}`;
            }
            const lineDetail = document.getElementById(`line-detail-${id}`);
            if (lineDetail) lineDetail.textContent = `Qty: ${item.qty} ${item.unit || ''}`;
        }
    }
};

function renderCart() {
    const container = document.getElementById('cart-items');

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted);">Cart is empty</div>';
        updateTotals();
        return;
    }

    container.innerHTML = cart.map(item => {
        const lineTotal = (isEgg(item) ? (item.price * item.qty) : Math.round(item.price * item.qty)).toFixed(2);
        return `
        <div class="cart-item-block">
            <div class="cart-item-top">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <span id="line-detail-${item.id}">Qty: ${item.qty} ${item.unit || ''}</span>
                </div>
                <div class="cart-item-total">
                    <span id="line-total-${item.id}" class="line-total">₹${lineTotal}</span>
                    <button class="cart-remove-btn" onclick="setQty('${item.id}', 0)" title="Remove">✕</button>
                </div>
            </div>
            <div class="cart-item-controls">
                ${item.category === 'Loose Items KG' ? `
                <div class="weight-btns">
                    <button class="weight-btn ${item.qty === 0.25 ? 'active' : ''}" onclick="setQty('${item.id}', 0.25)">¼</button>
                    <button class="weight-btn ${item.qty === 0.5 ? 'active' : ''}" onclick="setQty('${item.id}', 0.5)">½</button>
                    <button class="weight-btn ${item.qty === 0.75 ? 'active' : ''}" onclick="setQty('${item.id}', 0.75)">¾</button>
                    <button class="weight-btn ${item.qty === 1 ? 'active' : ''}" onclick="setQty('${item.id}', 1)">1</button>
                    <button class="weight-btn ${item.qty === 5 ? 'active' : ''}" onclick="setQty('${item.id}', 5)">5</button>
                </div>
                ` : ''}
                ${item.category === 'Loose Items Grams' ? `
                <div class="weight-btns">
                    <button class="weight-btn ${item.qty === 0.01 ? 'active' : ''}" onclick="setQty('${item.id}', 0.01)">10g</button>
                    <button class="weight-btn ${item.qty === 0.025 ? 'active' : ''}" onclick="setQty('${item.id}', 0.025)">25g</button>
                    <button class="weight-btn ${item.qty === 0.05 ? 'active' : ''}" onclick="setQty('${item.id}', 0.05)">50g</button>
                    <button class="weight-btn ${item.qty === 0.1 ? 'active' : ''}" onclick="setQty('${item.id}', 0.1)">100g</button>
                    <button class="weight-btn ${item.qty === 0.25 ? 'active' : ''}" onclick="setQty('${item.id}', 0.25)">250g</button>
                </div>
                ` : ''}
                <div class="qty-stepper">
                    <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
                    <input type="number" class="qty-input" value="${item.qty}" min="0.01" step="any"
                        onchange="handleQtyInput('${item.id}', this.value)"
                        oninput="handleQtyInput('${item.id}', this.value)">
                    <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                </div>
            </div>
        </div>
    `;
    }).join('');

    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (isEgg(item) ? (item.price * item.qty) : Math.round(item.price * item.qty)), 0);
    document.getElementById('cart-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
    document.getElementById('cart-total').innerText = `₹${subtotal.toFixed(2)}`;

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = cart.length === 0;
    checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
}

function handleCheckout() {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (isEgg(item) ? (item.price * item.qty) : Math.round(item.price * item.qty)), 0);
    const customerName = document.getElementById('cart-customer-name').value;
    const billNo = 'MDS-' + Math.floor(Math.random() * 90000 + 10000);

    const order = {
        billNo: billNo,
        items: [...cart],
        total: total,
        customerName: customerName || 'Guest',
        date: new Date().toLocaleString()
    };

    // Save to data store (this updates reports and stock)
    window.store.saveOrder(order);

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Create hidden iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
            <head>
                <title>Bill ${billNo}</title>
                <style>
                    @page { 
                        size: 101.6mm auto; 
                        margin: 0; 
                    }
                    * { 
                        box-sizing: border-box; 
                    }
                    body { 
                        font-family: 'Courier New', Courier, monospace; 
                        width: 101.6mm; 
                        margin: 0; 
                        padding: 4mm 4mm; 
                        color: #000; 
                        font-size: 14px;
                        line-height: 1.3;
                        font-weight: bold;
                    }
                    .center { text-align: center; }
                    .header { width: 100%; margin-bottom: 6px; }
                    .header h1 { margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase; }
                    .header p { margin: 2px 0; font-size: 12px; }
                    .divider { border-top: 1px dashed #000; margin: 6px 0; width: 100%; }
                    
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                    }
                    td, th { 
                        padding: 0; 
                        vertical-align: top;
                    }
                    .left { text-align: left; }
                    .right { text-align: right; }
                    .center { text-align: center; }
                    
                    .meta-table td { font-size: 12px; text-transform: uppercase; padding: 2px 0; }
                    .item-table th { font-size: 12px; padding-bottom: 4px; border-bottom: 1px dashed #000; }
                    .item-table td { font-size: 13px; padding-top: 4px; }
                    .item-name { word-wrap: break-word; word-break: break-word; white-space: normal; }
                    .tamil-text { font-size: 11px; font-weight: normal; color: #444; display: inline-block; }
                    .total-table { border-top: 1px dashed #000; border-bottom: 1px dashed #000; margin-top: 6px; }
                    .total-table td { font-size: 18px; padding: 6px 0; font-weight: bold; }
                    .footer { font-size: 12px; margin-top: 12px; width: 100%; }
                </style>
            </head>
            <body>
                <div class="header center">
                    <h1>MUTHU DEPARTMENT STORE</h1>
                    <p>No.33 A/4, Apparao Street, Kanchipuram 631-502</p>
                    <p>Ph.no: 9942885996, 9894465996</p>
                </div>
                <div class="divider"></div>
                <table class="meta-table">
                    <tr>
                        <td class="left">BILL NO: ${billNo}</td>
                        <td class="right">${formattedDate}</td>
                    </tr>
                    <tr>
                        <td class="left" colspan="2">CUST: ${(order.customerName || 'GUEST')}</td>
                    </tr>
                </table>
                <div class="divider"></div>
                <table class="item-table">
                    <thead>
                        <tr>
                            <th class="left" style="width: 8%;">No.</th>
                            <th class="left" style="width: 42%;">Item Name</th>
                            <th class="center" style="width: 16%;">Qty</th>
                            <th class="right" style="width: 16%;">Rate</th>
                            <th class="right" style="width: 18%;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.map((item, index) => `
                            <tr>
                                <td class="left" style="padding: 4px 0;">${index + 1}</td>
                                <td class="left item-name" style="padding: 4px 0;">${item.name.replace(/([\u0b80-\u0bff]+)/g, '<span class="tamil-text">$1</span>')}</td>
                                <td class="center" style="padding: 4px 0;">${item.qty} ${item.unit || ''}</td>
                                <td class="right" style="padding: 4px 0;">${item.price.toFixed(2)}</td>
                                <td class="right" style="padding: 4px 0;">${(isEgg(item) ? (item.price * item.qty) : Math.round(item.price * item.qty)).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <table class="total-table">
                    <tr>
                        <td class="left">GRAND TOTAL:</td>
                        <td class="right">₹${total.toFixed(2)}</td>
                    </tr>
                </table>
                <div class="divider"></div>
                <div class="footer center">
                    <p>ITEMS: ${cart.length}</p>
                    <p>THANK YOU FOR SHOPPING!</p>
                </div>
                <script>
                    window.onload = function() { 
                        window.print(); 
                        setTimeout(() => {
                            window.parent.document.body.removeChild(window.frameElement);
                        }, 500);
                    }
                </script>
            </body>
        </html>
    `);
    doc.close();

    // Reset UI
    cart = [];
    document.getElementById('cart-customer-name').value = "";
    renderCart();
    renderProducts();
}
