export class DBBro{
    constructor(x, y, width = 32, height = 32) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.alive = true; //dbbro lebt
        this.sprite = null;       // wird später vom Renderer gesetzt

        this.throwTimer = 0;
        this.justThrew = false;

        // Hitbox-Helfer 
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
    }

    //wenn dbbro stirbt
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

    //alle 2 sek wird geworfen
    updateThrowTimer(dt){
        if(!this.justThrew) return;

        this.throwTimer -= dt;

        if(this.throwTimer <= 0){
            this.justThrew = false;
            this.throwTimer = 0;
        }
    }

    isPlayerClose(playerX){
        let distance = this.x - playerX;
        if(distance < 1000 && distance > -1000){
            return true;
        }else{
            return false;
        }
    }

    wherePlayer(playerX){
        let distance = this.x - playerX;
        if(distance > 0){//Spieler ist links
            return true;
        }else{ //Spieler ist rechts
            return false;
        }
    }

}