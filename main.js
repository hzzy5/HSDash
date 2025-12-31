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
                                      controller.goalRenderer, controller.goal,
                                      controller.blockRenderer,); 

    await levelloader.loadLevel(levelloader.levels[0]);
    

    /////////////////////////hier!!!!

    
    //controller.renderer.startGameLoop((dt) => controller.gameLoop(dt));   
    
};
