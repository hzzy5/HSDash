/*Spezifische View-Klasse, die für die Darstellung der Leben zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 

export class LifesRenderer{

    constructor(container, ticker) {
        //Refrenz auf den Conatainer und Ticker, der in der PIXI.app liegt.
        this.world = container;
        this.ticker = ticker;
    }

    // Methode, um das Leben-Sprite zu erstellen, falls man Leben wieder einsammeln kann
    createLifeSprite(x, y) {
        const sprite = PIXI.Sprite.from("life");
    
        // Position
        sprite.x = x;
        sprite.y = y;

        sprite.anchor.set(0.5);      // Zentriert die Münze
        sprite.scale.set(2);      // Macht die Münze kleiner 
        sprite.zIndex = 900;         // Münze über Player und über Plattform

        this.world.addChild(sprite);
        return sprite;
    }

    // Kurze Textanzeige, z.B. "+1" oder "-1", wenn ein Leben gesammelt wird oder verloren wird – fliegt nach oben
    showFloatingText(msg, x, y) {
        const t = new PIXI.Text(msg, {
            fill: 0xff0000,
            fontSize: 32,
            fontWeight: "bold",
            fontFamily: "Press Start 2P"
        });

        t.x = x;
        t.y = y;
        t.zIndex = 1000;
        this.world.addChild(t);

        let life = 30; // ca. 30 Frames

        const update = () => {
            t.y -= 1;        // nach oben fliegen
            t.alpha -= 0.03; // langsam ausblenden
            life--;

            if (life <= 0) {
                this.ticker.remove(update);    // aus dem Ticker entfernen
                this.world.removeChild(t);
                t.destroy();
            }
        };

        this.ticker.add(update);
    }
    
}