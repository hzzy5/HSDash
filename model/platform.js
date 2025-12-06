class Platform {
    constructor(x, y, width, height, color = 0x8b4513) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

// PlatformManager verwaltet alle Plattformen im Spiel
class PlatformManager {
    constructor() {
        this.platforms = []; // Array mit allen Plattformen
    }

    // Neue Plattform hinzufügen
    addPlatform(x, y, width, height, color = 0x8b4513) {
        const platform = new Platform(x, y, width, height, color);
        this.platforms.push(platform);
        return platform;
    }

    // Alle Plattformen als Collider zurückgeben
    getColliders() {
        return this.platforms.map(p => ({
            x: p.x,
            y: p.y,
            width: p.width,
            height: p.height
        }));
    }

    // Alle Plattformen zurückgeben
    getAllPlatforms() {
        return this.platforms;
    }

    // Alle Plattformen löschen
    clearPlatforms() {
        this.platforms = [];
    }
}

export { Platform, PlatformManager };