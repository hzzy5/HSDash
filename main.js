import { initRenderer, createPlayerSprite, startGameLoop, createPlatform } from "./view/renderer.js";
import { Player } from "./model/player.js";
import { initController, updatePlayer, addCollider } from "./controller/controller.js";

// Funktion aus renderer.js aufrufen, um die PixiJS-Anwendung zu initialisieren
initRenderer();

// Spieler erstellen (100px ist die Bodenhöhe)
const startY = window.innerHeight - 180; // 20px ist die Spielerhöhe
const player = new Player(50, startY);

//Funktion aus renderer.js aufrufen, um die Spieler-Graphik zu erstellen (Hier nur Quadrat als Platzhalter)
createPlayerSprite(player);
// Controller initialisieren (Input etc.)
initController(player);
// Beispiel-Plattformen hinzufügen (sichtbar und kollisionsfähig)
const plat = { x: 220, y: window.innerHeight - 150, width: 160, height: 10 };
addCollider(plat);
createPlatform(plat.x, plat.y, plat.width, plat.height);

const plat2 = { x: 600, y: window.innerHeight - 150, width: 160, height: 10 };
addCollider(plat2);
createPlatform(plat2.x, plat2.y, plat2.width, plat2.height);

const plat3 = { x: 1195, y: window.innerHeight - 150, width: 160, height: 10 };
addCollider(plat3);
createPlatform(plat3.x, plat3.y, plat3.width, plat3.height);
// Game-Loop starten: übergebe die Controller-Update-Funktion an den Renderer
startGameLoop(updatePlayer);
