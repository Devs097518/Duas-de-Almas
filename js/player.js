import { updateGame } from "./game.js";

const SPEED = 0.6; // Altere este valor se quiser ele mais rápido ou devagar
const MIN_X = 7;
const MAX_X = 93;
const MIN_Y = 10;
const MAX_Y = 90;

let x = 15;
let y = 50;

// Objeto para guardar quais teclas estão pressionadas agora
const keys = {
    w: false, a: false, s: false, d: false,
    arrowup: false, arrowdown: false, arrowleft: false, arrowright: false
};

function renderPlayer() {
    const player = document.querySelector("#player");
    player.style.left = `${x}%`;
    player.style.top = `${y}%`;
    updateGame();
}

export function setPlayerPosition(character) {
    x = character === "rabbit" ? 85 : 15;
    y = 50;

    const playerElement = document.querySelector("#player");
    playerElement.classList.remove("rabbit", "fox", "walking");
    playerElement.classList.add(character);
    
    // Usamos uma variável CSS para virar o personagem sem quebrar a animação
    playerElement.style.setProperty('--flip', 1);

    renderPlayer();
}

export function setupPlayerMovement() {
    // 1. Apenas registra quando a tecla é apertada e solta
    window.addEventListener("keydown", (event) => {
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

    // 2. O Game Loop roda 60 vezes por segundo para mover suavemente
    function gameLoop() {
        const gameScreen = document.querySelector("#game-screen");
        if (gameScreen.hidden) {
            requestAnimationFrame(gameLoop);
            return;
        }

        let dx = 0;
        let dy = 0;

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
            x = Math.max(MIN_X, Math.min(MAX_X, x + dx * SPEED));
            y = Math.max(MIN_Y, Math.min(MAX_Y, y + dy * SPEED));

            // Vira o personagem para esquerda ou direita
            if (dx > 0) playerElement.style.setProperty('--flip', 1);
            if (dx < 0) playerElement.style.setProperty('--flip', -1);

            // Adiciona a classe de andar (ativa a animação do CSS)
            playerElement.classList.add("walking");
            
            renderPlayer();
        } else {
            // Se soltou todas as teclas, para a animação
            playerElement.classList.remove("walking");
        }

        requestAnimationFrame(gameLoop);
    }

    // Inicia o loop
    requestAnimationFrame(gameLoop);
}