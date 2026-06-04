import { Entity } from '../../engine/Entity.js';
import { SpriteRenderer } from '../../engine/components/SpriteRenderer.js';
import { PlayerController } from '../../engine/components/PlayerController.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 48, 64);
        
        this.name = '李长寿';
        this.title = '太白金星';
        this.level = 1;
        this.realm = 1;
        this.hp = 100;
        this.maxHp = 100;
        this.attack = 10;
        this.defense = 5;
        this.exp = 0;
        this.gold = 0;
        
        this.skills = {};
        
        this.spriteRenderer = new SpriteRenderer('', 48, 64, 4);
        this.playerController = new PlayerController();
        
        this.addComponent(this.spriteRenderer);
        this.addComponent(this.playerController);
    }
    
    update(dt) {
        super.update(dt);
        
        if (this.engine) {
            this.clampPosition();
        }
    }
    
    clampPosition() {
        const map = this.engine.systems.find(s => s.constructor.name === 'MapSystem');
        if (map) {
            this.x = Math.max(0, Math.min(this.x, map.mapWidth - this.width));
            this.y = Math.max(0, Math.min(this.y, map.mapHeight - this.height));
        }
    }
    
    render(ctx) {
        this.drawPlayer(ctx);
        this.drawName(ctx);
    }
    
    drawPlayer(ctx) {
        ctx.save();
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#4a90d9');
        gradient.addColorStop(0.5, '#2a6099');
        gradient.addColorStop(1, '#1a4066');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, this.y + this.height - 8, this.width/2 - 4, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#f5f5dc';
        ctx.fillRect(this.x + 8, this.y + 20, 32, 32);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 12, this.y + 10, 24, 15);
        
        ctx.fillStyle = '#4a90d9';
        ctx.fillRect(this.x + 6, this.y + 25, 12, 8);
        ctx.fillRect(this.x + 30, this.y + 25, 12, 8);
        
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x + 24, this.y + 5, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    drawName(ctx) {
        ctx.save();
        ctx.font = '14px SimHei';
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        
        const nameX = this.x + this.width / 2;
        const nameY = this.y - 8;
        
        ctx.strokeText(this.name, nameX, nameY);
        ctx.fillText(this.name, nameX, nameY);
        
        ctx.font = '10px SimHei';
        ctx.fillStyle = '#00ff00';
        ctx.strokeText(this.title, nameX, nameY + 14);
        ctx.fillText(this.title, nameX, nameY + 14);
        
        ctx.restore();
    }
    
    addSkill(skill) {
        this.skills[skill.id] = skill;
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.onDeath();
        }
    }
    
    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }
    
    onDeath() {
        console.log(`${this.name} 陨落了...`);
    }
}