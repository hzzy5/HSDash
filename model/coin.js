export class Coin {

    constructor(x, y, width = 32, height = 32) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.collected = false;   // wurde die Münze eingesammelt?
        this.sprite = null;       // wird später vom Renderer gesetzt

        // Hitbox-Helfer 
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
    }

    // Wenn Coin gesammelt wird
    collect() {
        this.collected = true;
        // Sprite später im Controller entfernen
        if (this.sprite && this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
    }

    // Update der Hitbox (falls Sprite Position verändert würde)
    updateHitbox() {
        this.x1 = this.x;
        this.y1 = this.y;
        this.x2 = this.x + this.width;
        this.y2 = this.y + this.height;
    }

}// Ende Klasse Coin
