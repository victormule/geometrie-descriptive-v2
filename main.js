// src/main.js — Bootstrap (script classique, pas de module)
(function() {
  const loading   = document.getElementById('loading');
  const loadingBar = document.getElementById('loading-bar');

  const overlay = new TextOverlay(document.getElementById('text-overlay'));

  const scene = new BoxScene({
    canvas: document.getElementById('three-canvas'),
    onProgress: (pct) => {
      loadingBar.style.width = pct + '%';
    },
    onReady: () => {
      loading.style.opacity = '0';
      setTimeout(() => { loading.style.display = 'none'; }, 900);
      overlay.init();
    },
    onOpenComplete: () => {
      overlay.fadeOut();
      setTimeout(loadPaperModel, 800);
    }
  });

  function loadPaperModel() {
    document.getElementById('paper-model-container').style.display = 'block';
    const s = document.createElement('script');
    s.src = 'src/PaperModel.js';
    document.body.appendChild(s);
  }
})();
