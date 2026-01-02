/*Spezifische View-Klasse, die für die Darstellung des Head-Up-Displays zuständig ist, z.B Münzen, Leben, ... .*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

export class HudRenderer {
    constructor(container, screen) {
        //Refrenz auf den Conatainer und screen, der in der PIXI.app liegt.
        this.hud = container;
        this.screen = screen; //für die responsive Platzierung 

    }

    // HUD: Coin-Anzeige oben rechts
    createCoinHud() {
        // ==================
        // COIN HUD       ===
        // ==================
        //Background
        const coinContainer = new PIXI.Container();
        this.hud.addChild(coinContainer);

        const bg = new PIXI.Graphics();
        bg.beginFill(0xffffff, 0.55);
        bg.drawRoundedRect(this.screen.width - 210, 17, 230, 50, 52);
        bg.endFill();
        coinContainer.addChild(bg);


        //Text: Anzahl Münzen
        this.coinHud = new PIXI.Text(`0`, {
            fontFamily: "Press Start 2P",
            fontSize: 22,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4
        });

        this.coinHud.x = this.screen.width - 135;
        this.coinHud.y = 30;
        this.coinHud.zIndex = 9999;

        coinContainer.addChild(this.coinHud);

        //Bild von Coin
        this.coinSprite = PIXI.Sprite.from("coinHUD");

        this.coinSprite.x = this.screen.width - 190;
        this.coinSprite.y = 42.5;

        this.coinSprite.anchor.set(0.5);      // Zentriert die Münze
        this.coinSprite.scale.set(1.2);      // Macht die Münze kleiner 
        this.coinSprite.zIndex = 900;         // Münze über Player und über Plattform

        coinContainer.addChild(this.coinSprite);


        // ==================
        // 5COIN HUD      ===
        // ==================
        //Background
        const coin5Container = new PIXI.Container();
        this.hud.addChild(coin5Container);

        const bg5 = new PIXI.Graphics();
        bg5.beginFill(0xffffff, 0.55);
        bg5.drawRoundedRect(this.screen.width - 210, 85, 230, 50, 52);
        bg5.endFill();
        coin5Container.addChild(bg5);

        //Anzahl 5Coins
        this.coin5Hud = new PIXI.Text(`0 / 3`, {
            fontFamily: "Press Start 2P",
            fontSize: 22,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4
        });

        this.coin5Hud.x = this.screen.width - 135;
        this.coin5Hud.y = 100;
        this.coin5Hud.zIndex = 9999;

        this.hud.addChild(this.coin5Hud);

        //Bild 5Coin
        this.coin5Sprite = PIXI.Sprite.from("coin5HUD");

        this.coin5Sprite.x = this.screen.width - 187;
        this.coin5Sprite.y = 108;

        this.coin5Sprite.anchor.set(0.5);      // Zentriert die Münze
        this.coin5Sprite.scale.set(1.05);      // Macht die Münze kleiner 
        this.coin5Sprite.zIndex = 900;         // Münze über Player und über Plattform

        coin5Container.addChild(this.coin5Sprite);

    }

    updateCoinHud(coinsCollected, coins5Collected) {
        if (this.coinHud) {
            this.coinHud.text = `${coinsCollected}`;
        }

        if (this.coin5Hud) {
            this.coin5Hud.text = `${coins5Collected} / 3`;
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
        //Herz 1
        this.heartSprite1.x = window.innerWidth / 2 -35;
        this.heartSprite1.y = 39;

        this.heartSprite1.anchor.set(0.5);      // Zentriert die Münze
        this.heartSprite1.scale.set(2);      // Macht die Münze kleiner 
        this.heartSprite1.zIndex = 900;         // Münze über Player und über Plattform

        this.hud.addChild(this.heartSprite1);

        //Herz 2
        this.heartSprite2.x = window.innerWidth /2 +35;
        this.heartSprite2.y = 39;

        this.heartSprite2.anchor.set(0.5);      // Zentriert die Münze
        this.heartSprite2.scale.set(2);      // Macht die Münze kleiner 
        this.heartSprite2.zIndex = 900;

        this.hud.addChild(this.heartSprite2);
    }

} //end class


    