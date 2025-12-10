// Leveling System with Biblical Scripture Rewards
const LEVEL_SYSTEM = {
    1: { title: 'Seed', min: 0, max: 50, scripture: 'Matthew 13:31-32', verse: 'Though your beginning was small, your latter end will be very great.' },
    2: { title: 'Sprout', min: 51, max: 100, scripture: 'Psalm 92:12', verse: 'The righteous shall flourish like the palm tree.' },
    3: { title: 'Growing Plant', min: 101, max: 150, scripture: 'Proverbs 14:23', verse: 'All hard work brings a profit.' },
    4: { title: 'Flowering', min: 151, max: 200, scripture: '1 Peter 1:23', verse: 'Born again through the eternal word of God.' },
    5: { title: 'Blooming', min: 201, max: 250, scripture: 'John 15:5', verse: 'I am the vine; you are the branches.' },
    6: { title: 'Bearing Fruit', min: 251, max: 300, scripture: 'John 15:16', verse: 'I chose you and appointed you to go and bear fruit.' },
    7: { title: 'Fruit Bearer', min: 301, max: 400, scripture: 'Galatians 5:22-23', verse: 'The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.' },
    8: { title: 'Pillar', min: 401, max: 500, scripture: '1 Peter 2:5', verse: 'You also, like living stones, are being built into a spiritual house.' },
    9: { title: 'Strong Oak', min: 501, max: 600, scripture: 'Philippians 4:8-9', verse: 'Whatever is true, whatever is noble, whatever is right... these are the things you should think about.' },
    10: { title: 'Mighty Cedar', min: 601, max: 750, scripture: 'Psalm 92:12', verse: 'The righteous will flourish like a green bay tree.' },
    11: { title: 'Watchman', min: 751, max: 900, scripture: 'Ezekiel 33:7', verse: 'I have made you a watchman for the people of Israel.' },
    12: { title: 'Teacher', min: 901, max: 1000, scripture: '2 Timothy 2:2', verse: 'Entrust to faithful people who will also be qualified to teach others.' }
};

function getLevelByReputation(reputation) {
    for (let level = 1; level <= 12; level++) {
        const levelData = LEVEL_SYSTEM[level];
        if (reputation >= levelData.min && reputation <= levelData.max) {
            return { level, ...levelData };
        }
    }
    return { level: 12, ...LEVEL_SYSTEM[12] };
}

function checkLevelUp(user) {
    const oldLevel = user.level || 1;
    const newLevel = getLevelByReputation(user.reputation || 0);
    
    if (newLevel.level > oldLevel) {
        user.level = newLevel.level;
        showLevelUpReward(user, newLevel);
        return true;
    }
    return false;
}

function showLevelUpReward(user, levelData) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 50000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    `;
    
    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%); border: 2px solid #fbbf24; border-radius: 20px; padding: 3rem 2rem; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(251, 191, 36, 0.3);">
            <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 0.6s ease;">⭐</div>
            <h2 style="color: #fbbf24; font-size: 2rem; margin-bottom: 0.5rem;">Level Up!</h2>
            <p style="color: #e2e8f0; font-size: 1.5rem; margin-bottom: 1rem;">You've reached Level ${levelData.level}</p>
            <div style="background: rgba(251, 191, 36, 0.1); border: 2px solid rgba(251, 191, 36, 0.3); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
                <h3 style="color: #fbbf24; font-size: 1.3rem; margin: 0 0 1rem 0;">${levelData.title}</h3>
                <p style="color: #cbd5e1; font-size: 0.9rem; margin: 0 0 1rem 0; font-style: italic;">"${levelData.verse}"</p>
                <p style="color: #94a3b8; font-size: 0.8rem; margin: 0;">— ${levelData.scripture}</p>
            </div>
            <p style="color: #cbd5e1; font-size: 0.9rem; margin: 1.5rem 0;">Share this scripture with the community!</p>
            <button onclick="this.closest('[style*=fixed]').remove()" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 12px 2rem; border: none; border-radius: 9999px; font-weight: 700; cursor: pointer; font-size: 1rem;">
                Awesome!
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.animation = 'fadeIn 0.3s ease', 10);
}

// Add CSS animation
if (!document.querySelector('style[data-forum-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-forum-animations', 'true');
    style.textContent = `
        @keyframes bounce {
            0% { transform: scale(0) rotate(-180deg); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('💬 Forum initialized');
    
    const threadsContainer = document.getElementById('threadsContainer');
    const authModal = document.getElementById('authModal');
    const newThreadModal = document.getElementById('newThreadModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const newThreadForm = document.getElementById('newThreadForm');
    
    let threads = [];
    let users = [];
    let currentUser = null;
    let currentCategory = 'all';
    
    // Load data from localStorage
    loadThreads();
    loadUsers();
    loadCurrentUser();
    
    // Add sample threads if empty
    if (threads.length === 0) {
        addSampleThreads();
    }
    
    displayThreads();
    updateUserUI();
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserUI();
            closeAuthModal();
            alert('✅ Welcome back, ' + user.username + '!');
        } else {
            alert('❌ Invalid username or password');
        }
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
        
        if (password !== passwordConfirm) {
            alert('❌ Passwords do not match');
            return;
        }
        
        if (users.find(u => u.username === username)) {
            alert('❌ Username already exists');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: password,
            joinDate: new Date().toISOString(),
            posts: 0,
            reputation: 0,
            savedPosts: []
        };
        
        users.push(newUser);
        localStorage.setItem('forumUsers', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateUserUI();
        closeAuthModal();
        alert('✅ Account created! Welcome, ' + username + '!');
    });
    
    // Form submission
    newThreadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentUser) {
            alert('⚠️ Please sign in to post a discussion');
            openAuthModal();
            return;
        }
        
        const category = document.getElementById('threadCategory').value;
        const title = document.getElementById('threadTitle').value;
        const content = document.getElementById('threadContent').value;
        
        const newThread = {
            id: Date.now(),
            author: currentUser.username,
            authorId: currentUser.id,
            category: category,
            title: title,
            content: content,
            date: new Date().toISOString(),
            replies: 0,
            views: 0,
            likes: 0
        };
        
        threads.unshift(newThread);
        saveThreads();
        displayThreads();
        
        // Update user posts count
        currentUser.posts++;
        currentUser.reputation = (currentUser.reputation || 0) + 10; // Award points for new post
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('forumUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Check for level up
            checkLevelUp(currentUser);
        }
        
        // Reset form and close modal
        newThreadForm.reset();
        closeNewThreadModal();
        
        // Show success message
        alert('✅ Your discussion has been posted!');
    });
    
    function displayThreads() {
        // Filter threads if needed
        let filteredThreads = threads;
        if (currentCategory !== 'all') {
            filteredThreads = threads.filter(t => t.category === currentCategory);
        }
        
        threadsContainer.innerHTML = '';
        
        if (filteredThreads.length === 0) {
            threadsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #6b7280;">
                    <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.2rem;">No discussions yet in this category.</p>
                    <p>Be the first to start a conversation!</p>
                </div>
            `;
            return;
        }
        
        filteredThreads.forEach(thread => {
            const item = createThreadItem(thread);
            threadsContainer.appendChild(item);
        });
    }
    
    function createThreadItem(thread) {
        const item = document.createElement('div');
        item.className = 'post-card';
        
        const date = new Date(thread.date);
        const timeAgo = getTimeAgo(date);
        
        const excerpt = thread.content.substring(0, 200) + (thread.content.length > 200 ? '...' : '');
        
        // Get actual comment count
        const commentCount = thread.comments ? thread.comments.length : 0;
        const commentText = commentCount === 0 ? 'Comment' : (commentCount === 1 ? '1 Comment' : `${commentCount} Comments`);
        
        const saved = isPostSaved(thread.id);

        // Reddit-style layout
        item.innerHTML = `
            <div class="vote-section">
                <button class="vote-btn upvote" onclick="event.stopPropagation(); votePost(${thread.id}, 'up')">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <div class="vote-count">${thread.likes || 0}</div>
                <button class="vote-btn downvote" onclick="event.stopPropagation(); votePost(${thread.id}, 'down')">
                    <i class="fas fa-arrow-down"></i>
                </button>
            </div>
            <div class="post-content" onclick="viewThread(${thread.id})" style="cursor: pointer;">
                <div class="post-header">
                    <a href="#" class="subreddit-link" onclick="event.stopPropagation(); selectCategory('${thread.category}'); return false;">r/${thread.category.replace(/ & /g, '').replace(/ /g, '')}</a>
                    <span>•</span>
                    <span class="post-author">Posted by u/${escapeHtml(thread.author)}</span>
                    <span>•</span>
                    <span class="post-time">${timeAgo}</span>
                </div>
                <h3 class="post-title">${escapeHtml(thread.title)}</h3>
                <div class="post-preview">${escapeHtml(excerpt)}</div>
                <div class="post-footer">
                    <div class="post-action" onclick="event.stopPropagation(); viewThread(${thread.id});">
                        <i class="far fa-comment-alt"></i>
                        <span>${commentText}</span>
                    </div>
                    <div class="post-action" onclick="event.stopPropagation(); sharePost(${thread.id})">
                        <i class="far fa-share-square"></i>
                        <span>Share</span>
                    </div>
                    <div class="post-action ${saved ? 'post-action-active' : ''}" onclick="event.stopPropagation(); savePost(${thread.id});">
                        <i class="${saved ? 'fas fa-bookmark' : 'far fa-bookmark'}"></i>
                        <span>${saved ? 'Saved' : 'Save'}</span>
                    </div>
                </div>
            </div>
        `;
        
        return item;
    }
    
    function viewThread(threadId, options = { skipViewIncrement: false }) {
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;
        
        if (!options.skipViewIncrement) {
            thread.views = (thread.views || 0) + 1;
            saveThreads();
        }
        
        // Ensure comments array exists
        if (!thread.comments) {
            thread.comments = [];
        }
        
        // Open thread view modal
        const modal = document.getElementById('threadViewModal');
        const container = document.getElementById('threadViewContainer');
        
        if (!modal || !container) return;
        
        // Build thread view HTML
        const date = new Date(thread.date);
        const timeAgo = getTimeAgo(date);
        const commentCount = thread.comments.length;
        const saved = isPostSaved(thread.id);
        
        container.innerHTML = `
            <div style="background: white; border-radius: 8px;">
                <!-- Thread Header -->
                <div style="padding: 20px; border-bottom: 1px solid #e5e5e5;">
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <!-- Vote Section -->
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <button class="vote-btn upvote" onclick="votePost(${thread.id}, 'up'); refreshThreadView(${thread.id});" style="padding: 8px 12px;">
                                <i class="fas fa-arrow-up"></i>
                            </button>
                            <div style="font-weight: 700; color: ${(thread.likes || 0) > 0 ? '#FF4500' : ((thread.likes || 0) < 0 ? '#7193FF' : '#1c1c1c')};">${thread.likes || 0}</div>
                            <button class="vote-btn downvote" onclick="votePost(${thread.id}, 'down'); refreshThreadView(${thread.id});" style="padding: 8px 12px;">
                                <i class="fas fa-arrow-down"></i>
                            </button>
                        </div>
                        
                        <!-- Thread Content -->
                        <div style="flex: 1;">
                            <div style="font-size: 0.75rem; color: #787C7E; margin-bottom: 8px;">
                                <a href="#" onclick="selectCategory('${thread.category}'); closeThreadView(); return false;" style="font-weight: 700; color: #1c1c1c; text-decoration: none;">r/${thread.category.replace(/ & /g, '').replace(/ /g, '')}</a>
                                <span> • Posted by </span>
                                <span style="color: #1c1c1c;">u/${escapeHtml(thread.author)}</span>
                                <span> • ${timeAgo}</span>
                            </div>
                            <h2 style="font-size: 1.5rem; font-weight: 600; color: #1c1c1c; margin-bottom: 12px;">${escapeHtml(thread.title)}</h2>
                            <div style="font-size: 0.875rem; color: #1c1c1c; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(thread.content)}</div>
                            
                            <!-- Post Actions -->
                            <div style="display: flex; gap: 16px; margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e5e5;">
                                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: #878A8C;">
                                    <i class="far fa-comment-alt"></i>
                                    <span>${commentCount === 0 ? 'No' : commentCount} Comment${commentCount === 1 ? '' : 's'}</span>
                                </div>
                                <div onclick="sharePost(${thread.id})" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: #878A8C; cursor: pointer;">
                                    <i class="far fa-share-square"></i>
                                    <span>Share</span>
                                </div>
                                <div onclick="savePost(${thread.id})" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: #${saved ? '0f766e' : '878A8C'}; cursor: pointer;">
                                    <i class="${saved ? 'fas fa-bookmark' : 'far fa-bookmark'}"></i>
                                    <span>${saved ? 'Saved' : 'Save'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Comment Section -->
                <div style="padding: 20px;">
                    <!-- Add Comment Box -->
                    <div style="margin-bottom: 24px; border: 1px solid #ccc; border-radius: 4px; background: #f8f9fa;">
                        <textarea id="newCommentText" placeholder="${currentUser ? 'What are your thoughts?' : 'Sign in to comment'}" 
                                  style="width: 100%; min-height: 100px; padding: 12px; border: none; background: transparent; resize: vertical; font-family: inherit; font-size: 0.875rem;"
                                  ${!currentUser ? 'disabled' : ''}></textarea>
                        <div style="padding: 8px 12px; background: #fafafa; border-top: 1px solid #e5e5e5; text-align: right;">
                            <button onclick="${!currentUser ? 'openAuthModal()' : `addComment(${thread.id})`}" 
                                    style="padding: 8px 24px; background: #0079D3; color: white; border: none; border-radius: 9999px; font-weight: 700; cursor: pointer; font-size: 0.875rem;">
                                ${!currentUser ? 'Sign In to Comment' : 'Comment'}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Comments List -->
                    <div id="commentsList">
                        ${thread.comments.length === 0 ? 
                            '<p style="text-align: center; color: #878A8C; padding: 40px 0; font-size: 0.875rem;">No comments yet. Be the first to comment!</p>' :
                            thread.comments.map(comment => renderComment(comment, thread.id)).join('')
                        }
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
    
    function renderComment(comment, threadId) {
        const date = new Date(comment.date);
        const timeAgo = getTimeAgo(date);
        const commentVotes = comment.votes || 0;
        
        return `
            <div style="border-left: 2px solid #e5e5e5; padding-left: 16px; margin-bottom: 16px;">
                <div style="display: flex; gap: 12px;">
                    <!-- Comment Vote Buttons -->
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <button class="vote-btn upvote" onclick="voteComment(${threadId}, ${comment.id}, 'up'); refreshThreadView(${threadId});" style="padding: 4px 8px; font-size: 0.7rem;">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <div style="font-size: 0.75rem; font-weight: 700; color: ${commentVotes > 0 ? '#FF4500' : (commentVotes < 0 ? '#7193FF' : '#878A8C')};">${commentVotes}</div>
                        <button class="vote-btn downvote" onclick="voteComment(${threadId}, ${comment.id}, 'down'); refreshThreadView(${threadId});" style="padding: 4px 8px; font-size: 0.7rem;">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                    </div>
                    
                    <!-- Comment Content -->
                    <div style="flex: 1;">
                        <div style="font-size: 0.75rem; color: #878A8C; margin-bottom: 6px;">
                            <span style="font-weight: 700; color: #1c1c1c;">u/${escapeHtml(comment.author)}</span>
                            <span> • ${timeAgo}</span>
                        </div>
                        <div style="font-size: 0.875rem; color: #1c1c1c; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(comment.content)}</div>
                        <div style="display: flex; gap: 12px; margin-top: 8px;">
                            <button onclick="replyToComment(${threadId}, ${comment.id})" style="background: none; border: none; font-size: 0.75rem; font-weight: 700; color: #878A8C; cursor: pointer; padding: 4px 8px;">
                                <i class="fas fa-reply"></i> Reply
                            </button>
                        </div>
                        
                        <!-- Nested Replies -->
                        ${comment.replies && comment.replies.length > 0 ? `
                            <div style="margin-top: 12px;">
                                ${comment.replies.map(reply => renderReply(reply, threadId, comment.id)).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderReply(reply, threadId, parentCommentId) {
        const date = new Date(reply.date);
        const timeAgo = getTimeAgo(date);
        const replyVotes = reply.votes || 0;
        
        return `
            <div style="border-left: 2px solid #e5e5e5; padding-left: 12px; margin-bottom: 12px;">
                <div style="display: flex; gap: 8px;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <button class="vote-btn upvote" onclick="voteReply(${threadId}, ${parentCommentId}, ${reply.id}, 'up'); refreshThreadView(${threadId});" style="padding: 2px 6px; font-size: 0.65rem;">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <div style="font-size: 0.7rem; font-weight: 700; color: ${replyVotes > 0 ? '#FF4500' : (replyVotes < 0 ? '#7193FF' : '#878A8C')};">${replyVotes}</div>
                        <button class="vote-btn downvote" onclick="voteReply(${threadId}, ${parentCommentId}, ${reply.id}, 'down'); refreshThreadView(${threadId});" style="padding: 2px 6px; font-size: 0.65rem;">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 0.7rem; color: #878A8C; margin-bottom: 4px;">
                            <span style="font-weight: 700; color: #1c1c1c;">u/${escapeHtml(reply.author)}</span>
                            <span> • ${timeAgo}</span>
                        </div>
                        <div style="font-size: 0.8rem; color: #1c1c1c; line-height: 1.4; white-space: pre-wrap;">${escapeHtml(reply.content)}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function addComment(threadId) {
        if (!currentUser) {
            openAuthModal();
            return;
        }
        
        const textarea = document.getElementById('newCommentText');
        const content = textarea.value.trim();
        
        if (!content) {
            alert('Please enter a comment');
            return;
        }
        
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;
        
        if (!thread.comments) {
            thread.comments = [];
        }
        
        const newComment = {
            id: Date.now(),
            author: currentUser.username,
            content: content,
            date: new Date().toISOString(),
            votes: 0,
            replies: []
        };
        
        thread.comments.push(newComment);
        saveThreads();
        
        // Refresh the thread view
        refreshThreadView(threadId);
        
        // Clear textarea
        textarea.value = '';
    }
    
    function replyToComment(threadId, commentId) {
        if (!currentUser) {
            openAuthModal();
            return;
        }
        
        const replyContent = prompt('Enter your reply:');
        if (!replyContent || !replyContent.trim()) return;
        
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;
        
        const comment = thread.comments.find(c => c.id === commentId);
        if (!comment) return;
        
        if (!comment.replies) {
            comment.replies = [];
        }
        
        const newReply = {
            id: Date.now(),
            author: currentUser.username,
            content: replyContent.trim(),
            date: new Date().toISOString(),
            votes: 0
        };
        
        comment.replies.push(newReply);
        saveThreads();
        
        refreshThreadView(threadId);
    }
    
    function voteComment(threadId, commentId, direction) {
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;
        
        const comment = thread.comments.find(c => c.id === commentId);
        if (!comment) return;
        
        if (!comment.votes) comment.votes = 0;
        
        if (direction === 'up') {
            comment.votes++;
        } else {
            comment.votes--;
        }
        
        saveThreads();
    }
    
    function voteReply(threadId, commentId, replyId, direction) {
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;
        
        const comment = thread.comments.find(c => c.id === commentId);
        if (!comment) return;
        
        const reply = comment.replies.find(r => r.id === replyId);
        if (!reply) return;
        
        if (!reply.votes) reply.votes = 0;
        
        if (direction === 'up') {
            reply.votes++;
        } else {
            reply.votes--;
        }
        
        saveThreads();
    }
    
    function refreshThreadView(threadId) {
        viewThread(threadId, { skipViewIncrement: true });
    }
    
    function closeThreadView() {
        const modal = document.getElementById('threadViewModal');
        if (modal) {
            modal.style.display = 'none';
        }
        displayThreads(); // Refresh main feed to show updated comment counts
    }
    
    function sharePost(threadId) {
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;
        
        const url = window.location.href;
        const text = `Check out this discussion: ${thread.title}`;
        
        if (navigator.share) {
            navigator.share({ title: thread.title, text: text, url: url })
                .catch(err => console.log('Share cancelled'));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${text}\n${url}`)
                .then(() => alert('✅ Link copied to clipboard!'))
                .catch(() => alert('Share link: ' + url));
        }
    }

    function isPostSaved(threadId) {
        return !!(currentUser && currentUser.savedPosts && currentUser.savedPosts.includes(threadId));
    }
    
    function savePost(threadId) {
        if (!currentUser) {
            alert('Please sign in to save posts');
            openAuthModal();
            return;
        }
        
        if (!currentUser.savedPosts) {
            currentUser.savedPosts = [];
        }
        
        if (currentUser.savedPosts.includes(threadId)) {
            currentUser.savedPosts = currentUser.savedPosts.filter(id => id !== threadId);
            alert('✅ Post unsaved');
        } else {
            currentUser.savedPosts.push(threadId);
            alert('✅ Post saved!');
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Persist to users list
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('forumUsers', JSON.stringify(users));
        }

        displayThreads();
        updateUserUI();

        // Refresh open modal state without bumping views
        const modal = document.getElementById('threadViewModal');
        if (modal && modal.style.display === 'flex') {
            refreshThreadView(threadId);
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
        if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
        return `${Math.floor(seconds / 31536000)}y ago`;
    }

    window.votePost = function(threadId, direction) {
        const thread = threads.find(t => t.id === threadId);
        if (thread) {
            if (direction === 'up') {
                thread.likes = (thread.likes || 0) + 1;
            } else {
                thread.likes = (thread.likes || 0) - 1;
            }
            saveThreads();
            displayThreads();
        }
    };
    
    function loadThreads() {
        const stored = localStorage.getItem('vfi_forum_threads');
        if (stored) {
            threads = JSON.parse(stored);
        }
    }
    
    function saveThreads() {
        localStorage.setItem('vfi_forum_threads', JSON.stringify(threads));
    }
    
    function loadUsers() {
        const stored = localStorage.getItem('forumUsers');
        if (stored) {
            users = JSON.parse(stored);
        }
    }
    
    function loadCurrentUser() {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    }
    
    function getUserStats(user) {
        const savedPosts = user.savedPosts ? user.savedPosts.length : 0;
        const authoredThreads = threads.filter(t => t.authorId === user.id || t.author === user.username).length;
        const authoredComments = threads.reduce((acc, t) => {
            if (!t.comments) return acc;
            return acc + t.comments.filter(c => c.author === user.username).length;
        }, 0);
        const reputation = user.reputation || (authoredThreads * 5 + authoredComments * 2 + (user.posts || 0));
        return { savedPosts, authoredThreads, authoredComments, reputation };
    }

    function renderUserProfile(user) {
        const stats = getUserStats(user);
        const levelData = getLevelByReputation(user.reputation || 0);
        
        return `
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0;">
                <div style="width: 52px; height: 52px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.2rem;">
                    ${user.username.charAt(0).toUpperCase()}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 700; color: #e2e8f0; font-size: 0.95rem;">u/${user.username}</div>
                    <div style="font-size: 0.8rem; color: #fbbf24; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                        <span>⭐ Level ${levelData.level}</span>
                        <span style="color: #94a3b8;">•</span>
                        <span style="color: #94a3b8;">${levelData.title}</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">
                        <span><i class="fas fa-star" style="color: #fbbf24;"></i> ${stats.reputation} Faithfulness Points</span>
                    </div>
                </div>
            </div>
            <div style="background: rgba(251, 191, 36, 0.1); border-left: 4px solid #fbbf24; border-radius: 8px; padding: 12px; margin: 12px 0; color: #cbd5e1;">
                <p style="font-size: 0.75rem; font-weight: 600; color: #fbbf24; margin: 0 0 6px 0;">Scripture for Today:</p>
                <p style="font-size: 0.85rem; font-style: italic; margin: 0 0 4px 0; line-height: 1.4;">"${levelData.verse}"</p>
                <p style="font-size: 0.75rem; color: #94a3b8; margin: 0;">— ${levelData.scripture}</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 10px 0;">
                <div style="background: rgba(96, 165, 250, 0.15); border: 1px solid rgba(96, 165, 250, 0.2); border-radius: 8px; padding: 8px; text-align: center;">
                    <div style="font-weight: 700; color: #e2e8f0;">${stats.authoredThreads}</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">Posts</div>
                </div>
                <div style="background: rgba(96, 165, 250, 0.15); border: 1px solid rgba(96, 165, 250, 0.2); border-radius: 8px; padding: 8px; text-align: center;">
                    <div style="font-weight: 700; color: #e2e8f0;">${stats.authoredComments}</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">Comments</div>
                </div>
                <div style="background: rgba(96, 165, 250, 0.15); border: 1px solid rgba(96, 165, 250, 0.2); border-radius: 8px; padding: 8px; text-align: center;">
                    <div style="font-weight: 700; color: #e2e8f0;">${stats.savedPosts}</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">Saved</div>
                </div>
            </div>
            <button onclick="logout()" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 9999px; font-weight: 700; cursor: pointer; font-size: 0.9rem; margin-top: 4px;">Sign Out</button>
        `;
    }

    function updateUserUI() {
        const heroSection = document.getElementById('userSectionHero');
        const profileCard = document.getElementById('userProfileCard');

        if (currentUser) {
            const profileHtml = renderUserProfile(currentUser);
            if (heroSection) {
                heroSection.innerHTML = `
                    <div style="background: rgba(255,255,255,0.12); padding: 10px 14px; border-radius: 12px; color: white; display: flex; align-items: center; gap: 10px;">
                        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;">
                            ${currentUser.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style="font-weight: 700;">u/${currentUser.username}</div>
                            <div style="font-size: 0.85rem; opacity: 0.8;"><i class="fas fa-star" style="color: #fbbf24;"></i> ${getUserStats(currentUser).reputation} Faithfulness Points</div>
                        </div>
                        <button onclick="logout()" style="margin-left: auto; padding: 8px 12px; background: white; color: #3b82f6; border: none; border-radius: 9999px; font-weight: 700; cursor: pointer;">Sign Out</button>
                    </div>
                `;
            }
            if (profileCard) {
                profileCard.innerHTML = profileHtml;
            }
        } else {
            const guestHtml = `
                <div style="text-align: center; padding: 16px 0;">
                    <p style="font-size: 0.9rem; color: #1c1c1c; margin-bottom: 12px;">Join our community of believers!</p>
                    <button onclick="openAuthModal()" style="width: 100%; padding: 10px; background: #0079D3; color: white; border: none; border-radius: 9999px; font-weight: 700; cursor: pointer;">
                        Sign In / Sign Up
                    </button>
                </div>
            `;
            if (heroSection) heroSection.innerHTML = guestHtml;
            if (profileCard) profileCard.innerHTML = guestHtml;
        }
    }
    
    function addSampleThreads() {
        threads = [
            {
                id: 1,
                author: 'Sarah Cohen',
                authorId: 10001,
                category: 'Israel & Jerusalem',
                title: 'The Significance of Jerusalem in Biblical Prophecy',
                content: 'I\'ve been studying Zechariah 12 and the prophecies about Jerusalem in the last days. It\'s amazing to see how current events align with these ancient prophecies. What are your thoughts on Jerusalem\'s role in end times?',
                date: new Date(Date.now() - 86400000 * 1).toISOString(),
                replies: 23,
                views: 156,
                likes: 45,
                comments: [
                    {
                        id: 101,
                        author: 'Benjamin Stone',
                        content: 'Zechariah 12:3 says "all nations of the earth will be gathered against it" - we\'re seeing this play out today with UN resolutions and international pressure. Jerusalem truly is the "burdensome stone" as prophesied!',
                        date: new Date(Date.now() - 86400000 * 1 + 7200000).toISOString(),
                        votes: 12,
                        replies: [
                            {
                                id: 1011,
                                author: 'Sarah Cohen',
                                content: 'Exactly! And verse 10 talks about them looking on "Me whom they have pierced" - this is clearly about Yeshua\'s second coming when all Israel will recognize Him.',
                                date: new Date(Date.now() - 86400000 * 1 + 10800000).toISOString(),
                                votes: 8
                            }
                        ]
                    },
                    {
                        id: 102,
                        author: 'Hannah Gold',
                        content: 'Don\'t forget Romans 11:26 - "all Israel will be saved"! The mass recognition of Yeshua as Messiah is coming. What an amazing time to be alive!',
                        date: new Date(Date.now() - 86400000 * 1 + 14400000).toISOString(),
                        votes: 15,
                        replies: []
                    }
                ]
            },
            {
                id: 2,
                author: 'David Levi',
                authorId: 10002,
                category: 'Prophecy & End Times',
                title: 'Isaiah 53 - How Did I Miss This?',
                content: 'As a Jewish believer, I was shocked when I first read Isaiah 53. How did I not see this describes Yeshua so clearly? The suffering servant prophecy is mind-blowing. Has anyone else had this experience?',
                date: new Date(Date.now() - 86400000 * 2).toISOString(),
                replies: 34,
                views: 289,
                likes: 67,
                comments: [
                    {
                        id: 201,
                        author: 'Rebecca Stein',
                        content: 'I had the EXACT same experience! I grew up in a traditional Jewish home and we never read Isaiah 53. When I finally did, I wept. "He was pierced for our transgressions" - it\'s so clear!',
                        date: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
                        votes: 23,
                        replies: [
                            {
                                id: 2011,
                                author: 'David Levi',
                                content: 'Yes! And verse 10 says "it pleased the LORD to bruise Him" - God\'s plan all along. The Passover lamb finally made sense to me.',
                                date: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString(),
                                votes: 18
                            }
                        ]
                    },
                    {
                        id: 202,
                        author: 'Matthew Rivers',
                        content: 'This chapter was deliberately left out of the synagogue readings in the annual cycle. That\'s not a coincidence - it\'s too obvious that it\'s about Yeshua.',
                        date: new Date(Date.now() - 86400000 * 2 + 14400000).toISOString(),
                        votes: 31,
                        replies: []
                    },
                    {
                        id: 203,
                        author: 'Miriam Cohen',
                        content: 'My rabbi told me it was about the nation of Israel suffering, but that makes no sense when you read it. "He had done no violence, nor was any deceit in His mouth" - that\'s clearly an individual, not a nation.',
                        date: new Date(Date.now() - 86400000 * 2 + 18000000).toISOString(),
                        votes: 19,
                        replies: []
                    }
                ]
            },
            {
                id: 3,
                author: 'Rachel Johnson',
                authorId: 10003,
                category: 'Testimonies & Miracles',
                title: 'God Healed My Mother!',
                content: 'Praise Yeshua! After months of prayer, my mother has been completely healed of stage 3 cancer. The doctors can\'t explain it. All glory to God! Thank you to everyone who prayed for us.',
                date: new Date(Date.now() - 86400000).toISOString(),
                replies: 56,
                views: 412,
                likes: 134,
                comments: [
                    {
                        id: 301,
                        author: 'Elizabeth Grace',
                        content: 'Hallelujah! God is so good! I\'ve been following your prayer updates and I\'m rejoicing with you! Yeshua is the same yesterday, today, and forever!',
                        date: new Date(Date.now() - 86400000 + 3600000).toISOString(),
                        votes: 45,
                        replies: [
                            {
                                id: 3011,
                                author: 'Rachel Johnson',
                                content: 'Thank you so much! Your prayers meant everything to us. God heard every single one. ❤️',
                                date: new Date(Date.now() - 86400000 + 7200000).toISOString(),
                                votes: 28
                            }
                        ]
                    },
                    {
                        id: 302,
                        author: 'Pastor James',
                        content: 'This is a powerful testimony! Would you be willing to share this at our Sunday service? I believe it would encourage so many people who are believing God for healing.',
                        date: new Date(Date.now() - 86400000 + 10800000).toISOString(),
                        votes: 22,
                        replies: []
                    },
                    {
                        id: 303,
                        author: 'Daniel Wright',
                        content: 'Amazing! My father was also healed of cancer after we prayed James 5:14-15. The elders anointed him with oil and within weeks the tumor was gone. God still heals today!',
                        date: new Date(Date.now() - 86400000 + 14400000).toISOString(),
                        votes: 38,
                        replies: []
                    }
                ]
            },
            {
                id: 4,
                author: 'Michael Berg',
                authorId: 10004,
                category: 'Faith & Doctrine',
                title: 'Understanding the Feasts of the LORD',
                content: 'I\'m learning about the biblical feasts (Leviticus 23) and how they point to Messiah. Passover = crucifixion, Pentecost = Holy Spirit, etc. Are we supposed to observe these as believers?',
                date: new Date(Date.now() - 86400000 * 3).toISOString(),
                replies: 41,
                views: 301,
                likes: 52,
                comments: [
                    {
                        id: 401,
                        author: 'Aaron Goldstein',
                        content: 'Yes! Colossians 2:16-17 calls them a "shadow of things to come" - they point to Messiah. Passover = His death, Unleavened Bread = burial, Firstfruits = resurrection, Pentecost = Holy Spirit. The fall feasts (Trumpets, Atonement, Tabernacles) point to His second coming!',
                        date: new Date(Date.now() - 86400000 * 3 + 3600000).toISOString(),
                        votes: 34,
                        replies: [
                            {
                                id: 4011,
                                author: 'Michael Berg',
                                content: 'Wow, I didn\'t connect the fall feasts to the second coming! So Trumpets = rapture, Atonement = judgment, Tabernacles = millennial kingdom?',
                                date: new Date(Date.now() - 86400000 * 3 + 7200000).toISOString(),
                                votes: 21
                            },
                            {
                                id: 4012,
                                author: 'Aaron Goldstein',
                                content: 'Exactly! And they were all fulfilled on the exact day of the feast. Yeshua died on Passover, rose on Firstfruits, and sent the Spirit on Pentecost. The fall feasts will be fulfilled the same way!',
                                date: new Date(Date.now() - 86400000 * 3 + 10800000).toISOString(),
                                votes: 29
                            }
                        ]
                    },
                    {
                        id: 402,
                        author: 'Lydia Thompson',
                        content: 'We celebrate all the feasts in our family! It\'s not required for salvation (Romans 14), but it enriches our faith so much. Plus, Yeshua celebrated them!',
                        date: new Date(Date.now() - 86400000 * 3 + 14400000).toISOString(),
                        votes: 18,
                        replies: []
                    }
                ]
            },
            {
                id: 5,
                author: 'Ruth Martinez',
                authorId: 10005,
                category: 'Prayer Requests',
                title: 'Please Pray for Israel\'s Protection',
                content: 'With all that\'s happening in the Middle East right now, please join me in praying for Israel\'s safety and the IDF soldiers defending the nation. Psalm 122:6 - Pray for the peace of Jerusalem!',
                date: new Date(Date.now() - 86400000 * 4).toISOString(),
                replies: 78,
                views: 523,
                likes: 112,
                comments: [
                    {
                        id: 501,
                        author: 'Caleb Anderson',
                        content: 'Praying! Genesis 12:3 - "I will bless those who bless you, and whoever curses you I will curse." Standing with Israel is standing with God\'s covenant people!',
                        date: new Date(Date.now() - 86400000 * 4 + 3600000).toISOString(),
                        votes: 56,
                        replies: []
                    },
                    {
                        id: 502,
                        author: 'Deborah Wells',
                        content: 'Amen! Praying Psalm 121:4 - "He who watches over Israel will neither slumber nor sleep." Our God is faithful to His promises!',
                        date: new Date(Date.now() - 86400000 * 4 + 7200000).toISOString(),
                        votes: 48,
                        replies: [
                            {
                                id: 5021,
                                author: 'Ruth Martinez',
                                content: 'Thank you! Let\'s also pray for the salvation of both Israelis and Palestinians. God loves them all and wants none to perish.',
                                date: new Date(Date.now() - 86400000 * 4 + 10800000).toISOString(),
                                votes: 41
                            }
                        ]
                    }
                ]
            },
            {
                id: 6,
                author: 'Joshua Kim',
                authorId: 10006,
                category: 'Questions & Answers',
                title: 'How Do I Share Yeshua with My Jewish Friends?',
                content: 'I have several Jewish friends and I want to share the Gospel, but I don\'t want to be offensive. How do I approach this sensitively while still being faithful to share the truth?',
                date: new Date(Date.now() - 86400000 * 5).toISOString(),
                replies: 29,
                views: 234,
                likes: 38,
                comments: [
                    {
                        id: 601,
                        author: 'Jacob Silver',
                        content: 'As a Jewish believer, I recommend starting with the Tanakh (Old Testament) prophecies. Show them Messiah in their own scriptures - Isaiah 53, Psalm 22, Daniel 9:24-27, Micah 5:2. The Holy Spirit will do the rest!',
                        date: new Date(Date.now() - 86400000 * 5 + 3600000).toISOString(),
                        votes: 27,
                        replies: [
                            {
                                id: 6011,
                                author: 'Joshua Kim',
                                content: 'That\'s brilliant! So I should focus on showing them Yeshua is the fulfillment of their own scriptures rather than starting with the New Testament?',
                                date: new Date(Date.now() - 86400000 * 5 + 7200000).toISOString(),
                                votes: 15
                            },
                            {
                                id: 6012,
                                author: 'Jacob Silver',
                                content: 'Exactly! The New Testament is built on the Old. Show them the foundation first. Also, emphasize that believing in Yeshua makes them MORE Jewish, not less. He\'s the Jewish Messiah!',
                                date: new Date(Date.now() - 86400000 * 5 + 10800000).toISOString(),
                                votes: 22
                            }
                        ]
                    },
                    {
                        id: 602,
                        author: 'Naomi Fisher',
                        content: 'Pray for them! I prayed for my brother for 10 years before he came to faith. Your love and prayers are more powerful than your words. Live out Yeshua\'s love and let the Holy Spirit convict.',
                        date: new Date(Date.now() - 86400000 * 5 + 14400000).toISOString(),
                        votes: 19,
                        replies: []
                    }
                ]
            }
        ];
        saveThreads();
    }
    
    // Global functions for modals
    window.openAuthModal = function() {
        authModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
    
    window.closeAuthModal = function() {
        authModal.style.display = 'none';
        document.body.style.overflow = '';
        loginForm.reset();
        signupForm.reset();
        showLoginForm();
    };
    
    window.showLoginForm = function() {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        document.getElementById('authModalTitle').textContent = '🔐 Sign In';
    };
    
    window.showSignupForm = function() {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        document.getElementById('authModalTitle').textContent = '✨ Create Account';
    };
    
    window.logout = function() {
        if (confirm('Are you sure you want to sign out?')) {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUserUI();
            alert('👋 You have been signed out');
        }
    };
    
    window.openNewThreadModal = function() {
        if (!currentUser) {
            alert('⚠️ Please sign in to create a discussion');
            openAuthModal();
            return;
        }
        newThreadModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
    
    window.closeNewThreadModal = function() {
        newThreadModal.style.display = 'none';
        document.body.style.overflow = '';
    };
    
    window.selectCategory = function(category) {
        currentCategory = category;
        displayThreads();
        // Scroll to threads
        document.getElementById('threadsContainer').scrollIntoView({ behavior: 'smooth' });
    };
    
    // Update community statistics with accurate counts
    function updateCommunityStats() {
        const memberCountEl = document.getElementById('memberCount');
        const onlineCountEl = document.getElementById('onlineCount');
        
        if (memberCountEl) {
            memberCountEl.textContent = users.length;
        }
        
        if (onlineCountEl) {
            // Simulate online users (10-30% of registered users)
            const onlineUsers = Math.max(1, Math.floor(users.length * (0.1 + Math.random() * 0.2)));
            onlineCountEl.textContent = onlineUsers;
        }
    }
    
    // Call stats update on load and periodically
    updateCommunityStats();
    setInterval(updateCommunityStats, 30000); // Update every 30 seconds
    
    // Override votePost to check authentication
    const originalVotePost = window.votePost;
    window.votePost = function(threadId, direction) {
        if (!showGuestPrompt('vote on posts')) return;
        if (originalVotePost) originalVotePost(threadId, direction);
    };

    // Expose forum actions globally for inline handlers
    window.viewThread = (threadId) => viewThread(threadId);
    window.closeThreadView = closeThreadView;
    window.sharePost = sharePost;
    window.savePost = savePost;
    window.addComment = addComment;
    window.replyToComment = replyToComment;
    window.voteComment = voteComment;
    window.voteReply = voteReply;
    window.refreshThreadView = refreshThreadView;

    // Close modals on outside click
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });
    
    newThreadModal.addEventListener('click', function(e) {
        if (e.target === newThreadModal) {
            closeNewThreadModal();
        }
    });
});
