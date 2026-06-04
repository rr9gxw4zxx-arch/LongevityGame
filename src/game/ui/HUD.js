export class HUD {
    constructor(engine) {
        this.engine = engine;
        this.player = null;
        this.showMenu = false;
        this.showMap = false;
    }
    
    setPlayer(player) {
        this.player = player;
    }
    
    update(dt) {}
    
    render(ctx) {
        this.drawHealthBar(ctx);
        this.drawExpBar(ctx);
        this.drawStats(ctx);
        this.drawMinimap(ctx);
        
        if (this.showMenu) {
            this.drawMenu(ctx);
        }
    }
    
    drawHealthBar(ctx) {
        if (!this.player) return;
        
        const barWidth = 150;
        const barHeight = 15;
        const x = 20;
        const y = 20;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        const hpPercent = this.player.hp / this.player.maxHp;
        ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(x, y, barWidth * hpPercent, barHeight);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px SimHei';
        ctx.fillText(`${this.player.hp}/${this.player.maxHp}`, x + barWidth / 2 - 20, y + 12);
    }
    
    drawExpBar(ctx) {
        if (!this.player) return;
        
        const barWidth = 150;
        const barHeight = 8;
        const x = 20;
        const y = 45;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        const expNeeded = this.player.level * 100;
        const expPercent = this.player.exp / expNeeded;
        ctx.fillStyle = '#00bfff';
        ctx.fillRect(x, y, barWidth * expPercent, barHeight);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px SimHei';
        ctx.fillText(`Lv.${this.player.level}`, x, y - 5);
        ctx.fillText(`${this.player.exp}/${expNeeded}`, x + barWidth - 50, y - 5);
    }
    
    drawStats(ctx) {
        if (!this.player) return;
        
        const x = 20;
        const y = 65;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px SimHei';
        
        ctx.fillText(`\u653B\u529B: ${this.player.attack}`, x, y);
        ctx.fillText(`\u9632\u5FA1: ${this.player.defense}`, x, y + 15);
        ctx.fillText(`\u91D1\u5E01: ${this.player.gold}`, x, y + 30);
    }
    
    drawMinimap(ctx) {
        const mapWidth = 120;
        const mapHeight = 120;
        const x = this.engine.width - mapWidth - 20;
        const y = 20;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.roundRect(x, y, mapWidth, mapHeight, 8);
        ctx.fill();
        
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x + (mapWidth / 4) * i, y);
            ctx.lineTo(x + (mapWidth / 4) * i, y + mapHeight);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y + (mapHeight / 4) * i);
            ctx.lineTo(x + mapWidth, y + (mapHeight / 4) * i);
            ctx.stroke();
        }
        
        if (this.player) {
            const worldWidth = 1600;
            const worldHeight = 1600;
            
            const playerMapX = x + (this.player.x / worldWidth) * mapWidth;
            const playerMapY = y + (this.player.y / worldHeight) * mapHeight;
            
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(playerMapX, playerMapY, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px SimHei';
        ctx.fillText('地图', x + 5, y + 12);
    }
    
    drawMenu(ctx) {
        const menuWidth = 300;
        const menuHeight = 400;
        const x = (this.engine.width - menuWidth) / 2;
        const y = (this.engine.height - menuHeight) / 2;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.beginPath();
        ctx.roundRect(x, y, menuWidth, menuHeight, 12);
        ctx.fill();
        
        ctx.fillStyle = '#ffd700';
        ctx.font = '24px SimHei';
        ctx.textAlign = 'center';
        ctx.fillText('洪荒长生', x + menuWidth / 2, y + 40);
        
        const buttons = [
            { text: '继续游戏', action: 'resume' },
            { text: '角色属性', action: 'stats' },
            { text: '技能系统', action: 'skills' },
            { text: '任务日志', action: 'quests' },
            { text: '保存游戏', action: 'save' },
            { text: '退出游戏', action: 'quit' }
        ];
        
        ctx.font = '18px SimHei';
        ctx.fillStyle = '#ffffff';
        
        buttons.forEach((btn, i) => {
            const btnY = y + 80 + i * 50;
            
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.roundRect(x + 20, btnY, menuWidth - 40, 35, 8);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(btn.text, x + menuWidth / 2, btnY + 24);
        });
    }
    
    toggleMenu() {
        this.showMenu = !this.showMenu;
    }
    
    handleClick(x, y) {
        if (!this.showMenu) return null;
        
        const menuWidth = 300;
        const menuHeight = 400;
        const menuX = (this.engine.width - menuWidth) / 2;
        const menuY = (this.engine.height - menuHeight) / 2;
        
        if (x >= menuX && x <= menuX + menuWidth && y >= menuY && y <= menuY + menuHeight) {
            const buttons = ['resume', 'stats', 'skills', 'quests', 'save', 'quit'];
            const buttonIndex = Math.floor((y - menuY - 60) / 50);
            
            if (buttonIndex >= 0 && buttonIndex < buttons.length) {
                return buttons[buttonIndex];
            }
        }
        
        return null;
    }
}