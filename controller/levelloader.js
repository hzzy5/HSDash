
//MODEL
// import { Player } from "../model/player.js";
import { Collision } from "../model/collision.js";
import { Coin } from "../model/coin.js";
import { levels } from "../model/levels.js";
import { Life } from "../model/life.js";
import { Spikes } from "../model/spikes.js";
import { Gumbas } from "../model/gumbas.js";
import { DBBro } from "../model/dbbro.js";
import { Goal } from "../model/goal.js";

//VIEW
// import { Renderer } from "../view/renderer.js"; 
// import { PlayerRenderer } from "../view/playerRenderer.js";
// import { CoinRenderer } from "../view/coinRenderer.js";
// import { SceneRenderer } from "../view/sceneRenderer.js";
// import { LifesRenderer } from "../view/lifesRenderer.js";
// import { SpikesRenderer } from "../view/spikesRenderer.js";
// import { GumbasRenderer } from "../view/gumbasRenderer.js";
// import { DBBroRenderer } from "../view/dbbroRenderer.js";
// import { GoalRenderer } from "../view/goalRenderer.js";


export class LevelLoader {

    constructor(renderer, playerRenderer, sceneRenderer, collision, coinRenderer, coins, coins5, lifesRenderer, lifes, spikesRenderer, spikes,  gumbaRenderer, gumbas, dbbroRenderer, dbbros, goalRenderer, goal, blockRenderer) {
        this.renderer = renderer;
        this.playerRenderer = playerRenderer;
        this.coinRenderer = coinRenderer;
        this.sceneRenderer = sceneRenderer;
        this.lifesRenderer = lifesRenderer;
        this.spikesRenderer = spikesRenderer;
        this.gumbaRenderer = gumbaRenderer;
        this.dbbroRenderer = dbbroRenderer;
        this.goalRenderer = goalRenderer;
        this.blockRenderer = blockRenderer

        this.collision = collision;
        //this.player;
        this.coins = coins;
        this.coins5 = coins5;
        this.lifes = lifes;
        this.spikes = spikes;
        this.gumbas = gumbas;
        this.dbbros = dbbros;
        this.goal = goal;

        this.levels = levels;
        this.levelSprites = []; //Array aus allen Sprite-Objekten, die in einem Level liegen

        this.TILE_SIZE = 32; //Konstante

                /*  Block Lookup als Set
            Zeichen aus der LevelMap = Element zum Anzeigen
        */
        this.blocks = new Set();
        this.blocks.add('x'); //block
        this.blocks.add('o'); //münze
        this.blocks.add('5'); //5coin
        this.blocks.add('-'); //unsichtbarer Block
        this.blocks.add('l'); //leben
        this.blocks.add('s'); //stacheln
        this.blocks.add('g'); //gumba
        this.blocks.add('b'); //DB-Bros
        this.blocks.add('z'); //Ziel
    }

    //Methode, die das Level anhand der Map anzeigt.
    loadLevel(level) {
        let posX, posY;
        const mapLength = level.map.length; //Anzahl der Zeilen
        for (let y = 0; y < mapLength; y++) { //durch die Zeilen laufen
            const row = level.map[y];
            for (let x = 0; x < row.length; x++) {  //durch die Spalten laufen
                //Zeichen aus der Map lesen
                const char = row[x];    

                // ignorieren, wenn es ein nicht definiertes Zeichen ist (auch Leerzeichen!)
                if (!this.blocks.has(char)) continue;

                posX = x * this.TILE_SIZE;
                posY = y * this.TILE_SIZE;

                if (char === 'x') {
                    let tileSprite = this.blockRenderer.createTile(posX, posY, "brownStone");
                    if (tileSprite) {
                        this.collision.addCollider(tileSprite);
                        this.levelSprites.push(tileSprite);
                    }
                }

                else if (char === 'o') {
                    let coin = new Coin(posX, posY);
                    coin.sprite = this.coinRenderer.createCoinSprite(posX, posY);
                    this.coins.push(coin);
                    this.levelSprites.push(coin.sprite);
                }

                else if (char === '5') {
                    let coin5 = new Coin(posX, posY);
                    coin5.sprite = this.coinRenderer.create5CoinSprite(posX, posY);
                    this.coins5.push(coin5);
                    this.levelSprites.push(coin5.sprite);
                }

                else if (char === '-') {
                    let tileSprite = this.blockRenderer.createInvisibleTile(posX, posY);
                    if (tileSprite) {
                        this.collision.addCollider(tileSprite);
                        this.levelSprites.push(tileSprite);
                    }
                }
                
                else if (char === 'l') {
                    let life = new Life(posX, posY);
                    life.sprite = this.lifesRenderer.createLifeSprite(posX, posY);
                    this.lifes.push(life);
                    this.levelSprites.push(life.sprite);
                }

                else if (char === 's') {
                    let spike = new Spikes(posX, posY);
                    spike.sprite = this.spikesRenderer.createSpikeSprite(posX, posY);
                    this.spikes.push(spike);
                    this.levelSprites.push(spike.sprite);
                }

                else if (char === 'g') {
                    let gumba = new Gumbas(posX, posY);
                    gumba.sprite = this.gumbaRenderer.createGumbaSprite(posX, posY);
                    this.gumbas.push(gumba);
                    this.levelSprites.push(gumba.sprite);
                }

                else if (char === 'b') {
                    let dbbro = new DBBro(posX, posY);
                    dbbro.sprite = this.dbbroRenderer.createDBBroSprite(posX, posY);
                    this.dbbros.push(dbbro);
                    this.levelSprites.push(dbbro.sprite);
                }

                else if (char === 'z') {
                    const goal = level.goal; //Ziel je nach Level holen
                    let goalPole = new Goal(posX, posY, goal.width, goal.height, goal.offsetY);
                    goalPole.sprite = this.goalRenderer.createGoalSprite(goalPole, goal.type);
                    this.goal.push(goalPole);
                    this.levelSprites.push(goalPole.sprite);
                }
            }
        }      
    }


    //Methode, um das alte Level zu entfernen
    clearLevel() {
        let anz = 0;
        // Sprites entfernen
        this.levelSprites.forEach(sprite => {
            if (sprite && !sprite.destroyed) {
                sprite.destroy();
                anz++;
            } else {
                console.warn("Kein destroy():", obj);
            }    
        });
        console.log("Sprites zerstört: " + anz); 
        
        this.levelSprites.length = 0;
        
        //Model-Arrays leeren
        this.coins.length = 0;
        this.coins5.length = 0;
        this.lifes.length = 0;
        this.spikes.length = 0;
        this.gumbas.length = 0;
        this.dbbros.length = 0;
        this.goal.length = 0;
        this.collision.clear();
    }



} //end class

