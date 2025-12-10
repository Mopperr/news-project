// Navigation auto-scroll on hover - 3x faster speed
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.nav-bar .container-fluid');
    const navMain = document.querySelector('.nav-main');
    
    if (navContainer && navMain) {
        navContainer.addEventListener('mousemove', (e) => {
            const rect = navContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const scrollWidth = navContainer.scrollWidth;
            const edgeThreshold = 150; // pixels from edge to trigger scroll
            
            if (scrollWidth > width) {
                // Near right edge - scroll right (3x faster: 15 instead of 5)
                if (x > width - edgeThreshold) {
                    const speed = ((x - (width - edgeThreshold)) / edgeThreshold) * 15;
                    navContainer.scrollLeft += speed;
                }
                // Near left edge - scroll left (3x faster: 15 instead of 5)
                else if (x < edgeThreshold) {
                    const speed = ((edgeThreshold - x) / edgeThreshold) * 15;
                    navContainer.scrollLeft -= speed;
                }
            }
        });
        
        // Reset scroll on mouse leave
        navContainer.addEventListener('mouseleave', () => {
            // Optionally reset to start
        });
    }
});
