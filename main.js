import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien
//weitere Importe aus den Moduldateien
import { Controller } from "./controller/controller.js";
import { LevelLoader } from "./controller/levelloader.js";

window.onload = async function() {
    let controller = new Controller();
    await controller.initController(); //warten bis alles initialisiert ist, bevor man die app startet.

    //Damit gleiche Renderer- & Collision - Instanzen genutzt werden
    let levelloader = new LevelLoader(controller.renderer, controller.playerRenderer, 
                                      controller.sceneRenderer,
                                      controller.collision,
                                      controller.coinRenderer, controller.coins, controller.coins5,
                                      controller.lifesRenderer, controller.lifes, 
                                      controller.spikeRenderer, controller.spikes, 
                                      controller.gumbaRenderer, controller.gumbas,
                                      controller.goalRenderer, controller.goal,); 

    await levelloader.loadLevel(levelloader.levels[0]);
    

    /////////////////////////hier!!!!

    
    //controller.renderer.startGameLoop((dt) => controller.gameLoop(dt));   
    
};




//_____________________________________________________________________________
/*
import { initRenderer, createPlayerSprite, startGameLoop, createPlatform } from "./view/renderer.js";
import { Player } from "./model/player.js";
import { initController, updatePlayer, addCollider } from "./controller/controller.js";

// Funktion aus renderer.js aufrufen, um die PixiJS-Anwendung zu initialisieren
initRenderer();

// Spieler erstellen (100px ist die Bodenhöhe)
const startY = window.innerHeight - 180; // 20px ist die Spielerhöhe
const player2 = new Player(50, startY);

//Funktion aus renderer.js aufrufen, um die Spieler-Graphik zu erstellen (Hier nur Quadrat als Platzhalter)
createPlayerSprite(player2);
// Controller initialisieren (Input etc.)
initController(player2);
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
*/
