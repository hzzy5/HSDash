let app;
let playerGraphic;
let ground;
let currentPlayer = null;
let container = null;

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

  // Ground initial zeichnen
  drawGround();

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

export { initRenderer, createPlayerSprite, startGameLoop, createPlatform };