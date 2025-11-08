import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien
//weitere Importe aus den Moduldateien


(async() => {                             
    // Canvas initialisieren                   
    const app = new PIXI.Application();     
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight, 
        // resizeTo: window,
        backgroundAlpha: 0.7,
        backgroundColor: 0x6495ED,
    });

    //Um die weißen Ränder zu entfernen
    app.canvas.style.position = 'absolute';

    //Ins DOM hinzufügen
    document.body.appendChild(app.canvas);

    
    //Player  
    const player = new PIXI.Sprite.from;
    const rectangle = new PIXI.Graphics();




    /*-------------------------------------------------------------------------------
        Klasse Text erlaubt uns Text zu schreiben.*/
    const style = new PIXI.TextStyle({
        fill: 0x0000,
        fontSize: 24
    });
    const message = new PIXI.Text({ text: "hi!", style }); //Style definieren und an ganze Text-Blöcke übergeben, um Code-Duplikation zu vermeiden.
    message.x = 100;
    message.y = 100;
    app.stage.addChild(message);

    const text = new PIXI.Text({
        text: 'Hello Pixi',
        style: {
            // `fill` is the same as the `color` property in CSS.
            fill: '#ffffff',
            fontFamily: 'Montserrat Medium', //oder das was installiert ist
            fontSize: 72,
            fontStyle: 'italic',
            fontWeight: 'bold',
            stroke: { color: '#4a1850', width: 5 },
            dropShadow: {
                color: '#4a1850',
                blur: 4,
                angle: Math.PI / 6,
                distance: 6,
            },
            wordWrap: true,
            wordWrapWidth: 440
        }
    }); 
    text.x = 1000;
    text.y = 200;

    app.stage.addChild(text);


})(); //end async