let app;
let playerGraphic;
let ground;
let platformGraphics = []; // Array für alle Plattform-Grafiken
let cameraX = 0; // Kamera-Offset für horizontales Scrolling

function initRenderer() {
  // Pixi-App erstellen
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x87ceeb, // Hellblau
    antialias: true, // Kanten glätten -> sonst Linien gezackt
    resizeTo: window // Automatisch an Fenstergröße anpassen
  });
  
  // Das Canvas der App in die Seite einfügen
  document.body.appendChild(app.view); // app.view ist das Canvas-Element

  // Grünen Boden erstellen (sehr breit für Scrolling)
  ground = new PIXI.Graphics();
  ground.beginFill(0x2d5a27); // Dunkelgrüne Farbe
  ground.drawRect(0, app.screen.height - 100, 10000, 100); // Sehr breiter Boden
  ground.endFill();
  app.stage.addChild(ground);

  // Event Listener für Fenstergrößenänderungen
  window.addEventListener('resize', () => {
    ground.clear();
    ground.beginFill(0x2d5a27);
    ground.drawRect(0, app.screen.height - 100, 10000, 100);
    ground.endFill();
  });
}


function createPlayerSprite(player) {
  // Spieler-Sprite aus Bild erstellen
  const texture = PIXI.Texture.from('./assets/player.png');
  playerGraphic = new PIXI.Sprite(texture);
  
  // Größe an Player-Model anpassen
  playerGraphic.width = player.width;
  playerGraphic.height = player.height;
  
  app.stage.addChild(playerGraphic);
}

// Rendert alle Plattformen aus dem PlatformManager
function renderPlatforms(platformManager) {
  // Alte Plattform-Grafiken entfernen
  platformGraphics.forEach(gfx => app.stage.removeChild(gfx));
  platformGraphics = [];

  // Neue Plattform-Grafiken erstellen
  const platforms = platformManager.getAllPlatforms();
  platforms.forEach(platform => {
    const gfx = new PIXI.Graphics();
    gfx.beginFill(platform.color);
    gfx.drawRect(0, 0, platform.width, platform.height);
    gfx.endFill();
    gfx.x = platform.x;
    gfx.y = platform.y;
    app.stage.addChild(gfx);
    platformGraphics.push(gfx);
  });
}

// Aktualisiert die Kamera basierend auf der Spielerposition
function updateCamera(player) {
  const screenCenterX = app.screen.width / 2;
  const playerCenterX = player.x + player.width / 2;
  
  // Wenn Spielermitte rechts von Bildschirmmitte ist, Kamera mitbewegen
  if (playerCenterX > screenCenterX) {
    cameraX = playerCenterX - screenCenterX;
  }
}

// Aktualisiert die Positionen aller Plattformen basierend auf dem Kamera-Offset
function updatePlatformPositions(platformManager) {
  const platforms = platformManager.getAllPlatforms();
  platformGraphics.forEach((gfx, index) => {
    const platform = platforms[index];
    gfx.x = platform.x - cameraX;
  });
}

// Aktualisiert die Boden-Position basierend auf dem Kamera-Offset
function updateGroundPosition() {
  ground.x = -cameraX;
}

function renderPlayer(player) {
  // Spielerposition aktualisieren (mit Kamera-Offset)
  playerGraphic.x = player.x - cameraX;
  playerGraphic.y = player.y;
}

function startGameLoop(updateFunction, platformManager) { //updateFunction kommt aus controller.js

  app.ticker.add((delta) => {     // von PIXI -> wie requestAnimationFrame()
    // delta -> zeit seit dem letzen Frame ind PIXI-einheiten (60 FPS -> delta=1)
    const dt = delta / 60; // grobe Sekunden seit letztem Frame 
    // ohne dt würde die geschwindigkeit von der FPS abhängen also je höher die FPS desto schneller der Spieler
    const player = updateFunction(dt); // Controller aktualisiert Model und liefert Player zurück
    if (player) {
      updateCamera(player); // Kamera aktualisieren
      renderPlayer(player); // Renderer rendert den Spieler
      updatePlatformPositions(platformManager); // Plattformen mit Kamera mitbewegen
      updateGroundPosition(); // Boden mit Kamera mitbewegen
    }
  });
}

export { initRenderer, createPlayerSprite, startGameLoop, renderPlatforms }; //modernes java script -> macht funktionen öfffentlich damit andere dateien sie importieren können