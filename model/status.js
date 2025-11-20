import { coin } from "./coin.js";

export class status {
    constructor() {
        // Liste aller Coins im Spiel
         this.coin = [
            new coin(200, 200),
            new coin(400, 250),
            new coin(600, 300),
            new coin(800, 200),
            new coin(1000, 150)
        ];

        // Wie viele Coins der Spieler gesammelt hat
        this.collectedCoins = 0;
    }
}
