import mongoose from 'mongoose'
import users from '../models/userModel.js';

const adminSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  });
  
  export default mongoose.model('Admin', adminSchema);
  