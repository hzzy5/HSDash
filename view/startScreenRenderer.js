import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

export class StartScreenRenderer {

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

    createStartButton(onStart) {
        // =========================
        // BACKGROUND
        // =========================
        const background = PIXI.Sprite.from("vorschau");
        background.width = this.screen.width;
        background.height = background.texture.height*2;
        background.y = 30;
        background.scale.set(2.25);
        
        const background2 = PIXI.Sprite.from("sky");
        background2.width = this.screen.width;
        background2.height = background.texture.height*2;
        background2.y = -300;
        background2.scale.set(2.25);
        
        this.container.addChild(background2, background); 

        // =========================
        // OVERLAY
        // =========================
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x0b1a2a, 0.75);
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
        const titleText = new PIXI.Text("HSDash", {
            fontFamily: "Press Start 2P",
            fontSize: 42,
            fill: 0xffffff,
            dropShadow: true,
            dropShadowColor: 0x000000,
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
        // START BUTTON CONTAINER
        // =========================
        const btnContainer = new PIXI.Container();
        this.container.addChild(btnContainer);

        // Button-Grafik
        const btn = new PIXI.Graphics();
        btn.beginFill(0x1e90ff, 0.9);
        btn.drawRoundedRect(0, 0, 260, 70, 14);
        btn.endFill();

        btn.eventMode = "static";
        btn.cursor = "pointer";

        // Hover-Effekt
        btn.on("pointerover", () => {
            btn.clear();
            btn.beginFill(0x4aa3ff, 1);
            btn.drawRoundedRect(0, 0, 260, 70, 14);
            btn.endFill();
        });

        btn.on("pointerout", () => {
            btn.clear();
            btn.beginFill(0x1e90ff, 0.9);
            btn.drawRoundedRect(0, 0, 260, 70, 14);
            btn.endFill();
        });

        btnContainer.addChild(btn);

        // Button-Text
        const text = new PIXI.Text("START", {
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
}
