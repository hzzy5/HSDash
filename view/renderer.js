import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien

export class Renderer {

    //Konstruktor: Canvas erzeugen
    // constructor() {
    //     this.app = new PIXI.Application();
    // }

    //Initialisierung der Canvas
    async init() {
        //hier einmalig eine Canvas erzeugen.
        this.app = new PIXI.Application();  //this.app als property und nicht als lokale Variable 
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0.9,
            backgroundColor: 0xD3D3D3,
        }); 
        //Um die weißen Ränder zu entfernen
        this.app.canvas.style.position = 'absolute';

        //Ins DOM hinzufügen
        document.body.appendChild(this.app.canvas);
    }

    //Methode, um die Assets preloaden
    async loadAssets() {
        //Background
        PIXI.Assets.add({
            alias: "background", //name
            src: "assets/11_background.png", //pfad
        });

        PIXI.Assets.add({
            alias: "clouds", //name
            src: "assets/10_distant_clouds.png", //pfad
        });

        PIXI.Assets.add({
            alias: "hill2", //name
            src: "assets/06_hill2.png", //pfad
        });

        PIXI.Assets.add({
            alias: "hill1", //name
            src: "assets/05_hill1.png", //pfad
        });

        PIXI.Assets.add({
            alias: "trees", //name
            src: "assets/03_distant_trees.png", //pfad
        });

        PIXI.Assets.add({
            alias: "bushes", //name
            src: "assets/04_bushes.png", //pfad
        });

        PIXI.Assets.add({
            alias: "ground", //name
            src: "assets/01_ground.png", //pfad
        });


        //Character
        PIXI.Assets.add({
            alias: "player", //name
            src: "assets/player3.png", //pfad
        });
        
        PIXI.Assets.add({
            alias: "enemy",
            src: "assets/barrier.png",
        });

        //soundButton
        PIXI.Assets.add({
            alias: "soundAus", //name
            src: "assets/MusikAusButton.png", //pfad
        });

        //ggf weitere Assets
        
        await PIXI.Assets.load([,"background", "clouds", "hill2", "hill1", "trees", "bushes", "ground", "player", "enemy", "soundAus"]);
    }

    //Methode um Sprites zu erstellen 
    createSprite(alias) {
        //Sprite erstellen
        let sprite = PIXI.Sprite.from(alias);
        
        //Sprite anzeigen lassen
        this.app.stage.addChild(sprite); 
        //^^ this ist hier das app-Objekt

        return sprite;
    }

    //Metehode, die das Sprite positioniert
    //Diese Methode ist etwas umständlich, da man sicherstellen muss, dass die Koordinaten vom Model-Objekt kommen. D.h., dass davor muss noch ein Objekt erstellt werden.
    //z.B. (playerSprite, Player.x, Player.y) 
    positionSprite(sprite, _x, _y) {
        //Sprite positionieren
        sprite.x = _x ;
        sprite.y = _y;
    }


    //Methode, um aus Tiling Sprites den Hintergrund zusammenzubauen. 
    createTilingSprite(alias, width, height) {
        let sprite = PIXI.TilingSprite.from(alias, width, height);
        sprite.position.set(0,0);
        this.app.stage.addChild(sprite); 
        return sprite;
    }

    
    // updatePosition(sprite, _x, _y) {
    //     sprite.x = _x;
    //     sprite.y = _y;
    // }

} //end class renderer