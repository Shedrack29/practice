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
});
