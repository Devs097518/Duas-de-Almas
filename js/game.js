import { isElevated, canClimbFrom } from "./climb.js";

let tooHighShown = false;
let hintShown = false;

function say(text) {
    if (text) document.querySelector("#room-description").textContent = text;
}

export function startRoom() {
    isExiting = false;
    tooHighShown = false;
    hintShown = false;
    resetPuzzle();
}

export function updateGame(x, y) {
    checkKeyCollision();
    if (isExiting) return;

    const room = getCurrentRoom();

    // Dica de que dá para subir (uma vez a cada aproximação)
    const nearClimb = !isElevated() && canClimbFrom(x, y);
    if (nearClimb && !hintShown) say(room.messages?.climbHint);
    hintShown = nearClimb;

    const player = document.querySelector("#player");
    const door = document.querySelector("#door");
    const touching = isColliding(player, door, 0.25);

    // Saída no alto: só vale para quem está em cima de algo
    if (room.exitRequiresClimb && !isElevated()) {
        if (touching && !tooHighShown) say(room.messages?.tooHigh);
        tooHighShown = touching;
        return;
    }

    if (!canExit()) return;

    if (touching) {
        isExiting = true;
        exitCallback?.();
    }
}

import {
    checkKeyCollision,
    canExit,
    resetPuzzle
} from "./puzzle.js";
import { getCurrentRoom } from "./rooms.js";


export function setupGame(onExit) {
    exitCallback = onExit;
    resetPuzzle();
    document.addEventListener("keydown", handleGameKey);
}

let exitCallback = null;
let isExiting = false;

function handleGameKey(event) {
    const gameScreen = document.querySelector("#game-screen");

    if (gameScreen.hidden) return;

    if (event.key.toLowerCase() !== "e") return;

    if (!canExit()) {
        document.querySelector("#room-description").textContent =
            getCurrentRoom().messages.locked;
    }
}

function isColliding(elementA, elementB, shrink = 0) {
    const a = elementA.getBoundingClientRect();
    const b = elementB.getBoundingClientRect();
    const insetX = a.width * shrink;
    const insetY = a.height * shrink;

    return (
        a.left + insetX < b.right &&
        a.right - insetX > b.left &&
        a.top + insetY < b.bottom &&
        a.bottom - insetY > b.top
    );
}
