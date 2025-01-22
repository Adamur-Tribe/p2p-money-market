import { useState } from 'react'
import './App.css'
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm";

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

// Connect wallet button
const connectWalletBtn = document.querySelector('.connect-wallet');
connectWalletBtn.addEventListener('click', async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      connectWalletBtn.textContent = 'Connected';
    } catch (error) {
      console.error(error);
    }
  } else {
    alert('Please install MetaMask to connect your wallet!');
  }
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

// Waitlist form handling
const waitlistForm = document.getElementById('waitlistForm');
const waitlistMessage = document.getElementById('waitlistMessage');

waitlistForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const userType = document.getElementById('userType').value;

  // Simulate API call
  try {
    // In a real application, this would be an actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful registration
    waitlistMessage.textContent = 'Thank you for joining our waitlist! We\'ll notify you when we launch.';
    waitlistMessage.className = 'waitlist-message success';

    // Clear form
    waitlistForm.reset();

    // Store in localStorage for demo purposes
    const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
    waitlist.push({ email, userType, timestamp: new Date().toISOString() });
    localStorage.setItem('waitlist', JSON.stringify(waitlist));

  } catch (error) {
    waitlistMessage.textContent = 'There was an error joining the waitlist. Please try again.';
    waitlistMessage.className = 'waitlist-message error';
  }
});

// Animate waitlist section
gsap.from('.waitlist-container', {
  scrollTrigger: {
    trigger: '.waitlist',
    start: 'top center'
  },
  y: 50,
  opacity: 0,
  duration: 0.8
});
