import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs";

const BTNWIDTH = 350;
const BTNHEIGHT = 70;
const TOOGLEWIDTH = 220;
const TOOGLEHEIGHT = 40;
const RADIUS = TOOGLEHEIGHT / 2 - 5;

export class PauseScreen {

    constructor(uiContainer, screen) {
        this.ui = uiContainer;
        this.screen = screen;

        // eigener Startscreen-Container
        this.container = new PIXI.Container();
        this.ui.addChild(this.container);

        // immer ganz oben zeichnen
        this.ui.setChildIndex(this.container, this.ui.children.length - 1);

        // initial unsichtbar
        this.container.visible = false;

        //ToogleButton
        this.isOn = false; 
    }

    show() {
        this.container.visible = true;
        this.updateToggle();
    }

    hide() {
        this.container.visible = false;
    }


    //Methode, um den Pause-Screen anzuzeigen 
    createScreen(weiter, start, musikAnAus) {
        this.container.removeChildren();

        // =========================
        // OVERLAY
        // =========================
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.55);
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
        const titleText = new PIXI.Text("PAUSE", {
            fontFamily: "Press Start 2P",
            fontSize: 42,
            fill: 0xffffff,
            dropShadow: true,
            dropShadowColor: 0x89c6fe,
            dropShadowBlur: 8,
            dropShadowDistance: 4
        });

        titleText.anchor.set(0.5);
        titleText.x = 230;
        titleText.y = 50;
        titleContainer.addChild(titleText);

        // Titel-Position
        titleContainer.x = window.innerWidth / 2 - 230;
        titleContainer.y = window.innerHeight / 3 - 140;


        // =========================
        // CONTINUE BUTTON
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
        const text = new PIXI.Text("WEITER", {
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
            weiter();
        });


        // =========================
        // START MENU BUTTON 
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
        const text2 = new PIXI.Text("ZUM START", {
            fontFamily: "Press Start 2P",
            fontSize: 20,
            fill: 0xffffff
        });

        text2.anchor.set(0.5);
        text2.x = BTNWIDTH/2; // Hälfte von 400
        text2.y = 100 + BTNHEIGHT/2;  // Hälfte von 70
        btn2.addChild(text2);
        console.log(btn2.x);

         //Click-Event
        btn2.on("pointertap", () => {
            start();
        });

        // =========================
        // SOUND TOOGLE BUTTON
        // =========================

        //Neuer Container für Kreis und Zustände. Müssen je nach Zustand geupdatet werden.
        this.toogleContainer = new PIXI.Container();
        btnContainer.addChild(this.toogleContainer);
        
        //Button reagiert auf Events
        this.toogleContainer.eventMode = "static";
        this.toogleContainer.cursor = "pointer"; //Mauszeiger
        
        //Text
        const toggletext = new PIXI.Text("MUSIK", {
            fontFamily: "Press Start 2P",
            fontSize: 20,
            fill: 0xffffff
        });

        toggletext.anchor.set(0, 0.5); //linksbündig
        toggletext.x = 0; 
        toggletext.y = 200 + TOOGLEHEIGHT/2;  // Hälfte von 70
        this.toogleContainer.addChild(toggletext);

        // Button-Grafik
        const toggleBtn = new PIXI.Graphics();
        toggleBtn.beginFill(0x333333, 0.9);
        toggleBtn.drawRoundedRect(BTNWIDTH-TOOGLEWIDTH, 200, TOOGLEWIDTH, TOOGLEHEIGHT, 24);
        toggleBtn.endFill();

        //Button reagiert auf Events
        toggleBtn.eventMode = "static";
        toggleBtn.cursor = "pointer"; //Mauszeiger

        // Hover-Effekt
        toggleBtn.on("pointerover", () => {
            toggleBtn.clear();
            toggleBtn.beginFill(0x999999, 0.9);
            toggleBtn.drawRoundedRect(BTNWIDTH-TOOGLEWIDTH, 200, TOOGLEWIDTH, TOOGLEHEIGHT, 24);
            toggleBtn.endFill();
        });

        toggleBtn.on("pointerout", () => {
            toggleBtn.clear();
            toggleBtn.beginFill(0x333333, 0.9);
            toggleBtn.drawRoundedRect(BTNWIDTH-TOOGLEWIDTH, 200, TOOGLEWIDTH, TOOGLEHEIGHT, 24);
            toggleBtn.endFill();
        });

        this.toogleContainer.addChild(toggleBtn);

        //Knopf
        this.knob = new PIXI.Graphics();
        this.knob.clear();
        this.knob.beginFill(0xffffff);
        this.knob.drawRoundedRect(0, 0, 50, TOOGLEHEIGHT-10, 20);
        this.knob.endFill();

        //Position 
         this.knob.x = this.isOn
            ? TOOGLEWIDTH + 73 // rechts
            : BTNWIDTH-TOOGLEWIDTH +7; //links

        this.knob.y = 205;
        this.toogleContainer.addChild(this.knob);


        //Button-Text
        this.on = new PIXI.Text("AN", {
            fontFamily: "Press Start 2P",
            fontSize: 20,
            fill: 0xffffff
        });

        this.on.anchor.set(0.5);
        this.on.x = TOOGLEWIDTH - 55 ;
        this.on.y = 200 + 40/2;  // Hälfte von 70

        this.off = new PIXI.Text("AUS", {
            fontFamily: "Press Start 2P",
            fontSize: 20,
            fill: 0xffffff
        });

        this.off.anchor.set(0.5);
        this.off.x =  TOOGLEWIDTH + 85;
        this.off.y = 200 + TOOGLEHEIGHT / 2;  

        this.toogleContainer.addChild(this.on, this.off);

        // Click-Event
        this.toogleContainer.on("pointertap", () => {
            this.toggle();
            musikAnAus();
        });


        //=====================================================

        // Button-Position
        btnContainer.x = window.innerWidth / 2 - BTNWIDTH/2;
        btnContainer.y = window.innerHeight / 3.5 + BTNHEIGHT/2;
    }

    //Methode wird bei jedem Klick aufgerufen, sodass die States wechseln (ON --> OFF --> ON -->...)
    //Wenn toogle true: Musik läuft, OFF Anzeigen, Kreis links.
    //Wenn toogle false: Musik aus, ON Anzeigen, Kreis rechts.
    toggle() {
        this.isOn = !this.isOn;
        this.updateToggle();
        console.log("toogletoogletoogel");
        //this.onToggle(this.isOn);
    }

    //Methode, um den ToggleButton upzudaten
    updateToggle() {
        console.log("toogle update");

        //Knopf x-Position
        this.knob.x = this.isOn
            ? TOOGLEWIDTH + 73 // rechts
            : BTNWIDTH-TOOGLEWIDTH +7; //links
        
        //Sichtbarkeit der ON <-> OFF Zustände 
        this.on.visible = this.isOn
            ? true 
            : false; 

        this.off.visible = this.isOn
            ? false
            : true; 
        
    }

} //end class
