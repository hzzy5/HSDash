import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

export class LevelSelectRenderer {

    constructor(uiContainer, screen, ticker) {
        // UI-Container von außen
        this.ui = uiContainer;
        this.screen = screen;
        this.ticker = ticker;

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


    showMap(levels, onSelectLevel, onBack) {
        this.container.removeChildren();
        // =========================
        // BACKGROUND
        // =========================
        const background = PIXI.Sprite.from("vorschau");
        background.width = this.screen.width;
        background.height = background.texture.height*2;
        background.y = 30;

        background.scale.set(2.25);
        this.container.addChild(background); 

        // =========================
        // OVERLAY
        // =========================
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x0b1a2a, 0.75);
        overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        overlay.endFill();
        this.container.addChild(overlay);
        

        // =========================
        // TITLE
        // =========================
        const title = new PIXI.Text("WÄHLE EIN LEVEL", {
            fontFamily: "Press Start 2P",
            fontSize: 42,
            fill: 0xffffff,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 8,
            dropShadowDistance: 4
        });

        title.anchor.set(0.5);
        title.x = window.innerWidth / 2+20;
        title.y = 200;
        this.container.addChild(title);


        // =========================
        // ZURÜCK BUTTON
        // =========================
        const back = new PIXI.Text("❰", {
            fontFamily: "Press Start 2P",
            fontWeight: 900,
            fontSize: 42,
            fill: 0xf7f7f7,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 8,
            dropShadowDistance: 4
        });

        back.anchor.set(0.5);
        back.alpha = 0.9; 
        back.x = window.innerWidth / 4;
        back.y = 191;

        back.eventMode = "static";
        back.cursor = "pointer";

        back.on("pointerover", () => {
            back.scale.set(1.1);
            back.alpha = 1;
            back.style.fill = 0xffffff;
        });

        back.on("pointerout", () => {
            back.scale.set(1);
            back.alpha = 0.9;
            back.style.fill = 0xf7f7f7;
        });


        //Beim Klick zurück zur Startseite
        back.on("pointertap", () => {
            onBack();
        });


        this.container.addChild(back);

        // =========================
        // LEVEL BUTTONS
        // =========================
        const spacing = 290;
        const startX = window.innerWidth / 2 -spacing /2;

        //Für jedes Level wird ein eigener Button erstellt
        levels.forEach((level, index) => {
            const btnContainer = new PIXI.Container();

            const btn = new PIXI.Graphics();
            btn.beginFill(level.unlocked ? 0x1e90ff : 0x85afd5, 0.9);
            btn.drawRoundedRect(0, 0, 160, 160, 30);
            btn.endFill();

            //Schatten
            const shadow = new PIXI.Graphics();
            shadow.beginFill(0x000000, 0.2);
            shadow.drawRoundedRect(5, 5, 160, 160, 30); //um 5px leicht versetzter Schatten
            shadow.endFill();

            btn.addChild(shadow);

            // btn.eventMode = level.unlocked ? "static" : "none";
            btn.eventMode = "static";
            btn.cursor = "pointer";

            

            // Level Nummer
            const number = new PIXI.Text(`${index + 1}`, {
                fontFamily: "Press Start 2P",
                fontSize: 64,
                fill: 0xffffff
            });
            
            number.anchor.set(0.5);
            number.alpha = level.unlocked ? "1" : "0.7";
            number.x = 80;
            number.y = 80;
            btn.addChild(number);
            

            // Schloss wenn das Level noch locked ist
            if (!level.unlocked) {
                const lock = PIXI.Sprite.from("lockMap");
                lock.anchor.set(0.5);
                lock.scale.set(0.4);
                lock.x = 80;
                lock.y = 80;
                lock.alpha = 0.75;
                btn.addChild(lock);
            }

            btnContainer.addChild(btn);

            btnContainer.x = startX + index * spacing -80; //-80, damit es mittig ist
            btnContainer.y = window.innerHeight / 2 - 80;

            this.container.addChild(btnContainer);
            
            // Hover + Klick
            if (level.unlocked) {
                btn.on("pointerover", () => {
                    btn.clear();
                    btn.beginFill(0x4aa3ff, 1);
                    btn.drawRoundedRect(0, 0, 160, 160, 30);
                    btn.endFill();
                    btnContainer.scale.set(1.25);
                    btnContainer.x -=20; 
                    btnContainer.y -=20; 
                });

                btn.on("pointerout", () => {
                    btn.clear();
                    btn.beginFill(0x1e90ff, 0.9);
                    btn.drawRoundedRect(0, 0, 160, 160, 30);
                    btn.endFill();
                    btnContainer.scale.set(1);
                    btnContainer.x = startX + index * spacing -80;
                    btnContainer.y = window.innerHeight / 2 - 80;
                });

                btn.on("pointertap", () => {
                    onSelectLevel(index);
                });

            } else {
                // Wenn Level gesperrt ist
                btn.interactive = true;
                btn.buttonMode = true;
                btn.on("pointertap", () => {
                    this.showLockedText(btnContainer.x-90, btnContainer.y-15);// kurze Meldung
                });
            }

            // // =========================
            // // PATH
            // // =========================
            // const path = new PIXI.Graphics();
            // path
            //     .moveTo(startX + 1 * spacing - 80, 80)
            //     .lineTo(startX + 2 * spacing - 80, 80)
            //     .stroke({ width: 6, color: 0xffffff, alpha: 1 });
                
            //     this.container.addChild(path);
        });
    }


    //Methode um kurze Meldung anzuzeigen, dass das Level locked ist
    showLockedText(x, y) {
        const t = new PIXI.Text("Noch nicht freigeschaltet!", {
            fill: 0xc9e3fa,
            fontSize: 14,
            fontWeight: "bold",
            fontFamily: "Press Start 2P"
        });

        t.x = x;
        t.y = y;
        t.zIndex = 1000;
        this.container.addChild(t);

        let life = 100; // ca. 50 Frames

        const update = () => {
            t.y -= 0.4;        // nach oben fliegen
            t.alpha -= 0.01; // langsam ausblenden
            life--;

            if (life <= 0) {
                this.ticker.remove(update);    // aus dem Ticker entfernen
                this.container.removeChild(t);
                t.destroy();
            }
        };

        this.ticker.add(update);
    }
    
}
