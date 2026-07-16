/* ================================================================
   REIKS — MULTI-PAGE SITE SCRIPTS  (v3)
   ----------------------------------------------------------------
   Dependency-free, shared across every page (index / about / music /
   services). Each feature checks whether its target exists first, so
   the same file can safely load on all pages.

   1. Mobile navigation toggle (hamburger)
   2. Solid nav background after scroll + scroll progress bar
   3. Hero title letter-by-letter entrance (home only)
   4. Scroll-reveal animations with stagger
   5. Mouse-tracking glow on cards
   6. Video-style photo slideshow (any page that has one)
   7. Contact form handling (front-end only, services page)
   8. Auto copyright year
   ================================================================ */

document.addEventListener("DOMContentLoaded", function () {

  var prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------
     1. MOBILE NAV TOGGLE
     -------------------------------------------------------------- */
  var navToggle = document.querySelector(".nav__toggle");
  var navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("nav__menu--open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Aizvērt izvēlni" : "Atvērt izvēlni");
    });

    navMenu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("nav__menu--open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --------------------------------------------------------------
     2. SOLID NAV ON SCROLL + SCROLL PROGRESS BAR
     -------------------------------------------------------------- */
  var header = document.getElementById("site-header");
  var progressBar = document.querySelector(".scroll-progress");

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("site-header--solid", y > 40);
    if (progressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------------------
     3. HERO TITLE — letter-by-letter entrance (home page only)
     -------------------------------------------------------------- */
  var heroTitle = document.getElementById("hero-title");

  if (heroTitle && !prefersReducedMotion) {
    var text = heroTitle.textContent;
    heroTitle.textContent = "";
    heroTitle.setAttribute("aria-label", text);
    text.split("").forEach(function (char, i) {
      var span = document.createElement("span");
      span.className = "letter";
      span.textContent = char;
      span.style.setProperty("--i", i);
      span.setAttribute("aria-hidden", "true");
      heroTitle.appendChild(span);
    });
  }

  /* --------------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS (with stagger)
     -------------------------------------------------------------- */
  var revealElements = document.querySelectorAll(".reveal");

  document.querySelectorAll(
    ".skills__grid, .music__grid, .gallery__grid, .discography__list, " +
    ".services-grid, .process, .pricing, .metrics, .timeline"
  ).forEach(function (grid) {
    var children = grid.querySelectorAll(".reveal");
    children.forEach(function (el, i) {
      el.style.setProperty("--stagger", i % children.length);
    });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add("reveal--visible"); });
  }

  /* --------------------------------------------------------------
     5. MOUSE-TRACKING GLOW ON CARDS
     -------------------------------------------------------------- */
  document.querySelectorAll(".glow-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      card.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
  });

  /* --------------------------------------------------------------
     6. VIDEO-STYLE SLIDESHOW (any page with .slideshow)
     Works on every .slideshow on the page independently.
     -------------------------------------------------------------- */
  var SLIDE_DURATION = 4500; // ms each photo stays on screen

  document.querySelectorAll(".slideshow").forEach(function (slideshow) {
    var slides = slideshow.querySelectorAll(".slideshow__slide");
    var dotsWrap = slideshow.querySelector(".slideshow__dots");
    if (slides.length === 0) return;

    var current = 0;
    var timer = null;
    var dots = [];

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "slideshow__dot" + (i === 0 ? " slideshow__dot--active" : "");
        dot.type = "button";
        dot.tabIndex = -1;
        dot.addEventListener("click", function () { goTo(i); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function goTo(index) {
      slides[current].classList.remove("slideshow__slide--active");
      if (dots[current]) dots[current].classList.remove("slideshow__dot--active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("slideshow__slide--active");
      if (dots[current]) dots[current].classList.add("slideshow__dot--active");
      restartTimer();
    }
    function restartTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, SLIDE_DURATION);
    }

    if (slides.length > 1) {
      restartTimer();
      slideshow.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
      slideshow.addEventListener("mouseleave", restartTimer);
    }
  });

  /* --------------------------------------------------------------
     7. CONTACT FORM (front-end only — services page)
     To make it real: point <form> at Formspree
     (action="https://formspree.io/f/YOUR_ID" method="POST") and
     delete this handler, or fetch() to your own backend.
     -------------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Lūdzu, aizpildi visus laukus pareizi.";
        form.reportValidity();
        return;
      }
      status.textContent = "Paldies! Ziņa saņemta. (Demo režīms — pieslēdz backend, lai sūtītu pa īstam.)";
      form.reset();
    });
  }

  /* --------------------------------------------------------------
     8. Auto copyright year
     -------------------------------------------------------------- */
  var yearEls = document.querySelectorAll("#year, .js-year");
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

});
