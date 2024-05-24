import { name } from 'ejs';
import nodemailer from 'nodemailer';
import users from '../models/userModel.js';
import otps from '../models/userOtp.js';
import products from '../models/product.js';
import session from 'express-session';
import otpGenerator from 'otp-generator';
import { user_registration } from '../controllers/authController.js';


  
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

export const verify_Otp = async(req,res)=>{
    try{
        const { otp } = req.body;
       
        req.session.old_otp = req.body.otp;
       
         const otp_Data = await otps.findOne({otp})
         
         console.log(otp_Data)
         if(!otp_Data){
             res.render('customer/auth/send-otp',{message: 'Invalid otp'})
         }
         else
         if (new Date() > otp_Data.expiresAt) {
 
             // OTP has expired
             const otp_Expired = true;
             res.render('customer/auth/send-otp',{message: 'OTP expired'})
         }
        
         //clear the database after OTP verification
         console.log(req.session.userEmail);
         await otps.deleteOne({email:req.session.userEmail,otp})

        req.session.is_userVerified = true; 
        
       await  user_registration(req,res);

    }
    catch (error) {
        res.render('customer/auth/send-otp',{message: 'An error occured while verifying the otp'})
        
    }
}

//to verify the otp send


 


export const sendOTP = async (email) => {
    try {
        // Find existing OTP document for the email
        let otpDoc = await otps.findOne({ email });

        if (!otpDoc || otpDoc.expiresAt < new Date()) {
            // OTP doesn't exist or has expired, generate a new OTP
            const generated_OTP = await otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false
            });

            // Create or update OTP document with new expiration time
            if (otpDoc) {
                otpDoc.otp = generated_OTP;
                otpDoc.expiresAt = new Date(Date.now() + 1 * 60 * 1000); // Set expiration time 1 minute from now
                await otpDoc.save();
            } else {
                otpDoc = await otps.create({ email, otp: generated_OTP, expiresAt: new Date(Date.now() + 1 * 60 * 1000) });
            }

            // Send OTP via email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'asma.shajan@gmail.com',
                    pass: 'mqet mxyz lvvj koze'
                }
            });

            const mailOptions = {
                from: 'asma.shajan@gmail.com',
                to: email,
                subject: 'OTP successfully sent to the mail',
                text: `Your Otp is ${generated_OTP}`
            };

            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('OTP Sent', info.messageId);
                }
            });

            return generated_OTP;
        } else {
            // OTP is still valid, no need to resend
            return { error: 'Cannot resend OTP within the expiration time.', redirectURL: '/customer/auth/send-otp' };
        }
    } catch (error) {
        console.log(error.message);
    }
}
