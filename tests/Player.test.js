import { Player } from '../src/game/entities/Player.js';

// Mock the imported components since they depend on browser APIs
jest.mock('../src/engine/components/SpriteRenderer.js', () => ({
    SpriteRenderer: class {
        constructor() {
            this.name = 'SpriteRenderer';
            this.entity = null;
        }
        init() {}
        update() {}
        render() {}
        destroy() {}
    }
}));

jest.mock('../src/engine/components/PlayerController.js', () => ({
    PlayerController: class {
        constructor() {
            this.name = 'PlayerController';
            this.entity = null;
        }
        init() {}
        update() {}
        destroy() {}
    }
}));

describe('Player', () => {
    let player;

    beforeEach(() => {
        player = new Player(100, 200);
    });

    describe('constructor', () => {
        it('initializes with position and fixed dimensions', () => {
            expect(player.x).toBe(100);
            expect(player.y).toBe(200);
            expect(player.width).toBe(48);
            expect(player.height).toBe(64);
        });

        it('initializes character stats', () => {
            expect(player.name).toBe('李长寿');
            expect(player.title).toBe('太白金星');
            expect(player.level).toBe(1);
            expect(player.realm).toBe(1);
            expect(player.hp).toBe(100);
            expect(player.maxHp).toBe(100);
            expect(player.attack).toBe(10);
            expect(player.defense).toBe(5);
            expect(player.exp).toBe(0);
            expect(player.gold).toBe(0);
        });

        it('starts with empty skills', () => {
            expect(player.skills).toEqual({});
        });

        it('adds components', () => {
            expect(player.hasComponent('SpriteRenderer')).toBe(true);
            expect(player.hasComponent('PlayerController')).toBe(true);
        });
    });

    describe('addSkill', () => {
        it('adds a skill by id', () => {
            const skill = { id: 'taiji', name: '太极图', damage: 50 };
            player.addSkill(skill);
            expect(player.skills['taiji']).toBe(skill);
        });

        it('can add multiple skills', () => {
            player.addSkill({ id: 'a', name: 'A' });
            player.addSkill({ id: 'b', name: 'B' });
            expect(Object.keys(player.skills).length).toBe(2);
        });
    });

    describe('takeDamage', () => {
        it('reduces HP by given amount', () => {
            player.takeDamage(30);
            expect(player.hp).toBe(70);
        });

        it('sets HP to 0 and triggers death when lethal', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            player.takeDamage(150);
            expect(player.hp).toBe(0);
            consoleSpy.mockRestore();
        });

        it('triggers onDeath at exactly 0 HP', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            player.takeDamage(100);
            expect(player.hp).toBe(0);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('heal', () => {
        it('increases HP', () => {
            player.hp = 50;
            player.heal(30);
            expect(player.hp).toBe(80);
        });

        it('does not exceed maxHp', () => {
            player.hp = 90;
            player.heal(50);
            expect(player.hp).toBe(100);
        });

        it('heals to full from 0', () => {
            player.hp = 0;
            player.heal(999);
            expect(player.hp).toBe(100);
        });
    });

    describe('clampPosition', () => {
        it('clamps position within map bounds', () => {
            player.engine = {
                systems: [{ constructor: { name: 'MapSystem' }, mapWidth: 500, mapHeight: 500 }]
            };
            player.x = -10;
            player.y = -20;
            player.clampPosition();
            expect(player.x).toBe(0);
            expect(player.y).toBe(0);
        });

        it('clamps to max bounds', () => {
            player.engine = {
                systems: [{ constructor: { name: 'MapSystem' }, mapWidth: 500, mapHeight: 500 }]
            };
            player.x = 600;
            player.y = 700;
            player.clampPosition();
            expect(player.x).toBe(452); // 500 - 48
            expect(player.y).toBe(436); // 500 - 64
        });

        it('does nothing without engine', () => {
            player.x = -100;
            player.engine = null;
            player.update(0.016);
            // Should not crash, position may have moved due to velocity but clamp not applied
        });

        it('does nothing without MapSystem', () => {
            player.engine = { systems: [] };
            player.x = -100;
            player.clampPosition();
            expect(player.x).toBe(-100); // unchanged
        });
    });

    describe('inherited Entity methods', () => {
        it('getCenterX works with player dimensions', () => {
            expect(player.getCenterX()).toBe(124); // 100 + 48/2
        });

        it('getCenterY works with player dimensions', () => {
            expect(player.getCenterY()).toBe(232); // 200 + 64/2
        });

        it('distanceTo another entity', () => {
            const other = new Player(100, 200);
            expect(player.distanceTo(other)).toBe(0);
        });
    });
});
