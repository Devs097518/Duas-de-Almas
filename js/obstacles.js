// Metade do tamanho da hitbox do jogador (em %). É menor que o sprite de propósito.
export const HIT_HALF_W = 2.5;
export const HIT_HALF_H = 4;

// Obstáculos da sala ativa (vêm de rooms.js)
let currentObstacles = [];

// Áreas ANDÁVEIS da sala (labirinto). Se a sala tiver "paths", o jogador só pode
// andar dentro deles: tudo que está fora colide.
let currentPaths = [];

export function getObstacles() {
    return currentObstacles;
}

function createBox(className, rect) {
    const el = document.createElement("div");
    el.className = className;
    el.style.left = `${rect.x}%`;
    el.style.top = `${rect.y}%`;
    el.style.width = `${rect.w}%`;
    el.style.height = `${rect.h}%`;
    return el;
}

export function renderObstacles(obstacles, paths = []) {
    currentObstacles = obstacles;
    currentPaths = paths;

    const room = document.querySelector("#room");
    room.querySelectorAll(".obstacle, .maze-path").forEach((el) => el.remove());

    // Caminhos (ficam por baixo de tudo)
    paths.forEach((p) => {
        room.appendChild(createBox("maze-path", p));
    });

    obstacles.forEach((o) => {
        const el = createBox(`obstacle ${o.tipo}`, o);
        el.dataset.label = o.tipo;
        room.appendChild(el);
    });
}

function insidePath(px, py) {
    return currentPaths.some(
        (p) => px >= p.x && px <= p.x + p.w && py >= p.y && py <= p.y + p.h
    );
}

// A hitbox inteira está coberta pela união dos caminhos? (teste exato)
// Corta a hitbox nas bordas dos caminhos e confere o centro de cada pedaço.
function coveredByPaths(left, right, top, bottom) {
    const xs = [left, right];
    const ys = [top, bottom];

    currentPaths.forEach((p) => {
        [p.x, p.x + p.w].forEach((v) => { if (v > left && v < right) xs.push(v); });
        [p.y, p.y + p.h].forEach((v) => { if (v > top && v < bottom) ys.push(v); });
    });

    xs.sort((a, b) => a - b);
    ys.sort((a, b) => a - b);

    for (let i = 0; i < xs.length - 1; i++) {
        if (xs[i + 1] - xs[i] < 1e-9) continue;

        for (let j = 0; j < ys.length - 1; j++) {
            if (ys[j + 1] - ys[j] < 1e-9) continue;

            const cx = (xs[i] + xs[i + 1]) / 2;
            const cy = (ys[j] + ys[j + 1]) / 2;
            if (!insidePath(cx, cy)) return false;
        }
    }

    return true;
}

// Recebe o centro do jogador (x, y em %) e diz se a hitbox colide com algo.
export function collidesWithObstacle(x, y) {
    const left = x - HIT_HALF_W;
    const right = x + HIT_HALF_W;
    const top = y - HIT_HALF_H;
    const bottom = y + HIT_HALF_H;

    // Em salas com caminhos, sair deles conta como colisão
    if (currentPaths.length > 0 && !coveredByPaths(left, right, top, bottom)) {
        return true;
    }

    return currentObstacles.some((o) =>
        left < o.x + o.w &&
        right > o.x &&
        top < o.y + o.h &&
        bottom > o.y
    );
}