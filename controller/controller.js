import { Player } from '../model/player.js';

const keys = {};
let player;

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});  //Wenn eine Taste gedrückt wird, wird sie im keys objekt auf true gesetzt

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});  //Wenn eine Taste losgelassen wird, wird sie im keys objekt auf false gesetzt

export function initController(playerInstance) {
    player = playerInstance;
    requestAnimationFrame(update);
} //Die initController Funktion initialisiert den Controller mit der Spielerinstanz und startet die Update-Schleife

function update() {
    if (keys["a"]) player.move(-5, 0);
    if (keys["d"]) player.move(5, 0);
    requestAnimationFrame(update);
} //überbrüft in der Update Schleife ob die Tasten a oder d gedrückt wurden und bewegt den Spieler entsprechend nach links oder rechts



/*
Nächste Schritte:
Sobald das Grundsystem funktioniert:

Füge Kollisionen hinzu (z. B. mit Boden)

Baue einen Game-Status (leben, punkte)

Sound Bibliothek einbinden und Soundeffekte hinzufügen (Sound controller)

Füge Animationen / Sprites hinzu

Erweitere den Controller für Sprünge usw.*/