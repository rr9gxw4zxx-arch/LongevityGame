export class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        
        this.entities = [];
        this.uiElements = [];
        this.systems = [];
        
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / 60;
        
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.useWebGL = false;
        
        this.input = {
            keys: {},
            mouse: { x: 0, y: 0, down: false },
            touch: { 
                active: false, 
                x: 0, y: 0, 
                startX: 0, startY: 0,
                moved: false,
                touches: {}
            },
            joystick: {
                active: false,
                x: 0, y: 0,
                startX: 0, startY: 0,
                deltaX: 0, deltaY: 0,
                radius: 40
            }
        };
        
        this.onResize = this.onResize.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        
        this.init();
        this.optimizeForMobile();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', this.onResize, { passive: true });
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        window.addEventListener('touchend', this.handleTouchEnd, { passive: true });
        window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }
    
    onDeviceReady() {
        console.log('Cordova device ready');
    }
    
    optimizeForMobile() {
        if (this.isMobile) {
            this.fps = 30;
            this.frameInterval = 1000 / 30;
            
            this.ctx.imageSmoothingEnabled = false;
            
            this.setupTouchControls();
        }
    }
    
    setupTouchControls() {
        const joystickCanvas = document.getElementById('joystick');
        if (joystickCanvas) {
            this.joystickCtx = joystickCanvas.getContext('2d');
            this.drawJoystick();
        }
        
        const skillBtns = document.querySelectorAll('.actionBtn');
        skillBtns.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const skillId = btn.dataset.skill;
                this.emit('skill', { skillId });
            });
        });
        
        const attackBtn = document.getElementById('attackBtn');
        if (attackBtn) {
            attackBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.emit('attack');
            });
        }

        const interactBtn = document.getElementById('interactBtn');
        if (interactBtn) {
            interactBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.emit('interact');
            });
        }
    }
    
    drawJoystick() {
        if (!this.joystickCtx) return;
        
        const ctx = this.joystickCtx;
        const centerX = 60;
        const centerY = 60;
        const radius = 50;
        
        ctx.clearRect(0, 0, 120, 120);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        if (this.input.joystick.active) {
            const stickX = centerX + this.input.joystick.deltaX;
            const stickY = centerY + this.input.joystick.deltaY;
            
            ctx.beginPath();
            ctx.arc(stickX, stickY, 25, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
            ctx.fill();
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.width = rect.width * dpr;
        this.height = rect.height * dpr;
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
    }
    
    onResize() {
        this.resize();
    }
    
    handleKeyDown(e) {
        this.input.keys[e.code] = true;
        if (e.code === 'Escape') {
            this.emit('escape');
        }
    }
    
    handleKeyUp(e) {
        this.input.keys[e.code] = false;
    }
    
    handleMouseDown(e) {
        this.input.mouse.down = true;
        this.input.mouse.x = e.clientX;
        this.input.mouse.y = e.clientY;
        this.emit('click', { x: e.clientX, y: e.clientY });
    }
    
    handleMouseUp(e) {
        this.input.mouse.down = false;
    }
    
    handleMouseMove(e) {
        this.input.mouse.x = e.clientX;
        this.input.mouse.y = e.clientY;
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        
        if (touchX < 140 && touchY > window.innerHeight - 140) {
            this.input.joystick.active = true;
            this.input.joystick.startX = touchX;
            this.input.joystick.startY = touchY;
            this.input.joystick.deltaX = 0;
            this.input.joystick.deltaY = 0;
        }
        
        this.input.touch.active = true;
        this.input.touch.x = touchX;
        this.input.touch.y = touchY;
        this.input.touch.startX = touchX;
        this.input.touch.startY = touchY;
        this.input.touch.moved = false;
        
        this.input.touches[touch.identifier] = {
            x: touchX,
            y: touchY,
            startX: touchX,
            startY: touchY
        };
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        
        this.input.joystick.active = false;
        this.input.joystick.deltaX = 0;
        this.input.joystick.deltaY = 0;
        this.drawJoystick();
        
        this.input.touch.active = false;
        
        e.changedTouches.forEach(touch => {
            delete this.input.touches[touch.identifier];
        });
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        
        if (this.input.joystick.active) {
            const touch = e.touches[0];
            const dx = touch.clientX - this.input.joystick.startX;
            const dy = touch.clientY - this.input.joystick.startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const radius = this.input.joystick.radius;
            
            if (distance > radius) {
                this.input.joystick.deltaX = (dx / distance) * radius;
                this.input.joystick.deltaY = (dy / distance) * radius;
            } else {
                this.input.joystick.deltaX = dx;
                this.input.joystick.deltaY = dy;
            }
            
            this.drawJoystick();
        }
        
        if (e.touches[0]) {
            const touch = e.touches[0];
            this.input.touch.x = touch.clientX;
            this.input.touch.y = touch.clientY;
            this.input.touch.moved = true;
        }
    }
    
    addEntity(entity) {
        this.entities.push(entity);
        entity.engine = this;
    }
    
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    }
    
    addSystem(system) {
        this.systems.push(system);
        system.engine = this;
    }
    
    addUIElement(element) {
        this.uiElements.push(element);
    }
    
    setCameraTarget(target) {
        this.cameraTarget = target;
    }
    
    updateCamera() {
        if (this.cameraTarget) {
            const targetX = this.cameraTarget.x - this.width / 2 / this.camera.zoom;
            const targetY = this.cameraTarget.y - this.height / 2 / this.camera.zoom;
            
            this.camera.x += (targetX - this.camera.x) * 0.15;
            this.camera.y += (targetY - this.camera.y) * 0.15;
        }
    }
    
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;
        
        if (elapsed >= this.frameInterval) {
            this.deltaTime = Math.min(elapsed / 1000, 0.1);
            this.lastTime = currentTime;
            
            this.update();
            this.render();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.updateCamera();
        
        this.systems.forEach(system => system.update(this.deltaTime));
        
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(this.deltaTime);
            }
        });
        
        this.uiElements.forEach(element => {
            if (element.update) {
                element.update(this.deltaTime);
            }
        });
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.ctx.save();
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        this.entities.forEach(entity => {
            if (entity.render) {
                entity.render(this.ctx);
            }
        });
        
        this.ctx.restore();
        
        this.uiElements.forEach(element => {
            if (element.render) {
                element.render(this.ctx);
            }
        });
    }
    
    emit(eventName, data) {
        const handlers = this.eventHandlers?.[eventName];
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }
    
    on(eventName, handler) {
        if (!this.eventHandlers) {
            this.eventHandlers = {};
        }
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        this.eventHandlers[eventName].push(handler);
    }
    
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('touchend', this.handleTouchEnd);
        window.removeEventListener('touchmove', this.handleTouchMove);
    }
}