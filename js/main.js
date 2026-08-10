/**
 * Phoenixi Studios - Main JavaScript
 * Handles smooth directional page transitions, Back to Top scroll navigation,
 * and PC / mobile viewport optimizations.
 */
document.addEventListener('DOMContentLoaded', function() {
  const viewport = document.querySelector('.viewport-frame');

  // Handle incoming entry animations based on directional navigation
  const navDir = sessionStorage.getItem('phoenixi_nav_dir');
  if (viewport && navDir) {
    if (navDir === 'up') {
      viewport.classList.add('page-enter-up');
    } else if (navDir === 'down') {
      viewport.classList.add('page-enter-down');
    }
    sessionStorage.removeItem('phoenixi_nav_dir');
  }

  // Current page detection
  const currentPath = window.location.pathname.toLowerCase();
  const isHomePage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');

  // Intercept navigation links for smooth directional page transitions
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || link.getAttribute('target') === '_blank') {
      return;
    }

    e.preventDefault();

    const targetLower = href.toLowerCase();
    const isTargetHome = targetLower.endsWith('index.html') || targetLower === '/' || targetLower === 'index.html';

    // Determine transition direction
    if (isHomePage && !isTargetHome) {
      // Navigating FROM Home to a subpage -> Upward slide & fade
      sessionStorage.setItem('phoenixi_nav_dir', 'up');
      if (viewport) {
        viewport.classList.add('page-exit-up');
      }
    } else if (!isHomePage && isTargetHome) {
      // Navigating BACK TO Home -> Downward swipe
      sessionStorage.setItem('phoenixi_nav_dir', 'down');
      if (viewport) {
        viewport.classList.add('page-exit-down');
      }
    } else {
      // Default transition
      sessionStorage.setItem('phoenixi_nav_dir', 'up');
      if (viewport) {
        viewport.classList.add('page-exit-up');
      }
    }

    // Trigger page navigation after transition timeout
    setTimeout(function() {
      window.location.href = href;
    }, 220);
  });

  // Back to Top Navigation Handler
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn && viewport) {
    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      viewport.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Toggle Back to Top button visibility on scroll
    function checkScrollPosition() {
      const scrollTop = viewport.scrollTop || window.scrollY || 0;
      if (scrollTop > 80) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    viewport.addEventListener('scroll', checkScrollPosition, { passive: true });
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    checkScrollPosition();
  }

  // Restore state when returning via browser history (bfcache)
  window.addEventListener('pageshow', function(e) {
    if (e.persisted && viewport) {
      viewport.classList.remove('page-exit-up', 'page-exit-down', 'page-enter-up', 'page-enter-down');
    }
  });
});
