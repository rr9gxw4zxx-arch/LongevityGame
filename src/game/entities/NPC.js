import { Entity } from '../../engine/Entity.js';

export class NPC extends Entity {
    constructor(data) {
        super(data.position.x, data.position.y, 40, 56);
        
        this.id = data.id;
        this.name = data.name;
        this.role = data.role;
        this.realm = data.realm;
        this.dialogue = data.dialogue;
        this.currentDialogueIndex = 0;
        
        this.interacting = false;
        this.talkRadius = 60;
    }
    
    update(dt) {
        super.update(dt);
    }
    
    render(ctx) {
        this.drawNPC(ctx);
        this.drawName(ctx);
        
        if (this.interacting) {
            this.drawDialogue(ctx);
        }
    }
    
    drawNPC(ctx) {
        ctx.save();
        
        const colors = {
            master: '#c9a227',
            junior_sister: '#ff99cc',
            senior_brother: '#4a90d9'
        };
        
        const color = colors[this.id] || '#888';
        
        ctx.fillStyle = '#f5f5dc';
        ctx.fillRect(this.x + 6, this.y + 16, 28, 28);
        
        ctx.fillStyle = '#8B4513';
        if (this.id === 'junior_sister') {
            ctx.beginPath();
            ctx.arc(this.x + 20, this.y + 8, 12, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(this.x + 8, this.y + 6, 24, 14);
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(this.x + 4, this.y + 22, 10, 6);
        ctx.fillRect(this.x + 26, this.y + 22, 10, 6);
        
        ctx.fillStyle = '#2d5a27';
        ctx.fillRect(this.x + 12, this.y + 42, 16, 14);
        
        ctx.restore();
    }
    
    drawName(ctx) {
        ctx.save();
        ctx.font = '12px SimHei';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        
        ctx.strokeText(this.name, this.x + this.width / 2, this.y - 5);
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 5);
        
        ctx.font = '10px SimHei';
        ctx.fillStyle = '#ffd700';
        ctx.strokeText(this.role, this.x + this.width / 2, this.y + 55);
        ctx.fillText(this.role, this.x + this.width / 2, this.y + 55);
        
        ctx.restore();
    }
    
    drawDialogue(ctx) {
        ctx.save();
        
        const boxWidth = 200;
        const boxHeight = 60;
        const boxX = this.x + this.width / 2 - boxWidth / 2;
        const boxY = this.y - boxHeight - 15;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px SimHei';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const lines = this.wrapText(this.getCurrentDialogue(), 25);
        lines.forEach((line, i) => {
            ctx.fillText(line, boxX + boxWidth / 2, boxY + 15 + i * 20);
        });
        
        ctx.fillStyle = '#ffd700';
        ctx.font = '10px SimHei';
        ctx.fillText('按 E 继续', boxX + boxWidth - 60, boxY + boxHeight - 10);
        
        ctx.restore();
    }
    
    wrapText(text, maxLength) {
        const lines = [];
        let currentLine = '';
        
        for (let i = 0; i < text.length; i++) {
            currentLine += text[i];
            if (currentLine.length >= maxLength) {
                lines.push(currentLine);
                currentLine = '';
            }
        }
        if (currentLine) lines.push(currentLine);
        
        return lines;
    }
    
    getCurrentDialogue() {
        return this.dialogue[this.currentDialogueIndex] || '';
    }
    
    nextDialogue() {
        this.currentDialogueIndex = (this.currentDialogueIndex + 1) % this.dialogue.length;
    }
    
    startDialogue() {
        this.interacting = true;
        this.currentDialogueIndex = 0;
    }
    
    endDialogue() {
        this.interacting = false;
    }
    
    isNearby(player) {
        return this.distanceTo(player) < this.talkRadius;
    }
}