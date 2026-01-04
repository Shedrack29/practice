/* Simple loader controller: hides the #loader element after load.
	 - Adds a 'hidden' class (CSS transition handles fade)
	 - Removes the element after the transition so it won't block interaction
	 - Exposes `showLoader()` and `hideLoader()` for manual control
*/
(function () {
	function qs(id) { return document.getElementById(id); }
	var body = document.body || document.documentElement;

	// Mark the body as loading so CSS can hide page content (except the loader)
	if (body) body.classList.add('app-loading');

	var loader = function() { return qs('loader'); };

	function removeLoaderEl() {
		var el = loader();
		if (el && el.parentNode) el.parentNode.removeChild(el);
	}

	function hideLoader() {
		var l = loader();
		// Reveal page content first
		if (body) body.classList.remove('app-loading');
		if (!l) return;
		l.classList.add('hidden');
		setTimeout(removeLoaderEl, 420);
	}

	function showLoader() {
		if (body) body.classList.add('app-loading');
		var l = loader();
		if (!l) return;
		l.classList.remove('hidden');
	}

	function onLoaded() { setTimeout(hideLoader, 80); }

	if (document.readyState === 'complete') {
		onLoaded();
	} else {
		// Wait for full load (images/fonts/resources)
		window.addEventListener('load', onLoaded, { once: true });
		// Safety fallback: if load never fires, hide after 5s
		setTimeout(function () { if (loader()) hideLoader(); }, 5000);
	}

	// Expose control
	window.hideLoader = hideLoader;
	window.showLoader = showLoader;
})();

/* Minimal course-card hover progress controller
 	 - Reads percentage from `.course-value` text (e.g. "80%")
 	 - Ensures a `.fill-overlay > .fill-inner` exists behind the value
 	 - On hover/focus after a short delay, animates fill height to percentage and toggles `.active`
 	 - On leave/blur reverts the fill
*/
(function () {
	var DELAY = 300;
	function q(sel, ctx) { return (ctx || document).querySelector(sel); }
	function qa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

	function parsePercent(text) {
		if (!text) return 0;
		var n = parseInt(String(text).replace(/[^0-9\-]/g, ''), 10);
		return isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
	}

	function ensureFill(card) {
		var fill = q('.fill-overlay', card);
		if (!fill) {
			fill = document.createElement('div');
			fill.className = 'fill-overlay';
			var inner = document.createElement('div');
			inner.className = 'fill-inner';
			fill.appendChild(inner);
			// insert before the course-value so the number stays on top
			var val = q('.course-value', card);
			if (val && val.parentNode) card.insertBefore(fill, val);
			else card.appendChild(fill);
		}
		return q('.fill-inner', fill);
	}

	function setupCard(card) {
		if (!card) return;
		var valEl = q('.course-value', card);
		var raw = valEl ? valEl.textContent : '0%';
		var target = parsePercent(raw);
		var fillInner = ensureFill(card);
		fillInner.style.height = '0%';

		var timer = null;
		var active = false;

		function start() {
			if (active) return;
			card.classList.add('active');
			// animate vertical fill (height from bottom)
			requestAnimationFrame(function () { fillInner.style.height = target + '%'; });
			active = true;
		}

		function cancel() { if (timer) { clearTimeout(timer); timer = null; } }

		function stop() {
			card.classList.remove('active');
			fillInner.style.height = '0%';
			active = false;
		}

		card.addEventListener('mouseenter', function () {
			cancel(); timer = setTimeout(start, DELAY);
		});
		card.addEventListener('mouseleave', function () { cancel(); if (active) stop(); });
		card.addEventListener('focus', function () { cancel(); timer = setTimeout(start, DELAY); });
		card.addEventListener('blur', function () { cancel(); if (active) stop(); });

		// expose a small API on element if needed later
		card._courseProgress = { start: start, stop: stop };
	}

	// Initialize when DOM is ready (but not necessarily waiting for full load)
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else init();

	function init() {
		var cards = qa('.dashboard-course-cards .course-card');
		cards.forEach(setupCard);
	}
})();
