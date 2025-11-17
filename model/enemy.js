export class Enemy {

    //Konstruktor
    constructor (_name, _x, _y, _speed) {
      this.name = _name;
      this.x = _x;
      this.y = _y;
      this.speed = _speed; //speed beim player vermutlich nicht nötig. Nur fürs testen, später entfernen.
    }
  
    //Methode, die die Position bei Bewegungen verändert
    move (_x, _y) {
      //code
    }
  
    //Methode, die die Position des Players updatet. Wird im Controller aufgerufen
    update () {
      //code
    } 
  
    
  } //end class player