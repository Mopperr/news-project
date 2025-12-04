// API Configuration - Auto-detects local vs production
// For production: Set RENDER_API_URL to your Render backend URL after deployment
// Example: https://vfi-news-api.onrender.com/api
const RENDER_API_URL = 'YOUR_RENDER_URL_HERE/api'; // Replace after deploying to Render
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
    // Initialize DOM elements
    newsGrid = document.getElementById('newsGrid');
    videosGrid = document.getElementById('videosGrid');
    featuredVideo = document.getElementById('featuredVideo');
    featuredArticle = document.getElementById('featuredArticle');
    loading = document.getElementById('loading');
    errorMessage = document.getElementById('errorMessage');
    searchInput = document.getElementById('searchInput');
    searchBtn = document.getElementById('searchBtn');
    navButtons = document.querySelectorAll('.nav-btn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    modal = document.getElementById('modal');
    modalBody = document.getElementById('modalBody');
    modalClose = document.querySelector('.modal-close');
    
    console.log('DOM Elements initialized:', {
        newsGrid, videosGrid, featuredVideo, featuredArticle
    });
    
    // Setup event listeners for category filter buttons
    if (categoryButtons) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category;
                currentSearchQuery = '';
                if (searchInput) searchInput.value = '';
                fetchLatestNews();
            });
        });
    }
    
    // Setup event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
    
    // Modal Event Listeners
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    // Worship Music Navigation
    const worshipLink = document.getElementById('worshipLink');
    if (worshipLink) {
        worshipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const worshipSection = document.querySelector('.worship-section');
            if (worshipSection) {
                worshipSection.style.display = 'block';
                worshipSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Update header date
    updateHeaderDate();
    
    // Update time every second
    updateHeaderTime();
    setInterval(updateHeaderTime, 1000);
    
    // Fetch weather
    fetchJerusalemWeather();
    setInterval(fetchJerusalemWeather, 60000); // Update every minute (reads from JSON file)
    
    // Hamburger menu functionality
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMain = document.getElementById('navMain');
    
    if (hamburgerMenu && navMain) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navMain.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerMenu.contains(e.target) && !navMain.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                navMain.classList.remove('active');
            }
        });
        
        // Close menu when clicking a link
        const navLinks = navMain.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                navMain.classList.remove('active');
            });
        });
    }
    
    // Load worship music videos
    loadWorshipMusic();
    
    // Fetch content
    fetchYouTubeVideos();
    fetchVFIBlogArticles();
    fetchLatestNews();
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

// Load Worship Music Videos
async function loadWorshipMusic() {
    // Barry & Batya Segal - Verified videos from their Sh'ma Yisrael album playlist
    const worshipVideos = [
        { id: 'sdNJ6djL1c4', title: 'You Are Holy - Barry & Batya Segal' },
        { id: 'd2ILnGedg2g', title: 'Kadosh (Holy) - Barry & Batya Segal' },
        { id: 'HeTDyo2FwKk', title: 'Baruch Haba (Blessed Is He) - Barry & Batya Segal' },
        { id: 'klDrARxA8io', title: 'Hallelu Et Adonai - Barry & Batya Segal' },
        { id: '9yDt8B170N4', title: 'Shalom Jerusalem - Barry & Batya Segal' },
        { id: 'iTbXjRZANDo', title: 'Hodu L\'adonai - Barry & Batya Segal' }
    ];
    
    const worshipGrid = document.getElementById('worshipGrid');
    if (!worshipGrid) return;
    
    worshipGrid.innerHTML = '';
    
    worshipVideos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'worship-card';
        
        // Use sddefault for videos that don't have maxresdefault
        const thumbnailQuality = (video.id === 'HeTDyo2FwKk') ? 'sddefault' : 'maxresdefault';
        const fallbackQuality = 'hqdefault';
        
        card.innerHTML = `
            <div class="worship-thumbnail">
                <img src="https://img.youtube.com/vi/${video.id}/${thumbnailQuality}.jpg" 
                     alt="${video.title}"
                     onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${video.id}/${fallbackQuality}.jpg'">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="worship-info">
                <h3 class="worship-title">${video.title}</h3>
            </div>
        `;
        card.addEventListener('click', () => openVideoModal(video.id, video.title));
        worshipGrid.appendChild(card);
    });
    
    console.log('Loaded worship music videos:', worshipVideos.length);
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

// Auto-rotate featured content indices
let featuredVideoIndex = 0;
let featuredArticleIndex = 0;
let blogArticles = [];

// Featured video (rotates through first 3 videos)
const FEATURED_VIDEO = ALL_VFI_VIDEOS[0];

// Video grid (videos 3-17 from playlist) - 15 videos for the grid
const FALLBACK_VIDEOS = ALL_VFI_VIDEOS.slice(2, 17);

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

// Fetch YouTube Videos
async function fetchYouTubeVideos() {
    console.log('=== Starting fetchYouTubeVideos ===');
    console.log('Total VFI videos available:', ALL_VFI_VIDEOS.length);
    
    try {
        console.log('Loading VFI YouTube videos from playlist...');
        
        // Display videos
        displayFeaturedVideo(FEATURED_VIDEO);  // Video #1
        displayVideos(FALLBACK_VIDEOS);         // Videos #3-17 (15 videos)
        
        console.log(`✓ Featured Video: ${FEATURED_VIDEO.snippet.title}`);
        console.log(`✓ Grid Videos: ${FALLBACK_VIDEOS.length} videos displayed`);
        console.log('All videos loaded successfully!');
        console.log('💫 Auto-rotation enabled: Featured video will cycle every 10 seconds');
        
        // Start auto-rotation after 10 seconds
        setTimeout(() => {
            rotateVideos();
            // Then rotate every 10 seconds
            setInterval(rotateVideos, 10000);
        }, 10000);
        
    } catch (error) {
        console.error('Error in fetchYouTubeVideos:', error);
    }
}

// Fetch VFI Blog Articles
async function fetchVFIBlogArticles() {
    console.log('=== Starting fetchVFIBlogArticles ===');
    
    try {
        // Load from blog catalog
        const response = await fetch('vfi_blog_catalog.json?t=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error('Blog catalog not found');
        }
        
        const blogData = await response.json();
        
        if (blogData.status !== 'ok' || !blogData.articles || blogData.articles.length === 0) {
            throw new Error('No articles in catalog');
        }
        
        blogArticles = blogData.articles;
        console.log(`✓ Loaded ${blogArticles.length} blog articles`);
        
        // Display first article
        displayFeaturedArticle(blogArticles[0]);
        console.log(`✓ Featured Article: ${blogArticles[0].title}`);
        console.log('💫 Article rotation enabled: Articles will cycle every 8 seconds');
        
        // Start auto-rotation after 8 seconds
        setTimeout(() => {
            rotateArticles();
            // Then rotate every 8 seconds
            setInterval(rotateArticles, 8000);
        }, 8000);
        
    } catch (error) {
        console.error('Error loading blog articles:', error);
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

// Display Videos
function displayVideos(videos) {
    console.log('displayVideos called with:', videos);
    
    if (!videosGrid) {
        console.error('videosGrid element not found!');
        return;
    }
    
    videosGrid.innerHTML = '';

    videos.forEach((video, index) => {
        console.log(`Creating card for video ${index + 1}:`, video.snippet.title);
        const videoCard = createVideoCard(video);
        videosGrid.appendChild(videoCard);
    });
    
    console.log(`Displayed ${videos.length} videos in grid`);
}

// Create Video Card
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    
    const videoId = video.id.videoId;
    // Try different thumbnail qualities with fallback
    const thumbnail = video.snippet.thumbnails.high?.url || 
                     video.snippet.thumbnails.medium?.url || 
                     video.snippet.thumbnails.default?.url ||
                     `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const title = video.snippet.title;

    card.innerHTML = `
        <div class="video-thumbnail-container">
            <img src="${thumbnail}" 
                 alt="${title}" 
                 class="video-thumbnail"
                 onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${videoId}/maxresdefault.jpg';">
            <div class="video-play-overlay">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="video-card-content">
            <h3 class="video-card-title">${title}</h3>
            <div class="video-card-meta">
                <i class="fab fa-youtube" style="color: #ff0000; font-size: 1.2rem;"></i>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        openVideoModal(video);
    });

    return card;
}

// Display Featured Video
function displayFeaturedVideo(video) {
    console.log('displayFeaturedVideo called with:', video);
    
    if (!featuredVideo) {
        console.error('featuredVideo element not found!');
        return;
    }
    
    try {
        const videoId = video.id.videoId;
        // Try different thumbnail qualities with fallback
        const thumbnail = video.snippet.thumbnails.high?.url || 
                         video.snippet.thumbnails.medium?.url || 
                         video.snippet.thumbnails.default?.url ||
                         `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const title = video.snippet.title;

        featuredVideo.innerHTML = `
            <div class="featured-badge">
                <i class="fas fa-star"></i> Latest Video
            </div>
            <div class="featured-thumbnail-container">
                <img src="${thumbnail}" 
                     alt="${title}" 
                     class="featured-thumbnail"
                     onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${videoId}/maxresdefault.jpg';">
                <div class="featured-play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="featured-content">
                <h3 class="featured-title">${title}</h3>
                <div class="featured-meta">
                    <span class="featured-type">
                        <i class="fab fa-youtube" style="color: #ff0000;"></i>
                        Full Video
                    </span>
                </div>
            </div>
        `;

        featuredVideo.addEventListener('click', () => {
            openVideoModal(video);
        });
        
        console.log('Featured video displayed successfully');
    } catch (error) {
        console.error('Error in displayFeaturedVideo:', error);
    }
}

// Open Article Modal
function openArticleModal(article) {
    if (!modal || !modalBody) {
        console.error('Modal elements not found');
        return;
    }
    
    const imageUrl = article.image || 'https://via.placeholder.com/800x450/0038b8/ffffff?text=VFI+Article';
    
    modalBody.innerHTML = `
        <div class="modal-article-container">
            <img src="${imageUrl}" 
                 alt="${article.title}" 
                 class="modal-article-image"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/800x450/0038b8/ffffff?text=VFI+Article';">
            <div class="modal-article-content">
                <div class="modal-article-meta">
                    <span class="modal-article-category">VFI Blog</span>
                    <span class="modal-article-date">
                        <i class="fas fa-calendar"></i> ${article.published}
                    </span>
                </div>
                <h2 class="modal-article-title">${article.title}</h2>
                <div class="modal-article-description">
                    ${article.content || article.excerpt}
                </div>
                <div class="modal-article-actions">
                    <a href="${article.link}" target="_blank" class="modal-btn modal-btn-primary">
                        <i class="fas fa-external-link-alt"></i> Read Full Article on VFI
                    </a>
                    <button onclick="closeModal()" class="modal-btn modal-btn-secondary">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

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
        let url;
        
        // Use unified API endpoint
        url = `${API_URL}/news`;
        if (currentCategory !== 'all') {
            url += `?category=${currentCategory}`;
        }

        console.log('Fetching news from:', url);
        const response = await fetch(url);
        const data = await response.json();
        console.log('News response:', data);

        hideLoading();

        if (data.status === 'ok' && data.news) {
            displayNews(data.news);
        } else if (data.status === '429') {
            showError('Daily API quota exceeded. Please wait 24 hours or upgrade your plan at currentsapi.services');
            console.error('API Quota Exceeded:', data);
        } else {
            showError(data.message || 'Failed to fetch news');
            console.error('API Error:', data);
        }
    } catch (error) {
        hideLoading();
        if (USE_LOCAL_API) {
            showError('Could not connect to local news server. Make sure to run start_server.bat first!');
        } else {
            showError('Error fetching news. Please check your connection and try again.');
        }
        console.error('Fetch Error:', error);
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

// Create News Card
function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';

    const imageUrl = article.image && article.image !== 'None' && article.image !== 'null' 
        ? article.image 
        : 'https://via.placeholder.com/400x200/2563eb/ffffff?text=No+Image';

    const categories = article.category && article.category.length > 0 
        ? article.category 
        : ['general'];

    const author = article.author && article.author !== 'None' 
        ? article.author 
        : 'Unknown Author';

    const description = article.description || 'No description available';
    const truncatedDescription = description.length > 150 
        ? description.substring(0, 150) + '...' 
        : description;

    card.innerHTML = `
        <img src="${imageUrl}" alt="${article.title}" class="news-card-image" 
             onerror="this.src='https://via.placeholder.com/400x200/2563eb/ffffff?text=No+Image'">
        <div class="news-card-content">
            <div class="news-card-meta">
                <span class="news-category">${categories[0]}</span>
            </div>
            <h3 class="news-card-title">${article.title}</h3>
            <p class="news-card-description">${truncatedDescription}</p>
            <div class="news-card-footer">
                <span class="news-author">
                    <i class="fas fa-user"></i> ${author}
                </span>
                <a href="#" class="read-more" data-article='${JSON.stringify(article).replace(/'/g, "&apos;")}'>
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;

    // Add click event to read more button
    const readMoreBtn = card.querySelector('.read-more');
    readMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openArticleModal(article);
    });

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
    // Handle both formats: worship videos (simple object) and VFI videos (nested object)
    let videoId, title, publishedDate;
    
    if (typeof video === 'string') {
        // Direct video ID passed (from worship section)
        videoId = video;
        title = arguments[1] || 'Video'; // Get title from second argument
        publishedDate = new Date();
    } else if (video.id && video.id.videoId) {
        // VFI video format
        videoId = video.id.videoId;
        title = video.snippet.title;
        publishedDate = new Date(video.snippet.publishedAt);
    } else if (video.id && typeof video.id === 'string') {
        // Simple format with id as string
        videoId = video.id;
        title = video.title || 'Video';
        publishedDate = new Date();
    } else {
        console.error('Invalid video format:', video);
        return;
    }
    
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Determine channel name
    const channelName = title.includes('Barry & Batya Segal') ? 'Barry & Batya Segal' : 'Vision For Israel';

    modalBody.innerHTML = `
        <div class="modal-video-container">
            <iframe 
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                title="${title}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>
        <div class="modal-video-info">
            <h2 class="modal-video-title">${title}</h2>
            <div class="modal-video-meta">
                <span class="modal-video-channel">
                    <i class="fab fa-youtube" style="color: #ff0000;"></i>
                    ${channelName}
                </span>
                <span class="modal-video-date">
                    <i class="far fa-calendar"></i>
                    ${formattedDate}
                </span>
            </div>
            <div class="modal-article-actions">
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="modal-btn modal-btn-primary">
                    <i class="fab fa-youtube"></i> Watch on YouTube
                </a>
            </div>
        </div>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function openArticleModal(article) {
    const imageUrl = article.image && article.image !== 'None' && article.image !== 'null' 
        ? article.image 
        : 'https://via.placeholder.com/800x400/0038b8/ffffff?text=No+Image';

    const categories = article.category && article.category.length > 0 
        ? article.category 
        : ['general'];

    const author = article.author && article.author !== 'None' 
        ? article.author 
        : 'Unknown Author';

    const source = article.source || 'News Source';

    const publishedDate = new Date(article.published);
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const description = article.description || 'No description available';

    modalBody.innerHTML = `
        <div class="modal-article-container">
            <img src="${imageUrl}" alt="${article.title}" class="modal-article-image"
                 onerror="this.src='https://via.placeholder.com/800x400/0038b8/ffffff?text=No+Image'">
            <div class="modal-article-content">
                <div class="modal-article-meta">
                    <span class="modal-article-category">${categories[0]}</span>
                    <span class="modal-article-date">
                        <i class="far fa-calendar"></i> ${formattedDate}
                    </span>
                    <span class="modal-article-source">
                        <i class="fas fa-globe"></i> ${source}
                    </span>
                </div>
                <h2 class="modal-article-title">${article.title}</h2>
                <p class="modal-article-author">
                    <i class="fas fa-user"></i> By ${author}
                </p>
                <div class="modal-article-description">
                    ${description}
                </div>
                <div class="modal-article-actions">
                    <a href="${article.link || article.url}" target="_blank" class="modal-btn modal-btn-primary">
                        <i class="fas fa-external-link-alt"></i> Read Full Article
                    </a>
                    <button onclick="shareArticle('${article.title}', '${article.link || article.url}')" class="modal-btn modal-btn-secondary">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Stop any playing videos
    setTimeout(() => {
        modalBody.innerHTML = '';
    }, 300);
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

