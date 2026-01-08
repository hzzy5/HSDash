/*Spezifische View-Klasse, die für die Darstellung der Stacheln zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class GoalRenderer{
    constructor(container) {
        //Refrenz auf den Conatainer, der in der PIXI.app liegt.
        this.world = container;

        this.hitboxDebug = new PIXI.Graphics();
        this.hitboxDebug.zIndex = 9999;
    }

    // Methode, um das Goal Pole-Sprite zu erstellen.
    createGoalSprite(goal) {
        const sprite = PIXI.Sprite.from("goalPole");
    
        // Position
        sprite.x = goal.x;
        sprite.y = goal.y;

        sprite.anchor.set(0.4 , 0);      //Ankerpunkt ist unten in der Mitte
        sprite.scale.set(2);      
        sprite.zIndex = 900;       

        this.world.addChild(sprite);
        return sprite;
    }

    //DEBUG
    drawHitbox(x, y, w, h) {
        this.hitboxDebug.clear();
        this.hitboxDebug
        .rect(x, y, w, h)
        .fill({ color: 0xff0000, alpha: 0.25 })
        .stroke({ width: 2, color: 0xff0000 });
        this.world.addChild(this.hitboxDebug);
    }


    
}
