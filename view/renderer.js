import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien

/* Allgemeine Render-Klasse, die folgende Methoden enthält: 
    - Canvas erzeugen 
    - Ressourcen laden
    - Graphic, Sprites, ... erzeugen und rendern
    - gameloop
*/
//Virtuelle Spielweltgrößen, unabhängig von der tatsächlichen Fenstergröße. So werden alle Positionen proportional zur virtuellen Welt gesetzt.
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
        //this.resize();
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


    //Methode, um die Assets zu preloaden
    async loadAssets() {
        //Objekt mit alias: src
        const assets = {
            //SZENE
            //Level1
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

            //Level2
            //deko: "assets/bilder_lvl2/01_Deko.png",
            dekoMuellE0: "assets/bilder_lvl2/01_Muell_E0.png",
            dekoMuellE1: "assets/bilder_lvl2/01_Muell_E1.png",
            dekoPlakateE0: "assets/bilder_lvl2/01_Plakate_E0.png",
            dekoPlakateE1: "assets/bilder_lvl2/01_Plakate_E1.png",
            dekoTischeE1: "assets/bilder_lvl2/01_Tische_E1.png",
            etage1: "assets/bilder_lvl2/02_Boden_E1.png",
            etage0: "assets/bilder_lvl2/03_Boden_E0.png",
            lampen3: "assets/bilder_lvl2/04_Lampen.png",
            wand: "assets/bilder_lvl2/05_Wand_background.png",
            dach: "assets/bilder_lvl2/06_Dach.png",
            clouds2: "assets/bilder_lvl2/07_clouds.png",
            sky2: "assets/bilder_lvl2/08_Sky.png",


            //SPIELELEMENTE
            //player: "assets/bilder/player4.png",
            sebastian: "assets/bilder_lvl1/playermodel.png",
            dennis: "assets/bilder_lvl1/playermodel2.png",
            blueFrame: "assets/bilder/rahmen.png",

            //coin: "assets/bilder/coin.png",
            coin: "assets/bilder/coin_anim.json",
            coinHUD: "assets/bilder/coin_frame1.png",
            //coin5: "assets/bilder/startcoin.jpg",
            coin5: "assets/bilder/fivecoin_anim.json",
            coin5HUD: "assets/bilder/fivecoin_frame1.png",
            coin5empty: "assets/bilder/fivecoin_frame1_empty.png",
            life: "assets/bilder_lvl1/life.png",
            blackheart: "assets/bilder_lvl1/blackheart.png",
            spike: "assets/bilder/stacheln2.png",
            //gumba: "assets/bilder/gumba.png",
            gumba: "assets/bilder/minidahm_anim.json",
            dbBruder: "assets/bilder/DB-Bruder.png",
            zug: "assets/bilder/Bahn.png",
            goalPole: "assets/bilder/Ziel_lvl1.png",

            //SPRITESHEETS, JSON
            idleAnimation: "assets/bilder/idleAnimation.json",
            walkAnimation: "assets/bilder/runAnimation.json",
            runAnimation: "assets/bilder/runAnimation.json",
            jumpAnimation: "assets/bilder/jumpAnimation.json",
            fallAnimation: "assets/bilder/fallAnimation.json",
            dashAnimation: "assets/bilder/dashAnimation.json",
            
            
            //SOUND
            soundAus: "assets/bilder_lvl1/musikbuttonaus.png",
            soundAn: "assets/bilder_lvl1/musikbuttonan.png"
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
            this.background.scale.set(scale);

            //UI bleibt fix
            this.hud.scale.set(1);
            this.ui.scale.set(1);

            //Zentrieren
            this.world.x = (window.innerWidth - VIRTUAL_WIDTH * scale) / 2;
            this.world.y = 0; 
            this.background.x = (window.innerWidth - VIRTUAL_WIDTH * scale) / 2;
            this.background.y = 0;

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
