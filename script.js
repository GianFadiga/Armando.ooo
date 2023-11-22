// Importa a lista de palavras do arquivo words.js
import { WORDS } from "./words.js";

// Define o número máximo de tentativas
const NUMBER_OF_GUESSES = 6;

// Inicializa o número de tentativas restantes
let guessesRemaining = NUMBER_OF_GUESSES;

// Inicializa a lista de letras já escolhidas
let currentGuess = [];

// Inicializa o índice da próxima letra a ser escolhida
let nextLetter = 0;

// Escolhe aleatoriamente uma palavra da lista de palavras
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

// Salva a palavra original antes de remover acentos
let originalWord = rightGuessString;

// Remove acentos da palavra escolhida
rightGuessString = rightGuessString
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

// Converte a palavra original para letras maiúsculas
originalWord = originalWord.toUpperCase();

// Imprime a palavra escolhida sem acentos no console
console.log(rightGuessString);

// Função que inicializa o tabuleiro do jogo
function initBoard() {
  // Obtém o elemento HTML que representa o tabuleiro
  let board = document.getElementById("game-board");

  // Cria uma linha para cada tentativa
  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    // Cria uma caixa para cada letra da palavra
    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    // Adiciona a linha ao tabuleiro
    board.appendChild(row);
  }
}

// Chama a função que inicializa o tabuleiro
initBoard();

// Adiciona um listener para o evento de soltar uma tecla
document.addEventListener("keyup", (e) => {

  // Define uma lista de teclas que não serão consideradas como tentativas de adivinhar a palavra
  let forgivenKeys = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];

  // Se o número de tentativas restantes for zero, retorna sem fazer nada
  if (guessesRemaining === 0) {
    return;
  }

  // Se o índice da próxima letra for menor que zero, define-o como zero para evitar valores negativos
  if (nextLetter < 0) {
    nextLetter = 0;
  }

  // Obtém a tecla pressionada
  let eventKey = String(e.key);

  // Se a tecla pressionada for "Backspace" e houver letras na lista de letras escolhidas, remove a última letra
  if (eventKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  // Se a tecla pressionada for "Enter", verifica se a palavra escolhida está correta
  if (eventKey === "Enter") {
    checkGuess();
    return;
  }

  // Se a tecla pressionada estiver na lista de teclas que não serão consideradas, retorna sem fazer nada
  if (forgivenKeys.includes(eventKey)) {  
    return;
  }

  // Verifica se a tecla pressionada é uma letra do alfabeto
  let found = eventKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(eventKey);
  }
});

// Função que insere uma letra na lista de letras escolhidas
function insertLetter(eventKey) {
  // Se a lista de letras escolhidas já estiver cheia, retorna sem fazer nada
  if (nextLetter === 5) {
    return;
  }

  // Converte a letra para minúscula
  eventKey = eventKey.toLowerCase();

  // Obtém a linha correspondente à tentativa atual
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];

  // Obtém a caixa correspondente à próxima letra a ser escolhida
  let box = row.children[nextLetter];

  // Adiciona uma animação à caixa
  animateCSS(box, "pulse");

  // Define o conteúdo da caixa como a letra escolhida
  box.textContent = eventKey;

  // Adiciona uma classe à caixa para indicar que ela está preenchida
  box.classList.add("filled-box");

  // Adiciona a letra escolhida à lista de letras escolhidas
  currentGuess.push(eventKey);

  // Incrementa o índice da próxima letra a ser escolhida
  nextLetter += 1;
}

// Função que remove a última letra adicionada à lista de letras escolhidas
function deleteLetter() {
  // Obtém a linha correspondente à tentativa atual
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];

  // Obtém a caixa correspondente à última letra adicionada
  let box = row.children[nextLetter - 1];

  // Remove o conteúdo da caixa
  box.textContent = "";

  // Remove a classe que indica que a caixa está preenchida
  box.classList.remove("filled-box");

  // Remove a última letra adicionada da lista de letras escolhidas
  currentGuess.pop();

  // Decrementa o índice da próxima letra a ser escolhida
  nextLetter -= 1;
}

// Função que verifica a palavra escolhida
function checkGuess() {
  // Obtém a linha correspondente à tentativa atual
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];

  // Inicializa a string de tentativa
  let guessString = "";

  // Converte a palavra correta em um array de letras
  let rightGuess = Array.from(rightGuessString);

  // Cria a string de tentativa a partir da lista de letras escolhidas
  for (const val of currentGuess) {
    guessString += val;
  }

  // Verifica se a string de tentativa tem o tamanho correto
  if (guessString.length != 5) {
    toastr.error("Tamanho de palavra inválido!");
    return;
  }

  // Função que remove acentos de uma string
  const normalizeString = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Normaliza a string de tentativa
  const normalizedGuess = normalizeString(guessString);

  // Verifica se a string de tentativa é uma palavra válida
  if (!WORDS.some((word) => normalizeString(word) === normalizedGuess)) {
    toastr.error("Palavra inválida!");
    return;
  }

  // Verifica cada letra da tentativa
  for (let i = 0; i < 5; i++) {
    let letterColor = "";
    let box = row.children[i];
    let letter = currentGuess[i];

    // Verifica se a letra está na posição correta
    let letterPosition = rightGuess.indexOf(currentGuess[i]);
    if (letterPosition === -1) {
      // Se a letra não estiver na palavra correta, pinta a caixa de cinza
      letterColor = "grey";
    } else {
      // Se a letra estiver na palavra correta
      if (currentGuess[i] === rightGuess[i]) {
        // Se a letra estiver na posição correta, pinta a caixa de verde
        letterColor = "#47d147";
      } else {
        // Se a letra estiver na palavra correta, mas na posição errada, pinta a caixa de amarelo
        letterColor = "#ffd11a";
      }

      // Remove a letra da palavra correta
      rightGuess[letterPosition] = "#";
    }

    // Define um atraso para a animação
    let delay = 250 * i;
    setTimeout(() => {
      // Adiciona uma animação à caixa
      animateCSS(box, "flipInX");

      // Pinta a caixa com a cor apropriada
      box.style.backgroundColor = letterColor;

      // Pinta a tecla do teclado virtual com a cor apropriada
      shadeKeyBoard(letter, letterColor);
    }, delay);
  }

  // Se a tentativa for correta, exibe uma mensagem de sucesso
  if (guessString === rightGuessString) {
    toastr.success("Você acertou! Parabéns!");

    // Exibe a palavra correta
    toastr.success(`A palavra correta era: "${originalWord}"`);

    // Define o número de tentativas restantes como zero
    guessesRemaining = 0;
    return;
  } else {
    // Se a tentativa for incorreta, decrementa o número de tentativas restantes
    guessesRemaining -= 1;

    // Limpa a lista de letras escolhidas e o índice da próxima letra a ser escolhida
    currentGuess = [];
    nextLetter = 0;

    // Se o número de tentativas restantes for zero, exibe uma mensagem de fim de jogo
    if (guessesRemaining === 0) {
      toastr.error("Fim de jogo! Você perdeu!");

      // Exibe a palavra correta
      toastr.info(`A palavra correta era: "${originalWord}"`);
    }
  }
}

// Função que pinta a tecla do teclado virtual com a cor apropriada
function shadeKeyBoard(letter, color) {
  // Percorre todas as teclas do teclado virtual
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    // Se a tecla for a letra escolhida, pinta-a com a cor apropriada
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === "green") {
        return;
      }

      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
  }
}

// Adiciona um listener para o evento de clique no teclado virtual
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  // Se o elemento clicado não for uma tecla do teclado virtual, retorna sem fazer nada
  if (!target.classList.contains("keyboard-button")) {
    return;
  }

  // Obtém a tecla pressionada
  let key = target.textContent;

  // Se a tecla pressionada for "Del" e não houver letras na lista de letras escolhidas, retorna sem fazer nada
  if (key === "Del" && nextLetter === 0) {
   return;
  }

  // Se a tecla pressionada for "Del", define-a como "Backspace"
  if (key === "Del") {
    key = "Backspace";
  }

  // Dispara um evento de soltar uma tecla
  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

// Função que adiciona uma animação a um elemento
const animateCSS = (element, animation, prefix = "animate__") =>
  // Cria uma Promise e a retorna
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    // Adiciona uma classe de animação ao elemento
    node.classList.add(`${prefix}animated`, animationName);

    // Quando a animação terminar, remove as classes e resolve a Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
});
