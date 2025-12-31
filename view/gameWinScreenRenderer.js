import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

export class GameWinScreenRenderer {

    constructor(uiContainer,screen, coins5) {
        // UI-Container von außen
        this.ui = uiContainer;
        this.screen = screen;
        this.collected5Coins = coins5;

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

    createStartButton(onStart) {

        // =========================
        // OVERLAY
        // =========================
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x005000, 0.55);
        overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        overlay.endFill();
        this.container.addChild(overlay);

        // =========================
        // TITEL CONTAINER
        // =========================
        const titleContainer = new PIXI.Container();
        this.container.addChild(titleContainer);

        // Titel-Hintergrund
        const titleBg = new PIXI.Graphics();
        titleBg.beginFill(0x000000, 0.95);
        titleBg.drawRoundedRect(0, 0, 460, 100, 22);
        titleBg.endFill();
        titleContainer.addChild(titleBg);

        // Titel-Text
        const titleText = new PIXI.Text("YOU WIN!", {
            fontFamily: "Press Start 2P",
            fontSize: 42,
            fill: 0xffffff,
            dropShadow: true,
            dropShadowColor: 0x00ff00,
            dropShadowBlur: 8,
            dropShadowDistance: 4
        });

        titleText.anchor.set(0.5);
        titleText.x = 230;
        titleText.y = 50;
        titleContainer.addChild(titleText);

        // Titel-Position
        titleContainer.x = window.innerWidth / 2 - 230;
        titleContainer.y = window.innerHeight / 2 - 140;


        // =========================
        // STARCOIN ANZEIGE
        // =========================
        //Anzahl der eingesammelten starcoins 
        //Texturen vorbereiten
        const coinFilledTex = PIXI.Texture.from("coin5HUD");
        const coinEmptyTex = PIXI.Texture.from("coin5empty");

        //Coins erzeugen: Wenn Index größer der eingesammelten Münzen ist, 5Coin anzeigen, sonst leer.
        let coin1 = new PIXI.Sprite(this.collected5Coins >= 1 ? coinFilledTex : coinEmptyTex);
        let coin2 = new PIXI.Sprite(this.collected5Coins >= 2 ? coinFilledTex : coinEmptyTex);
        let coin3 = new PIXI.Sprite(this.collected5Coins >= 3 ? coinFilledTex : coinEmptyTex);

        //Anker und Scale
        [coin1, coin2, coin3].forEach((coin, i) => {
            coin.anchor.set(0.5);
            coin.scale.set(i === 1 ? 5.5 : 4); //Wenn es die zweite Münze ist um 5.5 skalieren, sonst 4. 
            coin.zIndex = 900;
        });

        //Container hinzufügen
        titleContainer.addChild(coin1, coin2, coin3);

        //Position relativ zum Container setzen
        coin1.x = 125; //links
        coin1.y = -50;
        coin2.x = 230; //mitte
        coin2.y = -75;
        coin3.x = 335; //rechts
        coin3.y = -50;


        // =========================
        // START BUTTON CONTAINER
        // =========================
        const btnContainer = new PIXI.Container();
        this.container.addChild(btnContainer);

        // Button-Grafik
        const btn = new PIXI.Graphics();
        btn.beginFill(0x333333, 0.9);
        btn.drawRoundedRect(0, 0, 260, 70, 14);
        btn.endFill();

        //Button reagiert auf Events
        btn.eventMode = "static";
        btn.cursor = "pointer"; //Mauszeiger

        // Hover-Effekt
        btn.on("pointerover", () => {
            btn.clear();
            btn.beginFill(0x999999, 1);
            btn.drawRoundedRect(0, 0, 260, 70, 14);
            btn.endFill();
        });

        btn.on("pointerout", () => {
            btn.clear();
            btn.beginFill(0x333333, 0.9);
            btn.drawRoundedRect(0, 0, 260, 70, 14);
            btn.endFill();
        });

        btnContainer.addChild(btn);

        // Button-Text
        const text = new PIXI.Text("NEUSTART", {
            fontFamily: "Press Start 2P",
            fontSize: 24,
            fill: 0xffffff
        });

        text.anchor.set(0.5);
        text.x = 130; // Hälfte von 260
        text.y = 35;  // Hälfte von 70
        btn.addChild(text);

        // Button-Position
        btnContainer.x = window.innerWidth / 2 - 130;
        btnContainer.y = window.innerHeight / 2 + 40;

        // Click-Event
        btn.on("pointertap", () => {
            onStart();
        });
    }

    //Methode, um die eingesammelten Starcoins abzufragen
    getCollected5Coins(coins) {
        this.collected5Coins = coins;
    }

} //end class
