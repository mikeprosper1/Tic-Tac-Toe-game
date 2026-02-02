// ===== USER INFO =====
const username = localStorage.getItem("username") || "Player";
document.getElementById("username").innerText = username;

// ===== PROFILE PICTURE =====
const profilePic = document.getElementById("profilePic");
const savedPic = localStorage.getItem(`${username}_profilePic`);
if(savedPic) profilePic.src = savedPic;

profilePic.onclick = () => {
  const file = document.createElement("input");
  file.type = "file";
  file.accept = "image/*";
  file.onchange = e => {
    const reader = new FileReader();
    reader.onload = () => {
      profilePic.src = reader.result;
      localStorage.setItem(`${username}_profilePic`, reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
  }
  file.click();
}

// ===== OVERVIEW STATISTICS =====
function updateOverview() {
  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const userMatches = matches.filter(m => m.username === username);

  const totalMatches = userMatches.length;
  const totalWins = userMatches.filter(m => m.result === "Win").length;
  const winRate = totalMatches ? Math.round((totalWins / totalMatches) * 100) : 0;

  document.getElementById("totalMatches").innerText = totalMatches;
  document.getElementById("totalWins").innerText = totalWins;
  document.getElementById("winRate").innerText = winRate + "%";
}

// Initial render & live update
updateOverview();
setInterval(updateOverview, 1000);

// NAVIGATION
function backHome() {
  window.location.href = "home.html";
}