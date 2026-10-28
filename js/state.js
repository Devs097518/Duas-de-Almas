export const gameState = {
    selectedCharacter: null,
    currentScreen: "selection",
    puzzleSolved: false
};

export function selectCharacter(character) {
    if (character !== "rabbit" && character !== "fox") {
        throw new Error("Personagem inválido.");
    }

    gameState.selectedCharacter = character;
}
