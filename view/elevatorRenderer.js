/*Spezifische View-Klasse, die für die Darstellung des Fahrstuhls zuständig ist.*/
import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; 


export class ElevatorRenderer {
    constructor(container) {
        //Refrenz auf den Conatainer und Ticker, der in der PIXI.app liegt.
        this.world = container;
        //this.ticker = ticker;
        this.elevator = null;
        this.framesForward // Original-Frames
        this.framesBackward // Reverse-Frames
    }

    //Methode, um das DBBro-Sprite zu erstellen
    createElevatorSprite(x, y) {
    const sheet = PIXI.Assets.get("zielFahrstuhl").data.animations["frame"]; // Array von Frame-Namen

    //String in pixi Textures konventieren
    this.framesForward = sheet.map(name => PIXI.Texture.from(name));
    this.framesBackward = [...this.framesForward].reverse();

    this.elevator = new PIXI.AnimatedSprite(this.framesForward);
    this.elevator.anchor.set(0.4 , 0);
    this.elevator.scale.set(1.6);
    this.elevator.zIndex = 0;
    this.elevator.x = x;
    this.elevator.y = y;

    this.world.addChild(this.elevator);
    return this.elevator;
    }

    //Methode, um die Animation vorwärts abzuspielen
    open(elevator) {
        elevator.sprite.textures = this.framesForward;
        elevator.sprite.loop = false;
        elevator.sprite.animationSpeed = 1/6;
        elevator.sprite.gotoAndPlay(0);        
    }

    //Methode, um die Animation abzuspielen
    close(elevator) { 
        elevator.sprite.textures = this.framesBackward;
        elevator.sprite.loop = false;
        elevator.sprite.animationSpeed = 1/6;
        elevator.sprite.gotoAndPlay(0);            
    }

    //Methode, die eine Sprechblase zeichnet, die dem Spieler verrät, in den Fahstuhl einzusteigen
    createElevatorHint(player) {
        // Container für Text + Bubble
        const container = new PIXI.Container();
        
        //Hintergrund + Kleines Dreieck für Sprechblase
        const bubble = new PIXI.Graphics();
        bubble.lineStyle(4, 0x000000, 1);
        bubble.beginFill(0xffffff);
        
        bubble.drawRoundedRect(0, 0, 180, 45, 1);
        
        bubble.moveTo(120, 45);
        bubble.lineTo(150, 45);
        bubble.lineTo(135, 65);
        bubble.closePath();
        
        bubble.endFill();
        
        //Text
        const text = new PIXI.Text("Drücke 'E' zum \n Einsteigen", {
            fontFamily: "Press Start 2P",
            fontSize: 10,
            fill: 0x000000,
            lineHeight: 20,
        });
        
        // Text mittig in der Bubble platzieren
        text.x = bubble.width / 2- text.width / 2;
        text.y = 24 - text.height / 2;
        
        // Alles in Container packen
        container.addChild(bubble);
        container.addChild(text);
        
        // Container über dem Spieler positionieren
        container.x = player.x - bubble.width / 2 + player.width / 2;
        container.y = player.y - bubble.height - 10; // 10px Abstand über Spieler
        
        //nur anzeigen, wenn Spieler in der Nähe eines Elevators
        container.visible = true;
        container.zIndex = 1;
        // Zum Stage hinzufügen
        this.world.addChild(container);
        
        return container;
    } 

}