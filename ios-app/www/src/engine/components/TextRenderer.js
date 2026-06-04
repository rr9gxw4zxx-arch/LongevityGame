export class TextRenderer {
    constructor(text = '', fontSize = 16, color = '#ffffff', font = 'SimHei') {
        this.name = 'TextRenderer';
        this.entity = null;
        this.text = text;
        this.fontSize = fontSize;
        this.color = color;
        this.font = font;
        this.align = 'center';
        this.baseline = 'middle';
        this.strokeColor = null;
        this.strokeWidth = 0;
    }
    
    init() {}
    
    update(dt) {}
    
    render(ctx) {
        ctx.save();
        ctx.font = `${this.fontSize}px ${this.font}`;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        
        if (this.strokeColor && this.strokeWidth > 0) {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeText(this.text, this.entity.x, this.entity.y);
        }
        
        ctx.fillText(this.text, this.entity.x, this.entity.y);
        ctx.restore();
    }
    
    setText(text) {
        this.text = text;
    }
    
    destroy() {}
}