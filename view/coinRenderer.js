/*Spezifische View-Klasse, die für die Darstellung der Münzen zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class CoinRenderer {

    constructor(mainView) {
        //Regerenz auf die view, damit dieselbe PIXI.app genutzt wird.
        this.view = mainView;
    }

    // Methode, um das Münz-Sprite zu erstellen
    createCoinSprite(x, y) {
    const sprite = PIXI.Sprite.from("coin");

      // Position
      sprite.x = x;
      sprite.y = y;

      sprite.anchor.set(0.5);      // Zentriert die Münze
      sprite.scale.set(0.15);      // Macht die Münze kleiner 
      sprite.zIndex = 900;         // Münze über Player und über Plattform

      this.view.app.stage.addChild(sprite);
      return sprite;
    }


    // Kurze Textanzeige, z.B. "+1", wenn ein Coin gesammelt wird – fliegt nach oben
    showFloatingText(msg, x, y) {
        const t = new PIXI.Text(msg, {
            fill: 0xffff00,
            fontSize: 32,
            fontWeight: "bold",
            fontFamily: "Press Start 2P"
        });

        t.x = x;
        t.y = y;
        t.zIndex = 1000;
        this.view.app.stage.addChild(t);

        let life = 30; // ca. 30 Frames
        const ticker = this.view.app.ticker;

        const update = () => {
            t.y -= 1;        // nach oben fliegen
            t.alpha -= 0.03; // langsam ausblenden
            life--;

            if (life <= 0) {
                ticker.remove(update);    // aus dem Ticker entfernen
                this.view.app.stage.removeChild(t);
                t.destroy();
            }
        };

        ticker.add(update);
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

        this.view.app.stage.addChild(this.coinHud);
    }

    updateCoinHud(collected, total) {
        if (this.coinHud) {
            this.coinHud.text = `Coins: ${collected} / ${total}`;
        }
    }
    


} //end class