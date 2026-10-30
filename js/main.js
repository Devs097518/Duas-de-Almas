import { gameState } from "./state.js";
import { setupMenu } from "./menu.js";
import {
    setupPlayerMovement,
    setPlayerPosition
} from "./player.js";
import { setupGame, startRoom } from "./game.js";

console.log("main.js carregado");

// Posição do duto por personagem. Para canto inferior: top: "auto" e bottom: "5%"
const EXITS = {
    rabbit: { left: "auto", right: "2%",   top: "85%", bottom: "auto" }, 
    fox:    { left: "auto", right: "3%",   top: "5%", bottom: "auto" }  // sup. direito
};

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

    Object.assign(door.style, EXITS[character]);

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