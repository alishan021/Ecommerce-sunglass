
import mongoose from 'mongoose';
import validator from 'validator';

//create a userschema
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true,'Name is required'],
      trim : true
    },
    
   
    email: {
      type: String,
      required: true,
      unique :true,
      lowercase:true,
      validate:[validator.isEmail,'PLease enter a valid email']
    },

    password: {
        type: String,
        required:[true,'Please enter a password'],
        minlength:6,
        select:false 

    },
    phone:{
        type: Number,
        required:true
     
      },
    
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },

    isAdmin:{
       type:Boolean,
       default:false
    },
    
    is_Verified:{
      type:Number,
      default:0 //1 verified
    },
    isBlocked: {
      type: Boolean,
      default: false  // Default value for new users
  },

  resetPasswordToken:{
    type: String,
    default:null
  },

  resetPasswordExpires: {
    type: Date,
    default:null
  }
   
  },{timestamps:true});

  

  //const user = mongoose.model('user',userSchema);
  export default mongoose.model('users',userSchema);
  //export default user;
  