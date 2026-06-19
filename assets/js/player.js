(function () {
    window.initializeMoviePlayer = function (streamUrl, posterUrl) {
        var video = document.querySelector("[data-player-video]");
        var overlay = document.querySelector("[data-player-overlay]");
        var button = document.querySelector("[data-player-button]");
        var hlsInstance = null;

        if (!video || !streamUrl) {
            return;
        }

        if (posterUrl) {
            video.setAttribute("poster", posterUrl);
        }

        function attachSource() {
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                if (video.getAttribute("src") !== streamUrl) {
                    video.setAttribute("src", streamUrl);
                }
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                if (!hlsInstance) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(streamUrl);
                    hlsInstance.attachMedia(video);
                }
                return;
            }

            if (video.getAttribute("src") !== streamUrl) {
                video.setAttribute("src", streamUrl);
            }
        }

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }

        function showOverlay() {
            if (overlay) {
                overlay.classList.remove("is-hidden");
            }
        }

        function startPlayback() {
            attachSource();
            video.controls = true;
            hideOverlay();
            var playAttempt = video.play();
            if (playAttempt && typeof playAttempt.catch === "function") {
                playAttempt.catch(function () {
                    showOverlay();
                });
            }
        }

        if (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                startPlayback();
            });
        }

        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener("play", hideOverlay);

        video.addEventListener("ended", function () {
            video.controls = false;
            showOverlay();
        });
    };
})();
