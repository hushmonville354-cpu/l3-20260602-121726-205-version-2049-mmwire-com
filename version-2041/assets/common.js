(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".hero-tab"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      tabs.forEach(function (tab, tabIndex) {
        tab.classList.toggle("is-active", tabIndex === current);
      });
    }

    function startHero() {
      if (slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        showSlide(index);
        startHero();
      });
    });

    showSlide(0);
    startHero();

    Array.prototype.slice.call(document.querySelectorAll("[data-search-box]")).forEach(function (input) {
      var scopeSelector = input.getAttribute("data-search-scope");
      var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
      var empty = document.querySelector(input.getAttribute("data-empty-target") || "");

      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        var visible = 0;
        Array.prototype.slice.call(scope.querySelectorAll("[data-filter-item]")).forEach(function (item) {
          var keywords = (item.getAttribute("data-keywords") || item.textContent || "").toLowerCase();
          var matched = !query || keywords.indexOf(query) !== -1;
          item.classList.toggle("is-hidden", !matched);
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      });
    });
  });
})();
