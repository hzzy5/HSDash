import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

export class CharacterSelectRederer {

    constructor(uiContainer, screen) {
        // UI-Container von außen
        this.ui = uiContainer;
        this.screen = screen;

        // eigener Startscreen-Container
        this.container = new PIXI.Container();
        this.ui.addChild(this.container);

        // immer ganz oben zeichnen
        this.ui.setChildIndex(this.container, this.ui.children.length - 1);

        // initial unsichtbar
        this.container.visible = false;
    }

    show() {
        this.container.visible = true;
    }

    hide() {
        this.container.visible = false;
    }

    //Diese Methode erzeugt den SelectCharacter screen.
    createButton(onSelect) {
        // =========================
        // OVERLAY
        // =========================
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x0b1a2a, 0.55);
        overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        overlay.endFill();
        this.container.addChild(overlay);

        // =========================
        // TITEL CONTAINER
        // =========================
        const titleContainer = new PIXI.Container();
        this.container.addChild(titleContainer);

        // // Titel-Hintergrund
        // const titleBg = new PIXI.Graphics();
        // titleBg.beginFill(0x000000, 0.95);
        // titleBg.drawRoundedRect(0, 0, 860, 100, 22);
        // titleBg.endFill();
        // titleContainer.addChild(titleBg);

        // Titel-Text
        const titleText = new PIXI.Text("WÄHLE DEINEN SPIELER", {
            fontFamily: "Press Start 2P",
            fontSize: 42,
            fill: 0xffffff,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 8,
            dropShadowDistance: 4
        });

        titleText.anchor.set(0.5);
        titleText.x = 350;
        titleText.y = 50;
        titleContainer.addChild(titleText);

        // Titel-Position
        titleContainer.x = window.innerWidth / 2 - 350;
        titleContainer.y = window.innerHeight / 2 - 240;


        // =========================
        // PLAYER GRAFIKEN, PLAYER BUTTONS
        // =========================
        const selectContainer = new PIXI.Container();
        this.container.addChild(selectContainer);

        const playerFrame1 = new PIXI.Container();
        const playerFrame2 = new PIXI.Container();
        selectContainer.addChild(playerFrame1, playerFrame2);
        
        //Hintergrund und Player erstellen
        //1
        const bg1 = new PIXI.Graphics();
        bg1.beginFill(0x1790ff); 
        bg1.drawRect(0, 0, 200, 300); 
        bg1.endFill();
        playerFrame1.addChild(bg1);

        const player1 = PIXI.Sprite.from("sebastian");
        player1.anchor.set(0.5);
        player1.scale.set(4);
        player1.x = bg1.width / 2; //innerhalb playerFrame1
        player1.y = bg1.height / 2;
        playerFrame1.addChild(player1);

        //2
        const bg2 = new PIXI.Graphics();
        bg2.beginFill(0x1790ff); 
        bg2.drawRect(0, 0, 200, 300); 
        bg2.endFill();
        playerFrame2.addChild(bg2);

        const player2 = PIXI.Sprite.from("dennis");
        player2.anchor.set(0.5);
        player2.scale.set(3.6);
        player2.x = bg2.width / 2; //innerhalb playerFrame2
        player2.y = bg2.height / 2;
        playerFrame2.addChild(player2);

        playerFrame1.x = window.innerWidth / 2 - 250;
        playerFrame1.y = window.innerHeight / 2 - 100;
        playerFrame2.x = window.innerWidth / 2 + 50;
        playerFrame2.y = window.innerHeight / 2 - 100;

        //Hover Frame
        const blueFrame1 = PIXI.Sprite.from("blueFrame");
        blueFrame1.anchor.set(0.5);
        blueFrame1.scale.set(0.6);
        blueFrame1.x = 100; //innerhalb playerFrame2
        blueFrame1.y = 159;
        

        const blueFrame2 = PIXI.Sprite.from("blueFrame");
        blueFrame2.anchor.set(0.5);
        blueFrame2.scale.set(0.6);
        blueFrame2.x = 100; //innerhalb playerFrame2
        blueFrame2.y = 159;
        

        // =========================
        // PLAYER BUTTONS
        // =========================
        //Hier wird der Container playerFrame einfach als Button definiert!!
        playerFrame1.eventMode = "static";
        playerFrame1.cursor = "pointer";

        playerFrame2.eventMode = "static";
        playerFrame2.cursor = "pointer";
        
        // Hover-Effekt
        playerFrame1.on("pointerover", () => {
            //Hintergrund ändern, später ggf Animation??
            bg1.clear();
            bg1.beginFill(0x8dc8ff); 
            bg1.drawRect(0, 0, 200, 300); 
            bg1.endFill();


            //Vergrößern
            playerFrame1.scale.set(1.15);
            playerFrame1.x = window.innerWidth / 2 - 265;
            playerFrame1.y = window.innerHeight / 2 - 130;
         
            //Frame hinzufügen
            playerFrame1.addChildAt(blueFrame1, 1);

        });

        playerFrame1.on("pointerout", () => {
            //Player bild zurücksetzen

            //Hintergrund zurücksetzen
            bg1.beginFill(0x1790ff); 
            bg1.drawRect(0, 0, 200, 300); 
            bg1.endFill();

            //Skalierung zurücksetzen
            playerFrame1.scale.set(1);
            playerFrame1.x = window.innerWidth / 2 - 250;
            playerFrame1.y = window.innerHeight / 2 - 100;
        
            //Blauen Rahmen entfernen
            playerFrame1.removeChild(blueFrame1);
        });


        playerFrame2.on("pointerover", () => {
            //Hintergrund ändern, später ggf Animation??
            bg2.clear();
            bg2.beginFill(0x8dc8ff); 
            bg2.drawRect(0, 0, 200, 300); 
            bg2.endFill();

            //Vergrößern
            playerFrame2.scale.set(1.15);
            playerFrame2.x = window.innerWidth / 2 + 35;
            playerFrame2.y = window.innerHeight / 2 - 130;
         
            //Frame hinzufügen
            playerFrame2.addChildAt(blueFrame2, 1);
            
        });

        playerFrame2.on("pointerout", () => {
            //Player bild zurücksetzen

            //Hintergrund zurücksetzen
            bg2.beginFill(0x1790ff); 
            bg2.drawRect(0, 0, 200, 300); 
            bg2.endFill();

            //Vergrößern
            playerFrame2.scale.set(1);
            playerFrame2.x = window.innerWidth / 2 + 50;
            playerFrame2.y = window.innerHeight / 2 - 100;
            
            //Blauen Rahmen entfernen
            playerFrame2.removeChild(blueFrame2);
            
        });


        // Click-Event
        playerFrame1.on("pointertap", () => {
            onSelect("sebastian"); //Player1 ausgewählt
        });

        playerFrame2.on("pointertap", () => {
            onSelect("dennis"); //Player2 ausgewählt
        });
    }

} //end class
