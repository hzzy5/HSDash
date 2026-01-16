//MODEL
import { Player } from "../model/player.js";
import { Coin } from "../model/coin.js";
import { Collision } from "../model/collision.js";
import { Life } from "../model/life.js";
import { Spikes } from "../model/spikes.js";
import { Gumbas } from "../model/gumbas.js";
import { Goal } from "../model/goal.js";
import { DBBro } from "../model/dbbro.js";
import { Trains } from "../model/train.js";

//VIEW
import { Renderer } from "../view/renderer.js"; 
import { PlayerRenderer } from "../view/playerRenderer.js";
import { CoinRenderer } from "../view/coinRenderer.js";
import { SceneRenderer } from "../view/sceneRenderer.js";
import { HudRenderer } from "../view/hudRenderer.js";
import { CameraRenderer } from "../view/cameraRenderer.js";
import { StartScreenRenderer } from "../view/startScreenRenderer.js";
import { LifesRenderer } from "../view/lifesRenderer.js";
import { SpikesRenderer } from "../view/spikesRenderer.js";
import { GumbasRenderer } from "../view/gumbasRenderer.js";
import { DBBroRenderer } from "../view/dbbroRenderer.js";
import { TrainRenderer } from "../view/trainRenderer.js";
import { GoalRenderer } from "../view/goalRenderer.js";
import { BlockRenderer } from "../view/blockRenderer.js";
import { ElevatorRenderer } from "../view/elevatorRenderer.js";
import { GameOverScreenRenderer } from "../view/gameOverScreenRenderer.js";
import { GameWinScreenRenderer } from "../view/gameWinScreenRenderer.js"
//import { CharacterSelectRederer } from "../view/characterSelectRenderer.js";
import { LevelSelectRenderer } from "../view/levelSelectRenderer.js";
import { PauseScreen } from "../view/pauseScreen.js";


//CONTROLLER
import { LevelLoader } from "./levelloader.js";
import { SoundController } from "./soundcontroller.js";


// Einfache Input-Verfolgung und zentralisierte Update-Funktion
export class Controller {

    //RENDERER
    renderer;
    playerRenderer;
    coinRenderer;
    sceneRenderer;
    hudRenderer;
    cameraRenderer;
    lifesRenderer;
    spikeRenderer;
    gumbaRenderer;
    dbbroRenderer;
    trainRenderer;
    goalRenderer;
    blockRenderer;
    elevatorRenderer;
    characterSelectRenderer;
    levelSelectRenderer;
    pauseScreen;

    //MODEL
    player;
    enemy;
    enemySprite;
    collision;
    spikes = []; //Liste aller Stacheln, die es im Level gibt
    gumbas = []; //Liste aller Gumbas, die es im Level gibt
    dbbros = []; //Liste aller Hammerbrüder, die es gibt; derzeit nur einer aber evt zum erweitern
    trains = []; //Liste der Züge die der Hammerbruder wirft
    goal = []; //max. 1 Ziel
    elevators = []; //Liste aller Fahrstühle

    //CONTROLLER
    levelloader;
    //SOUND
    sound;
    buttonMusikAus;
    musicPlays;

    leftBound;
    rightBound;

    keys = {};
    jumpRequested = false;
    dashRequested = false;
    takeElevator = false;
    DEBUG = true;
    lastJumpY = null;
    lastJumpTime = 0;
    elevatorHint = null;

    // Collider-Liste (vierecke mit x,y,width,height)
    colliders = []; //Für kollisionen
    coins = [];  // Liste aller Münzen im Level
    coins5 = []; //Liste aller 5Coins im Level
    lifes = []; //Liste aller Leben die man einsammeln kann im Level

    totalCoins = this.coins.length;  
    collectedCoins = 0;
    collected5Coins = 0;

    //SCREEN / GAMESTATE
    gameStarted = false;
    isPaused = false; 
    isGameOver = false;
    isGameWin = false;
    gameLoopRunning = false;

    playerLocked = false; //kein playerUpdate(), wenn der Player im Fahrstuhl ist
    pressLeftKey = false; //bug beim Fahrstuhl
    pressRightKey = false;

    //LEVEL
    currentLevelIndex = 0; //beim ersten Level starten!!!
    unlockedLevels = 1; //Anzahl der freigeschalteten Level, d.h. Lvl1 = 1, Lvl1 & 2 = 2
    end = false; 
    
    endMessage = null; 



    //methode um das ganze Spiel zu initialisieren. Hier werden die Methoden aus der View usw aufgerufen. 
    async initController() {
        //MODEL:
        this.player = new Player("Spieler1", 100, -100); //player fällt von oben
        this.collision = new Collision();

        //VIEW:
        this.renderer = new Renderer();
        await this.renderer.initRenderer(); //hier wird die PIXI.app erzeugt
        await this.renderer.loadAssets(); //Spiel-Elemente laden

        this.playerRenderer = new PlayerRenderer(this.renderer.world); //alle Renderer arbeiten mit derselben PIXI.app
        await this.playerRenderer.initAnimations(); //Player-Animation laden
        
        this.sceneRenderer = new SceneRenderer(this.renderer.background, this.renderer.screen);
                
        this.coinRenderer = new CoinRenderer(this.renderer.world, this.renderer.ticker);
        this.hudRenderer = new HudRenderer(this.renderer.hud, this.renderer.screen);
        this.cameraRenderer = new CameraRenderer(this.renderer.world, this.renderer.screen)
        this.lifesRenderer = new LifesRenderer(this.renderer.world, this.renderer.ticker);
        this.spikeRenderer = new SpikesRenderer(this.renderer.world, this.renderer.ticker);
        this.gumbaRenderer = new GumbasRenderer(this.renderer.world, this.renderer.ticker);
        this.dbbroRenderer = new DBBroRenderer(this.renderer.world, this.renderer.ticker);
        this.trainRenderer = new TrainRenderer(this.renderer.world, this.renderer.ticker);
        this.goalRenderer = new GoalRenderer(this.renderer.world);
        this.blockRenderer = new BlockRenderer(this.renderer.world);
        this.elevatorRenderer = new ElevatorRenderer(this.renderer.world);
        this.elevatorHint = this.elevatorRenderer.createElevatorHint(this.player);

        //STARTSCREEN
        this.startScreenRenderer = new StartScreenRenderer(
          this.renderer.ui,
          this.renderer.screen
        );

        //GAMEOVER SCREEN
        this.gameOverScreenRenderer = new GameOverScreenRenderer(
            this.renderer.ui,
            this.renderer.screen
        );

        //GAMEWIN
        this.gameWinScreenRenderer = new GameWinScreenRenderer(
            this.renderer.ui,
            this.renderer.screen,
            this.collected5Coins //wird zu früh übergeben! Iwie coin anzeige und overlay trennen
        );
        this.endMessage = this.gameWinScreenRenderer.showfinalMessage();
        this.endMessage.x = window.innerWidth/2+325;
        this.endMessage.y = window.innerHeight-265;
        this.endMessage.visible = false;



        this.levelSelectRenderer = new LevelSelectRenderer(this.renderer.ui, this.renderer.screen, this.renderer.ticker);
        this.pauseScreen = new PauseScreen(this.renderer.ui, this.renderer.screen)


        //CONTROLLER:
        this.levelloader = new LevelLoader(this.renderer, this.playerRenderer, 
                                           this.sceneRenderer,
                                           this.collision,
                                           this.coinRenderer, this.coins, this.coins5,
                                           this.lifesRenderer, this.lifes, 
                                           this.spikeRenderer, this.spikes, 
                                           this.gumbaRenderer, this.gumbas,
                                           this.dbbroRenderer, this.dbbros,
                                           this.goalRenderer, this.goal,
                                           this.blockRenderer,
                                           this.elevatorRenderer, this.elevators); 
                                

        //SOUND:
        this.sound = new SoundController(); //SoundController initialisieren 
        
        //SoundButton
        //this.buttonMusikAus = this.renderer.createSprite("soundAus");
        //this.buttonMusikAus.width *= 1.5;
        //this.buttonMusikAus.height *= 1.5;
        //this.renderer.renderSprite(this.buttonMusikAus, 0, 0);
        //damit den Sprite wie einen Button nutzten kann
        //interaktivität sicherstellen
        //this.buttonMusikAus.eventMode = "static";
        //für Cursor als Button anzeigen 
        //this.buttonMusikAus.cursor = "pointer";
        //EventListener hinzufügen
        // this.buttonMusikAus.on("pointertap", () => {
        //     console.log("Button wurde angeklickt");
        //     this.sound.switchOnOff();
        //     this.musicPlays = !this.musicPlays;
        //     this.changeButtonPicture();
        // });
        
        //=== NAVIGATE ===
        this.navigateThroughGame();
        
        //=== ABFRAGEN ===
        document.addEventListener("keydown", (e) => this.keyIsDown(e));
        document.addEventListener("keyup", (e) => this.keyIsUp(e));  
        
        
    }

    //=== START GAME ============================================================================================
    startGame() {
        //Startscreen sofort anzeigen
        this.startScreenRenderer.show();

        //SPIEL STARTEN, wenn auf den Button geklickt wird
        this.startScreenRenderer.createStartButton(() => { 
          this.startScreenRenderer.hide();
        
          this.levelSelectRenderer.show();

          //Level auswählen
          this.levelSelectRenderer.showLevels(
            //Beim Klick wird das Level geladen
            this.levelloader.levels, 
            async (levelIndex) => {
              this.levelSelectRenderer.hide();
              await this.loadLevel(levelIndex);
              
              this.setGameState("gameStarted") //Spiel ist gestartet
              this.sound.backroundMusic();
              this.musicPlays = true;
              
              //Sicher gehen, dass die Gameloop nur einmal gestartet wird 
              if (!this.gameLoopRunning) {
                this.renderer.startGameLoop((dt) => this.gameLoop(dt)); //gameloop!
                this.gameLoopRunning = true; 
              }
            }, 
            //OnBack, zurück zum Startscreen
            ()=> {
              this.levelSelectRenderer.hide();
              this.startScreenRenderer.show();
            });
        }); 

    }
    

    //=== SET STATE ============================================================================================
    //gameStarted, isGameOver, isGameWin
    //Wichtig hierbei ist es, die anderen States zurückzusetzen, damit die gameLoop korrekt funktioniert
    setGameState(state) {
      switch(state) {
        case "gameStarted": 
        this.gameStarted = true;
        this.isGameOver = false;
        this.isGameWin = false;
        this.isPaused = false;
        break;

        case "isGameOver": 
        this.gameStarted = false;
        this.isGameOver = true;
        this.isGameWin = false;
        this.isPaused = false;
        break;

        case "isGameWin": 
        this.gameStarted = false;
        this.isGameOver = false;
        this.isGameWin = true;
        this.isPaused = false;
        break;

        case "isPaused": 
        this.gameStarted = false;
        this.isGameOver = false;
        this.isGameWin = false;
        this.isPaused = true;
        break;
      } 
    }



    //=== NAVIGATE ============================================================================================
    //Methode, die alle Screen einmal erstellt. Später werden sie nur noch per show() und hide() ein- bzw. ausgeblendet.
    navigateThroughGame() {
      //WIN SCREEN
      this.gameWinScreenRenderer.createButton(
          //restart: Aktuelles Level neustarten
          () => {
            this.endMessage.visible = false;
            this.restartGame();
            this.setGameState("gameStarted");
          }, 
          //next: Neues Level laden
          () => {
            this.loadLevel(this.currentLevelIndex+1);
            if (this.end) {
              this.endMessage.visible = true; 
              return;
            }
              
              this.setGameState("gameStarted");
          },
          //start: zum Startmenü
          () => {
            this.gameWinScreenRenderer.hide(); 
            this.endMessage.visible = false;
            this.startScreenRenderer.show();
          }
      );

      //GAMEOVER SCREEN
      this.gameOverScreenRenderer.createStartButton(
        //restart
        () => {this.restartGame();},
        //start
        () => {
          this.gameOverScreenRenderer.hide();
          this.startScreenRenderer.show();
        }
      );
      
      //PAUSE SCREEN
      this.pauseScreen.createScreen(
        //weiter
        () => {
          this.setGameState("gameStarted");
          this.pauseScreen.hide();
        },
        //start
        () => {
          this.pauseScreen.hide();
          this.startScreenRenderer.show();
        },
        //musik an / aus
        () => {
          this.sound.switchOnOff();
          this.musicPlays = !this.musicPlays;
        }
      );
    
    }

    //=== GAMELOOP ============================================================================================
    //Methode, die alle Update-Funktionen pro Frame aufurft. 
    gameLoop(dt) {
      if (!this.gameStarted) return; //Wenn das Spiel nicht gestartet ist, nichts updaten
      if (this.isGameOver || this.isGameWin || this.isPaused) return;

      //Spieler updaten (Sprung, Dash, Bewegung)
      this.updatePlayer(dt);
      this.checkCoinCollection();//Münzeneinsammlung prüfen
      this.checkLifesCollection(); //Lebeneinsammlung prüfen
      this.checkEnemies(dt); //Gegner überprüfen, Kollision mit Player? + Weiterlaufen der Gumbas
      this.checkEndBoss(dt); //Endgegner überprüfen, Kollision mit Player? + Weiterlaufen der Züge, werfen
      this.player.updateInvincibility(dt); //Unbesiegbarkeit des Spieler überprüfen
      this.playerRenderer.setInvincibleBlink(this.player.invincible); //Flackern während der Spieler unbesiegbar ist 
       this.checkElevator();
      this.levelCompleted(); //Ziel erreicht?
      
      //Hintergrund scrollen
      this.sceneRenderer.scrollBackground(this.cameraRenderer.cameraX);

      //Camera bewegen
      this.cameraRenderer.updateCamera(this.player);
      
      //E-Taste zurücksetzen, damit Aufzugfahren nicht nachträglich passieren kann. Nur im selben Frame
      this.takeElevator = false;

      console.log(Math.round(this.player.x), Math.round(this.player.y));
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

        //E um in den Fahrstuhl einzusteigen
        if( k === 'e') {
          this.takeElevator = true;
        }
    }

    //=== KEY UP ============================================================================================
    keyIsUp(e) {
      //Wenn taste nicht mehr gedrückt dann muss das im array auch wieder zurückgesetzt werden
      const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
      this.keys[k] = false;
      this.pressLeftKey = false;
      this.pressRightKey = false;
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
        this.pressLeftKey = true;
      }
      if (this.keys['d'] || this.keys['arrowright']) {
        dir += 1; //bei += genauso ( 0 += 1 = 1 -= 1 = 0)
        this.pressRightKey = true;
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
        this.sound.playerDash();
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
      console.log("move: " + this.player.x, this.player.y);

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
      //für Kollisionserkennung mit Gegnern
      this.player.prevVy = this.player.vy;
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
            this.player.y1 = this.player.y;
            this.player.y2 = this.player.y + this.player.height;
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

      this.playerRenderer.renderPlayer(this.player.x, this.player.y, this.player.x1, this.player.x2, this.player.y1, this.player.y2); //player rendern
      this.playerRenderer.updatePlayerAnimation(this.player.getState(), this.player.facing); //Player-animation abspielen
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
        
            this.coinRenderer.showFloatingTextForCoin("+1", coin.x, coin.y - 20);
            this.collectedCoins++;
            this.hudRenderer.updateCoinHud(this.collectedCoins, this.collected5Coins);

          }
        }

        for (const coin5 of this.coins5) {
            if (coin5.collected) continue;
 
           // Kollision prüfen
           if (this.collision.collision(this.player, coin5)) {
             console.log("5Coin eingesammelt!");
             coin5.collect();
 
             //Soundeffect
             this.sound.coin5Collected(); 
         
             this.coinRenderer.showFloatingTextFor5Coin("+1", coin5.x, coin5.y - 20);
             this.collected5Coins++;
             this.gameWinScreenRenderer.getCollected5Coins(this.collected5Coins); //für die Anzeige beim Endscreen
             this.hudRenderer.updateCoinHud(this.collectedCoins, this.collected5Coins);
 
           }
         }
    }

    //=== UPDATE LIVES ============================================================================================
    checkLifesCollection() {
        //alle Leben durchgehen die auf dem Spielfeld liegen und sehen ob sie eingesammelt wurden
        for (const life of this.lifes) {
           if (life.collected) continue;

          // Kollision prüfen mit Leben
          if (this.collision.collision(this.player, life)) {
            console.log("Leben eingesammelt!");
            life.collect(); //auch wenn man 2 hat wird es "eingesammelt", indem es entfernt wird ohne das der Player eins dazu bekommt
            if(this.collectedLifes < 2){
                //Soundeffect
                this.sound.lifeCollected(); 
            
                this.lifesRenderer.showFloatingText("+1", life.x, life.y - 20);
                this.collectedLifes++;
                this.hudRenderer.LifeHud(this.collectedLifes);
            }
          }
        }

        //wenn der Player ausserhalb des Spiels ist (ins loch gefallen oder so), stirbt er
        //800 scheint zu funktionieren, später nochmal testen wenn levelaufbau fertig
        //veraltet, man kann derzeit nicht mehr runterfallen, evt für Erweiterungen nützlich
        if(this.player.y > 800){
            this.collectedLifes = 0;
            this.hudRenderer.LifeHud(this.collectedLifes);
            console.log("Du bist gestorben! :)");
            this.gameOver();
        }

        if(this.collectedLifes <= 0){
            console.log("Du bist gestorben! :)");
            this.gameOver();
        }
    }

    //=== PLAYER GETROFFEN ============================================================================================
    //wenn man getroffen wird Leben updaten
    playerGotHit(){
        //wenn spieler unbesiegbar nichts passiert
        if (this.player.invincible) return;

        //Player für 2 sek unbesiegbar machen, sodaass dieser nicht dierekt wieder getroffen wird
        this.player.invincible = true;
        this.player.invincibleTimer = 2;
        //Leben abzeihen
        this.collectedLifes--;
        //Sound effect
        this.sound.playerGotHit();
        this.lifesRenderer.showFloatingText("-1", this.player.x, this.player.y - 20);
        //Lebensanzeige updaten
        this.hudRenderer.LifeHud(this.collectedLifes);
        //falls keine Leben mehr
        if(this.collectedLifes <= 0){
            console.log("Du bist gestorben! :)");
            this.gameOver();
        }
    }

    //=== CHECK ENEMIES ============================================================================================
    checkEnemies(dt) {
        //alle Spikes durchgehen die auf dem Spielfeld liegen und sehen ob sie berührt wurden
        for (const spike of this.spikes) {
          //wenn Spieler unbesiegbar egal
          if (this.player.invincible) continue;
          // Kollision prüfen mit Spikes
          if (this.collision.collision(this.player, spike)) {
            console.log("Stacheln berührt!");
            this.playerGotHit();
          }
        }

        //alle Gumbas durchgehen die auf dem Spielfeld liegen und sehen ob sie berührt wurden
        for (const gumba of this.gumbas) {
            if(!gumba.alive) continue; //wenn nicht mehr Leben dann zum nächsten gehen

            //Bewegung Gumba
            gumba.move(dt);

            //Kollision mit Kollisionsblöcken
            for (const c of this.collision.colliders) {
                if (this.collision.collision(gumba, c)) {

                    // Gumba neben collider setzen, dann umdrehen
                    if (gumba.direction > 0) {
                        gumba.x = c.x - gumba.width;
                    } else {
                        gumba.x = c.x + c.width;
                    }

                    gumba.reverse();
                    gumba.updateHitbox();
                    break;
                }
            }

            //Sprite synchronisieren
            this.gumbaRenderer.updateSprite(gumba.sprite, gumba.x, gumba.y, gumba.direction);

            // Player Kollision prüfen mit Gumbas
            //springt der Player von oben auf den Gumba?
            if (this.collision.collisionUp(this.player, gumba)) {
                console.log("Gumba besiegt!");
                this.sound.gumbaDies();
                gumba.dies();
                continue;
            }
            //wenn spieler unbesiegbar ist, dann ist Berührung egal
            if (this.player.invincible) continue;
            //ansonsten wird Kollision als Treffer gewertet und ein Leben abgezogen, falls man nicht vorher auf den Gumba draufgesprungen ist
            if(this.collision.collision(this.player, gumba)){
                console.log("Gumba berührt!");
                this.playerGotHit();
            }
          }

    }

    //=== CHECK ENDBOSS ============================================================================================
    checkEndBoss(dt){
        //alle Brüder durchgehen die auf dem Spielfeld liegen und sehen ob sie berührt wurden
        for (const dbbro of this.dbbros) {
            if(!dbbro.alive) continue; //wenn nicht mehr Leben dann zum nächsten gehen

            //ist Player in der Nähe?
            let distancenear = dbbro.isPlayerClose(this.player.x);
            //Musik ändern zu Bossmusik, wenn Player in der Nähe
            if(distancenear){
              this.sound.switchToBosstheme();
            }else{ //ansonsten wenn es nicht bereits läuft zur normalen Hintergrundmusik
              this.sound.switchBackToMaintheme();
            }
            //Sprite in Richtugn Player drehen
            this.dbbroRenderer.mirrorSprite(dbbro.sprite, dbbro.wherePlayer(this.player.x));

            // Player Kollision prüfen mit dbbro
            //ist der Player auf den dbbro gesprungen?
            if (this.collision.collisionUp(this.player, dbbro)) {
                console.log("dbbro besiegt!");
                this.sound.gumbaDies();
                this.sound.bossfightWon();
                dbbro.dies();
                this.sound.switchBackToMaintheme();
                continue;
            } else if (this.collision.collision(this.player, dbbro)) { //gab es ansonsten trotzdem eine Kollision mit dem Spielr?
              
              console.log("dbbro berührt!");
              this.playerGotHit();
            }

            //Wurf
            if(dbbro.throwTimer == 0){ //Timer abgelaufen? neuer Wurf
                console.log("Bereit zu werfen!");

                //neuer Zug zum Werfen
                let train = new Trains(dbbro.x, dbbro.y);
                train.sprite = this.trainRenderer.createTrainSprite(dbbro.x, dbbro.y);
                //Richtung berechenen
                train.calculateDirection(this.player.x, this.player.y);
                //Bild auch in die Richtung drehen
                this.trainRenderer.rotateTrainSprite(train.sprite, train.directionX, train.directionY);
                this.trains.push(train);
                //wenn spieler in der Nähe noch ein Sound zum Werfen abspielen
                if(distancenear){
                  this.sound.dbbroThrows();
                }
                //console.log("Geworfen!");
                //timer neu setzen
                dbbro.throwTimer = 10; //10 fürs zweite level sehr gut
                dbbro.justThrew = true;
            }else{
                //ansonsten Wurftimer aktualisieren
                dbbro.updateThrowTimer(dt);
            }

        }

        //alle Züge durchgehen die auf dem Spielfeld liegen und sehen ob sie berührt wurden + Bewegung des Zuges darstellen
        for (const train of this.trains) {
            //Bewegung
            train.move(dt);
            //Sprite synchronisieren
            this.trainRenderer.positionTrainSprite(train.sprite, train.x, train.y, train.directionX);
               
            // Kollision prüfen mit Zügen und Player
            if (this.collision.collision(this.player, train)) {
                if (this.player.invincible) break;
                console.log("train berührt!");
                this.playerGotHit();
            }
        }
    }

    //=== CHECK ELEVATOR ============================================================================================
    checkElevator() {
      let nearElevator = false;

      for (const elevator of this.elevators) {
        //Player steht noch drinne
        if (elevator.playerInside) {
            //prüfen ob Player weg ist, keine Kollision
            if (!this.collision.collisionWithElevator(this.player, elevator)) {
                elevator.playerInside = false;
                this.player.onElevator = false;
            }
            continue;
        }

        //Wenn der Fahrstuhl gerade fährt  
        if (elevator.state === "moving") continue;

        //Wenn der Player im Fahrstuhl ist
        if (this.collision.collisionWithElevator(this.player, elevator)) {
            nearElevator = true;

            //Hint anzeigen
            this.elevatorHint.visible = true;
            this.elevatorHint.x = this.player.x - this.elevatorHint.width / 2 + this.player.width / 2;
            this.elevatorHint.y = this.player.y - this.elevatorHint.height - 10;
            
            //ANIMATION: TÜR ÖFFNEN
            //Tür öffnen, wenn noch nicht offen
            if (elevator.state === "idle" || elevator.state === "closed") {
                elevator.state = "open";
                this.elevatorRenderer.open(elevator);
            }
            
            //Wenn der Fahrstuhl offen ist, kann er los fahren
            if (elevator.state === "open") {
                elevator.state = "ready";
            }

            //Taste E 
            if (this.takeElevator && elevator.state === "ready") {
              if (this.pressLeftKey || this.pressRightKey) return; //Player muss still stehen
              this.takeElevator = false;

              elevator.takeTheElevator(); //playerInside
              this.player.takeTheElevator(elevator); //player.onElevator
            }
        }
      
        //States zurücksetzten, damit man sofort wieder fahren kann
        elevator.playerInside = false;
        this.player.onElevator = false;
        }

      //Sobald es keine Kollision mehr gibt
      if (!nearElevator) {
        this.elevatorHint.visible = false; //Hint verstecken 

        for (const elevator of this.elevators) {
            if (elevator.state === "ready" || elevator.state === "open") {
                elevator.state = "closed";
                this.elevatorRenderer.close(elevator); //Tür schließen
            }
        }
      }
    }

    
    //=== RESTART ============================================================================================
    restartGame(){
        console.log("Spiel wird neu gestartet");

        this.setGameState("gameStarted"); 

        this.gameOverScreenRenderer.hide();
        this.gameWinScreenRenderer.hide();

        this.resetLevel();

        this.renderer.ticker.start();
    }

    resetLevel(){
        //Player auf Anfangsposition
        this.player.x = 100;
        this.player.y = 100;
        this.player.vy = 0;
        this.player.onGround = false;
        this.player.state = "idle" ;
        this.playerLocked = false;

        //Kamera zurücksetzen auf Player position
        this.cameraRenderer.resetCamera();

        //Gumbas zurückk zum Leben
        for (const gumba of this.gumbas) {
            gumba.alive = true;
            gumba.sprite.visible = true;
        }

        //DBBros zurückk zum Leben
        for (const dbbro of this.dbbros) {
            dbbro.alive = true;
            dbbro.sprite.visible = true;
        }

        for (const train of this.trains) {
            //train.alive = true;
            train.sprite.visible = false;
        }
        this.trains = [];

        //coins alle anzeigen
        for (const coin of this.coins) {
            coin.collected = false;
            coin.sprite.visible = true;
        }

        for (const coin5 of this.coins5) {
            coin5.collected = false;
            coin5.sprite.visible = true;
        }

        //herzen alle anzeigen
        for (const life of this.lifes) {
            life.collected = false;
            life.sprite.visible = true;
        }

        //Fahrstuhl auf anfangsposition bringen
        for (const elevator of this.elevators) {
          elevator.resetElevator();
        }

        //Ziel-Fahrstuhl beim zweiten Level schließen
        if (this.currentLevelIndex === 1 && this.goalRenderer.currentGoal)
          this.goalRenderer.resetElevator();

        //herzenanzahl zurück auf 2 
        this.collectedLifes = 2;
        this.hudRenderer.LifeHud(this.collectedLifes);

        //eingesammelte Münzen auf 0
        this.collectedCoins = 0;
        this.collected5Coins = 0;
        this.hudRenderer.updateCoinHud(this.collectedCoins, this.collected5Coins);

        //Eingaben zurücksetzen, damit registrierte Sprünge nicht im neuen Spiel noch ausgeführt werden
        this.jumpRequested = false;
        this.dashRequested = false; 
        this.takeElevator = false; 
    }

    //=== MUSIC BUTTON ============================================================================================
    //wenn Musik Button angeklickt wird das Bild verändert, von "Musik aus" zu "Musik an" oder umgekehrt
    //veraltet, es gibt keinen seperaten Musik-Button mehr außer der im PauseScreen
    changeButtonPicture(){
        if (this.musicPlays){
            this.buttonMusikAus = this.renderer.createSprite("soundAus");
            this.buttonMusikAus.width *= 1.5;
            this.buttonMusikAus.height *= 1.5;
            this.renderer.renderSprite(this.buttonMusikAus, 0, 0);
        }else{
            this.buttonMusikAus = this.renderer.createSprite("soundAn");
            this.buttonMusikAus.width *= 1.5;
            this.buttonMusikAus.height *= 1.5;
            this.renderer.renderSprite(this.buttonMusikAus, 0, 0);
        }

    }

    //=== LEVEL COMPLETED? ============================================================================================
    levelCompleted() {
      //if(this.levelFinished = false) return;
      if (!this.levelloader.goal) return;
      
      if (this.collision.collision(this.player, this.levelloader.goal)) {
        //this.levelFinished = true;
        this.unlockNextLevel();
        this.gameWon();

        //Wenn 2tes Level, Animation abspielen
        if (this.currentLevelIndex === 1 && this.goalRenderer.currentGoal) {
          this.goalRenderer.openElevator();
        }
      }
    }

    



    //=== GAMEOVER ============================================================================================
    gameOver(){
        //this.renderer.ticker.stop();

        this.setGameState("isGameOver"); 

        this.sound.playerDies();
        
        // this.gameOverScreenRenderer.createStartButton(() => {
        //   this.restartGame();
        // });
  
        this.gameOverScreenRenderer.show();
        
    }

    //=== WiN ============================================================================================
    gameWon() {
      console.log("Spiel gewonnen"); 
      this.sound.levelWon();

      //this.renderer.ticker.stop();
      
      //Screen anzeigen lassen 
      this.setGameState("isGameWin");
      this.gameWinScreenRenderer.getCollected5Coins(this.collected5Coins);
      this.gameWinScreenRenderer.show(this.collected5Coins); 
      
      // //Endscreen erzeugen
      // this.gameWinScreenRenderer.createButton(() => {
      //    this.loadNextLevel();
      //   //this.restartGame(); //HIER METHODE SPÄTER ÄNDERN
      //   //this.levelloader.loadLevel(this.levelloader.levels[1]);
      // });
    }


    //=== LOAD LEVEL ============================================================================================
    //Genutzt, um das erste Level zu laden
    loadLevel(level) {
      this.currentLevelIndex = level;
      console.log(this.currentLevelIndex)
      
      //Wenn man es noch ein nächstes Level gibt 
       if (this.currentLevelIndex < this.levelloader.levels.length) {
        //und freigeschaltet ist
        if (this.levelloader.levels[this.currentLevelIndex].unlocked) {
          this.levelloader.clearLevel();
          this.restartGame();
          
          //Hintergrund wechseln  
          console.log(this.levelloader.levels[this.currentLevelIndex ].background);  
          this.sceneRenderer.setBackground(this.levelloader.levels[this.currentLevelIndex ].background);

          //HUD laden
          this.loadHUD();
          
          //Level laden
          this.levelloader.loadLevel(this.levelloader.levels[this.currentLevelIndex]);
        }
        //Sonst Endscreen einblenden
      } else {
        console.log("Alle Level geschafft!");
        this.end = true;
        //this.renderer.ticker.stop(); // oder Endscreen
      }
    }


    //=== HUD ANZEIGEN ============================================================================================
    loadHUD() {
      if (!this.gameLoopRunning) {
        //=== MÜNZEN ===
        this.totalCoins = this.coins.length;  
        this.collectedCoins = 0;
        this.collected5Coins = 0;
        this.hudRenderer.createCoinHud();

        //=== LEBEN ===
        this.collectedLifes = 2; //Startwert 2 Leben
        this.totalLifes = this.lifes.length;
        this.hudRenderer.LifeHud(this.collectedLifes);

        //=== PAUSE-BUTTON ===
        this.hudRenderer.createPauseButton(
          () => {
            if(this.isGameOver || this.isGameWin) return;
              this.setGameState("isPaused");
              this.pauseScreen.show();
          }
        );
      }
    }

    //=== UNLOCK LEVEL ============================================================================================
    unlockNextLevel() {
      const nextLevel = this.currentLevelIndex + 1;
      //Wenn es noch ein nächstes Level gibt, dann dieses freischalten.
      if (nextLevel < this.levelloader.levels.length) {
        this.unlockedLevels = Math.max(this.unlockedLevels, nextLevel + 1);
        this.levelloader.levels[nextLevel].unlocked = true;

      }
    }
    

} //end class
