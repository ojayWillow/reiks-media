/* Mouse preview, keyboard preview, and inline tap disclosure on touch screens. */
(function () {
  'use strict';
  var section = document.querySelector('.career');
  if (!section) return;
  var desktop = window.matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  var buttons = Array.from(section.querySelectorAll('[data-career]'));
  var hovered = null;
  var focused = null;
  var expanded = null;
  function render() {
    var selected = desktop.matches ? (hovered || focused) : expanded;
    section.querySelectorAll('[data-career-image]').forEach(function (image) {
      var active = image.dataset.careerImage === (desktop.matches && selected ? selected : 'portrait');
      image.classList.toggle('is-active', active);
      image.setAttribute('aria-hidden', String(!active));
    });
    buttons.forEach(function (button) {
      var active = button.dataset.career === selected;
      button.closest('.career__entry').classList.toggle('is-active', active);
      var panel = document.getElementById(button.getAttribute('aria-controls'));
      panel.hidden = desktop.matches || !active;
      if (desktop.matches) button.removeAttribute('aria-expanded');
      else button.setAttribute('aria-expanded', String(active));
    });
  }
  buttons.forEach(function (button) {
    button.addEventListener('pointerenter', function (event) { if (event.pointerType === 'mouse') { hovered = button.dataset.career; render(); } });
    button.addEventListener('pointerleave', function () { hovered = null; render(); });
    button.addEventListener('focus', function () { if (button.matches(':focus-visible')) { focused = button.dataset.career; render(); } });
    button.addEventListener('blur', function () { focused = null; render(); });
    button.addEventListener('click', function () { if (!desktop.matches) { expanded = expanded === button.dataset.career ? null : button.dataset.career; render(); } });
  });
  section.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { hovered = focused = expanded = null; render(); }
  });
  desktop.addEventListener('change', function () { hovered = focused = expanded = null; render(); });
  render();
}());
