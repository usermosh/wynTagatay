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

    window.LUNAIRE_CONTENT = window.LUNAIRE_CONTENT || {
        rooms: {
            classic: {
                name: 'Lunaire Classic Room',
                category: 'Accessible Luxury',
                recommendedFor: 'Solo travelers and couples',
                size: '28 sqm',
                capacity: '2 guests',
                bed: '1 King Bed or 2 Twin Beds',
                view: 'Garden / City View',
                price: '₱6,500/night',
                description: 'A comfortable and elegant retreat for guests seeking the signature Lunaire atmosphere at an accessible price. Designed with warm lighting, refined furnishings, a rainfall shower, and everything needed for a peaceful stay.',
                amenities: ['King Bed or 2 Twin Beds', 'Smart TV', 'Work Desk', 'Air Conditioning', 'Mini Refrigerator', 'Coffee & Tea Station', 'In-Room Safe', 'Hair Dryer', 'Rainfall Shower', 'Basic Bath Amenities', 'Wardrobe & Luggage Space', 'High-Speed Wi-Fi'],
                includedServices: ['Daily Housekeeping', '24-Hour Guest Assistance', 'Complimentary Wi-Fi', 'Basic Welcome Amenities'],
                image: 'Lunaire-Classic-Room.png'
            },
            deluxe: {
                name: 'Lunaire Deluxe Room',
                category: 'Enhanced Luxury',
                recommendedFor: 'Couples and leisure travelers',
                size: '34 sqm',
                capacity: '2 guests',
                bed: 'King Bed',
                view: 'Garden / Scenic View',
                price: '₱7,500/night',
                description: 'A more spacious retreat offering enhanced comfort, a dedicated seating area, coffee machine, premium bathroom amenities, and an enhanced scenic view.',
                amenities: ['King Bed', 'Smart TV', 'Dedicated Seating Area', 'Work Desk', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'In-Room Safe', 'Rainfall Shower', 'Premium Bath Amenities', 'Hair Dryer', 'Enhanced Scenic View', 'High-Speed Wi-Fi'],
                includedServices: ['Daily Housekeeping', 'Turndown Service', 'Welcome Amenities', 'Complimentary Wi-Fi', '24-Hour Guest Assistance'],
                image: 'Lunaire-Deluxe-Room.png'
            },
            premier: {
                name: 'Lunaire Premier Room',
                category: 'Premium Luxury',
                recommendedFor: 'Couples, business travelers, and special occasions',
                size: '40 sqm',
                capacity: '2 guests',
                bed: 'King Bed',
                view: 'Scenic Tagaytay View',
                price: '₱8,500/night',
                description: 'A refined retreat with additional space, a dedicated work area, a freestanding bathtub, premium bathroom amenities, and a scenic Tagaytay view.',
                amenities: ['King Bed', 'Separate Sitting Area', 'Premium Work Area', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'In-Room Safe', 'Premium Bathroom', 'Freestanding Bathtub', 'Rainfall Shower', 'Premium Toiletries', 'Hair Dryer', 'Scenic Tagaytay View', 'High-Speed Wi-Fi'],
                includedServices: ['Daily Housekeeping', 'Turndown Service', 'Priority Guest Assistance', 'Welcome Refreshments', 'Complimentary Wi-Fi'],
                image: 'Lunaire-Premier-Room-with-Taal-View_.png'
            },
            junior: {
                name: 'Lunaire Junior Suite',
                category: 'Suite Collection',
                recommendedFor: 'Couples and longer stays',
                size: '52 sqm',
                capacity: '2–3 guests',
                bed: 'King Bed',
                view: 'Scenic Tagaytay View',
                price: '₱10,500/night',
                description: 'A spacious suite featuring a separate living area, sofa, dining space, premium bathroom, and scenic Tagaytay view for a more residential stay.',
                amenities: ['King Bed', 'Separate Living Area', 'Sofa', 'Dining/Seating Area', 'Smart TV', 'Premium Work Area', 'Mini Bar', 'Coffee Machine', 'In-Room Safe', 'Premium Bathroom', 'Freestanding Bathtub', 'Rainfall Shower', 'Premium Toiletries', 'Hair Dryer', 'Scenic Tagaytay View', 'High-Speed Wi-Fi'],
                includedServices: ['Daily Housekeeping', 'Turndown Service', 'Welcome Amenities', 'Welcome Refreshments', 'Priority Guest Assistance', 'Complimentary Wi-Fi'],
                image: 'Lunaire-Junior-Suite_.png'
            },
            executive: {
                name: 'Lunaire Executive Suite',
                category: 'Executive Collection',
                recommendedFor: 'VIPs, business travelers, and celebrations',
                size: '68 sqm',
                capacity: '2–3 guests',
                bed: 'King Bed',
                view: 'Panoramic Scenic View',
                price: '₱13,500/night',
                description: 'A spacious private retreat with a separate bedroom, living room, dining area, walk-in closet, panoramic view, and personalized service.',
                amenities: ['Separate Bedroom', 'Spacious Living Room', 'Dining Area', 'Dedicated Work Area', 'King Bed', 'Large Smart TV', 'Premium Bathroom', 'Freestanding Bathtub', 'Rainfall Shower', 'Walk-In Closet', 'Mini Bar', 'Coffee Machine', 'In-Room Safe', 'Premium Toiletries', 'Panoramic Scenic View', 'High-Speed Wi-Fi'],
                includedServices: ['Priority Concierge Assistance', 'Daily Housekeeping', 'Turndown Service', 'Personalized Welcome Amenities', 'Complimentary Evening Refreshments', 'Priority Restaurant/Event Reservations', 'Complimentary Wi-Fi'],
                image: 'Executive-Suite_.png'
            },
            moonlight: {
                name: 'Moonlight Suite',
                category: 'Lunaire Signature Collection',
                recommendedFor: 'Honeymoons, anniversaries, proposals, VIP guests, and milestone celebrations',
                size: '90 sqm',
                capacity: '2 guests',
                bed: 'King Bed',
                view: 'Panoramic Tagaytay View',
                price: '₱17,500/night',
                description: 'Our signature accommodation with expansive living spaces, a private balcony, panoramic Tagaytay view, private dining area, refined finishes, and intimate nighttime ambiance.',
                amenities: ['King Bed', 'Large Separate Living Room', 'Private Balcony', 'Panoramic Tagaytay View', 'Private Dining Area', 'Freestanding Bathtub', 'Premium Bathroom', 'Walk-In Closet', 'Premium Lounge Seating', 'Large Smart TV', 'Mini Bar', 'Coffee Machine', 'In-Room Safe', 'Premium Toiletries', 'Luxury Bathrobes & Slippers', 'Personalized Welcome Setup', 'High-Speed Wi-Fi'],
                includedServices: ['Dedicated Concierge Assistance', 'Priority Check-In & Check-Out', 'Daily Housekeeping', 'Turndown Service', 'Personalized Welcome Amenities', 'Evening Refreshments', 'Priority Dining & Event Reservations', 'Private Dining Arrangement Upon Request', 'Complimentary Moonlight Experience', 'Complimentary Wi-Fi'],
                image: 'Moonlight-Suite.png'
            },
            family: {
                name: 'Family / Connecting Rooms',
                category: 'Comfort for Togetherness',
                recommendedFor: 'Families and small groups',
                size: '56 sqm combined',
                capacity: 'Up to 4 guests',
                bed: '1 King Bed + 2 Twin Beds',
                view: 'Garden / Scenic View',
                price: '₱12,000/night',
                description: 'Flexible accommodation with two connecting rooms, one king bed, two twin beds, two private bathrooms, and garden or scenic views.',
                amenities: ['Two Connecting Rooms', '1 King Bed + 2 Twin Beds', 'Two Private Bathrooms', 'Two Smart TVs', 'Two Wardrobes', 'Mini Refrigerator', 'Coffee & Tea Station', 'In-Room Safe', 'Hair Dryers', 'Premium Bath Amenities', 'Garden / Scenic View', 'High-Speed Wi-Fi'],
                includedServices: ['Daily Housekeeping', 'Complimentary Wi-Fi', 'Family Welcome Amenities', '24-Hour Guest Assistance', 'Additional Bed/Baby Cot Upon Request'],
                image: 'Family-Experience_.png'
            }
        }
    };

    function initDynamic() {
        normalizePrimaryNav();
        normalizeFooter();
        initCardExpanders();
        initRoomDetail();
        initContactForm();
        initContactContext();
        initEventForm();
        initBookingIfNeeded();
    }

    function initCardExpanders() {
        document.querySelectorAll('a').forEach(function (link) {
            if (link.textContent.trim().toUpperCase() !== 'SEE MORE') return;
            var parent = link.parentElement;
            if (parent && parent.tagName === 'P' && parent.children.length === 1) parent.remove();
            else link.remove();
        });

        var fallbackActions = {
            'Moonlight Lounge': ['RESERVE A TABLE', 'contact.html?context=dining'],
            'Romantic Getaway': ['BOOK PACKAGE', 'offers.html#romantic']
        };
        document.querySelectorAll('#main article.media-card').forEach(function (card) {
            if (card.querySelector('a.btn')) return;
            var heading = card.querySelector('h2, h3');
            var action = heading && fallbackActions[heading.textContent.trim()];
            if (!action) return;
            var wrapper = document.createElement('p');
            wrapper.className = 'card-action';
            var link = document.createElement('a');
            link.className = 'btn btn-primary';
            link.href = action[1];
            link.textContent = action[0];
            wrapper.appendChild(link);
            card.querySelector('.body').appendChild(wrapper);
        });
    }

    function initRoomDetail() {
        var title = document.getElementById('room-title');
        if (!title) return;
        var rooms = window.LUNAIRE_CONTENT.rooms;
        var key = new URLSearchParams(window.location.search).get('room') || 'classic';
        var room = rooms[key] || rooms.classic;
        title.textContent = room.name;
        document.getElementById('room-intro').textContent = room.description;
        document.getElementById('room-size').textContent = room.size;
        document.getElementById('room-capacity').textContent = room.capacity;
        document.getElementById('room-bed').textContent = room.bed;
        document.getElementById('room-view').textContent = room.view;
        document.getElementById('room-price').textContent = room.price;
        var category = document.getElementById('room-category');
        var recommended = document.getElementById('room-recommended');
        var featureLabel = document.getElementById('room-feature-label');
        var serviceLabel = document.getElementById('room-service-label');
        if (category) category.textContent = room.category || 'Lunaire Collection';
        if (recommended) recommended.textContent = room.recommendedFor || 'Guests seeking a restorative escape';
        if (featureLabel) featureLabel.textContent = ({ junior: 'Suite Features', executive: 'Suite Features', moonlight: 'Signature Suite Features', family: 'Room Features' }[key] || 'In-Room Features');
        if (serviceLabel) serviceLabel.textContent = key === 'moonlight' ? 'Signature Privileges' : 'Included Services';
        renderRoomList('room-amenities', room.amenities);
        renderRoomList('room-services', room.includedServices);
        var image = document.getElementById('room-image');
        image.src = room.image;
        image.alt = room.name;
    }

    function renderRoomList(id, items) {
        var list = document.getElementById(id);
        if (!list || !items) return;
        list.innerHTML = '';
        items.forEach(function (item) {
            var entry = document.createElement('li');
            entry.textContent = item;
            list.appendChild(entry);
        });
    }

    function normalizePrimaryNav() {
        if (!nav) return;
        var current = window.location.pathname.split('/').pop() || 'index.html';
        var links = [
            ['index.html', 'Home'],
            ['rooms.html', 'Stay'],
            ['dining.html', 'Dine'],
            ['wellness-recreation.html', 'Relax'],
            ['experiences.html', 'Experience'],
            ['events.html', 'Events'],
            ['offers.html', 'Offers'],
            ['gallery.html', 'Gallery'],
            ['guest-services.html', 'Guest Services']
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
        book.textContent = 'Book Now';
        if (current === 'booking.html') book.setAttribute('aria-current', 'page');
        nav.appendChild(book);
    }

    function normalizeFooter() {
        var footer = document.querySelector('footer');
        if (!footer) return;
        footer.innerHTML = '<div class="wrap"><div class="foot-grid"><div><a class="brand" href="index.html" style="margin-bottom:1rem" aria-label="Lunaire home"><img class="brand-logo" src="logo.png" alt="Lunaire" width="78" height="48" /></a><p style="color:var(--text-secondary);max-width:38ch">An elite sanctuary where quiet elegance and personal reflection meet.</p></div><nav aria-label="Explore"><h4>Explore</h4><a href="rooms.html">Rooms</a><a href="dining.html">Dining</a><a href="wellness-recreation.html">Wellness &amp; Recreation</a><a href="entertainment-leisure.html">Entertainment &amp; Leisure</a></nav><nav aria-label="Hotel"><h4>Hotel</h4><a href="about.html">Our story</a><a href="about.html#values">Core values</a><a href="contact.html">Contact</a></nav><div><h4>Discover</h4><a href="experiences.html">Experiences</a><a href="offers.html">Offers</a><a href="events.html">Events</a><a href="gallery.html">Gallery</a><a href="guest-services.html">Guest services</a><a href="faq.html">FAQ</a><a href="policies.html">Policies</a><a href="cancellation-policy.html">Cancellation</a><a href="privacy-policy.html">Privacy</a><a href="terms.html">Terms</a><a href="accessibility.html">Accessibility</a><a href="cookie-notice.html">Cookie notice</a></div></div><div class="foot-base"><span>© 2026 Lunaire Boutique Hotel Resort. All rights reserved.</span><span>Where memories shine under the moonlight.</span></div></div>';
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
