import { Player } from "../model/player.js";
import { Enemy } from "../model/enemy.js";
import { Renderer } from "../view/renderer.js"; 
import { Collision } from "../model/collision.js";
//import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

// Einfache Input-Verfolgung und zentralisierte Update-Funktion
export class Controller {

    //Instanzvariablen
    renderer;
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

     


    //methode um das ganze Spiel zu initialisieren. Hier werden die Methoden aus der View usw aufgerufen. 
    async initController() {
        //MODEL:
        this.player = new Player("Spieler1", 50, 50);
        // this.enemy = new Enemy("Gegner1", 1500, window.innerHeight - 100)
        this.collision = new Collision();

        //VIEW:
        this.renderer = new Renderer();
        await this.renderer.initRenderer();
        //Spiel-Elemente laden
        await this.renderer.loadAssets();
        //Szene erstellen
        await this.renderer.createBackground();
        
        //Player als Sprite erstellen
        this.playerSprite = this.renderer.createSprite("player");
        this.renderer.renderPlayer(this.playerSprite, this.player.x, this.player.y);

        //Größen synchronisieren
        this.player.setWidthAndHeight(this.playerSprite.width, this.playerSprite.height)

        //Spielgrenzen erstellen
        this.leftBound = { x: -10, y: 0, width: 10, height: window.innerHeight };
        this.collision.addCollider(this.leftBound);
        this.leftBound = this.renderer.createBound(0, 0, 1, window.innerHeight);

        this.rightBound = { x: window.innerWidth, y: 0, width: 10, height: window.innerHeight };
        this.collision.addCollider(this.rightBound);
        this.rightBound = this.renderer.createBound(0, 0, 1, window.innerHeight);


        // Beispiel-Plattform hinzufügen (sichtbar und kollisionsfähig)
        const plat = { x: 40, y: window.innerHeight - 100, width: window.innerWidth, height: 10 };
        this.collision.addCollider(plat);
        this.renderer.createPlatform(plat.x, plat.y, plat.width, plat.height);

        // const plat2 = { x: 400, y: window.innerHeight - 150, width: 160, height: 10 };
        // this.collision.addCollider(plat2);
        // this.renderer.createPlatform(plat2.x, plat2.y, plat2.width, plat2.height);

        // const plat3 = { x: 1195, y: window.innerHeight - 150, width: 160, height: 10 };
        // this.collision.addCollider(plat3);
        // this.renderer.createPlatform(plat3.x, plat3.y, plat3.width, plat3.height);


        //ABFRAGEN
        document.addEventListener("keydown", (e) => this.keyIsDown(e));
        document.addEventListener("keyup", (e) => this.keyIsUp(e));        
    }
    /*vllt iwie optimieren: nur zeichnen, wenn etwas geändert wurde.*/
    
    //=== GAMELOOP ============================================================================================
    //gameloop starten
    gameLoop(dt) {
      //Spieler updaten (Sprung, Dash, Bewegung)
      this.updatePlayer(dt);
      
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
        if (k === ' ') {
          if (k === ' ' || k === 'arrowup')
            this.jumpRequested = true; // Man kann nur springen wenn es einen player gibt und dieser auf dem boden ist
        } 
    }

    //=== KEY UP ============================================================================================
    keyIsUp(e) {
      //Wenn taste nicht mehr gedrückt dann muss das im array auch wieder zurückgesetzt werden
      const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
      this.keys[k] = false;
    }

    

    //=== UPDATE PLAYER ============================================================================================
    // Wird vom Renderer-Ticker mit dt (Sekunden) aufgerufen
    updatePlayer(dt) {

      //Wenn es keinen Spieler zum updaten gibt
      if (!this.player) return null; 

      //HORIZONTALE BEWEGUNG
      let dir = 0; //Richtung: -1 = links, 1 = rechts, 0 = keine Bewegung -> wird nach jedem frame neu berechnet
      if (this.keys['a'] || this.keys['arrowleft']) dir -= 1; // -= weil es nach jedem frame neu berechnet wird und so es möglich ist dass beide tasten gedrückt werden
      if (this.keys['d'] || this.keys['arrowright']) dir += 1; //bei += genauso ( 0 += 1 = 1 -= 1 = 0)

      // Sprint (Shift) erkennen
      // Shift normalized is 'shift'
      const sprintHeld = !!this.keys['shift'];
      // Bestimme effektive Geschwindigkeit
      const baseSpeed = (this.player.speed !== undefined) ? this.player.speed : 220;
      const sprintSpeed = (this.player.sprintSpeed !== undefined) ? this.player.sprintSpeed : Math.round(baseSpeed * 1.8);
      const currentSpeed = sprintHeld ? sprintSpeed : baseSpeed; 

      // Updated facing variable für den dash damit dash nicht 0 sein kann (sonst dash in die richtung in die man vorher sich bewegt hat)
      if (dir !== 0) this.player.facing = dir;

      //DASH
      // Update dash timers
      if (this.player.dashTimeRemaining > 0) this.player.dashTimeRemaining = Math.max(0, this.player.dashTimeRemaining - dt);
      if (this.player.dashCooldownRemaining > 0) this.player.dashCooldownRemaining = Math.max(0, this.player.dashCooldownRemaining - dt);

      // Wenn Dash angefordert wurde und wir in der Luft sind, starte den Dash (sofern verfügbar)
      if (this.dashRequested) {
        if (!this.player.onGround && this.player.dashCooldownRemaining <= 0 && this.player.dashTimeRemaining <= 0) {
          // Allow a single in-air dash per airborne period (falling or rising).
          if (this.player.airDashAvailable) {
            this.player.dashTimeRemaining = (this.player.dashDuration !== undefined) ? this.player.dashDuration : 0.12;
            this.player.dashCooldownRemaining = (this.player.dashCooldown !== undefined) ? this.player.dashCooldown : 0.6;
            this.player.dashDir = (dir !== 0) ? dir : this.player.facing || 1;
            // consume the in-air dash for this airborne period
            this.player.airDashAvailable = false;
            //if (this.DEBUG) console.log('[controller] dash started (in-air)', { dashDir: player.dashDir, vy: player.vy });
          } else {
            //if (this.DEBUG) console.log('[controller] dash denied (in-air already used)', { airDashAvailable: player.airDashAvailable, vy: player.vy });
          }
        }
        this.dashRequested = false;
      }

      // Bestimme horizontale Bewegung: wenn gerade gedasht wird, verwende Dash-Geschwindigkeit
      let dx = 0; // horizontale veränderung
      if (this.player.dashTimeRemaining > 0) {
        const dashSpeed = (this.player.dashSpeed !== undefined) ? this.player.dashSpeed : 800;
        dx = this.player.dashDir * dashSpeed * dt;
        if (this.DEBUG) {
          //console.log('[controller] dashing', { dx, dashSpeed, dt, dashDir: player.dashDir, y: player.y, lastJumpY });
          if (this.lastJumpY !== null && this.player.y > this.lastJumpY + 1) {
            //console.log('[controller] player is below jump-start Y', { y: player.y, lastJumpY });
          }
        }
      } else {
        // Normale Bewegung
        dx = dir * currentSpeed * dt;
      }

      // Horizontal bewegen
      console.log("dir:", dir, "currentSpeed:", currentSpeed, "dt:", dt, "dx:", dx);
      this.player.move(dx, 0); 

      // KOLLISIONEN 
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
            // sync helper coords
            this.player.x1 = this.player.x;
            this.player.x2 = this.player.x + this.player.width;
          }
        }
      }

      // VERTIKALE BEWEGUNG

      // SPRINGEN: wenn eine Sprunganforderung vorliegt und wir auf dem Boden sind
      if (this.jumpRequested && this.player.onGround) {
        // Merke Start-Y des Sprungs für Debugging
      this.lastJumpY = this.player.y;
      this.lastJumpTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      this.player.vy = (this.player.jumpVelocity !== undefined) ? this.player.jumpVelocity : -480;
      this.player.onGround = false;
      //if (this.DEBUG) console.log('[controller] jump triggered, startY=', this.lastJumpY, 'jumpVelocity=', this.player.vy);
          //hier einfach jump aufrufen??
      }
      // Springanforderung wurde verarbeitet (einmaliges Trigger)
      this.jumpRequested = false;

      // GRAVITY + VERTICAL
      const GRAVITY = 1200; // px/s^2
      this.player.vy += GRAVITY * dt;
      this.player.move(0, this.player.vy * dt);

      // Kollisionen nach vertikaler Bewegung lösen
      if (this.player.vy !== 0) { //eiegentlich fast immer nicht 0 wegen gravity
        for (const c of this.collision.colliders) { // jeden collider durchgehen
          if (this.collision.collision(this.player, c)) { //Kollision?
            // einfache Auflösung: je nach Bewegungsrichtung an die Kante setzen
            if (this.player.vy > 0) {
              // landet auf Collider
              this.player.y = c.y - this.player.height;
              this.player.vy = 0;
              this.player.onGround = true;
              // beim Landen wieder In-Air-Dash verfügbar machen
              this.player.airDashAvailable = true;
            } else if (this.player.vy < 0) {
              // trifft Decke
              this.player.y = c.y + c.height;
              this.player.vy = 0;
            }
            // Hilfe Koordinaten syncen
            this.player.y1 = this.player.y;
            this.player.y2 = this.player.y + this.player.height;
          }
        }
      }

      //return this.player;
    }


    //=== UPDATE PLAYER ============================================================================================
    scrollBackground(dt) {
      //Nach rechts scrollen, wenn der Player die Hälfte des rechten Bildschirms erreicht
      if(this.player.x > window.innerWidth / 2) {
        this.renderer.scrollBackground(dt);
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

