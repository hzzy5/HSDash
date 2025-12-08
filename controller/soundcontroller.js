import { Howl } from "https://cdn.skypack.dev/howler";

export class SoundController{
    //soll Musik gespielt werden?
    shouldSoundBeOn = true; 

    //jumpsound
    jumpsound;

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