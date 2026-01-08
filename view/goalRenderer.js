/*Spezifische View-Klasse, die für die Darstellung der Stacheln zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class GoalRenderer{
    constructor(container) {
        //Refrenz auf den Conatainer, der in der PIXI.app liegt.
        this.world = container;

        // this.hitboxDebug = new PIXI.Graphics();
        // this.hitboxDebug.zIndex = 9999;
        this.currentGoal;
    }

    // Methode, um das Goal Pole-Sprite zu erstellen.
    createGoalSprite(goal, type) {
        //Ziel-Grafik je nach Level festlegen
        this.switchGoal(type); 
    
        // Position
        this.currentGoal.x = goal.x;
        this.currentGoal.y = goal.y;

        this.currentGoal.anchor.set(0.4 , 0);      //Ankerpunkt ist unten in der Mitte     
             

        this.world.addChild(this.currentGoal);
        return this.currentGoal;
    }

    switchGoal(type) {
        switch (type) {
            case "zielGebäude4": 
                this.currentGoal = PIXI.Sprite.from("zielGebäude4"); 
                break;

            case "zielFahrstuhl":
                const sheet = PIXI.Assets.get("zielFahrstuhl").data.animations;
                this.currentGoal = PIXI.AnimatedSprite.fromFrames(sheet["frame"]);
                this.currentGoal.scale.set(1.6);
                this.currentGoal.animationSpeed = 1/6;
                this.currentGoal.zIndex = 0; //Player soll vor dem Fahrstuhl stehen.
                this.openElevator(); //später im Controller
                break;
        }
    }

    openElevator() {
        this.currentGoal.loop = true; //später false
        this.currentGoal.play();
    }

    // //DEBUG
    // drawHitbox(x, y, w, h) {
    //     this.hitboxDebug.clear();
    //     this.hitboxDebug
    //     .rect(x, y, w, h)
    //     .fill({ color: 0xff0000, alpha: 0.25 })
    //     .stroke({ width: 2, color: 0xff0000 });
    //     this.world.addChild(this.hitboxDebug);
    // }


    
}
