export class Gumbas{
    constructor(x, y, width = 32, height = 32) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 70; //evt anpassen
        this.direction = -1 //startet nach links

        this.alive = true; //Gumba lebt
        this.sprite = null;       // wird später vom Renderer gesetzt

        // Hitbox-Helfer, kp ob das wiklich nötig ist 
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
    }

    //Methode, die die Position bei Bewegungen verändert
    move (dt) {
        this.x += this.direction * this.speed * dt;
        this.updateHitbox();
    }

    //Methode, die die Position des Players updatet. Wird im Controller aufgerufen
    //direction, true = rechts, false = links
    reverse() {
        this.direction *= -1;
        
    } 

    //wenn gumba stirbt
    dies(){
        this.alive = false;
        //unsichtbar machen, für neustart einfacher
        this.sprite.visible = false;
    }

    // Update der Hitbox (falls Sprite Position verändert würde)
    updateHitbox() {
        this.x1 = this.x;
        this.y1 = this.y;
        this.x2 = this.x + this.width;
        this.y2 = this.y + this.height;
    }

}