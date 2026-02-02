// ===== USER INFO =====
// ===== CHECK LOGIN =====
const username = localStorage.getItem("username");
if (!username) {
  // User not logged in, redirect to login page
  window.location.href = "login.html"; // replace with your login page filename
}

// If logged in, show welcome message
document.getElementById("welcome").innerText = `Welcome, ${username}`;

// ===== PROFILE PICTURE =====
const profileImg = document.getElementById("profileImg");
const savedProfile = localStorage.getItem("profilePic");
if (savedProfile) profileImg.src = savedProfile;

profileImg.onclick = () => {
  const file = document.createElement("input");
  file.type = "file";
  file.accept = "image/*";
  file.onchange = e => {
    const reader = new FileReader();
    reader.onload = () => {
      profileImg.src = reader.result;
      localStorage.setItem("profilePic", reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  file.click();
};

// ===== SYMBOL SELECTION =====
let symbol = localStorage.getItem("player") || "X";
const btnX = document.getElementById("btnX");
const btnO = document.getElementById("btnO");

function updateSymbolUI() {
  btnX.classList.remove("selected");
  btnO.classList.remove("selected");
  if (symbol === "X") btnX.classList.add("selected");
  else btnO.classList.add("selected");
}
updateSymbolUI();

function chooseSymbol(s) {
  symbol = s;
  localStorage.setItem("player", s);
  updateSymbolUI();
}

// ===== SECTIONS =====
const symbolSection = document.getElementById("symbolSection");
const modeSection = document.getElementById("modeSection");
const aiSection = document.getElementById("aiSection");
const statsSection = document.getElementById("statsSection");

// ===== OPEN AI LEVELS =====
function openOnePlayer() {
  modeSection.classList.add("hidden");
  aiSection.classList.remove("hidden");
}

// ===== GO BACK TO MODES =====
function goBack() {
  aiSection.classList.add("hidden");
  modeSection.classList.remove("hidden");
}

// ===== START AI GAME =====
function startGame(level) {
  localStorage.setItem("level", level);
  localStorage.setItem("mode", "ai");
  window.location.href = "game.html";
}

// ===== LOCAL 2 PLAYER =====
function startLocal() {
  localStorage.setItem("mode", "local");
  window.location.href = "game.html";
}

// ===== ONLINE MODE =====
function startOnline() {
  localStorage.setItem("mode", "online");
  alert("Online mode coming soon 🚧");
}

// ===== VIEW STATISTICS =====
function viewStats() {
  symbolSection.classList.add("hidden");
  modeSection.classList.add("hidden");
  statsSection.classList.remove("hidden");

  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const userMatches = matches.filter(m => m.username === username);

  // Totals
  const total = userMatches.length;
  const wins = userMatches.filter(m => m.result === "Win").length;
  const rate = total ? Math.round((wins / total) * 100) : 0;

  document.getElementById("totalMatches").innerText = `Total Matches: ${total}`;
  document.getElementById("totalWins").innerText = `Wins: ${wins}`;
  document.getElementById("winRate").innerText = `Win Rate: ${rate}%`;

  // History cards
  const historyContainer = document.getElementById("historyContainer");
  historyContainer.innerHTML = "";

  // Most recent first
  userMatches.reverse().forEach(m => {
    const card = document.createElement("div");
    card.className = "match-card";
  card.innerHTML = `
  <div class="match-card-line"><strong>Date:</strong> <span>${m.date}</span></div>
  <div class="match-card-line"><strong>Opponent:</strong> <span>${m.opponent}</span></div>
  <div class="match-card-line"><strong>Mode:</strong> <span>${m.mode}</span></div>
  <div class="match-card-line"><strong>Difficulty:</strong> <span>${m.difficulty || "-"}</span></div>
  <div class="match-card-line"><strong>Result:</strong> <span>${m.result}</span></div>
  <div class="match-card-line"><strong>Score:</strong> <span>${m.score}</span></div>
`;
    historyContainer.appendChild(card);
  });
}

// ===== CLOSE STATISTICS =====
function closeStats() {
  statsSection.classList.add("hidden");
  symbolSection.classList.remove("hidden");
  modeSection.classList.remove("hidden");
}

// ===== OPEN PROFILE =====
function openProfile() {
  window.location.href = "profile.html";
}