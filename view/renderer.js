let app;
let playerGraphic;

function initRenderer(width = "100vw", height = "100vh") {
  // Pixi-App erstellen
  app = new PIXI.Application({
    width,
    height,
    backgroundColor: 0x87ceeb,
  });
  
  // Das Canvas der App in die Seite einfügen
  document.body.appendChild(app.view);  // In Pixi ist alles wie eine Bühne aufgebaut und man fügt elemente übereinander als Kinder ein
  // --> Ganz hinten ist die Wurzel von allen Elementen (hier der body vom document)
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