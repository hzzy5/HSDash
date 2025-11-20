import { initRenderer, createPlayerSprite, startGameLoop, createCoinSprite } from "./view/renderer.js";
import { Player } from "./model/player.js";
import { coin } from "./model/coin.js";

initRenderer();

// Spieler erstellen
let player = new Player(100, 100);
createPlayerSprite(player);
startGameLoop(player);

// Test-Münze
let testCoin = new coin(300, 200);
createCoinSprite(testCoin);
