export class Trains{
    constructor(x, y, width = 32, height = 32) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 90; //evt anpassen
        //die beiden bilden zusammen den richtungsvektor
        this.directionX = -1 //startet nach links
        this.directionY = 0;

        this.alive = true; //Gumba lebt
        this.sprite = null;       // wird später vom Renderer gesetzt

        // Hitbox-Helfer, kp ob das wiklich nötig ist 
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;

        //console.log("Zug erstellt!");
    }

    calculateDirection(playerX, playerY){
        this.directionX = playerX - this.x;
        this.directionY = playerY - this.y;

        //diese x und y Werte vom Richtungs Vektor normieren

        //länge Vektor bestimmen
        let laengeVektor = Math.sqrt(this.directionX * this.directionX + this.directionY * this.directionY);

        //Einzelnen Werte des Vektors normieren
        this.directionX = this.directionX / laengeVektor;
        this.directionY = this.directionY / laengeVektor;
    }

    //Methode, die die Position bei Bewegungen verändert
    move (dt) {
        this.x += this.directionX * this.speed * dt;
        this.y += this.directionY * this.speed * dt;
        this.updateHitbox();
    }

    //Methode, die die Position des Players updatet. Wird im Controller aufgerufen
    //direction, true = rechts, false = links
    reverse() {
        this.directioX *= -1;
        
    } 

    //falls zug auch sterben soll
    dies(){
        this.alive = false;
        //unsichtbar machen, für neustart einfacher
        this.sprite.visible = false;
    }

    // Update der Hitbox (falls Sprite Position verändert wurde)
    updateHitbox() {
        this.x1 = this.x;
        this.y1 = this.y;
        this.x2 = this.x + this.width;
        this.y2 = this.y + this.height;
    }

}