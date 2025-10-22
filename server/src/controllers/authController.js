import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ACCESS_SECRET, REFRESH_SECRET } from '../config/secrets.js';

const generateTokens = (user) => {
  const access  = jwt.sign({ uid: user.id }, ACCESS_SECRET,  { expiresIn: '15m' });
  const refresh = jwt.sign({ uid: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
  return { access, refresh };
};

export const register = async (req, res) => {
  try {
    const { name, email, password, tag } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash, tag });
    const { access, refresh } = generateTokens(user);
    res.cookie('rt', refresh, { httpOnly: true, sameSite: 'Strict' });
    res.status(201).json({ accessToken: access, user: { id: user.id, name, tag, scene: user.scene } });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ msg: 'Email already in use' });
    res.status(500).json({ msg: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ msg: 'Invalid credentials' });

    const { access, refresh } = generateTokens(user);
    res.cookie('rt', refresh, { httpOnly: true, sameSite: 'Strict' });
    res.json({ accessToken: access, user: { id: user.id, name: user.name, tag: user.tag, scene: user.scene } });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
};