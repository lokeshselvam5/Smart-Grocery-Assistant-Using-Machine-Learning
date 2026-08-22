/**
 * reports.js - Analytics & Sales History
 */

function isEgg(item) {
    if (!item) return false;
    const category = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    return category.includes('egg') || category.includes('முட்டை') || name.includes('egg') || name.includes('முட்டை');
}

function initReports() {
    renderMetrics();
    renderSalesHistory();
}

function renderMetrics() {
    const orders = window.store.getOrders();
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalBills = orders.length;
    const avgBill = totalBills > 0 ? (totalRevenue / totalBills) : 0;

    document.getElementById('total-revenue').innerText = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('total-bills').innerText = totalBills;
    document.getElementById('avg-bill').innerText = `₹${avgBill.toFixed(2)}`;
}

function renderSalesHistory() {
    const orders = window.store.getOrders();
    const container = document.getElementById('sales-history-body');

    // Sort by most recent
    const sortedOrders = [...orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    container.innerHTML = sortedOrders.map(order => {
        const customerDisplay = order.customerName || 'Guest Customer';

        return `
            <tr>
                <td>${new Date(order.timestamp || order.date || Date.now()).toLocaleString()}</td>
                <td><span style="font-weight: 500;">${customerDisplay}</span></td>
                <td>${order.items.length} items</td>
                <td style="font-weight: 600;">₹${order.total.toFixed(2)}</td>
                <td>
                    <button class="btn-text" style="color: var(--primary); margin-right: 12px;" onclick="viewOrderReceipt('${order.id}')">View</button>
                    <button class="btn-text" style="color: var(--danger);" onclick="deleteOrder('${order.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

window.deleteOrder = (id) => {
    if (confirm('Are you sure you want to void/delete this transaction? This will remove it from the reports.')) {
        window.store.deleteOrder(id);
        initReports();
        showToast('Transaction deleted.', 'success');
    }
};

function generateOrderHTML(order) {
    let orderDate = new Date(order.timestamp || order.date);
    if (isNaN(orderDate.getTime())) {
        orderDate = new Date();
    }
    const dateStr = `${orderDate.getDate().toString().padStart(2, '0')}/${(orderDate.getMonth() + 1).toString().padStart(2, '0')}/${orderDate.getFullYear()} ${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;
    const itemsRows = order.items.map((item, index) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; text-align: left; font-size: 0.9rem; color: #334155; width: 8%;">${index + 1}</td>
            <td style="padding: 10px 0; text-align: left; font-size: 0.9rem; color: #334155; width: 42%;">
                <div style="font-weight: 600;">${item.name}</div>
                <div style="font-size: 0.75rem; color: #64748b;">${item.brand || 'Generic'}</div>
            </td>
            <td style="padding: 10px 0; text-align: center; font-size: 0.9rem; color: #334155; width: 16%;">${item.qty} ${item.unit || ''}</td>
            <td style="padding: 10px 0; text-align: right; font-size: 0.9rem; color: #334155; width: 16%;">₹${item.price.toFixed(2)}</td>
            <td style="padding: 10px 0; text-align: right; font-weight: 600; font-size: 0.9rem; color: #1e293b; width: 18%;">₹${(isEgg(item) ? (item.price * item.qty) : Math.round(item.price * item.qty)).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <div style="padding: 40px; font-family: 'Outfit', 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
                <h1 style="margin: 0; font-size: 1.8rem; color: #4f46e5; font-weight: 700; letter-spacing: -0.02em;">MUTHU DEPARTMENT STORE</h1>
                <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">No.33 A/4, Apparao Street, Kanchipuram 631-502</p>
                <p style="margin: 2px 0 0 0; color: #64748b; font-size: 0.9rem; font-weight: 500;">Ph: 9942885996, 9894465996</p>
            </div>
            
            <!-- Metadata -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 0.9rem;">
                <div>
                    <span style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Bill To</span>
                    <strong style="color: #1e293b; font-size: 1rem;">${order.customerName || 'Guest Customer'}</strong>
                </div>
                <div style="text-align: right;">
                    <span style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Invoice Details</span>
                    <div style="color: #334155; font-weight: 600; margin-bottom: 2px;">Bill No: <span style="color: #4f46e5;">${order.billNo || order.id}</span></div>
                    <div style="color: #64748b; font-size: 0.8rem;">Date: ${dateStr}</div>
                </div>
            </div>
            
            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="border-bottom: 2px solid #cbd5e1; text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: #64748b;">
                        <th style="padding: 8px 0; text-align: left; width: 8%;">No.</th>
                        <th style="padding: 8px 0; text-align: left; width: 42%;">Item Name</th>
                        <th style="padding: 8px 0; text-align: center; width: 16%;">Qty</th>
                        <th style="padding: 8px 0; text-align: right; width: 16%;">Rate</th>
                        <th style="padding: 8px 0; text-align: right; width: 18%;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>
            
            <!-- Total Section -->
            <div style="margin-left: auto; width: 250px; border-top: 2px solid #cbd5e1; padding-top: 10px; margin-bottom: 40px;">
                <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.95rem;">
                    <span style="color: #64748b; font-weight: 500;">Subtotal:</span>
                    <span style="color: #334155; font-weight: 600;">₹${order.total.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 1px solid #e2e8f0; font-size: 1.2rem;">
                    <span style="color: #1e293b; font-weight: 700;">Grand Total:</span>
                    <span style="color: #4f46e5; font-weight: 700;">₹${order.total.toFixed(2)}</span>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #94a3b8; font-size: 0.8rem; font-weight: 500;">
                <p style="margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Thank you for shopping with us!</p>
                <p style="margin: 5px 0 0 0;">This is a computer generated invoice and does not require physical signature.</p>
            </div>
        </div>
    `;
}

function generateOrderModalHTML(order) {
    let orderDate = new Date(order.timestamp || order.date);
    if (isNaN(orderDate.getTime())) {
        orderDate = new Date();
    }
    const dateStr = `${orderDate.getDate().toString().padStart(2, '0')}/${(orderDate.getMonth() + 1).toString().padStart(2, '0')}/${orderDate.getFullYear()} ${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;
    const itemsTableRows = order.items.map((item, index) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 6px 0; text-align: left; color: #64748b; width: 8%;">${index + 1}</td>
            <td style="padding: 6px 0; text-align: left; font-weight: 600; color: #334155; width: 42%;">${item.name}</td>
            <td style="padding: 6px 0; text-align: center; color: #334155; width: 16%;">${item.qty} ${item.unit || ''}</td>
            <td style="padding: 6px 0; text-align: right; color: #334155; width: 16%;">₹${item.price.toFixed(2)}</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #1e293b; width: 18%;">₹${(isEgg(item) ? (item.price * item.qty) : Math.round(item.price * item.qty)).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <div style="color: #1e293b;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px;">
                <h4 style="margin: 0; color: var(--primary); font-size: 1.15rem; font-weight: 700;">MUTHU DEPARTMENT STORE</h4>
                <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">No.33 A/4, Apparao Street, Kanchipuram 631-502</div>
            </div>
            <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 6px; margin-bottom: 20px; font-size: 0.8rem; display: flex; justify-content: space-between;">
                <div>
                    <div><strong>Bill No:</strong> ${order.billNo || order.id}</div>
                    <div><strong>Customer:</strong> ${order.customerName || 'Guest'}</div>
                </div>
                <div style="text-align: right;">
                    <div>${dateStr}</div>
                </div>
            </div>
            <div style="margin-bottom: 20px; max-height: 220px; overflow-y: auto; padding-right: 4px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid #cbd5e1; text-transform: uppercase; font-size: 0.7rem; font-weight: 700; color: #64748b;">
                            <th style="padding: 6px 0; text-align: left; width: 8%;">No.</th>
                            <th style="padding: 6px 0; text-align: left; width: 42%;">Item Name</th>
                            <th style="padding: 6px 0; text-align: center; width: 16%;">Qty</th>
                            <th style="padding: 6px 0; text-align: right; width: 16%;">Rate</th>
                            <th style="padding: 6px 0; text-align: right; width: 18%;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsTableRows}
                    </tbody>
                </table>
            </div>
            <div style="border-top: 2px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-weight: 700; font-size: 1.15rem;">
                <span>Total:</span>
                <span style="color: var(--primary);">₹${order.total.toFixed(2)}</span>
            </div>
        </div>
    `;
}

window.downloadOrderPDF = (orderId) => {
    const orders = window.store.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (typeof html2pdf === 'undefined') {
        showToast('PDF library loading... Please try again in a moment.', 'error');
        return;
    }

    // Create a temporary element to hold the HTML
    const element = document.createElement('div');
    element.innerHTML = generateOrderHTML(order);
    document.body.appendChild(element); // briefly append to render correctly

    // Configure html2pdf options
    const opt = {
        margin: 15,
        filename: `Invoice_${order.billNo || order.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate and save PDF, then remove temporary element
    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
    }).catch(err => {
        console.error('PDF Generation Error:', err);
        document.body.removeChild(element);
    });
};

window.viewOrderReceipt = (orderId) => {
    const orders = window.store.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modalBody = document.getElementById('receipt-modal-body');
    modalBody.innerHTML = generateOrderModalHTML(order);

    const downloadBtn = document.getElementById('download-pdf-btn');
    downloadBtn.onclick = () => {
        downloadOrderPDF(order.id);
    };

    const printBtn = document.getElementById('print-receipt-btn');
    printBtn.onclick = () => {
        printOrderReceipt(order.id);
    };

    openModal('receipt-modal');
};

window.printOrderReceipt = (orderId) => {
    const orders = window.store.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let orderDate = new Date(order.timestamp || order.date);
    if (isNaN(orderDate.getTime())) {
        orderDate = new Date();
    }
    const formattedDate = `${orderDate.getDate().toString().padStart(2, '0')}/${(orderDate.getMonth() + 1).toString().padStart(2, '0')}/${orderDate.getFullYear().toString().slice(-2)} ${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}:${orderDate.getSeconds().toString().padStart(2, '0')}`;

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
                <title>Bill ${order.billNo || order.id}</title>
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
                    .footer { font-size: 11px; margin-top: 12px; width: 100%; }
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
                        <td class="left">BILL NO: ${order.billNo || order.id}</td>
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
                        ${order.items.map((item, index) => `
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
                        <td class="right">₹${order.total.toFixed(2)}</td>
                    </tr>
                </table>
                <div class="divider"></div>
                <div class="footer center">
                    <p>ITEMS: ${order.items.length}</p>
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
};




