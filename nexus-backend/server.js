require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// ---- logger (enhanced) ----
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url} | body:`, req.body);

  // Hook into res.send to log the response
  const oldSend = res.send;
  res.send = function (data) {
    console.log(`[${now}] Response:`, data.toString());
    oldSend.apply(res, arguments);
  };

  next();
});

// ---- TEST ROUTE ----
app.get('/api', (req, res) => res.json({ message: 'Nexus back-office is open!' }));

// ---- REGISTER ----
app.post('/api/register', async (req, res) => {
  try {
    const { username, tag, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'Missing fields' });

    // Check for duplicate email
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    // Hash password and create user
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, tag, email, password: hashed });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, username, email, tag },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---- LOGIN ----
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email, tag: user.tag } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---- AUTH MIDDLEWARE ----
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ---- GET CURRENT USER ----
app.get('/api/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ---- UPDATE PROFILE ----
app.put('/api/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---- CONNECT DATABASE ----
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('📚 Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));









// >>>  PUT  /api/profile  (inside server.js)  <<<
app.put('/api/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true
    }).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (e) {
    /*  Mongo duplicate  */
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern)[0];
      return res.status(409).json({ error: `${field} already taken` });
    }
    res.status(500).json({ error: e.message });
  }
});