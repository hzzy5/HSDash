let app;
let playerGraphic;
let ground;
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

function initRenderer() {
  // Container im DOM (wird in index.html eingefügt)
  container = document.getElementById('game-container') || document.body;
  // Pixi-App erstellen und an Container binden
  app = new PIXI.Application({
    width: container.clientWidth,
    height: container.clientHeight,
    backgroundColor: 0x87ceeb, // Hellblau
    antialias: true,
    autoDensity: true, // stellt sicher, dass Canvas-DPI mit devicePixelRatio skaliert
    resizeTo: container // Automatisch an Container-Größe anpassen
  });

  // Das Canvas der App in den Container einfügen
  container.appendChild(app.view);

  // Expose app to the window for debugging / console access
  try { window.app = app; } catch (e) { /* ignore if not allowed */ }

  // Ground initial zeichnen
  drawGround();

  // Lade Parallax-Assets und erstelle die Ebenen (werden noch nicht animiert)
  loadAssets().then(() => {
    try {
      // Erstelle Ebenen mit ähnlichen Größen wie im Beispiel-Branch
      const w = app.screen.width;
      const bg = createTilingSprite('background', w, 300);
      bg.y = 0;

      const clouds = createTilingSprite('clouds', w, 300);
      clouds.y = -150;

      const hill2 = createTilingSprite('hill2', w, 280);
      hill2.y = -450;

      const hill1 = createTilingSprite('hill1', w, 180);
      hill1.y = -400;

      const trees = createTilingSprite('trees', w, 100);
      trees.y = -450;

      const bushes = createTilingSprite('bushes', w, 100);
      bushes.y = -410;

      const groundTile = createTilingSprite('groundTile', w, 100);
      groundTile.y = app.screen.height - Math.max(32, Math.round(app.screen.height * 0.12)) - 20;

      // expose layers for possible later use
      app.parallaxLayers = { bg, clouds, hill2, hill1, trees, bushes, groundTile };
    } catch (e) {
      console.warn('Parallax setup failed', e);
    }
  }).catch((err) => console.warn('Asset load failed', err));

  // Bei Resize Ground neu zeichnen und ggf. Player-Größe anpassen
  window.addEventListener('resize', () => {
    drawGround();
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

function drawGround() {
  const groundHeight = Math.max(32, Math.round(app.screen.height * 0.12));
  if (!ground) {
    ground = new PIXI.Graphics();
    app.stage.addChild(ground);
  }
  ground.clear();
  ground.beginFill(0x2d5a27);
  ground.drawRect(0, app.screen.height - groundHeight, app.screen.width, groundHeight);
  ground.endFill();
}

// Load assets (returns a Promise) — useful before creating parallax tiling sprites
function loadAssets() {
  // Preload images using HTMLImageElement to avoid relying on PIXI.Loader
  const paths = Object.values(ASSETS);
  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = (e) => reject(new Error('Failed to load ' + src));
    img.src = src;
  });
  return Promise.all(paths.map(loadImage));
}

// Create a TilingSprite for parallax layers (requires assets loaded or available via PIXI.Texture.from)
function createTilingSprite(name, width = app.screen.width, height = 200) {
  let tex;
  try {
    tex = PIXI.Texture.from(ASSETS[name] || name);
  } catch (e) {
    console.warn('createTilingSprite: texture not found for', name);
    tex = PIXI.Texture.WHITE;
  }
  const tiling = new PIXI.TilingSprite(tex, width, height);
  app.stage.addChild(tiling);
  return tiling;
}

function createPlayerSprite(player) {
  currentPlayer = player;
  // Einfaches rotes Rechteck, Größe kommt vom Model (Model ist nun responsive)
  playerGraphic = new PIXI.Graphics();
  playerGraphic.beginFill(0xff0000);
  playerGraphic.drawRect(0, 0, player.width, player.height);
  playerGraphic.endFill();
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