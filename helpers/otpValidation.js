
export const threeMinuteExpiryOtp = async (otp_Time)=>{
    try{
       console.log("TimeStamp is:"+otp_Time)
       
       const current_date_Time = new Date()

       const differenceValue = (otp_Time - current_date_Time.getTime())/1000;

       differenceValue /=60;

       if(Math.abs(differenceValue)>1){
         return true;
       }
       return false;
    }
    catch(error){

    }
}