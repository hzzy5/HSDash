const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

function update(){
    if (keys["a"]) player.move(-5, 0);
    if (keys["d"]) player.move(5, 0);
    requestAnimationFrame(update);
}

update();



/*
Nächste Schritte:
Sobald das Grundsystem funktioniert:

Füge Kollisionen hinzu (z. B. mit Boden)

Baue einen Game-Status (leben, punkte)

Füge Animationen / Sprites hinzu

Erweitere den Controller für Sprünge usw.*/