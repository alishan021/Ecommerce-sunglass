import crypto from 'crypto';
import users from '../models/userModel.js';
import nodemailer from 'nodemailer';

//for ressetting the password
export const generateResetToken = async(req,res,next)=>{
    const user = await users.findOne({ email });
    if (!user) throw new Error('User not found');

    // Generate a random token
    const token = crypto.randomBytes(20).toString('hex');
    
    // Set token expiration time (e.g., 1 hour)
    const expirationTime = Date.now() + 3600000; // 1 hour
    
    // Update user document with token and expiration time
    users.reset_Password_Token = token;
    users.reset_Password_Expires = expirationTime;
    await users.save();

    return token;
}

//generating random token for resetting password
async function generateRandomToken() {
    // Generate a random token (e.g., using crypto module)
    const token = Math.random().toString(36).substring(2);
    return token;
}



export const sendResetEmail = async(email, resetToken)=> {

   
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'asma.shajan@gmail.com',
                pass:'mqet mxyz lvvj koze'
        }
    });

    // Email options
    const mailOptions = {
        from: 'asma.shajan@gmail.com', // Sender email address
        to: email, // Recipient email address
        subject: 'Password Reset', // Subject of the email
        text: `Click on the following link to reset your password:http://localhost:8080/reset-password/${resetToken}` // Email body with the password reset link
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}




export default generateRandomToken;
