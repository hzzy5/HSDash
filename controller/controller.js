//MODEL
import { Player } from "../model/player.js";
import { Coin } from "../model/coin.js";
import { Collision } from "../model/collision.js";

//VIEW
import { Renderer } from "../view/renderer.js"; 
import { PlayerRenderer } from "../view/playerRenderer.js";
import { CoinRenderer } from "../view/coinRenderer.js";
import { SceneRenderer } from "../view/sceneRenderer.js";

//CONTROLLER
import { SoundController } from "./soundcontroller.js";
//import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

// Einfache Input-Verfolgung und zentralisierte Update-Funktion
export class Controller {

    //Instanzvariablen
    renderer;
    playerRenderer;
    coinRenderer;
    sceneRenderer;

    collision;
    
    player;
    playerSprite;
    enemy;
    enemySprite;

    leftBound;
    rightBound;

    keys = {};
    jumpRequested = false;
    dashRequested = false;
    DEBUG = true;
    lastJumpY = null;
    lastJumpTime = 0;

    // Collider-Liste (vierecke mit x,y,width,height)
    colliders = []; //Für kollisionen
    coins = [];  // Liste aller Münzen im Level

    //sound
    sound;
    buttonMusikAus;

     


    //methode um das ganze Spiel zu initialisieren. Hier werden die Methoden aus der View usw aufgerufen. 
    async initController() {
        //MODEL:
        this.player = new Player("Spieler1", 100, 100);
        this.collision = new Collision();

        //VIEW:
        this.renderer = new Renderer();
        await this.renderer.initRenderer(); //hier wird die PIXI.app erzeugt
        //Spiel-Elemente laden
        await this.renderer.loadAssets();

        this.playerRenderer = new PlayerRenderer(this.renderer); //alle Renderer arbeiten mit derselben PIXI.app
        await this.playerRenderer.initAnimations();
        this.coinRenderer = new CoinRenderer(this.renderer);
        this.sceneRenderer = new SceneRenderer(this.renderer);
        
        //Szene erstellen
        await this.sceneRenderer.createBackground();

        //Player als Sprite erstellen
        // this.playerSprite = this.playerRenderer.createSprite("playerJumpJSON");
        // this.playerRenderer.renderPlayer(this.playerSprite, this.player.x, this.player.y);

        //Größen synchronisieren
        // this.player.setWidthAndHeight(this.playerSprite.width, this.playerSprite.height);

        //Spielgrenzen erstellen
        this.leftBound = { x: -10, y: 0, width: 10, height: window.innerHeight };
        this.collision.addCollider(this.leftBound);
        this.leftBound = this.sceneRenderer.createBound(this.leftBound.x, this.leftBound.y, this.leftBound.width, this.leftBound.height);

        this.rightBound = { x: window.innerWidth, y: 0, width: 10, height: window.innerHeight };
        this.collision.addCollider(this.rightBound);
        this.rightBound = this.sceneRenderer.createBound(this.rightBound.x, this.rightBound.y, this.rightBound.width, this.rightBound.height);

        //Münzen erstellen
        const coin1 = new Coin(300, window.innerHeight - 350, 32, 32);
        coin1.sprite = this.coinRenderer.createCoinSprite(coin1.x, coin1.y);
        this.coins.push(coin1);

        const coin2 = new Coin(600, window.innerHeight - 450, 32, 32);
        coin2.sprite = this.coinRenderer.createCoinSprite(coin2.x, coin2.y);
        this.coins.push(coin2);

        const coin3 = new Coin(900, window.innerHeight - 450, 32, 32);
        coin3.sprite = this.coinRenderer.createCoinSprite(coin3.x, coin3.y);
        this.coins.push(coin3);

        
        this.totalCoins = this.coins.length;  
        this.collectedCoins = 0;
        this.coinRenderer.createCoinHud(this.totalCoins);
        
        // //Beispiel-Plattform hinzufügen (sichtbar und kollisionsfähig)
        // const plat = { x: 100, y: window.innerHeight - 125, width: window.innerWidth - 1000, height: 10 };
        // this.collision.addCollider(plat);
        // this.scenereRenderer.createPlatform(plat.x, plat.y, plat.width, plat.height);

        // const plat2 = { x: 1000, y: window.innerHeight - 450, width: 160, height: 10 };
        // this.collision.addCollider(plat2);
        // this.scenereRenderer.createPlatform(plat2.x, plat2.y, plat2.width, plat2.height);

        // const plat3 = { x: 1195, y: window.innerHeight - 150, width: 160, height: 10 };
        // this.collision.addCollider(plat3);
        // this.scenereRenderer.createPlatform(plat3.x, plat3.y, plat3.width, plat3.height);
        

        //SoundController initialisieren  
        this.sound = new SoundController();
        await this.sound.init();
        
        //SoundButton
        this.buttonMusikAus = this.renderer.createSprite("soundAus");
        this.renderer.renderSprite(this.buttonMusikAus, 20, 10);
        this.buttonMusikAus.width = window.innerWidth / 8;
        this.buttonMusikAus.height = window.innerHeight / 10;
        //damit den Sprite wie einen Button nutzten kann
        //interaktivität sicherstellen
        this.buttonMusikAus.eventMode = "static";
        //für Cursor als Button anzeigen 
        this.buttonMusikAus.cursor = "pointer";
        //EventListener hinzufügen
        this.buttonMusikAus.on("pointertap", () => {
            console.log("Button wurde angeklickt");
            this.sound.switchOnOff();
        });

        //ABFRAGEN
        document.addEventListener("keydown", (e) => this.keyIsDown(e));
        document.addEventListener("keyup", (e) => this.keyIsUp(e));        
    }
    /*vllt iwie optimieren: nur zeichnen, wenn etwas geändert wurde.*/
    

    //=== GAMELOOP ============================================================================================
    //Methode, die alle Update-Funktionen pro Frame aufurft. 
    gameLoop(dt) {
      //Spieler updaten (Sprung, Dash, Bewegung)
      this.updatePlayer(dt);
      this.checkCoinCollection();//Münzeneinsammlung prüfen
      
      //Hintergrund scrollen
      this.scrollBackground(dt);
    }

    
    //=== KEY DOWN ============================================================================================
    keyIsDown(e) {  
        // Normalize key names to lower-case to avoid issues when Shift is held ("A" vs "a")
        const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
        this.keys[k] = true;
        console.log("Key down:", k, this.keys);
        // Wenn 'w' gedrückt wird: dash in der Luft; auf dem Boden macht 'w' nichts
        if (k === 'w') {
          if (this.player && !this.player.onGround) {
            this.dashRequested = true; //Man kann nur dashen wenn es einen player gibt und dieser nicht auf dem boden ist
            if(this.DEBUG) console.log('[controller] dashRequested set (w pressed) y=', this.player ? this.player.y : null);
          }
        }
        // Space oder ArrowUp immer als Sprung-Request
        if (k === ' ' || k === 'arrowup') {
          this.jumpRequested = true; // Man kann nur springen wenn es einen player gibt und dieser auf dem boden ist
        } 
    }

    //=== KEY UP ============================================================================================
    keyIsUp(e) {
      //Wenn taste nicht mehr gedrückt dann muss das im array auch wieder zurückgesetzt werden
      const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
      this.keys[k] = false;
      //Player-Variablen zurücksetzen
      this.player.turningLeft = true;
      this.player.turningRight = true;
    }

    
    //=== UPDATE PLAYER ============================================================================================
    // Wird vom Renderer-Ticker mit dt (Sekunden) aufgerufen
    updatePlayer(dt) {

      //Wenn es keinen Spieler zum updaten gibt
      if (!this.player) return null; 

      //=== HORIZONTALE BEWEGUNG ===
      let dir = 0; //Richtung: -1 = links, 1 = rechts, 0 = keine Bewegung -> wird nach jedem frame neu berechnet
      if (this.keys['a'] || this.keys['arrowleft']) {
        dir -= 1; // -= weil es nach jedem frame neu berechnet wird und so es möglich ist dass beide tasten gedrückt werden
        this.player.turningLeft = true;
      }
      if (this.keys['d'] || this.keys['arrowright']) {
        dir += 1; //bei += genauso ( 0 += 1 = 1 -= 1 = 0)
        this.player.turningRight = true;
      }

      //=== SPRINT (Shift) ===
      const sprintHeld = !!this.keys['shift'];
      // Bestimme effektive Geschwindigkeit
      const baseSpeed = (this.player.speed !== undefined) ? this.player.speed : 220;
      const sprintSpeed = (this.player.sprintSpeed !== undefined) ? this.player.sprintSpeed : Math.round(baseSpeed * 1.8);
      const currentSpeed = sprintHeld ? sprintSpeed : baseSpeed; 
     


      // Updated facing variable für den dash damit dash nicht 0 sein kann (sonst dash in die richtung in die man vorher sich bewegt hat)
      if (dir !== 0) {
        this.player.facing = dir;
      }

      //=== DASH ===
      // Update dash timers
      this.player.updateDashTime(dt);

      // Wenn Dash angefordert wurde und wir in der Luft sind, starte den Dash (sofern verfügbar)
      if (this.dashRequested) {
        this.player.dash(dir);
        this.dashRequested = false;
      }

      // Bestimme horizontale Bewegung: wenn gerade gedasht wird, verwende Dash-Geschwindigkeit
      let dx = 0; // horizontale veränderung
      if (this.player.dashTimeRemaining > 0) {
        const dashSpeed = (this.player.dashSpeed !== undefined) ? this.player.dashSpeed : 800;
        dx = this.player.dashDir * dashSpeed * dt;
        // if (this.DEBUG) {
        //   //console.log('[controller] dashing', { dx, dashSpeed, dt, dashDir: player.dashDir, y: player.y, lastJumpY });
        //   if (this.lastJumpY !== null && this.player.y > this.lastJumpY + 1) {
        //     //console.log('[controller] player is below jump-start Y', { y: player.y, lastJumpY });
        //   }
        // }
      } else {
        // Normale Bewegung
        dx = dir * currentSpeed * dt;
      }

      // Horizontal bewegen
      //console.log("dir:", dir, "currentSpeed:", currentSpeed, "dt:", dt, "dx:", dx);
      this.player.move(dx, 0); 

      //=== KOLLISIONSAUFLÖSUNG === 
      // Kollisionen nach horizontaler Bewegung lösen
      if (dx !== 0) {
        for (const c of this.collision.colliders) { // jeden collider durchgehen
          if (this.collision.collision(this.player, c)) { //Kollision?
            // einfache Auflösung: je nach Bewegungsrichtung an die Kante setzen
            if (dx > 0) { // bewegt sich nach rechts
              this.player.x = c.x - this.player.width; // Position wird einfach an kante gesetzt
            } else if (dx < 0) { // bewegt sich nach links
              this.player.x = c.x + c.width; // Position wird einfach an kante gesetzt
            }
            // Falls wir gerade dashen, abbrechen
            this.player.dashTimeRemaining = 0;
            // sync helper coords#
            this.player.updateHitbox();
            // this.player.x1 = this.player.x;
            // this.player.x2 = this.player.x + this.player.width;
          }
        }
      }

      //=== VERTIKALE BEWEGUNG ===
      //SPRINGEN: wenn eine Sprunganforderung vorliegt und wir auf dem Boden sind
      if (this.jumpRequested) {
        this.sound.jump();
        this.player.jump();

        // Merke Start-Y des Sprungs für Debugging
        // this.lastJumpY = this.player.y;
        // this.lastJumpTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        //if (this.DEBUG) console.log('[controller] jump triggered, startY=', this.lastJumpY, 'jumpVelocity=', this.player.vy);
      }
      //Sprung wurde verarbeitet
      this.jumpRequested = false;
      //Gravitation. Der Spieler fällt immer nach unten
      this.player.applyGravity(dt);

      //=== KOLLISIONSAUFLÖSUNG ===
      // Kollisionen nach vertikaler Bewegung lösen
      if (this.player.vy !== 0) { //eiegentlich fast immer nicht 0 wegen gravity
        for (const c of this.collision.colliders) { // jeden collider durchgehen
          if (this.collision.collision(this.player, c)) { //Hat eine Kollision stattgefunden?
            // einfache Auflösung: je nach Bewegungsrichtung an die Kante setzen
            if (this.player.vy > 0) {
              // landet auf Collider
              this.player.y = c.y - this.player.height;
              this.player.vy = 0;
              this.player.onGround = true;
              this.player.jumpCount = 0; // JumpCount zurücksetzen
              // beim Landen wieder In-Air-Dash verfügbar machen
              this.player.airDashAvailable = true;
            } else if (this.player.vy < 0) {
              // trifft Decke
              this.player.y = c.y + c.height;
              this.player.vy = 0;
            }
            // Hilfe Koordinaten syncen
            this.player.updateHitbox();
            // this.player.y1 = this.player.y;
            // this.player.y2 = this.player.y + this.player.height;
          }
        }
      }
      
      //=== PLAYER STATE ===
      //Wenn der Player gerade dasht:
      if (this.player.dashTimeRemaining > 0) {
        this.player.setState("dash");
      } 
      //Wenn der Player nicht auf dem Boden ist
      else if (!this.player.onGround) {
        //und springt
        if (this.player.vy < 0) {
          this.player.setState("jump");
        //vy > 0, d.h. fällt
        } else {
          this.player.setState("fall"); //funktioniert leider nur nach jump. DEBUG
        }
      } else {
        //Wenn der Player sich bewegt
        if (dir !== 0) {
          //Sprint hat die höchste Priorität, d.h. egal ob walk gesetzt ist, run wird immer ausgeführt, sobald shift gedrückt ist.
          if (sprintHeld) {
            this.player.setState("run");
          } else {
            this.player.setState("walk");
          }
        } else {
          //dir == 0, d.h. keine Bewegung
          this.player.setState("idle");
        }
      }

      this.playerRenderer.renderPlayer(this.player.x, this.player.y, this.player.x1, this.player.y1, this.player.width, this.player.height); //player rendern
      this.playerRenderer.updatePlayerAnimation(this.player.getState(), this.player.facing); //Player-animation abspielen
      console.log(this.player.x, this.player.y, this.player.getState(), this.player.facing);
    }


    //=== UPDATE BACKGROUND ============================================================================================
    scrollBackground(dt) {
      //Scrollen, wenn der Player die Hälfte des rechten Bildschirms erreicht
      const SCROLL_THRESHOLD = window.innerWidth / 2;

      if((this.player.getState() == "walk" || this.player.getState() == "run") && this.player.x > SCROLL_THRESHOLD) {
        this.sceneRenderer.scrollBackground(this.player.facing, dt);
        //Hier wird unterschieden: 
        //--> gehen wir nach links, d.h. zurück, dann muss sich der Hintergrund wieder nach rechts bewegen.
        //--> gehen wir nach rechts, d.h. vorne, dann muss sich der Hintergrund nach links bewegen.
      }
    }

    //=== UPDATE COINS ============================================================================================
    checkCoinCollection() {
        for (const coin of this.coins) {
           if (coin.collected) continue;

          // Kollision prüfen
          if (this.collision.collision(this.player, coin)) {
            console.log("Coin eingesammelt!");
            coin.collect();
        
            //Soundeffect
            this.sound.coinCollected();
            
            this.coinRenderer.showFloatingText("+1", coin.x, coin.y - 20);
            this.collectedCoins++;
            this.coinRenderer.updateCoinHud(this.collectedCoins, this.totalCoins);
            


          }
        }
    }

    

} //end class


//______________________________________________________________________________________________________________
/*
  if (this.colliders.check(player, somePlatform)) {
    // Spieler steht auf Plattform: Y Koordinate = Plattform
}
*/

// // Initialisiert den Controller mit der Spielerinstanz (keine eigene Loop mehr)
// export function initController(playerInstance) {
//   player = playerInstance;
//   // Default Ground-Collider (entspricht Renderer ground)
//   const computeGround = () => {
//     // If renderer created a groundTile, use its position/height so visual and collider match
//     try {
//       if (window.app && window.app.parallaxLayers && window.app.parallaxLayers.groundTile) {
//         const gt = window.app.parallaxLayers.groundTile;
//         const gh = gt.height || Math.max(32, Math.round(window.innerHeight * 0.12));
//         const gy = (typeof gt.y === 'number') ? gt.y : (window.innerHeight - gh);
//         return { x: 0, y: gy, width: window.innerWidth, height: gh };
//       }
//     } catch (e) {
//       // fallthrough to default
//     }
//     const gh = Math.max(32, Math.round(window.innerHeight * 0.12));
//     return { x: 0, y: window.innerHeight - gh, width: window.innerWidth, height: gh };
//   };
//   colliders = [ computeGround() ];
//   // Bei Resize Ground anpassen
//   window.addEventListener('resize', () => {
//     colliders[0] = computeGround();
//   });
// }

