import { name } from 'ejs';
import nodemailer from 'nodemailer';
import users from '../models/userModel.js';
import OTP from '../models/userOtp.js';

import otpGenerator from 'otp-generator';
import { threeMinuteExpiryOtp} from './otpValidation.js';


  
export const sendVerifyMail = async (name,email,user_id)=>{

    try{



        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'asma.shajan@gmail.com',
                pass:'mqet mxyz lvvj koze'
            }
        })

        
        
        var mailOptions ={
            from: 'asma.shajan@gmail.com',
            to:email,
            subject: 'For verification mail',
            html: '<p>Hi '+ name +',Please click here to <a href="http://localhost:8080/email-verification?id='+user_id+'">Verify </a>your mail </p>',
              
        };

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }

            console.log('Mail Sent',info.messageId)
        })
    }
    catch(error){
        console.log(error.message)
    }

}

export const verifyMail = async(req,res)=>{
    try{
      const updatedInfo = await users.updateOne({_id:req.query.id},{$set:{is_Verified:1}})
      console.log(updatedInfo);
      res.render('customer/auth/email-verification')
     
    }
    catch(error){
      console.log(error.message)
    }
}

//export default transporter;

export const sendOTP= async (email, user_id) =>{
    try{
        
        const generated_OTP = await otpGenerator.generate(6,
            { upperCaseAlphabets: false, 
               specialChars: false,
               lowerCaseAlphabets: false
            });
            
            console.log(generated_OTP);

            //Save otp to the database
            const otpDoc = await OTP.create({ email, otp: generated_OTP });

        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'asma.shajan@gmail.com',
                pass:'mqet mxyz lvvj koze'
            }
        });

        

             var mailOptions ={
                from: 'asma.shajan@gmail.com',
                to:email,
                subject: 'OTP successfully sent to the mail',
                text:`Your Otp is ${generated_OTP}`  
            };
    
            transporter.sendMail(mailOptions,async (error,info)=>{
                if(error){
                    console.log(error)
                }
               
                console.log('OTP Sent',info.messageId)
                

               
                
            })

            
            return generated_OTP;


   
        
    }
    catch(error){
        console.log(error.message);
    }
}

//to verify the otp send

export const verifyOtp = async (req,res)=>{
    try {
        
       

        const { email,otp } = req.body;
        console.log(email,otp);

        const otp_Data = await OTP.findOne({
            
            email,
            otp
        })
        console.log(otp_Data)
        if(!otp_Data){
            res.render('customer/auth/send-otp',{message: 'Invalid otp'})
        }

        if (new Date() > otp_Data.expiresAt) {
            // OTP has expired
            res.render('customer/auth/send-otp',{message: 'OTP expired'})
        }
        
        //clear the database after OTP verification

        await OTP.deleteOne({email,otp})

       // await users.findByIdAndUpdate({_id: user_id},
         //  {$set : {is_Verified :1}
        //});
       
        return res.render('home');
       

    } catch (error) {
        res.render('customer/auth/send-otp',{message: 'An error occured while verifying the otp'})
        
    }
}
