'use strict';

const cells = Array.from(document.querySelectorAll('[data-cell]'));
const status = document.getElementById('game-status');
const restartButton = document.getElementById('restartButton');
const modes = Array.from(document.querySelectorAll('input[name="mode"]'));
const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];
const names = { x: 'Крестик', o: 'Нолик' };
const botPreference = [4, 0, 2, 6, 8, 1, 3, 5, 7];
let board;
let turn;
let winningLine;
let finished;
let botTimer;

function winningCells(position, mark) {
    return lines.find(line => line.every(index => position[index] === mark));
}

function render(message) {
    status.textContent = message;
    const locked = finished || botTimer !== undefined;
    cells.forEach((cell, index) => {
        const mark = board[index];
        const row = Math.floor(index / 3) + 1;
        const column = index % 3 + 1;
        cell.classList.toggle('cell--x', mark === 'x');
        cell.classList.toggle('cell--o', mark === 'o');
        cell.classList.toggle('cell--win', Boolean(winningLine?.includes(index)));
        cell.setAttribute('aria-disabled', String(locked || Boolean(mark)));
        cell.setAttribute('aria-label', `Ряд ${row}, столбец ${column}: ${names[mark] ?? 'пусто'}`);
    });
}

function startGame() {
    window.clearTimeout(botTimer);
    botTimer = undefined;
    board = Array(9).fill(null);
    turn = 'x';
    winningLine = undefined;
    finished = false;
    render('Ход крестиков');
}

function chooseBotMove() {
    const open = botPreference.filter(index => board[index] === null);
    for (const mark of ['o', 'x']) {
        const best = open.find(index => {
            const next = [...board];
            next[index] = mark;
            return winningCells(next, mark);
        });
        if (best !== undefined) return best;
    }
    return open[0];
}

function play(index) {
    board[index] = turn;
    winningLine = winningCells(board, turn);
    if (winningLine) {
        finished = true;
        render(turn === 'x' ? 'Крестики победили' : 'Нолики победили');
        return;
    }
    if (board.every(Boolean)) {
        finished = true;
        render('Ничья');
        return;
    }

    turn = turn === 'x' ? 'o' : 'x';
    if (turn === 'o' && modes[1].checked) {
        botTimer = window.setTimeout(() => {
            botTimer = undefined;
            play(chooseBotMove());
        }, 250);
        render('Ход компьютера');
        return;
    }
    render(turn === 'x' ? 'Ход крестиков' : 'Ход ноликов');
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (finished || botTimer !== undefined || board[index]) return;
        play(index);
    });
});

modes.forEach(mode => mode.addEventListener('change', startGame));
restartButton.addEventListener('click', () => {
    startGame();
    cells[0].focus();
});
startGame();
