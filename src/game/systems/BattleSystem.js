export class BattleSystem {
    constructor() {
        this.engine = null;
        this.player = null;
        this.enemies = [];
        this.isInBattle = false;
        this.currentTarget = null;
        this.skillCooldowns = {};
        this.battleLog = [];
    }
    
    init(player) {
        this.player = player;
    }
    
    update(dt) {
        if (!this.isInBattle || !this.player) return;
        
        this.enemies.forEach(enemy => {
            if (enemy.update) enemy.update(dt);
            
            if (this.isInRange(enemy)) {
                this.attackEnemy(enemy);
            }
        });
        
        this.enemies = this.enemies.filter(e => e.alive);
        
        if (this.enemies.length === 0) {
            this.endBattle();
        }
    }
    
    isInRange(entity) {
        const range = 50;
        return this.player.distanceTo(entity) < range;
    }
    
    startBattle(enemy) {
        if (!this.isInBattle) {
            this.isInBattle = true;
            this.addLog(`\u5F00\u59CB\u4E0E ${enemy.name} \u6218\u6597\uFF01`);
        }
        this.enemies.push(enemy);
        this.currentTarget = enemy;
    }
    
    attackEnemy(enemy) {
        const damage = this.calculateDamage(this.player, enemy);
        enemy.hp -= damage;
        this.addLog(`\u4F60\u5BF9 ${enemy.name} \u9020\u6210 ${Math.floor(damage)} \u788E\u4F24\u5BB3`);
        
        if (enemy.hp <= 0) {
            enemy.alive = false;
            this.addLog(`\u51FB\u8D25\u4E86 ${enemy.name} \uFF01`);
            this.rewardPlayer(enemy);
        }
    }
    
    calculateDamage(attacker, defender) {
        let damage = attacker.attack || 10;
        const defense = defender.defense || 5;
        
        damage *= (0.8 + Math.random() * 0.4);
        damage = Math.max(1, damage - defense * 0.5);
        
        return damage;
    }
    
    useSkill(skillId) {
        if (!this.player || !this.currentTarget) return false;
        
        const skill = this.player.skills?.[skillId];
        if (!skill) return false;
        
        const now = Date.now();
        if (this.skillCooldowns[skillId] && now < this.skillCooldowns[skillId]) {
            return false;
        }
        
        const damage = skill.damage || 0;
        if (damage > 0 && this.currentTarget) {
            this.currentTarget.hp -= damage;
            this.addLog(`${skill.icon} ${skill.name} \u5BF9 ${this.currentTarget.name} \u9020\u6210 ${damage} \u788E\u4F24\u5BB3`);
            
            if (this.currentTarget.hp <= 0) {
                this.currentTarget.alive = false;
                this.addLog(`\u51FB\u8D25\u4E86 ${this.currentTarget.name} \uFF01`);
                this.rewardPlayer(this.currentTarget);
            }
        }
        
        if (skill.effect) {
            this.applyEffect(skill.effect);
        }
        
        if (skill.cooldown) {
            this.skillCooldowns[skillId] = now + skill.cooldown;
        }
        
        return true;
    }
    
    applyEffect(effect) {
        if (effect.type === 'buff') {
            if (effect.stat === 'maxHp') {
                this.player.maxHp += effect.value;
                this.player.hp += effect.value;
                this.addLog(`\u2728 \u80FD\u91CF\u589E\u52A0 ${effect.value}`);
            }
        }
    }
    
    rewardPlayer(enemy) {
        if (!this.player) return;
        
        this.player.exp += enemy.exp || 0;
        this.player.gold += enemy.gold || 0;
        
        this.addLog(`\uD83C\uDF81 \u83B7\u5F97 ${enemy.exp} \u7ECF\u9A8C\uFF0C${enemy.gold} \u91D1\u5E01`);
        
        this.checkLevelUp();
    }
    
    checkLevelUp() {
        const expNeeded = this.player.level * 100;
        if (this.player.exp >= expNeeded) {
            this.player.exp -= expNeeded;
            this.player.level++;
            this.player.attack += 5;
            this.player.maxHp += 20;
            this.player.hp = this.player.maxHp;
            this.addLog(`\uD83C\uDF89 \u5347\u7EA7\uFF01\u5F53\u524D\u7B49\u7EA7: ${this.player.level}`);
        }
    }
    
    endBattle() {
        this.isInBattle = false;
        this.enemies = [];
        this.currentTarget = null;
        this.addLog('✓ 战斗胜利！');
    }
    
    addLog(message) {
        this.battleLog.push({
            message,
            time: Date.now()
        });
        
        if (this.battleLog.length > 10) {
            this.battleLog.shift();
        }
    }
    
    render(ctx) {
        if (!this.isInBattle) return;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, this.engine.height - 120, this.engine.width, 120);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px SimHei';
        
        let y = this.engine.height - 100;
        this.battleLog.forEach(log => {
            ctx.fillText(log.message, 10, y);
            y += 20;
        });
        
        if (this.currentTarget && this.currentTarget.alive) {
            const hpPercent = this.currentTarget.hp / this.currentTarget.maxHp;
            const barWidth = 200;
            const barHeight = 15;
            
            ctx.fillStyle = '#333';
            ctx.fillRect(this.engine.width - barWidth - 20, 20, barWidth, barHeight);
            
            ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
            ctx.fillRect(this.engine.width - barWidth - 20, 20, barWidth * hpPercent, barHeight);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px SimHei';
            ctx.fillText(`${this.currentTarget.name}: ${Math.floor(this.currentTarget.hp)}/${this.currentTarget.maxHp}`, 
                this.engine.width - barWidth - 20, 45);
        }
    }
}