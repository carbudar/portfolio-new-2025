document.addEventListener("DOMContentLoaded", () => {
    const backToTopButton = document.querySelector('.content-backToTop');

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0, // Scroll to the top of the page
                behavior: 'smooth' // Smooth scrolling
            });
        });
    }
});
