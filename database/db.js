import mongoose from 'mongoose';

//Database Connection

const Connection = async()=>{
    try{

       const URL= process.env.MONGO_URL;
       mongoose.set('strictQuery',false);
       await mongoose.connect(URL);
       console.log('Database connected successfully');
       
    }
    catch(error){
        console.log("Error in connecting database")
    }
}

export default Connection;