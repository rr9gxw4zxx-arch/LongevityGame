export class Entity {
    constructor(x = 0, y = 0, width = 32, height = 32) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = { x: 0, y: 0 };
        this.speed = 100;
        this.alive = true;
        this.visible = true;
        this.layer = 0;
        this.engine = null;
        this.components = {};
    }
    
    addComponent(component) {
        if (!component || !component.name) {
            console.error('Entity.addComponent: invalid component (missing or no name)');
            return;
        }
        this.components[component.name] = component;
        component.entity = this;
        if (component.init) {
            component.init();
        }
    }
    
    getComponent(name) {
        return this.components[name];
    }
    
    hasComponent(name) {
        return !!this.components[name];
    }
    
    removeComponent(name) {
        const component = this.components[name];
        if (component && component.destroy) {
            component.destroy();
        }
        delete this.components[name];
    }
    
    update(dt) {
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
        
        for (const key in this.components) {
            if (this.components[key].update) {
                this.components[key].update(dt);
            }
        }
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        for (const key in this.components) {
            if (this.components[key].render) {
                this.components[key].render(ctx);
            }
        }
    }
    
    getCenterX() {
        return this.x + this.width / 2;
    }
    
    getCenterY() {
        return this.y + this.height / 2;
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    
    distanceTo(other) {
        if (!other) return Infinity;
        const dx = this.getCenterX() - other.getCenterX();
        const dy = this.getCenterY() - other.getCenterY();
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    intersects(other) {
        if (!other) return false;
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
    
    destroy() {
        this.alive = false;
        for (const key in this.components) {
            if (this.components[key].destroy) {
                this.components[key].destroy();
            }
        }
        if (this.engine) {
            this.engine.removeEntity(this);
        }
    }
}