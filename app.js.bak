/**
 * app.js - Main Application Logic & Routing
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    // Default view
    showView('pos');
});

/**
 * Navigation Logic
 */
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewId = btn.getAttribute('data-view');
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            showView(viewId);
        });
    });
}

function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });
    
    const targetView = document.getElementById(`${viewId}-view`);
    if (targetView) {
        targetView.style.display = 'block';
        
        // Trigger reflow for animation
        void targetView.offsetWidth;
        
        targetView.classList.add('active');
        
        // Trigger view-specific initialization
        if (viewId === 'pos') initPOS();
        if (viewId === 'inventory') initInventory();
        if (viewId === 'reports') initReports();
        if (viewId === 'calculator') initCalculator();
    }
}

function initClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;
    
    function updateClock() {
        const now = new Date();
        const options = { 
            timeZone: 'Asia/Kolkata',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        };
        
        const indianTime = now.toLocaleString('en-IN', options);
        clockElement.textContent = indianTime;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Global UI Init
document.addEventListener('DOMContentLoaded', () => {
    initClock();
});

/**
 * Utility: Notification System
 */
window.showToast = (message, type = 'success') => {
    // Simple alert for now, could be a beautiful toast UI
    // console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message);
};

/**
 * Utility: Modal System
 */
window.openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    void modal.offsetWidth;
    modal.classList.add('active');
};

window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
};

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        window.closeModal(event.target.id);
    }
};

document.getElementById('close-modal').addEventListener('click', () => {
    closeModal('product-modal');
});
