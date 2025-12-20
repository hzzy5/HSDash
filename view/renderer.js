import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien

/* Allgemeine Render-Klasse, die folgende Methoden enthält: 
    - Canvas erzeugen 
    - Ressourcen laden
    - Graphic, Sprites, ... erzeugen und rendern
    - gameloop
*/
//Skalierung anahnd dieser Größen
const VIRTUAL_WIDTH = 1536; //48*32, d.h. 48 Spalten passen in ein Screen
const VIRTUAL_HEIGHT = 800; //25*32, d.h. 25 Zeilen passen in einen Screen
const TILE_SIZE = 32;


export class Renderer {
    
    
    //Initialisierung der Canvas
    async initRenderer() {
        //hier einmalig eine Pixi-App erzeugen.
        this.app = new PIXI.Application();  
        this.app.stage.sortableChildren = true;  //zIndex aktivieren
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x4682b4, 
            antialias: true, // Kanten glätten -> sonst Linien gezackt
            resizeTo: window // Automatisch an Fenstergröße anpassen
        }); 
        //Um die weißen Ränder zu entfernen
        this.app.canvas.style.position = 'absolute';

        //Ins DOM hinzufügen
        document.body.appendChild(this.app.canvas);

        //Container
        this.background = new PIXI.Container();
        this.world = new PIXI.Container();
        this.hud = new PIXI.Container();
        this.ui = new PIXI.Container();

        this.app.stage.addChild(this.background, this.world, this.hud, this.ui);
        
        //Ein Ticker für die ganze View 
        this.ticker = this.app.ticker;

        //Screen der View
        this.screen = this.app.screen;

        //Für Fenstergrößenänderungen
        this.resize();
    }

    //Methode, um Sprites zu erstellen 
    createSprite(alias) {
        let sprite = PIXI.Sprite.from(alias);
        //Sprite anzeigen lassen
        this.world.addChild(sprite); 
        //^^ this ist hier das app-Objekt

        return sprite;
    }

    //Methode, um Sprites zu rendern
    renderSprite(sprite, x, y) {
        //Spriteposition aktualisieren
        sprite.x = x ;
        sprite.y = y;
    }

    //Methode um ein 32x32-Tile zu erzeugen. 
    createTile(x, y, fillColor = 0x8a4513, borderColor = 0x000000, borderWidth = 2) {
        //Ins Bild passen 48x25 Tiles
        const tileX = VIRTUAL_WIDTH / TILE_SIZE;
        const tileY = VIRTUAL_HEIGHT / TILE_SIZE;

        const gfx = new PIXI.Graphics();
        gfx.beginFill(fillColor);           //Rechteck
        gfx.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
        gfx.endFill();

        gfx.lineStyle(borderWidth, borderColor);    //Umrandung
        gfx.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
        gfx.endFill();

        gfx.x = x;
        gfx.y = y;
        
        this.world.addChild(gfx);
        
        return { x, y, width: TILE_SIZE, height: TILE_SIZE};
    }

    //Methode um ein unsichtbaren 32x32-Tile zu erzeugen. 
    createInvisibleTile(x, y) {
        //Ins Bild passen 48x25 Tiles
        const tileX = VIRTUAL_WIDTH / TILE_SIZE;
        const tileY = VIRTUAL_HEIGHT / TILE_SIZE;

        const gfx = new PIXI.Graphics();

        gfx.x = x;
        gfx.y = y;
        
        this.world.addChild(gfx);
        
        return { x, y, width: TILE_SIZE, height: TILE_SIZE};
    }

    //Methode, um die Assets zu preloaden
    async loadAssets() {
        //Objekt mit alias: src
        const assets = {
            //SZENE
            // background: "assets/bilder/11_background.png",
            // clouds: "assets/bilder/10_distant_clouds.png",
            // hill2: "assets/bilder/06_hill2.png",
            // hill1: "assets/bilder/05_hill1.png",
            // trees: "assets/bilder/03_distant_trees.png",
            // //bushes: "assets/bilder/04_bushes.png",
            // ground: "assets/bilder/01_ground.png",

            lampen1: "assets/bilder_lvl1/00_lampen1.png",
            trees: "assets/bilder_lvl1/01_Trees.png",
            ground: "assets/bilder_lvl1/02_Ground.png",
            lampen2: "assets/bilder_lvl1/03_lampen2.png",
            hsd: "assets/bilder_lvl1/04_HSD.png",
            carsL: "assets/bilder_lvl1/05_Cars_left.png",
            carsR: "assets/bilder_lvl1/06_Cars_right.png",
            city: "assets/bilder_lvl1/07_City_back.png",
            clouds: "assets/bilder_lvl1/08_clouds.png",
            sky: "assets/bilder_lvl1/09_Sky.png",


            //SPIELELEMENTE
            player: "assets/bilder/player4.png",
            enemy: "assets/bilder/barrier.png",
            coin: "assets/bilder/coin.png",

            //SPRITESHEETS, JSON
            idleAnimation: "assets/bilder/idleSprite.json",
            walkAnimation: "assets/bilder/walkSprite.json",
            runAnimation: "assets/bilder/runSprite.json",
            jumpAnimation: "assets/bilder/jumpSprite.json",
            fallAnimation: "assets/bilder/fallSprite.json",
            dashAnimation: "assets/bilder/dashSprite.json",
            
            
            //SOUND
            soundAus: "assets/bilder/MusikAusButton.png"
            //ggf weitere Assets
        };

        //The Object.entries() method returns an array of the key/value pairs of an object.
        for (const [alias, src] of Object.entries(assets)) {
            PIXI.Assets.add({ alias, src });
        }
        
        //The Object.keys() method returns an array with the keys of an object.
        await PIXI.Assets.load(Object.keys(assets));
        
        //SCHRIFT 
        await document.fonts.load('16px "Press Start 2P"');
        await document.fonts.ready;
    }

    //Methode wird bei Änderungen der Fenstergröße aufgerufen.
    resize() {
        const resize = () => {
            //Spielfeld propotional zum Bildschirm
            const scaleX = window.innerWidth / VIRTUAL_WIDTH;
            const scaleY = window.innerHeight / VIRTUAL_HEIGHT;
            
            //Uniforme Skalierung, sonst ist das Bild verzerrt
            //Kleinere Skalierung wählen, damit nichts weggeschnitten wird. 
            const scale = Math.min(scaleX, scaleY);

            //Container skalieren
            this.world.scale.set(scale); 
            //this.background.scale.set(scale);
            //this.background.width = window.innerWidth;

            //UI bleibt fix
            this.hud.scale.set(1);
            this.ui.scale.set(1);

            //Zentrieren
            this.world.x = (window.innerWidth - VIRTUAL_WIDTH * scale) / 2;
            this.world.y = (window.innerHeight - VIRTUAL_HEIGHT * scale) / 2;
            this.background.x = (window.innerWidth - VIRTUAL_WIDTH * scale) / 2;
            this.background.y = (window.innerHeight - VIRTUAL_HEIGHT * scale) / 2;

        };
        resize();
        window.addEventListener("resize", resize);
    }


    //Methode, den PixiJS Ticker startet. Pro Frame wird die Update-Funktion aufgerufen.
    //dt ist die vergangene Zeit in Sekunden seit dem letzen Frame.
    startGameLoop(updateFunction) {
        this.ticker.add(() => {
            const dt = this.ticker.deltaTime / 60;  // deltaTime = 1 pro Frame bei 60FPS
            //console.log("dt:", dt);
            updateFunction(dt);          
        });               
    }

} //end class renderer
