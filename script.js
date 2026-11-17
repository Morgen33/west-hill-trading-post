/* West Hill Trading Post — hero slider, mega menu, mobile drawer */
(function () {
  'use strict';

  /* ----------------------------------------------------------- hero film */
  var video = document.querySelector('.hero__video');

  if (video) {
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (still) {
      /* hold the poster frame rather than looping motion */
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      /* Safari/iOS can reject the initial play(); retry once muted. */
      var attempt = video.play();
      if (attempt && attempt.catch) {
        attempt.catch(function () {
          video.muted = true;
          video.play().catch(function () { /* poster stands in */ });
        });
      }
    }

    /* don't burn cycles on a tab nobody is looking at */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        video.pause();
      } else if (!still) {
        video.play().catch(function () {});
      }
    });
  }

  /* ----------------------------------------------------------- mega menu */
  var toggles = Array.prototype.slice.call(document.querySelectorAll('.nav__toggle'));

  function closeMenus(except) {
    toggles.forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      document.getElementById(t.getAttribute('aria-controls')).classList.remove('is-open');
    });
  }

  toggles.forEach(function (toggle) {
    var panel = document.getElementById(toggle.getAttribute('aria-controls'));
    var item = toggle.closest('.nav__item');
    var leaveTimer = null;

    function open() {
      clearTimeout(leaveTimer);
      closeMenus(toggle);
      toggle.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
    }

    function close() {
      toggle.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
    });

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', function () {
      leaveTimer = setTimeout(close, 180);
    });
    panel.addEventListener('mouseenter', function () { clearTimeout(leaveTimer); });
    panel.addEventListener('mouseleave', function () {
      leaveTimer = setTimeout(close, 180);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenus(null);
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav')) closeMenus(null);
  });

  /* -------------------------------------------------------------- drawer */
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      drawer.hidden = open;
      document.body.style.overflow = open ? '' : 'hidden';
    });
  }

  /* ---------------------------------------------------- scroll + reveals */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
