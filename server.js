const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const users = {}; // { username: { password, lastChange, profilePic } }

app.use(express.json());
app.use(express.static(__dirname));

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || username.length < 4 || username.includes(" ")) {
    return res.json({ success: false, message: 'Username must be 4+ chars and no spaces.' });
  }
  if (users[username]) return res.json({ success: false, message: 'Username taken.' });
  users[username] = { password, lastChange: Date.now(), profilePic: '' };
  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username].password !== password) {
    return res.json({ success: false, message: 'Invalid credentials.' });
  }
  res.json({ success: true });
});

io.on('connection', socket => {
  socket.on('join', username => {
    socket.username = username;
  });

  socket.on('chat', data => {
    io.emit('message', data);
  });

  socket.on('upload', fileData => {
    io.emit('upload', fileData);
  });

  socket.on('announcement', msg => {
    io.emit('announcement', msg);
  });

  socket.on('jumpscare', imgUrl => {
    io.emit('jumpscare', imgUrl);
  });

  socket.on('strobe', () => {
    io.emit('strobe');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Sharcord running on port ${PORT}`));
