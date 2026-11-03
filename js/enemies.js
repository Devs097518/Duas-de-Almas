// Inimigos que patrulham na vertical, todos em sincronia (um "relógio" só para todos).
// Quem começa em "top" desce primeiro; quem começa em "bottom" sobe primeiro.
// Medidas em % da sala.

const PLAYER_SHRINK = 0.25; // quanto do sprite do jogador NÃO conta na colisão
const ENEMY_SHRINK = 0.15;  // idem para o inimigo (deixa o jogo mais justo)

let list = [];       // [{ el, def }]
let config = null;   // { speed, minY, maxY, w, h, list }
let elapsed = 0;     // segundos de jogo desde o início da sala
let lastTime = null;
let active = false;
let rafId = null;
let hooks = { onHit: () => {}, isPaused: () => false };

// enemies: o bloco "enemies" da sala (ou undefined, se a sala não tiver inimigos)
// newHooks.onHit: o que fazer quando um inimigo encosta no jogador
// newHooks.isPaused: devolve true durante as transições (congela os inimigos)
export function startEnemies(enemies, newHooks = {}) {
    stopEnemies();
    if (!enemies) return;

    hooks = { ...hooks, ...newHooks };
    config = enemies;
    elapsed = 0;
    lastTime = null;
    active = true;

    const room = document.querySelector("#room");

    list = enemies.list.map((def) => {
        const el = document.createElement("div");
        el.className = `enemy ${def.tipo}`;
        el.dataset.label = def.tipo;
        el.style.left = `${def.x}%`;
        el.style.width = `${enemies.w}%`;
        room.appendChild(el);
        return { el, def };
    });

    placeEnemies();
    rafId = requestAnimationFrame(loop);
}

export function stopEnemies() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    active = false;
    list = [];
    config = null;
    document.querySelectorAll("#room .enemy").forEach((el) => el.remove());
}

// Posição vertical (em %) de um inimigo no instante atual
function currentY(def) {
    const range = config.maxY - config.minY;
    const cycle = (elapsed * config.speed) / range; // 1 = uma ida completa
    const phase = cycle % 2;
    const t = phase < 1 ? phase : 2 - phase;        // 0 → 1 → 0 (vai e volta)

    return def.from === "top"
        ? config.minY + t * range
        : config.maxY - t * range;
}

function placeEnemies() {
    list.forEach(({ el, def }) => {
        el.style.top = `${currentY(def)}%`;
    });
}

function loop(now) {
    if (!active) return;

    // limita o salto de tempo (ex.: ao voltar de outra aba)
    const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const gameScreen = document.querySelector("#game-screen");

    if (!gameScreen.hidden && !hooks.isPaused()) {
        elapsed += dt;
        placeEnemies();

        if (hitsPlayer()) {
            active = false;   // congela os inimigos na posição da batida
            hooks.onHit();
            return;
        }
    }

    rafId = requestAnimationFrame(loop);
}

function hitsPlayer() {
    const player = shrink(
        document.querySelector("#player").getBoundingClientRect(),
        PLAYER_SHRINK
    );

    return list.some(({ el }) =>
        overlaps(player, shrink(el.getBoundingClientRect(), ENEMY_SHRINK))
    );
}

function shrink(rect, amount) {
    const dx = rect.width * amount;
    const dy = rect.height * amount;

    return {
        left: rect.left + dx,
        right: rect.right - dx,
        top: rect.top + dy,
        bottom: rect.bottom - dy
    };
}

function overlaps(a, b) {
    return (
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    );
}