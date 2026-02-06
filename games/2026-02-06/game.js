const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board;
let currentPlayer;
let gameOver;

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((cell, index) => {
    const button = document.createElement('button');
    button.className = 'cell';
    button.type = 'button';
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', `Cell ${index + 1}`);
    button.textContent = cell;
    button.disabled = cell !== '' || gameOver;
    button.addEventListener('click', () => handleMove(index));
    boardEl.appendChild(button);
  });
}

function setStatus(message) {
  statusEl.textContent = message;
}

function checkWinner() {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function handleMove(index) {
  if (board[index] || gameOver) return;
  board[index] = currentPlayer;

  const winner = checkWinner();
  if (winner) {
    gameOver = true;
    setStatus(`Player ${winner} wins!`);
  } else if (board.every((cell) => cell !== '')) {
    gameOver = true;
    setStatus('Draw game.');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setStatus(`Player ${currentPlayer}'s turn`);
  }

  renderBoard();
}

function resetGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  setStatus(`Player ${currentPlayer}'s turn`);
  renderBoard();
}

resetBtn.addEventListener('click', resetGame);
resetGame();
