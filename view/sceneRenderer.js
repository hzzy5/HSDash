/*Spezifische View-Klasse, die für die Darstellung aller Elemente des Levels zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class SceneRenderer {

    constructor(container, screen) {
        //Referenz auf den background view, damit dieselbe PIXI.app genutzt wird.
        this.background = container;
        this.screen = screen;
    }

    //Methode, um aus Tiling Sprites (= sich wiederholende Bilder) den Hintergrund zusammenzubauen. 
    createTilingSprite(alias, width, height) {
        let sprite = PIXI.TilingSprite.from(alias, width, height);
        sprite.position.set(0,0);
        //sprite.tileScale.set(1, sprite.height / sprite.texture.height);
        // this.sky.tileScale.set(2,2);
        sprite.height = height;
        sprite.tileScale.set(2);
        this.background.addChild(sprite); 
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
        this.background.addChild(gfx);
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
        this.background.addChild(gfx);
        return { x, y, width, height };
    }

    //Methode, die die Szene initialisiert
    createBackground() {
        //Hintergrund aufbauen
        this.sky = this.createTilingSprite("sky", this.screen.width, 1200);
        this.sky.y = 0;
        
        this.clouds1 = this.createTilingSprite("clouds", this.screen.width,  200);
        this.clouds2 = this.createTilingSprite("clouds", this.screen.width,  200);
        this.clouds1.y = 0;
        this.clouds1.x = -500;
        this.clouds2.y = 100;

        
        this.city = this.createTilingSprite("city", this.screen.width,  1200);
        this.city.y = 100;
        this.carsR = this.createTilingSprite("carsR", this.screen.width,  1200);
        this.carsR.y = 65;
        
        this.carsL = this.createTilingSprite("carsL", this.screen.width,  1200);
        this.carsL.y = 65;
        
        this.hsd = this.createTilingSprite("hsd", this.screen.width,  1200);
        this.hsd.y = 100;
        
        this.lampen2 = this.createTilingSprite("lampen2", this.screen.width, 1200);
        this.lampen2.y = 65;

        this.ground = this.createTilingSprite("ground", this.screen.width,  1200);
        this.ground.y = 70;
        
        this.trees = this.createTilingSprite("trees", this.screen.width, 1200);
        this.trees.y = 65;
        
        this.lampen1 = this.createTilingSprite("lampen1", this.screen.width, 1200);
        this.lampen1.y = 65;




        // this.background = this.createTilingSprite("background", window.innerWidth, 300);
        // this.background.y = 0;
        // this.clouds = this.createTilingSprite("clouds", window.innerWidth, 300);
        // this.clouds.y = -150;
        // this.hill2 = this.createTilingSprite("hill2", window.innerWidth, 280);
        // this.hill2.y = -250;
        // this.hill1 = this.createTilingSprite("hill1", window.innerWidth, 180);
        // this.hill1.y = -400;
        // this.trees = this.createTilingSprite("trees", window.innerWidth, 100);
        // this.trees.y = -450;
        // //this.bushes = this.createTilingSprite("bushes", window.innerWidth, 100);
        // //this.bushes.y = -410;
        // this.ground = this.createTilingSprite("ground", window.innerWidth, 100);
        // this.ground.y = -450;
    }

    //Methode, die den Hintergrund bewegt. Durch die verschiedenen Geschwindigkeiten wird ein Tiefeneffekt erzeugt.
    scrollBackground(camera) {
        //Die x-Position wird immer dorthin gesetzt, wo die Kamera ist und mit einer Geschwidigkeit multipliziert.  
        this.sky.tilePosition.x = camera *-0.5;
        this.clouds1.tilePosition.x = camera *-0.6;
        this.clouds2.tilePosition.x = camera *-0.75;
        this.city.tilePosition.x = camera *-0.95;
        this.carsR.tilePosition.x = camera *0.5;
        this.carsL.tilePosition.x = camera *-1.5;
        this.hsd.tilePosition.x = camera *-1.11;
        this.lampen2.tilePosition.x = camera *-1.15;
        this.ground.tilePosition.x = camera *-1.15;
        this.trees.tilePosition.x = camera *-1.15;
        this.lampen1.tilePosition.x = camera *-1.2;
    }


}// endd class