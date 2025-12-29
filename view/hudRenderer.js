/*Spezifische View-Klasse, die für die Darstellung des Head-Up-Displays zuständig ist, z.B Münzen, Leben, ... .*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

export class HudRenderer {
    constructor(container, screen) {
        //Refrenz auf den Conatainer und screen, der in der PIXI.app liegt.
        this.hud = container;
        this.screen = screen; //für die responsive Platzierung 

    }

    // HUD: Coin-Anzeige oben rechts
    createCoinHud(totalCoins) {
        this.coinHud = new PIXI.Text(`Coins: 0 / ${totalCoins}`, {
            fontFamily: "Press Start 2P",
            fontSize: 22,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4
        });

        this.coinHud.x = this.screen.width - 300;
        this.coinHud.y = 20;
        this.coinHud.zIndex = 9999;

        this.hud.addChild(this.coinHud);
    }

    updateCoinHud(collected, total) {
        if (this.coinHud) {
            this.coinHud.text = `Coins: ${collected} / ${total}`;
        }
    }


    LifeHud(numberLifes){
        switch(numberLifes){
            case 0: this.heartSprite1 = PIXI.Sprite.from("blackheart");
                    this.heartSprite2 = PIXI.Sprite.from("blackheart");
                    break;
            case 1: this.heartSprite1 = PIXI.Sprite.from("life");
                    this.heartSprite2 = PIXI.Sprite.from("blackheart");
                    break;
            case 2: this.heartSprite1 = PIXI.Sprite.from("life");
                    this.heartSprite2 = PIXI.Sprite.from("life");
                    break;
            default: this.heartSprite1 = null;
                     this.heartSprite2 = null;
        }

        if(this.heartSprite1 != null && this.heartSprite2 != null){
            this.positionHeartSprites();
        }
        
    }

    positionHeartSprites(){
        this.heartSprite1.x = window.innerWidth - 50;
        this.heartSprite1.y = 80;

        this.heartSprite1.anchor.set(0.5);      // Zentriert die Münze
        this.heartSprite1.scale.set(0.08);      // Macht die Münze kleiner 
        this.heartSprite1.zIndex = 900;         // Münze über Player und über Plattform

        this.heartSprite2.x = window.innerWidth - 120;
        this.heartSprite2.y = 80;

        this.heartSprite2.anchor.set(0.5);      // Zentriert die Münze
        this.heartSprite2.scale.set(0.08);      // Macht die Münze kleiner 
        this.heartSprite2.zIndex = 900;

        this.hud.addChild(this.heartSprite1);
        this.hud.addChild(this.heartSprite2);
    }

} //end class


    