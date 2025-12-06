import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien
//weitere Importe aus den Moduldateien
import { Controller } from "./controller/controller.js";

window.onload = async function() {
    let controller = new Controller();
    await controller.initController(); //warten bis alles initialisiert ist, bevor man die app startet.
    controller.renderer.startGameLoop((dt) => controller.gameLoop(dt), controller.player, controller.playerSprite);

    // //Test
    // console.log(window.innerHeight +","+ window.innerWidth);
    // console.log(controller.collision.collision({x:0,y:0,width:50,height:50},{x:25,y:25,width:50,height:50})); //Collision Funktion funktioniert
    // console.log("Player Position:", controller.player.x, controller.player.y);

    // console.log("Colliders:", controller.collision.getAllColliders());
    // console.log("Before move:", controller.player.x, controller.player.y);
 
    // console.log("After move:", controller.player.x, controller.player.y);
    console.log(controller.playerSprite.height);
    console.log(controller.playerSprite.width);
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
