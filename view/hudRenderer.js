/*Spezifische View-Klasse, die für die Darstellung des Head-Up-Displays zuständig ist, z.B Münzen, Leben, ... .*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

export class HudRenderer {
    constructor(container) {
        //Refrenz auf den Conatainer, der in der PIXI.app liegt.
        this.hud = container;
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

        this.coinHud.x = window.innerWidth - 300;
        this.coinHud.y = 20;
        this.coinHud.zIndex = 9999;

        this.hud.addChild(this.coinHud);
    }

    updateCoinHud(collected, total) {
        if (this.coinHud) {
            this.coinHud.text = `Coins: ${collected} / ${total}`;
        }
    }

    // HUD: Leben-Anzeige unter Coin-Anzeige
    createLifeHud(totalLifes) {
        this.lifeHud = new PIXI.Text(`${totalLifes} Leben`, {
            fontFamily: "Press Start 2P",
            fontSize: 22,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4
        });

        this.lifeHud.x = window.innerWidth - 300;
        this.lifeHud.y = 50;
        this.lifeHud.zIndex = 9999;

        this.hud.addChild(this.lifeHud);
    }

    updateLifeHud(total) {
        if (this.lifeHud) {
            this.lifeHud.text = `${total} Leben`;
        }
    }

} //end class


    