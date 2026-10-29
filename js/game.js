
import {
    checkKeyCollision,
    canExit,
    resetPuzzle
} from "./puzzle.js";
import { renderObstacles } from "./obstacles.js";

export function setupGame(onExit) {
    exitCallback = onExit;
    resetPuzzle();
    renderObstacles(); // <- novo
    document.addEventListener("keydown", handleGameKey);
}

let exitCallback = null;
let isExiting = false;


export function startRoom() {
    isExiting = false;
    resetPuzzle();
}

export function updateGame() {
    checkKeyCollision();

    if (isExiting || !canExit()) return;

    const player = document.querySelector("#player");
    const door = document.querySelector("#door");

    if (isColliding(player, door)) {
        isExiting = true;
        exitCallback?.();
    }
}

function handleGameKey(event) {
    const gameScreen = document.querySelector("#game-screen");

    if (gameScreen.hidden) return;

    if (event.key.toLowerCase() !== "e") return;

    if (!canExit()) {
        document.querySelector("#room-description").textContent =
            "A saída está trancada. Encontre a chave primeiro.";
    }
}

function isColliding(elementA, elementB) {
    const a = elementA.getBoundingClientRect();
    const b = elementB.getBoundingClientRect();

    return (
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    );
}
