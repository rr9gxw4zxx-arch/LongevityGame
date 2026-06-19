export class PlayerController {
    constructor() {
        this.name = 'PlayerController';
        this.entity = null;
        this.moveSpeed = 120;
        this.sprintMultiplier = 1.8;
        this.isSprinting = false;
        this.direction = { x: 0, y: 0 };
        this.isMoving = false;
    }
    
    init() {}
    
    update(dt) {
        if (!this.entity || !this.entity.engine) return;
        const input = this.entity.engine.input;
        
        this.direction.x = 0;
        this.direction.y = 0;
        
        if (this.entity.engine.isMobile && input.joystick.active) {
            this.direction.x = input.joystick.deltaX / input.joystick.radius;
            this.direction.y = input.joystick.deltaY / input.joystick.radius;
        } else {
            if (input.keys['KeyW'] || input.keys['ArrowUp']) this.direction.y = -1;
            if (input.keys['KeyS'] || input.keys['ArrowDown']) this.direction.y = 1;
            if (input.keys['KeyA'] || input.keys['ArrowLeft']) this.direction.x = -1;
            if (input.keys['KeyD'] || input.keys['ArrowRight']) this.direction.x = 1;
        }
        
        this.isSprinting = input.keys['ShiftLeft'] || input.keys['ShiftRight'];
        
        const length = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
        if (length > 0) {
            this.direction.x /= length;
            this.direction.y /= length;
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
        
        let speed = this.moveSpeed;
        if (this.isSprinting) {
            speed *= this.sprintMultiplier;
        }
        
        this.entity.velocity.x = this.direction.x * speed;
        this.entity.velocity.y = this.direction.y * speed;
        
        const spriteRenderer = this.entity.getComponent('SpriteRenderer');
        if (spriteRenderer) {
            if (this.direction.x < 0) spriteRenderer.flipped = true;
            if (this.direction.x > 0) spriteRenderer.flipped = false;
            
            if (this.isMoving) {
                spriteRenderer.setAnimation(4, 0.15);
            } else {
                spriteRenderer.setAnimation(1, 0.1);
            }
        }
    }
    
    destroy() {}
}