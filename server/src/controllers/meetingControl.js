import Meeting from '../models/Meeting.js';
import User    from '../models/User.js';

// Create meeting
export const createMeeting = async (req,res)=>{
  try{
    const {title,duration,scene}=req.body;
    const meet = await Meeting.create({hostId:req.userId,title,duration,scene});
    res.status(201).json({code:meet.code,joinLink:`${process.env.CLIENT_URL}/join/${meet.code}`});
  }catch{
    res.status(500).json({msg:'Server error'});
  }
};

// Unity / front-end fetch full meeting + participants avatar URLs
export const getByCode = async (req,res)=>{
  try{
    const meet = await Meeting.findOne({code:req.params.code})
                              .populate('participants','name tag readyPlayerMeUrl');
    if(!meet) return res.status(404).json({msg:'Meeting not found'});
    res.json(meet);
  }catch{
    res.status(500).json({msg:'Server error'});
  }
};

// Join meeting (add participant)
export const joinMeeting = async (req,res)=>{
  try{
    const meet = await Meeting.findOne({code:req.params.code});
    if(!meet) return res.status(404).json({msg:'Not found'});
    if(!meet.participants.includes(req.userId)){
      meet.participants.push(req.userId);
      await meet.save();
    }
    res.json({msg:'Joined'});
  }catch{
    res.status(500).json({msg:'Server error'});
  }
};