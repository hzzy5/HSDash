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
        //Bei Fenstergröße-Änderungen: Skalierungsfaktor aus der resize()_methode holen
        const scale = this.world.scale.x;

        const screenCenterX = this.screen.width / 2;
        const playerCenterX = player.x + player.width / 2;
        
        // Wenn Spielermitte rechts von Bildschirmmitte ist, Kamera mitbewegen
        if (playerCenterX > screenCenterX) {
            this.cameraX = playerCenterX - screenCenterX;
        }

        this.world.x = -this.cameraX * scale;
    }

    resetCamera() {
        this.cameraX = 0;
        //this.cameraY = 0;
        this.world.x = 0;
        this.world.y = 0;
    }

} //end class