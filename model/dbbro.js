//Model Klasse des DBBruders
export class DBBro{
    constructor(x, y, width = 32, height = 32) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.alive = true; //dbbro lebt
        this.sprite = null;       // wird später vom Renderer gesetzt

        this.throwTimer = 0; //Timer erst auf 0 setzen
        this.justThrew = false; //hat er grad geworfen?

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

    // Update der Hitbox (falls Sprite Position verändern würde)
    updateHitbox() {
        this.x1 = this.x;
        this.y1 = this.y;
        this.x2 = this.x + this.width;
        this.y2 = this.y + this.height;
    }

    //alle 10 sek wird geworfen
    updateThrowTimer(dt){
        if(!this.justThrew) return; //wenn er noch geworfen hat return

        //timer updaten
        this.throwTimer -= dt;

        //Timer abgelaufen
        if(this.throwTimer <= 0){
            this.justThrew = false;
            this.throwTimer = 0;
        }
    }

    //ist der Spieler in der Nähe?
    isPlayerClose(playerX){
        let distance = this.x - playerX;
        if(distance < 1000 && distance > -1000){
            return true;
        }else{
            return false;
        }
    }

    //in welcher Richtung ist der Spieler? um das Sprite dann in diese Richtung zu drehen
    wherePlayer(playerX){
        let distance = this.x - playerX;
        if(distance > 0){//Spieler ist links
            return true;
        }else{ //Spieler ist rechts
            return false;
        }
    }

}