/**
 * Shared vector/math utilities.
 */

export function magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
}

export function normalize(x, y) {
    const len = magnitude(x, y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: x / len, y: y / len };
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}
