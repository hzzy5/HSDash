import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien
//weitere Importe aus den Moduldateien
import { Controller } from "./controller/controller.js";

let app;
let player;
let barrier;
let speed = 10;

window.onload = async function() {
    let controller = new Controller();
    controller.init();
    console.log(window.innerHeight +","+ window.innerWidth);

    //keyboard movement mit eventlisteners
    // window.addEventListener("keydown", keyDown); //gedrückt
    // window.addEventListener("keyup", keyUp); //losgelassen

};


// function keyDown(e) {
//     console.log(e.keyCode); //40
// }

// function keyUp(e) {
//     console.log(e.keyCode); //38
// }





/*
//W 
if (keys["87"]) {
    player.y -=5
}

//A 
if (keys["65"]) {
    player.x -=5
}

//S 
if (keys["83"]) {
    player.y +=5
}

//D
if (keys["68"]) {
    player.x +=5
}

*/ 


// })(); //end async

//Hier muss eigentlich der ganze code weg. Hier wird nur der Gamecontroller initialsiert und die gameloop gestartet
//Alle Funktionen gehören in den gamecontroller.
// Spieler erstellen
//let player = new Player(100, 100);
//createPlayerSprite(player);
//startGameLoop(player);

// Test-Münze
//let testCoin = new coin(300, 200);
//createCoinSprite(testCoin);
