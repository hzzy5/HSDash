/*Spezifische View-Klasse, die für die Darstellung der Stacheln zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class SpikesRenderer{
    constructor(container, ticker) {
        //Refrenz auf den Conatainer und Ticker, der in der PIXI.app liegt.
        this.world = container;
        this.ticker = ticker;
    }

    // Methode, um das Stacheln-Sprite zu erstellen
    createSpikeSprite(x, y) {
        const sprite = PIXI.Sprite.from("spike");
    
        // Position
        sprite.x = x;
        sprite.y = y - 2;

        sprite.anchor.set(0.5);      // Zentriert die Stacheln
        sprite.scale.set(0.3);      // Macht die Stacheln kleiner 
        sprite.zIndex = 900;         // Stacheln über Player und über Plattform


        this.world.addChild(sprite);
        return sprite;
    }

    // Methode, um das Stacheln-Sprite zu erstellen
    createUpSpikeSprite(x, y) {
        const sprite = PIXI.Sprite.from("spikeoben");
    
        // Position
        sprite.x = x;
        sprite.y = y + 20;

        sprite.anchor.set(0.5);      // Zentriert die Stacheln
        sprite.scale.set(0.3);      // Macht die Stacheln kleiner 
        sprite.zIndex = 900;         // Stacheln über Player und über Plattform


        this.world.addChild(sprite);
        return sprite;
    }
}
