// VFI Shop - Amazon-Style Filtering and Display
(function() {
    'use strict';
    
    let currentCategory = 'all';
    let currentSort = 'featured';
    
    // Initialize shop when DOM is ready
    function initShop() {
        renderCategories();
        renderProducts();
        setupEventListeners();
    }
    
    // Render category filters
    function renderCategories() {
        const categoryContainer = document.getElementById('categoryFilters');
        if (!categoryContainer) return;
        
        const categoryHTML = shopCategories.map(cat => `
            <button class="shop-category-btn ${cat.id === 'all' ? 'active' : ''}" 
                    data-category="${cat.id}">
                <i class="${cat.icon}"></i>
                <span>${cat.name}</span>
                <span class="category-count">${getProductCountByCategory(cat.id)}</span>
            </button>
        `).join('');
        
        categoryContainer.innerHTML = categoryHTML;
    }
    
    // Get product count by category
    function getProductCountByCategory(categoryId) {
        if (categoryId === 'all') return shopProducts.length;
        return shopProducts.filter(p => p.category === categoryId).length;
    }
    
    // Render products based on current filter
    function renderProducts() {
        const productsContainer = document.getElementById('productsGrid');
        if (!productsContainer) return;
        
        // Filter products
        let filteredProducts = currentCategory === 'all' 
            ? shopProducts 
            : shopProducts.filter(p => p.category === currentCategory);
        
        // Sort products
        filteredProducts = sortProducts(filteredProducts);
        
        // Update results count
        updateResultsCount(filteredProducts.length);
        
        // Render products
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <i class="fas fa-inbox" style="font-size: 4rem; color: rgba(255,255,255,0.3); margin-bottom: 1rem;"></i>
                    <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem;">No products found</h3>
                    <p style="color: rgba(255,255,255,0.6);">Try selecting a different category</p>
                </div>
            `;
            return;
        }
        
        const productsHTML = filteredProducts.map(product => `
            <div class="shop-product-card" data-product-id="${product.id}">
                <div class="shop-product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.featured ? '<span class="product-badge featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                    ${product.popular ? '<span class="product-badge popular"><i class="fas fa-fire"></i> Popular</span>' : ''}
                    <div class="shop-product-overlay">
                        <a href="${product.url}" target="_blank" class="shop-quick-view-btn">
                            <i class="fas fa-eye"></i> Quick View
                        </a>
                    </div>
                </div>
                <div class="shop-product-content">
                    <h3 class="shop-product-title">${product.name}</h3>
                    <p class="shop-product-description">${product.description}</p>
                    <div class="shop-product-footer">
                        <div class="shop-product-price">$${product.price.toFixed(2)}</div>
                        <a href="${product.url}" target="_blank" class="shop-product-btn">
                            <i class="fas fa-shopping-cart"></i> Buy Now
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        productsContainer.innerHTML = productsHTML;
        
        // Animate products
        animateProducts();
    }
    
    // Sort products
    function sortProducts(products) {
        switch(currentSort) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'name':
                return [...products].sort((a, b) => a.name.localeCompare(b.name));
            case 'featured':
            default:
                return [...products].sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    if (a.popular && !b.popular) return -1;
                    if (!a.popular && b.popular) return 1;
                    return 0;
                });
        }
    }
    
    // Update results count
    function updateResultsCount(count) {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
        }
    }
    
    // Animate products on load
    function animateProducts() {
        const products = document.querySelectorAll('.shop-product-card');
        products.forEach((product, index) => {
            setTimeout(() => {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    product.style.transition = 'all 0.4s ease';
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 50);
            }, index * 50);
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Category filters
        document.addEventListener('click', function(e) {
            if (e.target.closest('.shop-category-btn')) {
                const btn = e.target.closest('.shop-category-btn');
                const category = btn.dataset.category;
                
                // Update active state
                document.querySelectorAll('.shop-category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update current category and render
                currentCategory = category;
                renderProducts();
            }
        });
        
        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                currentSort = this.value;
                renderProducts();
            });
        }
        
        // Search input
        const searchInput = document.getElementById('shopSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    searchProducts(this.value);
                }, 300);
            });
        }
    }
    
    // Search products
    function searchProducts(query) {
        const productsContainer = document.getElementById('productsGrid');
        if (!productsContainer) return;
        
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            renderProducts();
            return;
        }
        
        const filteredProducts = shopProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
        
        updateResultsCount(filteredProducts.length);
        
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <i class="fas fa-search" style="font-size: 4rem; color: rgba(255,255,255,0.3); margin-bottom: 1rem;"></i>
                    <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem;">No products found</h3>
                    <p style="color: rgba(255,255,255,0.6);">Try a different search term</p>
                </div>
            `;
            return;
        }
        
        const productsHTML = filteredProducts.map(product => `
            <div class="shop-product-card">
                <div class="shop-product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.featured ? '<span class="product-badge featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                    ${product.popular ? '<span class="product-badge popular"><i class="fas fa-fire"></i> Popular</span>' : ''}
                    <div class="shop-product-overlay">
                        <a href="${product.url}" target="_blank" class="shop-quick-view-btn">
                            <i class="fas fa-eye"></i> Quick View
                        </a>
                    </div>
                </div>
                <div class="shop-product-content">
                    <h3 class="shop-product-title">${product.name}</h3>
                    <p class="shop-product-description">${product.description}</p>
                    <div class="shop-product-footer">
                        <div class="shop-product-price">$${product.price.toFixed(2)}</div>
                        <a href="${product.url}" target="_blank" class="shop-product-btn">
                            <i class="fas fa-shopping-cart"></i> Buy Now
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        productsContainer.innerHTML = productsHTML;
        animateProducts();
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initShop);
    } else {
        initShop();
    }
})();
