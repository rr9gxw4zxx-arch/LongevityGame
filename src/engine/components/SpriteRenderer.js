export class SpriteRenderer {
    constructor(imagePath, frameWidth = 32, frameHeight = 32, frameCount = 1) {
        this.name = 'SpriteRenderer';
        this.entity = null;
        this.image = null;
        this.imagePath = imagePath;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.animationSpeed = 0.1;
        this.flipped = false;
        this.loaded = false;
        
        this.loadImage();
    }
    
    loadImage() {
        if (this.imagePath) {
            this.image = new Image();
            this.image.onload = () => {
                this.loaded = true;
            };
            this.image.src = this.imagePath;
        }
    }
    
    init() {}
    
    update(dt) {
        if (this.frameCount > 1) {
            this.frameTimer += dt;
            if (this.frameTimer >= this.animationSpeed) {
                this.frameTimer = 0;
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            }
        }
    }
    
    render(ctx) {
        if (!this.loaded || !this.image) {
            ctx.fillStyle = '#444';
            ctx.fillRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
            return;
        }
        
        ctx.save();
        
        if (this.flipped) {
            ctx.translate(this.entity.x + this.entity.width, this.entity.y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                this.currentFrame * this.frameWidth, 0,
                this.frameWidth, this.frameHeight,
                0, 0,
                this.entity.width, this.entity.height
            );
        } else {
            ctx.drawImage(
                this.image,
                this.currentFrame * this.frameWidth, 0,
                this.frameWidth, this.frameHeight,
                this.entity.x, this.entity.y,
                this.entity.width, this.entity.height
            );
        }
        
        ctx.restore();
    }
    
    setAnimation(frameCount, speed = 0.1) {
        this.frameCount = frameCount;
        this.animationSpeed = speed;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }
    
    destroy() {
        this.image = null;
    }
}