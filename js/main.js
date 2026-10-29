import { gameState } from "./state.js";
import { setupMenu } from "./menu.js";
import {
    setupPlayerMovement,
    setPlayerPosition
} from "./player.js";
import { setupGame, startRoom } from "./game.js";

console.log("main.js carregado");

function startGame(character) {
    const characterName =
        character === "rabbit" ? "coelho" : "raposa";

    document.querySelector("#room-description").textContent =
        `Você escolheu o ${characterName}. ` +
        (character === "rabbit"
            ? "Sua jornada começa à direita."
            : "Sua jornada começa à esquerda.");

    const player = document.querySelector("#player");

    player.className = `player ${character}`;

    setPlayerPosition(character);

    const door = document.querySelector("#door");

    door.style.left = character === "rabbit" ? "2%" : "auto";
    door.style.right = character === "rabbit" ? "auto" : "2%";

    startRoom();
    showScreen("game-screen");
}

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
        screen.hidden = screen.id !== screenId;
    });

    gameState.currentScreen = screenId;
}


function restartGame() {
    gameState.selectedCharacter = null;
    gameState.puzzleSolved = false;

    showScreen("character-selection");
}

document.addEventListener("DOMContentLoaded", () => {
    setupMenu(startGame);
    setupPlayerMovement();
    setupGame(() => {
    showScreen("ending-screen");
});
    document
        .querySelector("#restart-button")
        .addEventListener("click", restartGame);

    showScreen("character-selection");
});