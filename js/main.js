import { gameState } from "./state.js";
import { setupMenu } from "./menu.js";
import {
    setupPlayerMovement,
    setPlayerPosition
} from "./player.js";
import { setupGame, startRoom } from "./game.js";
import { ROOMS, setCurrentRoom, getTotalPhases } from "./rooms.js";
import { renderObstacles } from "./obstacles.js";
import { startEnemies } from "./enemies.js";


function startGame(character) {
    const room = ROOMS[character][gameState.currentPhase - 1];
    setCurrentRoom(room);

    document.querySelector("#room-description").textContent = room.intro;
    document.querySelector(".room-header h2").textContent = room.title; 
    document.querySelector("#room").dataset.theme = room.theme;
    document.querySelector("#phase-counter").textContent =
    `${gameState.currentPhase}/${getTotalPhases(character)}`;

    renderObstacles(room.obstacles);

    const key = document.querySelector("#key");
    key.removeAttribute("style");
    if (room.key) {
        key.style.left = `${room.key.x}%`;
        key.style.top = `${room.key.y}%`;
    }

    const door = document.querySelector("#door");
    door.removeAttribute("style");
    Object.assign(door.style, room.exit);

    const player = document.querySelector("#player");
    player.className = `player ${character}`;
    setPlayerPosition(character);

    startRoom();
    startEnemies(room.enemies, {
        onHit: () => startGame(character),
        isPaused: () => isTransitioning
    });
    showScreen("game-screen");
}

console.log("main.js carregado");

// Posição do duto por personagem. Para canto inferior: top: "auto" e bottom: "5%"
const EXITS = {
    rabbit: { left: "auto", right: "2%",   top: "85%", bottom: "auto" }, 
    fox:    { left: "auto", right: "3%",   top: "5%", bottom: "auto" }  // sup. direito
};


const FADE_MS = 500;
let isTransitioning = false;

function showScreen(screenId, { fade = true } = {}) {
    const swap = () => {
        document.querySelectorAll(".screen").forEach((screen) => {
            screen.hidden = screen.id !== screenId;
        });
        gameState.currentScreen = screenId;
    };

    // Sem transição (usado na primeira tela)
    if (!fade) {
        swap();
        return;
    }

    if (isTransitioning) return;
    isTransitioning = true;

    const overlay = document.querySelector("#fade-overlay");

    overlay.classList.add("active");          // escurece

    setTimeout(() => {
        swap();                               // troca a tela no escuro
        overlay.classList.remove("active");   // clareia

        setTimeout(() => {
            isTransitioning = false;
        }, FADE_MS);
    }, FADE_MS);
}


function restartGame() {
    gameState.selectedCharacter = null;
    gameState.puzzleSolved = false;
    gameState.currentPhase = 1;

    showScreen("character-selection");
}

document.addEventListener("DOMContentLoaded", () => {
    setupMenu((character) => {
        gameState.currentPhase = 1;
        startGame(character);
    });
    setupPlayerMovement();
    setupGame(() => {
        const character = gameState.selectedCharacter;

        if (gameState.currentPhase < getTotalPhases(character)) {
            gameState.currentPhase += 1;
            startGame(character);
            return;
        }

        showScreen("ending-screen");
    });
    document
        .querySelector("#restart-button")
        .addEventListener("click", restartGame);

    showScreen("character-selection", { fade: false });
});