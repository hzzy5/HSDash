import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

const BTNWIDTH = 350;
const BTNHEIGHT = 70;

export class GameOverScreenRenderer {

    constructor(uiContainer) {
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

    createStartButton(restart, start) {

        // =========================
        // OVERLAY
        // =========================
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0xff1a2a, 0.55);
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
        const titleText = new PIXI.Text("GAME OVER", {
            fontFamily: "Press Start 2P",
            fontSize: 42,
            fill: 0xffffff,
            dropShadow: true,
            dropShadowColor: 0xff0000,
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
        // RESTART BUTTON CONTAINER
        // =========================
        const btnContainer = new PIXI.Container();
        this.container.addChild(btnContainer);

        // Button-Grafik
        const btn = new PIXI.Graphics();
        btn.beginFill(0x333333, 0.9);
        btn.drawRoundedRect(0, 0, BTNWIDTH, BTNHEIGHT, 14);
        btn.endFill();

        btn.eventMode = "static";
        btn.cursor = "pointer";

        // Hover-Effekt
        btn.on("pointerover", () => {
            btn.clear();
            btn.beginFill(0x999999, 1);
            btn.drawRoundedRect(0, 0, BTNWIDTH, BTNHEIGHT, 14);
            btn.endFill();
        });

        btn.on("pointerout", () => {
            btn.clear();
            btn.beginFill(0x333333, 0.9);
            btn.drawRoundedRect(0, 0, BTNWIDTH, BTNHEIGHT, 14);
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
        text.x = BTNWIDTH/2; // Hälfte von 260
        text.y = BTNHEIGHT/2;  // Hälfte von 70
        btn.addChild(text);

        // Button-Position
        btnContainer.x = window.innerWidth / 2 - BTNWIDTH/2;
        btnContainer.y = window.innerHeight / 2 + BTNHEIGHT/2;

        // Click-Event
        btn.on("pointertap", () => {
            restart();
        });


        // =========================
        // START MENU CONTAINER
        // =========================

        // Button-Grafik
        const btn2 = new PIXI.Graphics();
        btn2.beginFill(0x333333, 0.9);
        btn2.drawRoundedRect(0, 100, BTNWIDTH, BTNHEIGHT, 14);
        btn2.endFill();

        btn2.eventMode = "static";
        btn2.cursor = "pointer";

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
        const text2 = new PIXI.Text("ZUM START", {
            fontFamily: "Press Start 2P",
            fontSize: 24,
            fill: 0xffffff
        });

        text2.anchor.set(0.5);
        text2.x = BTNWIDTH/2; // Hälfte von 260
        text2.y = BTNHEIGHT/2 + 100;  // Hälfte von 70
        btn2.addChild(text2);

        // Button-Position
        btnContainer.x = window.innerWidth / 2 - BTNWIDTH/2;
        btnContainer.y = window.innerHeight / 2 + BTNHEIGHT/2;

        // Click-Event
        btn2.on("pointertap", () => {
            start();
        });
    }
}
