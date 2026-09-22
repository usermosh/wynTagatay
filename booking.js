// Lunaire booking flow — vanilla JS. SmoothUI rules: quick state changes,
// transform/opacity-only animation (CSS), focus moves to each step heading.
(function () {
  var TAX = 0.1895;
  var RATES = {
    classic: { name: 'Lunaire Classic Room', capacity: 2, img: 'Lunaire-Classic-Room.png', blurb: '28 sqm, king or twin beds, garden or city view. Sleeps 2.', rates: ratesFor(6500) },
    deluxe: { name: 'Lunaire Deluxe Room', capacity: 2, img: 'Lunaire-Deluxe-Room.png', blurb: '34 sqm, king bed, garden or scenic view. Sleeps 2.', rates: ratesFor(7500) },
    premier: { name: 'Lunaire Premier Room', capacity: 2, img: 'Lunaire-Premier-Room-with-Taal-View_.png', blurb: '40 sqm, king bed, scenic Tagaytay view. Sleeps 2.', rates: ratesFor(8500) },
    junior: { name: 'Lunaire Junior Suite', capacity: 3, img: 'Lunaire-Junior-Suite_.png', blurb: '52 sqm, king bed, scenic view. Sleeps 2–3.', rates: ratesFor(10500) },
    executive: { name: 'Lunaire Executive Suite', capacity: 3, img: 'Executive-Suite_.png', blurb: '68 sqm, king bed, panoramic view. Sleeps 2–3.', rates: ratesFor(13500) },
    moonlight: { name: 'Moonlight Suite', capacity: 2, img: 'Moonlight-Suite.png', blurb: '90 sqm, king bed, panoramic view, private balcony concept. Sleeps 2.', rates: ratesFor(17500) },
    family: { name: 'Family / Connecting Rooms', capacity: 4, img: 'Family-Experience_.png', blurb: '56 sqm combined, king and twin beds. Sleeps 4.', rates: ratesFor(12000) }
  };

  function ratesFor(price) {
    return [
      { id: 'flexible', name: 'Flexible Stay Rate', price: price, note: 'Conceptual flexible rate; changes remain subject to confirmation.' },
      { id: 'offer', name: 'Special Offer Rate', price: Math.round(price * 0.92), note: 'Conceptual promotional rate with sample benefits.' }
    ];
  }

  var state = { checkin: null, checkout: null, code: '', room: null, rate: null, adults: 2, children: 0, rooms: 1, packagePrice: 0, packageName: 'No package', addons: [], step: 1 };
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var base = { y: 2026, m: 8 }; // September 2026
  var today = new Date(2026, 8, 20);

  function $(id) { return document.getElementById(id); }
  function fmtDate(d) { return MONTHS[d.getMonth()].slice(0,3) + ' ' + d.getDate() + ', ' + d.getFullYear(); }
  function fmtPHP(n) { return 'PHP ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function packageDetails() {
    var select = $('g-package');
    var option = select && select.options[select.selectedIndex];
    return { name: option ? option.textContent : 'No package', price: option ? Number(option.dataset.price || 0) : 0 };
  }
  function applyBookingContext() {
    var params = new URLSearchParams(window.location.search);
    var packageSelect = $('g-package');
    var packageKey = params.get('package');
    if (packageSelect && packageKey) {
      var option = Array.prototype.find.call(packageSelect.options, function (item) { return item.value === packageKey; });
      if (option) packageSelect.value = packageKey;
    }
    var addonKey = params.get('addon');
    if (addonKey) {
      var addon = document.querySelector('input[name="addons"][value="' + addonKey + '"]');
      if (addon) addon.checked = true;
    }
  }
  function addonDetails() {
    return Array.prototype.slice.call(document.querySelectorAll('input[name="addons"]:checked')).map(function (input) {
      return { name: input.parentElement.textContent.trim(), price: Number(input.dataset.price || 0) };
    });
  }
  function enhancementTotal() {
    var pack = packageDetails();
    return pack.price + addonDetails().reduce(function (sum, addon) { return sum + addon.price; }, 0);
  }
  function nights() {
    if (!state.checkin || !state.checkout) return 0;
    return Math.round((state.checkout - state.checkin) / 86400000);
  }

  // --- Calendar ---
  function renderCal() {
    var grid = $('cal-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (var k = 0; k < 2; k++) {
      var y = base.y, m = base.m + k;
      while (m > 11) { m -= 12; y++; }
      grid.appendChild(monthTable(y, m));
    }
  }
  function monthTable(y, m) {
    var box = document.createElement('div');
    box.className = 'cal';
    var table = document.createElement('table');
    var cap = document.createElement('caption');
    cap.textContent = MONTHS[m] + ' ' + y;
    table.appendChild(cap);
    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    ['SUN','MON','TUE','WED','THU','FRI','SAT'].forEach(function (d) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = d;
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);
    var body = document.createElement('tbody');
    var first = new Date(y, m, 1).getDay();
    var days = new Date(y, m + 1, 0).getDate();
    var day = 1;
    for (var r = 0; r < 6 && day <= days; r++) {
      var tr = document.createElement('tr');
      for (var c = 0; c < 7; c++) {
        var td = document.createElement('td');
        if ((r === 0 && c < first) || day > days) {
          td.innerHTML = '<span aria-hidden="true"></span>';
        } else {
          (function (dd) {
            var date = new Date(y, m, dd);
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = String(dd);
            var key = y + '-' + m + '-' + dd;
            b.dataset.key = key;
            if (date < today) {
              b.disabled = true;
              b.setAttribute('aria-label', fmtDate(date) + ' (past)');
            } else {
              b.setAttribute('aria-label', fmtDate(date));
              b.addEventListener('click', function () { pick(date); });
            }
            if (state.checkin && sameDay(date, state.checkin)) { b.classList.add('is-checkin'); }
            if (state.checkout && sameDay(date, state.checkout)) { b.classList.add('is-checkout'); }
            if (state.checkin && state.checkout && date > state.checkin && date < state.checkout) { b.classList.add('is-stay'); }
            td.appendChild(b);
          })(day);
          day++;
        }
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }
    table.appendChild(body);
    box.appendChild(table);
    return box;
  }
  function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function pick(date) {
    if (!state.checkin || (state.checkin && state.checkout)) {
      state.checkin = date;
      state.checkout = null;
    } else if (date > state.checkin) {
      state.checkout = date;
    } else {
      state.checkin = date;
    }
    syncDates();
  }
  function syncDates() {
    var ci = $('f-checkin'), co = $('f-checkout'), n = $('night-count');
    var calSummary = $('calendar-summary');
    if (ci) ci.value = state.checkin ? fmtDate(state.checkin) : '';
    if (co) co.value = state.checkout ? fmtDate(state.checkout) : '';
    if (n) {
      var k = nights();
      n.textContent = k ? k + ' night' + (k > 1 ? 's' : '') : 'Select dates below';
    }
    if (calSummary) {
      calSummary.textContent = state.checkin && state.checkout
        ? fmtDate(state.checkin) + ' – ' + fmtDate(state.checkout)
        : 'Select dates';
    }
    renderCal();
    renderSummary();
  }

  // --- Steps ---
  var steps = [];
  function goStep(n) {
    state.step = n;
    steps.forEach(function (panel) {
      var num = Number(panel.dataset.step);
      var active = num === n;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
      if (active) {
        var h = panel.querySelector('h2');
        if (h) h.focus({ preventScroll: true });
        panel.scrollIntoView({ block: 'nearest' });
      }
    });
    var items = document.querySelectorAll('.stepper li');
    items.forEach(function (li, i) {
      var num = i + 1;
      if (num === n) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
      li.classList.toggle('is-done', num < n);
      var dot = li.querySelector('.step-dot');
      if (dot) dot.textContent = num < n ? '✓' : String(num);
    });
    var summary = document.querySelector('.summary');
    if (summary) summary.classList.toggle('is-hidden', n === 1);
  }
  function need(step) {
    var s = $('step-status-' + step);
    return function (msg) { if (s) s.textContent = msg; };
  }

  // --- Rooms and rates ---
  function renderRates() {
    var list = $('rate-list'), head = $('rate-detail');
    if (!list || !head) return;
    var room = RATES[state.room];
    if (!room) { head.hidden = true; return; }
    head.hidden = false;
    $('rate-img').src = room.img;
    $('rate-img').alt = room.name + ' interior at night';
    $('rate-name').textContent = room.name;
    $('rate-blurb').textContent = room.blurb;
    list.innerHTML = '';
    room.rates.forEach(function (r) {
      var card = document.createElement('div');
      card.className = 'rate';
      var info = document.createElement('div');
      var h = document.createElement('h4');
      h.textContent = r.name;
      var p = document.createElement('div');
      p.className = 'rate-price';
      p.textContent = fmtPHP(r.price) + ' / night';
      var note = document.createElement('small');
      note.textContent = r.note;
      info.appendChild(h);
      info.appendChild(p);
      info.appendChild(note);
      var side = document.createElement('div');
      side.className = 'rate-side';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary';
      btn.style.minHeight = '44px';
      btn.textContent = '+ Book this room';
      btn.addEventListener('click', function () {
        state.rate = r.id;
        renderSummary();
        goStep(3);
      });
      side.appendChild(btn);
      card.appendChild(info);
      card.appendChild(side);
      list.appendChild(card);
    });
  }
  function currentRate() {
    if (!state.room || !state.rate) return null;
    var found = null;
    RATES[state.room].rates.forEach(function (r) { if (r.id === state.rate) found = r; });
    return found;
  }

  // --- Summary ---
  function renderSummary() {
    var dates = $('sum-dates'), code = $('sum-code'), lines = $('sum-lines');
    var total = $('sum-total'), cont = $('sum-continue');
    if (!dates) return;
    dates.textContent = state.checkin
      ? fmtDate(state.checkin) + (state.checkout ? ' - ' + fmtDate(state.checkout) : ' - select check-out')
      : 'Select dates';
    code.textContent = state.code ? state.code : '(No input)';
    lines.innerHTML = '';
    var rate = currentRate();
    if (rate) {
      var room = RATES[state.room];
      var k = nights() || 0;
      var roomSub = rate.price * Math.max(k, 1) * state.rooms;
      var enhancementSub = enhancementTotal();
      var sub = roomSub + enhancementSub;
      var wrap = document.createElement('div');
      wrap.className = 'line';
      var left = document.createElement('div');
      var b = document.createElement('b');
      b.textContent = room.name;
      var d1 = document.createElement('div');
      d1.textContent = rate.name;
      var d2 = document.createElement('div');
      d2.textContent = state.adults + ' adult' + (state.adults > 1 ? 's' : '') + ', ' + state.children + ' children · ' + state.rooms + ' room' + (state.rooms > 1 ? 's' : '') + ' · ' + fmtPHP(rate.price) + ' x ' + Math.max(k, 1) + ' night' + (Math.max(k, 1) > 1 ? 's' : '');
      left.appendChild(b);
      left.appendChild(d1);
      left.appendChild(d2);
      var right = document.createElement('div');
      right.style.textAlign = 'right';
      var amt = document.createElement('div');
      amt.textContent = fmtPHP(sub);
      var rm = document.createElement('button');
      rm.type = 'button';
      rm.setAttribute('aria-label', 'Remove ' + room.name);
      rm.textContent = '✕';
      rm.addEventListener('click', function () {
        state.room = null;
        state.rate = null;
        document.querySelectorAll('.room-pick').forEach(function (el) {
          el.classList.remove('is-selected');
          el.setAttribute('aria-pressed', 'false');
        });
        renderRates();
        renderSummary();
      });
      right.appendChild(amt);
      right.appendChild(rm);
      wrap.appendChild(left);
      wrap.appendChild(right);
      lines.appendChild(wrap);
      var pack = packageDetails();
      if (pack.price || addonDetails().length) {
        var extras = document.createElement('div');
        extras.className = 'line';
        extras.innerHTML = '<span>Package and enhancements</span><span>' + fmtPHP(enhancementSub) + '</span>';
        lines.appendChild(extras);
      }
      var tax = sub * TAX;
      var t1 = document.createElement('div');
      t1.className = 'line';
      t1.innerHTML = '<span>Service charge and taxes (18.95%)</span>';
      var t1v = document.createElement('span');
      t1v.textContent = fmtPHP(tax);
      t1.appendChild(t1v);
      lines.appendChild(t1);
      total.innerHTML = '<span>Estimated conceptual total</span><span>' + fmtPHP(sub + tax) + '</span>';
    } else {
      lines.innerHTML = '<div class="line"><span>No rooms booked yet.</span></div>';
      total.innerHTML = '<span>Total charge</span><span>PHP 0.00</span>';
    }
    if (cont) cont.textContent = state.step === 4 ? 'BOOK ANOTHER STAY' : 'CONTINUE';
  }

  function openBookingModal() {
    var modal = document.getElementById('booking-modal');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeBookingModal() {
    var modal = document.getElementById('booking-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  // --- Wire up (re-runnable: instant tab nav swaps in fresh DOM) ---
  function initBooking() {
    state = { checkin: null, checkout: null, code: '', room: null, rate: null, adults: 2, children: 0, rooms: 1, packagePrice: 0, packageName: 'No package', addons: [], step: 1 };
    base = { y: 2026, m: 8 };
    steps = Array.prototype.slice.call(document.querySelectorAll('.step-panel'));
    if (!steps.length) return;
    renderCal();
    applyBookingContext();
    renderSummary();
    goStep(1);

    var prev = $('cal-prev'), next = $('cal-next');
    if (prev) prev.addEventListener('click', function () {
      base.m--;
      if (base.m < 0) { base.m = 11; base.y--; }
      if (base.y < 2026 || (base.y === 2026 && base.m < 8)) { base = { y: 2026, m: 8 }; return; }
      renderCal();
    });
    if (next) next.addEventListener('click', function () {
      base.m++;
      if (base.m > 11) { base.m = 0; base.y++; }
      if (base.y > 2027 || (base.y === 2027 && base.m > 7)) { base = { y: 2027, m: 7 }; return; }
      renderCal();
    });

    var codeInput = $('f-code');
    if (codeInput) codeInput.addEventListener('input', function () {
      state.code = codeInput.value.trim();
      renderSummary();
    });
    ['f-adults', 'f-children', 'f-rooms'].forEach(function (id) {
      var input = $(id);
      if (!input) return;
      input.addEventListener('change', function () {
        state.adults = Number($('f-adults').value);
        state.children = Number($('f-children').value);
        state.rooms = Number($('f-rooms').value);
        renderSummary();
      });
    });

    var calToggle = $('calendar-toggle');
    var calPanel = $('calendar-panel');
    if (calToggle && calPanel) {
      calToggle.addEventListener('click', function () {
        var open = calPanel.hasAttribute('hidden');
        calPanel.toggleAttribute('hidden', !open);
        calToggle.setAttribute('aria-expanded', String(open));
      });
    }

    var toRooms = $('to-rooms');
    if (toRooms) toRooms.addEventListener('click', function () {
      var say = need(1);
      if (!state.checkin || !state.checkout) { say('Pick a check-in and check-out date first.'); return; }
      say('');
      goStep(2);
    });

    document.querySelectorAll('.room-pick').forEach(function (el) {
      el.addEventListener('click', function () {
        document.querySelectorAll('.room-pick').forEach(function (o) {
          o.classList.remove('is-selected');
          o.setAttribute('aria-pressed', 'false');
        });
        el.classList.add('is-selected');
        el.setAttribute('aria-pressed', 'true');
        state.room = el.dataset.room;
        state.rate = null;
        renderRates();
        renderSummary();
      });
    });

    var back2 = $('back-to-dates');
    if (back2) back2.addEventListener('click', function () { goStep(1); });
    var toGuest = $('to-guest');
    if (toGuest) toGuest.addEventListener('click', function () {
      var say = need(2);
      if (!currentRate()) { say('Choose a room, then press Book this room on a rate.'); return; }
      var capacity = RATES[state.room].capacity * state.rooms;
      if (state.adults + state.children > capacity) { say('This room type may not accommodate the selected number of guests.'); return; }
      say('');
      goStep(3);
    });

    var back3 = $('back-to-rooms');
    if (back3) back3.addEventListener('click', function () { goStep(2); });
    var guest = $('guest-form');
    var packageSelect = $('g-package');
    if (packageSelect) packageSelect.addEventListener('change', renderSummary);
    document.querySelectorAll('input[name="addons"]').forEach(function (input) { input.addEventListener('change', renderSummary); });
    if (guest) guest.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!guest.checkValidity()) { guest.reportValidity(); return; }
      var data = new FormData(guest);
      var ref = 'LUNAIRE-DEMO-2026-' + String(Math.floor(Math.random() * 900) + 100);
      $('confirm-ref').textContent = ref;
      $('confirm-name').textContent = String(data.get('name') || 'Guest');
      $('confirm-room').textContent = RATES[state.room].name + ' — ' + currentRate().name;
      $('confirm-dates').textContent = fmtDate(state.checkin) + ' to ' + fmtDate(state.checkout) + ' (' + nights() + ' nights)';
      $('confirm-total').textContent = $('sum-total').lastElementChild.textContent;
      $('confirm-method').textContent = String(data.get('requestMethod') || 'Conceptual request');
      document.getElementById('modal-ref').textContent = ref;
      document.getElementById('modal-room').textContent = RATES[state.room].name + ' — ' + currentRate().name;
      document.getElementById('modal-dates').textContent = fmtDate(state.checkin) + ' to ' + fmtDate(state.checkout) + ' (' + nights() + ' nights)';
      document.getElementById('modal-total').textContent = $('sum-total').lastElementChild.textContent;
      document.getElementById('modal-method').textContent = String(data.get('requestMethod') || 'Conceptual request');
      goStep(4);
      renderSummary();
      openBookingModal();
    });

    var modalClose = document.querySelector('.booking-modal-close');
    var modalBackdrop = document.querySelector('.booking-modal-backdrop');
    if (modalClose) modalClose.addEventListener('click', closeBookingModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeBookingModal);
    var modalHome = document.getElementById('modal-return-home');
    if (modalHome) modalHome.addEventListener('click', function () {
      closeBookingModal();
      window.location.href = 'index.html';
    });

    var editDates = $('edit-dates'), editCode = $('edit-code');
    if (editDates) editDates.addEventListener('click', function () { goStep(1); });
    if (editCode) editCode.addEventListener('click', function () { goStep(1); });
    var reset = $('sum-reset');
    if (reset) reset.addEventListener('click', function () {
      state.room = null;
      state.rate = null;
      document.querySelectorAll('.room-pick').forEach(function (el) {
        el.classList.remove('is-selected');
        el.setAttribute('aria-pressed', 'false');
      });
      renderRates();
      renderSummary();
    });
    var cont = $('sum-continue');
    if (cont) cont.addEventListener('click', function () {
      if (state.step === 4) {
        state.checkin = null; state.checkout = null;
        state.room = null; state.rate = null;
        var g = $('guest-form');
        if (g) g.reset();
        document.querySelectorAll('.room-pick').forEach(function (el) {
          el.classList.remove('is-selected');
          el.setAttribute('aria-pressed', 'false');
        });
        renderRates();
        syncDates();
        goStep(1);
        return;
      }
      if (!state.checkin || !state.checkout) { goStep(1); return; }
      if (!currentRate()) { goStep(2); return; }
      goStep(3);
    });

    document.querySelectorAll('.stepper li').forEach(function (li, i) {
      li.style.cursor = 'pointer';
      li.addEventListener('click', function () {
        if (i + 1 < state.step || (i === 0)) goStep(i + 1);
      });
    });
  }
  window.LunaireInitBooking = initBooking;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBooking);
  } else {
    initBooking();
  }
})();
