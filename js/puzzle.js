
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
            "Você encontrou a chave! Agora pode abrir a saída.";

        document.querySelector("#door").classList.add("unlocked");
    }
}

export function canExit() {
    return hasKey;
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
