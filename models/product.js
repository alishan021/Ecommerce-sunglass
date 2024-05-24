import mongoose from 'mongoose';
import category from '../models/category.js';

// Product schema 
const ProductSchema = new mongoose.Schema({
    productid:{
        type:String,
        required:true,
        trim: true
    },

    productname:{
        type:String,
        required:true,
        trim: true
    },
    
     description:{
        type:String,
        required:true,
        trim: true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true,
        trim: true
    },
    image:{
        type:[String],
        required:true
        
    },
     price:{
        type:Number,
        required:true,
        default:1
    },
    isBlocked: {
        type: Boolean,
        default: true  // Default value for new products
    }

});

export default mongoose.model('products',ProductSchema);