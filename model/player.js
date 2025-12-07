export class Player {

  // Konstruktor
  constructor (_name, _x, _y) {
    this.name = _name;
    this.x = _x;
    this.y = _y;

    // Default Größe (responsive relativ zur Fensterhöhe)
    const refH = (typeof window !== 'undefined' && window.innerHeight) ? window.innerHeight : 800;
    const scale = refH / 800; // Basis-Referenzhöhe 800px
    this.height = Math.max(24, Math.round(80 * scale));
    this.width = Math.max(12, Math.round(40 * scale));

    // Default Geschwindigkeit (px/s) — skaliert mit Fenstergröße
    this.speed = Math.max(80, Math.round(220 * scale));
    // Sprint-Geschwindigkeit (px/s) — Standard: 1.8x normale Geschwindigkeit
    this.sprintSpeed = Math.round(this.speed * 1.8);

    //Richtung, in die sich der Spieler dreht
    this.turningLeft = false;
    this.turningRight = false

    //Zustände für die Spritesheet-Animationen
    this.isJumping = false;
    this.isMoving = false;
    this.isRunning = false; // nach rechts oder nach links? 
    this.isFalling = false;
    
    // Geschwindigkeit beim Sprung
    // Vertikale Geschwindigkeit und Sprung-Parameter
    this.vy = 0; // px/s positiv = nach unten, negativ = nach oben. Wird durch Gravitation und Velocity verändert
    this.onGround = false;
    this.jumpVelocity = Math.round(-480 * scale); // px/s (negativ = nach oben). Einmalig beim Absprung gesetzt
    this.jumpCount = 0; //Flag. Zählt die Sprünge.
  
    // Dash Eigenschaften
    this.dashSpeed = Math.max(200, Math.round(800 * scale)); // px/s
    this.dashDuration = 0.12; // Sekunden wie lange der Dash dauert
    this.dashCooldown = 0.6; // Sekunden zwischen Dashes 
    this.dashTimeRemaining = 0; // wird am anfang von dash auf dashDuration gesetzt und dann runtergezählt
    this.dashCooldownRemaining = 0; // wird am anfang von dash auf dashCooldown gesetzt und dann runtergezählt
    this.dashDir = 0; // -1 oder 1 (links oder rechts)
    this.facing = 1; // zuletzt bekannte Blickrichtung

    // Ob noch ein In-Air-Dash verfügbar ist (wird beim Landen zurückgesetzt)
    this.airDashAvailable = true;

    // Hilfskoordinaten für Kollisionen (linke/obere Ecke = x1,y1), (rechte/untere Ecke = x2,y2)
    this.x1 = this.x;
    this.y1 = this.y;
    this.x2 = this.x + this.width; 
    this.y2 = this.y + this.height; 
  }

  //Methode, um sich horizontal zu bewegen. Wird ein negativer Wert übergeben, bewegt sich der Spieler nach links. Bei einem positiven Wert nach rechts. 
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.updateHitbox();
  }

  //Methode, um zu springen.
  jump() {
    if (this.jumpCount<2) { //maximal ein Doppelsprung. Keine onGround-Abfrage, da sonst der zweite Sprung verhindert wird.
      //Absprung
      this.vy = (this.jumpVelocity !== undefined) ? this.jumpVelocity : -480;
      this.jumpCount++;
      this.onGround = false;
      this.isJumping = true;
    }
  }

  //Methode, die die Gravitation simuliert. Der Spieler fällt nach unten.
  applyGravity(dt) {
    const GRAVITY = 1200; // px/s^2
    this.vy += GRAVITY * dt;
    this.move(0, this.vy * dt);
  }

  //Methode, um zu dashen.
  dash(direction) {
    if (!this.onGround && this.dashCooldownRemaining <= 0 && this.dashTimeRemaining <= 0) {
      // Allow a single in-air dash per airborne period (falling or rising).
      if (this.airDashAvailable) {
        this.dashTimeRemaining = (this.dashDuration !== undefined) ? this.dashDuration : 0.12;
        this.dashCooldownRemaining = (this.dashCooldown !== undefined) ? this.dashCooldown : 0.6;
        this.dashDir = (direction !== 0) ? direction : this.facing || 1;
        // consume the in-air dash for this airborne period
        this.airDashAvailable = false;
        //if (this.DEBUG) console.log('[controller] dash started (in-air)', { dashDir: player.dashDir, vy: player.vy });
      } else {
        //if (this.DEBUG) console.log('[controller] dash denied (in-air already used)', { airDashAvailable: player.airDashAvailable, vy: player.vy });
      }
    }
  }


  //Methode, die die DashTimer aktualisiert. 
  updateDashTime(dt) {
    //Wenn ein Dash noch aktiv ist
    if (this.dashTimeRemaining > 0) this.dashTimeRemaining = Math.max(0, this.dashTimeRemaining - dt);
    //Abklingzeit nach einem Dash
    if (this.dashCooldownRemaining > 0) this.dashCooldownRemaining = Math.max(0, this.dashCooldownRemaining - dt);
  }

  
  //Methode, die die Koordinaten des Players updaten (Hilfe für die Kollisionserkennung) 
  updateHitbox () {
    this.x1 = this.x;
    this.x2 = this.x + this.width;
    this.y1 = this.y;
    this.y2 = this.y + this.height;
  } 

  //Methode, die die x-Position zurückgibt. Unnötig??
  getPositionX() {
    return this.x;
  }

  //Methode, die die Breite und Höhe setzt
  setWidthAndHeight(width, height) {
    this.width = width;
    this.height = height;
  }


} //end class player