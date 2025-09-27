// Mobile Menu Functionality
console.log('Mobile Menu JS loaded');

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing mobile menu');
  
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');

  if (!mobileMenuBtn || !navLinks) {
    console.error('Mobile menu elements not found!');
    return;
  }

  // Toggle menu visibility
  mobileMenuBtn.addEventListener('click', function() {
    console.log('Menu button clicked');
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
});
