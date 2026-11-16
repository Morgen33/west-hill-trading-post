/* West Hill Trading Post */
(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  if (header && document.body.classList.contains("home")) {
    var paint = function () {
      header.classList.toggle("is-solid", window.scrollY > 28);
    };
    paint();
    window.addEventListener("scroll", paint, { passive: true });
  }

  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("drawer");
  if (toggle && drawer) {
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      drawer.hidden = !open;
      document.body.classList.toggle("nav-open", open);
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  var gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    var img = gallery.querySelector(".gallery__img");
    var source = gallery.querySelector("source");
    var caption = gallery.querySelector(".gallery__caption");
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll(".thumbs a"));

    function show(link) {
      var webp = link.getAttribute("data-webp");
      var jpg = link.getAttribute("data-jpg");
      var alt = link.getAttribute("data-alt") || "";
      if (source && webp) source.srcset = webp;
      if (jpg) img.src = jpg;
      img.alt = alt;
      if (caption) caption.textContent = link.getAttribute("data-caption") || "";
      thumbs.forEach(function (t) {
        t.removeAttribute("aria-current");
      });
      link.setAttribute("aria-current", "true");
    }

    thumbs.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        show(link);
      });
    });
  }

  var video = document.querySelector(".road__stage video");
  var heroFilm = document.querySelector(".hero__film");
  var hero = document.querySelector(".hero--film");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* The burnt-in name lands just after 11 seconds. The overlay gets out of the way. */
  var LOGO_AT = 11;
  function syncLogo() {
    if (!hero || !heroFilm) return;
    if (reduceMotion) {
      hero.classList.add("hero--logo");
      return;
    }
    hero.classList.toggle("hero--logo", heroFilm.currentTime >= LOGO_AT);
  }
  if (heroFilm && reduceMotion) {
    heroFilm.removeAttribute("autoplay");
    heroFilm.pause();
  }
  if (heroFilm) {
    heroFilm.addEventListener("timeupdate", syncLogo);
    heroFilm.addEventListener("seeked", syncLogo);
    heroFilm.addEventListener("play", syncLogo);
    syncLogo();
  }
  if (video) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.removeAttribute("autoplay");
      video.pause();
    } else {
      var play = video.play();
      if (play && play.catch) play.catch(function () {});
    }
  }
})();
