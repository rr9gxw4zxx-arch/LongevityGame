import { GameEngine } from '../engine/GameEngine.js';
import { MapSystem } from './systems/MapSystem.js';
import { BattleSystem } from './systems/BattleSystem.js';
import { Player } from './entities/Player.js';
import { NPC } from './entities/NPC.js';
import { Enemy } from './entities/Enemy.js';
import { HUD } from './ui/HUD.js';
import { WORLD_CONFIG, SKILLS, NPC_DATA, ENEMIES, CULTIVATION_REALMS } from './data/WorldData.js';

class LongevityGame {
    constructor() {
        this.engine = null;
        this.player = null;
        this.mapSystem = null;
        this.battleSystem = null;
        this.hud = null;
        this.npcs = [];
        this.enemies = [];
        this.currentInteractingNPC = null;
        this.gameState = 'menu';
        this.isMobile = false;
    }
    
    init() {
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        this.engine = new GameEngine('gameCanvas');
        this.isMobile = this.engine.isMobile;
        
        this.mapSystem = new MapSystem();
        this.mapSystem.init(WORLD_CONFIG.mapWidth, WORLD_CONFIG.mapHeight, this.isMobile ? 48 : 32);
        this.engine.addSystem(this.mapSystem);
        
        this.player = new Player(400, 400);
        this.engine.addEntity(this.player);
        this.engine.setCameraTarget(this.player);
        
        for (const skillId in SKILLS) {
            this.player.addSkill(SKILLS[skillId]);
        }
        
        this.battleSystem = new BattleSystem();
        this.battleSystem.init(this.player);
        this.engine.addSystem(this.battleSystem);
        
        this.initNPCs();
        this.initEnemies();
        
        this.hud = new HUD(this.engine);
        this.hud.setPlayer(this.player);
        this.engine.addUIElement(this.hud);
        
        this.setupInputHandlers();
        
        this.gameState = 'playing';
        this.engine.start();
        
        this.showWelcomeMessage();
    }
    
    initNPCs() {
        NPC_DATA.forEach(npcData => {
            const npc = new NPC(npcData);
            this.npcs.push(npc);
            this.engine.addEntity(npc);
        });
    }
    
    initEnemies() {
        const spawnPositions = [
            { x: 1000, y: 200 },
            { x: 1100, y: 300 },
            { x: 1050, y: 400 },
            { x: 1200, y: 250 },
            { x: 950, y: 350 },
            { x: 1300, y: 400 },
            { x: 1400, y: 300 }
        ];
        
        spawnPositions.forEach((pos, index) => {
            const enemyData = ENEMIES[index % 3];
            const enemy = new Enemy(enemyData, pos.x, pos.y);
            this.enemies.push(enemy);
            this.engine.addEntity(enemy);
        });
        
        const boss = new Enemy(ENEMIES[3], 1400, 600);
        this.enemies.push(boss);
        this.engine.addEntity(boss);
    }
    
    setupInputHandlers() {
        this.engine.on('click', (data) => {
            if (this.gameState !== 'playing') return;
            
            const menuAction = this.hud.handleClick(data.x, data.y);
            if (menuAction) {
                this.handleMenuAction(menuAction);
                return;
            }
            
            if (!this.isMobile) {
                this.checkEnemyClick(data.x, data.y);
            }
        });
        
        this.engine.on('skill', (data) => {
            if (this.gameState !== 'playing') return;
            if (data.skillId) {
                this.battleSystem.useSkill(data.skillId);
            }
        });
        
        this.engine.on('attack', () => {
            if (this.gameState !== 'playing') return;
            this.checkNearbyEnemies();
        });

        this.engine.on('interact', () => {
            if (this.gameState !== 'playing') return;
            this.handleInteract();
        });
        
        this.engine.on('escape', () => {
            if (this.gameState === 'playing') {
                this.hud.toggleMenu();
            }
        });
        
        const handleKeyDown = (e) => {
            if (this.gameState !== 'playing') return;
            
            if (e.code === 'KeyE') {
                this.handleInteract();
            }
            
            if (e.code === 'Digit1') {
                this.battleSystem.useSkill('qingping');
            }
            if (e.code === 'Digit2') {
                this.battleSystem.useSkill('taiji');
            }
            if (e.code === 'Digit3') {
                this.battleSystem.useSkill('zhenwu');
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
    }
    
    handleInteract() {
        if (this.currentInteractingNPC) {
            this.currentInteractingNPC.nextDialogue();
            return;
        }
        
        this.npcs.forEach(npc => {
            if (npc.isNearby(this.player)) {
                this.currentInteractingNPC = npc;
                npc.startDialogue();
            }
        });
    }
    
    checkNearbyEnemies() {
        this.enemies.forEach(enemy => {
            if (enemy.alive && this.player.distanceTo(enemy) < 60) {
                this.battleSystem.startBattle(enemy);
            }
        });
    }
    
    checkEnemyClick(screenX, screenY) {
        const camera = this.engine.camera;
        const worldX = screenX / camera.zoom + camera.x;
        const worldY = screenY / camera.zoom + camera.y;
        
        this.enemies.forEach(enemy => {
            if (enemy.alive && 
                worldX >= enemy.x && worldX <= enemy.x + enemy.width &&
                worldY >= enemy.y && worldY <= enemy.y + enemy.height) {
                
                this.battleSystem.startBattle(enemy);
            }
        });
    }
    
    handleMenuAction(action) {
        switch (action) {
            case 'resume':
                this.hud.toggleMenu();
                break;
            case 'stats':
                this.showStats();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'quests':
                this.showQuests();
                break;
            case 'save':
                this.saveGame();
                break;
            case 'quit':
                this.quitGame();
                break;
        }
    }
    
    showWelcomeMessage() {
        console.log('=== 洪荒长生 · 李长寿传 ===');
        console.log('欢迎来到至高洪荒世界！');
        if (this.isMobile) {
            console.log('移动端操作说明:');
            console.log('虚拟摇杆 - 移动');
            console.log('右侧按钮 - 攻击/技能');
        } else {
            console.log('操作说明:');
            console.log('WASD / 方向键 - 移动');
            console.log('Shift - 冲刺');
            console.log('E - 交互/对话');
            console.log('1/2/3 - 使用技能');
            console.log('ESC - 打开菜单');
            console.log('点击敌人 - 进入战斗');
        }
    }
    
    showStats() {
        const realm = CULTIVATION_REALMS.find(r => r.id === this.player.realm);
        console.log(`\n=== \u89D2\u8272\u5C5E\u6027 ===`);
        console.log(`\u59D3\u540D: ${this.player.name}`);
        console.log(`\u6807\u9898: ${this.player.title}`);
        console.log(`\u7B49\u7EA7: ${this.player.level}`);
        console.log(`\u4F20\u59DA: ${realm?.name || '未知'}`);
        console.log(`\u8EAB\u4F53: ${this.player.hp}/${this.player.maxHp}`);
        console.log(`\u653B\u529B: ${this.player.attack}`);
        console.log(`\u9632\u5FA1: ${this.player.defense}`);
        console.log(`\u7ECF\u9A8C: ${this.player.exp}`);
        console.log(`\u91D1\u5E01: ${this.player.gold}`);
    }
    
    showSkills() {
        console.log(`\n=== \u6280\u80FD\u7CFB\u7EDF ===`);
        for (const skillId in this.player.skills) {
            const skill = this.player.skills[skillId];
            console.log(`${skill.icon} ${skill.name}`);
            console.log(`  \u63CF\u8FF0: ${skill.description}`);
            if (skill.damage > 0) {
                console.log(`  \u653B\u529B: ${skill.damage}`);
            }
            if (skill.cooldown) {
                console.log(`  \u51B7\u5374: ${skill.cooldown / 1000}秒`);
            }
        }
    }
    
    showQuests() {
        console.log(`\n=== \u4EFB\u52A1\u65E5\u5FD7 ===`);
        console.log('1. 初入山门 - 拜见师父玉鼎真人');
        console.log('2. 修炼之道 - 在清虚观内修炼');
        console.log('3. 师姐的请求 - 帮助云霄师姐寻找发簪');
    }
    
    saveGame() {
        const saveData = {
            player: {
                x: this.player.x,
                y: this.player.y,
                level: this.player.level,
                hp: this.player.hp,
                maxHp: this.player.maxHp,
                attack: this.player.attack,
                defense: this.player.defense,
                exp: this.player.exp,
                gold: this.player.gold,
                realm: this.player.realm
            },
            timestamp: Date.now()
        };
        
        localStorage.setItem('longevity_save', JSON.stringify(saveData));
        console.log('游戏已保存！');
        this.hud.toggleMenu();
    }
    
    loadGame() {
        const saveData = localStorage.getItem('longevity_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.player.x = data.player.x;
            this.player.y = data.player.y;
            this.player.level = data.player.level;
            this.player.hp = data.player.hp;
            this.player.maxHp = data.player.maxHp;
            this.player.attack = data.player.attack;
            this.player.defense = data.player.defense;
            this.player.exp = data.player.exp;
            this.player.gold = data.player.gold;
            this.player.realm = data.player.realm;
            console.log('游戏已加载！');
        }
    }
    
    quitGame() {
        this.engine.stop();
        this.gameState = 'menu';
        console.log('游戏已退出');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new LongevityGame();
    game.init();
});

document.addEventListener('deviceready', () => {
    console.log('Cordova is ready');
}, false);