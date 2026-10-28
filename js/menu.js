import { selectCharacter } from "./state.js";

export function setupMenu(onCharacterSelected) {
    const buttons = document.querySelectorAll("[data-character]");

    console.log("Botões encontrados:", buttons.length);

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const character = button.dataset.character;

            console.log("Clicou em:", character);

            selectCharacter(character);
            onCharacterSelected(character);
        });
    });
}