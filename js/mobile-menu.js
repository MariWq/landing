// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navLinks) {
        // Toggle menu visibility
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('nav-links-open');
            mobileMenuBtn.classList.toggle('mobile-menu-open');
            document.body.style.overflow = navLinks.classList.contains('nav-links-open') ? 'hidden' : '';
        });

        // Close menu when clicking on links
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-links-open');
                mobileMenuBtn.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            });
        });
    }
});
