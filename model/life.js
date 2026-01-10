//Model-Klasse der Herzen zum einsammeln
export class Life{

    constructor(x, y, width = 32, height = 32) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.collected = false;   // wurde das Herz eingesammelt?
        this.sprite = null;       // wird später vom Renderer gesetzt

        // Hitbox-Helfer 
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
    }

    // Wenn Leben gesammelt wird
    collect() {
        this.collected = true;
        //unsichtbar machen, für neustart einfacher
        this.sprite.visible = false;
    }

    // Update der Hitbox (falls Sprite Position verändern würde)
    updateHitbox() {
        this.x1 = this.x;
        this.y1 = this.y;
        this.x2 = this.x + this.width;
        this.y2 = this.y + this.height;
    }

}//ende klasse life