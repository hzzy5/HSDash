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
        sprite.y = y;

        sprite.anchor.set(0.5);      // Zentriert die Gegner
        sprite.scale.set(0.5);      // Macht den Gengner kleiner 
        sprite.zIndex = 901;         // Münze über Player und über Plattform


        this.world.addChild(sprite);
        //console.log("Sprite hinzugefügt!");
        return sprite;
    }

    positionTrainSprite(sprite, x, y, directionX){
        sprite.x = x;
        sprite.y = y;

        sprite.scale.x = 0.5 * directionX; //damit es in die richtige rich tugn gespiegelt ist, wird dann allerdings auch wenn man unter dem steht immer schmaller
        //brauchen eine Version mit nur + oder - 1 
    }

    //Sprite und neuer Richtungsvektor werden übergeben
    rotateTrainSprite(sprite, vectorXNew, vectorYNew){
        //Startvektor
        //let vectorXStart = -1;
        let vectorYStart = 0;
        //theorethisch braucht man y-Werte gar nciht 
        //Durch Skalarprodukt beider Vektoren den Cosinus des Winkels dazwischen berechnen
        // vectorXStart = -1 bei links
        // vectorXStart = 1 bei rechts
        //darauf basierend mit arccos den Winkel berechenen

        if(vectorXNew < 0 && vectorYNew > 0){//unten links
            let newAngle = -1 * vectorXNew + vectorYStart * vectorYNew;
            sprite.rotation = Math.acos(newAngle) * -1;
        }else if(vectorXNew > 0 && vectorYNew > 0){ //unten rechts
            let newAngle = 1 * vectorXNew + vectorYStart * vectorYNew;
            sprite.rotation = Math.acos(newAngle);
        }else if(vectorXNew < 0 && vectorYNew < 0){ //oben links
            let newAngle = -1 * vectorXNew + vectorYStart * vectorYNew;
            sprite.rotation = Math.acos(newAngle);
        }else if(vectorXNew > 0 && vectorYNew < 0){ //oben rechts
            let newAngleNegativeX = 1 * vectorXNew + vectorYStart * vectorYNew;
            sprite.rotation = Math.acos(newAngleNegativeX) * -1;
        }

    }
}