import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@8.14.0/dist/pixi.mjs"; //mjs für Moduldateien
//weitere Importe aus den Moduldateien

let app;
let player;
let barrier;
let speed = 10;

window.onload = async function() {
    app = new PIXI.Application();

    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0.9,
        backgroundColor: 0xD3D3D3,
  });

    //Um die weißen Ränder zu entfernen
    app.canvas.style.position = 'absolute';

    //Ins DOM hinzufügen
    document.body.appendChild(app.canvas);

    //preloade Assets
    PIXI.Assets.add({
        alias: "player", //name
        src: "assets/player.png", //pfad
    });

    PIXI.Assets.add({
        alias: "barrier",
        src: "assets/barrier.png",
    });

    await PIXI.Assets.load(["player", "barrier"]);

    //Player erstellen
    player = PIXI.Sprite.from("player");
    // player.anchor.set(0.5); //Mittelpunkt im Bild
    player.x = 0 ;
    player.y = 400;
    app.stage.addChild(player);

    //Player erstellen
    barrier = PIXI.Sprite.from("barrier");
    // barrier.anchor.set(0.5);
    barrier.x = 1350;
    barrier.y = 600;
    app.stage.addChild(barrier);

    app.ticker.add(gameLoop);


    //keyboard movement mit eventlisteners
    // window.addEventListener("keydown", keyDown); //gedrückt
    // window.addEventListener("keyup", keyUp); //losgelassen

};

//Collision Detection player vs barrier 
function gameLoop(delta) {
    player.x += speed;
    barrier.x -= speed;

    if (rectsInteract(player, barrier)) {
        speed = 0;
    }
}

function rectsInteract(a, b) {
    let aBox = a.getBounds();
    let bBox = b.getBounds();

    return aBox.x-35 + aBox.width > bBox.x &&   //hier ungenau: -35, da es noch transparente Ränder gibt. 
           aBox.x-35 < bBox.x + bBox.width &&
           aBox.y + aBox.height > bBox.y &&
           aBox.y < bBox.y + bBox.height;
}




// function keyDown(e) {
//     console.log(e.keyCode); //40
// }

// function keyUp(e) {
//     console.log(e.keyCode); //38
// }





/*
//W 
if (keys["87"]) {
    player.y -=5
}

//A 
if (keys["65"]) {
    player.x -=5
}

//S 
if (keys["83"]) {
    player.y +=5
}

//D
if (keys["68"]) {
    player.x +=5
}

*/ 


// })(); //end async