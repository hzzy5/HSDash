import { Player } from '../model/player.js';

const keys = {};
let player;

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

export function initController(playerInstance) {
    player = playerInstance;
    requestAnimationFrame(update);
}

function update() {
    if (keys["a"]) player.move(-5, 0);
    if (keys["d"]) player.move(5, 0);
    requestAnimationFrame(update);
}



/*
Nächste Schritte:
Sobald das Grundsystem funktioniert:

Füge Kollisionen hinzu (z. B. mit Boden)

Baue einen Game-Status (leben, punkte)

Füge Animationen / Sprites hinzu

Erweitere den Controller für Sprünge usw.*/