// client.js
const socket = io();

let currentUsername = localStorage.getItem('username');

if (window.location.pathname.includes('chat.html')) {
  if (!currentUsername) window.location.href = 'index.html';
  socket.emit('join', currentUsername);

  socket.on('message', data => {
    const div = document.createElement('div');
    div.textContent = `${data.username}: ${data.message}`;
    document.getElementById('messages').appendChild(div);
  });
}

function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json()).then(data => {
    if (data.success) {
      localStorage.setItem('username', username);
      window.location.href = 'chat.html';
    } else alert(data.message);
  });
}

function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json()).then(data => {
    if (data.success) window.location.href = 'index.html';
    else alert(data.message);
  });
}

function sendMessage() {
  const input = document.getElementById('message-input');
  const message = input.value;
  if (!message) return;
  socket.emit('chat', { username: currentUsername, message });
  input.value = '';
}

function sendFile() {
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
  if (!file) return alert('No file selected');
  const reader = new FileReader();
  reader.onload = () => {
    socket.emit('chat', { username: currentUsername, message: `[File] ${file.name} - ${reader.result}` });
  };
  reader.readAsDataURL(file);
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

function changeUsername() {
  const newUsername = prompt('Enter new username (once every 3 days):');
  const lastChange = localStorage.getItem('lastUsernameChange');
  if (lastChange && Date.now() - parseInt(lastChange) < 259200000) {
    alert('You can only change your username every 3 days.');
    return;
  }
  if (newUsername) {
    localStorage.setItem('username', newUsername);
    localStorage.setItem('lastUsernameChange', Date.now().toString());
    currentUsername = newUsername;
    alert('Username changed. Refreshing...');
    location.reload();
  }
}
