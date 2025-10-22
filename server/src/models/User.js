import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  passwordHash:{ type: String, required: true },
  tag:         { type: String, required: true },
  readyPlayerMeUrl: String,   // <-- hidden from front-end
  scene:       { type: String, default: 'conference-room' },
  settings:{
    skinColor: { type: String, default: '#F1C27D' },
    hair:      { type: String, default: 'Short' },
    gender:    { type: String, default: 'male' },
    bodyType:  { type: String, default: 'average' }
  },
  isVerified:  { type: Boolean, default: true }, // demo: skip e-mail
  refreshTokens:[String]
},{ timestamps:true });

export default mongoose.model('User', UserSchema);