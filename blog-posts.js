// blog-posts.js
// Load and display Vision for Israel blog articles as cards with modal view


let _blogArticles = [];
let _sortOrder = 'newest'; // newest or oldest

function sortArticles(articles, order) {
    return articles.slice().sort((a, b) => {
        const dateA = new Date(a.published || '1970-01-01');
        const dateB = new Date(b.published || '1970-01-01');
        return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
}

async function loadBlogArticles() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    try {
        const response = await fetch('vfi_blog_catalog.json');
        if (!response.ok) throw new Error('Could not load blog catalog: ' + response.status);
        const catalog = await response.json();
        const articles = catalog.articles || [];
        window._blogArticles = articles;
        _blogArticles = articles;
        renderBlogGrid();
    } catch (error) {
        grid.innerHTML = `<p style='color:#e11d48'>Could not load blog articles.<br>${escapeHtml(error.message)}</p>`;
        console.error('Blog JSON fetch error:', error);
    }
}

function renderBlogGrid() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    let articles = sortArticles(_blogArticles, _sortOrder);
    if (!Array.isArray(articles) || articles.length === 0) {
        grid.innerHTML = '<p style="color:#e11d48">No blog articles found.</p>';
        return;
    }
    const fallbackImg = 'https://via.placeholder.com/400x180?text=No+Image';
    grid.innerHTML = articles.map((article, idx) => {
        const safeTitle = escapeHtml(article.title || '');
        const pubDate = article.published ? formatDate(article.published) : 'Unknown';
        const imgSrc = article.image && article.image.startsWith('http') ? article.image : fallbackImg;
        return `
            <div class="blog-card" onclick="openBlogModal(${idx})">
                <img src="${imgSrc}" alt="${safeTitle}" class="blog-card-image" onerror="this.src='${fallbackImg}'">
                <div class="blog-card-content">
                    <h3 class="blog-card-title">${safeTitle}</h3>
                    <p class="blog-card-excerpt">${escapeHtml(article.excerpt || (article.content || '').slice(0, 120) + '...')}</p>
                </div>
                <div class="blog-card-date-badge">${pubDate}</div>
            </div>
        `;
    }).join('');
}

function formatDate(dateStr) {
    if (!dateStr) return 'Unknown';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function setSortOrder(order) {
    _sortOrder = order;
    renderBlogGrid();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


function openBlogModal(idx) {
    const modal = document.getElementById('blogModal');
    const title = document.getElementById('blogModalTitle');
    const image = document.getElementById('blogModalImage');
    const meta = document.getElementById('blogModalMeta');
    const content = document.getElementById('blogModalContent');
    const articles = sortArticles(_blogArticles, _sortOrder);
    const article = articles[idx];
    if (!article) return;
    // Show image at top
    const fallbackImg = 'https://via.placeholder.com/400x180?text=No+Image';
    if (article.image && article.image.startsWith('http')) {
        image.src = article.image;
        image.style.display = '';
    } else {
        image.src = fallbackImg;
        image.style.display = '';
    }
    // Title and meta
    title.textContent = article.title || '';
    meta.innerHTML = '';
    if (article.published) {
        meta.innerHTML += `<i class='far fa-calendar-alt'></i> ${formatDate(article.published)}`;
    }
    // Render full HTML content in a scrollable area
    content.innerHTML = '';
    if (article.content_html) {
        content.innerHTML += `<div class='blog-modal-content-scroll'>${article.content_html}</div>`;
    } else if (article.content) {
        content.innerHTML += `<div class='blog-modal-content-scroll'>${escapeHtml(article.content)}</div>`;
    } else {
        content.innerHTML += `<div class='blog-modal-content-scroll'><em>No article text available.</em></div>`;
    }
    if (article.link) {
        content.innerHTML += `<a href='${article.link}' class='blog-modal-link-btn' target='_blank'><i class='fas fa-external-link-alt'></i> Read Full Article on VFI</a>`;
    }
    modal.style.display = 'flex';
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    loadBlogArticles();
    document.getElementById('blogModalClose').onclick = closeBlogModal;
    window.onclick = function(event) {
        const modal = document.getElementById('blogModal');
        if (event.target === modal) closeBlogModal();
    };
});
