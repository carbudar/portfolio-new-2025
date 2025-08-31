let scrollPercentage = 0;  // Variable to hold the current scroll percentage

// Scroll event listener for background color change and trail color adjustment
window.addEventListener("scroll", changeBackgroundColor);
function changeBackgroundColor() {
    const pageContainer = document.querySelector('.landing-page-container');
    const blurEffect = document.querySelector('.blurEffect');
    const header = document.querySelector('.header');
    const logoImage = document.querySelector(".logo-img");

    const scrollTop = window.scrollY; // Vertical scroll position
    const docHeight = document.documentElement.scrollHeight; // Total height of the document
    const windowHeight = window.innerHeight; // Height of the viewport

    // Calculate percentage of page scrolled and round it down
    scrollPercentage = Math.floor((scrollTop / (docHeight - windowHeight)) * 100);

    // Change background and logo color based on scroll percentage
    if (scrollPercentage <= 30) {
        // Background color white default
        pageContainer.style.backgroundColor = "#F9F7F2";
        header.style.backgroundColor = "#126889";
        blurEffect.style.opacity = "0";
        header.style.color = "#EDED14";
        logoImage.src = "assets/logo header yellow.png";
    } else {
        // Background color change to teal
        pageContainer.style.backgroundColor = "#126889";
        header.style.backgroundColor = "#F9F7F2";
        header.style.color = "#126889";
        logoImage.src = "assets/logo header teal.png";
    }

    if (scrollPercentage >= 40) {
        blurEffect.style.opacity = "1";  // Set opacity to 1 instead of "10"
    }
}

// Mouse trail function
function mouseTrail() {
    document.addEventListener('mousemove', (e) => {
        // Get the mouse position
        const mouseX = e.clientX;
        const mouseY = e.clientY + window.scrollY;  // Adjust for the current scroll position

        // Create a new circle (trail) element
        const trail = document.createElement('div');
        trail.classList.add('trail');
        trail.style.position = 'absolute';  // Ensure it's positioned correctly
        trail.style.left = `${mouseX - 10}px`; // Adjust trail position
        trail.style.top = `${mouseY - 10}px`;  // Adjust for scroll offset
        trail.style.pointerEvents = 'none'; // Allow interaction with underlying elements
        trail.style.zIndex = '100';  // Ensure it appears above other content
    
        // Style the trail circle (add your custom styles here)
        trail.style.width = '20px';  // Customize the size
        trail.style.height = '20px';  // Customize the size
        trail.style.borderRadius = '50%';  // Make it a circle
        trail.style.transition = 'transform 0.2s ease'; // Smooth transition
    
        // Dynamically change trail color based on scroll percentage
        if (scrollPercentage <= 30) {
            trail.style.backgroundColor = 'rgba(255, 210, 255, 0.8)';  // Light color (example)
        } else {
            trail.style.backgroundColor = 'rgba(237, 237, 20, 0.8)';  // Yellow color (example)
        }

        // Add the circle to the body
        document.body.appendChild(trail);

        // Remove the circle after 200ms (for the trail effect to be visible)
        setTimeout(() => {
            trail.remove();
        }, 200); // The trail disappears after 200ms
    });
}

// Invoke the mouseTrail function globally on the whole page
mouseTrail();
