// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const users = {}; // username => password

app.use(express.json());
app.use(express.static(__dirname));

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.json({ success: false, message: 'Username already exists.' });
  users[username] = password;
  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] !== password) return res.json({ success: false, message: 'Invalid credentials.' });
  res.json({ success: true });
});

io.on('connection', socket => {
  socket.on('join', username => {
    socket.username = username;
  });

  socket.on('chat', data => {
    io.emit('message', data);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Sharcord running on port ${PORT}`));
