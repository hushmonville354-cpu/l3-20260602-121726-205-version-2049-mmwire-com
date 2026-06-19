(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMobileNav() {
        var button = document.querySelector("[data-mobile-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var active = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle("is-active", position === active);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(active - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function readQuery() {
        try {
            return new URLSearchParams(window.location.search).get("q") || "";
        } catch (error) {
            return "";
        }
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
            var input = scope.querySelector("[data-filter-input]");
            var region = scope.querySelector("[data-region-filter]");
            var type = scope.querySelector("[data-type-filter]");
            var year = scope.querySelector("[data-year-filter]");
            var clear = scope.querySelector("[data-filter-clear]");
            var count = scope.querySelector("[data-result-count]");

            function valueOf(element) {
                return element ? element.value.trim().toLowerCase() : "";
            }

            function matchCard(card, query, regionValue, typeValue, yearValue) {
                var haystack = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.tags,
                    card.dataset.category
                ].join(" ").toLowerCase();
                if (query && haystack.indexOf(query) === -1) {
                    return false;
                }
                if (regionValue && (card.dataset.region || "").toLowerCase() !== regionValue) {
                    return false;
                }
                if (typeValue && (card.dataset.type || "").toLowerCase() !== typeValue) {
                    return false;
                }
                if (yearValue && (card.dataset.year || "").toLowerCase() !== yearValue) {
                    return false;
                }
                return true;
            }

            function apply() {
                var query = valueOf(input);
                var regionValue = valueOf(region);
                var typeValue = valueOf(type);
                var yearValue = valueOf(year);
                var visible = 0;
                cards.forEach(function (card) {
                    var matched = matchCard(card, query, regionValue, typeValue, yearValue);
                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                if (count) {
                    count.textContent = String(visible);
                }
            }

            if (input && readQuery() && window.location.pathname.indexOf("all-movies") !== -1) {
                input.value = readQuery();
            }

            [input, region, type, year].forEach(function (element) {
                if (element) {
                    element.addEventListener("input", apply);
                    element.addEventListener("change", apply);
                }
            });

            if (clear) {
                clear.addEventListener("click", function () {
                    if (input) {
                        input.value = "";
                    }
                    if (region) {
                        region.value = "";
                    }
                    if (type) {
                        type.value = "";
                    }
                    if (year) {
                        year.value = "";
                    }
                    apply();
                });
            }

            apply();
        });
    }

    ready(function () {
        setupMobileNav();
        setupHero();
        setupFilters();
    });
})();
