(function () {
    window.initMoviePlayer = function (videoUrl) {
        const player = document.querySelector(".movie-player");

        if (!player) {
            return;
        }

        const video = player.querySelector(".movie-video");
        const cover = player.querySelector(".player-cover");
        let prepared = false;
        let hlsInstance = null;

        function prepareVideo() {
            if (prepared || !video) {
                return;
            }

            prepared = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = videoUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(videoUrl);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = videoUrl;
        }

        function startPlayback() {
            prepareVideo();
            player.classList.add("is-playing");
            video.controls = true;

            const playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    player.classList.remove("is-playing");
                });
            }
        }

        if (cover) {
            cover.addEventListener("click", startPlayback);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    startPlayback();
                }
            });
        }

        window.addEventListener("pagehide", function () {
            if (hlsInstance && typeof hlsInstance.destroy === "function") {
                hlsInstance.destroy();
            }
        });
    };
})();
