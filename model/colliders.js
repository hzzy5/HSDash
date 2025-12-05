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

    // //STATISCHE FUNKTIONEN
    // //Methode, die prüft, ob eine Kollision stattgefunden hat
    // //Collision Detection player vs enemy 
    // static collision(a, b) {
    //     let aBox = a.getBounds();
    //     let bBox = b.getBounds();

    //     return aBox.x-45 + aBox.width > bBox.x &&   //hier ungenau: -35, da es noch transparente Ränder gibt. 
    //         aBox.x-45 < bBox.x + bBox.width &&
    //         aBox.y + aBox.height > bBox.y &&
    //         aBox.y < bBox.y + bBox.height;
    // }



}