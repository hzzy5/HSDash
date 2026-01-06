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
        
        this.currentScene;

        //Objekt speichert Position und Geschwindigkeit für die jeweilige Ebene 
        this.campus = [
            {
                id: "sky",
                y: -50,
                speed: -0.3,
                sprite: null, //Referenz auf das PIXI.TilingSprite wird später gesetzt
                scale: 2
            },

            {
                id: "clouds",
                y: -10,
                speed: -0.6,
                sprite: null,
                scale: 2
            },

            {
                id: "city",
                y: -100,
                speed: -0.8,
                sprite: null,
                scale: 2
            },

            {
                id: "carsR",
                y: -105,
                speed: 0.4, //fahren nach rechts
                sprite: null,
                scale: 2
            },

            {
                id: "carsL",
                y: -105,
                speed: -1.5,
                sprite: null,
                scale: 2
            },

            {
                id: "hsd",
                y: -95,
                speed: -0.87,
                sprite: null,
                scale: 2
            },

            {
                id: "lampen2",
                y: -90,
                speed: -0.95,
                sprite: null,
                scale: 2
            },

            {
                id: "ground",
                y: -100,
                speed: -1,
                sprite: null,
                scale: 2
            },

            {
                id: "lampen1",
                y: -105,
                speed: -0.95,
                sprite: null,
                scale:2
            },

            {
                id: "trees",
                y: -105,
                speed: -1,
                sprite: null,
                scale: 2
            },
        ]
        //===================================
        //===================================
        this.gebauede4 = [
            {
                id: "sky2",
                y: 10,
                speed: -0.3,
                sprite: null, //Referenz auf das PIXI.TilingSprite wird später gesetzt
                scale: 1.6
            },
            {
                id: "clouds", //hier clouds aus lvl1. idk was besser ist
                y: 0,
                speed: -0.9,
                sprite: null,
                scale: 2
            },
            {
                id: "dach",
                y: 60,
                speed: -1,
                sprite: null,
                scale: 1.6
            },
            
            {
                id: "etage1",
                y: 60,
                speed: -1, //
                sprite: null, 
                scale: 1.6
            },
            {
                id: "etage0",
                y: 60,
                speed: -1, //
                sprite: null, 
                scale: 1.6
            },
            {
                id: "wand", //
                y: 59,
                speed: -1,
                sprite: null,
                scale: 1.6
            },
            {
                id: "lampen3", 
                y: 59,
                speed: -1, //
                sprite: null,
                scale: 1.6
            },
            {
                id: "deko",
                y: 63,
                speed: -1,
                sprite: null, 
                scale: 1.6
            },
        ];
    }

    //Methode, um aus Tiling Sprites (= sich wiederholende Bilder) den Hintergrund zusammenzubauen. 
    createTilingSprite(alias, scale) {
        let texture = PIXI.Texture.from(alias);
        let sprite = PIXI.TilingSprite.from(texture, this.screen.width, texture.height*2);
        sprite.position.set(0,0);
        sprite.width = this.screen.width;
        sprite.height = texture.height*2;

        sprite.tileScale.set(scale);
        this.background.addChild(sprite); 
        return sprite;
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

    setBackground(key) {
        //ggf. alten Hintergrund entfernen
        if (this.currentScene) {
            this.background.removeChildren();
            console.log("entfern");
        }
        switch (key) {
            case "campus": 
                this.currentScene = this.campus; break;
            case "gebäude 4":
                this.currentScene = this.gebauede4; break;
            default: return null;
        }
        console.log(this.currentScene, key);
        this.createBackground();
    }

    //Methode, die die Szene initialisiert
    createBackground() {
        //Hintergrund aufbauen
        for (const layer of this.currentScene) {
            let sprite = this.createTilingSprite(layer.id, layer.scale);
            layer.sprite = sprite;  //Referenz auf das TilingSprite im Array speichern
            sprite.y = layer.y;
        }
    }

    //Methode, die den Hintergrund bewegt. Durch die verschiedenen Geschwindigkeiten wird ein Tiefeneffekt erzeugt.
    scrollBackground(camera) {
        //Die x-Position wird immer dorthin gesetzt, wo die Kamera ist und mit einer Geschwidigkeit multipliziert.  
        for (const layer of this.currentScene) {
            layer.sprite.tilePosition.x = camera* layer.speed
        }
    }


}// endd class