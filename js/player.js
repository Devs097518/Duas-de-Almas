import { updateGame } from "./game.js";
import { collidesWithObstacle } from "./obstacles.js";
import { getCurrentRoom } from "./rooms.js";
import { toggleClimbAt, getClimbBounds, resetClimb } from "./climb.js";


const SPEED = 0.3; // Altere este valor se quiser ele mais rápido ou devagar
const RUN_MULTIPLIER = 1.7; // quanto mais rápido ao correr (ajuste a gosto)
const MIN_X = 7;
const MAX_X = 93;
const MIN_Y = 10;
const MAX_Y = 90;

let x = 15;
let y = 50;

let movementLocked = false;

function toggleClimb() {
    const result = toggleClimbAt(x, y);
    if (!result) return;

    x = result.x;
    y = result.y;
    document.querySelector("#player").classList.toggle("elevated", result.elevated);
    renderPlayer();
}

export function setMovementLocked(locked) {
    movementLocked = locked;
    if (locked) Object.keys(keys).forEach((k) => (keys[k] = false));
}

// Objeto para guardar quais teclas estão pressionadas agora
const keys = {
    w: false, a: false, s: false, d: false,
    arrowup: false, arrowdown: false, arrowleft: false, arrowright: false,
    shift: false
};

function renderPlayer() {
    const player = document.querySelector("#player");
    player.style.left = `${x}%`;
    player.style.top = `${y}%`;
    updateGame(x, y);
}

export function setPlayerPosition(character) {
    const { start } = getCurrentRoom();
    x = start.x;
    y = start.y;

    const playerElement = document.querySelector("#player");
    resetClimb();
    playerElement.classList.remove("rabbit", "fox", "walking", "running", "elevated");
    playerElement.classList.add(character);

    // Usamos uma variável CSS para virar o personagem sem quebrar a animação
    playerElement.style.setProperty('--flip', 1);

    renderPlayer();
}

export function setupPlayerMovement() {
    // 1. Apenas registra quando a tecla é apertada e solta
    window.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            if (!document.querySelector("#game-screen").hidden) {
                event.preventDefault();
                if (!event.repeat && !movementLocked) toggleClimb();
            }
            return;
        }

        const key = event.key.toLowerCase();
        if (keys.hasOwnProperty(key)) {
            keys[key] = true;
            event.preventDefault();
        }
    });

    window.addEventListener("keyup", (event) => {
        const key = event.key.toLowerCase();
        if (keys.hasOwnProperty(key)) {
            keys[key] = false;
            event.preventDefault();
        }
    });

    window.addEventListener("blur", () => {
        Object.keys(keys).forEach((k) => (keys[k] = false));
    });

    // 2. O Game Loop roda 60 vezes por segundo para mover suavemente
    function gameLoop() {
        const gameScreen = document.querySelector("#game-screen");
        if (gameScreen.hidden || movementLocked) {
            requestAnimationFrame(gameLoop);
            return;
        }

        let dx = 0;
        let dy = 0;

        const currentSpeed = SPEED * (keys.shift ? RUN_MULTIPLIER : 1);
        const room = document.querySelector("#room");
        const aspect = room.clientWidth / room.clientHeight;

        // Calcula a direção baseada nas teclas
        if (keys.w || keys.arrowup) dy -= 1;
        if (keys.s || keys.arrowdown) dy += 1;
        if (keys.a || keys.arrowleft) dx -= 1;
        if (keys.d || keys.arrowright) dx += 1;

        const playerElement = document.querySelector("#player");

        if (dx !== 0 || dy !== 0) {
            // Normalização da diagonal (para não andar mais rápido na diagonal)
            if (dx !== 0 && dy !== 0) {
                const diagonalFactor = Math.SQRT1_2; // Aproximadamente 0.707
                dx *= diagonalFactor;
                dy *= diagonalFactor;
            }

            // Atualiza posição
            // Testa X e Y separadamente: assim o personagem desliza pelos móveis em vez de travar
            const nextX = Math.max(MIN_X, Math.min(MAX_X, x + dx * currentSpeed));
            if (!collidesWithObstacle(nextX, y)) x = nextX;

            const bounds = getClimbBounds();
            const nextY = Math.max(MIN_Y, Math.min(MAX_Y, y + dy * currentSpeed * aspect));
            if (bounds) {
                x = Math.max(bounds.minX, Math.min(bounds.maxX, x));
                y = Math.max(bounds.minY, Math.min(bounds.maxY, nextY));
            } else if (!collidesWithObstacle(x, nextY)) {
                y = nextY;
            }

            // Vira o personagem para esquerda ou direita
            if (dx > 0) playerElement.style.setProperty('--flip', 1);
            if (dx < 0) playerElement.style.setProperty('--flip', -1);

            // Adiciona a classe de andar (ativa a animação do CSS)
            playerElement.classList.add("walking");
            playerElement.classList.toggle("running", keys.shift);
            
            renderPlayer();
        } else {
            // Se soltou todas as teclas, para a animação
            playerElement.classList.remove("walking");
            playerElement.classList.remove("walking", "running");
        }

        requestAnimationFrame(gameLoop);
    }

    // Inicia o loop
    requestAnimationFrame(gameLoop);
}