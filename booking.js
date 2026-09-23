// Lunaire booking flow defined by contents.md.
(function () {
  'use strict';

  var TAX_RATE = 0.12;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);
  var base = { year: TODAY.getFullYear(), month: TODAY.getMonth() };
  var rooms = {
    classic: { name: 'Lunaire Classic Room', size: '28 sqm', occupancy: 2, guests: '2 guests', bed: '1 King Bed or 2 Twin Beds', amenities: 'King/Twin Bed, Smart TV, Work Desk, Air Conditioning, Wi-Fi', price: 6500, image: 'Lunaire-Classic-Room.png' },
    deluxe: { name: 'Lunaire Deluxe Room', size: '34 sqm', occupancy: 2, guests: '2 guests', bed: 'King Bed', amenities: 'King Bed, Rainfall Shower, Smart TV, Seating Area, Mini Bar', price: 7500, image: 'Lunaire-Deluxe-Room.png' },
    premier: { name: 'Lunaire Premier Room', size: '40 sqm', occupancy: 2, guests: '2 guests', bed: 'King Bed', amenities: 'King Bed, Sitting Area, Bathtub, Mini Bar, Scenic View', price: 8500, image: 'Lunaire-Premier-Room-with-Taal-View_.png' },
    junior: { name: 'Lunaire Junior Suite', size: '52 sqm', occupancy: 3, guests: '2–3 guests', bed: 'King Bed', amenities: 'King Bed, Separate Living Area, Sofa, Bathtub, Scenic View', price: 10500, image: 'Lunaire-Junior-Suite_.png' },
    executive: { name: 'Lunaire Executive Suite', size: '68 sqm', occupancy: 3, guests: '2–3 guests', bed: 'King Bed', amenities: 'Separate Bedroom, Living Room, Dining Area, Work Area, Bathtub', price: 13500, image: 'Executive-Suite_.png' },
    moonlight: { name: 'Moonlight Suite', size: '90 sqm', occupancy: 2, guests: '2 guests', bed: 'King Bed', amenities: 'Private Balcony, Panoramic View, Freestanding Bathtub, Private Dining Area', price: 17500, image: 'Moonlight-Suite.png' },
    family: { name: 'Family / Connecting Rooms', size: '56 sqm combined', occupancy: 4, guests: '4 guests', bed: 'King + Twin Beds', amenities: 'Connecting Rooms, Two Bathrooms, Smart TVs, Refrigerator, Wi-Fi', price: 12000, image: 'Family-Experience_.png' }
  };
  var state = { checkin: null, checkout: null, room: 'classic', adults: 2, children: 0, promo: '', addons: [], guest: null, step: 1 };
  var steps = [];

  function $(id) { return document.getElementById(id); }
  function money(value) { return '₱' + Math.round(value).toLocaleString('en-PH'); }
  function dateText(date) { return MONTHS[date.getMonth()].slice(0, 3) + ' ' + date.getDate() + ', ' + date.getFullYear(); }
  function sameDay(a, b) { return a && b && a.toDateString() === b.toDateString(); }
  function nightCount() { return state.checkin && state.checkout ? Math.round((state.checkout - state.checkin) / 86400000) : 0; }
  function selectedRoom() { return rooms[state.room]; }
  function addonTotal() { return state.addons.reduce(function (sum, addon) { return sum + addon.price; }, 0); }
  function roomTotal() { return selectedRoom().price * nightCount(); }
  function taxTotal() { return (roomTotal() + addonTotal()) * TAX_RATE; }
  function grandTotal() { return roomTotal() + addonTotal() + taxTotal(); }

  function renderCalendar() {
    var grid = $('cal-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (var offset = 0; offset < 2; offset++) {
      var year = base.year;
      var month = base.month + offset;
      if (month > 11) { month -= 12; year++; }
      var box = document.createElement('div');
      box.className = 'cal';
      var table = document.createElement('table');
      var caption = document.createElement('caption');
      caption.textContent = MONTHS[month] + ' ' + year;
      table.appendChild(caption);
      var head = document.createElement('thead');
      var row = document.createElement('tr');
      ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].forEach(function (label) { var th = document.createElement('th'); th.textContent = label; th.scope = 'col'; row.appendChild(th); });
      head.appendChild(row); table.appendChild(head);
      var body = document.createElement('tbody');
      var first = new Date(year, month, 1).getDay();
      var count = new Date(year, month + 1, 0).getDate();
      var day = 1;
      for (var r = 0; r < 6 && day <= count; r++) {
        var tr = document.createElement('tr');
        for (var c = 0; c < 7; c++) {
          var td = document.createElement('td');
          if ((r === 0 && c < first) || day > count) { td.innerHTML = '<span aria-hidden="true"></span>'; }
          else {
            (function (value) {
              var button = document.createElement('button');
              var date = new Date(year, month, value);
              button.type = 'button'; button.textContent = value; button.setAttribute('aria-label', dateText(date));
              if (date < TODAY) button.disabled = true;
              else button.addEventListener('click', function () { chooseDate(date); });
              if (sameDay(date, state.checkin)) button.classList.add('is-checkin');
              if (sameDay(date, state.checkout)) button.classList.add('is-checkout');
              if (state.checkin && state.checkout && date > state.checkin && date < state.checkout) button.classList.add('is-stay');
              td.appendChild(button);
            })(day);
            day++;
          }
          tr.appendChild(td);
        }
        body.appendChild(tr);
      }
      table.appendChild(body); box.appendChild(table); grid.appendChild(box);
    }
  }

  function chooseDate(date) {
    if (!state.checkin || state.checkout) { state.checkin = date; state.checkout = null; }
    else if (date > state.checkin) state.checkout = date;
    else state.checkin = date;
    syncDates();
  }
  function syncDates() {
    if ($('f-checkin')) $('f-checkin').value = state.checkin ? dateText(state.checkin) : '';
    if ($('f-checkout')) $('f-checkout').value = state.checkout ? dateText(state.checkout) : '';
    if ($('night-count')) $('night-count').textContent = nightCount() ? nightCount() + ' night' + (nightCount() > 1 ? 's' : '') : 'Select your dates below.';
    if ($('calendar-summary')) $('calendar-summary').textContent = state.checkin && state.checkout ? dateText(state.checkin) + ' – ' + dateText(state.checkout) : 'Select dates';
    renderCalendar(); renderSummary();
  }

  function renderRooms() {
    var grid = $('room-grid'); if (!grid) return;
    grid.innerHTML = '';
    Object.keys(rooms).forEach(function (key) {
      var room = rooms[key];
      var button = document.createElement('button');
      button.type = 'button'; button.className = 'media-card room-pick'; button.dataset.room = key; button.setAttribute('aria-pressed', String(state.room === key));
      if (state.room === key) button.classList.add('is-selected');
      button.innerHTML = '<img src="' + room.image + '" alt="' + room.name + '" loading="lazy"><span class="body"><span class="overline">' + room.size + ' · ' + room.guests + '</span><b>' + room.name + '</b><span>' + room.bed + ' · ' + room.amenities + '.</span><span class="price">' + money(room.price) + ' <small>/ night</small></span></span>';
      button.addEventListener('click', function () { state.room = key; renderRooms(); renderSummary(); });
      grid.appendChild(button);
    });
  }

  function renderSummary() {
    var date = $('sum-dates'), lines = $('sum-lines'), total = $('sum-total');
    if (!date || !lines || !total) return;
    date.textContent = state.checkin ? dateText(state.checkin) + (state.checkout ? ' – ' + dateText(state.checkout) : ' – select check-out') : 'Select dates';
    lines.innerHTML = '<div class="line"><span><b>' + selectedRoom().name + '</b><br>' + selectedRoom().size + ' · ' + selectedRoom().bed + '<br>' + (nightCount() || 0) + ' night(s)</span><span>' + money(roomTotal()) + '</span></div>';
    if (addonTotal()) lines.innerHTML += '<div class="line"><span>Add-ons</span><span>' + money(addonTotal()) + '</span></div>';
    total.innerHTML = '<span>Total</span><span>' + money(grandTotal()) + '</span>';
  }

  function renderConfirmation() {
    var addons = state.addons.length ? state.addons.map(function (item) { return item.name; }).join(', ') : 'None';
    $('confirm-room').textContent = selectedRoom().name;
    $('confirm-dates').textContent = dateText(state.checkin) + ' – ' + dateText(state.checkout);
    $('confirm-guests').textContent = state.adults + ' adult' + (state.adults === 1 ? '' : 's') + ', ' + state.children + ' children';
    $('confirm-room-rate').textContent = money(selectedRoom().price) + ' × ' + nightCount() + ' night' + (nightCount() === 1 ? '' : 's');
    $('confirm-addons').textContent = addons + ' (' + money(addonTotal()) + ')';
    $('confirm-tax').textContent = money(taxTotal());
    $('confirm-total').textContent = money(grandTotal());
  }

  function goStep(number) {
    state.step = number;
    steps.forEach(function (panel) { var active = Number(panel.dataset.step) === number; panel.hidden = !active; panel.classList.toggle('is-active', active); if (active) { var heading = panel.querySelector('h2'); if (heading) heading.focus({ preventScroll: true }); } });
    document.querySelectorAll('.stepper li').forEach(function (item, index) { item.classList.toggle('is-done', index + 1 < number); if (index + 1 === number) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); var dot = item.querySelector('.step-dot'); if (dot) dot.textContent = index + 1 < number ? '✓' : String(index + 1); });
  }
  function status(step, message) { var element = $('step-status-' + step); if (element) element.textContent = message; }

  function applyBookingContext(params) {
    var roomKey = params.get('room');
    if (rooms[roomKey]) state.room = roomKey;
    if ($('f-room-type')) $('f-room-type').value = state.room;
    var addonMap = {
      romantic: 'romantic',
      celebration: 'celebration',
      dining: 'dining',
      'private-dining': 'dining',
      spa: 'spa',
      cinema: 'cinema',
      transport: 'transport'
    };
    var addonKey = addonMap[params.get('addon')];
    if (addonKey) {
      var addon = document.querySelector('input[name="addons"][value="' + addonKey + '"]');
      if (addon) addon.checked = true;
    }
    state.addons = Array.prototype.slice.call(document.querySelectorAll('input[name="addons"]:checked')).map(function (item) {
      return { name: item.parentElement.textContent.split('—')[0].trim(), price: Number(item.dataset.price || 0) };
    });
  }

  function init() {
    steps = Array.prototype.slice.call(document.querySelectorAll('.step-panel')); if (!steps.length) return;
    var params = new URLSearchParams(window.location.search); applyBookingContext(params);
    renderRooms(); renderCalendar(); syncDates(); goStep(1);
    $('calendar-toggle').addEventListener('click', function () { var panel = $('calendar-panel'); var open = panel.hasAttribute('hidden'); panel.toggleAttribute('hidden', !open); $('calendar-toggle').setAttribute('aria-expanded', String(open)); });
    $('cal-prev').addEventListener('click', function () { base.month--; if (base.month < 0) { base.month = 11; base.year--; } renderCalendar(); });
    $('cal-next').addEventListener('click', function () { base.month++; if (base.month > 11) { base.month = 0; base.year++; } renderCalendar(); });
    ['f-adults', 'f-children'].forEach(function (id) { $(id).addEventListener('change', function () { state.adults = Number($('f-adults').value); state.children = Number($('f-children').value); renderSummary(); }); });
    $('f-room-type').addEventListener('change', function () { state.room = $('f-room-type').value; renderRooms(); renderSummary(); });
    $('f-code').addEventListener('input', function () { state.promo = $('f-code').value.trim(); });
    $('to-rooms').addEventListener('click', function () { if (!state.checkin || !state.checkout) { status(1, 'Please select both check-in and check-out dates.'); return; } goStep(2); });
    $('back-to-search').addEventListener('click', function () { goStep(1); });
    $('to-enhance').addEventListener('click', function () { var room = selectedRoom(); if (state.adults + state.children > room.occupancy) { status(2, 'Please choose a room that accommodates your selected guests.'); return; } status(2, ''); goStep(3); });
    $('back-to-room').addEventListener('click', function () { goStep(2); });
    document.querySelectorAll('input[name="addons"]').forEach(function (input) { input.addEventListener('change', function () { state.addons = Array.prototype.slice.call(document.querySelectorAll('input[name="addons"]:checked')).map(function (item) { return { name: item.parentElement.textContent.split('—')[0].trim(), price: Number(item.dataset.price || 0) }; }); renderSummary(); }); });
    $('to-guest').addEventListener('click', function () { goStep(4); });
    $('back-to-enhance').addEventListener('click', function () { goStep(3); });
    $('guest-form').addEventListener('submit', function (event) { event.preventDefault(); if (!$('guest-form').checkValidity()) { $('guest-form').reportValidity(); return; } state.guest = Object.fromEntries(new FormData($('guest-form')).entries()); renderConfirmation(); goStep(5); });
    $('back-to-details').addEventListener('click', function () { goStep(4); });
    $('confirm-reservation').addEventListener('click', function () { var reference = 'LUN-' + Math.random().toString(36).slice(2, 8).toUpperCase(); var message = $('step-status-5'); message.textContent = 'Reservation ' + reference + ' confirmed for ' + state.guest.name + '. A confirmation email has been sent to ' + state.guest.email + '.'; $('confirm-reservation').disabled = true; });
    $('edit-dates').addEventListener('click', function () { goStep(1); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
