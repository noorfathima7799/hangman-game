/// ====== STATUS VARIABLES ======
let time = 0;
let coins = 10;
let streak = 0;
let maxWrong = 6;
let timerInterval;

// ====== DOM ELEMENTS ======
const timeEl = document.getElementById('time');
const coinsEl = document.getElementById('coins');
const streakEl = document.getElementById('streak');

const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playButton = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const finalMessage = document.getElementById('final-message');
const notification = document.getElementById('notification-container');
const difficultySelect = document.getElementById('difficulty');
const figureParts = document.querySelectorAll('.figure-part');

// ====== TIMER FUNCTIONS ======
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    timeEl.innerText = time;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// ====== DIFFICULTY ======
difficultySelect.addEventListener('change', () => {
  maxWrong = difficultySelect.value === 'easy' ? 8 : 4;
});

// ====== WORD SETUP ======
const words = ['application', 'programming', 'interface', 'wizard'];
let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

// ====== DISPLAY WORD ======
function displayWord() {
  wordEl.innerHTML = selectedWord
    .split('')
    .map(
      letter => `
        <span class="letter">
          ${correctLetters.includes(letter) ? letter : ''}
        </span>
      `
    )
    .join('');

  const innerWord = wordEl.innerText.replace(/\n/g, '');

  if (innerWord === selectedWord) {
    stopTimer(); // ✅ STOP TIME ON WIN

    finalMessage.innerText = '🎉 You Won!';
    popup.style.display = 'flex';

    streak++;
    streakEl.innerText = streak;
  }
}

// ====== UPDATE WRONG LETTERS ======
function updateWrongLetters() {
  wrongLettersEl.innerHTML = wrongLetters.map(l => `<span>${l}</span>`).join('');

  figureParts.forEach((part, index) => {
    part.style.display = index < wrongLetters.length ? 'block' : 'none';
  });

  if (wrongLetters.length === maxWrong) {
    stopTimer(); // ✅ STOP TIME ON LOSE

    finalMessage.innerText = '💀 You Lost!';
    popup.style.display = 'flex';

    streak = 0;
    streakEl.innerText = streak;
  }
}

// ====== NOTIFICATION ======
function showNotification() {
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 2000);
}

// ====== KEY PRESS ======
document.addEventListener('keydown', e => {
  const letter = e.key.toLowerCase();

  if (letter >= 'a' && letter <= 'z') {
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLetters();

        coins--;
        coinsEl.innerText = coins;

        if (coins <= 0) {
          stopTimer(); // ✅ STOP TIME ON COINS END

          finalMessage.innerText = '💀 No coins left!';
          popup.style.display = 'flex';

          streak = 0;
          streakEl.innerText = streak;
        }
      } else {
        showNotification();
      }
    }
  }
});

// ====== RESTART GAME ======
playButton.addEventListener('click', () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  figureParts.forEach(part => (part.style.display = 'none'));
  wrongLettersEl.innerHTML = '';
  popup.style.display = 'none';

  // reset stats
  time = 0;
  coins = 10;

  timeEl.innerText = time;
  coinsEl.innerText = coins;

  displayWord();
  startTimer(); // ✅ START TIMER AGAIN
});

// ====== START GAME ======
displayWord();
coinsEl.innerText = coins;
streakEl.innerText = streak;
timeEl.innerText = time;
startTimer(); // ✅ START TIMER
