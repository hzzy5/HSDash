/*Spezifische View-Klasse, die für die Darstellung der Stacheln zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class TrainRenderer{
    constructor(container, ticker) {
        //Refrenz auf den Conatainer und Ticker, der in der PIXI.app liegt.
        this.world = container;
        this.ticker = ticker;
    }

    // Methode, um das Leben-Sprite zu erstellen, falls man Leben wieder einsammeln kann
    createTrainSprite(x, y) {
        const sprite = PIXI.Sprite.from("zug");
        //const sheet = PIXI.Assets.get('gumba').data.animations;
        //const sprite = PIXI.AnimatedSprite.fromFrames(sheet["minidahm_frame"]); //name der frames
        //sprite.animationSpeed = 1 / 10; 
        ///sprite.play();
    
        // Position
        sprite.x = x;
        sprite.y = y-7;

        sprite.anchor.set(0.5);      // Zentriert die Gegner
        sprite.scale.set(0.1);      // Macht den Gengner kleiner 
        sprite.zIndex = 901;         // Münze über Player und über Plattform


        this.world.addChild(sprite);
        //console.log("Sprite hinzugefügt!");
        return sprite;
    }

    positionTrainSprite(sprite, x, y, directionX){
        sprite.x = x;
        sprite.y = y-7;

        sprite.scale.x = 0.15 * directionX;
    }
}