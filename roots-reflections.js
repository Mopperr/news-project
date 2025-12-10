// Roots & Reflections Videos JavaScript
// Loads and displays videos from the Roots & Reflections catalog

let allVideos = [];
let filteredVideos = [];
let currentSort = 'oldest'; // Default to oldest first (Episode 1 first)
let currentSearch = '';

// Load videos from catalog
async function loadVideos() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const videosGrid = document.getElementById('videosGrid');
    const noResults = document.getElementById('noResults');
    
    console.log('🎥 ============================================');
    console.log('🎥 ROOTS & REFLECTIONS - Starting to load videos...');
    console.log('🎥 ============================================');
    
    // Check DOM elements
    console.log('📋 DOM Elements:', {
        loadingSpinner: !!loadingSpinner,
        videosGrid: !!videosGrid,
        noResults: !!noResults
    });
    
    if (!videosGrid) {
        console.error('❌ CRITICAL: videosGrid element NOT FOUND!');
        return;
    }
    
    try {
        console.log('📂 Attempting to load: roots_reflections_videos_catalog.json');
        
        // Load the Roots & Reflections catalog
        const response = await fetch('roots_reflections_videos_catalog.json');
        
        console.log('📡 Fetch response:', {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText
        });
        
        if (!response.ok) {
            throw new Error(`Could not load videos catalog (Status: ${response.status})`);
        }
        
        const catalog = await response.json();
        allVideos = catalog.videos || [];
        
        console.log('📦 Catalog loaded:', {
            totalVideos: allVideos.length
        });
        
        if (allVideos.length === 0) {
            throw new Error('No videos found in catalog');
        }
        
        // Update stats
        const totalVideosEl = document.getElementById('totalVideos');
        if (totalVideosEl) {
            totalVideosEl.textContent = allVideos.length;
        }
        
        // Calculate channel age
        if (allVideos.length > 0) {
            const oldestVideo = allVideos[allVideos.length - 1];
            const publishDate = new Date(oldestVideo.publishedAt);
            const now = new Date();
            const years = Math.floor((now - publishDate) / (1000 * 60 * 60 * 24 * 365));
            const channelAgeEl = document.getElementById('channelAge');
            if (channelAgeEl) {
                channelAgeEl.textContent = years + '+';
            }
        }
        
        // Initial display
        console.log('✅ Calling applyFilters to display videos...');
        applyFilters();
        
        console.log('🎥 ============================================');
        console.log('🎥 Videos loaded successfully!');
        console.log('🎥 ============================================');
        
    } catch (error) {
        console.error('❌ Error loading videos:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        if (loadingSpinner) {
            loadingSpinner.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
                <p style="color: #ef4444;">Error loading videos. Please try again later.</p>
                <p style="color: #666; font-size: 14px;">${error.message}</p>
            `;
        }
    }
}

// Extract episode number from video title - try multiple patterns
function extractEpisodeNumber(title) {
    // Try multiple patterns to match different title formats
    const patterns = [
        /Roots\s*&\s*Reflections\s*(\d+)/i,  // "Roots & Reflections 1"
        /Episode\s*(\d+)/i,                    // "Episode 45" or "Episode  45"
        /Ep\.?\s*(\d+)/i,                      // "Ep 45" or "Ep. 45"
        /—Episode\s*(\d+)/i,                   // "Title—Episode 45"
        /Episode\s*#?\s*(\d+)/i,               // "Episode #45"
        /#(\d+)/,                               // "#45"
        /^(\d+)—/,                             // "45—Title"
        /\s(\d+)\s*—\s*Roots/i                 // "The Road to Eilat 45 — Roots"
    ];
    
    for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match) {
            const num = parseInt(match[1]);
            if (num > 0 && num < 1000) { // Sanity check
                return num;
            }
        }
    }
    return null;
}

// Apply search and sort filters
function applyFilters() {
    console.log('applyFilters called, allVideos length:', allVideos.length);
    const loadingSpinner = document.getElementById('loadingSpinner');
    const videosGrid = document.getElementById('videosGrid');
    const noResults = document.getElementById('noResults');
    
    // No search filter - show all videos
    filteredVideos = [...allVideos];
    
    // Always filter by search if there was a search (removed search box but keep functionality)
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filteredVideos = allVideos.filter(video => 
            video.title.toLowerCase().includes(searchLower) ||
            video.description.toLowerCase().includes(searchLower)
        );
    } else {
        filteredVideos = [...allVideos];
    }
    
    // Sort videos
    switch (currentSort) {
        case 'newest':
            filteredVideos.sort((a, b) => {
                const epA = extractEpisodeNumber(a.title);
                const epB = extractEpisodeNumber(b.title);
                
                // If both have episodes, sort numerically (newest first)
                if (epA !== null && epB !== null) {
                    return epB - epA;
                }
                
                // If only one has episode, prioritize it
                if (epB !== null) return -1;
                if (epA !== null) return 1;
                
                // If neither have episodes, sort by date (newest first)
                return new Date(b.publishedAt) - new Date(a.publishedAt);
            });
            break;
        case 'oldest':
            filteredVideos.sort((a, b) => {
                const epA = extractEpisodeNumber(a.title);
                const epB = extractEpisodeNumber(b.title);
                
                // If both have episodes, sort numerically (oldest first)
                if (epA !== null && epB !== null) {
                    return epA - epB;
                }
                
                // If only one has episode, prioritize it
                if (epA !== null) return -1;
                if (epB !== null) return 1;
                
                // If neither have episodes, sort by date (oldest first)
                return new Date(a.publishedAt) - new Date(b.publishedAt);
            });
            break;
        case 'title':
            filteredVideos.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    // Display results
    console.log('Hiding loading spinner, filtered videos:', filteredVideos.length);
    if (filteredVideos.length > 0) {
        console.log('First 3 videos after sort:', 
            filteredVideos.slice(0, 3).map(v => `Episode ${extractEpisodeNumber(v.title)}: ${v.title}`));
    }
    loadingSpinner.style.display = 'none';
    
    if (filteredVideos.length === 0) {
        noResults.style.display = 'block';
        videosGrid.innerHTML = '';
    } else {
        noResults.style.display = 'none';
        displayVideos(filteredVideos);
    }
}

// Display videos in simple grid (no pagination)
function displayVideos(videos) {
    console.log('displayVideos called with', videos.length, 'videos');
    const videosGrid = document.getElementById('videosGrid');
    
    // Build HTML for all videos
    let html = '';
    
    videos.forEach((video, index) => {
        // Extract episode number from title if available
        const episodeNumber = extractEpisodeNumber(video.title);
        
        // Debug: log if episode number not found
        if (!episodeNumber) {
            console.log(`⚠️ No episode found for: "${video.title}"`);
        } else {
            console.log(`✓ Episode ${episodeNumber}: "${video.title}"`);
        }
        
        // Format date
        const publishDate = new Date(video.publishedAt);
        const formattedDate = publishDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Get video description (truncate if too long)
        const description = video.description || '';
        const truncatedDesc = description.length > 120 
            ? description.substring(0, 120) + '...' 
            : description;
        
        html += `
            <div class="video-card" onclick="openVideoModal('${video.videoId}')">
                <div class="video-thumbnail">
                    <img src="${video.thumbnails.high.url}" 
                         alt="${escapeHtml(video.title)}"
                         onerror="this.src='${video.thumbnails.medium.url}'">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                    ${episodeNumber ? `<span class="episode-badge">Episode ${episodeNumber}</span>` : ''}
                </div>
                <div class="video-info">
                    <h3 class="video-title">${escapeHtml(video.title)}</h3>
                    ${truncatedDesc ? `<p class="video-description">${escapeHtml(truncatedDesc)}</p>` : ''}
                    <div class="video-meta">
                        <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    console.log('Setting videosGrid innerHTML, HTML length:', html.length);
    videosGrid.innerHTML = html;
    console.log('Videos displayed successfully');
}

// Open video modal
function openVideoModal(videoId) {
    const modal = document.getElementById('videoModal');
    const modalVideoContainer = document.getElementById('modalVideoContainer');
    const modalInfo = document.getElementById('modalInfo');
    
    // Find video in filteredVideos array
    const video = filteredVideos.find(v => v.videoId === videoId);
    if (!video) return;
    
    // Create YouTube iframe
    modalVideoContainer.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    
    // Display video info
    const publishDate = new Date(video.publishedAt);
    const formattedDate = publishDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    modalInfo.innerHTML = `
        <h2>${escapeHtml(video.title)}</h2>
        <div class="video-meta" style="margin-bottom: 1.5rem; color: #94a3b8;">
            <span><i class="far fa-calendar"></i> ${formattedDate}</span>
        </div>
        ${video.description ? `<div class="description" style="color: #cbd5e1; line-height: 1.8; margin-bottom: 2rem;">${escapeHtml(video.description)}</div>` : ''}
        <div style="margin-top: 2rem;">
            <a href="${video.videoUrl}" target="_blank" 
               style="background: linear-gradient(135deg, #06b6d4, #0891b2); 
                      color: white; padding: 1rem 2rem; border-radius: 50px; 
                      text-decoration: none; display: inline-block; 
                      transition: all 0.3s ease; font-weight: 600;">
                <i class="fab fa-youtube"></i> Watch on YouTube
            </a>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideoContainer = document.getElementById('modalVideoContainer');
    
    modal.classList.remove('active');
    modalVideoContainer.innerHTML = ''; // Stop video playback
    document.body.style.overflow = 'auto';
}

// Handle sort change
function handleSortChange() {
    const sortSelect = document.getElementById('sortSelect');
    currentSort = sortSelect.value;
    applyFilters();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// Hamburger menu functionality for mobile nav
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ============================================');
    console.log('🚀 ROOTS & REFLECTIONS - DOM Content Loaded');
    console.log('🚀 ============================================');
    
    // Setup event listeners
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
        console.log('✅ Sort select event listener attached');
    } else {
        console.warn('⚠️ sortSelect element not found');
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
    
    // Hamburger menu logic
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMain = document.getElementById('navMain');
    
    if (hamburgerMenu && navMain) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navMain.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!hamburgerMenu.contains(e.target) && !navMain.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                navMain.classList.remove('active');
            }
        });
        
        const navLinks = navMain.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                navMain.classList.remove('active');
            });
        });
        
        console.log('✅ Hamburger menu initialized');
    }
    
    // Load videos
    console.log('📡 Starting video load operation...');
    loadVideos();
});
