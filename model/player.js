function Player(x, y) {
  this.x = x;
  this.y = y;
  // Default Größe (responsive relativ zur Fensterhöhe)
  const refH = (typeof window !== 'undefined' && window.innerHeight) ? window.innerHeight : 800;
  const scale = refH / 800; // Basis-Referenzhöhe 800px
  this.height = Math.max(24, Math.round(80 * scale));
  this.width = Math.max(12, Math.round(40 * scale));

  // Default Geschwindigkeit (px/s) — skaliert mit Fenstergröße
  this.speed = Math.max(80, Math.round(220 * scale));
  // Sprint-Geschwindigkeit (px/s) — Standard: 1.8x normale Geschwindigkeit
  this.sprintSpeed = Math.round(this.speed * 1.8);
  // Vertikale Geschwindigkeit und Sprung-Parameter
  this.vy = 0; // px/s  vy= velocity
  this.onGround = false;
  this.jumpVelocity = Math.round(-480 * scale); // px/s (negativ = nach oben)
  // Dash Eigenschaften
  this.dashSpeed = Math.max(200, Math.round(800 * scale)); // px/s
  this.dashDuration = 0.12; // Sekunden
  this.dashCooldown = 0.6; // Sekunden zwischen Dashes
  this.dashTimeRemaining = 0;
  this.dashCooldownRemaining = 0;
  this.dashDir = 0; // -1 oder 1
  this.facing = 1; // zuletzt bekannte Blickrichtung
  // Ob noch ein In-Air-Dash verfügbar ist (wird beim Landen zurückgesetzt)
  this.airDashAvailable = true;

  // Hilfskoordinaten (linke/obere Ecke = x,y)
  this.x1 = this.x;
  this.y1 = this.y;
  this.x2 = this.x + this.width; // rechte Kante
  this.y2 = this.y + this.height; // untere Kante
}

// Methode auf dem Prototypen definieren
Player.prototype.move = function(dx, dy) {
  this.x += dx;
  this.y += dy;
  this.x1 = this.x;
  this.y1 = this.y;
  this.x2 = this.x + this.width;
  this.y2 = this.y + this.height;
};

export { Player };