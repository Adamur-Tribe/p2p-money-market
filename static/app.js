
// Theme toggle functionality

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');

  if (body.getAttribute('data-theme') === 'dark') {
      body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeToggle.textContent = '🌙';
  } else {
      body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.textContent = '☀️';
  }
}

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