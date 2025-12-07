import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien

export class Renderer {

    //Instanzvariablen für den Hintergrund 
    backgroundX = 0;
    backgroundSpeed = -100; //nach links bewegen
    
    //Initialisierung der Canvas
    async initRenderer() {
        //hier einmalig eine Pixi-App erzeugen.
        this.app = new PIXI.Application();  //this.app als property und nicht als lokale Variable 
        this.app.stage.sortableChildren = true;  //zIndex aktivieren
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

    //Methode, um die Assets zu preloaden
    async loadAssets() {
        //Array mit alias: src
        const assets = {
            background: "assets/bilder/11_background.png",
            clouds: "assets/bilder/10_distant_clouds.png",
            hill2: "assets/bilder/06_hill2.png",
            hill1: "assets/bilder/05_hill1.png",
            trees: "assets/bilder/03_distant_trees.png",
            bushes: "assets/bilder/04_bushes.png",
            ground: "assets/bilder/01_ground.png",
            player: "assets/bilder/player4.png",
            enemy: "assets/bilder/barrier.png",
            coin: "assets/bilder/coin.png"
            //ggf weitere Assets
        };

        //The Object.entries() method returns an array of the key/value pairs of an object.
        for (const [alias, src] of Object.entries(assets)) {
            PIXI.Assets.add({ alias, src });
        }
        
        //The Object.keys() method returns an array with the keys of an object.
        await PIXI.Assets.load(Object.keys(assets));
    }


    //Methode, um Sprites zu erstellen 
    createSprite(alias) {
        let sprite = PIXI.Sprite.from(alias);
        //Sprite anzeigen lassen
        this.app.stage.addChild(sprite); 
        //^^ this ist hier das app-Objekt

        return sprite;
    }
    // Methode, um das Münz-Sprite zu erstellen
    createCoinSprite(x, y) {
    const sprite = PIXI.Sprite.from("coin");

      // Position
      sprite.x = x;
      sprite.y = y;

      // Wichtig für korrekte Darstellung
      sprite.anchor.set(0.5);      // Zentriert die Münze
      sprite.scale.set(0.15);      // Macht die Münze kleiner 
      sprite.zIndex = 900;         // Münze über Player und über Plattform

      this.app.stage.addChild(sprite);
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

    //Methode, um eine Plattform zu erzeugen.
    createPlatform(x, y, width, height, color = 0x8b4513) {
        const gfx = new PIXI.Graphics();
        gfx.beginFill(color);
        gfx.drawRect(0, 0, width, height);
        gfx.endFill();
        gfx.x = x;
        gfx.y = y;
        // ensure platforms render above background layers
        try { gfx.zIndex = 500; } catch (e) {}
        this.app.stage.addChild(gfx);
        return { x, y, width, height }; //Rückgabe als Collider für die Kollisionserkennung
    }

    //Methode, um die Grenzen des Spielfeldes zu erzeugen.
    createBound(x, y, width, height, color = 0x000000) {
        const gfx = new PIXI.Graphics();
        // gfx.beginFill(color);
        // gfx.drawRect(0, 0, width, height);
        // gfx.endFill();
        gfx.x = x;
        gfx.y = y;
        try { gfx.zIndex = 500; } catch(e) {}
        this.app.stage.addChild(gfx);
        return { x, y, width, height };
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
    scrollBackground(direction, dt) {
        //Die x-Position wird immer pro Frame mit einer Geschwidigkeit verschoben
        //Je nachdem, in welche Richtung sich der Spieler bewegt, wird der Hintergrund entsprechend verschoben.
        // direction = -1 nach rechts
        this.backgroundX += this.backgroundSpeed * dt * direction;

        this.background.tilePosition.x = this.backgroundX *0.5;
        this.clouds.tilePosition.x = this.backgroundX *0.5;
        this.hill2.tilePosition.x = this.backgroundX *1;
        this.hill1.tilePosition.x = this.backgroundX *1.5;
        this.trees.tilePosition.x = this.backgroundX *2;
        this.bushes.tilePosition.x = this.backgroundX *2.5;
        this.ground.tilePosition.x = this.backgroundX *3;
    }

    //Methode, den PixiJS Ticker startet. Pro Frame wird die Update-Funktion aufgerufen.
    //dt ist die vergangene Zeit in Sekunden seit dem letzen Frame.
    startGameLoop(updateFunction, player, playerSprite) {
        this.app.ticker.add(() => {
            const dt = this.app.ticker.deltaTime / 60;  // deltaTime = 1 pro Frame bei 60FPS
            //console.log("dt:", dt);
            updateFunction(dt);          
            this.renderPlayer(playerSprite, player.x, player.y); //player rendern
        });               
    }

} //end class renderer
