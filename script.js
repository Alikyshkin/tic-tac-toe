// script.js
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let circleTurn;
let isAiMode = false;

const modeRadios = document.getElementsByName('mode');
modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        isAiMode = e.target.value === 'ai';
        startGame();
    });
});

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    circleTurn = false;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        setTimeout(() => endGame(false), 100);
    } else if (isDraw()) {
        setTimeout(() => endGame(true), 100);
    } else {
        swapTurns();
        if (isAiMode && circleTurn) {
            setTimeout(aiMove, 100);
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function endGame(draw) {
    if (draw) {
        alert('Ничья!');
    } else {
        alert(`${circleTurn ? "Нолики" : "Крестики"} победили!`);
    }
    startGame();
}

function aiMove() {
    const availableCells = [...cells].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS);
    });
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    placeMark(availableCells[randomIndex], CIRCLE_CLASS);
    if (checkWin(CIRCLE_CLASS)) {
        setTimeout(() => endGame(false), 100);
    } else if (isDraw()) {
        setTimeout(() => endGame(true), 100);
    } else {
        swapTurns();
    }
}