import { getCurrentRoom } from "./rooms.js";


let hasKey = false;

export function resetPuzzle() {
    hasKey = false;

    const key = document.querySelector("#key");
    const door = document.querySelector("#door");

    key.hidden = false;
    door.classList.remove("unlocked");
}

export function checkKeyCollision() {
    if (hasKey) return;

    const player = document.querySelector("#player");
    const key = document.querySelector("#key");

    if (key.hidden) return;

    if (isColliding(player, key)) {
        hasKey = true;
        key.hidden = true;

        document.querySelector("#room-description").textContent =
            "Você encontrou a chave de fenda! Agora pode abrir o duto.";

        document.querySelector("#door").classList.add("unlocked");
        document.querySelector("#room-description").textContent =
    getCurrentRoom().messages.found;
    }
}

export function canExit() {
    return hasKey;
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
