/* ══════════════════════════════════════════════════════════
   contact.js – Digital Hawker Contact Page
   Handles navigation and form interactions.

   Responsibilities:
     1. User dropdown toggle (logged-in state)
     2. Mobile menu toggle
     3. Contact form submission
     4. Close dropdowns when clicking outside
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. USER DROPDOWN TOGGLE (logged-in only)
     ────────────────────────────────────────────── */
  const userDropdown = document.querySelector('.user-dropdown');
  const userToggle   = document.querySelector('.user-toggle');

  if (userDropdown && userToggle) {
    userToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
    });
  }

  /* ──────────────────────────────────────────────
     2. MOBILE MENU TOGGLE
     ────────────────────────────────────────────── */
  const navbar    = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  let mobileMenu  = document.querySelector('.mobile-menu');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('menu-open');

      // Create mobile menu if it doesn't exist
      if (!mobileMenu) {
        mobileMenu = createMobileMenu();
        document.body.appendChild(mobileMenu);
      }

      mobileMenu.classList.toggle('open');
    });
  }

  /* ──────────────────────────────────────────────
     3. CONTACT FORM SUBMISSION
     ────────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const textarea = contactForm.querySelector('.contact-textarea');
      const message = textarea.value.trim();

      if (message) {
        // Show success message
        alert('Thank you for contacting us! We will get back to you soon.');
        
        // Reset form
        textarea.value = '';
        
        // In a real application, you would send this to your backend:
        // sendContactMessage(message);
      }
    });
  }

  /* ──────────────────────────────────────────────
     4. CLOSE DROPDOWNS ON OUTSIDE CLICK
     ────────────────────────────────────────────── */
  document.addEventListener('click', (e) => {
    // Close user dropdown
    if (userDropdown && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove('open');
    }

    // Close mobile menu when clicking a link
    if (mobileMenu && e.target.closest('.mobile-menu a')) {
      navbar.classList.remove('menu-open');
      mobileMenu.classList.remove('open');
    }
  });

  /* ──────────────────────────────────────────────
     5. CLOSE ON ESCAPE KEY
     ────────────────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (userDropdown) userDropdown.classList.remove('open');
      if (mobileMenu) {
        navbar.classList.remove('menu-open');
        mobileMenu.classList.remove('open');
      }
    }
  });

  /* ──────────────────────────────────────────────
     HELPER: Create Mobile Menu
     ────────────────────────────────────────────── */
  function createMobileMenu() {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';

    menu.innerHTML = `
      <ul>
        <li><a href="index-logged-in.html">Home</a></li>
        <li><a href="order.html">Order</a></li>
        <li><a href="order-history.html">Order History</a></li>
        <li><a href="contact.html" class="active">Contact Us</a></li>
      </ul>
      <div class="mobile-auth">
        <a href="profile.html" class="btn-login">My Profile</a>
        <a href="index.html" class="btn-signup">Log Out</a>
      </div>
    `;

    return menu;
  }

  /* ──────────────────────────────────────────────
     6. NOTIFICATION BUTTON (demo interaction)
     ────────────────────────────────────────────── */
  const notificationBtn = document.querySelector('.btn-notification');

  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      // Demo: remove badge on click
      const badge = notificationBtn.querySelector('.notification-badge');
      if (badge) {
        badge.style.display = 'none';
      }
      // In a real app, this would open a notifications panel
      alert('Notifications panel coming soon!');
    });
  }

});
