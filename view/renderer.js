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
  playerGraphic.drawRect(0, 0, player.width, player.height);
  playerGraphic.endFill();
  app.stage.addChild(playerGraphic);
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
  // Spielerposition aktualisieren
  playerGraphic.x = player.x;
  playerGraphic.y = player.y;
}

function startGameLoop(updateOrPlayer) {
  // updateOrPlayer kann entweder eine Update-Funktion (dt) => player
  // oder direkt das Player-Objekt sein (älteres Verhalten).
  app.ticker.add((delta) => {     // von PIXI -> wie requestAnimationFrame()
    const dt = delta / 60; // grobe Sekunden seit letztem Frame
    if (typeof updateOrPlayer === 'function') {
      const player = updateOrPlayer(dt); // Controller aktualisiert Model und liefert Player zurück
      if (player) renderPlayer(player);
    } else if (updateOrPlayer) {
      // Einfaches Rendering des übergebenen Player-Objekts (Controller aktualisiert intern)
      renderPlayer(updateOrPlayer);
    }
  });
}

export { initRenderer, createPlayerSprite, startGameLoop, createPlatform }; //modernes java script -> macht funktionen öfffentlich damit andere dateien sie importieren können