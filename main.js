/* ==========================================
   FLORIST WEBSITE - MAIN JAVASCRIPT
   ========================================== */

// ============ Product Data ============
const products = [
    {
        id: 1,
        name: "Romantic Rose Bouquet",
        category: "roses",
        price: 65.00,
        originalPrice: 85.00,
        image: "images/flower1.png",
        badge: "Bestseller",
        description: "Elegant arrangement of pink and white roses with eucalyptus"
    },
    {
        id: 2,
        name: "Valentine's Romance",
        category: "roses",
        price: 79.00,
        originalPrice: 95.00,
        image: "images/flower2.png",
        badge: "Popular",
        description: "Red and pink roses wrapped in kraft paper with baby's breath"
    },
    {
        id: 3,
        name: "Sunshine Sunflowers",
        category: "seasonal",
        price: 45.00,
        originalPrice: null,
        image: "images/flower3.png",
        badge: null,
        description: "Cheerful sunflowers in a rustic mason jar"
    },
    {
        id: 4,
        name: "Elegant Orchid & Lily",
        category: "tropical",
        price: 95.00,
        originalPrice: 120.00,
        image: "images/flower4.png",
        badge: "Premium",
        description: "Sophisticated white orchids and lilies in modern glass vase"
    },
    {
        id: 5,
        name: "Lavender Dream",
        category: "bouquets",
        price: 55.00,
        originalPrice: null,
        image: "images/flower5.png",
        badge: null,
        description: "Purple hydrangeas with lavender and wildflowers"
    },
    {
        id: 6,
        name: "Tropical Paradise",
        category: "tropical",
        price: 85.00,
        originalPrice: 110.00,
        image: "images/flower6.png",
        badge: "Exotic",
        description: "Birds of paradise with anthuriums and exotic greenery"
    }
];

// ============ Cart Functions ============
function getCart() {
    const cart = localStorage.getItem('floristCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('floristCart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    saveCart(cart);
    updateCartCount();
    showNotification(`${product.name} added to cart! 🌸`);
    
    // Add animation to cart icon
    const cartIcon = document.getElementById('cartIcon');
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

// ============ UI Functions ============
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #e8a4b8 0%, #d4849a 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function renderProducts(containerId, productList = products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = productList.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="product-action-btn" title="Quick View">👁️</button>
                    <button class="product-action-btn" title="Add to Wishlist">💗</button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    Add to Cart 🛒
                </button>
            </div>
        </div>
    `).join('');
}

// ============ Navigation Functions ============
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ============ Newsletter Function ============
function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    showNotification(`Thank you for subscribing! 💌`);
    event.target.reset();
    return false;
}

// ============ Initialize ============
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Update cart count
    updateCartCount();
    
    // Render featured products on home page
    const featuredContainer = document.getElementById('featuredProducts');
    if (featuredContainer) {
        renderProducts('featuredProducts', products.slice(0, 3));
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
