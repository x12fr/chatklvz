const socket = io();
const username = localStorage.getItem("username");
const pfp = localStorage.getItem("pfp") || "";

socket.emit("join", username, pfp);

const chatBox = document.getElementById("chatBox");

socket.on("message", ({ username, pfp, message, file, fileName, fileType }) => {
  const div = document.createElement("div");

  if (file) {
    if (fileType.startsWith("image/")) {
      div.innerHTML = `
        <img src="${pfp}" width="30" height="30" style="border-radius:50%;vertical-align:middle;margin-right:8px;">
        <b>${username}</b>: <br><img src="${file}" style="max-width:200px; border-radius: 8px;">`;
    } else {
      div.innerHTML = `
        <img src="${pfp}" width="30" height="30" style="border-radius:50%;vertical-align:middle;margin-right:8px;">
        <b>${username}</b>: <br><a href="${file}" download="${fileName}">Download ${fileName}</a>`;
    }
  } else {
    div.innerHTML = `<img src="${pfp}" width="30" height="30" style="border-radius:50%;vertical-align:middle;margin-right:8px;"> <b>${username}</b>: ${message}`;
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

function sendMessage() {
  const msg = document.getElementById("msgInput").value;
  if (!msg.trim()) return;
  socket.emit("chat", { username, pfp, message: msg });
  document.getElementById("msgInput").value = "";
}

function sendFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const fileData = {
      username,
      pfp,
      file: reader.result,
      fileName: file.name,
      fileType: file.type,
    };
    socket.emit("file-upload", fileData);
  };
  reader.readAsDataURL(file); // Encodes file as base64
}

function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}
