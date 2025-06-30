const words = [
  // Unique, interesting, and A-Z coverage
  "apple", "banana", "orange", "grape", "keyboard", "screen", "window", "javascript",
  "developer", "language", "internet", "website", "quiz", "fox", "vex", "jump", "zebra",
  "wizard", "jazz", "fuzzy", "buzz", "oxygen", "pixel", "vivid", "lynx", "sphinx", "quartz",
  "jockey", "blitz", "awkward", "bagpipes", "croquet", "duplex", "equip", "funny", "galaxy",
  "hazard", "ivory", "jigsaw", "kayak", "luxury", "matrix", "night", "object", "puppy", "rhythm",
  "subway", "topaz", "unique", "voyage", "whiskey", "xylophone", "yacht", "zephyr", "azure",
  "climb", "drum", "echo", "flame", "glove", "harp", "island", "jewel", "koala", "lemon", "monkey",
  "nectar", "octopus", "parrot", "quiver", "rocket", "shadow", "tiger", "umbrella", "velvet", "walnut",
  "xerox", "yellow", "zipper", "astronaut", "breeze", "cactus", "dolphin", "emerald", "festival", "giraffe",
  "horizon", "illusion", "jungle", "kangaroo", "lantern", "mystery", "nebula", "orchid", "penguin", "quokka",
  "rainbow", "safari", "treasure", "utopia", "volcano", "wander", "xenon", "yodel", "zenith", "avalanche",
  "biscuit", "crystal", "dynamo", "enigma", "fjord", "goblin", "hammock", "inkwell", "jigsaw", "kettle",
  "labyrinth", "mirage", "noodle", "obelisk", "panther", "quartzite", "ripple", "sphinx", "tundra", "unicorn",
  "vortex", "willow", "xylitol", "yonder", "zeppelin"
];

let timeLeft = 60;
let timerId;
let wordCount = 0;
let correctWords = 0;
let mistakeCount = 0;
let isTestRunning = false;

const timer = document.getElementById('timer');
const wordDisplay = document.getElementById('word-display');
const inputBox = document.getElementById('input-box');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const prevScoreDiv = document.querySelector('.previous-score');
const prevWpmSpan = document.getElementById('prev-wpm');
const prevAccuracySpan = document.getElementById('prev-accuracy');
const prevMistakesSpan = document.getElementById('prev-mistakes');
const highScoreDiv = document.querySelector('.highest-score');
const highWpmSpan = document.getElementById('high-wpm');
const highAccuracySpan = document.getElementById('high-accuracy');

function startTest() {
  isTestRunning = true;
  wordCount = 0;
  correctWords = 0;
  mistakeCount = 0;
  timeLeft = 60;
  inputBox.disabled = false;
  inputBox.focus();
  restartBtn.textContent = "Restart Test";
  showNewWord();
  timer.textContent = `Time: ${timeLeft}s`;
  timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timer.textContent = `Time: ${timeLeft}s`;
  if (timeLeft <= 0) {
    clearInterval(timerId);
    endTest();
  }
}

function showNewWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  wordDisplay.textContent = words[randomIndex];
  inputBox.value = "";
}

inputBox.addEventListener('keydown', function(e) {
  if (!isTestRunning) return;

  if (e.key === "Enter") {
    checkWord();
  }
});

function checkWord() {
  const typedWord = inputBox.value.trim();
  const displayedWord = wordDisplay.textContent.trim();
  wordCount++;

  if (typedWord === displayedWord) {
    correctWords++;
  } else {
    mistakeCount++;
  }

  showNewWord();
}

function endTest() {
  isTestRunning = false;
  inputBox.disabled = true;

  const wpm = Math.round((correctWords / 60) * 60); // since test is 60s
  const accuracy = wordCount === 0 ? 0 : Math.round((correctWords / wordCount) * 100);

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;

  savePreviousScore(wpm, accuracy, mistakeCount);
  saveHighestScore(wpm, accuracy);
  loadPreviousScore();
  loadHighestScore();
}

function loadPreviousScore() {
  const prev = JSON.parse(localStorage.getItem('previousScore'));
  if (prev && typeof prev.wpm === 'number' && typeof prev.accuracy === 'number') {
    prevWpmSpan.textContent = prev.wpm;
    prevAccuracySpan.textContent = prev.accuracy;
    prevMistakesSpan.textContent = prev.mistakes || 0;
    prevScoreDiv.style.display = '';
  } else {
    prevScoreDiv.style.display = 'none';
  }
}

function savePreviousScore(wpm, accuracy, mistakes) {
  localStorage.setItem('previousScore', JSON.stringify({ wpm, accuracy, mistakes }));
}

function loadHighestScore() {
  const high = JSON.parse(localStorage.getItem('highestScore'));
  // Only show if highest score is strictly better than previous
  const prev = JSON.parse(localStorage.getItem('previousScore'));
  if (
    high && typeof high.wpm === 'number' && typeof high.accuracy === 'number' &&
    (!prev || high.wpm > prev.wpm || (high.wpm === prev.wpm && high.accuracy > prev.accuracy))
  ) {
    highWpmSpan.textContent = high.wpm;
    highAccuracySpan.textContent = high.accuracy;
    highScoreDiv.style.display = '';
  } else {
    highScoreDiv.style.display = 'none';
  }
}

function saveHighestScore(wpm, accuracy) {
  const high = JSON.parse(localStorage.getItem('highestScore'));
  if (!high || wpm > high.wpm || (wpm === high.wpm && accuracy > high.accuracy)) {
    localStorage.setItem('highestScore', JSON.stringify({ wpm, accuracy }));
  }
}

restartBtn.addEventListener('click', function() {
  clearInterval(timerId);
  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = 0;
  startTest();
});

// Add theme switch and interactive effects

document.addEventListener('DOMContentLoaded', () => {
  // Add theme switch to DOM
  const container = document.querySelector('.container');
  const themeSwitch = document.createElement('div');
  themeSwitch.className = 'theme-switch';
  themeSwitch.innerHTML = `
    <input type="checkbox" id="theme-toggle" />
  `;
  container.appendChild(themeSwitch);

  // Theme toggle logic
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  // Persist theme
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    themeToggle.checked = true;
  }
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });

  // Add sun/moon div for background
  let sun = document.querySelector('.sun');
  let moon = document.querySelector('.moon');
  let dayAnimal = document.querySelector('.day-animal');
  let nightAnimal = document.querySelector('.night-animal');
  if (!sun) {
    sun = document.createElement('div');
    sun.className = 'sun';
    document.body.appendChild(sun);
  }
  if (!moon) {
    moon = document.createElement('div');
    moon.className = 'moon';
    document.body.appendChild(moon);
  }
  if (!dayAnimal) {
    dayAnimal = document.createElement('div');
    dayAnimal.className = 'day-animal';
    dayAnimal.textContent = '🐥';
    document.body.appendChild(dayAnimal);
  }
  if (!nightAnimal) {
    nightAnimal = document.createElement('div');
    nightAnimal.className = 'night-animal';
    nightAnimal.textContent = '🦉';
    document.body.appendChild(nightAnimal);
  }
  // Set day/night class for background
  function setDayNightClass() {
    if (themeToggle.checked) {
      document.body.classList.add('dark');
      document.body.classList.remove('day');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('day');
    }
  }
  setDayNightClass();
  themeToggle.addEventListener('change', setDayNightClass);

  // Add blinking stars in night mode
  function addNightStars() {
    let nightStars = document.querySelector('.night-stars');
    if (!nightStars) {
      nightStars = document.createElement('div');
      nightStars.className = 'night-stars';
      nightStars.innerHTML = `
        <span class="star star1">✦</span>
        <span class="star star2">✦</span>
        <span class="star star3">✦</span>
        <span class="star star4">✦</span>
        <span class="star star5">✦</span>
      `;
      document.body.appendChild(nightStars);
    }
    nightStars.style.display = document.body.classList.contains('dark') ? '' : 'none';
  }
  addNightStars();
  // Update stars on theme change
  themeToggle.addEventListener('change', addNightStars);

  // Add clouds in day mode
  function addDayClouds() {
    let dayClouds = document.querySelector('.day-clouds');
    if (!dayClouds) {
      dayClouds = document.createElement('div');
      dayClouds.className = 'day-clouds';
      dayClouds.innerHTML = `
        <span class="cloud cloud1">☁️</span>
        <span class="cloud cloud2">☁️</span>
        <span class="cloud cloud3">☁️</span>
        <span class="cloud cloud4">☁️</span>
        <span class="cloud cloud5">☁️</span>
      `;
      document.body.appendChild(dayClouds);
    }
    dayClouds.style.display = document.body.classList.contains('day') ? '' : 'none';
  }
  addDayClouds();
  // Update clouds on theme change
  themeToggle.addEventListener('change', addDayClouds);

  // Animate timer when time is running
  const timer = document.getElementById('timer');
  const observer = new MutationObserver(() => {
    if (isTestRunning) {
      timer.classList.add('pulse');
    } else {
      timer.classList.remove('pulse');
    }
  });
  observer.observe(timer, { childList: true });

  // Input box effect on correct/incorrect
  inputBox.addEventListener('keydown', function(e) {
    if (!isTestRunning) return;
    if (e.key === "Enter") {
      const typedWord = inputBox.value.trim();
      const displayedWord = wordDisplay.textContent.trim();
      if (typedWord === displayedWord) {
        inputBox.style.background = 'linear-gradient(90deg, #b3ffb3 0%, #e0ffe0 100%)';
      } else {
        inputBox.style.background = 'linear-gradient(90deg, #ffb3b3 0%, #ffe0e0 100%)';
      }
      setTimeout(() => {
        inputBox.style.background = '';
      }, 300);
    }
  });

  loadPreviousScore();
  loadHighestScore();
});
