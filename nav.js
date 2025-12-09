// nav.js - handle navigation overflow for desktop
console.log("Navigation script loaded.");
document.addEventListener('DOMContentLoaded', () => {
  const navButton = document.querySelector('.nav-button');
  const navToggle = document.querySelector('.nav-toggle');
  const navOverflowButton = document.querySelector('.nav-overflow-button');
  const overflowList = document.querySelector('#nav-overflow-list');
  // Elements used for width calculation – defined once for performance
  const topBar = document.querySelector('.top-bar');
  const logo = document.querySelector('.nav-logo');
  const signUpButton = document.querySelector('.signin-up-button');
  
  if (!navButton || !navToggle || !navOverflowButton || !overflowList) return;

  // Desktop overflow handling (> 768px)
  function checkForOverflow() {
    // Get all direct child divs (which contain the nav items)
    const navItems = Array.from(navButton.children);
    // Only run for desktop width
    if (window.innerWidth <= 768) {
      navOverflowButton.style.display = '';
      navItems.forEach(item => {
        item.style = '';
        item.removeAttribute('aria-hidden');
        item.removeAttribute('tabindex');
      });
      return;
    }
    if (navButton.classList.contains('open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navButton.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
    // Calculate available width: top-bar width minus logo and sign‑up/in widths
    let containerWidth = navButton.clientWidth;
    if (topBar && logo && signUpButton && navOverflowButton) {
      containerWidth = topBar.clientWidth - logo.offsetWidth - signUpButton.offsetWidth - navOverflowButton.offsetWidth;
    }
    const overflowMenuWidth = 50; // space reserved for overflow button
    
    // Clear previous overflow items
    overflowList.innerHTML = '';
    
    let currentWidth = 0;
    const itemsToMove = [];
    let navButtonWidth = 0;
    // Iterate through items and check for overflow
    navItems.forEach((item, index) => {
      // skip it, this only display when vw < 400px in mobile view
      if (item.className === 'not-enough-space-signin-up-button') return; 
      const itemWidth = item.getBoundingClientRect().width;
      console.log(`Nav item ${index} width: ${itemWidth}px`);
      currentWidth += itemWidth;

      // If adding this item would exceed container, move it to overflow
      if (currentWidth + overflowMenuWidth > containerWidth) {
        itemsToMove.push(item.cloneNode(true)); // Clone to overflow list
        item.style.opacity = '0'; // Hide original
        item.style.pointerEvents = 'none';
        item.style.userSelect = 'none';
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
      } else {
        item.style.opacity = ''; // Show original
        item.style.pointerEvents = '';
        item.style.userSelect = '';
        item.removeAttribute('aria-hidden');
        item.removeAttribute('tabindex');
        navButtonWidth += itemWidth;
      }
    });
    if (itemsToMove.length > 0) navButton.style.width = navButtonWidth + 'px';
    else navButton.style.width = '';
    // Update overflow list
    if (itemsToMove.length > 0) {
      itemsToMove.forEach(item => {
        item.style.opacity = ''; // Show original
        item.style.pointerEvents = '';
        item.style.userSelect = '';
        item.removeAttribute('aria-hidden');
        item.removeAttribute('tabindex');
        overflowList.appendChild(item);
      });
      overflowList.classList.add('show');
      navOverflowButton.style.display = 'inline-block';
    } else {
      overflowList.classList.remove('show');
      navOverflowButton.style.display = '';
    }

    console.log('Desktop overflow check', { currentWidth, containerWidth, overflowed: itemsToMove.length });
  }

  // Initial check and event listeners
  window.addEventListener('load', checkForOverflow);
  window.addEventListener('resize', checkForOverflow);
  checkForOverflow();

  // Setup overflow menu toggle
  navButton.addEventListener('click', () => {
    if (navButton.classList.contains('open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navButton.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  });
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navButton.classList.toggle('open');
    document.body.classList.toggle('nav-open', !expanded);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!overflowList.classList.contains('show')) return;
    if (e.target === navToggle) return;
    if (overflowList.contains(e.target)) return;
    
    overflowList.classList.remove('show');
  });
});
