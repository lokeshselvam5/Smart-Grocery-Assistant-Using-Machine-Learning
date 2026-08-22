/**
 * inventory.js - Inventory Management Logic
 */

let editingProductId = null;

function initInventory() {
    // Reset search input on load
    const searchInput = document.getElementById('inventory-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    renderInventoryTable();
    populateUnitDropdown();

    // Add Product button
    document.getElementById('add-product-btn').onclick = () => {
        editingProductId = null;
        document.getElementById('modal-title').innerText = 'Add New Product';
        document.getElementById('product-form').reset();
        openModal('product-modal');
    };

    // Form submission
    document.getElementById('product-form').onsubmit = handleProductSubmit;

    // Emoji picker buttons listener
    const emojiPicker = document.getElementById('emoji-suggestion-picker');
    if (emojiPicker) {
        emojiPicker.onclick = (e) => {
            const btn = e.target.closest('.emoji-btn');
            if (btn) {
                const emoji = btn.getAttribute('data-emoji');
                const iconInput = document.getElementById('prod-icon');
                if (iconInput) {
                    iconInput.value = emoji;
                }
            }
        };
    }

    // Search filter input listener
    if (searchInput) {
        searchInput.oninput = () => {
            renderInventoryTable(searchInput.value);
        };
    }
}

function populateUnitDropdown() {
    const unitOptions = document.getElementById('unit-options');
    const units = window.store.getUnits();
    unitOptions.innerHTML = units.map(u => `<option value="${u}"></option>`).join('');
}

function renderInventoryTable(query = '') {
    const products = window.store.getProducts();
    const container = document.getElementById('inventory-table-body');
    const badge = document.getElementById('inventory-product-count');

    // Filter products
    const filteredProducts = products.filter(p => {
        const term = query.toLowerCase();
        const matchesName = p.name && p.name.toLowerCase().includes(term);
        const matchesCat = p.category && p.category.toLowerCase().includes(term);
        const matchesSubCat = p.subCategory && p.subCategory.toLowerCase().includes(term);
        return matchesName || matchesCat || matchesSubCat;
    });

    // Update product count badge
    if (badge) {
        if (query) {
            badge.textContent = `Showing ${filteredProducts.length} of ${products.length} Products`;
        } else {
            badge.textContent = `${products.length} Products`;
        }
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    No products found matching your search.
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map((p, index) => `
        <tr>
            <td style="width: 80px; text-align: center; font-weight: 500; color: var(--text-muted);">${index + 1}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    ${p.image ?
            `<img src="${p.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;">` :
            `<div style="width: 40px; height: 40px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 1.2rem;">${p.icon}</div>`
        }
                    <span style="font-weight: 500;">${p.name}</span>
                </div>
            </td>
            <td><span class="category-tab">${p.category}</span></td>
            <td><span style="font-weight: 600;">₹${p.price.toFixed(2)}</span></td>
            <td><span class="unit-badge" style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; color: #64748b;">${p.unit || 'kg'}</span></td>
            <td>
                <button class="btn-action-edit" onclick="editProduct('${p.id}')">Edit</button>
                <button class="btn-action-delete" onclick="deleteProduct('${p.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

window.editProduct = (id) => {
    const product = window.store.getProducts().find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    document.getElementById('modal-title').innerText = 'Edit Product';
    document.getElementById('prod-name').value = product.name;
    document.getElementById('prod-category').value = product.category;
    document.getElementById('prod-price').value = product.price;
    document.getElementById('prod-unit').value = product.unit || (window.store.getUnits()[0] || 'kg');
    document.getElementById('prod-icon').value = product.icon || '';
    document.getElementById('prod-image').value = product.image || '';

    openModal('product-modal');
};

function handleProductSubmit(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('prod-name').value,
        category: document.getElementById('prod-category').value,
        price: parseFloat(document.getElementById('prod-price').value),
        unit: document.getElementById('prod-unit').value,
        icon: document.getElementById('prod-icon').value,
        image: document.getElementById('prod-image').value
    };

    window.store.saveProduct(productData, editingProductId);
    closeModal('product-modal');
    
    // Refresh table keeping current search filter if any
    const searchInput = document.getElementById('inventory-search');
    renderInventoryTable(searchInput ? searchInput.value : '');
    
    showToast('Product saved successfully!', 'success');
}

window.deleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
        window.store.deleteProduct(id);
        
        // Refresh table keeping current search filter if any
        const searchInput = document.getElementById('inventory-search');
        renderInventoryTable(searchInput ? searchInput.value : '');
        
        showToast('Product deleted.', 'success');
    }
};


