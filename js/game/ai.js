// ==================== AI.JS ====================

// Easy AI: chooses a random empty cell
function easyAI(board) {
  const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// Normal AI: tries to win/block, otherwise random
function normalAI(board) {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = opponent;
      if (check(board) === opponent) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  // Try to block player
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = player;
      if (check(board) === player) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  // Otherwise, random
  return easyAI(board);
}

// Hard AI: uses minimax algorithm
function hardAI(board) {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = opponent;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move !== undefined ? move : easyAI(board);
}

// Minimax function for Hard AI
function minimax(board, depth, isMaximizing) {
  const result = check(board);
  if (result !== null) {
    if (result === opponent) return 10 - depth;
    if (result === player) return depth - 10;
    if (result === "tie") return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = opponent;
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = player;
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// ==================== HELPER: CHECK WIN ====================
function check(board) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6]          // diagonals
  ];

  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // X or O
    }
  }

  return board.includes("") ? null : "tie";
}

// ==================== OVERRIDE aiMove in board.js ====================
// In board.js, update aiMove function to this:

/*
function aiMove() {
  const move =
    level === "easy" ? easyAI(board) :
    level === "normal" ? normalAI(board) :
    hardAI(board);

  board[move] = opponent;
  render();

  // After AI moves, update status if game not over
  if (!checkEnd()) {
    status.innerText = `Your Turn (${player})`;
  }
}
*/