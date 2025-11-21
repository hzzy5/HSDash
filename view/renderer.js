let app;
let playerGraphic;
let currentPlayer = null;
let container = null;
// Asset map for parallax layers (keys -> file paths)
const ASSETS = {
  background: 'assets/11_background.png',
  clouds: 'assets/08_clouds.png',
  distantClouds: 'assets/10_distant_clouds.png',
  hugeClouds: 'assets/07_huge_clouds.png',
  hill2: 'assets/06_hill2.png',
  hill1: 'assets/05_hill1.png',
  trees: 'assets/03_distant_trees.png',
  bushes: 'assets/04_bushes.png',
  groundTile: 'assets/01_ground.png'
};
// map of loaded HTMLImageElements by key
const IMAGES = {};

function initRenderer() {
  // Container im DOM (wird in index.html eingefügt)
  container = document.getElementById('game-container') || document.body;
  // Pixi-App erstellen und an Container binden
  app = new PIXI.Application({
    width: container.clientWidth,
    height: container.clientHeight,
    backgroundColor: 0x87ceeb, // Sky color fallback; ensures no black areas
    antialias: true,
    autoDensity: true, // stellt sicher, dass Canvas-DPI mit devicePixelRatio skaliert
    resizeTo: container // Automatisch an Container-Größe anpassen
  });

  // Allow ordering children by zIndex so background layers can be placed behind gameplay
  try { app.stage.sortableChildren = true; } catch (e) { }

  // Das Canvas der App in den Container einfügen
  container.appendChild(app.view);

  // Expose app to the window for debugging / console access
  try { window.app = app; } catch (e) { /* ignore if not allowed */ }

  // Parallax assets will provide background and ground visuals

  // Lade Parallax-Assets und erstelle die Ebenen (werden noch nicht animiert)
  loadAssets().then(() => {
    try {
      // Erstelle Ebenen mit ähnlichen Größen wie im Beispiel-Branch
      const w = app.screen.width;
      const bg = createTilingSprite('background', w, 300);
      bg.y = 0;

      const clouds = createTilingSprite('clouds', w, 300);

      const hill2 = createTilingSprite('hill2', w, 280);

      const hill1 = createTilingSprite('hill1', w, 180);

      const trees = createTilingSprite('trees', w, 100);

      const bushes = createTilingSprite('bushes', w, 100);

      const groundTile = createTilingSprite('groundTile', w, 100);

      // expose layers for possible later use
      app.parallaxLayers = { bg, clouds, hill2, hill1, trees, bushes, groundTile };

      // ensure ground tile is tall enough to cover bottom area visually
      try {
        const h = app.screen.height;
        const groundHeight = Math.max(64, Math.round(h * 0.14));
        if (app.parallaxLayers.groundTile) {
          app.parallaxLayers.groundTile.height = groundHeight;
          app.parallaxLayers.groundTile.y = Math.round(h - app.parallaxLayers.groundTile.height);
        }
      } catch (e) {
        // ignore
      }

      // Position layers relative to bottom so they appear in correct places
      positionParallaxLayers(app.parallaxLayers);

      // Debug info about textures
      try {
        for (const k in app.parallaxLayers) {
          const layer = app.parallaxLayers[k];
          if (!layer) continue;
          console.log('layer', k, 'tex size', layer.texture.width, layer.texture.height, 'pos', layer.y, 'size', layer.width, layer.height);
        }
      } catch (e) {
        console.warn('parallax debug log failed', e);
      }
      console.log('parallax layers created', Object.keys(app.parallaxLayers));
    } catch (e) {
      console.warn('Parallax setup failed', e);
    }
  }).catch((err) => console.warn('Asset load failed', err));

  // Bei Resize: passe Parallax-Layer-Größen / Positionen an (falls bereits erstellt)
  window.addEventListener('resize', () => {
    if (app.parallaxLayers) {
      const w = app.screen.width;
      const groundHeight = Math.max(32, Math.round(app.screen.height * 0.12));
      // update widths and keep previously chosen heights
      for (const k in app.parallaxLayers) {
        const layer = app.parallaxLayers[k];
        if (!layer) continue;
        layer.width = w;
      }
      // reposition layers with the same offsets as initial setup
      try {
        app.parallaxLayers.bg.y = 0;
        app.parallaxLayers.clouds.y = -150;
        app.parallaxLayers.hill2.y = -450;
        app.parallaxLayers.hill1.y = -400;
        app.parallaxLayers.trees.y = -450;
        app.parallaxLayers.bushes.y = -410;
        app.parallaxLayers.groundTile.y = app.screen.height - groundHeight - 20;
      } catch (e) {
        // ignore if some layers missing
      }
    }
    if (currentPlayer && playerGraphic) {
      // Rekreiere Player-Grafik mit aktuellen Modellgrößen
      playerGraphic.clear();
      playerGraphic.beginFill(0xff0000);
      playerGraphic.drawRect(0, 0, currentPlayer.width, currentPlayer.height);
      playerGraphic.endFill();
      renderPlayer(currentPlayer);
    }
  });
}

// (previous green ground removed) parallax groundTile will represent the ground visually

// Load assets (returns a Promise) — useful before creating parallax tiling sprites
function loadAssets() {
  // Preload images using HTMLImageElement to avoid relying on PIXI.Loader
  const entries = Object.entries(ASSETS);
  const loadImage = ([key, src]) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      IMAGES[key] = img;
      resolve([key, img]);
    };
    img.onerror = (e) => reject(new Error('Failed to load ' + src));
    img.src = src;
  });
  return Promise.all(entries.map(loadImage));
}

// Create a TilingSprite for parallax layers (requires assets loaded or available via PIXI.Texture.from)
function createTilingSprite(name, width = app.screen.width, height = 200) {
  let tex;
  const img = IMAGES[name];
  if (img) {
    // create texture directly from loaded HTMLImageElement to get correct size
    try {
      const base = new PIXI.BaseTexture(img);
      tex = new PIXI.Texture(base);
    } catch (e) {
      console.warn('createTilingSprite: failed to create texture from image for', name, e);
      tex = PIXI.Texture.WHITE;
    }
  } else {
    try {
      tex = PIXI.Texture.from(ASSETS[name] || name);
    } catch (e) {
      console.warn('createTilingSprite: texture not found for', name);
      tex = PIXI.Texture.WHITE;
    }
  }
  const tiling = new PIXI.TilingSprite(tex, width, height);
  // If we preloaded the HTMLImage, use its natural size to compute a sensible tileScale
  if (img) {
    // scale texture so one repetition covers the tiling sprite dimensions
    const desiredW = width;
    const desiredH = height || img.naturalHeight || tiling.height;
    const scaleX = desiredW / (img.naturalWidth || desiredW);
    const scaleY = desiredH / (img.naturalHeight || desiredH);
    try { tiling.tileScale.set(scaleX, scaleY); } catch (e) { }
    tiling.width = desiredW;
    tiling.height = desiredH;
  }

  // set default zIndex for known layer names so they render behind gameplay
  const zMap = {
    background: -1000,
    clouds: -800,
    hill2: -600,
    hill1: -500,
    trees: -400,
    bushes: -300,
    groundTile: -100
  };
  if (name && zMap[name] !== undefined) tiling.zIndex = zMap[name];
  app.stage.addChild(tiling);
  return tiling;
}

// Position parallax layers in a sensible stacked order relative to bottom of screen
function positionParallaxLayers(layers) {
  if (!layers) return;
  const h = app.screen.height;
  const groundHeight = Math.max(32, Math.round(h * 0.12));
  try {
    // background fills top
    if (layers.bg) layers.bg.y = 0;
    // clouds near top but not at very top
    if (layers.clouds) layers.clouds.y = Math.round(h * 0.05);
    // hills positioned above ground, larger offset
    if (layers.hill2) layers.hill2.y = Math.round(h - groundHeight - layers.hill2.height - 140);
    if (layers.hill1) layers.hill1.y = Math.round(h - groundHeight - layers.hill1.height - 100);
    // trees and bushes closer to ground
    if (layers.trees) layers.trees.y = Math.round(h - groundHeight - layers.trees.height - 60);
    if (layers.bushes) layers.bushes.y = Math.round(h - groundHeight - layers.bushes.height - 30);
    // ground tile sits at the bottom edge
    if (layers.groundTile) layers.groundTile.y = Math.round(h - layers.groundTile.height);
  } catch (e) {
    console.warn('positionParallaxLayers failed', e);
  }
}

function createPlayerSprite(player) {
  currentPlayer = player;
  // Einfaches rotes Rechteck, Größe kommt vom Model (Model ist nun responsive)
  playerGraphic = new PIXI.Graphics();
  playerGraphic.beginFill(0xff0000);
  playerGraphic.drawRect(0, 0, player.width, player.height);
  playerGraphic.endFill();
  // make sure player is drawn above parallax layers
  try { playerGraphic.zIndex = 1000; } catch (e) {}
  app.stage.addChild(playerGraphic);
  renderPlayer(player);
}

function createPlatform(x, y, width, height, color = 0x8b4513) {
  const gfx = new PIXI.Graphics();
  gfx.beginFill(color);
  gfx.drawRect(0, 0, width, height);
  gfx.endFill();
  gfx.x = x;
  gfx.y = y;
  // ensure platforms render above background layers
  try { gfx.zIndex = 500; } catch (e) {}
  app.stage.addChild(gfx);
  return { x, y, width, height };
}

function renderPlayer(player) {
  currentPlayer = player;
  if (!playerGraphic) return;
  playerGraphic.x = player.x;
  playerGraphic.y = player.y;
}

function startGameLoop(updateOrPlayer) {
  app.ticker.add((delta) => {
    const dt = delta / 60;
    if (typeof updateOrPlayer === 'function') {
      const player = updateOrPlayer(dt);
      if (player) renderPlayer(player);
    } else if (updateOrPlayer) {
      renderPlayer(updateOrPlayer);
    }
  });
}

export { initRenderer, loadAssets, createTilingSprite, createPlayerSprite, startGameLoop, createPlatform };