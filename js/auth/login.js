function login() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter username");

  localStorage.setItem("username", username);
  window.location.href = "home.html";
}
