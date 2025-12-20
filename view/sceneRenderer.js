/*Spezifische View-Klasse, die für die Darstellung aller Elemente des Levels zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 

//Anhand dieser Konstanten wird festgelegt, wie viele Tiles ein Level hat (Zeilen x Spalten).
const VIRTUAL_WIDTH = 1536;
const VIRTUAL_HEIGHT = 800;

export class SceneRenderer {

    constructor(container, screen) {
        //Referenz auf den background view, damit dieselbe PIXI.app genutzt wird.
        this.background = container;
        this.screen = screen;
    }

    //Methode, um aus Tiling Sprites (= sich wiederholende Bilder) den Hintergrund zusammenzubauen. 
    createTilingSprite(alias) {
        let texture = PIXI.Texture.from(alias);
        let sprite = PIXI.TilingSprite.from(texture, VIRTUAL_WIDTH, texture.height*2);
        sprite.position.set(0,0);
        sprite.width = VIRTUAL_WIDTH;
        sprite.height = texture.height*2;

        sprite.tileScale.set(2, 2);
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
        this.sky = this.createTilingSprite("sky");
        this.sky.y = -10;
        
        this.clouds = this.createTilingSprite("clouds");
        this.clouds.y = 30;
        
        this.city = this.createTilingSprite("city");
        this.city.y = 130;
        this.carsR = this.createTilingSprite("carsR");
        this.carsR.y = 95;
        
        this.carsL = this.createTilingSprite("carsL");
        this.carsL.y = 95;
        
        this.hsd = this.createTilingSprite("hsd");
        this.hsd.y = 130;
        
        this.lampen2 = this.createTilingSprite("lampen2");
        this.lampen2.y = 95;

        this.ground = this.createTilingSprite("ground");
        this.ground.y = 100;
        
        this.trees = this.createTilingSprite("trees");
        this.trees.y = 95;
        
        this.lampen1 = this.createTilingSprite("lampen1");
        this.lampen1.y = 95;
    }

    //Methode, die den Hintergrund bewegt. Durch die verschiedenen Geschwindigkeiten wird ein Tiefeneffekt erzeugt.
    scrollBackground(camera) {
        //Die x-Position wird immer dorthin gesetzt, wo die Kamera ist und mit einer Geschwidigkeit multipliziert.  
        this.sky.tilePosition.x = camera *-0.5;
        this.clouds.tilePosition.x = camera *-0.75;
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