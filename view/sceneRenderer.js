/*Spezifische View-Klasse, die für die Darstellung aller Elemente des Levels zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class SceneRenderer {

    constructor(mainView) {
        //Regerenz auf die view, damit dieselbe PIXI.app genutzt wird.
        this.view = mainView;

        //Instanzvariablen für den Hintergrund 
        this.backgroundX = 0;
        this.backgroundSpeed = -100; //nach links bewegen
    }

    //Methode, um aus Tiling Sprites (= sich wiederholende Bilder) den Hintergrund zusammenzubauen. 
    createTilingSprite(alias, width, height) {
        let sprite = PIXI.TilingSprite.from(alias, width, height);
        sprite.position.set(0,0);
        this.view.app.stage.addChild(sprite); 
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
        this.view.app.stage.addChild(gfx);
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
        this.view.app.stage.addChild(gfx);
        return { x, y, width, height };
    }

    //Methode, die die Szene initialisiert
    createBackground() {
        //Hintergrund aufbauen
        this.background = this.createTilingSprite("background", this.view.app.screen.width, 300);
        this.background.y = 0;
        this.clouds = this.createTilingSprite("clouds", this.view.app.screen.width, 300);
        this.clouds.y = -150;
        this.hill2 = this.createTilingSprite("hill2", this.view.app.screen.width, 280);
        this.hill2.y = -250;
        this.hill1 = this.createTilingSprite("hill1", this.view.app.screen.width, 180);
        this.hill1.y = -400;
        this.trees = this.createTilingSprite("trees", this.view.app.screen.width, 100);
        this.trees.y = -450;
        //this.bushes = this.createTilingSprite("bushes", window.innerWidth, 100);
        //this.bushes.y = -410;
        this.ground = this.createTilingSprite("ground", this.view.app.screen.width, 100);
        this.ground.y = -450;
    }

    //Methode, die den Hintergrund bewegt. Durch die verschiedenen Geschwindigkeiten wird ein Tiefeneffekt erzeugt.
    //!!!!Hier CameraX übergeben und cameraX * 0.5 usw machen. Abhängig von der Kamera scrollen
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
        //this.bushes.tilePosition.x = this.backgroundX *2.5;
        this.ground.tilePosition.x = this.backgroundX *3;
    }


}// endd class