import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const MeetingSchema = new mongoose.Schema({
  hostId:      { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  title:       { type: String, required:true },
  duration:    { type: Number, min:1, max:180 }, // minutes
  scene:       { type: String, default:'conference-room' },
  code:        { type: String, default:()=> nanoid(8).toUpperCase(), unique:true },
  participants:[{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
  status:      { type: String, enum:['scheduled','live','ended'], default:'scheduled' },
  scheduledAt: { type: Date, default:Date.now }
},{ timestamps:true });

export default mongoose.model('Meeting', MeetingSchema);