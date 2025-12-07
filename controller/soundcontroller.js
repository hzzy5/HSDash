import { Howl } from "https://cdn.skypack.dev/howler";

export class SoundController{
    //soll Musik gespielt werden?
    sollSoundAn = true; 

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
    }

    jump(){
        this.jumpsound.play();
        if(!this.musicplaying){
            this.backroundmusicLevel.play();
            this.musicplaying = true;
        }
    }
}
