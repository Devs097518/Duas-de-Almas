// Salas de cada personagem. Cada personagem tem uma LISTA de fases (uma sala por item).
// Para criar outra fase, acrescente outro objeto na lista do personagem.
// Medidas em % da sala. Obstáculos: x, y = canto superior esquerdo | w, h = tamanho.
// Mantenha livres: a chave, a saída e o ponto de início.

export const ROOMS = {
    rabbit: [
        {
            theme: "lab", // vira data-theme="lab" no #room (ver CSS)
            title: "A sala do enigma",
            intro: "Onde eu estou? Preciso encontrar uma saída ...",
            messages: {
                found: "Achei a chave de fenda! Agora posso abrir o duto.",
                locked: "O duto está trancado. Preciso encontrar uma chave de fenda para abri-lo ..."
            },
            start: { x: 85, y: 50 },
            key:   { x: 10, y: 10 },
            exit:  { left: "90%", right: "auto", top: "85%", bottom: "auto" }, // canto inf. direito
            obstacles: [
                { tipo: "bancada", x: 18, y: 5,  w: 25, h: 27 }, // bancada com gaiolas
                { tipo: "estante", x: 66, y: 5,  w: 15, h: 28 },
                { tipo: "mesa",    x: 27, y: 50, w: 23, h: 33 }, // mesa de laboratório
                { tipo: "caixote", x: 8,  y: 70, w: 7,  h: 16 },
                { tipo: "caixote", x: 70, y: 70, w: 7,  h: 16 },
                { tipo: "caixote", x: 70, y: 34, w: 7,  h: 16 },
                { tipo: "caixote", x: 90, y: 70, w: 7,  h: 16 }
            ]
        },
        {
            theme: "esgoto",
            title: "A Encanação",
            intro: "Vejo uma luz no fim do túnel. Mas espera... Ratazanas?!",
            start: { x: 85, y: 50 },
            key: null, // sem chave nesta sala: a saída já nasce aberta
            exit: { left: "0%", right: "auto", top: "37%", bottom: "auto", width: "10%", height: "25%" }, // cano
            obstacles: [
                { tipo: "duto-entrada", x: 91, y: 40, w: 2, h: 20 } // de onde o coelho veio
            ],
            enemies: {
                speed: 40,         // % da altura da sala por segundo (maior = mais rápido)
                minY: 10, maxY: 90,
                w: 9,              // largura de cada rato, em % da sala
                list: [
                    { tipo: "rato", x: 21, from: "bottom" }, // sobe
                    { tipo: "rato", x: 34, from: "top" },    // desce
                    { tipo: "rato", x: 50, from: "bottom" },
                    { tipo: "rato", x: 63, from: "top" },
                    { tipo: "rato", x: 76, from: "bottom" }
                ]
            }
        },
    ],

    // PROVISÓRIO: layout em "S" só para a raposa ter um caminho diferente.
    // Troque tema, textos e os tipos dos obstáculos quando o cenário dela estiver definido.
    fox: [
        {
            theme: "raposa",
            title: "O caminho da raposa",
            intro: "Você escolheu a raposa. Sua jornada começa à esquerda.",
            messages: {
                found: "Você encontrou a chave! Agora pode abrir a saída.",
                locked: "A saída está trancada. Encontre a chave primeiro."
            },
            start: { x: 15, y: 50 },
            key:   { x: 54, y: 78 },
            exit:  { left: "auto", right: "3%", top: "5%", bottom: "auto" }, // canto sup. direito
            obstacles: [
                { tipo: "divisoria", x: 40, y: 0,  w: 6,  h: 62 }, // obriga a descer
                { tipo: "divisoria", x: 62, y: 38, w: 6,  h: 62 }, // obriga a subir
                { tipo: "bloco",     x: 8,  y: 14, w: 10, h: 16 },
                { tipo: "bloco",     x: 76, y: 55, w: 10, h: 18 }
            ]
        }
    ]
};

// Total real de fases do caminho do personagem
export function getTotalPhases(character) {
    return ROOMS[character].length;
}

// Sala atual, para os outros módulos lerem sem passar parâmetros
let currentRoom = ROOMS.rabbit[0];

export function setCurrentRoom(room) {
    currentRoom = room;
}

export function getCurrentRoom() {
    return currentRoom;
}

// // Uma sala por personagem. Tudo que muda de um cenário para o outro fica aqui.
// // Medidas em % da sala. Obstáculos: x, y = canto superior esquerdo | w, h = tamanho.
// // Mantenha livres: a chave, a saída e o ponto de início.

// export const ROOMS = {
//     rabbit: {
//         theme: "lab", // vira data-theme="lab" no #room (ver CSS)
//         title: "A sala do enigma",
//         intro: "Onde eu estou? Preciso encontrar uma saída ...",
//         messages: {
//             found: "Achei a chave de fenda! Agora posso abrir o duto.",
//             locked: "O duto está trancado. Preciso encontrar uma chave de fenda para abri-lo ..."
//         },
//         instructions: "Explore a sala e encontre a chave de fenda para abrir o duto.",
//         start: { x: 85, y: 50 },
//         key:   { x: 10, y: 10 },
//         exit:  { left: "90%", right: "auto", top: "85%", bottom: "auto" }, // canto sup. esquerdo
//         obstacles: [
//             { tipo: "bancada",  x: 18, y: 5,  w: 25, h: 27 }, // bancada com gaiolas
//             { tipo: "estante",  x: 66, y: 5,  w: 15, h: 28 },
//             { tipo: "mesa",     x: 27, y: 50, w: 23, h: 33 }, // mesa de laboratório
//             { tipo: "caixote",  x: 8,  y: 70, w: 7,  h: 16 },
//             { tipo: "caixote",  x: 70, y: 70, w: 7,  h: 16 },
//             { tipo: "caixote",  x: 70, y: 34, w: 7,  h: 16 }, // atrapalha o caminho da raposa
//             { tipo: "caixote",  x: 90, y: 70, w: 7,  h: 16 }  // atrapalha o caminho do coelho
//         ]
//     },

//     // PROVISÓRIO: layout em "S" só para a raposa ter um caminho diferente.
//     // Troque tema, textos e os tipos dos obstáculos quando o cenário dela estiver definido.
//     fox: {
//         theme: "raposa",
//         title: "O caminho da raposa",
//         intro: "Você escolheu a raposa. Sua jornada começa à esquerda.",
//         instructions: "Explore o caminho e encontre a chave para abrir a saída.",
//         messages: {
//             found: "Você encontrou a chave! Agora pode abrir a saída.",
//             locked: "A saída está trancada. Encontre a chave primeiro."
//         },
//         start: { x: 15, y: 50 },
//         key:   { x: 54, y: 78 },
//         exit:  { left: "auto", right: "3%", top: "5%", bottom: "auto" }, // canto sup. direito
//         obstacles: [
//             { tipo: "divisoria", x: 40, y: 0,  w: 6,  h: 62 }, // obriga a descer
//             { tipo: "divisoria", x: 62, y: 38, w: 6,  h: 62 }, // obriga a subir
//             { tipo: "bloco",     x: 8,  y: 14, w: 10, h: 16 },
//             { tipo: "bloco",     x: 76, y: 55, w: 10, h: 18 }
//         ]
//     }
// };

// export function getTotalPhases(character) {
//     return ROOMS[character].length;
// }

// let currentRoom = ROOMS.rabbit[0];

// export function setCurrentRoom(room) {
//     currentRoom = room;
// }

// export function getCurrentRoom() {
//     return currentRoom;
// }