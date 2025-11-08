import { initRenderer, createPlayerSprite, startGameLoop } from "./view/renderer.js";
import { Player } from "./model/player.js";

const player = new Player("Lasse", 50, 50);

initRenderer();
createPlayerSprite(player);
startGameLoop(player);
