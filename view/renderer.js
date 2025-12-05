import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien

export class Renderer {

    //Instanzvariablen für den Hintergrund 
    backgroundX = 0;
    backgroundSpeed = -10; //nach links bewegen

    //Initialisierung der Canvas
    async initRenderer() {
        //hier einmalig eine Pixi-App erzeugen.
        this.app = new PIXI.Application();  //this.app als property und nicht als lokale Variable 
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x87ceeb, // Hellblau
            antialias: true, // Kanten glätten -> sonst Linien gezackt
            resizeTo: window // Automatisch an Fenstergröße anpassen
        }); 
        //Um die weißen Ränder zu entfernen
        this.app.canvas.style.position = 'absolute';

        //Ins DOM hinzufügen
        document.body.appendChild(this.app.canvas);

        // //Event Listener für Fenstergrößenänderungen
        // window.addEventListener('resize', () => {
        //     ground.clear();
        //     ground.beginFill(0x2d5a27);
        //     ground.drawRect(0, app.screen.height - 100, app.screen.width, 100);
        //     ground.endFill();
        // });
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

        //ggf weitere Assets

        /*-----------------------------------------------------------------
          hier besser eine Schleife ausprobieren
          const assets = {
            background: "assets/11_background.png",
            clouds: "assets/10_distant_clouds.png",
            hill2: "assets/06_hill2.png",
            hill1: "assets/05_hill1.png",
            trees: "assets/03_distant_trees.png",
            bushes: "assets/04_bushes.png",
            ground: "assets/01_ground.png",
            player: "assets/player3.png",
            enemy: "assets/barrier.png"
        };

        for (const [alias, src] of Object.entries(assets)) {
            PIXI.Assets.add({ alias, src });
        }

        await PIXI.Assets.load(Object.keys(assets));
        ---------------------------------------------------------------------*/
        
        await PIXI.Assets.load(["background", "clouds", "hill2", "hill1", "trees", "bushes", "ground", "player", "enemy"]);
    }


    //Methode, um Sprites zu erstellen 
    createSprite(alias) {
        let sprite = PIXI.Sprite.from(alias);
        //Sprite anzeigen lassen
        this.app.stage.addChild(sprite); 
        //^^ this ist hier das app-Objekt

        return sprite;
    }


    //Metehode, um das Sprite zu positioniert
    renderPlayer(sprite, x, y) {
        //Spriteposition aktualisieren
        sprite.x = x ;
        sprite.y = y;
    }
    //!!Diese Methode ist etwas umständlich, da man sicherstellen muss, dass die Koordinaten vom Model-Objekt kommen. D.h., dass davor muss noch ein Objekt erstellt werden.
    //z.B. (playerSprite, Player.x, Player.y) 
    //positionSprite(sprite, _x, _y) {


    //Methode, um aus Tiling Sprites den Hintergrund zusammenzubauen. 
    createTilingSprite(alias, width, height) {
        let sprite = PIXI.TilingSprite.from(alias, width, height);
        sprite.position.set(0,0);
        this.app.stage.addChild(sprite); 
        return sprite;
    }


    //Methode, die die Szene initialisiert
    createBackground() {
        //Hintergrund aufbauen
        this.background = this.createTilingSprite("background", window.innerWidth, 300);
        this.background.y = 0;
        this.clouds = this.createTilingSprite("clouds", window.innerWidth, 300);
        this.clouds.y = -150;
        this.hill2 = this.createTilingSprite("hill2", window.innerWidth, 280);
        this.hill2.y = -450;
        this.hill1 = this.createTilingSprite("hill1", window.innerWidth, 180);
        this.hill1.y = -400;
        this.trees = this.createTilingSprite("trees", window.innerWidth, 100);
        this.trees.y = -450;
        this.bushes = this.createTilingSprite("bushes", window.innerWidth, 100);
        this.bushes.y = -410;
        this.ground = this.createTilingSprite("ground", window.innerWidth, 100);
        this.ground.y = -500;
    }

    //Methode, die den Hintergrund bewegt. Durch die verschiedenen Geschwindigkeiten wird ein Tiefeneffekt erzeugt.
    scrollBackground() {
        //Die x-Position wird immer um -10 (speed) nach links verschoben
        this.backgroundX += this.backgroundSpeed;

        this.background.tilePosition.x = this.backgroundX / 9;
        this.clouds.tilePosition.x = this.backgroundX / 9;
        this.hill2.tilePosition.x = this.backgroundX / 7;
        this.hill1.tilePosition.x = this.backgroundX / 6;
        this.trees.tilePosition.x = this.backgroundX / 4;
        this.bushes.tilePosition.x = this.backgroundX / 2;
        this.ground.tilePosition.x = this.backgroundX;
    }

} //end class renderer
