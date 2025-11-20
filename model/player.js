import { Howl } from "https://cdn.skypack.dev/howler";

export class Player {

  //sprungsoundeffekt
  jumpsound;
  //hintergrundmusik
  backroundmusicLevel;
  //wird die hintergrundmusik gerade abgespielt?
  musicplaying = false;


  //Konstruktor
  constructor (_name, _x, _y, _speed) {
    this.name = _name;
    this.x = _x;
    this.y = _y;

    this.speed = _speed; //speed beim player vermutlich nicht nötig. Nur fürs testen, später entfernen.
    this.velocity = 0; //Geschwindigkeit, d.h. Bewegung pro Frame. Wird zur Position dazu addiert.
    this.isJumping = false;
    this.jumpCount = 0; //Flag. Zählt die Sprünge.

    //Das sind "private" Variablen. Sie werden einmal initialsiiert und nicht mehr geändert.
    this._ground = _y 
    this._gravitation = 0.5; //je höher, desto schneller unten. Die Kraft zieht stärker nach unten.

    //sound
    this.jumpsound = new Howl({
      src: ["../assets/audio/jump.mp3"],
      volume: 0.5
    });

    //hintergrundmusik
    this.backroundmusicLevel = new Howl({
      src: ["../assets/audio/hintergrundmusik-level.mp3"],
      volume: 0.5,
      loop: true
    });
  }

  //Methode, die aufgerufen wird, wenn Space gedrückt wird.
  jump() {
    if (this.jumpCount<2) { //Prüfen, ob Doppelsprung bereits ausgeführt worden ist.
          this.velocity = -15; //Sprungkraft nach oben. Je größer, desto höher springt der Player. 
          console.log("gesprungen");

          this.isJumping = true;
          this.jumpCount++;

          this.updatePosition();

          this.jumpsound.play();
            if(!this.musicplaying){
                this.backroundmusicLevel.play();
                this.musicplaying = true;
            }
      }
  }

  //Methode, die in jedem Frame der GameLoop aufgerufen wird
  updatePosition() {
    //Wenn der Spieler gerade springt
      if (this.isJumping) {                            //if (this.velocity <= 450) { wäre auch noch möglich, da man bei 450 auf dem Boden ist. 
        console.log("ich bin bereit zum fallen")
          this.y += this.velocity;
          this.velocity += this._gravitation;     //Gravitation. Spieler fällt langsam nach unten
          console.log("ich falle");

        //Boden prüfen: Wenn er den Boden erreicht hat, steht er wieder auf dem Boden und springt nicht weiter.
        if (this.y >= this._ground) {
          this.y = this._ground;

          this.velocity = 0;
          this.jumpCount = 0;
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