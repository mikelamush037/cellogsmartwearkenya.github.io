-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    county VARCHAR(100),
    postal_code VARCHAR(20),
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    parent_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subcategories Table (for dropdown menus)
CREATE TABLE subcategories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percentage INTEGER DEFAULT 0,
    quantity INTEGER DEFAULT 1,
    sku VARCHAR(100) UNIQUE,
    brand VARCHAR(100),
    size VARCHAR(50)[],
    color VARCHAR(50)[],
    condition VARCHAR(50) DEFAULT 'new',
    images TEXT[] DEFAULT '{}',
    thumbnail TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Attributes (for variations)
CREATE TABLE product_attributes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    additional_price DECIMAL(10,2) DEFAULT 0,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Table
CREATE TABLE cart (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    selected_size VARCHAR(50),
    selected_color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist Table
CREATE TABLE wishlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Orders Table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    mpesa_receipt VARCHAR(100),
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100),
    shipping_county VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    selected_size VARCHAR(50),
    selected_color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Methods Table
CREATE TABLE shipping_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    delivery_time VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons Table
CREATE TABLE coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2),
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Coupons (track coupon usage)
CREATE TABLE user_coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, coupon_id)
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_session ON cart(session_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
('Men''s Wear', 'mens-wear', 'Clothing for men', 'fas fa-male', 1),
('Women''s Wear', 'womens-wear', 'Clothing for women', 'fas fa-female', 2),
('Kids Fashion', 'kids-fashion', 'Clothing for children', 'fas fa-child', 3),
('School Accessories', 'school-accessories', 'School uniforms, bags, and supplies', 'fas fa-graduation-cap', 4),
('Shoes', 'shoes', 'Footwear for all', 'fas fa-shoe-prints', 5),
('Bags & Accessories', 'bags-accessories', 'Handbags, backpacks and accessories', 'fas fa-shopping-bag', 6);

-- Insert subcategories for Men's Wear
INSERT INTO subcategories (category_id, name, slug) VALUES
((SELECT id FROM categories WHERE slug = 'mens-wear'), 'Shirts', 'mens-shirts'),
((SELECT id FROM categories WHERE slug = 'mens-wear'), 'T-Shirts', 'mens-t-shirts'),
((SELECT id FROM categories WHERE slug = 'mens-wear'), 'Trousers', 'mens-trousers'),
((SELECT id FROM categories WHERE slug = 'mens-wear'), 'Jeans', 'mens-jeans'),
((SELECT id FROM categories WHERE slug = 'mens-wear'), 'Jackets', 'mens-jackets'),
((SELECT id FROM categories WHERE slug = 'mens-wear'), 'Suits', 'mens-suits');

-- Insert subcategories for Women's Wear
INSERT INTO subcategories (category_id, name, slug) VALUES
((SELECT id FROM categories WHERE slug = 'womens-wear'), 'Dresses', 'womens-dresses'),
((SELECT id FROM categories WHERE slug = 'womens-wear'), 'Tops', 'womens-tops'),
((SELECT id FROM categories WHERE slug = 'womens-wear'), 'Skirts', 'womens-skirts'),
((SELECT id FROM categories WHERE slug = 'womens-wear'), 'Blouses', 'womens-blouses'),
((SELECT id FROM categories WHERE slug = 'womens-wear'), 'Jackets', 'womens-jackets');

-- Insert subcategories for School Accessories
INSERT INTO subcategories (category_id, name, slug) VALUES
((SELECT id FROM categories WHERE slug = 'school-accessories'), 'School Uniforms', 'school-uniforms'),
((SELECT id FROM categories WHERE slug = 'school-accessories'), 'School Bags', 'school-bags'),
((SELECT id FROM categories WHERE slug = 'school-accessories'), 'School Shoes', 'school-shoes'),
((SELECT id FROM categories WHERE slug = 'school-accessories'), 'Stationery', 'stationery'),
((SELECT id FROM categories WHERE slug = 'school-accessories'), 'Sports Wear', 'sports-wear');

-- Insert default shipping methods
INSERT INTO shipping_methods (name, description, price, delivery_time) VALUES
('Standard Delivery', 'Delivery within 3-5 business days', 300, '3-5 business days'),
('Express Delivery', 'Delivery within 1-2 business days', 600, '1-2 business days'),
('Same Day Delivery', 'Delivery on the same day', 1000, 'Same day (Nairobi only)'),
('Free Delivery', 'Free delivery for orders above KES 3000', 0, '3-5 business days');

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase, valid_from, valid_to, usage_limit) VALUES
('WELCOME10', '10% off for new customers', 'percentage', 10, 1000, '2024-01-01', '2024-12-31', 1000),
('SCHOOL20', '20% off on school items', 'percentage', 20, 2000, '2024-01-01', '2024-12-31', 500),
('FLASH50', 'KES 500 off on orders above KES 5000', 'fixed', 500, 5000, '2024-01-01', '2024-12-31', 200);