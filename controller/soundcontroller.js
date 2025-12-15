import { Howl } from "https://cdn.skypack.dev/howler";

export class SoundController{
    //soll Musik gespielt werden?
    shouldSoundBeOn = true; 

    //jumpsound
    jumpsound;

    //Münze eingesammelt
    coincollected;

    //hintergrundmusik
    backroundmusicLevel;

    //wird die hintergrundmusik gerade abgespielt?
    musicplaying = false;

    async init() {
        //sound
        this.jumpsound = new Howl({
            src: ["../assets/audio/jump.mp3"],
            volume: 0.5
        });
  
        //hintergrundmusik
        this.backroundmusicLevel = new Howl({
            src: ["../assets/audio/hintergrundmusik-level.mp3"],
            volume: 0.5,
            loop: true
        });

        this.coincollected = new Howl({
            src: ["../assets/audio/coin-recieved.mp3"],
            volume: 0.5
        });
            

        if(this.shouldSoundBeOn){
            this.backroundmusicLevel.play();
        }
    }

    jump(){
        if(this.shouldSoundBeOn){
            this.jumpsound.play();
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

    switchOnOff(){
        this.shouldSoundBeOn = !this.shouldSoundBeOn;
        if(this.shouldSoundBeOn){
            this.backroundmusicLevel.play();
        }else{
            this.jumpsound.pause();
            this.backroundmusicLevel.pause();
        }
    }
}