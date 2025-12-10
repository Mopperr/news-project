// Prayer Wall JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🙏 Prayer Wall initialized');
    
    const prayerForm = document.getElementById('prayerForm');
    const prayersGrid = document.getElementById('prayersGrid');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    let currentFilter = 'all';
    let prayers = [];
    
    // Load prayers from localStorage
    loadPrayers();
    
    // Add sample prayers if empty
    if (prayers.length === 0) {
        addSamplePrayers();
    }
    
    displayPrayers();
    
    // Form submission
    prayerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('prayerName').value;
        const category = document.getElementById('prayerCategory').value;
        const request = document.getElementById('prayerRequest').value;
        
        const newPrayer = {
            id: Date.now(),
            name: name,
            category: category,
            request: request,
            date: new Date().toISOString(),
            prayCount: 0
        };
        
        prayers.unshift(newPrayer);
        savePrayers();
        displayPrayers();
        
        // Reset form
        prayerForm.reset();
        
        // Show success message
        alert('✅ Your prayer request has been submitted! May God bless you.');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            displayPrayers();
        });
    });
    
    function displayPrayers() {
        // Filter prayers
        let filteredPrayers = prayers;
        if (currentFilter !== 'all') {
            filteredPrayers = prayers.filter(p => p.category === currentFilter);
        }
        
        prayersGrid.innerHTML = '';
        
        if (filteredPrayers.length === 0) {
            prayersGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #6b7280;">
                    <i class="fas fa-pray" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.2rem;">No prayer requests in this category yet.</p>
                    <p>Be the first to share a prayer request!</p>
                </div>
            `;
            return;
        }
        
        filteredPrayers.forEach(prayer => {
            const card = createPrayerCard(prayer);
            prayersGrid.appendChild(card);
        });
    }
    
    function createPrayerCard(prayer) {
        const card = document.createElement('div');
        card.className = 'prayer-card';
        card.dataset.prayerId = prayer.id;
        
        const date = new Date(prayer.date);
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        const categoryEmoji = getCategoryEmoji(prayer.category);
        
        card.innerHTML = `
            <div class="prayer-header">
                <div class="prayer-name">${escapeHtml(prayer.name)}</div>
                <div class="prayer-date">${dateStr}</div>
            </div>
            <div class="prayer-category">${categoryEmoji} ${prayer.category}</div>
            <div class="prayer-text">${escapeHtml(prayer.request)}</div>
            <div class="prayer-actions">
                <button class="pray-btn" onclick="prayForThis(${prayer.id})">
                    <i class="fas fa-praying-hands"></i> I Prayed
                </button>
                <div class="pray-count">
                    <i class="fas fa-heart"></i>
                    <span id="count-${prayer.id}">${prayer.prayCount}</span> prayed
                </div>
            </div>
        `;
        
        return card;
    }
    
    function getCategoryEmoji(category) {
        const emojis = {
            'Israel': '🇮🇱',
            'Salvation': '✝️',
            'Healing': '💚',
            'Family': '👨‍👩‍👧‍👦',
            'Provision': '💰',
            'Protection': '🛡️',
            'Thanksgiving': '🙌',
            'Other': '📝'
        };
        return emojis[category] || '📝';
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function loadPrayers() {
        const stored = localStorage.getItem('vfi_prayers');
        if (stored) {
            prayers = JSON.parse(stored);
        }
    }
    
    function savePrayers() {
        localStorage.setItem('vfi_prayers', JSON.stringify(prayers));
    }
    
    function addSamplePrayers() {
        prayers = [
            {
                id: 1,
                name: 'Sarah M.',
                category: 'Israel',
                request: 'Please pray for the peace of Jerusalem and protection for all citizens of Israel. May God\'s hand be upon His chosen people.',
                date: new Date(Date.now() - 86400000 * 2).toISOString(),
                prayCount: 45
            },
            {
                id: 2,
                name: 'David K.',
                category: 'Salvation',
                request: 'Praying for my Jewish friend to come to know Yeshua as Messiah. Please join me in interceding for his salvation.',
                date: new Date(Date.now() - 86400000 * 1).toISOString(),
                prayCount: 32
            },
            {
                id: 3,
                name: 'Rebecca L.',
                category: 'Healing',
                request: 'My mother is battling cancer. Please pray for complete healing and strength for our family during this difficult time.',
                date: new Date(Date.now() - 86400000 * 3).toISOString(),
                prayCount: 67
            },
            {
                id: 4,
                name: 'Michael T.',
                category: 'Thanksgiving',
                request: 'Praise God! After months of prayer, my son has given his life to Yeshua! Thank you all for praying with us!',
                date: new Date().toISOString(),
                prayCount: 89
            },
            {
                id: 5,
                name: 'Ruth H.',
                category: 'Family',
                request: 'Please pray for restoration in my marriage. We are going through a very difficult season and need God\'s intervention.',
                date: new Date(Date.now() - 86400000 * 5).toISOString(),
                prayCount: 54
            },
            {
                id: 6,
                name: 'Joshua B.',
                category: 'Protection',
                request: 'My brother is serving in the IDF. Please pray for his protection and the protection of all Israeli soldiers defending the nation.',
                date: new Date(Date.now() - 86400000 * 1).toISOString(),
                prayCount: 78
            }
        ];
        savePrayers();
    }
    
    // Make prayForThis available globally
    window.prayForThis = function(prayerId) {
        const prayer = prayers.find(p => p.id === prayerId);
        if (prayer) {
            prayer.prayCount++;
            savePrayers();
            
            // Update UI
            const countElement = document.getElementById(`count-${prayerId}`);
            if (countElement) {
                countElement.textContent = prayer.prayCount;
                
                // Add animation
                countElement.parentElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    countElement.parentElement.style.transform = 'scale(1)';
                }, 200);
            }
            
            // Show thank you message
            const card = document.querySelector(`[data-prayer-id="${prayerId}"]`);
            if (card) {
                const btn = card.querySelector('.pray-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Thank You!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 2000);
            }
        }
    };
});
