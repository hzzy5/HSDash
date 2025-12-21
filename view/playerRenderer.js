/*Spezifische View-Klasse, die für die Darstellung des Players zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 

export class PlayerRenderer {

    constructor(container) {
        //Refrenz auf den Conatainer, der in der PIXI.app liegt.
        this.world = container;

        //Animationen
        this.idleAnimation = null;
        this.walkAnimation = null;
        this.runAnimation = null;
        this.jumpAnimation = null;
        this.fallAnimation = null;
        this.dashAnimation = null;
        //Array mit allen möglichen Animationen
        this.animations = null;
        //Aktuelle Animation
        this.currentAnimation = null;

         this.hitboxDebug = new PIXI.Graphics();
         this.hitboxDebug.zIndex = 9999;
         this.world.sortableChildren = true;
         this.world.addChild(this.hitboxDebug);
    }

    //Metehode, um das Sprite zu positioniert
    renderPlayer(x, y, x1, y1, w, h) {
        if(this.currentAnimation) {
            this.currentAnimation.position.set(x,y);
        }
        
        //Sicherheitshalber die anderen Animationen auch positionieren, damit man keine doppelten Sprites sieht
        this.animations.forEach(a => {
            if (a) a.position.set(x, y);
        });
        
        //DEBUG
        //this.drawHitbox(x1, y1, w, h);
    }

    //Methode, um den Player zu erstellen 
    createSprite(alias) {
        let sprite = PIXI.Sprite.from(alias);
        //Sprite anzeigen lassen
        this.world.addChild(sprite); 
        //^^ this ist hier das app-Objekt

        return sprite;
    }

    //Methode, die alle Animationen lädt
    async initAnimations() {
        //IDLE
        //Wenn es noch keine idle-animation gibt
            const sheet1 = PIXI.Assets.get('idleAnimation').data.animations;
            // create an animated sprite
            this.idleAnimation = PIXI.AnimatedSprite.fromFrames(sheet1["sonic_sprite_sheet_idleRight"]);
            this.idleAnimation.animationSpeed = 1 / 6; //6 fps
            this.idleAnimation.anchor.set(0.5, 0); //pivot point ist mittig (0.5) unten (1)
            this.idleAnimation.loop = true;
            this.idleAnimation.name = "idle";
            //this.view.app.stage.addChild(this.idleAnimation);

        //WALK
            const sheet2 = PIXI.Assets.get('walkAnimation').data.animations;
            // create an animated sprite
            this.walkAnimation = PIXI.AnimatedSprite.fromFrames(sheet2["sonic_sprite_sheet_walkRight"]);
            this.walkAnimation.animationSpeed = 1 / 6; 
            this.walkAnimation.anchor.set(0.5, 0);
            this.walkAnimation.loop = true;
            this.walkAnimation.name = "walk";
            //this.view.app.stage.addChild(this.walkAnimation);
        
        //RUN
            const sheet3 = PIXI.Assets.get('runAnimation').data.animations;
            // create an animated sprite
            this.runAnimation = PIXI.AnimatedSprite.fromFrames(sheet3["sonic_sprite_sheet_RunRight"]);
            this.runAnimation.animationSpeed = 1 / 6; 
            this.runAnimation.anchor.set(0.5, 0);
            this.runAnimation.loop = true; 
            this.runAnimation.name = "run";
            //this.view.app.stage.addChild(this.runAnimation);
        
        //JUMP
        //Wenn es noch keine jump-animation gibt
            const sheet4 = PIXI.Assets.get('jumpAnimation').data.animations;
            // create an animated sprite
            this.jumpAnimation = PIXI.AnimatedSprite.fromFrames(sheet4["sonic_sprite_sheet_jumpRight"]);
            this.jumpAnimation.animationSpeed = 1 / 6; 
            this.jumpAnimation.anchor.set(0.5, 0);
            this.jumpAnimation.loop = false;
            this.jumpAnimation.name = "jump";
            //this.view.app.stage.addChild(this.jumpAnimation);
        
        //FALL
            const sheet5 = PIXI.Assets.get('fallAnimation').data.animations;
            // create an animated sprite
            this.fallAnimation = PIXI.AnimatedSprite.fromFrames(sheet5["sonic_sprite_sheet_fallRight"]);
            this.fallAnimation.animationSpeed = 1 / 6; 
            this.fallAnimation.anchor.set(0.5, 0);
            this.fallAnimation.loop = false; 
            this.fallAnimation.name = "fall";
            //this.view.app.stage.addChild(this.fallAnimation);

        //DASH
            const sheet6 = PIXI.Assets.get('dashAnimation').data.animations;
            // create an animated sprite
            this.dashAnimation = PIXI.AnimatedSprite.fromFrames(sheet6["sonic_sprite_sheet_dashRight"]);
            this.dashAnimation.animationSpeed = 1 / 6; 
            this.dashAnimation.anchor.set(0.5, 0);
            this.dashAnimation.loop = false;
            this.dashAnimation.name = "dash";
            //this.view.app.stage.addChild(this.dashAnimation);

        //Alle möglichen Animationen
        this.animations = [this.idleAnimation, this.walkAnimation, this.runAnimation, this.jumpAnimation, this.fallAnimation, this.dashAnimation];
    }

    //Methode, die anhand des Player-States und der Richtung entscheidet, welche Animation abgespielt wird.
    updatePlayerAnimation(playerState, facing) {
        //Nächste Animation auswählen
        const nextAnimation = this.getNextAnimation(playerState);
        if (!nextAnimation) return;

        //Falls die vorherige Animation eine lockedAnimation ist und noch läuft, laufen lassen
        if (this.currentAnimation && this.isLockedAnimation (this.currentAnimation) && this.currentAnimation.playing) return;

        //Falls es keine Änderungen gab, muss auch nichts neu gezeichnet werden.
        if (this.currentAnimation === nextAnimation) {
            // ggf Richtung updaten
            this.updateFacing(facing);
            return;
        }
        
        // Alte Animation entfernen
        if(this.currentAnimation && this.currentAnimation.parent) {
            this.currentAnimation.stop();
            this.currentAnimation.parent.removeChild(this.currentAnimation);
        }

        //Neue Animation starten
        this.currentAnimation = nextAnimation;
        this.updateFacing(facing);
        this.world.addChild(this.currentAnimation);
        this.currentAnimation.gotoAndPlay(0);
    }

    //Methode, die die Animation anhand des Player-Zustandes auswählt.
    getNextAnimation(playerState) {
        //Aktuelle Animation auswählen
        switch (playerState) {
            case "idle":
                console.log("idle");
                return this.idleAnimation; 
            case "walk":
                console.log("walk");
                return this.walkAnimation;
            case "run":
                console.log("run");
                return this.runAnimation;
            case "jump":
                console.log("jump");
                return this.jumpAnimation;
            case "fall":
                console.log("fall");
                return this.fallAnimation;
            case "dash":
                console.log("dash");
                return this.dashAnimation;

            default: return null;
        }
    }

    //Methode, die die Animation ggf. spiegelt, falls der Spieler nach links (-1) gedreht ist.
    updateFacing(facing) {
        if(this.currentAnimation) {
            this.currentAnimation.scale.x = Math.abs(this.currentAnimation.scale.x) * facing;
        }
    }

    //Methode, die schaut, ob es sich um eine lockedAnimation handelt. LockedAnimations sollten immer bis zum Ende laufen, sonst "flackern" sie.
    isLockedAnimation(a) {
        return (
            a === this.dashAnimation
            // || a === this.jumpAnimation 
            // || a === this.fallAnimation   
        );
    }
 
    //DEBUG
    drawHitbox(x, y, w, h) {
        this.hitboxDebug.clear();
        this.hitboxDebug
        .rect(x, y, w, h)
        .fill({ color: 0xff0000, alpha: 0.25 })
        .stroke({ width: 2, color: 0xff0000 });
    }


} //end class