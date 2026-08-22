/**
 * app.js - Main Application Logic & Routing
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAuth();
    initAssistance();
    
    // Check if already logged in (optional, but good for persistence)
    const role = localStorage.getItem('userRole');
    if (role) {
        handleSuccessfulLogin(role);
    } else {
        document.getElementById('login-overlay').style.display = 'flex';
    }
});

/**
 * Navigation Logic
 */
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        // Skip logout button
        if (btn.id === 'logout-btn') return;
        
        btn.addEventListener('click', () => {
            const viewId = btn.getAttribute('data-view');
            
            // Update active button
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
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

/**
 * Authentication & Role Management
 */
function initAuth() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    
    // Toggle UI
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', () => {
            loginContainer.style.display = 'none';
            signupContainer.style.display = 'block';
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            signupContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('userRole', data.role);
                    errorDiv.textContent = '';
                    handleSuccessfulLogin(data.role);
                } else {
                    errorDiv.textContent = data.message || 'Login failed';
                }
            } catch (err) {
                console.error("Login error", err);
                errorDiv.textContent = 'Server error. Is the Flask backend running?';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;
            const errorDiv = document.getElementById('signup-error');
            
            try {
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await res.json();
                if (data.success) {
                    // Sign up successful, log them in as customer
                    localStorage.setItem('userRole', data.role);
                    errorDiv.textContent = '';
                    handleSuccessfulLogin(data.role);
                } else {
                    errorDiv.textContent = data.message || 'Signup failed';
                }
            } catch (err) {
                console.error("Signup error", err);
                errorDiv.textContent = 'Server error. Is the Flask backend running?';
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userRole');
            document.getElementById('app-container').style.display = 'none';
            document.getElementById('login-overlay').style.display = 'flex';
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
            document.getElementById('signup-username').value = '';
            document.getElementById('signup-password').value = '';
            loginContainer.style.display = 'block';
            signupContainer.style.display = 'none';
        });
    }
}

function handleSuccessfulLogin(role) {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
    
    const inventoryBtn = document.querySelector('.nav-btn[data-view="inventory"]');
    const reportsBtn = document.querySelector('.nav-btn[data-view="reports"]');
    const assistanceBtn = document.querySelector('.nav-btn[data-view="assistance"]');
    
    if (role === 'customer') {
        if(inventoryBtn) inventoryBtn.style.display = 'none';
        if(reportsBtn) reportsBtn.style.display = 'none';
        if(assistanceBtn) assistanceBtn.style.display = 'flex';
        showView('pos');
    } else {
        if(inventoryBtn) inventoryBtn.style.display = 'flex';
        if(reportsBtn) reportsBtn.style.display = 'flex';
        if(assistanceBtn) assistanceBtn.style.display = 'none';
        showView('inventory');
    }
}

/**
 * Smart Assistance Logic
 */
function initAssistance() {
    const sendBtn = document.getElementById('chat-send-btn');
    const input = document.getElementById('chat-input');
    
    if (!sendBtn || !input) return;
    
    const sendMessage = async () => {
        const text = input.value.trim();
        if (!text) return;
        
        appendMessage(text, 'user');
        input.value = '';
        
        try {
            const res = await fetch('/api/assist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text })
            });
            const data = await res.json();
            appendMessage(data.response || "I do not have that info.", 'bot');
        } catch (err) {
            console.error(err);
            appendMessage("I am currently unable to connect to the backend server.", 'bot');
        }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function appendMessage(text, sender) {
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.textContent = text;
    
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

