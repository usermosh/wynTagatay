// Lunaire — progressive enhancement + instant tab navigation. No framework.
(function () {
    'use strict';

    // Chrome binds once per real page load (header/footer persist across instant nav).
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
    }

    // Loading screen: real page loads only. Instant tab swaps never trigger it.
    // SmoothUI rules translated to vanilla: short fade, instant when reduced motion.
    var loader = document.getElementById('site-loader');
    if (loader) {
        document.body.classList.add('is-loading');
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var hidden = false;
        var hide = function () {
            if (hidden) return;
            hidden = true;
            loader.classList.add('is-done');
            document.body.classList.remove('is-loading');
            window.setTimeout(function () { loader.remove(); }, reduceMotion ? 0 : 400);
        };
        if (document.readyState === 'complete') {
            window.setTimeout(hide, reduceMotion ? 0 : 500);
        } else {
            window.addEventListener('load', function () {
                window.setTimeout(hide, reduceMotion ? 0 : 500);
            });
            window.setTimeout(hide, 2800); // safety: never trap the page
        }
    }

    // Per-page enhancements. Re-runs after every instant nav swap.
    function initDynamic() {
        initContactForm();
        initBookingIfNeeded();
    }

    // Booking form: client-side validation + status live region
    function initContactForm() {
        var form = document.getElementById('booking-form');
        if (!form || form.dataset.lunaireBound) return;
        form.dataset.lunaireBound = 'true';
        var status = document.getElementById('booking-status');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            var data = new FormData(form);
            var name = String(data.get('name') || 'Guest');
            var date = String(data.get('checkin') || '');
            if (status) {
                status.textContent = 'Thank you, ' + name + '. Your request' + (date ? ' for ' + date : '') + ' was received. Our moon concierge will confirm within 24 hours.';
            }
            form.reset();
        });
    }

    // Booking flow lives in booking.js, loaded on demand the first visit.
    // A static tag (direct booking.html load) self-initializes, so never double-load.
    function initBookingIfNeeded() {
        if (!document.querySelector('.step-panel')) return;
        if (typeof window.LunaireInitBooking === 'function') {
            window.LunaireInitBooking();
        } else if (!document.querySelector('script[src*="booking"]')) {
            var s = document.createElement('script');
            s.src = 'assets/js/booking.js';
            document.body.appendChild(s); // self-initializes when loaded
        }
    }

    // Screen-reader announcement for instant page changes.
    var routeStatus = null;
    function announce(message) {
        if (!routeStatus) {
            routeStatus = document.createElement('p');
            routeStatus.id = 'route-status';
            routeStatus.className = 'sr-only';
            routeStatus.setAttribute('role', 'status');
            document.body.appendChild(routeStatus);
        }
        routeStatus.textContent = '';
        window.setTimeout(function () { routeStatus.textContent = message; }, 30);
    }

    function markCurrentNav(path) {
        var links = document.querySelectorAll('#site-nav a');
        Array.prototype.forEach.call(links, function (l) {
            var u;
            try { u = new URL(l.href); } catch (err) { return; }
            if (u.origin !== window.location.origin) return;
            if (u.pathname === path) l.setAttribute('aria-current', 'page');
            else l.removeAttribute('aria-current');
        });
    }

    function swapTo(url, push) {
        var path = url.pathname;
        var hash = url.hash;
        fetch(path + url.search, { credentials: 'same-origin' }).then(function (res) {
            if (!res.ok) throw new Error('bad status ' + res.status);
            return res.text();
        }).then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var nextMain = doc.getElementById('main');
            var curMain = document.getElementById('main');
            if (!nextMain || !curMain) throw new Error('no main landmark');
            if (doc.title) document.title = doc.title;
            var nextDesc = doc.querySelector('meta[name="description"]');
            var curDesc = document.querySelector('meta[name="description"]');
            if (nextDesc && curDesc) curDesc.setAttribute('content', nextDesc.getAttribute('content'));
            curMain.innerHTML = nextMain.innerHTML;
            if (push) {
                try { window.history.pushState({ p: path }, '', path + (hash || '')); }
                catch (err) { window.location.href = url.href; return; }
            }
            markCurrentNav(path);
            if (nav) nav.classList.remove('open');
            initDynamic();
            var main = document.getElementById('main');
            main.classList.remove('is-entering');
            void main.offsetWidth; // restart the enter animation
            main.classList.add('is-entering');
            var target = hash ? document.querySelector(hash) : null;
            if (target && target.scrollIntoView) target.scrollIntoView();
            else window.scrollTo(0, 0);
            var h1 = main.querySelector('h1');
            if (h1) {
                if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
                h1.focus({ preventScroll: true });
            }
            announce('Page loaded: ' + document.title);
        }).catch(function () {
            window.location.href = url.href; // file://, offline, or odd page: normal navigation
        });
    }

    function shouldHijack(a, e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
        if (a.target && a.target// Lunaire — progressive enhancement + instant tab navigation. No framework.
            (function () {
                'use strict';

                // Chrome binds once per real page load (header/footer persist across instant nav).
                var toggle = document.querySelector('.nav-toggle');
                var nav = document.getElementById('site-nav');
                if (toggle && nav) {
                    toggle.addEventListener('click', function () {
                        var open = nav.classList.toggle('open');
                        toggle.setAttribute('aria-expanded', String(open));
                        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
                    });
                }

                // Loading screen: real page loads only. Instant tab swaps never trigger it.
                // SmoothUI rules translated to vanilla: short fade, instant when reduced motion.
                var loader = document.getElementById('site-loader');
                if (loader) {
                    document.body.classList.add('is-loading');
                    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    var hidden = false;
                    var hide = function () {
                        if (hidden) return;
                        hidden = true;
                        loader.classList.add('is-done');
                        document.body.classList.remove('is-loading');
                        window.setTimeout(function () { loader.remove(); }, reduceMotion ? 0 : 400);
                    };
                    if (document.readyState === 'complete') {
                        window.setTimeout(hide, reduceMotion ? 0 : 500);
                    } else {
                        window.addEventListener('load', function () {
                            window.setTimeout(hide, reduceMotion ? 0 : 500);
                        });
                        window.setTimeout(hide, 2800); // safety: never trap the page
                    }
                }

                // Per-page enhancements. Re-runs after every instant nav swap.
                function initDynamic() {
                    initContactForm();
                    initBookingIfNeeded();
                }

                // Booking form: client-side validation + status live region
                function initContactForm() {
                    var form = document.getElementById('booking-form');
                    if (!form || form.dataset.lunaireBound) return;
                    form.dataset.lunaireBound = 'true';
                    var status = document.getElementById('booking-status');
                    form.addEventListener('submit', function (e) {
                        e.preventDefault();
                        if (!form.checkValidity()) {
                            form.reportValidity();
                            return;
                        }
                        var data = new FormData(form);
                        var name = String(data.get('name') || 'Guest');
                        var date = String(data.get('checkin') || '');
                        if (status) {
                            status.textContent = 'Thank you, ' + name + '. Your request' + (date ? ' for ' + date : '') + ' was received. Our moon concierge will confirm within 24 hours.';
                        }
                        form.reset();
                    });
                }

                // Booking flow lives in booking.js, loaded on demand the first visit.
                // A static tag (direct booking.html load) self-initializes, so never double-load.
                function initBookingIfNeeded() {
                    if (!document.querySelector('.step-panel')) return;
                    if (typeof window.LunaireInitBooking === 'function') {
                        window.LunaireInitBooking();
                    } else if (!document.querySelector('script[src*="booking"]')) {
                        var s = document.createElement('script');
                        s.src = 'assets/js/booking.js';
                        document.body.appendChild(s); // self-initializes when loaded
                    }
                }

                // Screen-reader announcement for instant page changes.
                var routeStatus = null;
                function announce(message) {
                    if (!routeStatus) {
                        routeStatus = document.createElement('p');
                        routeStatus.id = 'route-status';
                        routeStatus.className = 'sr-only';
                        routeStatus.setAttribute('role', 'status');
                        document.body.appendChild(routeStatus);
                    }
                    routeStatus.textContent = '';
                    window.setTimeout(function () { routeStatus.textContent = message; }, 30);
                }

                function markCurrentNav(path) {
                    var links = document.querySelectorAll('#site-nav a');
                    Array.prototype.forEach.call(links, function (l) {
                        var u;
                        try { u = new URL(l.href); } catch (err) { return; }
                        if (u.origin !== window.location.origin) return;
                        if (u.pathname === path) l.setAttribute('aria-current', 'page');
                        else l.removeAttribute('aria-current');
                    });
                }

                function swapTo(url, push) {
                    var path = url.pathname;
                    var hash = url.hash;
                    fetch(path + url.search, { credentials: 'same-origin' }).then(function (res) {
                        if (!res.ok) throw new Error('bad status ' + res.status);
                        return res.text();
                    }).then(function (html) {
                        var doc = new DOMParser().parseFromString(html, 'text/html');
                        var nextMain = doc.getElementById('main');
                        var curMain = document.getElementById('main');
                        if (!nextMain || !curMain) throw new Error('no main landmark');
                        if (doc.title) document.title = doc.title;
                        var nextDesc = doc.querySelector('meta[name="description"]');
                        var curDesc = document.querySelector('meta[name="description"]');
                        if (nextDesc && curDesc) curDesc.setAttribute('content', nextDesc.getAttribute('content'));
                        curMain.innerHTML = nextMain.innerHTML;
                        if (push) {
                            try { window.history.pushState({ p: path }, '', path + (hash || '')); }
                            catch (err) { window.location.href = url.href; return; }
                        }
                        markCurrentNav(path);
                        if (nav) nav.classList.remove('open');
                        initDynamic();
                        var main = document.getElementById('main');
                        main.classList.remove('is-entering');
                        void main.offsetWidth; // restart the enter animation
                        main.classList.add('is-entering');
                        var target = hash ? document.querySelector(hash) : null;
                        if (target && target.scrollIntoView) target.scrollIntoView();
                        else window.scrollTo(0, 0);
                        var h1 = main.querySelector('h1');
                        if (h1) {
                            if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
                            h1.focus({ preventScroll: true });
                        }
                        announce('Page loaded: ' + document.title);
                    }).catch(function () {
                        window.location.href = url.href; // file://, offline, or odd page: normal navigation
                    });
                }

                function shouldHijack(a, e) {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
                    if (a.target && a.target !== '_self') return false;
                    if (a.hasAttribute('download')) return false;
                    var href = a.getAttribute('href');
                    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) return false;
                    var url;
                    try { url = new URL(a.href); } catch (err) { return false; }
                    if (url.origin !== window.location.origin) return false;
                    var p = url.pathname.toLowerCase();
                    if (p.charAt(p.length - 1) !== '/' && p.slice(-5) !== '.html') return false;
                    return true;
                }

                document.addEventListener('click', function (e) {
                    if (e.defaultPrevented || e.button !== 0) return;
                    var el = e.target && e.target.closest ? e.target.closest('a[href]') : null;
                    if (!el || !shouldHijack(el, e)) return;
                    var url = new URL(el.href);
                    var cur = new URL(window.location.href);
                    if (url.pathname === cur.pathname) return; // same-page anchors scroll natively
                    e.preventDefault();
                    if (nav) nav.classList.remove('open');
                    swapTo(url, true);
                });

                window.addEventListener('popstate', function () {
                    swapTo(new URL(window.location.href), false);
                });

                initDynamic();
            })()
 !== '_self') return false;
        if (a.hasAttribute('download')) return false;
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) return false;
        var url;
        try { url = new URL(a.href); } catch (err) { return false; }
        if (url.origin !== window.location.origin) return false;
        var p = url.pathname.toLowerCase();
        if (p.charAt(p.length - 1) !== '/' && p.slice(-5) !== '.html') return false;
        return true;
    }

    document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0) return;
        var el = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!el || !shouldHijack(el, e)) return;
        var url = new URL(el.href);
        var cur = new URL(window.location.href);
        if (url.pathname === cur.pathname) return; // same-page anchors scroll natively
        e.preventDefault();
        if (nav) nav.classList.remove('open');
        swapTo(url, true);
    });

    window.addEventListener('popstate', function () {
        swapTo(new URL(window.location.href), false);
    });

    initDynamic();
})();
