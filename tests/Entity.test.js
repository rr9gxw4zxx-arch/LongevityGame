import { Entity } from '../src/engine/Entity.js';

describe('Entity', () => {
    let entity;

    beforeEach(() => {
        entity = new Entity(10, 20, 32, 32);
    });

    describe('constructor', () => {
        it('initializes with given position and dimensions', () => {
            expect(entity.x).toBe(10);
            expect(entity.y).toBe(20);
            expect(entity.width).toBe(32);
            expect(entity.height).toBe(32);
        });

        it('uses default values when no args provided', () => {
            const e = new Entity();
            expect(e.x).toBe(0);
            expect(e.y).toBe(0);
            expect(e.width).toBe(32);
            expect(e.height).toBe(32);
        });

        it('initializes velocity to zero', () => {
            expect(entity.velocity).toEqual({ x: 0, y: 0 });
        });

        it('initializes default properties', () => {
            expect(entity.speed).toBe(100);
            expect(entity.alive).toBe(true);
            expect(entity.visible).toBe(true);
            expect(entity.layer).toBe(0);
            expect(entity.engine).toBeNull();
            expect(entity.components).toEqual({});
        });
    });

    describe('addComponent', () => {
        it('adds a component by name and sets entity reference', () => {
            const comp = { name: 'TestComp', init: jest.fn() };
            entity.addComponent(comp);

            expect(entity.components['TestComp']).toBe(comp);
            expect(comp.entity).toBe(entity);
            expect(comp.init).toHaveBeenCalled();
        });

        it('works without init method on component', () => {
            const comp = { name: 'NoInit' };
            entity.addComponent(comp);
            expect(entity.components['NoInit']).toBe(comp);
            expect(comp.entity).toBe(entity);
        });
    });

    describe('getComponent', () => {
        it('returns the component by name', () => {
            const comp = { name: 'Foo' };
            entity.addComponent(comp);
            expect(entity.getComponent('Foo')).toBe(comp);
        });

        it('returns undefined for non-existent component', () => {
            expect(entity.getComponent('Missing')).toBeUndefined();
        });
    });

    describe('hasComponent', () => {
        it('returns true when component exists', () => {
            entity.addComponent({ name: 'Exists' });
            expect(entity.hasComponent('Exists')).toBe(true);
        });

        it('returns false when component does not exist', () => {
            expect(entity.hasComponent('Nope')).toBe(false);
        });
    });

    describe('removeComponent', () => {
        it('removes component and calls destroy', () => {
            const comp = { name: 'Removable', destroy: jest.fn() };
            entity.addComponent(comp);
            entity.removeComponent('Removable');

            expect(entity.components['Removable']).toBeUndefined();
            expect(comp.destroy).toHaveBeenCalled();
        });

        it('handles removal of non-existent component gracefully', () => {
            expect(() => entity.removeComponent('Ghost')).not.toThrow();
        });
    });

    describe('update', () => {
        it('updates position based on velocity and delta time', () => {
            entity.velocity = { x: 100, y: -50 };
            entity.update(0.5);

            expect(entity.x).toBe(60); // 10 + 100*0.5
            expect(entity.y).toBe(-5); // 20 + (-50)*0.5
        });

        it('calls update on all components', () => {
            const comp1 = { name: 'A', update: jest.fn() };
            const comp2 = { name: 'B', update: jest.fn() };
            entity.addComponent(comp1);
            entity.addComponent(comp2);

            entity.update(0.016);

            expect(comp1.update).toHaveBeenCalledWith(0.016);
            expect(comp2.update).toHaveBeenCalledWith(0.016);
        });
    });

    describe('render', () => {
        it('does not render when invisible', () => {
            const comp = { name: 'Visual', render: jest.fn() };
            entity.addComponent(comp);
            entity.visible = false;

            entity.render({});
            expect(comp.render).not.toHaveBeenCalled();
        });

        it('renders all components when visible', () => {
            const comp = { name: 'Visual', render: jest.fn() };
            entity.addComponent(comp);

            const ctx = {};
            entity.render(ctx);
            expect(comp.render).toHaveBeenCalledWith(ctx);
        });
    });

    describe('position helpers', () => {
        it('getCenterX returns center x coordinate', () => {
            expect(entity.getCenterX()).toBe(26); // 10 + 32/2
        });

        it('getCenterY returns center y coordinate', () => {
            expect(entity.getCenterY()).toBe(36); // 20 + 32/2
        });

        it('setPosition sets x and y', () => {
            entity.setPosition(100, 200);
            expect(entity.x).toBe(100);
            expect(entity.y).toBe(200);
        });

        it('move adds delta to position', () => {
            entity.move(5, -3);
            expect(entity.x).toBe(15);
            expect(entity.y).toBe(17);
        });
    });

    describe('distanceTo', () => {
        it('calculates distance between two entities', () => {
            const other = new Entity(10, 20, 32, 32);
            expect(entity.distanceTo(other)).toBe(0);
        });

        it('calculates non-zero distance', () => {
            const other = new Entity(42, 20, 32, 32);
            // centers: entity (26, 36), other (58, 36)
            expect(entity.distanceTo(other)).toBe(32);
        });
    });

    describe('intersects', () => {
        it('returns true for overlapping entities', () => {
            const other = new Entity(20, 30, 32, 32);
            expect(entity.intersects(other)).toBe(true);
        });

        it('returns false for non-overlapping entities', () => {
            const other = new Entity(100, 100, 32, 32);
            expect(entity.intersects(other)).toBe(false);
        });

        it('returns false for entities touching at edge', () => {
            const other = new Entity(42, 20, 32, 32); // x starts at entity.x + width
            expect(entity.intersects(other)).toBe(false);
        });
    });

    describe('destroy', () => {
        it('sets alive to false and calls destroy on components', () => {
            const comp = { name: 'Comp', destroy: jest.fn() };
            entity.addComponent(comp);

            entity.destroy();

            expect(entity.alive).toBe(false);
            expect(comp.destroy).toHaveBeenCalled();
        });

        it('calls engine.removeEntity if engine is set', () => {
            const mockEngine = { removeEntity: jest.fn() };
            entity.engine = mockEngine;

            entity.destroy();

            expect(mockEngine.removeEntity).toHaveBeenCalledWith(entity);
        });
    });
});
