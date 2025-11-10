let app;
let playerGraphic;
let ground;

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

  // Grünen Boden erstellen
  ground = new PIXI.Graphics();
  ground.beginFill(0x2d5a27); // Dunkelgrüne Farbe
  ground.drawRect(0, app.screen.height - 100, app.screen.width, 100);
  ground.endFill();
  app.stage.addChild(ground);

  // Event Listener für Fenstergrößenänderungen
  window.addEventListener('resize', () => {
    ground.clear();
    ground.beginFill(0x2d5a27);
    ground.drawRect(0, app.screen.height - 100, app.screen.width, 100);
    ground.endFill();
  });
}


function createPlayerSprite(player) {
  // Einfaches rotes Quadrat als Platzhalter
  playerGraphic = new PIXI.Graphics();
  playerGraphic.beginFill(0xff0000);
  playerGraphic.drawRect(0, 0, 20, 20);
  playerGraphic.endFill();
  app.stage.addChild(playerGraphic);
}

function renderPlayer(player) {
  // Spielerposition aktualisieren
  playerGraphic.x = player.x;
  playerGraphic.y = player.y;
}

function startGameLoop(player) {
  app.ticker.add(() => {     // von PIXI -> wie requestAnimationFrame() vorher (ticker ruft bei jedem frame 60fps 60 mal pro sekunde die funktion auf)
    renderPlayer(player);
  });
}

export { initRenderer, createPlayerSprite, startGameLoop }; //modernes java script -> macht funktionen öfffentlich damit andere dateien sie importieren können