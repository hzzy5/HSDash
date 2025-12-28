
//MODEL
// import { Player } from "../model/player.js";
import { Collision } from "../model/collision.js";
import { Coin } from "../model/coin.js";
import { levels } from "../model/levels.js";
import { Life } from "../model/life.js";
import { Spikes } from "../model/spikes.js";
import { Gumbas } from "../model/gumbas.js";

//VIEW
import { Renderer } from "../view/renderer.js"; 
import { PlayerRenderer } from "../view/playerRenderer.js";
import { CoinRenderer } from "../view/coinRenderer.js";
import { SceneRenderer } from "../view/sceneRenderer.js";
import { LifesRenderer } from "../view/lifesRenderer.js";
import { SpikesRenderer } from "../view/spikesRenderer.js";
import { GumbasRenderer } from "../view/gumbasRenderer.js";

export class LevelLoader {

    constructor(renderer, playerRenderer, coinRenderer, lifesRenderer, sceneRenderer, collision, coins, lifes, spikes, spikesRenderer, gumbas, gumbaRenderer) {
        this.renderer = renderer;
        this.playerRenderer = playerRenderer;
        this.coinRenderer = coinRenderer;
        this.sceneRenderer = sceneRenderer;
        this.lifesRenderer = lifesRenderer;
        this.spikesRenderer = spikesRenderer;
        this.gumbaRenderer = gumbaRenderer;


        this.collision = collision;
        this.player;
        this.coins = coins;
        this.lifes = lifes;
        this.spikes = spikes;
        this.gumbas = gumbas;

        this.levels = levels;

        this.TILE_SIZE = 32; //Konstante

        /*  Block Lookup
            Zeichen aus der Map = Objekt zum Anzeigen
            - sx ist die Spalte, sy ist die Reihe.
            - collide: Kann eine Kollision passieren?
            - solid: Kann der Spieler nicht durch?
        */
        this.blocks = {};
        this.blocks['#'] = {sx:0, sy:0, collide:true, solid:true, type:"player"}; //player
        this.blocks['x'] = {sx:0, sy:0, collide:true, solid:true, type:"block"}; //block
        this.blocks['o'] = {sx:0, sy:0, collide:false, solid:false, type:"münze"}; //münze
        this.blocks['-'] = {sx:0, sy:0, collide:true, solid:false, type:"block"}; //unsichtbarer Block
        this.blocks['l'] = {sx:0, sy:0, collide:false, solid:false, type:"leben"}; //leben
        this.blocks['s'] = {sx:0, sy:0, collide:true, solid:true, type:"spike"}; //stacheln
        this.blocks['g'] = {sx:0, sy:0, collide:true, solid:true, type:"gumba"}; //gumbas
    }

    //Methode, die das Level anhand der Map anzeigt.
    loadLevel(level) {
        let tile;
        let posX, posY;
        const mapLength = level.map.length; //Anzahl der Zeilen
        for (let y = 0; y < mapLength; y++) { //durch die Zeilen laufen
            const row = level.map[y];
            for (let x = 0; x < row.length; x++) {  //durch die Spalten laufen
                //Zeichen aus der Map lesen
                const char = row[x];    
                const blockInfo = this.blocks[char];

                // ignorieren wenn nicht definiert oder Leerzeichen
                if (!blockInfo) continue;

                posX = x * this.TILE_SIZE;
                posY = y * this.TILE_SIZE;

                // BLOCK => Kollisionsobjekt + zeichnen
                if (char === 'x') {
                    tile = this.renderer.createTile(posX, posY);
                }

                if (char === 'o') {
                    let coin = new Coin(posX, posY);
                    coin.sprite = this.coinRenderer.createCoinSprite(posX, posY);
                    this.coins.push(coin);
                }

                if (char === '-') {
                    tile = this.renderer.createInvisibleTile(posX, posY);
                }
                
                if (char === 'l') {
                    let life = new Life(posX, posY);
                    life.sprite = this.lifesRenderer.createLifeSprite(posX, posY);
                    this.lifes.push(life);
                }

                if (char === 's') {
                    let spike = new Spikes(posX, posY);
                    spike.sprite = this.spikesRenderer.createSpikeSprite(posX, posY);
                    this.spikes.push(spike);
                }

                if (char === 'g') {
                    let gumba = new Gumbas(posX, posY);
                    gumba.sprite = this.gumbaRenderer.createGumbaSprite(posX, posY);
                    this.gumbas.push(gumba);
                }

                
                if (tile && blockInfo.collide) {
                    this.collision.addCollider(tile);
                }
            }
            //Block reseten
            tile = null;
        }
            
    }

} //end class

