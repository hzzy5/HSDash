function Player(name, x, y) {
  this.name = name;
  this.x = x;
  this.y = y;
}

// Methode auf dem Prototypen definieren
Player.prototype.move = function(dx, dy) {
  this.x += dx;
  this.y += dy;
};

Player.prototype.sayHello = function() {
  console.log(`Hi, ich bin ${this.name}!`);
};

// Instanz erzeugen
const p = new Player("Lasse", 10, 20);
p.move(5, -3);
p.sayHello();