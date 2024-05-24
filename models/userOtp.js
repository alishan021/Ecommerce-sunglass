import mongoose from 'mongoose'
import users from '../models/userModel.js';

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        ref:'users',
    },
    otp:{
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        // Set the default expiration time to 1 minutes from the current time
        default: () => new Date(Date.now() + 1 * 60 * 1000) // 1 minutes in milliseconds
    },
    OTPAttempts:{
        type: Number,
        default:0
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    blockUntil:{
        type: Date
    },
    
});


export default mongoose.model('OTP',otpSchema);