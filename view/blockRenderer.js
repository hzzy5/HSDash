/*Spezifische View-Klasse, die für die Darstellung der unterschiedlichen Blöcke zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

//Virtuelle Spielweltgrößen, unabhängig von der tatsächlichen Fenstergröße. So werden alle Positionen proportional zur virtuellen Welt gesetzt.
const VIRTUAL_WIDTH = 1536; //48*32, d.h. 48 Spalten passen in ein Screen
const VIRTUAL_HEIGHT = 800; //25*32, d.h. 25 Zeilen passen in einen Screen
const TILE_SIZE = 32;

export class BlockRenderer {
    constructor(container) {
        //Refrenz auf den Conatainer und screen, der in der PIXI.app liegt.
        this.world = container;

        //Block-Register für unterschiedliche Block-Arten
        this.blocks = {
            basic: {
                base: 0x8b8b8b,
                highlight: 0xaaaaaa,
                shadow: 0x5f5f5f
            },

            stone: {
                base: 0x7a7a7a,
                highlight: 0x9a9a9a,
                shadow: 0x555555
            },

            brownStone: {
                base: 0x8a4513,  
                highlight: 0xb96a2c,
                shadow: 0x5a2d0c
            },

            wood: {
                base: 0xa86b32,
                highlight: 0xc98a4a,
                shadow: 0x6b3f1c
            },

            metal: {
                base: 0x8f9ba8,
                highlight: 0xcfd9e3,
                shadow: 0x5c6670
            },

            ice: {
               base: 0xa8e6ff,
               highlight: 0xe8f9ff,
               shadow: 0x5bbad6 
            }
            

        };
    }


    //Methode um ein unsichtbaren 32x32-Tile zu erzeugen. 
    createInvisibleTile(x, y) {
        const gfx = new PIXI.Graphics();

        gfx.x = x;
        gfx.y = y;
        
        this.world.addChild(gfx);
        
        //return { x, y, width: TILE_SIZE, height: TILE_SIZE};
        return gfx;
    }

    //Methode um verschiedene Blöcke zu erstellen
    createTile(x,y, type) {
        //Wenn es den Blocktyp nicht gibt, return
        if (!this.blocks[type]) return null;

        //Eigenschaften speichern
        const { base, highlight, shadow } = this.blocks[type];

        const gfx = new PIXI.Graphics();
        // Base
        gfx.rect(0, 0, 32, 32).fill(base);

        // Highlight (oben)
        gfx.rect(0, 0, 32, 3).fill(highlight);

        // Highlight (links)
        gfx.rect(0, 0, 3, 32).fill(highlight);

        // Shadow (unten)
        gfx.rect(0, 29, 32, 3).fill(shadow);

        // Shadow (rechts)
        gfx.rect(29, 0, 3, 32).fill(shadow);

        gfx.x = x;
        gfx.y = y;
        
        this.world.addChild(gfx);
        
        // return { x, y, width: TILE_SIZE, height: TILE_SIZE};
        return gfx;
    }

} //end class