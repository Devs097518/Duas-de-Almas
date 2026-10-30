// Obstáculos da sala. Todas as medidas são em % da sala (igual ao x/y do player).
// x, y = canto superior esquerdo | w, h = largura e altura
// Mantenha livres: a chave (centro, 50/50), a porta (direita, ~90-98 / 37-63)
// e os pontos de início (coelho 85/50, raposa 15/50).
export const OBSTACLES = [
    { tipo: "bancada",  x: 18, y: 5,  w: 25, h: 30 }, // bancada com gaiolas
    { tipo: "estante",  x: 66, y: 5,  w: 15, h: 28 },
    { tipo: "mesa",     x: 27, y: 50, w: 23, h: 35 }, // mesa de laboratório
    { tipo: "caixote",  x: 8,  y: 70, w: 8,  h: 16 },
    { tipo: "caixote",  x: 70, y: 70, w: 8,  h: 16 },
    { tipo: "caixote",  x: 70, y: 34, w: 8,  h: 16 }, // atrapalha o caminho da raposa
    { tipo: "caixote",  x: 64, y: 65, w: 8,  h: 16 }  // atrapalha o caminho do coelho
];

// Metade do tamanho da hitbox do jogador (em %). É menor que o sprite de propósito.
const HIT_HALF_W = 2.5;
const HIT_HALF_H = 4;

export function renderObstacles() {
    const room = document.querySelector("#room");
    room.querySelectorAll(".obstacle").forEach((el) => el.remove());

    OBSTACLES.forEach((o) => {
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

    return OBSTACLES.some((o) =>
        left < o.x + o.w &&
        right > o.x &&
        top < o.y + o.h &&
        bottom > o.y
    );
}