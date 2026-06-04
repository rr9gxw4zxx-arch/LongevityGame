export class MapSystem {
    constructor() {
        this.engine = null;
        this.tiles = [];
        this.mapWidth = 0;
        this.mapHeight = 0;
        this.tileSize = 32;
        this.visibleTiles = [];
    }
    
    init(mapWidth, mapHeight, tileSize = 32) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tileSize = tileSize;
        this.generateMap();
    }
    
    generateMap() {
        const tilesX = Math.floor(this.mapWidth / this.tileSize);
        const tilesY = Math.floor(this.mapHeight / this.tileSize);
        
        for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
                const tile = this.generateTile(x, y);
                this.tiles.push(tile);
            }
        }
    }
    
    generateTile(x, y) {
        const worldX = x * this.tileSize;
        const worldY = y * this.tileSize;
        
        let type = 'grass';
        let color = '#2d5a27';
        
        if (worldX < 800 && worldY < 800) {
            color = '#1a3f1a';
            if (Math.random() < 0.1) type = 'rock';
        } else if (worldX >= 800 && worldX < 1600 && worldY < 800) {
            type = 'water';
            color = '#1a4f7f';
        } else if (worldX < 800 && worldY >= 800) {
            color = '#3a3a5a';
            if (Math.random() < 0.15) type = 'snow';
        } else {
            color = '#4a2a2a';
            if (Math.random() < 0.05) type = 'lava';
        }
        
        if (Math.random() < 0.02) {
            type = 'tree';
        }
        
        return {
            x: worldX,
            y: worldY,
            width: this.tileSize,
            height: this.tileSize,
            type: type,
            color: color,
            passable: type !== 'rock' && type !== 'lava'
        };
    }
    
    update(dt) {
        this.updateVisibleTiles();
    }
    
    updateVisibleTiles() {
        if (!this.engine) return;
        
        const camera = this.engine.camera;
        const screenWidth = this.engine.width / camera.zoom;
        const screenHeight = this.engine.height / camera.zoom;
        
        this.visibleTiles = this.tiles.filter(tile => 
            tile.x + tile.width >= camera.x &&
            tile.x <= camera.x + screenWidth &&
            tile.y + tile.height >= camera.y &&
            tile.y <= camera.y + screenHeight
        );
    }
    
    render(ctx) {
        this.visibleTiles.forEach(tile => {
            ctx.fillStyle = tile.color;
            ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
            
            if (tile.type === 'water') {
                ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
                ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
            } else if (tile.type === 'tree') {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(tile.x + 10, tile.y + 16, 12, 16);
                ctx.fillStyle = '#228B22';
                ctx.beginPath();
                ctx.arc(tile.x + 16, tile.y + 12, 14, 0, Math.PI * 2);
                ctx.fill();
            } else if (tile.type === 'rock') {
                ctx.fillStyle = '#666666';
                ctx.beginPath();
                ctx.ellipse(tile.x + 16, tile.y + 20, 10, 8, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    checkCollision(x, y, width, height) {
        const startTileX = Math.floor(x / this.tileSize);
        const startTileY = Math.floor(y / this.tileSize);
        const endTileX = Math.floor((x + width) / this.tileSize);
        const endTileY = Math.floor((y + height) / this.tileSize);
        
        for (let ty = startTileY; ty <= endTileY; ty++) {
            for (let tx = startTileX; tx <= endTileX; tx++) {
                const index = ty * Math.floor(this.mapWidth / this.tileSize) + tx;
                const tile = this.tiles[index];
                if (tile && !tile.passable) {
                    return true;
                }
            }
        }
        return false;
    }
    
    getTileAt(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        const index = tileY * Math.floor(this.mapWidth / this.tileSize) + tileX;
        return this.tiles[index];
    }
}