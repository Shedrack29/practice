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
