// Einfache Input-Verfolgung und zentralisierte Update-Funktion
const keys = {};
let player = null;
let jumpRequested = false;
let dashRequested = false;
// Collider-Liste (Rects mit x,y,width,height)
let colliders = [];

// Normalize key names to lower-case to avoid issues when Shift is held ("A" vs "a")
document.addEventListener("keydown", (e) => {
  const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
  keys[k] = true;
  // Wenn 'w' gedrückt wird: dash in der Luft; auf dem Boden macht 'w' nichts
  if (k === 'w') {
    if (player && !player.onGround) dashRequested = true;
  }
  // Space oder ArrowUp immer als Sprung-Request
  if (k === ' ' || k === 'arrowup') jumpRequested = true;
});

document.addEventListener("keyup", (e) => {
  const k = (typeof e.key === 'string') ? e.key.toLowerCase() : e.key;
  keys[k] = false;
});

// Initialisiert den Controller mit der Spielerinstanz (keine eigene Loop mehr)
export function initController(playerInstance) {
  player = playerInstance;
  // Default Ground-Collider (entspricht Renderer ground)
  const computeGround = () => {
    const gh = Math.max(32, Math.round(window.innerHeight * 0.12));
    return { x: 0, y: window.innerHeight - gh, width: window.innerWidth, height: gh };
  };
  colliders = [ computeGround() ];
  // Bei Resize Ground anpassen
  window.addEventListener('resize', () => {
    colliders[0] = computeGround();
  });
}

export function addCollider(c) {
  colliders.push(c);
  return c;
}

export function getColliders() {
  return colliders;
}

// Wird vom Renderer-Ticker mit dt (Sekunden) aufgerufen
export function updatePlayer(dt) {
  if (!player) return null;

  // Verwende player.speed wenn vorhanden, sonst Fallback 220 px/s
  let dir = 0;
  // keys stored lower-cased; arrow keys become 'arrowleft' / 'arrowright'
  if (keys['a'] || keys['arrowleft']) dir -= 1;
  if (keys['d'] || keys['arrowright']) dir += 1;
  // Sprint (Shift) erkennen
  // Shift normalized is 'shift'
  const sprintHeld = !!keys['shift'];

  // Bestimme effektive Geschwindigkeit
  const baseSpeed = (player.speed !== undefined) ? player.speed : 220;
  const sprintSpeed = (player.sprintSpeed !== undefined) ? player.sprintSpeed : Math.round(baseSpeed * 1.8);
  const currentSpeed = sprintHeld ? sprintSpeed : baseSpeed;

  // Update facing
  if (dir !== 0) player.facing = dir;

  // Update dash timers
  if (player.dashTimeRemaining > 0) player.dashTimeRemaining = Math.max(0, player.dashTimeRemaining - dt);
  if (player.dashCooldownRemaining > 0) player.dashCooldownRemaining = Math.max(0, player.dashCooldownRemaining - dt);

  // Wenn Dash angefordert wurde und wir in der Luft sind, starte den Dash (sofern verfügbar)
  if (dashRequested) {
    if (!player.onGround && player.dashCooldownRemaining <= 0 && player.dashTimeRemaining <= 0) {
      player.dashTimeRemaining = (player.dashDuration !== undefined) ? player.dashDuration : 0.12;
      player.dashCooldownRemaining = (player.dashCooldown !== undefined) ? player.dashCooldown : 0.6;
      player.dashDir = (dir !== 0) ? dir : player.facing || 1;
    }
    dashRequested = false;
  }

  // Bestimme horizontale Bewegung: wenn gerade gedasht wird, verwende Dash-Geschwindigkeit
  let dx;
  if (player.dashTimeRemaining > 0) {
    const dashSpeed = (player.dashSpeed !== undefined) ? player.dashSpeed : 800;
    dx = player.dashDir * dashSpeed * dt;
  } else {
    // Normale Bewegung
    dx = dir * currentSpeed * dt;
  }

  // Horizontal bewegen
  player.move(dx, 0);
  // Kollisionen nach horizontaler Bewegung lösen
  const aabb = (a, b) => !(a.x + a.width <= b.x || a.x >= b.x + b.width || a.y + a.height <= b.y || a.y >= b.y + b.height);
  if (dx !== 0) {
    for (const c of colliders) {
      if (aabb(player, c)) {
        // einfache Auflösung: je nach Bewegungsrichtung an die Kante setzen
        if (dx > 0) {
          player.x = c.x - player.width;
        } else if (dx < 0) {
          player.x = c.x + c.width;
        }
        // Falls wir gerade dashen, abbrechen
        player.dashTimeRemaining = 0;
        // sync helper coords
        player.x1 = player.x;
        player.x2 = player.x + player.width;
      }
    }
  }

  // SPRINGEN: wenn eine Sprunganforderung vorliegt und wir auf dem Boden sind
  if (jumpRequested && player.onGround) {
    player.vy = (player.jumpVelocity !== undefined) ? player.jumpVelocity : -480;
    player.onGround = false;
  }
  // Springanforderung wurde verarbeitet (einmaliges Trigger)
  jumpRequested = false;

  // GRAVITY + VERTICAL
  const GRAVITY = 1200; // px/s^2
  player.vy += GRAVITY * dt;
  player.move(0, player.vy * dt);

  // Kollisionen nach vertikaler Bewegung lösen
  if (player.vy !== 0) {
    for (const c of colliders) {
      if (aabb(player, c)) {
        if (player.vy > 0) {
          // landet auf Collider
          player.y = c.y - player.height;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0) {
          // trifft Decke
          player.y = c.y + c.height;
          player.vy = 0;
        }
        // sync helper coords
        player.y1 = player.y;
        player.y2 = player.y + player.height;
      }
    }
  }

  return player;
}
