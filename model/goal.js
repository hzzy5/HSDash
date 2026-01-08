export class Goal{
    constructor(x, y, width, height, offsetY) {
        this.x = x;
        this.y = y + offsetY;
        this.width = width; //schmaler machen!
        this.height = height;
        this.sprite = null;       // wird später vom Renderer gesetzt

        //True, wenn das Ziel erreicht wurde
        //this.reached = false;
    }

    // Update der Hitbox (falls Sprite Position verändert würde)
    updateHitbox() {
        this.x1 = this.x;
        this.y1 = this.y;
        this.x2 = this.x + this.width;
        this.y2 = this.y + this.height;
    }

    // //Wenn das Ziel erreicht wurde, wird das Flag auf true gesetzt
    // onReached() {
    //     this.reached = true;
    // }
}
