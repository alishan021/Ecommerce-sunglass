import express from 'express';
import users from '../models/userModel.js';
import { validationResult, body } from 'express-validator';
import bcrypt from 'bcrypt';
import { comparePassword } from '../helpers/authHelper.js';
import jwt from 'jsonwebtoken';
//import { sign,verify } from 'jsonwebtoken';
import { sendVerifyMail,verifyMail,sendOTP } from '../helpers/mailer.js';
import session from 'express-session';
import products from '../models/product.js';



export const createToken = async(id)=>{
   
         
       // return jwt.sign({_id:id},process.env.JWT_SECRET,{expiresIn: process.env.LOGIN_EXPIRES});
        return jwt.sign({_id:id },process.env.JWT_SECRET,{expiresIn: process.env.LOGIN_EXPIRES});
    }



export const registerValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phone')
        .notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits long'),
    body('password').isStrongPassword({ minLength: 6, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1  }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }
        next();
    }
];

//to get the values from the user
export const register_User = async(req,res)=>{
   try {
      
    const {name,email,phone,password,confirmPassword}= req.body;
    req.session.userEmail = req.body.email;
    req.session.userName= req.body.name;
    req.session.userPhone = req.body.phone;
    req.session.userPassword = req.body.password;
    req.session.userconfirmPassword = req.body.confirmPassword;

    const existingEmail = await users.findOne({ email });
        if (existingEmail) {
            return res.status(200).json({
                success: false,
                message: 'Email already exists,Please update email'
            });
        }
        const isOTPVerified = await sendOTP(req.body.email);;
        console.log(req.body.email);
        const hashPassword = await bcrypt.hash(password, 10)
        req.session.hashPassword = hashPassword;

        if (!isOTPVerified) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please enter a valid OTP.'
            });
        }else{
            res.render('customer/auth/send-otp',{message:'  '})
        }
     

   } catch (error) {
    return res.status(400).json({
        success: false,
        message: 'Error in registration.'
    });
   }
}

//after the otp verification the user registration will be done
export const user_registration = async(req,res)=>{
    try {
        const is_userVerified = req.session.is_userVerified;
        if (is_userVerified) {
            const new_User = await new users({
                name: req.session.userName,
                email: req.session.userEmail,
                phone: req.session.userPhone,
                password: req.session.hashPassword
            }).save();
            req.session.loggedIn = true;
            console.log(req.session.loggedIn);
            if (new_User) {

                const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;

                const productList = await products.find({ isBlocked: true });
                return res.render('home', { productList,userRegistered });
            } else {
                return res.render('register', { message: 'Your registration has failed' });
            }
        } else {
            return res.render('register', { message: 'User is not verified' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: 'Error in registration',
        error
    });
   }
    
}


export const loginController = async(req,res)=>{

    try {

        const{ email,password} = req.body;

        req.session.user_Email = req.body.email;
         //validation

         if(!email||!password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password'
            })
         }
         
         
         
         const user = await users.findOne({email}).select('+password');
         

         if(!user){
            return res.status(404).send({
                success:false,
                message:'Email not registered'
            })
         }
         if(user.isBlocked){
            return res.status(403).send({
                success:false,
                message:'User is blocked'
            })
         }
       
         const matchPassword = await comparePassword(password,user.password)


         if(!matchPassword){
            return res.status(404).send({
                success:false,
                message:'Password is incorrect'
            })
         }

         //Generate token
         
     
         const token = await createToken( {userId:user._id,role:user.role});
        // const token = await createToken( {userId:user._id});
         
         res.cookie('jwt', token, { httpOnly: true, maxAge: 3* 24 * 60 *60 * 1000 });
         
          // Redirect based on user role
        if (user.role === 'admin') {
            // Redirect to admin dashboard
            req.session.admin = true;
            return res.redirect('/admin/admin-dashboard');
        } else {
            // Redirect to user side
            req.session.userLoggedIn = true;
            
            const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;

            console.log(userRegistered);
            const productList = await products.find({isBlocked:true});
            return res.render('home',{productList,userRegistered});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        });
        
    }
}



 
  

