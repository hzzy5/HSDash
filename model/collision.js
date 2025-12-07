export class Collision {

  constructor() {
        this.colliders = []; // Array mit allen Kollisionobjekten
    }

    //Methode, die überprüft, ob eine Kollision stattgefunden hat
    collision(a, b) {
        return !
        (a.x + a.width <= b.x || 
         a.x >= b.x + b.width || 
         a.y + a.height <= b.y || 
         a.y >= b.y + b.height);
    }

    //Methode, die mögliche Kollisionsblöcke in die Liste hinzufügt
    addCollider(c) { //Für Kollisionserkennung zum hinzufügen von möglichen Kollsionsblöcken
      this.colliders.push(c);
      return c;
    }
    
    //Methode, die die Kollsionsblöcke zurückgibt. Zum Debuggen? 
    getAllColliders() { 
      return this.colliders;
    }

}