import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm";

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme based on user's system preference
document.body.setAttribute('data-theme', prefersDarkScheme.matches ? 'dark' : 'light');

// Update theme toggle icon
function updateThemeIcon(isDark) {
  themeToggle.innerHTML = isDark ? `
    <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ` : `
    <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  `;
}

// Initial icon update
updateThemeIcon(prefersDarkScheme.matches);

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  updateThemeIcon(newTheme === 'dark');
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
  document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  updateThemeIcon(e.matches);
});

// Animate market cards
const cards = document.querySelectorAll('.market-card');
cards.forEach((card, index) => {
  gsap.set(card, { 
    rotationY: -10 + (index * 5),
    y: 20 * index
  });
  
  gsap.to(card, {
    rotationY: 10 + (index * 5),
    y: 20 + (20 * index),
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });
});

// Animate stats counting up
const stats = document.querySelectorAll('.stat-value');
stats.forEach(stat => {
  const value = stat.textContent;
  stat.textContent = '0';
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stat.textContent = value;
        observer.unobserve(entry.target);
      }
    });
  });
  
  observer.observe(stat);
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});



// Animate elements on scroll
gsap.from('.feature-card', {
  scrollTrigger: {
    trigger: '.features',
    start: 'top center'
  },
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2
});

gsap.from('.stat-card', {
  scrollTrigger: {
    trigger: '.stats',
    start: 'top center'
  },
  scale: 0.8,
  opacity: 0,
  duration: 0.6,
  stagger: 0.2
});

// Initialize Swiper
const swiper = new Swiper('.swiper', {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  }
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Waitlist form handling
const waitlistForm = document.getElementById('waitlistForm');
const waitlistMessage = document.getElementById('waitlistMessage');

waitlistForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const userType = document.getElementById('userType').value;
  
  try {
    // In a real implementation, this would be your API endpoint
    // For demo purposes, we'll simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in localStorage for demo purposes
    const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
    waitlist.push({ email, userType, timestamp: new Date().toISOString() });
    localStorage.setItem('waitlist', JSON.stringify(waitlist));
    
    // Show success message
    waitlistMessage.textContent = 'Successfully joined the waitlist! We\'ll keep you updated.';
    waitlistMessage.className = 'waitlist-message success';
    
    // Reset form
    waitlistForm.reset();
    
    // Animate success message
    gsap.from(waitlistMessage, {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    });
    
  } catch (error) {
    waitlistMessage.textContent = 'Something went wrong. Please try again later.';
    waitlistMessage.className = 'waitlist-message error';
  }
});

// Animate waitlist section
gsap.from('.waitlist', {
  scrollTrigger: {
    trigger: '.waitlist',
    start: 'top center'
  },
  y: 50,
  opacity: 0,
  duration: 0.8
});