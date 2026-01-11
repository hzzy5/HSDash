/*Spezifische View-Klasse, die für die Darstellung des DB-Bruder zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class DBBroRenderer{
    constructor(container, ticker) {
        //Refrenz auf den Conatainer und Ticker, der in der PIXI.app liegt.
        this.world = container;
        this.ticker = ticker;
    }

    // Methode, um das DBBro-Sprite zu erstellen
    createDBBroSprite(x, y) {
        const sprite = PIXI.Sprite.from("dbBruder");
    
        // Position
        sprite.x = x;
        sprite.y = y -20;

        sprite.anchor.set(0.5);      // Zentriert die Brüder
        sprite.scale.set(1.8);      // Macht die Brüder kleiner 
        sprite.zIndex = 900;         // Brüder über Player und über Plattform


        this.world.addChild(sprite);
        return sprite;
    }

    //Sprite umdrehen - in Richtung Spieler
    mirrorSprite(sprite, left){
        if(left){
            sprite.scale.x = 1.8;
        }else{
            sprite.scale.x = -1.8;
        }
    }
}