import { Howl } from "https://cdn.skypack.dev/howler";

export class SoundController{
    //soll Musik gespielt werden?
    shouldSoundBeOn = true; 

    //jumpsound
    jumpsound;

    //Player wird getroffen
    playergotHit;

    //Münze eingesammelt
    coincollected;

    //5coin eingesammelt
    coin5collected;

    //Leben einsammeln
    lifecollected;

    //hintergrundmusik
    backroundmusicLevel;

    //wird die hintergrundmusik gerade abgespielt?
    musicplaying = false;

    async init() {
        //springen
        this.jumpsound = new Howl({
            src: ["../assets/audio/jump.mp3"],
            volume: 0.5
        });
  
        //hintergrundmusik
        this.backroundmusicLevel = new Howl({
            src: ["../assets/audio/hintergrundmusik-level.mp3"],
            volume: 0.3,
            loop: true
        });

        //Münze einsammeln
        this.coincollected = new Howl({
            src: ["../assets/audio/coin-recieved.mp3"],
            volume: 0.5
        });

        this.coin5collected = new Howl({
            src: ["../assets/audio/coin5-collected.mp3"],
            volume: 0.5
        });

        this.lifecollected = new Howl({
            src: ["../assets/audio/life-collected2.mp3"],
            volume: 0.8
        });

        this.playergotHit = new Howl({
            src: ["../assets/audio/player-got-hit2.mp3"],
            volume: 0.5
        });
            

        if(this.shouldSoundBeOn){
            this.backroundmusicLevel.play();
        }
    }

    jump(){
        if(this.shouldSoundBeOn){
            this.jumpsound.play();
            //falls Hintergrundmusik doch noch nicht beim Start des Levels abgespielt wurde
            if(!this.musicplaying){
                this.backroundmusicLevel.play();
                this.musicplaying = true;
            }
        }
    }

    backroundMusic(){
        if(this.shouldSoundBeOn){
            if(!this.musicplaying){
                this.backroundmusicLevel.play();
                this.musicplaying = true;
            }
        }
    }

    coinCollected(){
        if(this.shouldSoundBeOn){
            this.coincollected.play();
        
        }
    }

    coin5Collected(){
        if(this.shouldSoundBeOn){
            this.coin5collected.play();
        
        }
    }

    lifeCollected(){
        if(this.shouldSoundBeOn){
            this.lifecollected.play();
        
        }
    }

    playerGotHit(){
        if(this.shouldSoundBeOn){
            this.playergotHit.play();
        
        }
    }

    switchOnOff(){
        this.shouldSoundBeOn = !this.shouldSoundBeOn;
        if(this.shouldSoundBeOn){
            this.backroundmusicLevel.play();
        }else{
            this.jumpsound.pause();
            this.coincollected.pause();
            this.backroundmusicLevel.pause();
        }
    }
}