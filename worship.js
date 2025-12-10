// Worship Videos JavaScript
// Loads and displays worship music videos

let worshipVideos = [];

// Load worship videos from Barry & Batya catalog
async function loadWorshipVideos() {
    console.log('🎵 Starting to load worship videos...');
    
    const worshipGrid = document.getElementById('worshipGrid');
    
    if (!worshipGrid) {
        console.error('❌ worshipGrid element not found!');
        return;
    }
    
    // Show loading state
    worshipGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #0038b8;"></i>
            <p style="margin-top: 20px; color: #666;">Loading worship videos...</p>
        </div>
    `;
    
    try {
        // Load Barry & Batya music catalog
        const response = await fetch('barry_batya_music_catalog.json?t=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error('Could not load worship videos catalog');
        }
        
        const catalog = await response.json();
        worshipVideos = catalog.videos || [];
        
        console.log(`✅ Loaded ${worshipVideos.length} worship videos`);
        
        if (worshipVideos.length === 0) {
            throw new Error('No videos found in catalog');
        }
        
        // Display videos
        displayWorshipVideos(worshipVideos);
        
    } catch (error) {
        console.error('❌ Error loading worship videos:', error);
        worshipGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ef4444;"></i>
                <p style="margin-top: 20px; color: #ef4444;">Error loading worship videos. Please try again later.</p>
                <p style="color: #666; font-size: 14px;">${error.message}</p>
            </div>
        `;
    }
}

// Display worship videos in grid
function displayWorshipVideos(videos) {
    console.log('📺 Displaying worship videos...');
    
    const worshipGrid = document.getElementById('worshipGrid');
    
    if (!worshipGrid) {
        console.error('❌ worshipGrid element not found!');
        return;
    }
    
    // Clear loading state
    worshipGrid.innerHTML = '';
    
    // Create video cards
    videos.forEach((video, index) => {
        const videoCard = createWorshipVideoCard(video, index);
        worshipGrid.appendChild(videoCard);
    });
    
    console.log(`✅ Displayed ${videos.length} worship videos`);
}

// Create worship video card
function createWorshipVideoCard(video, index) {
    const card = document.createElement('div');
    card.className = 'worship-card';
    
    const videoId = video.videoId;
    const thumbnail = video.thumbnails?.high?.url || 
                     video.thumbnails?.medium?.url || 
                     `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    
    const title = video.title || 'Untitled';
    const channelTitle = video.channelTitle || 'Barry & Batya Segal';
    
    // Format date
    let formattedDate = '';
    if (video.publishedAt) {
        const publishDate = new Date(video.publishedAt);
        formattedDate = publishDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    }
    
    card.innerHTML = `
        <div class="worship-video-thumbnail">
            <img src="${thumbnail}" 
                 alt="${escapeHtml(title)}"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${videoId}/maxresdefault.jpg';">
            <div class="worship-video-overlay">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="worship-video-info">
            <h3 class="worship-video-title">${escapeHtml(title)}</h3>
            <p class="worship-video-channel">${escapeHtml(channelTitle)}</p>
            ${formattedDate ? `<p class="worship-video-date"><i class="fas fa-calendar"></i> ${formattedDate}</p>` : ''}
        </div>
    `;
    
    // Click handler to open video modal
    card.addEventListener('click', () => {
        openWorshipVideoModal(video);
    });
    
    return card;
}

// Open worship video modal
function openWorshipVideoModal(video) {
    console.log('🎬 Opening worship video modal:', video.title);
    
    const modal = document.getElementById('worshipModal');
    const modalIframe = document.getElementById('worshipModalIframe');
    const modalTitle = document.getElementById('worshipModalTitle');
    const modalChannel = document.getElementById('worshipModalChannel');
    const modalDate = document.getElementById('worshipModalDate');
    const modalYoutubeBtn = document.getElementById('worshipModalYoutubeBtn');
    
    if (!modal || !modalIframe) {
        console.error('❌ Worship modal elements not found!');
        return;
    }
    
    // Set video in iframe
    const videoId = video.videoId;
    modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    
    // Set title
    if (modalTitle) {
        modalTitle.textContent = video.title || 'Worship Video';
    }
    
    // Set channel
    if (modalChannel) {
        modalChannel.textContent = video.channelTitle || 'Barry & Batya Segal';
    }
    
    // Set date
    if (modalDate && video.publishedAt) {
        const publishDate = new Date(video.publishedAt);
        modalDate.textContent = publishDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Set YouTube button link
    if (modalYoutubeBtn) {
        modalYoutubeBtn.href = `https://www.youtube.com/watch?v=${videoId}`;
    }
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close worship video modal
function closeWorshipVideoModal() {
    console.log('✖️ Closing worship video modal');
    
    const modal = document.getElementById('worshipModal');
    const modalIframe = document.getElementById('worshipModalIframe');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    if (modalIframe) {
        modalIframe.src = '';
    }
}

// HTML escape utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎵 Worship page initialized');
    
    // Setup modal close button
    const modalClose = document.getElementById('worshipModalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeWorshipVideoModal);
    }
    
    // Close modal on backdrop click
    const modal = document.getElementById('worshipModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeWorshipVideoModal();
            }
        });
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeWorshipVideoModal();
        }
    });
    
    // Load worship videos
    loadWorshipVideos();
});
