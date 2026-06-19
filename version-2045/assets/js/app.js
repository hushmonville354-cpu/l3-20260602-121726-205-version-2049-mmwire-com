(function () {
    const menuButton = document.querySelector("[data-menu-button]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            mobileMenu.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const input = form.querySelector("input[name='q']");
            const value = input ? input.value.trim() : "";
            const action = form.getAttribute("action") || "search.html";
            const target = value ? action + "?q=" + encodeURIComponent(value) : action;
            window.location.href = target;
        });
    });

    const carousel = document.querySelector("[data-hero-carousel]");

    if (carousel) {
        const slides = Array.from(carousel.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(carousel.querySelectorAll("[data-hero-dot]"));
        let current = 0;
        let timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function startTimer() {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                stopTimer();
                showSlide(index);
                startTimer();
            });
        });

        carousel.addEventListener("mouseenter", stopTimer);
        carousel.addEventListener("mouseleave", startTimer);
        showSlide(0);
        startTimer();
    }

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
        const input = panel.querySelector("[data-local-filter-input]");
        const yearSelect = panel.querySelector("[data-year-filter]");
        const cards = Array.from(panel.querySelectorAll(".movie-card"));
        const empty = panel.querySelector("[data-empty-state]");
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q") || "";

        if (input && query) {
            input.value = query;
        }

        function applyFilter() {
            const keyword = input ? input.value.trim().toLowerCase() : "";
            const year = yearSelect ? yearSelect.value : "";
            let visible = 0;

            cards.forEach(function (card) {
                const text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                const cardYear = card.getAttribute("data-year") || "";
                const keywordMatched = !keyword || text.indexOf(keyword) !== -1;
                const yearMatched = !year || cardYear === year;
                const matched = keywordMatched && yearMatched;

                card.hidden = !matched;

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilter);
        }

        applyFilter();
    });
})();
