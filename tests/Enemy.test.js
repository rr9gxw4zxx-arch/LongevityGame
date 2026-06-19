import { Enemy } from '../src/game/entities/Enemy.js';

describe('Enemy', () => {
    let enemy;
    const enemyData = {
        id: 'demon_spirit',
        name: '游魂',
        realm: 2,
        hp: 50,
        attack: 10,
        defense: 2,
        exp: 20,
        gold: 10,
        isBoss: false
    };

    beforeEach(() => {
        enemy = new Enemy(enemyData, 100, 200);
    });

    describe('constructor', () => {
        it('initializes from data with position', () => {
            expect(enemy.x).toBe(100);
            expect(enemy.y).toBe(200);
            expect(enemy.width).toBe(40);
            expect(enemy.height).toBe(40);
        });

        it('copies stats from data object', () => {
            expect(enemy.id).toBe('demon_spirit');
            expect(enemy.name).toBe('游魂');
            expect(enemy.realm).toBe(2);
            expect(enemy.maxHp).toBe(50);
            expect(enemy.hp).toBe(50);
            expect(enemy.attack).toBe(10);
            expect(enemy.defense).toBe(2);
            expect(enemy.exp).toBe(20);
            expect(enemy.gold).toBe(10);
        });

        it('defaults isBoss to false', () => {
            expect(enemy.isBoss).toBe(false);
        });

        it('sets isBoss from data', () => {
            const bossData = { ...enemyData, isBoss: true };
            const boss = new Enemy(bossData, 0, 0);
            expect(boss.isBoss).toBe(true);
        });

        it('initializes movement properties', () => {
            expect(enemy.alive).toBe(true);
            expect(enemy.moveTimer).toBe(0);
            expect(enemy.moveInterval).toBeGreaterThanOrEqual(2);
            expect(enemy.moveInterval).toBeLessThanOrEqual(4);
            expect(enemy.speed).toBeGreaterThanOrEqual(30);
            expect(enemy.speed).toBeLessThanOrEqual(50);
        });
    });

    describe('update', () => {
        it('increments move timer', () => {
            enemy.update(0.5);
            expect(enemy.moveTimer).toBe(0.5);
        });

        it('changes direction when timer exceeds interval', () => {
            enemy.moveInterval = 1;
            enemy.update(1.5);

            expect(enemy.moveTimer).toBe(0);
            // direction should have been set (random values)
            expect(enemy.targetDirection.x).toBeDefined();
            expect(enemy.targetDirection.y).toBeDefined();
        });

        it('updates velocity from target direction', () => {
            enemy.targetDirection = { x: 1, y: 0 };
            enemy.speed = 40;
            enemy.update(0.1);

            expect(enemy.velocity.x).toBe(40);
            expect(enemy.velocity.y).toBe(0);
        });

        it('moves based on velocity (inherits from Entity)', () => {
            enemy.targetDirection = { x: 1, y: 0 };
            enemy.speed = 100;
            const startX = enemy.x;
            enemy.update(1.0);

            expect(enemy.x).toBeGreaterThan(startX);
        });

        it('reverses direction when going out of bounds', () => {
            enemy.x = 1700; // beyond 1600 limit
            enemy.targetDirection = { x: 1, y: 0 };
            enemy.speed = 50;
            enemy.update(0.1);

            expect(enemy.targetDirection.x).toBe(-1);
        });

        it('reverses direction when going below 0', () => {
            enemy.x = -10;
            enemy.targetDirection = { x: -1, y: 0 };
            enemy.speed = 50;
            enemy.update(0.1);

            expect(enemy.targetDirection.x).toBe(1);
        });
    });

    describe('takeDamage', () => {
        it('reduces HP by given amount', () => {
            enemy.takeDamage(15);
            expect(enemy.hp).toBe(35);
        });

        it('marks enemy as dead when HP drops to 0', () => {
            enemy.takeDamage(50);
            expect(enemy.hp).toBe(0);
            expect(enemy.alive).toBe(false);
        });

        it('marks enemy as dead when HP goes below 0', () => {
            enemy.takeDamage(100);
            expect(enemy.hp).toBe(-50);
            expect(enemy.alive).toBe(false);
        });

        it('stays alive with partial damage', () => {
            enemy.takeDamage(10);
            expect(enemy.alive).toBe(true);
        });
    });
});
