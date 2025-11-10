// server.js  (the librarian wakes up)
require('dotenv').config();
const express = require('express');
const cors    = require('cors');


const User   = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');


const app = express();
app.use(cors());                 // allow pages to call us
app.use(express.json());         // understand JSON bodies

// ---- tiny health-check ----
app.get('/api', (req, res) => res.json({ message:'Nexus back-office is open!' }));


// ---- SIGN UP ----
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. check duplicate
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    // 2. hash password
    const hashed = await bcrypt.hash(password, 12);

    // 3. create user
    const user = await User.create({ username, email, password: hashed });

    // 4. give them a stamp (JWT)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---- LOG IN ----
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // 2. check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });

    // 3. give token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});






// ---- WHO AM I? (protected) ----
const auth = (req, res, next) => {
  const head = req.headers.authorization;
  if (!head) return res.status(401).json({ error: 'No token' });

  const token = head.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Bad token' });
  }
};

app.get('/api/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});




// ---- UPDATE PROFILE (protected) ----
app.put('/api/profile', auth, async (req, res) => {
  try {
    const updates = req.body; // { username, tag, profilePic, ... }
    const user  = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});







// ---- SAVE AVATAR (protected) ----
app.post('/api/avatar', auth, async (req, res) => {
  try {
    const { avatarUrl, character } = req.body; // avatarUrl = GLB link, character = file name
    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatarUrl, character },
      { new: true }
    ).select('-password');
    res.json({ message: 'Avatar saved', user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});




// ---- UNITY AVATAR BRIDGE (protected) ----
app.get('/api/unity/avatar', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('username avatarUrl character');
  if (!user.avatarUrl) return res.status(404).json({ error: 'No avatar' });
  res.json({
    username: user.username,
    avatarUrl: user.avatarUrl,
    character: user.character
  });
});


// ---- plug in database FIRST ----
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('📚  Bookshelf connected'))
  .catch(err => console.error('❌  Bookshelf error:', err));

// ---- THEN open the doors ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Librarian ready on http://localhost:${PORT}`));
