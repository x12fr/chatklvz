// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const users = {}; // username => { password, pfp, lastUsernameChange }
const ADMIN_KEY = "mySecretAdminKey123"; // Change this key!

app.use(express.json());
app.use(express.static(__dirname));

app.post('/register', (req, res) => {
  const { username, password, profilePic } = req.body;
  if (!username || username.length < 4 || /\s/.test(username)) {
    return res.json({ success: false, message: 'Invalid username (min 4 chars, no spaces).' });
  }
  if (users[username]) {
    return res.json({ success: false, message: 'Username already exists.' });
  }
  users[username] = { password, pfp: profilePic || '', lastUsernameChange: Date.now() };
  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { username, password, adminKey } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res.json({ success: false, message: 'Invalid credentials.' });
  }
  const isAdmin = adminKey === ADMIN_KEY;
  res.json({ success: true, isAdmin, profilePic: user.pfp });
});

app.post('/change-username', (req, res) => {
  const { oldUsername, newUsername } = req.body;
  if (!newUsername || newUsername.length < 4 || /\s/.test(newUsername)) {
    return res.json({ success: false, message: 'Invalid new username.' });
  }
  const user = users[oldUsername];
  if (!user) return res.json({ success: false, message: 'User not found.' });

  const now = Date.now();
  if (now - user.lastUsernameChange < 259200000) {
    return res.json({ success: false, message: 'Username can only be changed every 3 days.' });
  }

  if (users[newUsername]) {
    return res.json({ success: false, message: 'New username already taken.' });
  }

  users[newUsername] = { ...user, lastUsernameChange: now };
  delete users[oldUsername];
  res.json({ success: true });
});

io.on('connection', socket => {
  socket.on('join', (username, pfp) => {
    socket.username = username;
    socket.pfp = pfp;
  });

  socket.on('chat', data => {
    io.emit('message', data);
  });

  socket.on('admin-command', data => {
    io.emit('admin-action', data);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Sharcord running on port ${PORT}`));
