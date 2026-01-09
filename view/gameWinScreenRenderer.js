import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

const BTNWIDTH = 350;
const BTNHEIGHT = 70;

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

    createButton(restart, next, start) {

        // =========================
        // OVERLAY
        // =========================
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x005000, 0.55);
        overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        overlay.endFill();
        overlay.eventMode = "none";
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
        console.log(this.collected5Coins);

        //Anker und Scale
        [coin1, coin2, coin3].forEach((coin, i) => {
            coin.anchor.set(0.5);
            coin.scale.set(i === 1 ? 2 : 1.4); //Wenn es die zweite Münze ist, größer skalieren, sonst normal. 
            coin.zIndex = 900;
        });

        //Container hinzufügen
        titleContainer.addChild(coin1, coin2, coin3);

        //Position relativ zum Container setzen
        coin1.x = 123; //links
        coin1.y = -50;
        coin2.x = 230; //mitte
        coin2.y = -75;
        coin3.x = 337; //rechts
        coin3.y = -50;


        // =========================
        // NEUSTART BUTTON
        // =========================
        const btnContainer = new PIXI.Container();
        this.container.addChild(btnContainer);

        // Button-Grafik
        const btn1 = new PIXI.Graphics();
        btn1.beginFill(0x333333, 0.9);
        btn1.drawRoundedRect(0, 0, BTNWIDTH, BTNHEIGHT, 14);
        btn1.endFill();

        //Button reagiert auf Events
        btn1.eventMode = "static";
        btn1.cursor = "pointer"; //Mauszeiger

        // Hover-Effekt
        btn1.on("pointerover", () => {
            btn1.clear();
            btn1.beginFill(0x999999, 1);
            btn1.drawRoundedRect(0, 0, BTNWIDTH, BTNHEIGHT, 14);
            btn1.endFill();
        });

        btn1.on("pointerout", () => {
            btn1.clear();
            btn1.beginFill(0x333333, 0.9);
            btn1.drawRoundedRect(0, 0, BTNWIDTH, BTNHEIGHT, 14);
            btn1.endFill();
        });

        btnContainer.addChild(btn1);

        // Button-Text
        const text = new PIXI.Text("NEUSTART", {
            fontFamily: "Press Start 2P",
            fontSize: 20,
            fill: 0xffffff
        });

        text.anchor.set(0.5);
        text.x = BTNWIDTH /2; // Hälfte von 260
        text.y = BTNHEIGHT/2;  // Hälfte von 70
        btn1.addChild(text);

        // Click-Event
        btn1.on("pointertap", () => {
            restart();
        });


        // =========================
        // NEXT LEVEL BUTTON 
        // =========================
        // Button-Grafik
        const btn2 = new PIXI.Graphics();
        btn2.beginFill(0x333333, 0.9);
        btn2.drawRoundedRect(0, 100, BTNWIDTH, BTNHEIGHT, 14);
        btn2.endFill();

        //Button reagiert auf Events
        btn2.eventMode = "static";
        btn2.cursor = "pointer"; //Mauszeiger

        // Hover-Effekt
        btn2.on("pointerover", () => {
            btn2.clear();
            btn2.beginFill(0x999999, 1);
            btn2.drawRoundedRect(0, 100, BTNWIDTH, BTNHEIGHT, 14);
            btn2.endFill();
        });

        btn2.on("pointerout", () => {
            btn2.clear();
            btn2.beginFill(0x333333, 0.9);
            btn2.drawRoundedRect(0, 100, BTNWIDTH, BTNHEIGHT, 14);
            btn2.endFill();
        });

        btnContainer.addChild(btn2);

        // Button-Text
        const text2 = new PIXI.Text("NÄCHSTES LEVEL", {
            fontFamily: "Press Start 2P",
            fontSize: 20,
            fill: 0xffffff
        });

        text2.anchor.set(0.5);
        text2.x = BTNWIDTH/2; // Hälfte von 400
        text2.y = 100 + BTNHEIGHT/2;  // Hälfte von 70
        btn2.addChild(text2);
        console.log(btn2.x);

         // Click-Event
        btn2.on("pointertap", () => {
            next();
        });


        // =========================
        // START BUTTON 
        // =========================
        // Button-Grafik
        const btn3 = new PIXI.Graphics();
        btn3.beginFill(0x333333, 0.9);
        btn3.drawRoundedRect(0, 200, BTNWIDTH, BTNHEIGHT, 14);
        btn3.endFill();

        //Button reagiert auf Events
        btn3.eventMode = "static";
        btn3.cursor = "pointer"; //Mauszeiger

        // Hover-Effekt
        btn3.on("pointerover", () => {
            btn3.clear();
            btn3.beginFill(0x999999, 1);
            btn3.drawRoundedRect(0, 200, BTNWIDTH, BTNHEIGHT, 14);
            btn3.endFill();
        });

        btn3.on("pointerout", () => {
            btn3.clear();
            btn3.beginFill(0x333333, 0.9);
            btn3.drawRoundedRect(0, 200, BTNWIDTH, BTNHEIGHT, 14);
            btn3.endFill();
        });

        btnContainer.addChild(btn3);

        // Button-Text
        const text3 = new PIXI.Text("ZUM START", {
            fontFamily: "Press Start 2P",
            fontSize: 20,
            fill: 0xffffff
        });

        text3.anchor.set(0.5);
        text3.x = BTNWIDTH/2; // Hälfte von 400
        text3.y = 200 + BTNHEIGHT/2;  // Hälfte von 70
        btn3.addChild(text3);

         // Click-Event
        btn3.on("pointertap", () => {
            start();
        });

        //=====================================================

        // Button-Position
        btnContainer.x = window.innerWidth / 2 - BTNWIDTH/2;
        btnContainer.y = window.innerHeight / 2 + BTNHEIGHT/2;
    }


    //Methode, um die eingesammelten Starcoins abzufragen
    getCollected5Coins(coins) {
        this.collected5Coins = coins;
    }


    // showResults() {

    // }

} //end class
