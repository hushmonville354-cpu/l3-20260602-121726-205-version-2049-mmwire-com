(function () {
  const mobileButton = document.querySelector('[data-mobile-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (mobileButton && mobileMenu) {
    mobileButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('mobile-nav-open');
    });
  }

  document.querySelectorAll('[data-site-search]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const value = input ? input.value.trim() : '';
      const target = value ? './library.html?q=' + encodeURIComponent(value) : './library.html';
      window.location.href = target;
    });
  });

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;

    function activate(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('hero-slide-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('hero-dot-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activate(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        activate((current + 1) % slides.length);
      }, 5200);
    }
  }

  const movieSearch = document.querySelector('[data-movie-search]');
  const categoryFilter = document.querySelector('[data-filter-category]');
  const yearFilter = document.querySelector('[data-filter-year]');
  const typeFilter = document.querySelector('[data-filter-type]');
  const cards = Array.from(document.querySelectorAll('.movie-card'));

  function readQuery() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    if (movieSearch && query) {
      movieSearch.value = query;
    }
  }

  function filterCards() {
    const keyword = movieSearch ? movieSearch.value.trim().toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : '';
    const year = yearFilter ? yearFilter.value : '';
    const type = typeFilter ? typeFilter.value : '';

    cards.forEach(function (card) {
      const text = [
        card.dataset.title || '',
        card.dataset.tags || '',
        card.dataset.category || '',
        card.dataset.year || '',
        card.dataset.type || ''
      ].join(' ').toLowerCase();

      const matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
      const matchedCategory = !category || card.dataset.category === category;
      const matchedYear = !year || card.dataset.year === year;
      const matchedType = !type || card.dataset.type === type;

      card.classList.toggle('movie-card-hidden', !(matchedKeyword && matchedCategory && matchedYear && matchedType));
    });
  }

  [movieSearch, categoryFilter, yearFilter, typeFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', filterCards);
      control.addEventListener('change', filterCards);
    }
  });

  readQuery();
  filterCards();
})();
