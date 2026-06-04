import { Entity } from '../../engine/Entity.js';

export class Enemy extends Entity {
    constructor(data, x, y) {
        super(x, y, 40, 40);
        
        this.id = data.id;
        this.name = data.name;
        this.realm = data.realm;
        this.maxHp = data.hp;
        this.hp = data.hp;
        this.attack = data.attack;
        this.defense = data.defense;
        this.exp = data.exp;
        this.gold = data.gold;
        this.isBoss = data.isBoss || false;
        
        this.alive = true;
        this.moveTimer = 0;
        this.moveInterval = 2 + Math.random() * 2;
        this.targetDirection = { x: 0, y: 0 };
        this.speed = 30 + Math.random() * 20;
    }
    
    update(dt) {
        this.moveTimer += dt;
        
        if (this.moveTimer >= this.moveInterval) {
            this.moveTimer = 0;
            this.targetDirection = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            };
        }
        
        this.velocity.x = this.targetDirection.x * this.speed;
        this.velocity.y = this.targetDirection.y * this.speed;
        
        super.update(dt);
        
        if (this.x < 0 || this.x > 1600 || this.y < 0 || this.y > 1600) {
            this.targetDirection.x *= -1;
            this.targetDirection.y *= -1;
        }
    }
    
    render(ctx) {
        if (!this.alive) return;
        
        this.drawEnemy(ctx);
        this.drawHealthBar(ctx);
    }
    
    drawEnemy(ctx) {
        ctx.save();
        
        const colors = {
            demon_spirit: '#888888',
            ghost: '#aa00aa',
            demon_beast: '#aa5500',
            boss_dragon: '#ff4400'
        };
        
        const color = colors[this.id] || '#ff0000';
        
        ctx.fillStyle = color;
        
        if (this.isBoss) {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + 15, 8, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - 6, this.y + this.height / 2 - 4, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 + 6, this.y + this.height / 2 - 4, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - 6, this.y + this.height / 2 - 4, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 + 6, this.y + this.height / 2 - 4, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    drawHealthBar(ctx) {
        const hpPercent = this.hp / this.maxHp;
        const barWidth = this.width;
        const barHeight = 4;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);
        
        ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(this.x, this.y - 10, barWidth * hpPercent, barHeight);
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.alive = false;
        }
    }
}