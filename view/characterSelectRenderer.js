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
        bg1.beginFill(0x49a5f9); 
        bg1.drawRect(0, 0, 200, 300); 
        bg1.endFill();
        playerFrame1.addChild(bg1);

        const player1 = PIXI.Sprite.from("sebastian");
        player1.anchor.set(0.5);
        player1.scale.set(4);
        player1.x = 100; //innerhalb playerFrame1
        player1.y = 150;
        playerFrame1.addChild(player1);

        //2
        const bg2 = new PIXI.Graphics();
        bg2.beginFill(0x49a5f9); 
        bg2.drawRect(0, 0, 200, 300); 
        bg2.endFill();
        playerFrame2.addChild(bg2);

        const player2 = PIXI.Sprite.from("dennis");
        player2.anchor.set(0.5);
        player2.scale.set(3.6);
        player2.x = 100; //innerhalb playerFrame2
        player2.y = 150;
        playerFrame2.addChild(player2);

        playerFrame1.x = window.innerWidth / 2 - 250;
        playerFrame1.y = window.innerHeight / 2 - 150;
        playerFrame2.x = window.innerWidth / 2 + 50;
        playerFrame2.y = window.innerHeight / 2 - 150;

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
            // btn.clear();
            // btn.beginFill(0x999999, 1);
            // btn.drawRoundedRect(0, 0, 260, 70, 14);
            // btn.endFill();
        });

        playerFrame2.on("pointerover", () => {
            // btn.clear();
            // btn.beginFill(0x999999, 1);
            // btn.drawRoundedRect(0, 0, 260, 70, 14);
            // btn.endFill();
        });
        
        playerFrame1.on("pointerout", () => {
            // btn.clear();
            // btn.beginFill(0x333333, 0.9);
            // btn.drawRoundedRect(0, 0, 260, 70, 14);
            // btn.endFill();
        });

        playerFrame2.on("pointerout", () => {
            // btn.clear();
            // btn.beginFill(0x333333, 0.9);
            // btn.drawRoundedRect(0, 0, 260, 70, 14);
            // btn.endFill();
        });


        // Click-Event
        playerFrame1.on("pointertap", () => {
            onSelect();
        });

        playerFrame2.on("pointertap", () => {
            onSelect();
        });

    }

} //end class
