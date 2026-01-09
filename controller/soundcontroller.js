import { Howl } from "https://cdn.skypack.dev/howler";

export class SoundController{
    //soll Musik gespielt werden?
    shouldSoundBeOn = true; 

    //jumpsound
    jumpsound;

    //wenn der Player dashed
    playerdash;

    //Player wird getroffen
    playergotHit;

    //player Stirbt
    playerdies;

    //Münze eingesammelt
    coincollected;

    //5coin eingesammelt
    coin5collected;

    //Leben einsammeln
    lifecollected;

    //Gumba stirbt
    gumbadies;

    //Level gewonnen
    levelwon;

    //hintergrundmusik
    backroundmusicLevel;

    //wird die hintergrundmusik gerade abgespielt?
    musicplaying = false;

    bosstheme;

    bossmusicplaying = false;

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

        this.bosstheme = new Howl({
            src: ["../assets/audio/bosstheme.mp3"],
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
            volume: 0.8
        });

        this.gumbadies = new Howl({
            src: ["../assets/audio/gumba-dies.mp3"],
            volume: 1
        });

        this.playerdies = new Howl({
            src: ["../assets/audio/player-death.mp3"],
            volume: 0.7
        });

        this.levelwon = new Howl({
            src: ["../assets/audio/level-won.mp3"],
            volume: 0.7
        });

        this.playerdash = new Howl({
            src: ["../assets/audio/player-dash.mp3"],
            volume: 1
        });
            

        if(this.shouldSoundBeOn){
            if(!this.musicplaying){
                this.backroundmusicLevel.play();
                this.musicplaying = true;
            }
        }
    }

    jump(){
        if(this.shouldSoundBeOn){
            this.jumpsound.play();
            //falls Hintergrundmusik doch noch nicht beim Start des Levels abgespielt wurde
            //wird dann allerdings auch immer wieder abgespielt wenn bosskampf musik läuft haha
            //if(!this.musicplaying && !this.bossmusicplaying){
                //this.backroundmusicLevel.play();
                //this.musicplaying = true;
            //}
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

    switchToBosstheme(){
        if(this.shouldSoundBeOn){
            if(this.musicplaying && !this.bossmusicplaying){
                this.backroundmusicLevel.pause();
                this.backroundmusicLevel.fade(0.3, 0, 1000);
                this.musicplaying = false;
                this.bosstheme.play();
                this.bosstheme.fade(0, 0.3, 1000);
                this.bossmusicplaying = true;
                console.log("Bosstheme gestartet");
            }
        }
    }

    switchBackToMaintheme(){
        if(this.shouldSoundBeOn){
            if(this.bossmusicplaying && !this.musicplaying){
                this.bosstheme.pause();
                this.bosstheme.fade(0.3, 0, 1000);
                this.bossmusicplaying = false;
                this.backroundmusicLevel.play();
                this.backroundmusicLevel.fade(0, 0.3, 1000);
                this.musicplaying = true;
                console.log("zurück zu anderer Musik");
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

    playerDies(){
        if(this.shouldSoundBeOn){
            this.playerdies.play();
        
        }
    }

    gumbaDies(){
        if(this.shouldSoundBeOn){
            this.gumbadies.play();
        
        }
    }

    levelWon(){
        if(this.shouldSoundBeOn){
            this.levelwon.play();
        
        }
    }

    playerDash(){
        if(this.shouldSoundBeOn){
            this.playerdash.play();
        
        }
    }

    switchOnOff(){
        this.shouldSoundBeOn = !this.shouldSoundBeOn;
        if(this.shouldSoundBeOn){
            this.backroundMusic();

        }else{
            this.jumpsound.pause();
            this.coincollected.pause();
            this.backroundmusicLevel.pause();
            this.musicplaying = false;
            this.bosstheme.pause();
            this.bossmusicplaying = false;
        }
    }
}