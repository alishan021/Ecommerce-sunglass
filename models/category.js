import mongoose from 'mongoose';

//Category Schema

 const CategorySchema = new  mongoose.Schema({

    id:{
       type:String,
       required:true
    },

    title:{
        type:String,
        required:true,
        trim: true,
        unique:true,
        collation: { locale: 'en', strength: 2 }
    },
    desc:{
        type:String,
        required:true,
        trim: true
    }, 

    is_Soft_Delete:{
        type: Boolean,
        default:false
    }
  
});

export default mongoose.model('category',CategorySchema);
