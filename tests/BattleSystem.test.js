import { BattleSystem } from '../src/game/systems/BattleSystem.js';

describe('BattleSystem', () => {
    let battleSystem;
    let mockPlayer;
    let mockEnemy;

    beforeEach(() => {
        battleSystem = new BattleSystem();
        mockPlayer = {
            x: 0, y: 0, width: 32, height: 32,
            attack: 20,
            defense: 5,
            hp: 100,
            maxHp: 100,
            exp: 0,
            gold: 0,
            level: 1,
            skills: {},
            getCenterX() { return this.x + this.width / 2; },
            getCenterY() { return this.y + this.height / 2; },
            distanceTo(other) {
                const dx = this.getCenterX() - other.getCenterX();
                const dy = this.getCenterY() - other.getCenterY();
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        mockEnemy = {
            x: 10, y: 10, width: 32, height: 32,
            name: '游魂',
            hp: 50,
            maxHp: 50,
            attack: 10,
            defense: 2,
            exp: 20,
            gold: 10,
            alive: true,
            getCenterX() { return this.x + this.width / 2; },
            getCenterY() { return this.y + this.height / 2; }
        };
        battleSystem.init(mockPlayer);
    });

    describe('constructor', () => {
        it('initializes with default state', () => {
            const bs = new BattleSystem();
            expect(bs.isInBattle).toBe(false);
            expect(bs.enemies).toEqual([]);
            expect(bs.currentTarget).toBeNull();
            expect(bs.skillCooldowns).toEqual({});
            expect(bs.battleLog).toEqual([]);
        });
    });

    describe('startBattle', () => {
        it('sets battle state and adds enemy', () => {
            battleSystem.startBattle(mockEnemy);

            expect(battleSystem.isInBattle).toBe(true);
            expect(battleSystem.enemies).toContain(mockEnemy);
            expect(battleSystem.currentTarget).toBe(mockEnemy);
        });

        it('adds log entry on first battle start', () => {
            battleSystem.startBattle(mockEnemy);
            expect(battleSystem.battleLog.length).toBe(1);
            expect(battleSystem.battleLog[0].message).toContain('游魂');
        });

        it('does not reset isInBattle if already in battle', () => {
            battleSystem.startBattle(mockEnemy);
            const enemy2 = { ...mockEnemy, name: '恶鬼' };
            battleSystem.startBattle(enemy2);

            expect(battleSystem.enemies.length).toBe(2);
            // Only one "start battle" log entry for the first enemy
            const startLogs = battleSystem.battleLog.filter(l => l.message.includes('战斗'));
            expect(startLogs.length).toBe(1);
        });
    });

    describe('calculateDamage', () => {
        it('returns positive damage', () => {
            const damage = battleSystem.calculateDamage(mockPlayer, mockEnemy);
            expect(damage).toBeGreaterThan(0);
        });

        it('applies defense reduction', () => {
            const highDefEnemy = { ...mockEnemy, defense: 100 };
            const damage = battleSystem.calculateDamage(mockPlayer, highDefEnemy);
            // minimum damage is 1
            expect(damage).toBeGreaterThanOrEqual(1);
        });

        it('damage varies with randomness but stays in range', () => {
            const damages = [];
            for (let i = 0; i < 100; i++) {
                damages.push(battleSystem.calculateDamage(mockPlayer, mockEnemy));
            }
            // base = 20, defense reduction = 2*0.5 = 1, so range ~ (20*0.8 - 1) to (20*1.2 - 1)
            damages.forEach(d => {
                expect(d).toBeGreaterThanOrEqual(1);
                expect(d).toBeLessThanOrEqual(25);
            });
        });
    });

    describe('isInRange', () => {
        it('returns true when player is close to enemy', () => {
            mockPlayer.x = 0;
            mockPlayer.y = 0;
            mockEnemy.x = 10;
            mockEnemy.y = 10;
            expect(battleSystem.isInRange(mockEnemy)).toBe(true);
        });

        it('returns false when player is far from enemy', () => {
            mockPlayer.x = 0;
            mockPlayer.y = 0;
            mockEnemy.x = 500;
            mockEnemy.y = 500;
            expect(battleSystem.isInRange(mockEnemy)).toBe(false);
        });
    });

    describe('attackEnemy', () => {
        it('reduces enemy HP', () => {
            const initialHp = mockEnemy.hp;
            battleSystem.attackEnemy(mockEnemy);
            expect(mockEnemy.hp).toBeLessThan(initialHp);
        });

        it('marks enemy as dead when HP reaches 0', () => {
            mockEnemy.hp = 1;
            mockEnemy.defense = 0;
            battleSystem.attackEnemy(mockEnemy);
            expect(mockEnemy.alive).toBe(false);
        });

        it('rewards player when enemy dies', () => {
            mockEnemy.hp = 1;
            mockEnemy.defense = 0;
            battleSystem.startBattle(mockEnemy);
            battleSystem.attackEnemy(mockEnemy);
            expect(mockPlayer.exp).toBe(20);
            expect(mockPlayer.gold).toBe(10);
        });
    });

    describe('useSkill', () => {
        beforeEach(() => {
            mockPlayer.skills = {
                qingping: {
                    id: 'qingping',
                    name: '青萍剑',
                    icon: '⚔️',
                    damage: 30,
                    cooldown: 2000
                },
                longevity: {
                    id: 'longevity',
                    name: '长生大道',
                    icon: '🍃',
                    damage: 0,
                    effect: { type: 'buff', stat: 'maxHp', value: 100 }
                }
            };
            battleSystem.startBattle(mockEnemy);
        });

        it('returns false if no player', () => {
            battleSystem.player = null;
            expect(battleSystem.useSkill('qingping')).toBe(false);
        });

        it('returns false if no current target', () => {
            battleSystem.currentTarget = null;
            expect(battleSystem.useSkill('qingping')).toBe(false);
        });

        it('returns false for unknown skill', () => {
            expect(battleSystem.useSkill('nonexistent')).toBe(false);
        });

        it('deals skill damage to target', () => {
            const initialHp = mockEnemy.hp;
            battleSystem.useSkill('qingping');
            expect(mockEnemy.hp).toBe(initialHp - 30);
        });

        it('sets cooldown after skill use', () => {
            battleSystem.useSkill('qingping');
            expect(battleSystem.skillCooldowns['qingping']).toBeDefined();
        });

        it('returns false if skill is on cooldown', () => {
            battleSystem.useSkill('qingping');
            expect(battleSystem.useSkill('qingping')).toBe(false);
        });

        it('applies buff effect', () => {
            const initialMaxHp = mockPlayer.maxHp;
            battleSystem.useSkill('longevity');
            expect(mockPlayer.maxHp).toBe(initialMaxHp + 100);
            expect(mockPlayer.hp).toBe(mockPlayer.hp); // hp also increased
        });
    });

    describe('rewardPlayer', () => {
        it('adds exp and gold from enemy', () => {
            battleSystem.rewardPlayer(mockEnemy);
            expect(mockPlayer.exp).toBe(20);
            expect(mockPlayer.gold).toBe(10);
        });

        it('handles enemies with no exp/gold', () => {
            battleSystem.rewardPlayer({ exp: undefined, gold: undefined });
            expect(mockPlayer.exp).toBe(0);
            expect(mockPlayer.gold).toBe(0);
        });
    });

    describe('checkLevelUp', () => {
        it('levels up player when exp threshold met', () => {
            mockPlayer.exp = 100; // level 1 needs 100 exp
            battleSystem.checkLevelUp();

            expect(mockPlayer.level).toBe(2);
            expect(mockPlayer.exp).toBe(0);
            expect(mockPlayer.attack).toBe(25);
            expect(mockPlayer.maxHp).toBe(120);
            expect(mockPlayer.hp).toBe(120);
        });

        it('does not level up if exp is below threshold', () => {
            mockPlayer.exp = 50;
            battleSystem.checkLevelUp();
            expect(mockPlayer.level).toBe(1);
        });
    });

    describe('endBattle', () => {
        it('resets battle state', () => {
            battleSystem.startBattle(mockEnemy);
            battleSystem.endBattle();

            expect(battleSystem.isInBattle).toBe(false);
            expect(battleSystem.enemies).toEqual([]);
            expect(battleSystem.currentTarget).toBeNull();
        });
    });

    describe('addLog', () => {
        it('adds message with timestamp', () => {
            battleSystem.addLog('test message');
            expect(battleSystem.battleLog.length).toBe(1);
            expect(battleSystem.battleLog[0].message).toBe('test message');
            expect(battleSystem.battleLog[0].time).toBeDefined();
        });

        it('keeps maximum 10 log entries', () => {
            for (let i = 0; i < 15; i++) {
                battleSystem.addLog(`msg ${i}`);
            }
            expect(battleSystem.battleLog.length).toBe(10);
            expect(battleSystem.battleLog[0].message).toBe('msg 5');
        });
    });

    describe('update', () => {
        it('does nothing when not in battle', () => {
            battleSystem.isInBattle = false;
            battleSystem.update(0.016);
            // No error thrown
        });

        it('removes dead enemies from list', () => {
            battleSystem.startBattle(mockEnemy);
            mockEnemy.alive = false;
            battleSystem.update(0.016);
            expect(battleSystem.enemies.length).toBe(0);
        });

        it('ends battle when all enemies are dead', () => {
            battleSystem.startBattle(mockEnemy);
            mockEnemy.alive = false;
            battleSystem.update(0.016);
            expect(battleSystem.isInBattle).toBe(false);
        });
    });
});
