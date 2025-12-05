import { Player } from "../model/player.js";
import { Enemy } from "../model/enemy.js";
import { Renderer } from "../view/renderer.js"; 
import { Collision } from "../model/colliders.js";
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

    keys = {};
    jumpRequested = false;
    dashRequested = false;
    // Collider-Liste (vierecke mit x,y,width,height)
    colliders = []; //Für kollisionen


    //methode um das ganze Spiel zu initialisieren. Hier werden die Methoden aus der View usw aufgerufen. 
    async initController() {
        //MODEL:
        this.player = new Player("Spieler1", 50, 450);
        this.enemy = new Enemy("Gegner1", 1500 ,640)
        this.collision = new Collision();

        //VIEW:
        this.renderer = new Renderer();
        await this.renderer.initRenderer();
        //Spiel-Elemente laden
        await this.renderer.loadAssets();
        //Szene erstellen
        await this.renderer.createBackground();
        
        this.playerSprite = this.renderer.createSprite("player");
        this.renderer.renderPlayer(this.playerSprite, this.player.x, this.player.y);
        // player.anchor.set(0.5); //Mittelpunkt im Bild

        this.enemySprite = this.renderer.createSprite("enemy");
        this.renderer.renderPlayer(this.enemySprite, this.enemy.x, this.enemy.y);
        
        //ABFRAGEN
        document.addEventListener("keydown", (e) => this.keyIsDown(e));
        document.addEventListener("keyup", (e) => this.keyIsUp(e));

        //GAMELOOP
        //this.renderer.app.ticker.add((delta) => this.gameLoop(delta));
        //this.startGameLoop(this.updatePlayer.bind(this));
        // this.startGameLoop((dt) => this.updatePlayer.bind(dt));
        this.renderer.app.ticker.add((ticker) => {
          const dt = ticker.elapsedMS / 1000; // = Sekunden
          this.gameLoop(dt);
        });
        
    }
    /*vllt iwie optimieren: nur zeichnen, wenn etwas geändert wurde.*/
    
    //gameloop starten
    gameLoop(delta) {
      //dt in Sekunden
      const dt = delta / 60 || 1;

      //Spieler updaten (Sprung, Dash, Bewegung)
      this.updatePlayer(dt);
      
      //Spieler pro Frame updaten 
      this.player.update(); 
      if(this.player) {
        this.renderer.renderPlayer(this.playerSprite, this.player.x, this.player.y);
      }
      
      // //Den Hintergrund nur scrollen, wenn der Spieler sich in der Mitte des Spielfelds befindet
      // if(this.player.x > window.innerWidth / 2)
      //   this.renderer.scrollBackground();
    }

    // startGameLoop(updateFunction) { //updateFunction kommt aus controller.js
    //   this.renderer.app.ticker.add((delta) => {     // von PIXI -> wie requestAnimationFrame()
    //     // delta -> zeit seit dem letzen Frame ind PIXI-einheiten (60 FPS -> delta=1)
    //     const dt = delta / 60; // grobe Sekunden seit letztem Frame 
    //     // ohne dt würde die geschwindigkeit von der FPS abhängen also je höher die FPS desto schneller der Spieler
    //     updateFunction(dt); // Controller aktualisiert Model und liefert Player zurück
    //     if (this.player) this.renderer.renderPlayer(this.playerSprite, this.player.x, this.player.y); // Renderer rendert den Spieler nur wenn es einen gibt
    //   });
    // }



    keyIsDown(e) {  
        // Weil man mit shift sprintet werden Eingaben nicht auf Großschreibung überprüft
        const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
        this.keys[k] = true;
        console.log("Key down:", k, this.keys);
        // Wenn 'w' gedrückt wird: dash in der Luft; auf dem Boden macht 'w' nichts
        if (k === 'w') {
          if (this.player && !this.player.onGround) this.dashRequested = true; //Man kann nur dashen wenn es einen player gibt und dieser nicht auf dem boden ist
        }
        // Leertaste immer als jump request auch wenn sprung gerade nicht möglich ist
        if (k === ' ') {
          if(this.player && this.player.onGround) this.jumpRequested = true; // Man kann nur springen wenn es einen player gibt und dieser auf dem boden ist
        } //-> funktioniert noch nicht leider (Spieler kann auch in der Luft springen)
    }

    keyIsUp(e) {
      //Wenn taste nicht mehr gedrückt dann muss das im array auch wieder zurückgesetzt werden
      const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
      this.keys[k] = false;
    }

    // Wird vom Renderer-Ticker mit dt (Sekunden) aufgerufen
    updatePlayer(dt) {

      //Wenn es keinen Spieler zum updaten gibt
      if (!this.player) return null; 

      //HORIZONTALE BEWEGUNG
      let dir = 0; //Richtung: -1 = links, 1 = rechts, 0 = keine Bewegung -> wird nach jedem frame neu berechnet
      if (this.keys['a']) dir -= 1; // -= weil es nach jedem frame neu berechnet wird und so es möglich ist dass beide tasten gedrückt werden
      if (this.keys['d']) dir += 1; //bei += genauso ( 0 += 1 = 1 -= 1 = 0)

      const sprintHeld = this.keys['shift']; // Sprint-taste gedrückt?
      const currentSpeed = sprintHeld ? this.player.sprintSpeed : this.player.speed; //entweder normale geschwindigkeit oder sprint geschwindigkeit

      // Updated facing variable für den dash damit dash nicht 0 sein kann (sonst dash in die richtung in die man vorher sich bewegt hat)
      if (dir !== 0) this.player.facing = dir;

      //DASH
      // Update dash timer
      if (this.player.dashTimeRemaining > 0) this.player.dashTimeRemaining = Math.max(0, this.player.dashTimeRemaining - dt);
      // Wenn es eine dashTime gibt wird sie immer -dt(Sekunden) runtergezählt
      // Math.max(0,wert) damit es nicht negativ wird
      if (this.player.dashCooldownRemaining > 0) this.player.dashCooldownRemaining = Math.max(0, this.player.dashCooldownRemaining - dt);
      // Das selbe für dashCooldown

      // Wenn Dash angefordert wurde und wir in der Luft sind, starte den Dash (sofern verfügbar)
      if (this.dashRequested) {
        if (!this.player.onGround && this.player.dashCooldownRemaining <= 0 && this.player.dashTimeRemaining <= 0) {
          this.player.dashTimeRemaining = this.player.dashDuration;
          this.player.dashCooldownRemaining = this.player.dashCooldown;
          this.player.dashDir = this.player.facing; // Dash in die Richtung in die der Spieler zuletzt geschaut hat
        }
        this.dashRequested = false;
      }

      // Wenn gerade gedasht wird, verwende Dash-Geschwindigkeit
      let dx = 0; // horizontale veränderung
      if (this.player.dashTimeRemaining > 0) {
        dx = this.player.dashDir * this.player.dashSpeed * dt;
      } else {
        // Finale horizontale veränderung berechnen
        dx = dir * currentSpeed * dt;
      }

      // Horizontal bewegen
      console.log("dir:", dir, "currentSpeed:", currentSpeed, "dt:", dt, "dx:", dx);
      this.player.move(dx, 0); //this.player.y


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
            // Dash abbrechen bei Kollision
            this.player.dashTimeRemaining = 0;
            // Hilfe Koordinaten syncen
            this.player.x1 = this.player.x;
            this.player.x2 = this.player.x + this.player.width;
          }
        }
      }

      // VERTIKALE BEWEGUNG

      // SPRINGEN: wenn eine Sprunganforderung vorliegt und wir auf dem Boden sind
      if (this.jumpRequested && this.player.onGround) {
        this.player.vertical = this.player.jumpVelocity; // vertical auf Sprunggeschwindigkeit setzen
        this.player.onGround = false;
        //hier einfach jump aufrufen??
      }
      // Springanforderung wurde verarbeitet (einmaliges Trigger)
      this.jumpRequested = false;

      // GRAVITY + VERTICAL
      const GRAVITY = 1200; // px/s^2 
      this.player.vertical += GRAVITY * dt; // wird bei jedem frame auf die vertikale geschwindigkeit draufgerechnet
      // dadurch wird bei einem sprung die vertical immer weniger negativ (langsamer nach oben) bis sie 0 ist und dann wieder positiv wird (fallen)

      // Vertikal bewegen
      this.player.move(0, this.player.vertical * dt);

      // Kollisionen nach vertikaler Bewegung lösen
      if (this.player.vertical !== 0) { //eiegentlich fast immer nicht 0 wegen gravity
        for (const c of this.collision.colliders) { // jeden collider durchgehen
          if (this.collision.collision(this.player, c)) { //Kollision?
            // einfache Auflösung: je nach Bewegungsrichtung an die Kante setzen
            if (this.player.vertical > 0) {
              // landet auf Collider
              this.player.y = c.y - this.player.height;
              this.player.vertical = 0;
              this.player.onGround = true;
            } else if (this.player.vertical < 0) {
              // trifft Decke
              this.player.y = c.y + c.height;
              this.player.vertical = 0;
            }
            // Hilfe Koordinaten syncen
            this.player.y1 = this.player.y;
            this.player.y2 = this.player.y + this.player.height;
          }
        }
      }

      return this.player;
    }

} //end class


//______________________________________________________________________________________________________________
/*
  if (this.colliders.check(player, somePlatform)) {
    // Spieler steht auf Plattform: Y Koordinate = Plattform
}
*/

