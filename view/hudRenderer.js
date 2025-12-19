/*Spezifische View-Klasse, die für die Darstellung des Head-Up-Displays zuständig ist, z.B Münzen, Leben, ... .*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

export class HudRenderer {
    constructor(container, screen) {
        //Refrenz auf den Conatainer und screen, der in der PIXI.app liegt.
        this.hud = container;
        this.screen = screen; //für die responsive Platzierung 

    }

    // HUD: Coin-Anzeige oben rechts
    createCoinHud(totalCoins) {
        this.coinHud = new PIXI.Text(`Coins: 0 / ${totalCoins}`, {
            fontFamily: "Press Start 2P",
            fontSize: 22,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4
        });

        this.coinHud.x = this.screen.width - 300;
        this.coinHud.y = 20;
        this.coinHud.zIndex = 9999;

        this.hud.addChild(this.coinHud);
    }

    updateCoinHud(collected, total) {
        if (this.coinHud) {
            this.coinHud.text = `Coins: ${collected} / ${total}`;
        }
    }

} //end class


    