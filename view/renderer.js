let app;
let playerGraphic;
let ground;
let platformGraphics = []; // Array für alle Plattform-Grafiken
let cameraX = 0; // Kamera-Offset für horizontales Scrolling


let backgroundSprite; // Hintergrund-Sprite
let distantClouds2Sprite; // 10_distant_clouds - am weitesten entfernt
let distantClouds1Sprite; // 09_distant_clouds1 - mittel entfernt
let cloudsSprite; // 08_clouds
let hugeCloudsSprite; // 07_huge_clouds
let hill2Sprite; // 06_hill2
let hill1Sprite; // 05_hill1
let bushesSprite; // 04_bushes
let distantTreesSprite; // 03_distant_trees
let treesAndBushesSprite; // 02_trees_and_bushes
let groundLayerSprite; // 01_ground - Vordergrund
const BACKGROUND_PARALLAX_FACTOR = 0.5; // 0.5 = halb so schnell wie Spieler, 1.0 = gleiche Geschwindigkeit
const DISTANT_CLOUDS2_PARALLAX = 0.2; // Sehr langsam (weit entfernt)
const DISTANT_CLOUDS1_PARALLAX = 0.35; // Etwas schneller
const CLOUDS_PARALLAX = 0.6;
const HUGE_CLOUDS_PARALLAX = 0.7;
const HILL2_PARALLAX = 0.75;
const HILL1_PARALLAX = 0.85;
const BUSHES_PARALLAX = 0.95;
const DISTANT_TREES_PARALLAX = 0.98;
const TREES_AND_BUSHES_PARALLAX = 1.0; // Gleiche Geschwindigkeit wie Spieler
const GROUND_LAYER_PARALLAX = 1.0; // Gleiche Geschwindigkeit wie Spieler

function initRenderer() {
  // Pixi-App erstellen
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x87ceeb, // Hellblau (Fallback)
    antialias: true, // Kanten glätten -> sonst Linien gezackt
    resizeTo: window // Automatisch an Fenstergröße anpassen
  });
  
  // Das Canvas der App in die Seite einfügen
  document.body.appendChild(app.view); // app.view ist das Canvas-Element

  // Hintergrund erstellen (TilingSprite wiederholt das Bild automatisch)
  const bgTexture = PIXI.Texture.from('./assets/11_background.png');
  backgroundSprite = new PIXI.TilingSprite(
    bgTexture,
    app.screen.width * 3, // Breiter als Bildschirm für nahtloses Scrolling
    app.screen.height
  );
  backgroundSprite.x = 0;
  backgroundSprite.y = 0;
  app.stage.addChild(backgroundSprite);

  // Distant Clouds 2 (10_distant_clouds) - am weitesten entfernt
  const distantClouds2Texture = PIXI.Texture.from('./assets/10_distant_clouds.png');
  distantClouds2Sprite = new PIXI.TilingSprite(
    distantClouds2Texture,
    app.screen.width * 3,
    app.screen.height
  );
  distantClouds2Sprite.x = 0;
  distantClouds2Sprite.y = 0;
  app.stage.addChild(distantClouds2Sprite);

  // Distant Clouds 1 (09_distant_clouds1) - mittel entfernt
  const distantClouds1Texture = PIXI.Texture.from('./assets/09_distant_clouds1.png');
  distantClouds1Sprite = new PIXI.TilingSprite(
    distantClouds1Texture,
    app.screen.width * 3,
    app.screen.height
  );
  distantClouds1Sprite.x = 0;
  distantClouds1Sprite.y = 0;
  app.stage.addChild(distantClouds1Sprite);

  // Clouds (08_clouds)
  const cloudsTexture = PIXI.Texture.from('./assets/08_clouds.png');
  cloudsSprite = new PIXI.TilingSprite(
    cloudsTexture,
    app.screen.width * 3,
    app.screen.height
  );
  cloudsSprite.x = 0;
  cloudsSprite.y = 0;
  app.stage.addChild(cloudsSprite);

  // Huge Clouds (07_huge_clouds)
  const hugeCloudsTexture = PIXI.Texture.from('./assets/07_huge_clouds.png');
  hugeCloudsSprite = new PIXI.TilingSprite(
    hugeCloudsTexture,
    app.screen.width * 3,
    app.screen.height
  );
  hugeCloudsSprite.x = 0;
  hugeCloudsSprite.y = 0;
  app.stage.addChild(hugeCloudsSprite);

  // Hill 2 (06_hill2)
  const hill2Texture = PIXI.Texture.from('./assets/06_hill2.png');
  hill2Sprite = new PIXI.TilingSprite(
    hill2Texture,
    app.screen.width * 3,
    app.screen.height
  );
  hill2Sprite.x = 0;
  hill2Sprite.y = 0;
  app.stage.addChild(hill2Sprite);

  // Hill 1 (05_hill1)
  const hill1Texture = PIXI.Texture.from('./assets/05_hill1.png');
  hill1Sprite = new PIXI.TilingSprite(
    hill1Texture,
    app.screen.width * 3,
    app.screen.height
  );
  hill1Sprite.x = 0;
  hill1Sprite.y = 0;
  app.stage.addChild(hill1Sprite);

  // Bushes (04_bushes) - vorne, fast Spielergeschwindigkeit
  const bushesTexture = PIXI.Texture.from('./assets/04_bushes.png');
  bushesSprite = new PIXI.TilingSprite(
    bushesTexture,
    app.screen.width * 3,
    app.screen.height
  );
  bushesSprite.x = 0;
  bushesSprite.y = 0;
  app.stage.addChild(bushesSprite);

  // Distant Trees (03_distant_trees)
  const distantTreesTexture = PIXI.Texture.from('./assets/03_distant_trees.png');
  distantTreesSprite = new PIXI.TilingSprite(
    distantTreesTexture,
    app.screen.width * 3,
    app.screen.height
  );
  distantTreesSprite.x = 0;
  distantTreesSprite.y = 0;
  app.stage.addChild(distantTreesSprite);

  // Trees and Bushes (02_trees_and_bushes)
  const treesAndBushesTexture = PIXI.Texture.from('./assets/02_trees_and_bushes.png');
  treesAndBushesSprite = new PIXI.TilingSprite(
    treesAndBushesTexture,
    app.screen.width * 3,
    app.screen.height
  );
  treesAndBushesSprite.x = 0;
  treesAndBushesSprite.y = 0;
  app.stage.addChild(treesAndBushesSprite);

  // Ground Layer (01_ground) - Vordergrund, gleiche Geschwindigkeit wie Spieler
  const groundLayerTexture = PIXI.Texture.from('./assets/01_ground.png');
  groundLayerSprite = new PIXI.TilingSprite(
    groundLayerTexture,
    app.screen.width * 3,
    app.screen.height
  );
  groundLayerSprite.x = 0;
  groundLayerSprite.y = 0;
  app.stage.addChild(groundLayerSprite);

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

// Rendert den Boden aus dem Ground-Model
function renderGround(groundModel) {
  // Alten Boden entfernen falls vorhanden
  if (ground) {
    app.stage.removeChild(ground);
  }
  
  // Neuen Boden aus Model erstellen
  ground = new PIXI.Graphics();
  ground.beginFill(groundModel.color);
  ground.drawRect(0, 0, groundModel.width, groundModel.height);
  ground.endFill();
  ground.x = groundModel.x;
  ground.y = groundModel.y;
  app.stage.addChild(ground);
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

// Aktualisiert den Hintergrund mit Parallax-Effekt
function updateBackground() {
  // TilingSprite.tilePosition verschiebt die Textur -> erzeugt Scrolling-Effekt
  backgroundSprite.tilePosition.x = -cameraX * BACKGROUND_PARALLAX_FACTOR;
  distantClouds2Sprite.tilePosition.x = -cameraX * DISTANT_CLOUDS2_PARALLAX;
  distantClouds1Sprite.tilePosition.x = -cameraX * DISTANT_CLOUDS1_PARALLAX;
  cloudsSprite.tilePosition.x = -cameraX * CLOUDS_PARALLAX;
  hugeCloudsSprite.tilePosition.x = -cameraX * HUGE_CLOUDS_PARALLAX;
  hill2Sprite.tilePosition.x = -cameraX * HILL2_PARALLAX;
  hill1Sprite.tilePosition.x = -cameraX * HILL1_PARALLAX;
  bushesSprite.tilePosition.x = -cameraX * BUSHES_PARALLAX;
  distantTreesSprite.tilePosition.x = -cameraX * DISTANT_TREES_PARALLAX;
  treesAndBushesSprite.tilePosition.x = -cameraX * TREES_AND_BUSHES_PARALLAX;
  groundLayerSprite.tilePosition.x = -cameraX * GROUND_LAYER_PARALLAX;
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
      updateBackground(); // Hintergrund mit Parallax-Effekt aktualisieren
      renderPlayer(player); // Renderer rendert den Spieler
      updatePlatformPositions(platformManager); // Plattformen mit Kamera mitbewegen
      updateGroundPosition(); // Boden mit Kamera mitbewegen
    }
  });
}

export { initRenderer, createPlayerSprite, startGameLoop, renderPlatforms, renderGround }; //modernes java script -> macht funktionen öfffentlich damit andere dateien sie importieren können