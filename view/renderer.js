let app;
let playerGraphic;
let ground;
let coinGraphics = []; // NEU: Grafiken für Münzen

function initRenderer() {
    // Pixi-App erstellen
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x87ceeb, // Hellblau
        antialias: true,
        resizeTo: window
        
    });

    // Canvas in die Seite einfügen
    document.body.appendChild(app.view);

    // Grünen Boden erstellen
    ground = new PIXI.Graphics();
    ground.beginFill(0x2d5a27);
    ground.drawRect(0, app.screen.height - 100, app.screen.width, 100);
    ground.endFill();
    app.stage.addChild(ground);

    // Boden neu zeichnen bei Resize
    window.addEventListener('resize', () => {
        ground.clear();
        ground.beginFill(0x2d5a27);
        ground.drawRect(0, app.screen.height - 100, app.screen.width, 100);
        ground.endFill();
    });
} 

function createPlayerSprite(player) {
    playerGraphic = new PIXI.Graphics();
    playerGraphic.beginFill(0xff0000);
    playerGraphic.drawRect(0, 0, 20, 20);
    playerGraphic.endFill();
    app.stage.addChild(playerGraphic);
}

function renderPlayer(player) {
    playerGraphic.x = player.x;
    playerGraphic.y = player.y;
}


//  ab hier neu für coins

function createCoinSprite(coin) {
    const g = new PIXI.Graphics();
    g.lineStyle(2, 0xffd700);  // goldener Rand
    g.beginFill(0xd4af37);    // gold
    g.drawCircle(0, 0, coin.size);
    g.endFill();

    // 2. Innenkreis
    g.beginFill(0xffe066); // helleres Gold
    g.drawCircle(0, 0, coin.size * 0.75);
    g.endFill();

    g.x = coin.x;
    g.y = coin.y;

    app.stage.addChild(g);
}

function startGameLoop(player) {
    app.ticker.add(() => {
        renderPlayer(player);
    });
}

export { initRenderer, createPlayerSprite, startGameLoop, createCoinSprite };
