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

    //Methode, die überprüft, ob eine Kollision stattgefunden hat von Oben, wenn man auf Gumbas draufspringt
    collisionUp(player, enemy) {
      //findet überhapt eine Kollision statt?
      const collision = this.collision(player, enemy);
      if(!collision) return false;

      //fällt der Player?
      if (player.prevVy <= 0) return false;

      //war player oberhalb des Gegners?
      const playerBottom = player.y + player.height;
      const enemyTop = enemy.y;

      //10 ist Toleranzwert
      return playerBottom - 10 <= enemyTop;

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

    //Methode, um alle Kollisionsblöcke zu entfernen
    clear() {
      this.colliders.forEach(collider => {
          if (collider.destroy) collider.destroy();
      });
      this.colliders.length = 0;
    }

}