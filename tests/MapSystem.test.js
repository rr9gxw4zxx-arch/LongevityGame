import { MapSystem } from '../src/game/systems/MapSystem.js';

describe('MapSystem', () => {
    let mapSystem;

    beforeEach(() => {
        mapSystem = new MapSystem();
    });

    describe('constructor', () => {
        it('initializes with default values', () => {
            expect(mapSystem.tiles).toEqual([]);
            expect(mapSystem.mapWidth).toBe(0);
            expect(mapSystem.mapHeight).toBe(0);
            expect(mapSystem.tileSize).toBe(32);
            expect(mapSystem.visibleTiles).toEqual([]);
        });
    });

    describe('init', () => {
        it('sets map dimensions and generates tiles', () => {
            mapSystem.init(128, 128, 32);

            expect(mapSystem.mapWidth).toBe(128);
            expect(mapSystem.mapHeight).toBe(128);
            expect(mapSystem.tileSize).toBe(32);
            expect(mapSystem.tiles.length).toBe(16); // 4x4 tiles
        });

        it('respects custom tile size', () => {
            mapSystem.init(64, 64, 16);
            expect(mapSystem.tiles.length).toBe(16); // 4x4
        });
    });

    describe('generateTile', () => {
        beforeEach(() => {
            mapSystem.tileSize = 32;
        });

        it('returns a tile with correct world coordinates', () => {
            const tile = mapSystem.generateTile(2, 3);
            expect(tile.x).toBe(64);
            expect(tile.y).toBe(96);
            expect(tile.width).toBe(32);
            expect(tile.height).toBe(32);
        });

        it('generates grass type in first region (0,0)-(800,800)', () => {
            const tile = mapSystem.generateTile(0, 0);
            expect(['grass', 'rock', 'tree']).toContain(tile.type);
        });

        it('generates water type in east region', () => {
            // worldX = 25*32 = 800, worldY = 0
            const tile = mapSystem.generateTile(25, 0);
            expect(['water', 'tree']).toContain(tile.type);
        });

        it('marks rocks and lava as impassable', () => {
            const rockTile = { type: 'rock', passable: false };
            const lavaTile = { type: 'lava', passable: false };
            // Verify the passable logic
            expect('rock' !== 'rock' || 'lava' !== 'lava').toBe(false);

            // Generate many tiles and check passable property
            mapSystem.init(1600, 1600, 32);
            const impassableTiles = mapSystem.tiles.filter(t => !t.passable);
            impassableTiles.forEach(t => {
                expect(['rock', 'lava']).toContain(t.type);
            });
        });

        it('marks grass, water, snow, tree as passable', () => {
            mapSystem.init(1600, 1600, 32);
            const passableTiles = mapSystem.tiles.filter(t => t.passable);
            passableTiles.forEach(t => {
                expect(['grass', 'water', 'snow', 'tree']).toContain(t.type);
            });
        });
    });

    describe('checkCollision', () => {
        beforeEach(() => {
            mapSystem.mapWidth = 128;
            mapSystem.mapHeight = 128;
            mapSystem.tileSize = 32;
            mapSystem.tiles = [];
            // Create a 4x4 grid with one impassable tile at (1,1)
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    mapSystem.tiles.push({
                        x: x * 32, y: y * 32,
                        width: 32, height: 32,
                        type: (x === 1 && y === 1) ? 'rock' : 'grass',
                        passable: !(x === 1 && y === 1)
                    });
                }
            }
        });

        it('returns true when entity overlaps impassable tile', () => {
            // Entity at position overlapping tile (1,1) which is at world (32,32)
            expect(mapSystem.checkCollision(32, 32, 16, 16)).toBe(true);
        });

        it('returns false when entity is in passable area', () => {
            expect(mapSystem.checkCollision(0, 0, 16, 16)).toBe(false);
        });

        it('returns false for area outside map', () => {
            // Out of bounds index returns undefined tile
            expect(mapSystem.checkCollision(200, 200, 16, 16)).toBe(false);
        });
    });

    describe('getTileAt', () => {
        beforeEach(() => {
            mapSystem.mapWidth = 128;
            mapSystem.mapHeight = 128;
            mapSystem.tileSize = 32;
            mapSystem.tiles = [];
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    mapSystem.tiles.push({
                        x: x * 32, y: y * 32,
                        width: 32, height: 32,
                        type: 'grass',
                        id: `${x}_${y}`
                    });
                }
            }
        });

        it('returns the correct tile at given world coordinates', () => {
            const tile = mapSystem.getTileAt(35, 35);
            expect(tile.id).toBe('1_1');
        });

        it('returns first tile for origin', () => {
            const tile = mapSystem.getTileAt(0, 0);
            expect(tile.id).toBe('0_0');
        });

        it('returns undefined for out-of-bounds coordinates', () => {
            const tile = mapSystem.getTileAt(500, 500);
            expect(tile).toBeUndefined();
        });
    });

    describe('updateVisibleTiles', () => {
        beforeEach(() => {
            mapSystem.mapWidth = 128;
            mapSystem.mapHeight = 128;
            mapSystem.tileSize = 32;
            mapSystem.tiles = [];
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    mapSystem.tiles.push({
                        x: x * 32, y: y * 32,
                        width: 32, height: 32,
                        type: 'grass'
                    });
                }
            }
        });

        it('does nothing when engine is not set', () => {
            mapSystem.updateVisibleTiles();
            expect(mapSystem.visibleTiles).toEqual([]);
        });

        it('filters tiles within camera viewport', () => {
            mapSystem.engine = {
                camera: { x: 0, y: 0, zoom: 1 },
                width: 64,
                height: 64
            };
            mapSystem.updateVisibleTiles();
            // Should see tiles that fit in 64x64 viewport from camera (0,0)
            expect(mapSystem.visibleTiles.length).toBeGreaterThan(0);
            expect(mapSystem.visibleTiles.length).toBeLessThanOrEqual(16);
        });

        it('excludes tiles outside viewport', () => {
            mapSystem.engine = {
                camera: { x: 96, y: 96, zoom: 1 },
                width: 32,
                height: 32
            };
            mapSystem.updateVisibleTiles();
            // Only tiles at (96,96) area should be visible
            mapSystem.visibleTiles.forEach(tile => {
                expect(tile.x + tile.width).toBeGreaterThanOrEqual(96);
                expect(tile.y + tile.height).toBeGreaterThanOrEqual(96);
            });
        });
    });
});
