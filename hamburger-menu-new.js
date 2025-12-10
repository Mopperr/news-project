// 🪦 Graveyard Hamburger Menu with Flower Animation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🪦 Initializing graveyard menu...');
    
    const hamburger = document.getElementById('hamburgerMenu');
    const body = document.body;
    
    if (!hamburger) {
        console.error('❌ Hamburger menu button not found!');
        return;
    }
    
    let menuActive = false;
    let graveyardContainer = null;
    
    // Toggle menu
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (menuActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    function openMenu() {
        menuActive = true;
        hamburger.classList.add('active');
        body.style.overflow = 'hidden';
        
        // Create graveyard overlay
        graveyardContainer = document.createElement('div');
        graveyardContainer.className = 'graveyard-overlay';
        graveyardContainer.innerHTML = `
            <div class="graveyard-scene">
                <div class="moon"></div>
                <div class="stars"></div>
                <div class="graveyard-ground"></div>
                
                <div class="menu-tombstones">
                    <div class="tombstone" data-link="index.html" data-delay="0">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">🏠</span>
                            <span class="tombstone-text">Home</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="israel-history.html" data-delay="50">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">🏛️</span>
                            <span class="tombstone-text">Israel History</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="salvation.html" data-delay="100">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">✝️</span>
                            <span class="tombstone-text">Know Yeshua</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="prayer-wall.html" data-delay="150">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">🙏</span>
                            <span class="tombstone-text">Prayer Wall</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="forum.html" data-delay="200">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">💬</span>
                            <span class="tombstone-text">Forum</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="worship.html" data-delay="250">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">🎵</span>
                            <span class="tombstone-text">Worship</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="testimonials.html" data-delay="300">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">❤️</span>
                            <span class="tombstone-text">Testimonials</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="about.html" data-delay="350">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">ℹ️</span>
                            <span class="tombstone-text">About</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="roots-reflections.html" data-delay="400">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">📖</span>
                            <span class="tombstone-text">Roots & Reflections</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="projects.html" data-delay="450">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">🤝</span>
                            <span class="tombstone-text">Projects</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="blog-posts.html" data-delay="500">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">📝</span>
                            <span class="tombstone-text">Blog</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="shop.html" data-delay="550">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">🛍️</span>
                            <span class="tombstone-text">Shop</span>
                        </div>
                    </div>
                    
                    <div class="tombstone" data-link="contact.html" data-delay="600">
                        <div class="tombstone-stone">
                            <span class="tombstone-icon">✉️</span>
                            <span class="tombstone-text">Contact</span>
                        </div>
                    </div>
                    
                    <div class="tombstone donate-tombstone" data-link="https://www.visionforisrael.com/en/give" data-delay="650" data-target="_blank">
                        <div class="tombstone-stone glowing">
                            <span class="tombstone-icon">💚</span>
                            <span class="tombstone-text">DONATE NOW</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        body.appendChild(graveyardContainer);
        
        // Trigger animations
        setTimeout(() => {
            graveyardContainer.classList.add('active');
            
            // Animate tombstones appearing one by one
            const tombstones = graveyardContainer.querySelectorAll('.tombstone');
            tombstones.forEach((tombstone, index) => {
                const delay = parseInt(tombstone.dataset.delay);
                setTimeout(() => {
                    tombstone.classList.add('rise');
                }, delay);
            });
            
            // Add click handlers
            tombstones.forEach(tombstone => {
                tombstone.addEventListener('click', function() {
                    const link = this.dataset.link;
                    const target = this.dataset.target;
                    
                    if (link) {
                        if (target === '_blank') {
                            window.open(link, '_blank');
                        } else {
                            window.location.href = link;
                        }
                    }
                });
            });
        }, 50);
        
        // Close on overlay click
        graveyardContainer.addEventListener('click', function(e) {
            if (e.target === graveyardContainer) {
                closeMenu();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', escapeHandler);
        
        console.log('🪦 Graveyard menu opened');
    }
    
    function escapeHandler(e) {
        if (e.key === 'Escape' && menuActive) {
            closeMenu();
        }
    }
    
    function closeMenu() {
        if (!menuActive) return;
        
        menuActive = false;
        hamburger.classList.remove('active');
        
        if (graveyardContainer) {
            graveyardContainer.classList.remove('active');
            
            setTimeout(() => {
                if (graveyardContainer && graveyardContainer.parentNode) {
                    graveyardContainer.remove();
                }
                graveyardContainer = null;
            }, 400);
        }
        
        body.style.overflow = '';
        document.removeEventListener('keydown', escapeHandler);
        
        console.log('🪦 Graveyard menu closed');
    }
});
