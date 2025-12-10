// API Configuration - Auto-detects local vs production
// For production: Set RENDER_API_URL to your Render backend URL after deployment
// Example: https://vfi-news-api.onrender.com/api
const RENDER_API_URL = 'https://news-project-hqfh.onrender.com/api';
const LOCAL_API_URL = 'http://127.0.0.1:5500/api';

// Auto-detect if running locally or in production
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

// Use local API if running locally AND it starts with http://127.0.0.1
// Otherwise use Render API
const USE_LOCAL_API = isLocalhost && LOCAL_API_URL.includes('127.0.0.1');
const API_URL = USE_LOCAL_API ? LOCAL_API_URL : RENDER_API_URL;

// Currents News API Configuration (backup - not used)
const API_BASE_URL = 'https://api.currentsapi.services/v1';
const API_KEY = 'HkolZBL3rdntWFxAKNgTCIk5tNjeEMqyck_u4L-44nRaEyIJ';

// YouTube Configuration
const YOUTUBE_API_KEY = 'AIzaSyBelWh3h-9xBSHXKN8oKMY3ieWpM6WaB0M';
const YOUTUBE_CHANNEL_ID = 'UCgbcHAR6wp5mtxZltb3xVZQ';
const YOUTUBE_LOCAL_API = 'http://127.0.0.1:8081/api/youtube';
const USE_YOUTUBE_LOCAL = false; // Use RSS feed fetcher (no quota limits) - DISABLED, using fallback videos

// Weather API Configuration
const WEATHER_API_KEY = 'ba2a50681ffed31ce97da2d5cf03e17f'; // OpenWeatherMap API key
const JERUSALEM_COORDS = { lat: 31.7683, lon: 35.2137 };

// DOM Elements - will be initialized after DOM loads
let newsGrid;
let videosGrid;
let featuredVideo;
let featuredArticle;
let loading;
let errorMessage;
let searchInput;
let searchBtn;
let navButtons;
let modal;
let modalBody;
let modalClose;

// State
let currentCategory = 'all';
let currentSearchQuery = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ============================================');
    console.log('🚀 INDEX.HTML - DOM Content Loaded');
    console.log('🚀 ============================================');
    
    // Initialize DOM elements
    newsGrid = document.getElementById('newsGrid');
    videosGrid = document.getElementById('videosGrid');
    loading = document.getElementById('loading');
    errorMessage = document.getElementById('errorMessage');
    searchInput = document.getElementById('searchInput');
    searchBtn = document.getElementById('searchBtn');
    navButtons = document.querySelectorAll('.nav-btn');
    
    // Video modal elements
    const videoModal = document.getElementById('videoModal');
    const videoModalClose = document.getElementById('videoModalClose');
    const articleModal = document.getElementById('articleModal');
    const articleModalClose = document.getElementById('articleModalClose');
    
    console.log('📋 DOM Elements initialized');
    
    // Modal Event Listeners
    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeVideoModal);
    }
    if (articleModalClose) {
        articleModalClose.addEventListener('click', closeArticleModal);
    }
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideoModal();
        });
    }
    if (articleModal) {
        articleModal.addEventListener('click', (e) => {
            if (e.target === articleModal) closeArticleModal();
        });
    }

    // Load all content
    console.log('📡 Loading featured content...');
    loadFeaturedContent();
    
    console.log('📡 Loading VFI videos...');
    fetchYouTubeVideos();
    
    console.log('📡 Loading news articles...');
    fetchLatestNews();
    
    console.log('📖 Loading Bible verses...');
    loadBibleVerses();
    
    // Setup Show All Articles button
    const showAllNewsBtn = document.getElementById('showAllNewsBtn');
    if (showAllNewsBtn) {
        showAllNewsBtn.addEventListener('click', toggleShowAllArticles);
    }
    
    console.log('🚀 ============================================');
    console.log('🚀 Initialization complete!');
    console.log('🚀 ============================================');
});

// Update Header Date
function updateHeaderDate() {
    const dateElement = document.getElementById('headerDate');
    if (dateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Jerusalem'
        };
        const date = new Date().toLocaleDateString('en-US', options);
        dateElement.textContent = date;
    }
}

// Update Header Time
function updateHeaderTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Jerusalem'
        };
        const time = new Date().toLocaleTimeString('en-US', options);
        timeElement.textContent = time;
    }
}

// Fetch Jerusalem Weather from API or local JSON file
async function fetchJerusalemWeather() {
    try {
        let weatherData;
        
        // Try API first (works in both local and production)
        try {
            const apiResponse = await fetch(`${API_URL}/weather/jerusalem`);
            if (apiResponse.ok) {
                const apiData = await apiResponse.json();
                if (apiData.status === 'ok' && apiData.weather) {
                    weatherData = {
                        status: 'ok',
                        temperature: Math.round(apiData.weather.temp),
                        feels_like: Math.round(apiData.weather.feels_like),
                        description: apiData.weather.description,
                        updated: apiData.weather.updated
                    };
                }
            }
        } catch (apiError) {
            console.log('API weather not available, falling back to local file');
        }
        
        // Fallback to local weather_data.json file if API fails
        if (!weatherData) {
            const response = await fetch('weather_data.json?t=' + new Date().getTime());
            if (!response.ok) {
                throw new Error('Weather file not found');
            }
            weatherData = await response.json();
        }
        
        if (weatherData.status !== 'ok') {
            throw new Error('Weather data error');
        }
        
        // Update temperature with weather icon
        const tempElement = document.getElementById('weatherTemp');
        if (tempElement) {
            const temp = weatherData.temperature;
            const description = weatherData.description.toLowerCase();
            
            // Choose icon based on weather description
            let icon = 'fa-cloud-sun';
            if (description.includes('clear')) icon = 'fa-sun';
            else if (description.includes('rain')) icon = 'fa-cloud-rain';
            else if (description.includes('cloud')) icon = 'fa-cloud';
            else if (description.includes('storm') || description.includes('thunder')) icon = 'fa-cloud-bolt';
            else if (description.includes('snow')) icon = 'fa-snowflake';
            else if (description.includes('mist') || description.includes('fog')) icon = 'fa-smog';
            
            tempElement.innerHTML = `<i class="fas ${icon}"></i> ${temp}°C`;
        }
        
        // Update description
        const descElement = document.getElementById('weatherDesc');
        if (descElement) {
            descElement.textContent = weatherData.description;
        }
        
        // Update feels like temperature
        const feelsLikeElement = document.getElementById('weatherFeelsLike');
        if (feelsLikeElement && weatherData.feels_like !== undefined) {
            feelsLikeElement.textContent = `Feels like ${weatherData.feels_like}°C`;
        }
        
        console.log('✓ Weather loaded from local file:', weatherData);
        console.log('  Last updated:', weatherData.updated);
    } catch (error) {
        console.error('Error loading weather:', error);
        // Set fallback values with icon
        const tempElement = document.getElementById('weatherTemp');
        const descElement = document.getElementById('weatherDesc');
        const feelsLikeElement = document.getElementById('weatherFeelsLike');
        if (tempElement) tempElement.innerHTML = '<i class="fas fa-cloud-sun"></i> 20°C';
        if (descElement) descElement.textContent = 'Partly Cloudy';
        if (feelsLikeElement) feelsLikeElement.textContent = 'Feels like 19°C';
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load Worship Music Videos
async function loadWorshipMusic() {
    console.log('🎵 === Starting loadWorshipMusic ===');
    
    const worshipGrid = document.getElementById('worshipGrid');
    
    if (!worshipGrid) {
        console.log('ℹ️ worshipGrid element not found (this is OK if not on worship section)');
        return;
    }
    
    console.log('✅ worshipGrid element found');
    
    try {
        console.log('📂 Attempting to load: barry_batya_music_catalog.json');
        
        // Load Barry & Batya Segal music catalog
        const response = await fetch('barry_batya_music_catalog.json');
        
        console.log('📡 Fetch response:', {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText
        });
        
        if (!response.ok) {
            throw new Error(`Could not load music catalog (Status: ${response.status})`);
        }
        
        const catalog = await response.json();
        const videos = catalog.videos || [];
        
        console.log('📦 Music catalog loaded:', {
            totalVideos: videos.length
        });
        
        // Display first 12 videos
        const displayVideos = videos.slice(0, 12);
        
        worshipGrid.innerHTML = displayVideos.map(video => {
            const safeTitle = escapeHtml(video.title);
            const pubDate = new Date(video.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            
            return `
                <div class="worship-card" onclick="openVideoModal('${video.videoId}', '${escapeHtml(video.title).replace(/'/g, "&#39;")}')">
                    <div class="worship-thumbnail">
                        <img src="${video.thumbnails.high.url}" 
                             alt="${safeTitle}"
                             onerror="this.src='${video.thumbnails.medium.url}'">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="worship-info">
                        <h3 class="worship-title">${safeTitle}</h3>
                        <p class="worship-date">${pubDate}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log(`✅ Loaded ${displayVideos.length} Barry & Batya Segal worship videos`);
        
    } catch (error) {
        console.error('❌ Error loading worship videos:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        // Fallback to hardcoded videos if catalog fails
        console.log('⚠️ Using fallback worship videos');
        
        const fallbackVideos = [
            { id: 'sdNJ6djL1c4', title: 'You Are Holy - Barry & Batya Segal' },
            { id: 'd2ILnGedg2g', title: 'Kadosh (Holy) - Barry & Batya Segal' },
            { id: 'HeTDyo2FwKk', title: 'Baruch Haba (Blessed Is He) - Barry & Batya Segal' },
            { id: 'klDrARxA8io', title: 'Hallelu Et Adonai - Barry & Batya Segal' },
            { id: '9yDt8B170N4', title: 'Shalom Jerusalem - Barry & Batya Segal' },
            { id: 'iTbXjRZANDo', title: 'Hodu L\'adonai - Barry & Batya Segal' }
        ];
        
        worshipGrid.innerHTML = fallbackVideos.map(video => `
            <div class="worship-card" onclick="openVideoModal('${video.id}', '${video.title}')">
                <div class="worship-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" 
                         alt="${video.title}"
                         onerror="this.src='https://img.youtube.com/vi/${video.id}/hqdefault.jpg'">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="worship-info">
                    <h3 class="worship-title">${video.title}</h3>
                </div>
            </div>
        `).join('');
    }
}

// Auto-generated VFI News videos - Last updated: 2025-12-03
// ALL VFI PLAYLIST VIDEOS - Latest 20 videos from VFI News YouTube channel
const ALL_VFI_VIDEOS = [
    { id: { videoId: 'gjSpbJDkFKc' }, snippet: { title: 'The Prophecy That Launched Vision for Israel', description: 'In 1991, as Israel faced the threat of Saddam Hussein during the Gulf War, an unexpected prophetic moment changed the course...', publishedAt: '2025-12-02T11:01:20Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/gjSpbJDkFKc/hqdefault.jpg' } } } },
    { id: { videoId: 'WEStUv35fRE' }, snippet: { title: 'Israel Update: IDF Strikes Hamas Commanders as Ceasefire Wavers | VFI News', description: 'The latest Israel update covers a critical moment in the Gaza ceasefire as the IDF launches targeted strikes on Hamas...', publishedAt: '2025-12-01T23:08:25Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/WEStUv35fRE/hqdefault.jpg' } } } },
    { id: { videoId: 'JfxEqM4sMPw' }, snippet: { title: 'Vision for Israel: The Incredible Story Behind 30 Years of Impact and Hope', description: 'Vision for Israel: The Incredible Story Behind 30 Years of Impact and Hope tells the true story of how Barry and Batia Segal...', publishedAt: '2025-11-28T09:57:50Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/JfxEqM4sMPw/hqdefault.jpg' } } } },
    { id: { videoId: 'MIxbj-TdZow' }, snippet: { title: 'NYC Elects a Mayor Calling to \'Globalize the Intifada', description: 'New York City and Northern New Jersey make up the largest Jewish population center in the world outside of Israel...', publishedAt: '2025-11-24T23:00:25Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/MIxbj-TdZow/hqdefault.jpg' } } } },
    { id: { videoId: 'Dr76xIGIV6U' }, snippet: { title: 'The Hidden Power Struggle Inside Palestine EXPOSED', description: 'Palestinian politics is often presented as a modern national struggle, but the reality is far more complex...', publishedAt: '2025-11-24T19:00:12Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/Dr76xIGIV6U/hqdefault.jpg' } } } },
    { id: { videoId: '9OdvT4MzrfE' }, snippet: { title: 'What Hamas Hid for 11 Years — The Truth About Hadar Goldin', description: 'IDF Lieutenant Hadar Goldin was killed during Operation Protective Edge in 2014...', publishedAt: '2025-11-23T23:00:11Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/9OdvT4MzrfE/hqdefault.jpg' } } } },
    { id: { videoId: 'XZiQKLlqiAo' }, snippet: { title: 'Nationalism vs Pan-Arabism: The PLO\'s Internal War', description: 'By 1993, the PLO had carried out dozens of terrorist attacks against Israel...', publishedAt: '2025-11-23T18:45:02Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/XZiQKLlqiAo/hqdefault.jpg' } } } },
    { id: { videoId: 'ER9HgrA6Fd0' }, snippet: { title: 'Tehran Could Collapse — Iran\'s Crisis Exposed', description: 'Iran is facing one of the most severe environmental and economic crises in its modern history...', publishedAt: '2025-11-22T22:45:01Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/ER9HgrA6Fd0/hqdefault.jpg' } } } },
    { id: { videoId: '1ldqh0FfUq4' }, snippet: { title: 'How Britain and France Created the Modern Middle East', description: 'The modern Middle East did not emerge organically out of unified peoples or ancient national identities...', publishedAt: '2025-11-22T15:45:00Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/1ldqh0FfUq4/hqdefault.jpg' } } } },
    { id: { videoId: '-vzHulaERYs' }, snippet: { title: 'How the Reformation Sparked Christian Zionism', description: 'The modern Christian Zionist movement did not appear suddenly in the 20th century...', publishedAt: '2025-11-21T23:15:00Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/-vzHulaERYs/hqdefault.jpg' } } } },
    { id: { videoId: 'Nmalt2noWOo' }, snippet: { title: 'How Hamas Was Really Born — The Untold Story', description: 'Hamas did not emerge out of nowhere. This video breaks down the real origins of Hamas...', publishedAt: '2025-11-21T16:29:36Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/Nmalt2noWOo/hqdefault.jpg' } } } },
    { id: { videoId: '8uPoUrdsAiU' }, snippet: { title: 'The Terrifying Truth Inside Hamas, Hezbollah & PLO Charters | VFI News', description: 'In this special edition of VFI News, we reveal what the charters of Hamas, Hezbollah, and the PLO actually say...', publishedAt: '2025-11-20T16:44:24Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/8uPoUrdsAiU/hqdefault.jpg' } } } },
    { id: { videoId: 'og2QLpWu_oc' }, snippet: { title: 'A Joyful Night for the Children of Israel\'s Defenders | Vision for Israel', description: 'On August 13, 2025, Vision for Israel welcomed IDF reservists with their families...', publishedAt: '2025-11-20T15:22:18Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/og2QLpWu_oc/hqdefault.jpg' } } } },
    { id: { videoId: 'qaGsrYnLP7w' }, snippet: { title: 'Israel Under Pressure: Netanyahu\'s Warning, UN Showdown & Iran\'s Escalating Threat | VFI News', description: 'In this week\'s update, Israel faces mounting pressure on multiple fronts...', publishedAt: '2025-11-17T22:22:17Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/qaGsrYnLP7w/hqdefault.jpg' } } } },
    { id: { videoId: 'eWQH0uyOSfc' }, snippet: { title: '2,000 Missiles Ready: Iran\'s Deadly Warning to Israel | VFI News', description: 'In this urgent episode of VFI News, Barry Segal reports on Iran\'s shocking threat...', publishedAt: '2025-11-13T15:19:07Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/eWQH0uyOSfc/hqdefault.jpg' } } } },
    { id: { videoId: '6JXJDScH8L0' }, snippet: { title: 'Iranian Plot Foiled, Northern Tensions Rise & Signs of Renewal in Israel | VFI News Update', description: 'Stay informed with this VFI News update as Mexico reportedly thwarts an Iranian plot...', publishedAt: '2025-11-10T23:03:59Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/6JXJDScH8L0/hqdefault.jpg' } } } },
    { id: { videoId: 'IlMvmWPPus4' }, snippet: { title: 'The War is Over But There is No Peace | VFI News', description: 'Although the war has officially ended, Israel finds itself in a reality where the conflict is far from finished...', publishedAt: '2025-11-06T16:35:19Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/IlMvmWPPus4/hqdefault.jpg' } } } },
    { id: { videoId: 'YdcZJOa5bWA' }, snippet: { title: 'Prophetic Convergence: Why God Blesses Those Who Bless Israel | VFI News', description: 'In this powerful special presentation from VFI News...', publishedAt: '2025-11-04T15:59:27Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/YdcZJOa5bWA/hqdefault.jpg' } } } },
    { id: { videoId: 'cLPFV1OXj9Y' }, snippet: { title: 'Israel Warns Lebanon: Disarm Hezbollah or Face New Offensive | VFI News', description: 'Israel has issued a stark warning to Lebanon following increased rocket fire...', publishedAt: '2025-11-03T23:56:34Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/cLPFV1OXj9Y/hqdefault.jpg' } } } },
    { id: { videoId: 'F0HbW9vYDNM' }, snippet: { title: 'Trump Warns Hamas: Disarm or Be Destroyed!', description: 'In a groundbreaking development, President-elect Donald Trump has issued a forceful ultimatum to Hamas...', publishedAt: '2025-10-30T18:00:04Z', thumbnails: { high: { url: 'https://i.ytimg.com/vi/F0HbW9vYDNM/hqdefault.jpg' } } } }
];

// Load All Featured Content
async function loadFeaturedContent() {
    await Promise.all([
        loadFeaturedVFIVideo(),
        loadFeaturedRoots()
    ]);
}

// Load Featured VFI Video
async function loadFeaturedVFIVideo() {
    try {
        const response = await fetch('vfi_news_videos_catalog.json');
        const catalog = await response.json();
        const video = catalog.videos[0];
        
        const container = document.getElementById('featuredVFIVideo');
        if (!container) return;
        
        const date = new Date(video.publishedAt);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const thumbnail = video.thumbnails.maxres?.url || video.thumbnails.high?.url;
        
        container.innerHTML = `
            <div class="featured-thumbnail-wrapper" onclick="openVideoModal('${video.videoId}', '${video.title.replace(/'/g, "\\'")}', '${dateStr}', '${video.videoUrl}')">
                <img src="${thumbnail}" alt="${video.title}">
                <div class="featured-play-icon">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="featured-info-box">
                <h3 class="featured-title">${video.title}</h3>
                <div class="featured-meta">
                    <i class="far fa-calendar"></i> ${dateStr}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading featured VFI video:', error);
    }
}

// Load Featured Roots & Reflections
async function loadFeaturedRoots() {
    try {
        const response = await fetch('roots_reflections_videos_catalog.json');
        const catalog = await response.json();
        const video = catalog.videos[0];
        
        const container = document.getElementById('featuredRoots');
        if (!container) return;
        
        const date = new Date(video.publishedAt);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const thumbnail = video.thumbnails.maxres?.url || video.thumbnails.high?.url;
        
        container.innerHTML = `
            <div class="featured-thumbnail-wrapper" onclick="openVideoModal('${video.videoId}', '${video.title.replace(/'/g, "\\'")}', '${dateStr}', '${video.videoUrl}')">
                <img src="${thumbnail}" alt="${video.title}">
                <div class="featured-play-icon">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="featured-info-box">
                <h3 class="featured-title">${video.title}</h3>
                <div class="featured-meta">
                    <i class="far fa-calendar"></i> ${dateStr}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading featured Roots video:', error);
    }
}

// Load Featured Blog
async function loadFeaturedBlog() {
    try {
        const response = await fetch('vfi_blog_catalog.json');
        const catalog = await response.json();
        const article = catalog.articles[0];
        
        const container = document.getElementById('featuredBlog');
        if (!container) return;
        
        const date = new Date(article.published);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        container.innerHTML = `
            <div class="featured-thumbnail-wrapper" onclick="window.open('${article.link}', '_blank')">
                <img src="${article.image || 'https://via.placeholder.com/800x450/0055cc/ffffff?text=Blog'}" alt="${article.title}">
            </div>
            <div class="featured-info-box">
                <h3 class="featured-title">${article.title}</h3>
                <div class="featured-meta">
                    <i class="far fa-calendar"></i> ${dateStr}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading featured blog:', error);
    }
}

// Load Featured Testimony
async function loadFeaturedTestimony() {
    const container = document.getElementById('featuredTestimony');
    if (!container) return;
    
    // Sample testimony - you can replace with actual data
    container.innerHTML = `
        <div class="featured-thumbnail-wrapper" onclick="window.location.href='testimonials.html'">
            <img src="https://via.placeholder.com/800x450/0055cc/ffffff?text=Testimonies" alt="Testimonies">
        </div>
        <div class="featured-info-box">
            <h3 class="featured-title">Lives Transformed Through VFI</h3>
            <div class="featured-meta">
                <i class="fas fa-heart"></i> Read More Stories
            </div>
        </div>
    `;
}

// Load Featured Shop Items
async function loadFeaturedShop() {
    const container = document.getElementById('featuredShop');
    if (!container) return;
    
    // Sample shop items - replace with actual shop data
    const shopItems = [
        {
            name: 'Support Israel T-Shirt',
            price: '$24.99',
            image: 'https://via.placeholder.com/400x400/0055cc/ffffff?text=T-Shirt',
            link: 'shop.html'
        },
        {
            name: 'Pray for Peace Mug',
            price: '$14.99',
            image: 'https://via.placeholder.com/400x400/0055cc/ffffff?text=Mug',
            link: 'shop.html'
        }
    ];
    
    container.innerHTML = shopItems.map(item => `
        <div class="shop-item-mini" onclick="window.location.href='${item.link}'">
            <div class="shop-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="shop-item-info">
                <h4 class="shop-item-name">${item.name}</h4>
                <div class="shop-item-price">${item.price}</div>
            </div>
        </div>
    `).join('');
}

// Auto-rotate featured content indices
let featuredVideoIndex = 0;
let featuredArticleIndex = 0;
let blogArticles = [];

// Featured video (rotates through first 3 videos)

let FEATURED_VIDEO = null;
let FALLBACK_VIDEOS = [];

// Auto-rotation function for video only
function rotateVideos() {
    const totalVideos = ALL_VFI_VIDEOS.length;
    
    // Rotate featured video through first 3 videos (0, 1, 2)
    featuredVideoIndex = (featuredVideoIndex + 1) % Math.min(3, totalVideos);
    if (ALL_VFI_VIDEOS[featuredVideoIndex]) {
        displayFeaturedVideo(ALL_VFI_VIDEOS[featuredVideoIndex]);
        console.log(`✓ Rotated to Featured Video #${featuredVideoIndex + 1}: ${ALL_VFI_VIDEOS[featuredVideoIndex].snippet.title}`);
    }
}

// Auto-rotation function for blog articles
function rotateArticles() {
    if (blogArticles && blogArticles.length > 0) {
        featuredArticleIndex = (featuredArticleIndex + 1) % blogArticles.length;
        displayFeaturedArticle(blogArticles[featuredArticleIndex]);
        console.log(`✓ Rotated to Article #${featuredArticleIndex + 1}: ${blogArticles[featuredArticleIndex].title}`);
    }
}

// Video pagination variables
let allVideos = [];
let displayedVideoCount = 20;
const videosPerLoad = 15;
let loadMoreClickCount = 0;

// Fetch YouTube Videos
async function fetchYouTubeVideos() {
    console.log('🎥 === Starting fetchYouTubeVideos ===');
    
    const videosGrid = document.getElementById('videosGrid');
    
    if (!videosGrid) {
        console.error('❌ videosGrid element not found!');
        return;
    }
    
    console.log('✅ videosGrid element found');
    
    try {
        console.log('📂 Loading VFI News videos catalog...');
        
        const response = await fetch('vfi_news_videos_catalog.json?t=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error(`Could not load video catalog (Status: ${response.status})`);
        }
        
        const catalog = await response.json();
        const videos = catalog.videos || [];
        
        if (videos.length === 0) throw new Error('No videos found');
        
        console.log(`📦 Loaded ${videos.length} videos from catalog`);

        // Store all videos (skip first one since it's featured)
        allVideos = videos.slice(1);
        
        // Display initial 20 videos
        displayVideos(allVideos.slice(0, displayedVideoCount), videosGrid);
        
        // Setup pagination buttons
        setupVideoPagination();

        console.log(`✅ Initial Videos Grid: ${Math.min(displayedVideoCount, allVideos.length)} videos displayed`);

    } catch (error) {
        console.error('❌ Error loading videos:', error);
        if (videosGrid) {
            videosGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px;"></i>
                    <p style="margin-top: 20px;">Error loading videos</p>
                    <p style="font-size: 14px; color: #666;">${error.message}</p>
                </div>
            `;
        }
    }
}

// Display Videos (for pagination)
function displayVideos(videos, container) {
    container.innerHTML = videos.map(video => {
        const thumbnail = video.thumbnails.high?.url || video.thumbnails.medium?.url;
        
        return `
            <div class="video-card-clean" onclick="openVideoModal('${video.videoId}', '${video.title.replace(/'/g, "\\'")}', '', '${video.videoUrl}')">
                <div class="video-thumbnail-clean">
                    <img src="${thumbnail}" alt="${video.title}" loading="lazy">
                    <div class="video-play-overlay-clean">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info-clean">
                    <h4 class="video-title-clean">${video.title}</h4>
                </div>
            </div>
        `;
    }).join('');
}

// Setup Video Pagination
function setupVideoPagination() {
    const showMoreBtn = document.getElementById('showMoreVideos');
    const showAllBtn = document.getElementById('showAllVideos');
    const container = document.getElementById('videoLoadMoreContainer');
    const videosGrid = document.getElementById('videosGrid');
    
    if (!showMoreBtn || !showAllBtn || !container || !videosGrid) return;
    
    // Show buttons if there are more videos to display
    if (allVideos.length > displayedVideoCount) {
        container.style.display = 'block';
        showMoreBtn.style.display = 'inline-flex';
    }
    
    // Show More button click handler
    showMoreBtn.addEventListener('click', () => {
        loadMoreClickCount++;
        displayedVideoCount += videosPerLoad;
        
        // Display more videos
        displayVideos(allVideos.slice(0, displayedVideoCount), videosGrid);
        
        // After 3 clicks, show "Show All" button
        if (loadMoreClickCount >= 3) {
            showMoreBtn.style.display = 'none';
            showAllBtn.style.display = 'inline-flex';
        }
        
        // Hide buttons if all videos are displayed
        if (displayedVideoCount >= allVideos.length) {
            container.style.display = 'none';
        }
        
        // Smooth scroll to new content
        setTimeout(() => {
            const lastVisibleCard = videosGrid.children[displayedVideoCount - videosPerLoad];
            if (lastVisibleCard) {
                lastVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    });
    
    // Show All button click handler
    showAllBtn.addEventListener('click', () => {
        displayedVideoCount = allVideos.length;
        displayVideos(allVideos, videosGrid);
        container.style.display = 'none';
    });
}

// Display All Videos (kept for backwards compatibility)
function displayAllVideos(videos, container) {
    container.innerHTML = videos.map(video => {
        const date = new Date(video.publishedAt);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const thumbnail = video.thumbnails.high?.url || video.thumbnails.medium?.url;
        
        return `
            <div class="video-card-clean" onclick="openVideoModal('${video.videoId}', '${video.title.replace(/'/g, "\\'")}', '${dateStr}', '${video.videoUrl}')">
                <div class="video-thumbnail-clean">
                    <img src="${thumbnail}" alt="${video.title}" loading="lazy">
                    <div class="video-play-overlay-clean">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info-clean">
                    <h4 class="video-title-clean">${video.title}</h4>
                    <div class="video-meta-clean">${dateStr}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Fetch VFI Blog Articles
async function fetchVFIBlogArticles() {
    console.log('📰 === Starting fetchVFIBlogArticles ===');
    
    // Check if required DOM element exists
    if (!featuredArticle) {
        console.error('❌ featuredArticle element not found!');
        return;
    }
    
    console.log('✅ DOM element found: featuredArticle');
    
    try {
        console.log('📂 Attempting to load: vfi_blog_catalog.json');
        
        // Load from blog catalog
        const response = await fetch('vfi_blog_catalog.json?t=' + new Date().getTime());
        
        console.log('📡 Fetch response:', {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText
        });
        
        if (!response.ok) {
            throw new Error(`Blog catalog not found (Status: ${response.status})`);
        }
        
        const blogData = await response.json();
        
        console.log('📦 Blog data loaded:', {
            status: blogData.status,
            hasArticles: !!blogData.articles,
            articleCount: blogData.articles?.length || 0
        });
        
        if (blogData.status !== 'ok' || !blogData.articles || blogData.articles.length === 0) {
            throw new Error('No articles in catalog');
        }
        
        blogArticles = blogData.articles;
        console.log(`✅ Loaded ${blogArticles.length} blog articles`);
        
        // Display first article
        displayFeaturedArticle(blogArticles[0]);
        console.log(`✅ Featured Article: ${blogArticles[0].title}`);
        console.log('💫 Article rotation enabled: Articles will cycle every 8 seconds');
        
        // Start auto-rotation after 8 seconds
        setTimeout(() => {
            rotateArticles();
            // Then rotate every 8 seconds
            setInterval(rotateArticles, 8000);
        }, 8000);
        
    } catch (error) {
        console.error('❌ Error loading blog articles:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        // Create fallback article
        blogArticles = [{
            id: 'fallback-1',
            title: 'Vision For Israel: Latest Updates',
            excerpt: 'Stay updated with the latest news from Vision For Israel ministry.',
            content: 'Visit our blog at visionforisrael.com for the latest updates.',
            image: 'https://via.placeholder.com/800x450/0038b8/ffffff?text=VFI+Blog',
            link: 'https://www.visionforisrael.com/en/blog',
            published: new Date().toLocaleDateString()
        }];
        displayFeaturedArticle(blogArticles[0]);
        
        // Show error in UI
        if (featuredArticle) {
            const errorOverlay = document.createElement('div');
            errorOverlay.style.cssText = `
                position: absolute; 
                top: 10px; 
                right: 10px; 
                background: rgba(239, 68, 68, 0.9); 
                color: white; 
                padding: 8px 12px; 
                border-radius: 6px; 
                font-size: 12px;
                z-index: 10;
            `;
            errorOverlay.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Blog load error`;
            featuredArticle.style.position = 'relative';
            featuredArticle.appendChild(errorOverlay);
        }
    }
}

// Display Featured Article
function displayFeaturedArticle(article) {
    if (!featuredArticle) {
        console.error('featuredArticle element not found');
        return;
    }
    
    const imageUrl = article.image || 'https://via.placeholder.com/800x450/0038b8/ffffff?text=VFI+Article';
    
    featuredArticle.innerHTML = `
        <div class="featured-badge">
            <i class="fas fa-newspaper"></i> Latest Article
        </div>
        <div class="featured-thumbnail-container">
            <img src="${imageUrl}" 
                 alt="${article.title}" 
                 class="featured-thumbnail"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/800x450/0038b8/ffffff?text=VFI+Article';">
            <div class="featured-play-overlay">
                <i class="fas fa-book-open"></i>
            </div>
        </div>
        <div class="featured-content">
            <h3 class="featured-title">${article.title}</h3>
            <div class="featured-meta">
                <span class="featured-type">
                    <i class="fas fa-calendar"></i>
                    ${article.published}
                </span>
            </div>
        </div>
    `;

    featuredArticle.addEventListener('click', () => {
        openArticleModal(article);
    });
}

// Open Article Modal
// Update short index in catalog for rotation
function updateShortIndex(currentIndex, totalShorts) {
    // This would ideally update the server-side catalog
    // For now, we just track it client-side
    const nextIndex = (currentIndex + 1) % totalShorts;
    console.log(`Short rotation: ${currentIndex} → ${nextIndex} (of ${totalShorts})`);
}

// Fetch Latest News
async function fetchLatestNews() {
    showLoading();
    hideError();

    try {
        console.log('📰 Fetching pro-Israel news...');
        
        // Fetch from local JSON file generated by pro_israel_news_scraper.py
        const response = await fetch('pro_israel_news.json');
        const data = await response.json();
        
        console.log('📰 News response:', {
            status: data.status,
            totalArticles: data.totalArticles,
            sources: data.sources,
            currentFilter: currentCategory
        });

        hideLoading();

        if (data.status === 'ok' && data.articles) {
            // Filter articles: must have image and be 0-6 weeks old
            const sixWeeksAgo = new Date();
            sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42); // 6 weeks = 42 days
            
            let filteredArticles = data.articles.filter(article => {
                // Check if has image
                const hasImage = article.image || article.urlToImage;
                if (!hasImage || hasImage === 'None' || hasImage === 'null') return false;
                
                // Check if within 6 weeks
                const articleDate = new Date(article.published || article.publishedAt);
                if (articleDate < sixWeeksAgo) return false;
                
                return true;
            });
            
            // Filter by source if needed
            if (currentCategory !== 'all') {
                filteredArticles = filteredArticles.filter(article => {
                    // Match source name with filter
                    const sourceSlug = article.source ? article.source.toLowerCase().replace(/\s+/g, '_') : '';
                    return sourceSlug === currentCategory || 
                           (article.category && article.category.includes(currentCategory));
                });
                console.log(`📰 Filtered to ${filteredArticles.length} articles from source: ${currentCategory}`);
            }
            
            // Store all articles and filtered articles
            window.allNewsArticles = data.articles;
            window.filteredNewsArticles = filteredArticles;
            window.showingAllArticles = false;
            
            console.log(`📰 Showing ${filteredArticles.length} recent articles with images (from ${data.articles.length} total)`);
            displayNews(filteredArticles);
            updateShowAllButton();
        } else {
            showError('No news articles available. Please run pro_israel_news_scraper.py to fetch latest news.');
            console.error('❌ No articles in JSON:', data);
        }
    } catch (error) {
        hideLoading();
        showError('Could not load news. Please make sure pro_israel_news.json exists (run pro_israel_news_scraper.py)');
        console.error('❌ Fetch Error:', error);
    }
}

// Update Show All Button visibility and text
function updateShowAllButton() {
    const container = document.getElementById('showAllNewsContainer');
    const btn = document.getElementById('showAllNewsBtn');
    
    if (!container || !btn) return;
    
    // Only show button if there are hidden articles
    const totalArticles = window.allNewsArticles ? window.allNewsArticles.length : 0;
    const filteredCount = window.filteredNewsArticles ? window.filteredNewsArticles.length : 0;
    
    if (totalArticles > filteredCount) {
        container.style.display = 'block';
        
        if (window.showingAllArticles) {
            btn.innerHTML = '<i class="fas fa-filter"></i> Show Recent Only';
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else {
            btn.innerHTML = `<i class="fas fa-th"></i> Show All Articles (${totalArticles} total)`;
            btn.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
        }
    } else {
        container.style.display = 'none';
    }
}

// Toggle between filtered and all articles
function toggleShowAllArticles() {
    if (!window.allNewsArticles || !window.filteredNewsArticles) return;
    
    window.showingAllArticles = !window.showingAllArticles;
    
    if (window.showingAllArticles) {
        console.log(`📰 Showing all ${window.allNewsArticles.length} articles`);
        displayNews(window.allNewsArticles);
    } else {
        console.log(`📰 Showing ${window.filteredNewsArticles.length} recent articles with images`);
        displayNews(window.filteredNewsArticles);
    }
    
    updateShowAllButton();
    
    // Scroll to news section
    const newsSection = document.querySelector('.news-section');
    if (newsSection) {
        newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Handle Search
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        fetchLatestNews();
        return;
    }

    showLoading();
    hideError();
    currentSearchQuery = query;

    try {
        let url;
        
        // Use unified API endpoint
        url = `${API_URL}/news/search?q=${encodeURIComponent(query)}`;
        if (currentCategory !== 'all') {
            url += `&category=${currentCategory}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        hideLoading();

        if (data.status === 'ok' && data.news) {
            displayNews(data.news);
        } else if (data.status === '429') {
            showError('Daily API quota exceeded. Please wait 24 hours or upgrade your plan.');
            console.error('API Quota Exceeded:', data);
        } else {
            showError(data.message || 'No results found');
        }
    } catch (error) {
        hideLoading();
        showError('Error searching news. Please try again.');
        console.error('Error:', error);
    }
}

// Display News
function displayNews(articles) {
    newsGrid.innerHTML = '';

    if (!articles || articles.length === 0) {
        newsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-newspaper"></i>
                <h2>No articles found</h2>
                <p>Try adjusting your search or category filter</p>
            </div>
        `;
        return;
    }

    articles.forEach(article => {
        const card = createNewsCard(article);
        newsGrid.appendChild(card);
    });
}

// Create News Card - Clean Version
function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card-clean';

    // Image handling
    let imageUrl = article.image || article.urlToImage;
    if (!imageUrl || imageUrl === 'None' || imageUrl === 'null') {
        imageUrl = 'https://via.placeholder.com/800x450/0055cc/ffffff?text=' + encodeURIComponent(article.source || 'News');
    }

    // Date formatting
    const date = new Date(article.published || article.publishedAt);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Source name
    const sourceName = article.source || 'News Source';

    // Description
    const description = article.description || article.content || '';
    const shortDescription = description.substring(0, 150) + (description.length > 150 ? '...' : '');

    card.innerHTML = `
        <div class="news-image-clean">
            <img src="${imageUrl}" alt="${article.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/800x450/0055cc/ffffff?text=News'">
        </div>
        <div class="news-content-clean">
            <span class="news-source-clean">${sourceName}</span>
            <h3 class="news-title-clean">${article.title}</h3>
            <p class="news-description-clean">${shortDescription}</p>
            <div class="news-footer-clean">
                <span class="news-date-clean">
                    <i class="far fa-calendar"></i>
                    ${dateStr}
                </span>
                <button class="read-more-btn">
                    Read More <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openArticleModal(article));

    return card;
}

// Show Loading
function showLoading() {
    loading.classList.add('show');
    newsGrid.style.display = 'none';
}

// Hide Loading
function hideLoading() {
    loading.classList.remove('show');
    newsGrid.style.display = 'grid';
}

// Show Error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// Hide Error
function hideError() {
    errorMessage.classList.remove('show');
}

// Show Success
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Modal Functions
function openVideoModal(video) {
    console.log('🎬 Opening video modal:', video);
    
    const videoModal = document.getElementById('videoModal');
    const videoModalIframe = document.getElementById('videoModalIframe');
    const videoModalTitle = document.getElementById('videoModalTitle');
    const videoModalChannel = document.getElementById('videoModalChannel');
    const videoModalDate = document.getElementById('videoModalDate');
    const videoModalYoutubeBtn = document.getElementById('videoModalYoutubeBtn');
    
    if (!videoModal || !videoModalIframe) {
        console.error('❌ Video modal elements not found!');
        return;
    }
    
    // Handle both formats: worship videos (simple object) and VFI videos (nested object)
    let videoId, title, publishedDate, channelName;
    
    if (typeof video === 'string') {
        // Direct video ID passed (from worship section)
        videoId = video;
        title = arguments[1] || 'Video';
        publishedDate = new Date();
        channelName = 'Barry & Batya Segal';
    } else if (video.id && video.id.videoId) {
        // VFI video format
        videoId = video.id.videoId;
        title = video.snippet.title;
        publishedDate = new Date(video.snippet.publishedAt);
        channelName = video.snippet.channelTitle || 'Vision For Israel';
    } else if (video.videoId) {
        // Direct video object
        videoId = video.videoId;
        title = video.title || 'Video';
        publishedDate = new Date(video.publishedAt || Date.now());
        channelName = video.channelTitle || 'Vision For Israel';
    } else {
        console.error('❌ Invalid video format:', video);
        return;
    }
    
    // Set iframe source
    videoModalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    
    // Set title
    if (videoModalTitle) {
        videoModalTitle.textContent = title;
    }
    
    // Set channel
    if (videoModalChannel) {
        videoModalChannel.innerHTML = `<i class="fab fa-youtube" style="color: #ff0000;"></i> ${channelName}`;
    }
    
    // Set date
    if (videoModalDate) {
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        videoModalDate.innerHTML = `<i class="far fa-calendar"></i> ${formattedDate}`;
    }
    
    // Set YouTube button
    if (videoModalYoutubeBtn) {
        videoModalYoutubeBtn.href = `https://www.youtube.com/watch?v=${videoId}`;
    }
    
    // Show modal
    videoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Video modal opened successfully');
}

function openArticleModal(article) {
    console.log('📰 Opening article modal:', article.title);
    
    const articleModal = document.getElementById('articleModal');
    const articleModalBody = document.getElementById('articleModalBody');
    
    if (!articleModal || !articleModalBody) {
        console.error('❌ Article modal elements not found!');
        return;
    }
    
    // Better image handling
    let imageUrl = '';
    if (article.image && article.image !== 'None' && article.image !== 'null' && article.image !== '') {
        imageUrl = article.image;
    } else if (article.urlToImage && article.urlToImage !== 'None' && article.urlToImage !== 'null') {
        imageUrl = article.urlToImage;
    } else if (article.media && article.media.length > 0) {
        imageUrl = article.media[0].url || article.media[0];
    } else if (article.enclosure && article.enclosure.url) {
        imageUrl = article.enclosure.url;
    }

    const publishedDate = new Date(article.published || article.publishedAt || Date.now());
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get full content - try multiple fields
    const fullContent = article.content || article.description || article.excerpt || article.summary || 'Full article available at source.';
    
    // Source name and category
    const sourceName = article.source || article.author || 'News Source';
    const category = article.category?.[0] || article.source || 'general';

    articleModalBody.innerHTML = `
        <div class="article-modal-banner">
            ${imageUrl ? `<img src="${imageUrl}" alt="${article.title}" 
                 onerror="this.parentElement.style.background='linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)'">` : ''}
            <div class="article-modal-banner-overlay">
                <span class="article-modal-category">
                    <i class="fas fa-tag"></i> ${category}
                </span>
                <h1 class="article-modal-title">${article.title}</h1>
                <div class="article-modal-meta">
                    <span class="article-modal-author">
                        <i class="fas fa-user"></i> ${sourceName}
                    </span>
                    <span class="article-modal-date">
                        <i class="far fa-calendar"></i> ${formattedDate}
                    </span>
                </div>
            </div>
        </div>
        <div class="article-modal-content-wrapper">
            <div class="article-modal-description">
                ${fullContent}
            </div>
            <div class="article-modal-actions">
                <a href="${article.link || article.url}" target="_blank" class="article-modal-btn article-modal-btn-primary">
                    <i class="fas fa-external-link-alt"></i> Read Full Article
                </a>
                <button onclick="navigator.share ? navigator.share({title: '${article.title.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', url: '${article.link || article.url}'}) : null" class="article-modal-btn article-modal-btn-secondary">
                    <i class="fas fa-share-alt"></i> Share
                </button>
            </div>
        </div>
    `;

    articleModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Article modal opened successfully');
}

function closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const videoModalIframe = document.getElementById('videoModalIframe');
    
    if (videoModal) {
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Stop video playback
    if (videoModalIframe) {
        videoModalIframe.src = '';
    }
    
    console.log('✖️ Video modal closed');
}

function closeArticleModal() {
    const articleModal = document.getElementById('articleModal');
    
    if (articleModal) {
        articleModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    console.log('✖️ Article modal closed');
}

// Legacy function for compatibility
function closeModal() {
    closeVideoModal();
    closeArticleModal();
}

function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showSuccess('Link copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }
}

// Load Bible Verses into Sidebars - Dynamic based on page height with Sermons
function loadBibleVerses() {
    const leftSidebar = document.getElementById('bibleSidebarLeft');
    const rightSidebar = document.getElementById('bibleSidebarRight');
    
    if (!leftSidebar || !rightSidebar) {
        console.log('Bible sidebars not found');
        return;
    }
    
    if (typeof bibleVerses === 'undefined') {
        console.error('❌ Bible verses not loaded');
        return;
    }
    
    try {
        // Parse verses (they're in "text - reference" format)
        const parsedVerses = bibleVerses.map(verse => {
            const parts = verse.split(' - ');
            const text = parts[0];
            const reference = parts[1] || 'Scripture';
            
            // Get sermon for this verse using the getSermonForVerse function
            let sermon = null;
            if (typeof getSermonForVerse !== 'undefined') {
                sermon = getSermonForVerse(verse, text, reference);
            }
            
            return { text, reference, fullVerse: verse, sermon };
        });
        
        // Shuffle verses for variety
        const shuffled = parsedVerses.sort(() => 0.5 - Math.random());
        
        // Calculate staggered vertical positions
        // Offset verses so the top card clears the ticker + nav area
        const startTop = 220;
        const verticalSpacing = 850; // Increased spacing for sermon content
        
        // Calculate how many verses needed based on document height
        const updateVerses = () => {
            // Get footer position to stop verses before footer
            const footer = document.querySelector('.footer') || document.querySelector('footer');
            const footerTop = footer ? footer.offsetTop : document.body.scrollHeight;
            
            const usableHeight = Math.max(0, footerTop - startTop - 160); // stop before footer
            const pageHeight = Math.min(
                footerTop - 120,
                Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight
                )
            );

            const versesNeeded = Math.max(1, Math.ceil(usableHeight / verticalSpacing));
            const versesPerSide = Math.min(versesNeeded, Math.floor(shuffled.length / 2));
            
            // Use alternating pattern for left/right
            const leftVerses = shuffled.filter((_, i) => i % 2 === 0).slice(0, versesPerSide);
            const rightVerses = shuffled.filter((_, i) => i % 2 === 1).slice(0, versesPerSide);
            
            // Helper function to generate sermon HTML
            const generateSermonHTML = (sermon) => {
                if (!sermon) return '';
                return `
                    <div class="sermon-teaching">
                        <div class="sermon-header">
                            <i class="fas fa-book-open"></i>
                            <span>Teaching</span>
                        </div>
                        <div class="sermon-section">
                            <span class="sermon-label">Context:</span>
                            <p class="sermon-text">${sermon.context}</p>
                        </div>
                        <div class="sermon-section">
                            <span class="sermon-label">Meaning:</span>
                            <p class="sermon-text">${sermon.meaning}</p>
                        </div>
                        <div class="sermon-section">
                            <span class="sermon-label">Application:</span>
                            <p class="sermon-text">${sermon.application}</p>
                        </div>
                        <div class="sermon-prayer">
                            <span class="sermon-label">Prayer:</span>
                            <p class="sermon-text">${sermon.prayer}</p>
                        </div>
                    </div>
                `;
            };
            
            leftSidebar.innerHTML = leftVerses.map((verse, index) => {
                const topPosition = startTop + (index * verticalSpacing);
                return `
                <div class="bible-verse-card" style="left: 0; top: ${topPosition}px;">
                    <p class="bible-verse-text">"${verse.text}"</p>
                    <span class="bible-verse-reference">${verse.reference}</span>
                    ${generateSermonHTML(verse.sermon)}
                </div>
            `;
            }).join('');
            
            // Stagger right side verses between left side verses
            rightSidebar.innerHTML = rightVerses.map((verse, index) => {
                const topPosition = startTop + 425 + (index * verticalSpacing); // Offset by 425px
                return `
                <div class="bible-verse-card" style="right: 0; top: ${topPosition}px;">
                    <p class="bible-verse-text">"${verse.text}"</p>
                    <span class="bible-verse-reference">${verse.reference}</span>
                    ${generateSermonHTML(verse.sermon)}
                </div>
            `;
            }).join('');
            
            const versesWithSermons = leftVerses.filter(v => v.sermon).length + rightVerses.filter(v => v.sermon).length;
            console.log(`✅ Loaded ${leftVerses.length + rightVerses.length} Bible verses (${versesWithSermons} with sermons) for page height ${pageHeight}px`);
        };
        
        // Initial load
        updateVerses();
        
        // Update when content changes (videos/articles load)
        const observer = new MutationObserver(() => {
            setTimeout(updateVerses, 500); // Delay to let layout settle
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also update on window resize
        window.addEventListener('resize', updateVerses);
        
    } catch (error) {
        console.error('❌ Error loading Bible verses:', error);
        leftSidebar.innerHTML = '';
        rightSidebar.innerHTML = '';
    }
}

