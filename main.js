import { initRenderer, createPlayerSprite, startGameLoop, renderPlatforms, renderGround } from "./view/renderer.js";
import { Player } from "./model/player.js";
import { PlatformManager, Ground } from "./model/platform.js";
import { initController, updatePlayer } from "./controller/controller.js";

// Funktion aus renderer.js aufrufen, um die PixiJS-Anwendung zu initialisieren
initRenderer();

// Ground erstellen (100px Höhe am unteren Bildschirmrand)
const ground = new Ground(0, window.innerHeight - 100, 10000, 100);

// Spieler erstellen (100px ist die Bodenhöhe)
const startY = window.innerHeight - 180; // 20px ist die Spielerhöhe
const player = new Player(50, startY);

// PlatformManager erstellen und Plattformen hinzufügen
const platformManager = new PlatformManager();
platformManager.addPlatform(220, window.innerHeight - 150, 160, 10);
platformManager.addPlatform(600, window.innerHeight - 150, 160, 10);
platformManager.addPlatform(1195, window.innerHeight - 150, 160, 10);
platformManager.addPlatform(1800, window.innerHeight - 150, 160, 10);

//Funktion aus renderer.js aufrufen, um die Spieler-Graphik zu erstellen (Hier nur Quadrat als Platzhalter)
createPlayerSprite(player);

// Ground rendern
renderGround(ground);

// Plattformen rendern
renderPlatforms(platformManager);

// Controller initialisieren (Input etc.)
initController(player, platformManager, ground);

// Game-Loop starten: übergebe die Controller-Update-Funktion und PlatformManager an den Renderer
startGameLoop(updatePlayer, platformManager);
