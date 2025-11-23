class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Default Größe
    this.width = 40;
    this.height = 80;

    // Default Geschwindigkeit (px/s) — kann vom Controller verwendet werden
    this.speed = 220;
    // Sprint-Geschwindigkeit (px/s) — Standard: 1.8x normale Geschwindigkeit
    this.sprintSpeed = Math.round(this.speed * 1.8);
    // Vertikale Geschwindigkeit und Sprung-Parameter
    this.vy = 0; // px/s  vy= velocity
    this.onGround = false;
    this.jumpVelocity = -480; // px/s (negativ = nach oben)

    // Dash Eigenschaften
    this.dashSpeed = 800; // px/s
    this.dashDuration = 0.12; // Sekunden
    this.dashCooldown = 0.6; // Sekunden zwischen Dashes
    this.dashTimeRemaining = 0;
    this.dashCooldownRemaining = 0;
    this.dashDir = 0; // -1 oder 1 (links oder rechts)
    this.facing = 1; // zuletzt bekannte Blickrichtung

    // Hilfskoordinaten (linke/obere Ecke = x,y)
    this.x1 = this.x;
    this.y1 = this.y;
    this.x2 = this.x + this.width; // rechte Kante
    this.y2 = this.y + this.height; // untere Kante
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.x1 = this.x;
    this.y1 = this.y;
    this.x2 = this.x + this.width;
    this.y2 = this.y + this.height;
  }
}

export { Player };