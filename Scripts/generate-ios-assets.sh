#!/usr/bin/env bash
# 生成 Cordova 所需的占位图标与启动图（金色圆底）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG_DIR="${ROOT}/ios-app/www/img"
mkdir -p "${IMG_DIR}"

export IMG_DIR
python3 <<'PY'
import os, struct, zlib
from pathlib import Path

def png_rgb(w, h, r, g, b):
    raw = b""
    for y in range(h):
        raw += b"\x00"
        for x in range(w):
            cx, cy = x - w / 2, y - h / 2
            dist = (cx * cx + cy * cy) ** 0.5
            radius = min(w, h) * 0.42
            if dist <= radius:
                raw += bytes((min(255, r + 40), min(255, g + 30), b))
            else:
                raw += bytes((10, 10, 12))
    comp = zlib.compress(raw, 9)

    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", comp)
        + chunk(b"IEND", b"")
    )

out = Path(os.environ["IMG_DIR"])
icon_sizes = {
    "icon-57.png": 57,
    "icon-58.png": 58,
    "icon-72.png": 72,
    "icon-80.png": 80,
    "icon-87.png": 87,
    "icon-120.png": 120,
    "icon-180.png": 180,
}

for name, size in icon_sizes.items():
    (out / name).write_bytes(png_rgb(size, size, 180, 140, 20))
    print("wrote", name)

def png_solid(w, h, r, g, b):
    raw = b"".join(b"\x00" + bytes((r, g, b)) * w for _ in range(h))
    comp = zlib.compress(raw, 1)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", comp)
        + chunk(b"IEND", b"")
    )

splash_sizes = {
    "splash-1536x2048.png": (1536, 2048),
    "splash-1668x2388.png": (1668, 2388),
    "splash-2436x2436.png": (2436, 2436),
    "splash-2732x2732.png": (2732, 2732),
}

for name, (w, h) in splash_sizes.items():
    (out / name).write_bytes(png_solid(w, h, 12, 12, 14))
    print("wrote", name)
PY

echo "图标已生成: ${IMG_DIR}"
