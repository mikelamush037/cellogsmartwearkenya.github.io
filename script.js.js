// CELLOGSMARTWEARKENYA - Full Stack JavaScript
import { supabase } from './supabase/config.js';
import { 
    checkAuth, 
    getUser, 
    logoutUser 
} from './supabase/auth.js';
import { 
    getCategories, 
    getSubcategories, 
    getProducts,
    getProductById,
    addToCartDB,
    getCart,
    removeFromCartDB
} from './supabase/products.js';

// Global State
let currentUser = null;
let categories = [];
let cart = { items: [], total: 0, count: 0 };

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated
    await checkAuthStatus();
    
    // Load initial data
    await loadInitialData();
    
    // Setup UI
    initializeSwiper();
    setupEventListeners();
    initializeCountdown();
    setupAnimations();
    
    // Update UI based on auth status
    updateUIForAuth();
});

// Check authentication status
async function checkAuthStatus() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (user) {
            currentUser = user;
            console.log('User authenticated:', user.email);
            
            // Get user profile from database
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
                
            if (!profileError && profile) {
                currentUser.profile = profile;
            }
            
            // Load user's cart
            await loadUserCart();
        }
    } catch (error) {
        console.error('Auth check error:', error.message);
        currentUser = null;
    }
}

// Load initial data
async function loadInitialData() {
    try {
        // Load categories with subcategories
        categories = await getCategories();
        
        // Load featured products
        await loadFeaturedProducts();
        
        // Load categories for showcase
        await loadCategoryShowcase();
        
        // Load school items
        await loadSchoolItems();
        
    } catch (error) {
        console.error('Error loading initial data:', error);
        showNotification('Error loading data. Please refresh the page.', 'error');
    }
}

// Load user's cart from database
async function loadUserCart() {
    if (!currentUser) {
        // Load from local storage for guests
        loadGuestCart();
        return;
    }
    
    try {
        const cartItems = await getCart(currentUser.id);
        cart.items = cartItems || [];
        updateCartDisplay();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Load guest cart from localStorage
function loadGuestCart() {
    const savedCart = localStorage.getItem('guest_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        } catch (error) {
            console.error('Error loading guest cart:', error);
        }
    }
}

// Save guest cart to localStorage
function saveGuestCart() {
    if (!currentUser) {
        localStorage.setItem('guest_cart', JSON.stringify(cart));
    }
}

// Update UI based on authentication
function updateUIForAuth() {
    const accountBtn = document.getElementById('accountBtn');
    const authLinks = document.getElementById('authLinks');
    const userMenu = document.getElementById('userMenu');
    
    if (currentUser) {
        // User is logged in
        if (accountBtn) {
            accountBtn.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <div>
                    <div class="action-label">My Account</div>
                    <div class="action-value">${currentUser.email.split('@')[0]}</div>
                </div>
            `;
        }
        
        // Show user menu if exists
        if (userMenu) {
            userMenu.style.display = 'block';
        }
        
        // Update auth links
        if (authLinks) {
            authLinks.innerHTML = `
                <a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                <a href="orders.html"><i class="fas fa-shopping-bag"></i> Orders</a>
                <a href="profile.html"><i class="fas fa-user-cog"></i> Profile</a>
                <a href="wishlist.html"><i class="fas fa-heart"></i> Wishlist</a>
                <div class="dropdown-divider"></div>
                <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', async (e) => {
                e.preventDefault();
                await logoutUser();
                window.location.reload();
            });
        }
    } else {
        // User is not logged in
        if (authLinks) {
            authLinks.innerHTML = `
                <a href="auth.html?type=login"><i class="fas fa-sign-in-alt"></i> Login</a>
                <a href="auth.html?type=signup"><i class="fas fa-user-plus"></i> Sign Up</a>
                <a href="auth.html?type=seller"><i class="fas fa-store"></i> Become a Seller</a>
            `;
        }
    }
}

// Load categories with dropdown menus
async function loadCategoryShowcase() {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    try {
        // Get categories with their subcategories
        const categoriesWithSubs = await Promise.all(
            categories.map(async (category) => {
                const subcategories = await getSubcategories(category.id);
                return { ...category, subcategories };
            })
        );
        
        categoryGrid.innerHTML = '';
        
        // Display first 4 categories
        categoriesWithSubs.slice(0, 4).forEach(category => {
            const categoryHTML = createCategoryCard(category);
            categoryGrid.innerHTML += categoryHTML;
        });
        
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Create category card HTML
function createCategoryCard(category) {
    return `
        <div class="category-card">
            <div class="category-img">
                <img src="${category.image || 'https://images.unsplash.com/photo-1558769132-cb1edd1b160a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" 
                     alt="${category.name}" loading="lazy">
            </div>
            <div class="category-content">
                <div class="category-badge">${category.name}</div>
                <h3 class="category-title">${category.description || 'Premium Collection'}</h3>
                
                <!-- Subcategories Dropdown -->
                <div class="subcategories-dropdown">
                    <button class="dropdown-toggle">
                        <i class="fas fa-chevron-down"></i> Browse ${category.name}
                    </button>
                    <div class="dropdown-menu">
                        ${category.subcategories?.map(sub => `
                            <a href="products.html?category=${category.slug}&subcategory=${sub.slug}" 
                               class="dropdown-item">
                                <i class="fas fa-chevron-right"></i> ${sub.name}
                            </a>
                        `).join('') || '<p>No subcategories</p>'}
                    </div>
                </div>
                
                <a href="products.html?category=${category.slug}" class="btn category-btn">
                    Shop ${category.name}
                </a>
            </div>
        </div>
    `;
}

// Load featured products
async function loadFeaturedProducts() {
    const productSlider = document.getElementById('productSlider');
    if (!productSlider) return;
    
    try {
        const products = await getProducts({ featured: true, limit: 8 });
        
        productSlider.innerHTML = '';
        
        products.forEach(product => {
            const productHTML = createProductCard(product);
            productSlider.innerHTML += productHTML;
        });
        
        // Reinitialize swiper if needed
        if (window.productSwiper) {
            window.productSwiper.update();
        }
        
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Create product card HTML
function createProductCard(product) {
    const stars = getStarRating(product.rating);
    const priceHTML = product.original_price 
        ? `<span class="current-price">KES ${product.price.toLocaleString()}</span>
           <span class="original-price">KES ${product.original_price.toLocaleString()}</span>`
        : `<span class="current-price">KES ${product.price.toLocaleString()}</span>`;
    
    const badge = product.discount_percentage 
        ? `<div class="product-badge">-${product.discount_percentage}%</div>`
        : product.is_featured ? '<div class="product-badge">Featured</div>' : '';
    
    return `
        <div class="swiper-slide">
            <div class="product-card" data-id="${product.id}">
                ${badge}
                <div class="product-img">
                    <img src="${product.thumbnail || product.images[0] || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}" 
                         alt="${product.name}" loading="lazy">
                    <div class="product-actions">
                        <button class="product-action-btn" onclick="addToWishlist('${product.id}')">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="product-action-btn" onclick="quickView('${product.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="product-action-btn add-to-cart" 
                                data-id="${product.id}" 
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.thumbnail || product.images[0]}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-count">(${product.review_count})</span>
                    </div>
                    <div class="product-price">${priceHTML}</div>
                    
                    <!-- Size and Color Selection -->
                    <div class="product-variations">
                        ${product.size && product.size.length > 0 ? `
                            <select class="size-select" data-product="${product.id}">
                                <option value="">Select Size</option>
                                ${product.size.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        ` : ''}
                        
                        ${product.color && product.color.length > 0 ? `
                            <select class="color-select" data-product="${product.id}">
                                <option value="">Select Color</option>
                                ${product.color.map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        ` : ''}
                    </div>
                    
                    <button class="btn product-btn add-to-cart" 
                            data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-image="${product.thumbnail || product.images[0]}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load school items
async function loadSchoolItems() {
    const schoolGrid = document.getElementById('schoolGrid');
    if (!schoolGrid) return;
    
    try {
        // Get school category
        const { data: schoolCategory } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', 'school-accessories')
            .single();
            
        if (schoolCategory) {
            const products = await getProducts({ 
                category_id: schoolCategory.id, 
                limit: 4 
            });
            
            schoolGrid.innerHTML = '';
            
            products.forEach(product => {
                const priceHTML = product.original_price 
                    ? `KES ${product.price.toLocaleString()} <span>KES ${product.original_price.toLocaleString()}</span>`
                    : `KES ${product.price.toLocaleString()}`;
                    
                const schoolHTML = `
                    <div class="school-card" data-id="${product.id}">
                        <div class="school-img">
                            <img src="${product.thumbnail || product.images[0]}" alt="${product.name}" loading="lazy">
                        </div>
                        <div class="school-info">
                            <h3 class="school-title">${product.name}</h3>
                            <div class="school-price">${priceHTML}</div>
                            <button class="btn add-to-cart" 
                                    data-id="${product.id}"
                                    data-name="${product.name}"
                                    data-price="${product.price}"
                                    data-image="${product.thumbnail || product.images[0]}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                schoolGrid.innerHTML += schoolHTML;
            });
        }
    } catch (error) {
        console.error('Error loading school items:', error);
    }
}

// Enhanced add to cart function
async function addToCart(productId, productData = null) {
    try {
        let product = productData;
        
        if (!product) {
            product = await getProductById(productId);
        }
        
        if (!product) {
            showNotification('Product not found', 'error');
            return;
        }
        
        // Get selected variations
        const sizeSelect = document.querySelector(`.size-select[data-product="${productId}"]`);
        const colorSelect = document.querySelector(`.color-select[data-product="${productId}"]`);
        
        const selectedSize = sizeSelect ? sizeSelect.value : null;
        const selectedColor = colorSelect ? colorSelect.value : null;
        
        if (currentUser) {
            // Add to database cart
            await addToCartDB({
                user_id: currentUser.id,
                product_id: productId,
                quantity: 1,
                selected_size: selectedSize,
                selected_color: selectedColor
            });
        } else {
            // Add to local cart
            const existingItem = cart.items.find(item => 
                item.id === productId && 
                item.selected_size === selectedSize && 
                item.selected_color === selectedColor
            );
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.thumbnail || product.images[0],
                    selected_size: selectedSize,
                    selected_color: selectedColor
                });
            }
            
            saveGuestCart();
        }
        
        updateCartDisplay();
        showNotification(`${product.name} added to cart!`);
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart', 'error');
    }
}

// Update cart display
function updateCartDisplay() {
    // Calculate totals
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update UI elements
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');
    const cartPreviewTotal = document.getElementById('cartPreviewTotal');
    const cartPreviewItems = document.getElementById('cartPreviewItems');
    
    if (cartCount) cartCount.textContent = cart.count;
    if (cartTotal) cartTotal.textContent = cart.total.toLocaleString();
    if (cartPreviewTotal) cartPreviewTotal.textContent = `KES ${cart.total.toLocaleString()}`;
    
    // Update cart preview items
    if (cartPreviewItems) {
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
                        ${item.selected_size ? `<div class="cart-item-size">Size: ${item.selected_size}</div>` : ''}
                        ${item.selected_color ? `<div class="cart-item-color">Color: ${item.selected_color}</div>` : ''}
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            cartPreviewItems.innerHTML += itemHTML;
        });
    }
}

// Remove from cart
async function removeFromCart(index) {
    if (index >= 0 && index < cart.items.length) {
        const item = cart.items[index];
        
        if (currentUser) {
            // Remove from database
            await removeFromCartDB(currentUser.id, item.id);
        }
        
        cart.items.splice(index, 1);
        
        if (!currentUser) {
            saveGuestCart();
        }
        
        updateCartDisplay();
        showNotification('Item removed from cart');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons (event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || 
            e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') 
                ? e.target 
                : e.target.closest('.add-to-cart');
            
            const productId = button.getAttribute('data-id');
            const productData = {
                id: productId,
                name: button.getAttribute('data-name'),
                price: parseFloat(button.getAttribute('data-price')),
                thumbnail: button.getAttribute('data-image')
            };
            
            addToCart(productId, productData);
        }
    });
    
    // Cart preview toggle
    const cartBtn = document.getElementById('cartBtn');
    const cartPreview = document.getElementById('cartPreview');
    
    if (cartBtn && cartPreview) {
        cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            cartPreview.classList.toggle('active');
        });
        
        // Close cart preview when clicking outside
        document.addEventListener('click', function(e) {
            if (!cartPreview.contains(e.target) && !cartBtn.contains(e.target)) {
                cartPreview.classList.remove('active');
            }
        });
    }
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Category dropdowns
    document.addEventListener('click', function(e) {
        if (e.target.closest('.dropdown-toggle')) {
            const dropdown = e.target.closest('.subcategories-dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');
            menu.classList.toggle('show');
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.subcategories-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Search function
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    } else {
        searchInput.focus();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const bgColor = type === 'success' ? 'var(--success)' : 'var(--error)';
    
    notification.innerHTML = `
        <i class="fas ${icon}" style="font-size: 1.2rem;"></i>
        <div>
            <div style="font-weight: 600;">${type === 'success' ? 'Success!' : 'Error!'}</div>
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

// Helper functions
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

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.addToWishlist = async function(productId) {
    if (!currentUser) {
        showNotification('Please login to add to wishlist', 'error');
        window.location.href = 'auth.html?type=login';
        return;
    }
    
    try {
        const { error } = await supabase