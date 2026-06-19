(function () {
  function loadHls() {
    return new Promise(function (resolve, reject) {
      if (window.Hls) {
        resolve(window.Hls);
        return;
      }

      var existing = document.querySelector("script[data-hls-loader]");
      if (existing) {
        existing.addEventListener("load", function () {
          resolve(window.Hls);
        });
        existing.addEventListener("error", reject);
        return;
      }

      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
      script.async = true;
      script.setAttribute("data-hls-loader", "true");
      script.addEventListener("load", function () {
        resolve(window.Hls);
      });
      script.addEventListener("error", reject);
      document.head.appendChild(script);
    });
  }

  function mount(id, url) {
    var wrap = document.getElementById(id);
    if (!wrap) {
      return;
    }

    var video = wrap.querySelector("video");
    var cover = wrap.querySelector(".player-cover");
    var attached = false;
    var instance = null;

    function attach() {
      if (attached) {
        return Promise.resolve();
      }

      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        return Promise.resolve();
      }

      return loadHls().then(function (Hls) {
        if (Hls && Hls.isSupported()) {
          instance = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          instance.loadSource(url);
          instance.attachMedia(video);
          return;
        }
        video.src = url;
      });
    }

    function start() {
      wrap.classList.add("is-playing");
      attach().then(function () {
        var playResult = video.play();
        if (playResult && typeof playResult.catch === "function") {
          playResult.catch(function () {
            wrap.classList.remove("is-playing");
          });
        }
      }).catch(function () {
        wrap.classList.remove("is-playing");
      });
    }

    if (cover) {
      cover.addEventListener("click", start);
    }

    video.addEventListener("play", function () {
      wrap.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        return;
      }
      wrap.classList.remove("is-playing");
    });

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (instance) {
        instance.destroy();
      }
    });
  }

  window.SitePlayer = {
    mount: mount
  };
})();
