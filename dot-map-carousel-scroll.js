// Combined GSAP Animations for Dot Map Page
// Make sure GSAP and ScrollTrigger are loaded before this script

(function() {
    
    // Horizontal Scroll for Carousel
    function initHorizontalScroll() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('GSAP or ScrollTrigger not loaded. Please include GSAP libraries.');
            return;
        }

        const carousel = document.getElementById('dot-map-progress-carousel');
        const container = document.querySelector('.dot-map-progress-container');
        
        if (!carousel || !container) {
            console.log('Carousel or container not found - skipping horizontal scroll');
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Get the total scrollable width
        const getScrollAmount = () => {
            return -(carousel.scrollWidth - carousel.clientWidth +100);
        };

        // Create the horizontal scroll animation
        const horizontalScroll = gsap.to(carousel, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: () => `+=${carousel.scrollWidth - carousel.clientWidth +100}`,
                pin: true,
                scrub: 1, // Smooth scrubbing (0-3, higher = more lag but smoother)
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });

        console.log('Horizontal scroll initialized');
    }

    //Stacking Cards for Key Learnings
 
    function initStackingCards() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('GSAP or ScrollTrigger not loaded. Please include GSAP libraries.');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const container = document.getElementById('key-learning-cascading');
        const cards = document.querySelectorAll('.key-learning');
        
        if (!container || cards.length === 0) {
            console.log('Key learning container or cards not found - skipping stacking cards');
            return;
        }

        // Calculate card height and gap
        const cardHeight = cards[0].offsetHeight;
        const gap = 30; // Gap between cards in pixels
        
        // Set initial positions - cards stacked vertically (2D) below each other
        cards.forEach((card, index) => {
            const initialY = index * (cardHeight + gap + 700); // Each card starts below the previous
            
            gsap.set(card, {
                y: initialY,
                position: 'absolute',
                top: '30%', // Position relative to center of container
            });
        });

        // Create stacking animation for each card
        cards.forEach((card, index) => {
            if (index === 0) return; // Skip first card, it's already in position
            
            // Calculate how much this card needs to move up
            const targetY = index * gap; // Final stacked position with just gap spacing
            const startY = index * (cardHeight + gap); // Starting position
            
            ScrollTrigger.create({
                trigger: container,
                start: `top+=${index * 100} top`, // Stagger the start (150px per card)
                end: `top+=${index * 100 + 300} top`, // Longer range (300px of scroll per card)
                scrub: 1.5, // Slower, smoother scrubbing
                onUpdate: (self) => {
                    // Interpolate between start and target position based on progress
                    const currentY = gsap.utils.interpolate(startY, targetY, self.progress);
                    gsap.set(card, { y: currentY });
                }
            });
        });

        // Pin the container while cards are stacking
        // Calculate total scroll distance needed
        const totalScrollDistance = (cards.length * 150) + 300 + 100; // Extra padding
        
        ScrollTrigger.create({
            trigger: container,
            start: 'bottom bottom',
            end: `+=${totalScrollDistance}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1
        });

        console.log('Stacking cards initialized');
    }

    // Refresh on Window Resize
    function initResizeHandler() {
        if (typeof ScrollTrigger === 'undefined') return;
        
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });
        
        console.log('Resize handler initialized');
    }

    
    // Initialize all function
    function initAll() {
        initHorizontalScroll();
        initStackingCards();
        initResizeHandler();
        console.log('All GSAP animations initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

})();