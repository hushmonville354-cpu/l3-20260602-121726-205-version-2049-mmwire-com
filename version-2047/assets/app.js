(function () {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-nav');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('[data-hero]'));
  let heroIndex = 0;
  function showHero(index) {
    if (!slides.length) return;
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === heroIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === heroIndex);
    });
  }
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showHero(Number(dot.getAttribute('data-hero')) || 0);
    });
  });
  if (slides.length > 1) {
    setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  const filterInput = document.querySelector('.filter-input');
  const filterSelect = document.querySelector('.filter-select');
  const cards = Array.from(document.querySelectorAll('.movie-card'));
  function applyFilter() {
    const keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    const year = filterSelect ? filterSelect.value : '';
    cards.forEach(function (card) {
      const text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region')
      ].join(' ').toLowerCase();
      const okKeyword = !keyword || text.indexOf(keyword) !== -1;
      const okYear = !year || (card.getAttribute('data-year') || '').indexOf(year) !== -1;
      card.style.display = okKeyword && okYear ? '' : 'none';
    });
  }
  if (filterInput) filterInput.addEventListener('input', applyFilter);
  if (filterSelect) filterSelect.addEventListener('change', applyFilter);

  function startPlayback(layer) {
    const card = layer.closest('.player-card');
    if (!card) return;
    const video = card.querySelector('video');
    const stream = layer.getAttribute('data-stream');
    if (!video || !stream) return;
    const playNow = function () {
      layer.classList.add('hidden');
      const result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          layer.classList.remove('hidden');
        });
      }
    };
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== stream) video.src = stream;
      playNow();
    } else if (window.Hls && window.Hls.isSupported()) {
      if (!video.hlsReady) {
        const hls = new window.Hls();
        hls.loadSource(stream);
        hls.attachMedia(video);
        video.hlsReady = true;
      }
      setTimeout(playNow, 180);
    } else {
      video.src = stream;
      playNow();
    }
  }
  document.querySelectorAll('.play-layer').forEach(function (layer) {
    layer.addEventListener('click', function () {
      startPlayback(layer);
    });
  });

  const searchBox = document.getElementById('siteSearch');
  const results = document.getElementById('searchResults');
  function renderSearch(list) {
    if (!results) return;
    results.innerHTML = list.slice(0, 80).map(function (item) {
      return '<article class="movie-card">' +
        '<a class="poster-link" href="' + item.href + '">' +
        '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
        '<span class="play-dot">▶</span>' +
        '</a>' +
        '<div class="movie-card-body">' +
        '<h3><a href="' + item.href + '">' + item.title + '</a></h3>' +
        '<p>' + item.genre + '</p>' +
        '<div class="meta-row"><span>' + item.region + '</span><span>' + item.year + '</span><span>' + item.type + '</span></div>' +
        '</div>' +
        '</article>';
    }).join('');
  }
  if (searchBox && results && Array.isArray(window.searchData || searchData)) {
    const params = new URLSearchParams(location.search);
    const start = params.get('q') || '';
    searchBox.value = start;
    const run = function () {
      const q = searchBox.value.trim().toLowerCase();
      const list = (window.searchData || searchData).filter(function (item) {
        return !q || item.text.toLowerCase().indexOf(q) !== -1;
      });
      renderSearch(list);
    };
    searchBox.addEventListener('input', run);
    run();
  }
})();
