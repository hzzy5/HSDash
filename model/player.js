export class Player {

  //Konstruktor
  constructor (_name, _x, _y, _speed) {
    this.name = _name;
    this.x = _x;
    this.y = _y;

    this.speed = _speed; //speed beim player vermutlich nicht nötig. Nur fürs testen, später entfernen.
    this.velocity = 0; //Fallgeschwindigkeit. Vielleicht velocity benennen.
    this.isJumping = false;

    //Das sind "private" Variablen. Sie werden einmal initialsiiert und nicht mehr geändert.
    this._ground = _y 
    this._gravitation = -12;
  }

  //Methode, die aufgerufen wird, wenn Space gedrückt wird.
  jump() {
    if (!this.isJumping) {
          this.velocity = -10.05; //das ist die Gravitation. Am besten eine Variable gravity definieren und dann velocity +=gravity.
          console.log("gesprungen");
          this.isJumping = true;
      }
  }

  //Methode, die in jedem Frame der GameLoop aufgerufen wird
  updatePosition() {
    //Wenn der Spieler gerade springt
      if (this.isJumping) {                            //if (this.velocity <= 450) { wäre auch noch möglich, da man bei 450 auf dem Boden ist. 
        console.log("ich bin bereit zum fallen")
          this.y += this.velocity;
          this.velocity += 0.5;     //Gravitation. Spieler fällt langsam nach unten
          console.log("ich falle");

        //Boden prüfen: Wenn er den Boden erreicht hat, steht er wieder auf dem Boden und springt nicht weiter.
        if (this.y >= this._ground) {
          this.y = this._ground;
          this.velocity = 0;
          this.isJumping = false;
          console.log("bin unten");
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