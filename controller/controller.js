// Einfache Input-Verfolgung und zentralisierte Update-Funktion
const keys = {}; // Alle eingaben
let player = null;
let jumpRequested = false;
let dashRequested = false;
// Collider-Liste (vierecke mit x,y,width,height)
let colliders = []; //Für kollisionen

// Weil man mit shift sprintet werden Eingaben nicht auf Großschreibung überprüft
document.addEventListener("keydown", (e) => { //Immer wenn eine Taste gedrückt wurde
  const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
  keys[k] = true;
  // Wenn 'w' gedrückt wird: dash in der Luft; auf dem Boden macht 'w' nichts
  if (k === 'w') {
    if (player && !player.onGround) dashRequested = true; //Man kann nur dashen wenn es einen player gibt und dieser nicht auf dem boden ist
  }
  // Leertaste immer als jump request auch wenn sprung gerade nicht möglich ist
  if (k === ' ') {
    if(player && player.onGround) jumpRequested = true; // Man kann nur springen wenn es einen player gibt und dieser auf dem boden ist
  } //-> funktioniert noch nicht leider (Spieler kann auch in der Luft springen)
});

document.addEventListener("keyup", (e) => { //Wenn taste nicht mehr gedrückt dann muss das im array auch wieder zurückgesetzt werden
  const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
  keys[k] = false;
});

// Initialisiert den Controller mit der Spielerinstanz
export function initController(playerInstance) {
  player = playerInstance;
  // Default Ground-Collider (entspricht Renderer ground) -> Später wieder wegmachen wenn wir keinen ground mehr machen
  colliders = [
    { x: 0, y: window.innerHeight - 100, width: window.innerWidth, height: 100 }
  ];
  // Bei Resize Ground anpassen
  window.addEventListener('resize', () => {
    colliders[0] = { x: 0, y: window.innerHeight - 100, width: window.innerWidth, height: 100 };
  });
}

export function addCollider(c) { //Für Kollisionserkennung zum hinzufügen von möglichen Kollsionsblöcken
  colliders.push(c);
  return c;
}

export function getColliders() { //Getter für Kollisionsblöcke -> Zum debuggen und spätere änderungen der Kollisionsboxen
  return colliders;
}

// Wird vom Renderer-Ticker mit dt (Sekunden) aufgerufen
export function updatePlayer(dt) {

  if (!player) return null; // Kein Spieler zum updaten

  let dir = 0; //Richtung: -1 = links, 1 = rechts, 0 = keine Bewegung -> wird nach jedem frame neu berechnet
  if (keys['a']) dir -= 1; // -= weil es nach jedem frame neu berechnet wird und so es möglich ist dass beide tasten gedrückt werden
  if (keys['d']) dir += 1; //bei += genauso ( 0 += 1 = 1 -= 1 = 0)

  const sprintHeld = keys['shift']; // Sprint-taste gedrückt?
  const currentSpeed = sprintHeld ? player.sprintSpeed : player.speed; //entweder normale geschwindigkeit oder sprint geschwindigkeit

  // Updated facing variable für den dash damit dash nicht 0 sein kann (sonst dash in die richtung in die man vorher sich bewegt hat)
  if (dir !== 0) player.facing = dir;

  // Update dash timer
  if (player.dashTimeRemaining > 0) player.dashTimeRemaining = Math.max(0, player.dashTimeRemaining - dt);
  // Wenn es eine dashTime gibt wird sie immer -dt(Sekunden) runtergezählt
  // Math.max(0,wert) damit es nicht negativ wird
  if (player.dashCooldownRemaining > 0) player.dashCooldownRemaining = Math.max(0, player.dashCooldownRemaining - dt);
  // Das selbe für dashCooldown

  // Wenn Dash angefordert wurde und wir in der Luft sind, starte den Dash (sofern verfügbar)
  if (dashRequested) {
    if (!player.onGround && player.dashCooldownRemaining <= 0 && player.dashTimeRemaining <= 0) {
      player.dashTimeRemaining = player.dashDuration;
      player.dashCooldownRemaining = player.dashCooldown;
      player.dashDir = player.facing; // Dash in die Richtung in die der Spieler zuletzt geschaut hat
    }
    dashRequested = false;
  }

  // Wenn gerade gedasht wird, verwende Dash-Geschwindigkeit
  let dx; // horizontale veränderung
  if (player.dashTimeRemaining > 0) {
    dx = player.dashDir * player.dashSpeed * dt;
  } else {
    // Finale horizontale veränderung berechnen
    dx = dir * currentSpeed * dt;
  }

  // Horizontal bewegen
  player.move(dx, 0);


  // KOLLISIONEN 
  // Guckt erst ob keine Kollision vorliegt und negiert das Ergebnis dann
  const aabb = (a, b) => !(a.x + a.width <= b.x || a.x >= b.x + b.width || a.y + a.height <= b.y || a.y >= b.y + b.height);

  // Kollisionen nach horizontaler Bewegung lösen
  if (dx !== 0) {
    for (const c of colliders) { // jeden collider durchgehen
      if (aabb(player, c)) { //Kollision?
        // einfache Auflösung: je nach Bewegungsrichtung an die Kante setzen
        if (dx > 0) { // bewegt sich nach rechts
          player.x = c.x - player.width; // Position wird einfach an kante gesetzt
        } else if (dx < 0) { // bewegt sich nach links
          player.x = c.x + c.width; // Position wird einfach an kante gesetzt
        }
        // Dash abbrechen bei Kollision
        player.dashTimeRemaining = 0;
        // Hilfe Koordinaten syncen
        player.x1 = player.x;
        player.x2 = player.x + player.width;
      }
    }
  }

  // VERTIKALE BEWEGUNG

  // SPRINGEN: wenn eine Sprunganforderung vorliegt und wir auf dem Boden sind
  if (jumpRequested && player.onGround) {
    player.vertical = player.jumpVelocity; // vertical auf Sprunggeschwindigkeit setzen
    player.onGround = false;
  }
  // Springanforderung wurde verarbeitet (einmaliges Trigger)
  jumpRequested = false;

  // GRAVITY + VERTICAL
  const GRAVITY = 1200; // px/s^2 
  player.vertical += GRAVITY * dt; // wird bei jedem frame auf die vertikale geschwindigkeit draufgerechnet
  // dadurch wird bei einem sprung die vertical immer weniger negativ (langsamer nach oben) bis sie 0 ist und dann wieder positiv wird (fallen)

  // Vertikal bewegen
  player.move(0, player.vertical * dt);

  // Kollisionen nach vertikaler Bewegung lösen
  if (player.vertical !== 0) { //eiegentlich fast immer nicht 0 wegen gravity
    for (const c of colliders) { // jeden collider durchgehen
      if (aabb(player, c)) { //Kollision?
        // einfache Auflösung: je nach Bewegungsrichtung an die Kante setzen
        if (player.vertical > 0) {
          // landet auf Collider
          player.y = c.y - player.height;
          player.vertical = 0;
          player.onGround = true;
        } else if (player.vertical < 0) {
          // trifft Decke
          player.y = c.y + c.height;
          player.vertical = 0;
        }
        // Hilfe Koordinaten syncen
        player.y1 = player.y;
        player.y2 = player.y + player.height;
      }
    }
  }

  return player;
}
