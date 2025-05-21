const socket = io();
const username = localStorage.getItem("username");
const pfp = localStorage.getItem("pfp") || "";

socket.emit("join", username, pfp);

const chatBox = document.getElementById("chatBox");

socket.on("message", ({ username, pfp, message }) => {
  const div = document.createElement("div");
  div.innerHTML = `<img src="${pfp}" width="30" height="30" style="border-radius:50%;vertical-align:middle;margin-right:8px;"> <b>${username}</b>: ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("admin-action", data => {
  if (data.type === "broadcast") {
    alert(data.message);
  }
  if (data.type === "flash") {
    document.body.style.transition = "none";
    let i = 0;
    const flashColors = ["#f00", "#0f0", "#00f", "#fff"];
    const flashInterval = setInterval(() => {
      document.body.style.backgroundColor = flashColors[i++ % flashColors.length];
      if (i > 10) {
        clearInterval(flashInterval);
        document.body.style.backgroundColor = "";
      }
    }, 150);
  }
});

function sendMessage() {
  const msg = document.getElementById("msgInput").value;
  socket.emit("chat", { username, pfp, message: msg });
  document.getElementById("msgInput").value = "";
}

function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}
