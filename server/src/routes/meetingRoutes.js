import express from 'express';
import { auth } from '../middlewares/auth.js';
import { createMeeting, getByCode, joinMeeting } from '../controllers/meetingController.js';
const router = express.Router();

router.post('/',        auth, createMeeting);       // POST /api/meetings
router.get ('/:code',   auth, getByCode);           // GET  /api/meetings/ABCD1234
router.patch('/:code',  auth, joinMeeting);         // PATCH/api/meetings/ABCD1234  (join)

export default router;