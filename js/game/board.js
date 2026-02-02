const boardEl = document.getElementById("board");
const status = document.getElementById("status");
const roundText = document.getElementById("roundText");

const youScoreEl = document.getElementById("youScore");
const aiScoreEl = document.getElementById("aiScore");
const drawScoreEl = document.getElementById("drawScore");

const nextRoundBtn = document.getElementById("nextRoundBtn");
const newGameBtn = document.getElementById("newGameBtn");
const backMenuBtn = document.getElementById("backMenuBtn");
const modeLabel = document.getElementById("modeLabel");

// USER
const username = localStorage.getItem("username") || "Player";

// GAME SETTINGS
const mode = localStorage.getItem("mode") || "ai"; // ai | local
const level = localStorage.getItem("level") || "easy";
const MAX_ROUNDS = 3;

let board = Array(9).fill("");
let player = localStorage.getItem("player") || "X";
let opponent = player === "X" ? "O" : "X";

let round = 1;
let youScore = 0;
let aiScore = 0;
let drawScore = 0;

let gameOver = false;
let currentTurn = "player";

modeLabel.innerText = mode === "ai" ? level.toUpperCase() : "LOCAL";

render();
updateUI();
updateStatus();

// ---------------- RENDER ----------------
function render() {
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "cell " + val;
    cell.innerText = val;
    cell.onclick = () => handleMove(i);
    boardEl.appendChild(cell);
  });
}

// ---------------- MOVE ----------------
function handleMove(i) {
  if (board[i] || gameOver) return;

  if (mode === "ai") {
    board[i] = player;
    render();
    if (checkEnd()) return;

    status.innerText = "AI thinking...";
    setTimeout(aiMove, 400);
  } else {
    board[i] = currentTurn === "player" ? player : opponent;
    render();
    if (checkEnd()) return;

    currentTurn = currentTurn === "player" ? "opponent" : "player";
    updateStatus();
  }
}

// ---------------- AI ----------------
function aiMove() {
  const move =
    level === "easy" ? easyAI(board) :
    level === "normal" ? normalAI(board) :
    hardAI(board);

  board[move] = opponent;
  render();

  if (!checkEnd()) {
    currentTurn = "player";
    status.innerText = `Your Turn (${player})`;
  }
}

// ---------------- CHECK ROUND ----------------
function checkEnd() {
  const result = check(board);
  if (!result) return false;

  gameOver = true;

  if (result === "tie") {
    drawScore++;
    status.innerText = "🤝 Draw";
  } else if (result === player) {
    youScore++;
    status.innerText = "🎉 You won!";
  } else {
    aiScore++;
    status.innerText = mode === "ai" ? "😢 AI won" : "Player 2 won";
  }

  updateUI();

  if (round >= MAX_ROUNDS) {
    endMatch();
  } else {
    nextRoundBtn.style.display = "block";
  }

  return true;
}

// ---------------- NEXT ROUND ----------------
nextRoundBtn.onclick = () => {
  round++;
  board = Array(9).fill("");
  gameOver = false;
  currentTurn = "player";
  nextRoundBtn.style.display = "none";
  updateUI();
  updateStatus();
  render();
};

// ---------------- END MATCH ----------------
function endMatch() {
  newGameBtn.style.display = "block";

  const result =
    youScore > aiScore ? "Win" :
    aiScore > youScore ? "Loss" : "Draw";

  // Save match
  const match = {
    username,
    date: new Date().toLocaleDateString(),
    opponent: mode === "ai" ? `AI (${level})` : "Player 2",
    mode: mode === "ai" ? "One Player" : "Two Player",
    difficulty: mode === "ai" ? level : "-",
    result,
    score: `${youScore}-${drawScore}-${aiScore}`
  };

  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  matches.push(match);
  localStorage.setItem("matches", JSON.stringify(matches));
}

// ---------------- UI ----------------
function updateUI() {
  roundText.innerText = `ROUND ${round} / ${MAX_ROUNDS}`;
  youScoreEl.innerText = youScore;
  aiScoreEl.innerText = aiScore;
  drawScoreEl.innerText = drawScore;
}

function updateStatus() {
  if (mode === "ai") {
    status.innerText = `Your Turn (${player})`;
  } else {
    status.innerText =
      currentTurn === "player"
        ? `Player 1 (${player})`
        : `Player 2 (${opponent})`;
  }
}

// ---------------- NAV ----------------
backMenuBtn.onclick = () => window.location.href = "home.html";
newGameBtn.onclick = () => window.location.href = "home.html";