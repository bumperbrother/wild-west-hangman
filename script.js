// Western-themed word list
const wordList = [
    'SHERIFF', 'OUTLAW', 'SALOON', 'COWBOY', 'BANDIT', 'FRONTIER', 
    'GUNSLINGER', 'DEPUTY', 'LASSO', 'RANCH', 'CATTLE', 'STAGECOACH', 
    'DESPERADO', 'BOUNTY', 'MARSHAL', 'DUEL', 'RUSTLER', 'HOMESTEAD', 
    'TERRITORY', 'REVOLVER', 'HORSESHOE', 'TUMBLEWEED', 'RAILROAD', 
    'TELEGRAPH', 'GOLDMINE', 'BANDANA', 'SADDLEBAG', 'WHISKEY', 'HIDEOUT',
    'WANTED', 'POSSE', 'JAILBREAK', 'GALLOWS', 'HOLSTER', 'SPURS', 'RODEO'
];

// Game state
let selectedWord = '';
let guessedLetters = [];
let incorrectGuesses = 0;
let gameOver = false;

// DOM elements
const wordDisplayElement = document.querySelector('.word-display');
const keyboardElement = document.querySelector('.keyboard');
const messageElement = document.querySelector('.message');
const incorrectCountElement = document.getElementById('incorrect-count');
const newGameButton = document.getElementById('new-game');
const playAgainButton = document.getElementById('play-again');
const modal = document.getElementById('game-over-modal');
const resultMessageElement = document.getElementById('result-message');
const wordRevealElement = document.getElementById('word-reveal');

// Initialize the game
function initGame() {
    // Reset game state
    selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
    guessedLetters = [];
    incorrectGuesses = 0;
    gameOver = false;
    
    // Reset UI
    updateWordDisplay();
    updateHangman();
    createKeyboard();
    messageElement.textContent = 'Guess a letter to save the outlaw!';
    incorrectCountElement.textContent = '0';
    
    // Hide modal if visible
    modal.classList.add('hidden');
    
    // Hide all hangman parts
    document.querySelectorAll('.man-part').forEach(part => {
        part.classList.add('hidden');
    });
    
    console.log('Selected word:', selectedWord); // For debugging
}

// Create the keyboard
function createKeyboard() {
    keyboardElement.innerHTML = '';
    
    // Define the keyboard layout in QWERTY format
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];
    
    // Create each row as a div
    keyboardRows.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('keyboard-row');
        
        // Create each key in the row
        row.forEach(letter => {
            const keyButton = document.createElement('div');
            keyButton.classList.add('key');
            keyButton.textContent = letter;
            keyButton.addEventListener('click', () => handleGuess(letter));
            rowElement.appendChild(keyButton);
        });
        
        keyboardElement.appendChild(rowElement);
    });
}

// Update the word display with correctly guessed letters and blanks
function updateWordDisplay() {
    wordDisplayElement.innerHTML = '';
    
    for (const letter of selectedWord) {
        const letterBox = document.createElement('div');
        letterBox.classList.add('letter-box');
        
        if (guessedLetters.includes(letter)) {
            letterBox.textContent = letter;
        }
        
        wordDisplayElement.appendChild(letterBox);
    }
}

// Handle letter guess
function handleGuess(letter) {
    if (gameOver || guessedLetters.includes(letter)) {
        return;
    }
    
    guessedLetters.push(letter);
    
    // Update keyboard UI
    document.querySelectorAll('.key').forEach(key => {
        if (key.textContent === letter) {
            key.classList.add('used');
            
            if (selectedWord.includes(letter)) {
                key.classList.add('correct');
            } else {
                key.classList.add('incorrect');
            }
        }
    });
    
    // Check if the guessed letter is in the word
    if (selectedWord.includes(letter)) {
        updateWordDisplay();
        messageElement.textContent = 'Good guess, partner!';
        
        // Check if player has won
        if (checkWin()) {
            endGame(true);
        }
    } else {
        incorrectGuesses++;
        incorrectCountElement.textContent = incorrectGuesses;
        updateHangman();
        messageElement.textContent = 'That ain\'t right, try again!';
        
        // Check if player has lost
        if (incorrectGuesses >= 6) {
            endGame(false);
        }
    }
}

// Update the hangman drawing based on incorrect guesses
function updateHangman() {
    const hangmanParts = document.querySelectorAll('.man-part');
    
    for (let i = 0; i < incorrectGuesses; i++) {
        if (hangmanParts[i]) {
            hangmanParts[i].classList.remove('hidden');
        }
    }
}

// Check if the player has won
function checkWin() {
    return [...selectedWord].every(letter => guessedLetters.includes(letter));
}

// End the game
function endGame(isWin) {
    gameOver = true;
    
    if (isWin) {
        resultMessageElement.textContent = 'PARDNER, YOU SAVED THE OUTLAW!';
        wordRevealElement.textContent = `The word was: ${selectedWord}`;
    } else {
        resultMessageElement.textContent = 'HANGED! BETTER LUCK NEXT TIME!';
        wordRevealElement.textContent = `The word was: ${selectedWord}`;
    }
    
    modal.classList.remove('hidden');
}

// Add event listeners
newGameButton.addEventListener('click', initGame);
playAgainButton.addEventListener('click', initGame);

// Listen for keyboard input
document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    
    const key = event.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
    }
});

// Add some old paper texture effect with random spots
function addPaperTexture() {
    const poster = document.querySelector('.wanted-poster');
    
    for (let i = 0; i < 30; i++) {
        const spot = document.createElement('div');
        spot.style.position = 'absolute';
        spot.style.width = `${Math.random() * 5 + 2}px`;
        spot.style.height = `${Math.random() * 5 + 2}px`;
        spot.style.backgroundColor = 'rgba(58, 39, 24, 0.1)';
        spot.style.borderRadius = '50%';
        spot.style.top = `${Math.random() * 100}%`;
        spot.style.left = `${Math.random() * 100}%`;
        spot.style.pointerEvents = 'none';
        poster.appendChild(spot);
    }
}

// Add a subtle paper crease effect
function addPaperCrease() {
    const poster = document.querySelector('.wanted-poster');
    
    const crease = document.createElement('div');
    crease.style.position = 'absolute';
    crease.style.width = '100%';
    crease.style.height = '1px';
    crease.style.backgroundColor = 'rgba(58, 39, 24, 0.2)';
    crease.style.top = '50%';
    crease.style.left = '0';
    crease.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.3)';
    crease.style.pointerEvents = 'none';
    poster.appendChild(crease);
    
    const verticalCrease = document.createElement('div');
    verticalCrease.style.position = 'absolute';
    verticalCrease.style.width = '1px';
    verticalCrease.style.height = '100%';
    verticalCrease.style.backgroundColor = 'rgba(58, 39, 24, 0.1)';
    verticalCrease.style.top = '0';
    verticalCrease.style.left = '33%';
    verticalCrease.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.2)';
    verticalCrease.style.pointerEvents = 'none';
    poster.appendChild(verticalCrease);
}

// Add a subtle animation to the hangman rope
function animateRope() {
    const rope = document.querySelector('.gallows-part:nth-child(4)');
    
    if (rope) {
        let direction = 1;
        let position = 0;
        
        setInterval(() => {
            position += 0.1 * direction;
            
            if (position > 1 || position < -1) {
                direction *= -1;
            }
            
            rope.setAttribute('x2', (120 + position).toString());
        }, 100);
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    initGame();
    addPaperTexture();
    addPaperCrease();
    animateRope();
});
// Updated on Sat Apr 12 17:17:43 PDT 2025
