import jwt from 'jsonwebtoken';
import { ACCESS_SECRET } from '../config/secrets.js';

export const auth = (req, res, next) => {
  const hdr = req.headers.authorization;
  if (!hdr) return res.status(401).json({ msg: 'No token' });

  const token = hdr.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.userId = decoded.uid;
    next();
  } catch {
    return res.status(401).json({ msg: 'Token invalid' });
  }
};