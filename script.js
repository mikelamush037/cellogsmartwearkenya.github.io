// CELLOGSMARTWEARKENYA - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything when DOM is ready
    initializeSwiper();
    loadProducts();
    setupEventListeners();
    initializeCountdown();
    checkCart();
    setupAnimations();
});

// Global Variables
let cart = {
    items: [],
    get total() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    get count() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
};

// Products Data
const products = {
    categories: [
        {
            id: 'mens',
            name: "Men's Wear",
            badge: "Men's Wear",
            title: "Premium Men's Collection",
            image: "https://images.unsplash.com/photo-1558769132-cb1edd1b160a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            products: [
                {
                    name: "Formal Shirt",
                    price: "KES 1,499",
                    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                    name: "Denim Jeans",
                    price: "KES 2,199",
                    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                    name: "Casual Jacket",
                    price: "KES 3,499",
                    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                }
            ]
        },
        {
            id: 'womens',
            name: "Women's Wear",
            badge: "Women's Wear",
            title: "Elegant Women's Fashion",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            products: [
                {
                    name: "Summer Dress",
                    price: "KES 2,299",
                    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                    name: "Casual Top",
                    price: "KES 1,199",
                    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                    name: "Office Skirt",
                    price: "KES 1,799",
                    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                }
            ]
        },
        {
            id: 'school',
            name: "School Accessories",
            badge: "School Items",
            title: "Back to School Essentials",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            products: [
                {
                    name: "School Bag",
                    price: "KES 1,899",
                    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                    name: "School Shoes",
                    price: "KES 2,499",
                    image: "https://images.unsplash.com/photo-1523480717984-24cba35ae1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                    name: "School Uniform",
                    price: "KES 1,299",
                    image: "https://images.unsplash.com/photo-1624300629296-4e94c01df56f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                }
            ]
        },
        {
            id: 'kids',
            name: "Kids Fashion",
            badge: "Kids Fashion",
            title: "Adorable Kids Collection",
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            products: [
                {
                    name: "Kids T-Shirt Set",
                    price: "KES 999",
                    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                    name: "Kids Shorts",
                    price: "KES 799",
                    image: "https://images.unsplash.com/photo-1594736797933-d0e6e4f6f8a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                    name: "Kids Dress",
                    price: "KES 1,499",
                    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                }
            ]
        }
    ],
    
    schoolItems: [
        {
            id: 1,
            name: "Premium School Backpack - 20L",
            price: 2199,
            originalPrice: 2799,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.8
        },
        {
            id: 2,
            name: "Leather School Shoes - Black",
            price: 2999,
            originalPrice: 3499,
            image: "https://images.unsplash.com/photo-1523480717984-24cba35ae1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.5
        },
        {
            id: 3,
            name: "Complete School Uniform Set",
            price: 3499,
            originalPrice: 4199,
            image: "https://images.unsplash.com/photo-1624300629296-4e94c01df56f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.9
        },
        {
            id: 4,
            name: "Stationery Set - 50 Pieces",
            price: 1299,
            originalPrice: 1699,
            image: "https://images.unsplash.com/photo-1587654780298-8c6d6b2c8b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.7
        }
    ],
    
    featuredProducts: [
        {
            id: 1,
            name: "Men's Premium Casual Shirt - Blue Check",
            price: 1299,
            originalPrice: 1699,
            badge: "-20%",
            image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.2
        },
        {
            id: 2,
            name: "Women's Summer Floral Dress - Yellow",
            price: 2499,
            badge: "New",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.8
        },
        {
            id: 3,
            name: "Men's Casual Sneakers - White & Blue",
            price: 3499,
            badge: "Hot",
            image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.3
        },
        {
            id: 4,
            name: "Kids T-Shirt & Shorts Set - 3 Pieces",
            price: 1199,
            originalPrice: 1499,
            badge: "-15%",
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.7
        }
    ]
};

// Initialize Swiper Sliders
function initializeSwiper() {
    // Hero Slider
    if (document.querySelector('.hero-slider .swiper')) {
        const heroSwiper = new Swiper('.hero-slider .swiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
        });
    }
    
    // Product Slider
    if (document.querySelector('.productSwiper')) {
        const productSwiper = new Swiper('.productSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                },
            },
        });
    }
}

// Load Products
function loadProducts() {
    loadCategories();
    loadSchoolItems();
    loadFeaturedProducts();
}

function loadCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = '';
    
    products.categories.forEach(category => {
        const categoryHTML = `
            <div class="category-card">
                <div class="category-img">
                    <img src="${category.image}" alt="${category.name}" loading="lazy">
                </div>
                <div class="category-content">
                    <div class="category-badge">${category.badge}</div>
                    <h3 class="category-title">${category.title}</h3>
                    <div class="category-products">
                        ${category.products.map(product => `
                            <div class="category-product">
                                <div class="product-sample">
                                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                                </div>
                                <div class="product-name">${product.name}</div>
                                <div class="product-price">${product.price}</div>
                            </div>
                        `).join('')}
                    </div>
                    <a href="#" class="btn category-btn" data-category="${category.id}">Shop ${category.name}</a>
                </div>
            </div>
        `;
        categoryGrid.innerHTML += categoryHTML;
    });
}

function loadSchoolItems() {
    const schoolGrid = document.getElementById('schoolGrid');
    if (!schoolGrid) return;
    
    schoolGrid.innerHTML = '';
    
    products.schoolItems.forEach(item => {
        const priceHTML = item.originalPrice 
            ? `KES ${item.price.toLocaleString()} <span>KES ${item.originalPrice.toLocaleString()}</span>`
            : `KES ${item.price.toLocaleString()}`;
            
        const schoolHTML = `
            <div class="school-card" data-id="${item.id}">
                <div class="school-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="school-info">
                    <h3 class="school-title">${item.name}</h3>
                    <div class="school-price">${priceHTML}</div>
                    <button class="btn add-to-cart" data-id="${item.id}" data-type="school">Add to Cart</button>
                </div>
            </div>
        `;
        schoolGrid.innerHTML += schoolHTML;
    });
}

function loadFeaturedProducts() {
    const productSlider = document.getElementById('productSlider');
    if (!productSlider) return;
    
    productSlider.innerHTML = '';
    
    products.featuredProducts.forEach(product => {
        const stars = getStarRating(product.rating);
        const priceHTML = product.originalPrice 
            ? `<span class="current-price">KES ${product.price.toLocaleString()}</span>
               <span class="original-price">KES ${product.originalPrice.toLocaleString()}</span>`
            : `<span class="current-price">KES ${product.price.toLocaleString()}</span>`;
            
        const productHTML = `
            <div class="swiper-slide">
                <div class="product-card" data-id="${product.id}">
                    <div class="product-badge">${product.badge}</div>
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <div class="product-actions">
                            <button class="product-action-btn" onclick="addToWishlist(${product.id})">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="product-action-btn" onclick="quickView(${product.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="product-action-btn add-to-cart" data-id="${product.id}" data-type="featured">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-rating">
                            <div class="stars">${stars}</div>
                            <span class="rating-count">(${product.rating})</span>
                        </div>
                        <div class="product-price">${priceHTML}</div>
                        <button class="btn product-btn add-to-cart" data-id="${product.id}" data-type="featured">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        productSlider.innerHTML += productHTML;
    });
}

function getStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Cart Functions
function checkCart() {
    const savedCart = localStorage.getItem('cellogsmartwear_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        } catch (e) {
            console.error('Error loading cart:', e);
        }
    } else {
        // Add default items for demo
        cart.items = [
            { id: 1, name: "Men's Casual Shirt", price: 1499, quantity: 1, image: products.featuredProducts[0].image, type: "featured" },
            { id: 1, name: "School Backpack", price: 2199, quantity: 1, image: products.schoolItems[0].image, type: "school" },
            { id: 2, name: "Women's Dress", price: 2499, quantity: 1, image: products.featuredProducts[1].image, type: "featured" }
        ];
        saveCart();
        updateCartDisplay();
    }
}

function saveCart() {
    localStorage.setItem('cellogsmartwear_cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');
    const cartPreviewTotal = document.getElementById('cartPreviewTotal');
    
    if (cartCount) cartCount.textContent = cart.count;
    if (cartTotal) cartTotal.textContent = cart.total.toLocaleString();
    if (cartPreviewTotal) cartPreviewTotal.textContent = `KES ${cart.total.toLocaleString()}`;
    
    updateCartPreview();
}

function updateCartPreview() {
    const cartPreviewItems = document.getElementById('cartPreviewItems');
    if (!cartPreviewItems) return;
    
    cartPreviewItems.innerHTML = '';
    
    if (cart.items.length === 0) {
        cartPreviewItems.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--gray);">Your cart is empty</div>';
        return;
    }
    
    cart.items.forEach((item, index) => {
        const itemHTML = `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">KES ${item.price.toLocaleString()} x ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        cartPreviewItems.innerHTML += itemHTML;
    });
}

function addToCart(productId, type = 'featured') {
    let product;
    
    if (type === 'featured') {
        product = products.featuredProducts.find(p => p.id === productId);
    } else if (type === 'school') {
        product = products.schoolItems.find(p => p.id === productId);
    }
    
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.items.find(item => 
        item.id === productId && item.type === type
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            type: type
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.items.length) {
        cart.items.splice(index, 1);
        saveCart();
        updateCartDisplay();
        showNotification('Item removed from cart');
    }
}

// Event Listeners
function setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCartPreview);
    }
    
    // Close cart preview when clicking outside
    document.addEventListener('click', function(e) {
        const cartPreview = document.getElementById('cartPreview');
        if (cartPreview && !cartPreview.contains(e.target) && 
            !cartBtn.contains(e.target) && 
            cartPreview.classList.contains('active')) {
            cartPreview.classList.remove('active');
        }
    });
    
    // Account button
    const accountBtn = document.getElementById('accountBtn');
    if (accountBtn) {
        accountBtn.addEventListener('click', function() {
            showNotification('Account feature coming soon!');
        });
    }
    
    // Quick access items
    document.querySelectorAll('.quick-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showNotification(`Showing ${category} products`);
        });
    });
    
    // Add to cart buttons (event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || 
            e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') 
                ? e.target 
                : e.target.closest('.add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            const type = button.getAttribute('data-type') || 'featured';
            addToCart(productId, type);
        }
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cart.items.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            window.location.href = 'cart.html';
        });
    }
    
    // Quick category buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-btn') || 
            e.target.closest('.category-btn')) {
            const button = e.target.classList.contains('category-btn') 
                ? e.target 
                : e.target.closest('.category-btn');
            const category = button.getAttribute('data-category');
            showNotification(`Navigating to ${category} category`);
        }
    });
}

function toggleCartPreview() {
    const cartPreview = document.getElementById('cartPreview');
    if (!cartPreview) return;
    
    cartPreview.classList.toggle('active');
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (query) {
        showNotification(`Searching for: "${query}"`);
        // In a real implementation, this would filter or search products
    } else {
        searchInput.focus();
    }
}

// Countdown Timer
function initializeCountdown() {
    function updateCountdown() {
        const countdownDate = new Date();
        countdownDate.setDate(countdownDate.getDate() + 3); // 3 days from now
        
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            const countdownContainer = document.querySelector(".countdown");
            if (countdownContainer) {
                countdownContainer.innerHTML = "<div class='countdown-ended'>Sale Ended!</div>";
            }
        }
    }
    
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Show Notification
function showNotification(message) {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
        <div>
            <div style="font-weight: 600;">Success!</div>
            <div style="font-size: 0.9rem;">${message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Wishlist Function
function addToWishlist(productId) {
    showNotification('Added to wishlist!');
}

// Quick View Function
function quickView(productId) {
    showNotification('Quick view feature coming soon!');
}

// Setup Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.category-card, .school-card, .benefit-card, .deal-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
}

// Export functions for global access
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.quickView = quickView;
window.removeFromCart = removeFromCart;
