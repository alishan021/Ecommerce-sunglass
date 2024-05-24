import express from 'express';

import Users from '../models/userModel.js';
import customerRoute from '../routes/customerRoute.js';
import { sendOTP, verifyMail } from '../helpers/mailer.js';
import products from '../models/product.js';
import category from '../models/category.js';
import generateRandomToken from '../middleware/resetauth.js';
import { sendResetEmail } from '../middleware/resetauth.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';
import otps from '../models/userOtp.js';
import nodemailer from 'nodemailer';
import { cropImageMiddleware } from '../middleware/cropImage.js';





export const getRegister = (req,res)=>{
    res.render('customer/auth/register');
}

export const getGuestUserHome = async (req,res)=>{
    try {
        const productList = await products.find({isBlocked:true});
        res.render('guestuserhome',{productList});
        
    } catch (error) {
        
    }
    
}

export const getHome = async (req,res)=>{
    try { 
       console.log(req.session.LoggedIn);
       if(req.session.loggedIn){

       }
        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
        
        const productList = await products.find({isBlocked:true});

        res.render('home',{productList,userRegistered});
        
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
        
    }
    
}



export const getHomeProductDetails = async(req,res)=>{
   
    try {

     if(req.session.user_Email) 
      {
    const productId = req.params.id;
    const productList = await products.findById(productId);
    console.log(productList)
    const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
    if (!productList) {
     
      return res.status(404).send('Product not found');
   }
      res.render('home-product-details',{ productList, userRegistered});

    } }catch (error) {
        
       // res.status(500).send('Internal Server Error');
       res.render('customer/auth/login');
    }
}

export const getLogin =(req,res)=>{
    
     res.render('customer/auth/login');
}

export const getVerifyMail = (req,res)=>{
    res.render('customer/auth/email-verification');
}

export const getSendOTP = (req,res)=>{
    //res.render('customer/auth/send-otp',{message})
    res.render('customer/auth/send-otp')
}

export const  get_Logout = async(req,res)=>{
  try {
    delete req.session.LoggedIn;
    delete req.session.userLoggedIn;
    res.clearCookie('jwt');
    //delete req.session.loggedIn;
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
            res.send("Error")
        }else{
            req.session.loggedOut = true;
            console.log(req.session.loggedOut);
            
            res.render('customer/auht/login')
        }
    })
    // Clear the JWT token cookie
    
   // console.log('Logout successfully');
    //const productList = await products.find({isBlocked:true});
    //res.render('customer/auth/login');
    //res.render('guestuserhome',{productList});
  } catch (error) {
    
  }
}
export const getLogout = (req, res) => {
    res.clearCookie('jwt');
    delete req.session.loggedIn;
    delete req.session.userLoggedIn;
   
    res.redirect('/login');
};

export const resendOTP = async (req,res) => {
    try {
       const user_email = req.session.userEmail;
        console.log(user_email);
        //user_id = req.session.userid;
        // Call the sendOTP function to resend OTP
        const generated_OTP = await sendOTP(user_email);
        res.render('customer/auth/resend-otp');
    } catch (error) {
        console.log(error.message);
    }
}




export const getForgotPassword = (req,res)=>{
    res.render('customer/auth/forgot-password');
}

export const postForgotPassword = async (req,res)=>{
    try{
        const { email } = req.body;
        // Find user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).send('Email not found');
        }
        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        // Set token expiration time to 1 hour from now
        const resetTokenExpires = Date.now() + 3600000; // 1 hour in milliseconds
        
        console.log(resetToken);
        
        // Save reset token and expiration time to user document
        user.resetPasswordToken = resetToken;
      
        user.resetPasswordExpires = resetTokenExpires;
        
        await user.save();

        
        
        
        // Send email with reset link containing token
        sendResetEmail(req.body.email,resetToken);


        // Replace this with your email sending logic
        res.send('Password reset link send to the mail');


        

    } catch (error) {
       
    
        res.status(500).send('Error in resetting password');
        
    }
}

export const getReset = async (req,res)=>{
    res.render('customer/auth/reset-password');
}

export const getResetPassword = async (req,res)=>{
   try {
    const { resetToken } = req.params;
        // Find user by reset token and check if token is valid and not expired
        const user = await Users.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(404).send('Invalid or expired token');
        }
        // Render reset password form with token as hidden input
        res.render('customer/auth/reset-password', { resetToken });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in resetting password');
    }
}

export const postResetPassword = async(req,res)=>{
    try {
        const { resetToken } = req.params;
        const { newPassword } = req.body;
        

        // Find user by reset token and check if token is valid and not expired
        const user = await Users.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(404).send('Invalid or expired token');
        }
        // Hash new password and update user document
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        // Clear reset token and expiration time
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.send('Password reset successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in resetting password');
    }
}

