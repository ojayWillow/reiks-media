document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('appointment-form');
  if (!form) return;
  var date = form.elements.date;
  var status = document.getElementById('appointment-status');
  var button = form.querySelector('button[type="submit"]');
  var next = document.getElementById('booking-next');
  var timePanel = document.getElementById('booking-time-panel');
  var contactPanel = document.getElementById('booking-contact-panel');
  var selection = document.getElementById('booking-selection');
  var today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Riga' }).format(new Date());
  var dateLabel = new Intl.DateTimeFormat('lv-LV', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  date.min = today;
  form.noValidate = true;
  next.hidden = false;
  contactPanel.hidden = true;
  selection.hidden = false;
  var dayButtons = [];
  var cursor = new Date(today + 'T12:00:00Z');
  while (dayButtons.length < 5) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if ([0, 6].includes(cursor.getUTCDay())) continue;
    var value = cursor.toISOString().slice(0, 10);
    var dayButton = document.createElement('button');
    dayButton.type = 'button';
    dayButton.className = 'media-booking__day';
    dayButton.dataset.date = value;
    dayButton.setAttribute('aria-label', dateLabel.format(cursor));
    dayButton.setAttribute('aria-pressed', 'false');
    var weekday = document.createElement('span');
    weekday.textContent = new Intl.DateTimeFormat('lv-LV', { weekday: 'short', timeZone: 'UTC' }).format(cursor);
    var number = document.createElement('strong');
    number.textContent = cursor.getUTCDate();
    var month = document.createElement('small');
    month.textContent = new Intl.DateTimeFormat('lv-LV', { month: 'short', timeZone: 'UTC' }).format(cursor);
    dayButton.append(weekday, number, month);
    dayButton.addEventListener('click', function (event) {
      date.value = event.currentTarget.dataset.date;
      validateDate();
      status.textContent = '';
    });
    document.getElementById('booking-days').appendChild(dayButton);
    dayButtons.push(dayButton);
  }
  function validateDate() {
    var day = new Date(date.value + 'T12:00:00Z').getUTCDay();
    date.setCustomValidity(day === 0 || day === 6 ? 'Lūdzu, izvēlies darba dienu.' : '');
    dayButtons.forEach(function (item) {
      item.setAttribute('aria-pressed', String(item.dataset.date === date.value));
    });
  }
  date.value = dayButtons[0].dataset.date;
  validateDate();
  date.addEventListener('input', validateDate);
  function showTime() {
    timePanel.hidden = false;
    contactPanel.hidden = true;
    document.getElementById('booking-step-time').setAttribute('aria-current', 'step');
    document.getElementById('booking-step-contact').removeAttribute('aria-current');
    form.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  function showContact() {
    status.textContent = '';
    validateDate();
    if (!date.reportValidity()) return;
    var time = form.querySelector('input[name="time"]:checked');
    if (!time) {
      status.textContent = 'Izvēlies vēlamo sarunas laiku.';
      form.querySelector('input[name="time"]').focus();
      return;
    }
    document.getElementById('booking-selection-text').textContent = dateLabel.format(new Date(date.value + 'T12:00:00Z')) + ' · ' + time.value + ' · 30 min';
    timePanel.hidden = true;
    contactPanel.hidden = false;
    document.getElementById('booking-step-time').removeAttribute('aria-current');
    document.getElementById('booking-step-contact').setAttribute('aria-current', 'step');
    form.elements.name.focus({ preventScroll: true });
    form.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  next.addEventListener('click', showContact);
  document.getElementById('booking-back').addEventListener('click', function () {
    status.textContent = '';
    showTime();
    next.focus({ preventScroll: true });
  });
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (contactPanel.hidden) { showContact(); return; }
    if (!form.reportValidity()) return;
    if (form.dataset.delivery === 'email') {
      var request = Object.fromEntries(new FormData(form));
      var subject = 'Reiks MEDIA — sarunas pieteikums ' + request.date + ' ' + request.time;
      var body = [
        'Labdien! Vēlos pieteikt 30 minūšu iepazīšanās sarunu.',
        '', 'Vārds: ' + request.name, 'E-pasts: ' + request.email,
        'Vēlamais datums: ' + request.date, 'Vēlamais laiks: ' + request.time + ' (Latvijas laiks)',
        '', 'Mana iecere:', request.message || 'Pārrunāsim sarunas laikā.',
        '', 'Lūdzu, apstipriniet, vai šis laiks ir pieejams.'
      ].join('\n');
      window.location.href = 'mailto:' + form.dataset.recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Pieteikums ir sagatavots. Nosūti to savā e-pasta lietotnē. Ja lietotne neatveras, sazinies ar mums Instagram.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Nosūtām pieteikumu…';
    try {
      var data = Object.fromEntries(new FormData(form));
      var response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.status === 503 || response.status === 501) {
        status.textContent = 'Priekšskatījums: e-pasta nosūtīšana vēl nav pieslēgta. Pieteikums nav nosūtīts.';
        return;
      }
      if (!response.ok) throw new Error('request_failed');
      status.textContent = 'Paldies! Pieteikums ir nosūtīts. Sazināsimies e-pastā, lai apstiprinātu sarunas laiku.';
      form.reset();
      date.value = dayButtons[0].dataset.date;
      validateDate();
      showTime();
    } catch (error) {
      status.textContent = 'Pieteikumu neizdevās nosūtīt. Lūdzu, mēģini vēlreiz vai sazinies Instagram.';
    } finally {
      button.disabled = false;
    }
  });
});
