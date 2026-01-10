/*Spezifische View-Klasse, die für die Darstellung der Gumbas zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class GumbasRenderer{
    constructor(container, ticker) {
        //Refrenz auf den Conatainer und Ticker, der in der PIXI.app liegt.
        this.world = container;
        this.ticker = ticker;
    }

    // Methode, um das Gumba-Sprite zu erstellen
    createGumbaSprite(x, y) {
        //const sprite = PIXI.Sprite.from("gumba");
         const sheet = PIXI.Assets.get('gumba').data.animations;
         const sprite = PIXI.AnimatedSprite.fromFrames(sheet["minidahm_frame"]); //name der frames
         sprite.animationSpeed = 1 / 10; 
         sprite.play();
    
        // Position
        sprite.x = x;
        sprite.y = y-7;

        sprite.anchor.set(0.5);      // Zentriert die Gumbas
        sprite.scale.set(1);      // Gumba jetzt gerade einfach in der Größe lassen wie das Bild
        sprite.zIndex = 900;         // Gumba über Player und über Plattform


        this.world.addChild(sprite);
        return sprite;
    }

    updateSprite(sprite, gumbaX, gumbaY, gumbaDirection){
        if (sprite) {
            sprite.x = gumbaX+32;
            sprite.y = gumbaY -7;
            sprite.scale.x = 1 * gumbaDirection; // Spiegeln, hier 0.06 zu 1 geändert. Weil Skalierung derzeit 1 ist 
        } 
    }
}