document.addEventListener('DOMContentLoaded', function () {
  const root = document.querySelector('.media-cinema');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.media-cinema__slide'));
  const dots = Array.from(document.querySelectorAll('[data-media-slide]'));
  const pause = document.getElementById('media-slides-pause');
  const caption = document.getElementById('media-slide-caption');
  const labels = ['01 / Video veidošana', '02 / Filmēšanas process', '03 / Skaņas apstrāde'];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, paused = reduced.matches, timer;
  function show(index) {
    current = index;
    slides.forEach((slide, i) => { slide.classList.toggle('is-active', i === index); slide.setAttribute('aria-hidden', String(i !== index)); });
    dots.forEach((dot, i) => { dot.classList.toggle('is-active', i === index); dot.setAttribute('aria-pressed', String(i === index)); });
    caption.textContent = labels[index];
  }
  function schedule() {
    clearInterval(timer);
    if (!paused && !document.hidden) timer = setInterval(() => show((current + 1) % slides.length), 6500);
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-label', paused ? 'Atsākt slaidrādi' : 'Apturēt slaidrādi');
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); schedule(); }));
  pause.addEventListener('click', () => { paused = !paused; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { if (reduced.matches) { paused = true; schedule(); } });
  schedule();
});
