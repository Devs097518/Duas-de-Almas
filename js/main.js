import { gameState } from "./state.js";
import { setupMenu } from "./menu.js";
import {
    setupPlayerMovement,
    setPlayerPosition,
    setMovementLocked
} from "./player.js";
import { setupGame, startRoom } from "./game.js";
import { ROOMS, setCurrentRoom, getTotalPhases } from "./rooms.js";
import { renderObstacles } from "./obstacles.js";
import { startEnemies } from "./enemies.js";
import { STORIES } from "./story.js";

console.log("main.js carregado");

// ===== Transições =====
const FADE_MS = 500; // se mudar aqui, mude o transition do #fade-overlay no CSS
let isTransitioning = false;

// Escurece a tela, executa a troca no escuro e clareia de novo
function fadeThrough(onDark) {
    if (isTransitioning) return;
    isTransitioning = true;
    setMovementLocked(true);

    const overlay = document.querySelector("#fade-overlay");
    overlay.classList.add("active");          // escurece

    setTimeout(() => {
        onDark();                             // troca no escuro
        overlay.classList.remove("active");   // clareia

        setTimeout(() => {
            isTransitioning = false;
            setMovementLocked(false);
        }, FADE_MS);
    }, FADE_MS);
}

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

    fadeThrough(swap);
}

// ===== Gameplay =====

// Monta a sala da fase indicada (1, 2, 3...) do caminho do personagem.
// Não troca de tela: quem chama decide se isso acontece no escuro (fadeThrough) ou não.
function loadPhase(character, phase) {
    const room = ROOMS[character][phase - 1];
    setCurrentRoom(room);

    document.querySelector("#room-description").textContent = room.intro;
    document.querySelector(".room-header h2").textContent = room.title;
    document.querySelector("#room").dataset.theme = room.theme;
    document.querySelector("#phase-counter").textContent =
        `${phase}/${getTotalPhases(character)}`;

    renderObstacles(room.obstacles, room.paths);

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
        // bateu num rato: refaz a mesma sala, com o mesmo fade
        onHit: () => fadeThrough(() => loadPhase(character, phase)),
        isPaused: () => isTransitioning
    });
}

// Começa o jogo (fase 1) depois da história
function startGameplay(character) {
    gameState.currentPhase = 1;
    loadPhase(character, gameState.currentPhase);
    showScreen("game-screen");
}

// Chamado quando o jogador entra no duto
function handleRoomExit() {
    const character = gameState.selectedCharacter;

    if (gameState.currentPhase < getTotalPhases(character)) {
        gameState.currentPhase += 1;
        fadeThrough(() => loadPhase(character, gameState.currentPhase));
    } else {
        showScreen("ending-screen");
    }
}

// ===== História em quadrinhos =====
let storyIndex = 0;

function renderScene(character, index) {
    const scene = STORIES[character][index];
    const image = document.querySelector("#story-image");

    image.src = scene.image;
    image.alt = scene.alt ?? "";
    document.querySelector("#story-text").textContent = scene.text;
}

// Carrega todas as imagens de antemão, para não piscar ao trocar de cena
function preloadStory(character) {
    STORIES[character].forEach((scene) => {
        new Image().src = scene.image;
    });
}

// Chamada quando o jogador escolhe o personagem no menu
function startStory(character) {
    storyIndex = 0;
    preloadStory(character);
    renderScene(character, storyIndex);
    showScreen("story-screen");
}

function advanceStory() {
    const character = gameState.selectedCharacter;

    if (storyIndex < STORIES[character].length - 1) {
        storyIndex += 1;
        fadeThrough(() => renderScene(character, storyIndex));
    } else {
        startGameplay(character); // acabou a história: fade e começa o jogo
    }
}

function handleStoryKey(event) {
    if (gameState.currentScreen !== "story-screen") return;
    if (isTransitioning) return;                                   // ignora teclas durante o fade
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (/^F\d+$/.test(event.key)) return;                          // F5, F12...

    // evita que Espaço e setas rolem a página
    if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }

    advanceStory();
}

// ===== Reinício =====
function restartGame() {
    gameState.selectedCharacter = null;
    gameState.puzzleSolved = false;
    gameState.currentPhase = 1;

    showScreen("character-selection");
}

document.addEventListener("DOMContentLoaded", () => {
    setupMenu(startStory);
    setupPlayerMovement();
    setupGame(handleRoomExit);

    window.addEventListener("keydown", handleStoryKey);

    document
        .querySelector("#restart-button")
        .addEventListener("click", restartGame);

    showScreen("character-selection", { fade: false });
});