const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:  { type:String, required:true, unique:true },
  email:     { type:String, required:true, unique:true },
  password:  { type:String, required:true },        // we’ll hash it
  avatarUrl: { type:String, default:'' },           // RPM GLB url
  rpmId:     { type:String, default:'' },           // ReadyPlayerMe id
  character: { type:String, default:'' },           // Unity file name
  tag:       { type:String, default:'' },
  profilePic:{ type:String, default:'' }
}, { timestamps:true });

module.exports = mongoose.model('User', UserSchema);