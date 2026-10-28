import { updateGame } from "./game.js";

const STEP = 2;
const MIN_X = 7;
const MAX_X = 93;
const MIN_Y = 10;
const MAX_Y = 90;

let x = 15;
let y = 50;

function renderPlayer() {
    const player = document.querySelector("#player");
    
    player.style.left = `${x}%`;
    player.style.top = `${y}%`;

    updateGame();
}

export function setPlayerPosition(character) {
    x = character === "rabbit" ? 85 : 15;
    y = 50;

    renderPlayer();
}

export function setupPlayerMovement() {
    document.addEventListener("keydown", (event) => {
        const gameScreen = document.querySelector("#game-screen");

        if (gameScreen.hidden) return;

        const key = event.key.toLowerCase();

        const movements = {
            arrowup: [0, -STEP],
            w: [0, -STEP],
            arrowdown: [0, STEP],
            s: [0, STEP],
            arrowleft: [-STEP, 0],
            a: [-STEP, 0],
            arrowright: [STEP, 0],
            d: [STEP, 0]
        };

        const movement = movements[key];

        if (!movement) return;

        event.preventDefault();

        x = Math.max(
            MIN_X,
            Math.min(MAX_X, x + movement[0])
        );

        y = Math.max(
            MIN_Y,
            Math.min(MAX_Y, y + movement[1])
        );

        renderPlayer();
    });
}
