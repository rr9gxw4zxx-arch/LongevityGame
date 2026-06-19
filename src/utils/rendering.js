/**
 * Shared canvas rendering helpers.
 */

export function hpColor(hpPercent) {
    if (hpPercent > 0.5) return '#00ff00';
    if (hpPercent > 0.25) return '#ffff00';
    return '#ff0000';
}

export function drawHealthBar(ctx, x, y, width, height, hpPercent) {
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = hpColor(hpPercent);
    ctx.fillRect(x, y, width * hpPercent, height);
}

export function drawOutlinedText(ctx, text, x, y, { font = '12px SimHei', fillStyle = '#ffffff', strokeStyle = '#000', lineWidth = 2, textAlign = 'center' } = {}) {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.textAlign = textAlign;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
}
