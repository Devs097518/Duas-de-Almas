// Metade do tamanho da hitbox do jogador (em %). É menor que o sprite de propósito.
const HIT_HALF_W = 2.5;
const HIT_HALF_H = 4;

// Obstáculos da sala que está ativa (vêm de rooms.js)
let currentObstacles = [];

export function renderObstacles(obstacles) {
    currentObstacles = obstacles;

    const room = document.querySelector("#room");
    room.querySelectorAll(".obstacle").forEach((el) => el.remove());

    obstacles.forEach((o) => {
        const el = document.createElement("div");
        el.className = `obstacle ${o.tipo}`;
        el.dataset.label = o.tipo;
        el.style.left = `${o.x}%`;
        el.style.top = `${o.y}%`;
        el.style.width = `${o.w}%`;
        el.style.height = `${o.h}%`;
        room.appendChild(el);
    });
}

// Recebe o centro do jogador (x, y em %) e diz se a hitbox bate em algum obstáculo.
export function collidesWithObstacle(x, y) {
    const left = x - HIT_HALF_W;
    const right = x + HIT_HALF_W;
    const top = y - HIT_HALF_H;
    const bottom = y + HIT_HALF_H;

    return currentObstacles.some((o) =>
        left < o.x + o.w &&
        right > o.x &&
        top < o.y + o.h &&
        bottom > o.y
    );
}