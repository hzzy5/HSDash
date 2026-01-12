/*Spezifische View-Klasse, die für die Darstellung der Züge zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class TrainRenderer{
    constructor(container, ticker) {
        //Refrenz auf den Conatainer und Ticker, der in der PIXI.app liegt.
        this.world = container;
        this.ticker = ticker;
    }

    // Methode, um das Zug-Sprite zu erstellen
    createTrainSprite(x, y) {
        const sprite = PIXI.Sprite.from("zug");

        // Position
        sprite.x = x;
        sprite.y = y;

        sprite.anchor.set(0.5);      // Zentriert die Züge
        sprite.scale.set(0.5);      // Macht die Züge kleiner 
        sprite.zIndex = 901;         // Züge über Player und über Plattform


        this.world.addChild(sprite);
        return sprite;
    }

    //Zug-Sprite positionieren
    positionTrainSprite(sprite, x, y, directionX){
        if(sprite){
            sprite.x = x;
            sprite.y = y;

            if(directionX < 0){ //damit es in die richtige richtung gespiegelt ist
                sprite.scale.x = - 0.5;
            }else {
                sprite.scale.x = 0.5;
            }
        }
    }

    //das Zugsprite rotieren in Richtung Spieler
    //Sprite und neuer Richtungsvektor werden übergeben
    rotateTrainSprite(sprite, vectorXNew, vectorYNew){
        //Startvektor
        //let vectorXStart = -1;
        //let vectorYStart = 0;
        //theorethisch braucht man y-Werte gar nciht , da dieser bei der Berechnung immer 0 ist 
        //Durch Skalarprodukt beider Vektoren den Cosinus des Winkels dazwischen berechnen
        // vectorXStart = -1 bei links
        // vectorXStart = 1 bei rechts
        //dann mit arccos den Winkel daraus berechenen
        //dann Sprite um diesen Winkel drehen

        if(vectorXNew < 0 && vectorYNew > 0){//unten links
            let newAngle = -1 * vectorXNew ;//+ vectorYStart * vectorYNew
            sprite.rotation = Math.acos(newAngle) * -1;
        }else if(vectorXNew > 0 && vectorYNew > 0){ //unten rechts
            let newAngle = 1 * vectorXNew ;//+ vectorYStart * vectorYNew
            sprite.rotation = Math.acos(newAngle);
        }else if(vectorXNew < 0 && vectorYNew < 0){ //oben links
            let newAngle = -1 * vectorXNew ; //+ vectorYStart * vectorYNew
            sprite.rotation = Math.acos(newAngle);
        }else if(vectorXNew > 0 && vectorYNew < 0){ //oben rechts
            let newAngle = 1 * vectorXNew ; //+ vectorYStart * vectorYNew
            sprite.rotation = Math.acos(newAngle) * -1;
        }

    }
}