export class Player {

  // Konstruktor
  constructor (_name, _x, _y) {
    this.name = _name;
    this.x = _x;
    this.y = _y;

    this.width = 50;  
    this.height = 80; //Nur zum Testen. Später richtige Werte setzen.

    // Default Geschwindigkeit (px/s) — kann vom Controller verwendet werden
    this.speed = 220; 
    // Sprint-Geschwindigkeit (px/s) — Standard: 1.8x normale Geschwindigkeit
    this.sprintSpeed = Math.round(this.speed * 1.8);

    //Zustände für die Spritesheet-Animationen
    this.isJumping = false;
    this.isRunning = false; // nach rechts oder nach links? 
    this.isFalling = false;
    
    // Geschwindigkeit beim Sprung
    // Vertikale Geschwindigkeit und Sprung-Parameter
    this.vertical = 0; // px/s  vertical -> positiv = nach unten, negativ = nach oben
    this.jumpVelocity = 0;
    this.jumpCount = 0; //Flag. Zählt die Sprünge.

    // Das sind "private" Variablen. Sie werden einmal initialsiiert und nicht mehr geändert.
    this._ground = _y;
    this._gravitation = 0.5; //je höher, desto schneller unten. Die Kraft zieht stärker nach unten.
  
    // Dash Eigenschaften
    this.dashSpeed = 800; // px/s -> normal 220 
    this.dashDuration = 0.12; // Sekunden wie lange der Dash dauert
    this.dashCooldown = 0.6; // Sekunden zwischen Dashes 
    this.dashTimeRemaining = 0; // wird am anfang von dash auf dashDuration gesetzt und dann runtergezählt
    this.dashCooldownRemaining = 0; // wird am anfang von dash auf dashCooldown gesetzt und dann runtergezählt
    this.dashDir = 0; // -1 oder 1 (links oder rechts)
    this.facing = 1; // zuletzt bekannte Blickrichtung

    // Hilfskoordinaten für Kollisionen (linke/obere Ecke = x,y)
    this.x1 = this.x;
    this.y1 = this.y;
    this.x2 = this.x + this.width; // rechte Kante
    this.y2 = this.y + this.height; // untere Kante
  }

  //Methode, um sich horizontal zu bewegen. Wird ein negativer Wert übergeben, bewegt sich der Spieler nach links. Bei einem positiven Wert nach rechts. 
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.updateHitbox();
  }

  //Methode, um zu springen.
  jump() {
    if (this.jumpCount < 2) { // Prüfen, ob Doppelsprung bereits ausgeführt worden ist.
          this.jumpVelocity = -15; // Sprungkraft nach oben. Je größer, desto höher springt der Player. 
          this.isJumping = true;
          this.jumpCount++;
    }
  }


  //Methode, die in jedem Frame der GameLoop aufgerufen wird, um die Position des Spielers ändern.
  update() {
    //Wenn der Spieler gerade springt
      if (this.isJumping) {                            
        this.y += this.jumpVelocity;
        this.jumpVelocity += this._gravitation;     //Gravitation. Spieler fällt langsam nach unten
        
        //Wenn der Spieler den Boden erreicht hat, steht er wieder auf dem Boden und springt nicht weiter.
        if (this.y >= this._ground) {
          this.y = this._ground;
          this.jumpVelocity = 0;
          this.jumpCount = 0; // Reset
          this.isJumping = false;
        }
      }
      this.updateHitbox();
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

} //end class player