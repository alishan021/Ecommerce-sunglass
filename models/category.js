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
        trim: true
    },
    desc:{
        type:String,
        required:true,
        trim: true
    }, 
  
});

export default mongoose.model('category',CategorySchema);
