// Lunaire — progressive enhancement + instant tab navigation. No framework.
(function () {
    'use strict';

    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
    }

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
            window.setTimeout(hide, 2800);
        }
    }

    function initDynamic() {
        normalizePrimaryNav();
        initRoomDetail();
        initContactForm();
        initContactContext();
        initEventForm();
        initBookingIfNeeded();
    }

    function initRoomDetail() {
        var title = document.getElementById('room-title');
        if (!title) return;
        var rooms = {
            classic: ['Lunaire Classic Room', '28 sqm', 'Up to 2 guests', 'King or twin beds', 'Garden or city view', 'PHP 6,500 per sample night', 'A refined and welcoming room for guests who value comfort, simplicity, and quiet elegance.', 'Lunaire-Classic-Room.png'],
            deluxe: ['Lunaire Deluxe Room', '34 sqm', 'Up to 2 guests', 'King bed', 'Garden or scenic view', 'PHP 7,500 per sample night', 'A spacious retreat with warm textures, restful surroundings, and room to unwind.', 'Lunaire-Deluxe-Room.png'],
            premier: ['Lunaire Premier Room', '40 sqm', 'Up to 2 guests', 'King bed', 'Scenic Tagaytay view', 'PHP 8,500 per sample night', 'A serene room for guests who want to slow down and settle into a more immersive stay.', 'Lunaire-Premier-Room-with-Taal-View_.png'],
            junior: ['Lunaire Junior Suite', '52 sqm', 'Up to 2–3 guests', 'King bed', 'Scenic view', 'PHP 10,500 per sample night', 'A graceful suite with additional living space for romantic escapes, longer stays, and celebrations.', 'Lunaire-Junior-Suite_.png'],
            executive: ['Lunaire Executive Suite', '68 sqm', 'Up to 2–3 guests', 'King bed', 'Panoramic view', 'PHP 13,500 per sample night', 'A sophisticated suite designed for rest, work, and a more immersive stay.', 'Executive-Suite_.png'],
            moonlight: ['Moonlight Suite', '90 sqm', 'Up to 2 guests', 'King bed', 'Panoramic Tagaytay view', 'PHP 17,500 per sample night', 'The signature suite concept with expansive space, panoramic scenery, and a private balcony concept.', 'Moonlight-Suite.png'],
            family: ['Family / Connecting Rooms', '56 sqm combined', 'Up to 4 guests', 'King bed plus twin beds', 'Flexible family layout', 'PHP 12,000 per sample night', 'A flexible accommodation concept for families or small groups who want comfort and personal space.', 'Family-Experience_.png']
        };
        var key = new URLSearchParams(window.location.search).get('room') || 'classic';
        var room = rooms[key] || rooms.classic;
        title.textContent = room[0];
        document.getElementById('room-intro').textContent = room[6];
        document.getElementById('room-size').textContent = room[1];
        document.getElementById('room-capacity').textContent = room[2];
        document.getElementById('room-bed').textContent = room[3];
        document.getElementById('room-view').textContent = room[4];
        document.getElementById('room-price').textContent = room[5];
        document.getElementById('room-description').textContent = room[6];
        var image = document.getElementById('room-image');
        image.src = room[7];
        image.alt = 'Conceptual ' + room[0];
    }

    function normalizePrimaryNav() {
        if (!nav) return;
        var current = window.location.pathname.split('/').pop() || 'index.html';
        var links = [
            ['index.html', 'Stay'],
            ['rooms.html', 'Rooms'],
            ['dining.html', 'Dine'],
            ['wellness-recreation.html', 'Relax'],
            ['entertainment-leisure.html', 'Entertainment & Leisure'],
            ['experiences.html', 'Experience'],
            ['events.html', 'Events'],
            ['offers.html', 'Offers'],
            ['about.html', 'About'],
            ['guest-services.html', 'Guest Services'],
            ['gallery.html', 'Gallery'],
            ['location.html', 'Location'],
            ['faq.html', 'FAQ'],
            ['policies.html', 'Policies'],
            ['contact.html', 'Contact']
        ];
        nav.innerHTML = '';
        links.forEach(function (item) {
            var link = document.createElement('a');
            link.href = item[0];
            link.textContent = item[1];
            if (item[0] === current) link.setAttribute('aria-current', 'page');
            nav.appendChild(link);
        });
        var book = document.createElement('a');
        book.className = 'btn btn-primary';
        book.href = 'booking.html';
        book.textContent = 'Book Your Stay';
        if (current === 'booking.html') book.setAttribute('aria-current', 'page');
        nav.appendChild(book);
    }

    function initContactContext() {
        var image = document.getElementById('contact-context-image');
        var caption = document.getElementById('contact-context-caption');
        if (!image) return;
        var context = new URLSearchParams(window.location.search).get('context');
        var details = {
            dining: {
                src: 'dining-hall.png',
                alt: 'Conceptual Lunaire dining room with warm evening lights',
                caption: 'A sample setting for thoughtful dining moments.'
            },
            'private-dining': {
                src: 'celeb.png',
                alt: 'Conceptual private dining celebration setup',
                caption: 'A sample setting for private dining and celebrations.'
            },
            spa: {
                src: 'spa.jpg',
                alt: 'Conceptual Lunaire Spa treatment room with warm candlelight',
                caption: 'A sample setting for restorative wellness treatments.'
            },
            fitness: {
                src: 'fitness.jpg',
                alt: 'Conceptual fitness center with modern equipment',
                caption: 'A sample setting for maintaining a wellness routine.'
            },
            stargazing: {
                src: 'Stargazing-Experience_.png',
                alt: 'Conceptual stargazing experience beneath a clear night sky',
                caption: 'A sample setting for a quiet stargazing experience.'
            },
            'garden-walk': {
                src: 'Quiet-Garden_.png',
                alt: 'Conceptual quiet garden path with soft evening light',
                caption: 'A sample setting for a slow garden walk.'
            },
            recreation: {
                src: 'recreation.png',
                alt: 'Conceptual recreation room with games and comfortable seating',
                caption: 'A sample setting for relaxed indoor recreation.'
            }
        }[context];
        if (!details) return;
        image.src = details.src;
        image.alt = details.alt;
        if (caption) caption.textContent = details.caption;
    }

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
                status.textContent = 'Thank you, ' + name + '. Your sample inquiry' + (date ? ' for ' + date : '') + ' was recorded locally. No real message or reservation was sent.';
            }
            form.reset();
        });
    }

    function initEventForm() {
        var form = document.getElementById('event-form');
        if (!form || form.dataset.lunaireBound) return;
        form.dataset.lunaireBound = 'true';
        var status = document.getElementById('event-status');
        var venue = document.getElementById('event-venue');
        var venueKey = new URLSearchParams(window.location.search).get('venue');
        var venueValues = { celeste: 'Celeste Function Room', 'moon-garden': 'Moon Garden', boardroom: 'Lune Boardroom' };
        if (venue && venueValues[venueKey]) venue.value = venueValues[venueKey];
        if (venue && venueValues[venueKey] && window.location.hash === '#event-form') {
            window.setTimeout(function () { form.scrollIntoView({ block: 'start' }); venue.focus({ preventScroll: true }); }, 0);
        }
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            var name = String(new FormData(form).get('name') || 'Guest');
            if (status) status.textContent = 'Thank you, ' + name + '. Your sample event inquiry was recorded locally. No real venue was contacted.';
            form.reset();
        });
    }

    function initBookingIfNeeded() {
        if (!document.querySelector('.step-panel')) return;
        if (typeof window.LunaireInitBooking === 'function') {
            window.LunaireInitBooking();
        } else if (!document.querySelector('script[src*="booking"]')) {
            var script = document.createElement('script');
            script.src = 'booking.js';
            document.body.appendChild(script);
        }
    }

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
        Array.prototype.forEach.call(links, function (link) {
            var url;
            try { url = new URL(link.href); } catch (err) { return; }
            if (url.origin !== window.location.origin) return;
            if (url.pathname === path) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
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
            var currentMain = document.getElementById('main');
            if (!nextMain || !currentMain) throw new Error('no main landmark');
            if (doc.title) document.title = doc.title;
            var nextDesc = doc.querySelector('meta[name="description"]');
            var currentDesc = document.querySelector('meta[name="description"]');
            if (nextDesc && currentDesc) currentDesc.setAttribute('content', nextDesc.getAttribute('content'));
            currentMain.innerHTML = nextMain.innerHTML;
            if (push) window.history.pushState({ p: path }, '', path + url.search + (hash || ''));
            markCurrentNav(path);
            if (nav) nav.classList.remove('open');
            initDynamic();
            currentMain.classList.remove('is-entering');
            void currentMain.offsetWidth;
            currentMain.classList.add('is-entering');
            var target = hash ? document.querySelector(hash) : null;
            if (target && target.scrollIntoView) target.scrollIntoView();
            else window.scrollTo(0, 0);
            var h1 = currentMain.querySelector('h1');
            if (h1) {
                if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
                h1.focus({ preventScroll: true });
            }
            announce('Page loaded: ' + document.title);
        }).catch(function () {
            window.location.href = url.href;
        });
    }

    function shouldHijack(link, event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
        if (link.target && link.target !== '_self') return false;
        if (link.hasAttribute('download')) return false;
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) return false;
        var url;
        try { url = new URL(link.href); } catch (err) { return false; }
        if (url.origin !== window.location.origin) return false;
        var path = url.pathname.toLowerCase();
        return path.charAt(path.length - 1) === '/' || path.slice(-5) === '.html';
    }

    document.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0) return;
        var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
        if (!link || !shouldHijack(link, event)) return;
        var url = new URL(link.href);
        var current = new URL(window.location.href);
        if (url.pathname === current.pathname) return;
        event.preventDefault();
        if (nav) nav.classList.remove('open');
        swapTo(url, true);
    });

    window.addEventListener('popstate', function () {
        swapTo(new URL(window.location.href), false);
    });

    initDynamic();
})();
