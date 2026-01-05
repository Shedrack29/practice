// Combined DOMContentLoaded handler: feather.replace + nav accessibility/activation
document.addEventListener('DOMContentLoaded', function () {
  // Replace feather icons if library loaded
  if (window.feather) {
    try {
      feather.replace({ 'stroke-width': 1.5 });
    } catch (err) {
      // fail silently if feather isn't available
      console.error('feather.replace failed', err);
    }
  }

  // Nav item activation and keyboard accessibility
  const items = document.querySelectorAll('.sidebar-nav .nav-item');
  if (!items) return;

  items.forEach(item => {
    if (!item.hasAttribute('role')) item.setAttribute('role', 'button');
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
    item.setAttribute('aria-pressed', item.classList.contains('active') ? 'true' : 'false');

    const activate = () => {
      items.forEach(i => {
        i.classList.remove('active');
        i.setAttribute('aria-pressed', 'false');
      });
      item.classList.add('active');
      item.setAttribute('aria-pressed', 'true');
    };

    item.addEventListener('click', activate);

    item.addEventListener('keydown', (e) => {
      const key = e.key || e.keyCode;
      if (key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 13 || key === 32) {
        e.preventDefault();
        activate();
      }
    });
  });

  // Promo card: keyboard accessibility (Enter / Space triggers click)
  const promo = document.querySelector('.promo-card');
  if (promo) {
    if (!promo.hasAttribute('role')) promo.setAttribute('role', 'button');
    if (!promo.hasAttribute('tabindex')) promo.setAttribute('tabindex', '0');
    if (!promo.hasAttribute('aria-label')) promo.setAttribute('aria-label', 'Try the AI feature');

    promo.addEventListener('keydown', (e) => {
      const key = e.key || e.keyCode;
      if (key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 13 || key === 32) {
        e.preventDefault();
        // Trigger the same behavior as a click
        promo.click();
      }
    });
  }

  // Header image confetti effect (triggers once on hover)
  const headerImage = document.querySelector('.header-image');
  if (headerImage) {
    let confettiCanvas = null;
    let confettiCtx = null;
    let confettiParticles = [];
    let confettiAnimationId = null;
    let confettiTriggered = false;

    // Get the primary color from CSS variable
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6c63ff';

    function createConfettiCanvas() {
      confettiCanvas = document.createElement('canvas');
      confettiCanvas.style.position = 'fixed';
      confettiCanvas.style.top = '0';
      confettiCanvas.style.left = '0';
      confettiCanvas.style.pointerEvents = 'none';
      confettiCanvas.style.zIndex = '9999';
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
      document.body.appendChild(confettiCanvas);
      confettiCtx = confettiCanvas.getContext('2d');
    }

    function createConfettiParticle(x, y) {
      return {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * -15 - 5,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
        color: primaryColor
      };
    }

    function animateConfetti() {
      if (!confettiCanvas || !confettiCtx) return;

      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;

        if (p.opacity <= 0 || p.y > confettiCanvas.height) {
          confettiParticles.splice(i, 1);
          continue;
        }

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = p.opacity;
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        confettiCtx.restore();
      }

      if (confettiParticles.length > 0) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
      } else {
        if (confettiCanvas && confettiCanvas.parentNode) {
          confettiCanvas.parentNode.removeChild(confettiCanvas);
          confettiCanvas = null;
          confettiCtx = null;
        }
        confettiAnimationId = null;
      }
    }

    headerImage.addEventListener('mouseenter', function() {
      if (confettiTriggered) return; // Only trigger once
      confettiTriggered = true;

      createConfettiCanvas();

      // Create confetti particles spanning the whole page width
      const particleCount = 80;
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.3; // Start from top third of page
        confettiParticles.push(createConfettiParticle(x, y));
      }

      animateConfetti();
    });

    // Clean up on window resize
    window.addEventListener('resize', function() {
      if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
      }
    });
  }

  // Make progress blocks keyboard-operable: Enter/Space will activate the action button if present
  const progressBlocks = document.querySelectorAll('.progress-block');
  progressBlocks.forEach(pb => {
    // ensure ARIA attributes exist
    if (!pb.hasAttribute('role')) pb.setAttribute('role', 'button');
    if (!pb.hasAttribute('tabindex')) pb.setAttribute('tabindex', '0');
    if (!pb.hasAttribute('aria-pressed')) pb.setAttribute('aria-pressed', 'false');

    pb.addEventListener('keydown', (e) => {
      const key = e.key || e.keyCode;
      if (key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 13 || key === 32) {
        e.preventDefault();
        const action = pb.querySelector('.progress-action');
        if (action) action.click();
      }
    });
  });

  // Make dashboard panels keyboard-operable (if user hits Enter/Space, simulate click)
  const panels = document.querySelectorAll('.dashboard-panel[role="button"]');
  panels.forEach(p => {
    if (!p.hasAttribute('tabindex')) p.setAttribute('tabindex', '0');
    if (!p.hasAttribute('aria-pressed')) p.setAttribute('aria-pressed', 'false');
    p.addEventListener('keydown', (e) => {
      const key = e.key || e.keyCode;
      if (key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 13 || key === 32) {
        e.preventDefault();
        p.click();
      }
    });
  });
});
