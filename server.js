const http = require('http');
const fs = require('fs');
const path = require('path');

const ALLOWED_EXTENSIONS = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
};

const ROOT_DIR = path.resolve(__dirname);

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let requestedPath = decodeURIComponent(parsedUrl.pathname);
    if (requestedPath === '/') requestedPath = '/index.html';

    const filePath = path.resolve(ROOT_DIR, '.' + requestedPath);
    if (!filePath.startsWith(ROOT_DIR + path.sep) && filePath !== ROOT_DIR) {
        res.writeHead(403, SECURITY_HEADERS);
        res.end('Forbidden');
        return;
    }

    const extname = path.extname(filePath).toLowerCase();
    const contentType = ALLOWED_EXTENSIONS[extname];
    if (!contentType) {
        res.writeHead(403, SECURITY_HEADERS);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404, SECURITY_HEADERS);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType, ...SECURITY_HEADERS });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});