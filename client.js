const socket = io();

document.getElementById("chatForm").onsubmit = e => {
  e.preventDefault();
  const msg = document.getElementById("message").value;
  socket.emit("chat", { username, msg, pic: profilePic });
  document.getElementById("message").value = "";
};

document.getElementById("uploadInput").addEventListener("change", () => {
  const file = document.getElementById("uploadInput").files[0];
  const reader = new FileReader();
  reader.onload = () => {
    socket.emit("upload", { file: reader.result, name: file.name });
  };
  reader.readAsDataURL(file);
});

socket.on("message", data => {
  const msg = document.createElement("div");
  msg.innerHTML = `<img src="${data.pic}" class="avatar"> <strong>${data.username}</strong>: ${data.msg}`;
  document.getElementById("chatBox").appendChild(msg);
});

socket.on("upload", data => {
  const item = document.createElement("div");
  if (data.file.startsWith("data:image")) {
    item.innerHTML = `<strong>${data.name}</strong><br><img src="${data.file}" class="chat-image">`;
  } else {
    item.innerHTML = `<a download="${data.name}" href="${data.file}">${data.name}</a>`;
  }
  document.getElementById("chatBox").appendChild(item);
});

socket.on("announcement", msg => {
  const banner = document.createElement("div");
  banner.innerText = msg;
  banner.className = "announcement";
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 8000);
});

socket.on("jumpscare", imgUrl => {
  const scare = document.createElement("img");
  scare.src = imgUrl;
  scare.className = "jumpscare";
  document.body.appendChild(scare);
  setTimeout(() => scare.remove(), 4000);
});

socket.on("strobe", () => {
  const interval = setInterval(() => {
    document.body.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }, 100);
  setTimeout(() => {
    clearInterval(interval);
    document.body.style.backgroundColor = '';
  }, 3000);
});
