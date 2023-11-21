// Importa o array WORDS de um arquivo separado.
import { WORDS } from "./words.js";

// Número de tentativas permitidas.
const NUMBER_OF_GUESSES = 6;

// Número de tentativas restantes.
let guessesRemaining = NUMBER_OF_GUESSES;

// Tentativa atual.
let currentGuess = [];

// Próxima letra a ser adivinhada.
let nextLetter = 0;

// Palavra aleatória do array WORDS.
let randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];

// Palavra original antes da normalização.
let originalWord = randomWord;

// Normaliza a palavra removendo acentos.
randomWord = normalizeWord(randomWord);

// Converte a palavra original para maiúsculas.
originalWord = originalWord.toUpperCase();

// Exibe a palavra normalizada no console (apenas para fins de depuração).
console.log(`A palavra normalizada é: ${randomWord}`);

// Função para normalizar a palavra removendo acentos.
function normalizeWord(word) {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Esta linha chama a função initBoard para inicializar o tabuleiro do jogo.
initBoard();

// Adiciona um ouvinte de eventos para o evento "keyup" no objeto "document"
document.addEventListener("keyup", (e) => {
  // Define uma lista de teclas que não serão consideradas como tentativas de adivinhar uma letra
  const forgivenKeys = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];

  // Verifica se o jogo acabou
  if (guessesRemaining === 0) {
    return;
  }

  // Verifica a tecla pressionada
  const eventKey = String(e.key);

  // Verifica casos especiais
  if (handleSpecialKeys(eventKey)) {
    return;
  }

  // Verifica se a tecla pressionada é uma letra válida
  if (isValidLetter(eventKey)) {
    insertLetter(eventKey);
  }
});

// Função para lidar com casos especiais
function handleSpecialKeys(key) {
  // Verifica se a tecla pressionada é a tecla "Backspace" e se há letras na palavra que foram adivinhadas
  if (key === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return true;
  }

  // Verifica se a tecla pressionada é a tecla "Enter"
  if (key === "Enter") {
    checkGuess();
    return true;
  }

  // Verifica se a tecla pressionada é uma das teclas de função
  if (forgivenKeys.includes(key)) {
    return true;
  }

  return false;
}

// Função para verificar se a tecla pressionada é uma letra válida
function isValidLetter(key) {
  const found = key.match(/[a-z]/i);
  return found && found.length === 1;
}

// Insere uma letra na palavra a ser adivinhada
function insertLetter(eventKey) {
  // Verifica se a palavra já tem 5 letras
  if (nextLetter === 5) {
    return;
  }
  eventKey = eventKey.toLowerCase();

  // Obtém a linha e a caixa onde a letra deve ser inserida
  const row = document.querySelector(".letter-row:nth-child(" + (6 - guessesRemaining) + ")");
  const box = row.children[nextLetter];

  // Anima a caixa
  animateCSS(box, "pulse");

  // Insere a letra na caixa e adiciona a classe "filled-box"
  box.textContent = eventKey;
  box.classList.add("filled-box");

  // Adiciona a letra à lista de letras adivinhadas e atualiza o índice da próxima letra
  currentGuess.push(eventKey);
  nextLetter += 1;
}

// Remove a última letra inserida na palavra a ser adivinhada
function deleteLetter() {
  // Verifica se não há letras para remover
  if (nextLetter === 0) {
    return;
  }

  // Obtém a linha e a caixa onde a última letra foi inserida
  const row = document.querySelector(".letter-row:nth-child(" + (6 - guessesRemaining) + ")");
  const box = row.children[nextLetter - 1];

  // Remove a letra da caixa e remove a classe "filled-box"
  box.textContent = "";
  box.classList.remove("filled-box");

  // Remove a letra da lista de letras adivinhadas e atualiza o índice da próxima letra
  currentGuess.pop();
  nextLetter -= 1;
}

// Verifica se a palavra adivinhada é a palavra correta
function checkGuess() {
  // Obtém a linha onde a palavra adivinhada foi inserida
  const row = document.querySelector(".letter-row:nth-child(" + (6 - guessesRemaining) + ")");

  // Cria uma string com as letras adivinhadas
  const guessString = currentGuess.join("");

  // Verifica se a palavra adivinhada tem 5 letras
  if (guessString.length !== 5) {
    toastr.error("Tamanho de palavra inválido!");
    return;
  }

  // Normaliza a string de adivinhação e a string da palavra correta
  const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const normalizedGuess = normalizeString(guessString);
  const normalizedOriginalWord = normalizeString(originalWord);

  // Compara as strings normalizadas
  if (normalizedGuess === normalizedOriginalWord) {
    toastr.success("Parabéns! Você acertou a palavra!");
  } else {
    toastr.error("Palavra incorreta. Tente novamente.");
    // Aqui você pode adicionar lógica para lidar com uma tentativa incorreta, se necessário.
  }

  // Pode ser útil reiniciar o jogo após a verificação
  // Reinicializa o tabuleiro e escolhe uma nova palavra aleatória
  initBoard();
  resetGame();
}

// Função para reiniciar o jogo
function resetGame() {
  guessesRemaining = NUMBER_OF_GUESSES;
  currentGuess = [];
  nextLetter = 0;
  randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  originalWord = randomWord;
  randomWord = normalizeWord(randomWord);
  originalWord = originalWord.toUpperCase();
  console.log(`A palavra normalizada é: ${randomWord}`);
}

if (!WORDS.some((word) => normalizeString(word) === normalizedGuess)) {
  toastr.error("Palavra inválida!");
  return;
}

for (let i = 0; i < 5; i++) {
  const box = row.children[i];
  const letter = currentGuess[i];

  const letterPosition = rightGuess.indexOf(letter);

  // A letra está na palavra correta?
  let letterColor = letterPosition === -1 ? "grey" : determineLetterColor(i, letter, rightGuess);

  const delay = 250 * i;

  setTimeout(() => {
    // Virar a caixa
    animateCSS(box, "flipInX");
    // Sombrear a caixa
    box.style.backgroundColor = letterColor;
    shadeKeyBoard(letter, letterColor);
  }, delay);
}

// Verifica se a palavra foi adivinhada corretamente
if (guessString === rightGuessString) {
  toastr.success("Você acertou! Parabéns!");
  toastr.success(`A palavra correta era: "${originalWord}"`);
  guessesRemaining = 0;
} else {
  // Decrementa o número de tentativas restantes
  guessesRemaining -= 1;

  // Reseta a tentativa atual
  resetCurrentGuess();

  if (guessesRemaining === 0) {
    // Fim de jogo, exibe mensagem e a palavra correta
    toastr.error("Fim de jogo! Você perdeu!");
    toastr.info(`A palavra correta era: "${originalWord}"`);
  }
}

// Função para determinar a cor da letra com base na posição
function determineLetterColor(position, letter, rightGuess) {
  if (letter === rightGuess[position]) {
    return "#47d147"; // Verde se a letra estiver na posição correta
  } else if (rightGuess.includes(letter)) {
    return "#ffd11a"; // Amarelo se a letra estiver na palavra, mas na posição errada
  } else {
    return "grey"; // Cinza se a letra não estiver na palavra
  }
}

// Função para resetar a tentativa atual
function resetCurrentGuess() {
  currentGuess = [];
  nextLetter = 0;
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      const oldColor = elem.style.backgroundColor;

      // Se a cor antiga for verde ou amarela e a nova cor não for verde, não faça nada
      if ((oldColor === "green" || oldColor === "yellow") && color !== "green") {
        return;
      }

      // Mude a cor do botão do teclado
      elem.style.backgroundColor = color;
      break;
    }
  }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  // Se o alvo não for um botão do teclado, não faça nada
  if (!target.classList.contains("keyboard-button")) {
    return;
  }

  let key = target.textContent;

  // Se a tecla for "Del", altere para "Backspace"
  if (key === "DEL") {
    key = "Backspace";
  }

  // Crie e dispare um evento de teclado
  document.dispatchEvent(new KeyboardEvent("keyup", { key }));
});

const animateCSS = (element, animation, prefix = "animate__") =>
  // Criamos uma Promise e a retornamos
  new Promise((resolve) => {
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    // Quando a animação terminar, limpamos as classes e resolvemos a Promise
    function handleAnimationEnd() {
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animação terminada");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

