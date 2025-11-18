export class Player {

  //Konstruktor
  constructor (_name, _x, _y, _speed) {
    this.name = _name;
    this.x = _x;
    this.y = _y;

    this.speed = _speed; //speed beim player vermutlich nicht nötig. Nur fürs testen, später entfernen.
    this.jumpForce = 0;
    this.isJumping = false;
    this._ground = _y //Das soll der Startwert sein. Er wird einmal initialsiiert und nicht mehr geändert
  }

  //Methode, die aufgerufen wird, wenn Space gedrückt wird.
  jump() {
    if (!this.isJumping) {
          this.jumpForce = -12;
          console.log("gesprungen");
          this.isJumping = true;
      }
  }

  //Methode, die in jedem Frame der GameLoop aufgerufen wird
  updatePosition() {
    //Wenn der Spieler gerade springt
      if (this.isJumping) {                            //if (this.jumpForce <= 450) { wäre auch noch möglich, da man bei 450 auf dem Boden ist. 
        console.log("ich bin bereit zum fallen")
          this.y += this.jumpForce;
          this.jumpForce += 0.5;     //Gravitation. Spieler fällt langsam nach unten
          console.log("ich falle")

        //Boden prüfen: Wenn er den Boden erreicht hat, steht er wieder auf dem Boden und springt nicht weiter.
        if (this.y >= this._ground) {
          this.y = this._ground;
          this.jumpForce = 0;
          this.isJumping = false;
          console.log("bin unten")
        }
      }
  }


  //Methode, die die Position des Players updatet. Wird im Controller aufgerufen
  update () {
    //code
  } 

  /*Kann PIXI.js Spritesheets umsetzen?
    Prüfung: Spezifische Fragen: Wenn man ... ergänzen wollen würde, wo würde man das einfügen sollen?
    Pixelkollisiotnserkennung ausprobieren. Wenn zu schwer, dann Blockbasiert.
    Schwerkraft*/
} //end class player