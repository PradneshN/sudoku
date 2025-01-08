let timerInterval;
let seconds = 0;
let minutes = 0;
let timerStarted = false;
let timerPaused = false;

// Function to generate a random Sudoku grid
function generateRandomGrid(size) {
    const grid = [];
    
    // Create an empty grid
    for (let i = 0; i < size; i++) {
        grid[i] = [];
        for (let j = 0; j < size; j++) {
            grid[i][j] = Math.random() > 0.5 ? 0 : Math.floor(Math.random() * size) + 1; // Random numbers with some zeros
        }
    }
    
    return grid;
}

// Function to generate the grid
function generateGrid(size) {
    const sudokuContainer = document.getElementById('sudoku-container');
    sudokuContainer.innerHTML = ''; // Clear any existing grid

    const grid = generateRandomGrid(size); // Generate new random grid

    const maxNumber = size;

    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.className = 'sudoku-row';
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('input');
            cell.type = 'number';
            cell.min = 1;
            cell.max = maxNumber;
            cell.className = 'sudoku-cell';

            // Pre-fill cells from the generated grid
            if (grid[i][j] !== 0) {
                cell.value = grid[i][j];
                cell.disabled = true; // Disable the cell
            } else {
                cell.value = ''; // Empty non-pre-filled cells
            }

            cell.addEventListener('input', () => {
                if (!timerStarted && !timerPaused) {
                    startTimer();
                    timerStarted = true;
                }
            });

            row.appendChild(cell);
        }
        sudokuContainer.appendChild(row);
    }
}

// Timer functions
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        document.getElementById('timer').textContent = `Time: ${formatTime(minutes)}:${formatTime(seconds)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Pause/Resume Timer
function togglePause() {
    if (timerPaused) {
        startTimer(); // Resume the timer
        timerPaused = false;
        document.getElementById('pause-button').textContent = 'Pause Timer';
    } else {
        stopTimer(); // Pause the timer
        timerPaused = true;
        document.getElementById('pause-button').textContent = 'Resume Timer';
    }
}

// Check the solution (basic logic)
function checkSudoku(size) {
    const cells = document.querySelectorAll('.sudoku-cell');
    let correct = true;

    // Clear any previous highlights
    cells.forEach(cell => {
        cell.style.backgroundColor = '';  // Reset background color
    });

    // Check rows
    for (let i = 0; i < size; i++) {
        const rowValues = [];
        for (let j = 0; j < size; j++) {
            const value = parseInt(cells[i * size + j].value);
            if (!value || rowValues.includes(value)) {
                correct = false;
                cells[i * size + j].style.backgroundColor = 'red';  // Highlight incorrect cell
                break;
            }
            rowValues.push(value);
        }
        if (!correct) break;
    }

    // Check columns (if rows are correct)
    if (correct) {
        for (let j = 0; j < size; j++) {
            const colValues = [];
            for (let i = 0; i < size; i++) {
                const value = parseInt(cells[i * size + j].value);
                if (!value || colValues.includes(value)) {
                    correct = false;
                    cells[i * size + j].style.backgroundColor = 'red';  // Highlight incorrect cell
                    break;
                }
                colValues.push(value);
            }
            if (!correct) break;
        }
    }

    // If the solution is correct, highlight correct cells in green
    if (correct) {
        cells.forEach(cell => {
            const value = parseInt(cell.value);
            if (value) {
                cell.style.backgroundColor = 'lightgreen';  // Highlight correct cell
            }
        });
        alert("Congratulations! You solved the puzzle.");
        stopTimer();
    } else {
        alert("Oops! The solution is incorrect.");
    }
}

// Reset the game
function resetGame(size) {
    // Reset timer variables
    seconds = 0;
    minutes = 0;
    timerStarted = false;
    timerPaused = false;

    // Update timer display and button text
    document.getElementById('timer').textContent = 'Time: 00:00';
    document.getElementById('pause-button').textContent = 'Pause Timer';

    stopTimer(); // Stop the timer
    generateGrid(size); // Regenerate the grid with new random values
}