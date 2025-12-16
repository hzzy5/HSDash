// let app;
// let playerGraphic;
// let ground;
// let platformGraphics = []; // Array für alle Plattform-Grafiken
// let cameraX = 0; // Kamera-Offset für horizontales Scrolling

export class CameraRenderer {

    constructor (container, screen) {
        //Referenz auf den Container und Screen, der in der PIXI.app liegt. Hier wird NUR der world-Container bewegt
        this.world = container;
        this.screen = screen;

        this.cameraX = 0;
    }

    // Aktualisiert die Kamera basierend auf der Spielerposition
    updateCamera(player) {
        const screenCenterX = this.screen.width / 2;
        const playerCenterX = player.x + player.width / 2;
        
        // Wenn Spielermitte rechts von Bildschirmmitte ist, Kamera mitbewegen
        if (playerCenterX > screenCenterX) {
            this.cameraX = playerCenterX - screenCenterX;
        }
        this.world.x = -this.cameraX;
    }
    
    // // Aktualisiert die Platform-Positionen nach Kamera-bewegung
    // updatePlatformPositions(platformManager) {
    //     const platforms = platformManager.getAllPlatforms();
    //     platformGraphics.forEach((gfx, index) => {
    //         const platform = platforms[index];
    //         gfx.x = platform.x - cameraX; //Für jede platform wird der kamera offset aufgerechnet
    //     });
    // }

    // // Aktualisiert die Boden-Position nach Kamera-bewegung 
    // updateGroundPosition() {
    //     ground.x = -cameraX; // Boden wird mit Kamera mitbewegt
    // }

    // renderPlayer(player) {
    //     // Spielerposition aktualisieren (mit Kamera-bewegung)
    //     playerGraphic.x = player.x - cameraX;
    //     playerGraphic.y = player.y;
    // }




} //end class




