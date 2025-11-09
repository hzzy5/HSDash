import { Player } from "../model/player.js";
import { Enemy } from "../model/enemy.js";
import { Renderer } from "../view/renderer.js"; 
//import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

export class Controller {

    //Instanzvariablen
    renderer;
    background;
    clouds;
    hill2;
    hill1;
    trees;
    bushes;
    ground;
    player;
    playerSprite;
    enemy;
    enemySprite;

    //Für den Hintergrund 
    backgroundX = 0;
    backgroundSpeed = -10; //nach links bewegen

    //methode um das ganze Spiel zu initialisieren. Hier werden die Methoden aus der View usw aufgerufen. 
    async init() {
        //
        this.renderer = new Renderer();
        await this.renderer.init();

        //Spiel-Elemente laden
        await this.renderer.loadAssets();

        //Hintergrund aufbauen
        this.background = this.renderer.createTilingSprite("background", window.innerWidth, 300);
        this.background.y = 0;
        this.clouds = this.renderer.createTilingSprite("clouds", window.innerWidth, 300);
        this.clouds.y = -150;
        this.hill2 = this.renderer.createTilingSprite("hill2", window.innerWidth, 280);
        this.hill2.y = -450;
        this.hill1 = this.renderer.createTilingSprite("hill1", window.innerWidth, 180);
        this.hill1.y = -400;
        this.trees = this.renderer.createTilingSprite("trees", window.innerWidth, 100);
        this.trees.y = -450;
        this.bushes = this.renderer.createTilingSprite("bushes", window.innerWidth, 100);
        this.bushes.y = -410;
        this.ground = this.renderer.createTilingSprite("ground", window.innerWidth, 100);
        this.ground.y = -500;
        

        //Spiel-Elemente erzeugen
        this.player = new Player("Spieler1", 50, 450, 20, 12);
        this.enemy = new Enemy("Gegner1", 1500 ,640, 10, 0)

        this.playerSprite = this.renderer.createSprite("player");
        this.renderer.positionSprite(this.playerSprite, this.player.x, this.player.y);
        // player.anchor.set(0.5); //Mittelpunkt im Bild

        this.enemySprite = this.renderer.createSprite("enemy");
        this.renderer.positionSprite(this.enemySprite, this.enemy.x, this.enemy.y);

        //Abfrage
        window.addEventListener("keydown", (e) => this.keyIsDown(e))

        //Gameloop starten
        this.renderer.app.ticker.add((delta) => this.gameLoop(delta));;
    }
    
    //gameloop starten
    gameLoop(delta) {
        this.updateBackground();

        //Es muss pro Frame geprüft werden, ob der z.B. Spieler gesprungen ist
        this.player.updatePosition(); 
        this.renderer.positionSprite(this.playerSprite, this.player.x, this.player.y);
    }


    //Methode, die den Hintergrund bewegt. Durch die verschiedenen Geschwindigkeiten wird ein Tiefeneffekt erzeugt.
    updateBackground() {
        this.backgroundX = (this.backgroundX + this.backgroundSpeed);
        this.background.tilePosition.x = this.backgroundX / 9;
        this.clouds.tilePosition.x = this.backgroundX / 9;
        this.hill2.tilePosition.x = this.backgroundX / 7;
        this.hill1.tilePosition.x = this.backgroundX / 6;
        this.trees.tilePosition.x = this.backgroundX / 4;
        this.bushes.tilePosition.x = this.backgroundX / 2;
        this.ground.tilePosition.x = this.backgroundX;
    }
    
    //STATISCHE FUNKTIONEN
    //Methode, die prüft, ob eine Kollision stattgefunden hat
    //Collision Detection player vs enemy 
    static collision(a, b) {
        let aBox = a.getBounds();
        let bBox = b.getBounds();

        return aBox.x-45 + aBox.width > bBox.x &&   //hier ungenau: -35, da es noch transparente Ränder gibt. 
            aBox.x-45 < bBox.x + bBox.width &&
            aBox.y + aBox.height > bBox.y &&
            aBox.y < bBox.y + bBox.height;
    }

    keyIsDown(e) {
        if(e.keyCode === 32 || e.code === 'Space' && this.player.y >= this.player.ground) {
            console.log("Leertaste ("+ e.keyCode +", " + e.code + ") ist gedrückt.");
            this.player.jump(); 
            this.renderer.positionSprite(this.playerSprite, this.player.x, this.player.y);  
        }
    }

} //end class
