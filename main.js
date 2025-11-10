import { initRenderer, createPlayerSprite, startGameLoop } from "./view/renderer.js";
import { Player } from "./model/player.js";
import { initController } from "./controller/controller.js";

// Funktion aus renderer.js aufrufen, um die PixiJS-Anwendung zu initialisieren
initRenderer();

// Spieler erstellen (100px ist die Bodenhöhe)
const startY = window.innerHeight - 120; // 20px ist die Spielerhöhe
const player = new Player(50, startY);

//Funktion aus renderer.js aufrufen, um die Spieler-Graphik zu erstellen (Hier nur Quadrat als Platzhalter)
createPlayerSprite(player);
//Funktion aus renderer.js aufrufen, um die Game-Loop zu starten
startGameLoop(player);
// Funktion aus controller.js aufrufen, um die Pixi mit der Tastatureingabe zu verbinden
initController(player);
