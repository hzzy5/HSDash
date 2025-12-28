/*Spezifische View-Klasse, die für die Darstellung der Stacheln zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class SpikesRenderer{
    constructor(container, ticker) {
        //Refrenz auf den Conatainer und Ticker, der in der PIXI.app liegt.
        this.world = container;
        this.ticker = ticker;
    }

    // Methode, um das Leben-Sprite zu erstellen, falls man Leben wieder einsammeln kann
    createSpikeSprite(x, y) {
        const sprite = PIXI.Sprite.from("spike");
    
        // Position
        sprite.x = x;
        sprite.y = y + 20;

        sprite.anchor.set(0.5);      // Zentriert die Münze
        sprite.scale.set(0.3);      // Macht die Münze kleiner 
        sprite.zIndex = 900;         // Münze über Player und über Plattform


        this.world.addChild(sprite);
        return sprite;
    }
}
