import { H as Hls } from './hls.js';

export function startMoviePlayer(config) {
  const video = document.getElementById(config.videoId);
  const trigger = document.getElementById(config.triggerId);
  const overlay = document.getElementById(config.overlayId);

  if (!video || !trigger || !overlay || !config.source) {
    return;
  }

  let attached = false;
  let hlsInstance = null;

  function attachSource() {
    if (attached) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = config.source;
    } else if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(config.source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = config.source;
    }

    attached = true;
  }

  async function playVideo() {
    attachSource();
    overlay.style.display = 'none';
    video.setAttribute('controls', 'controls');

    try {
      await video.play();
    } catch (error) {
      overlay.style.display = 'flex';
    }
  }

  overlay.addEventListener('click', playVideo);
  trigger.addEventListener('click', playVideo);
  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
