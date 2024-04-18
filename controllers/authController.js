import express from 'express';
import users from '../models/userModel.js';
import { validationResult, body } from 'express-validator';
import bcrypt from 'bcrypt';
import { comparePassword } from '../helpers/authHelper.js';
import jwt from 'jsonwebtoken';
//import { sign,verify } from 'jsonwebtoken';
import { sendVerifyMail,verifyMail,sendOTP } from '../helpers/mailer.js';



export const createToken = async(id)=>{
   
         
        return jwt.sign({_id:id},'secret_key',{expiresIn: process.env.LOGIN_EXPIRES});
       
    }



export const registerValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phone').isLength({ min:10,max:10 }).notEmpty().withMessage('Phone number is required'),
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

export const registerController = async (req, res) => {
    try {
        const { name, email, phone, password ,confirmPassword } = req.body;

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: 'Email already exists,Please update email'
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await new users({
            name: name,
            email: email,
            phone: phone,
            password: hashPassword
        }).save();

        // Creating jwt token for the newUser
        
         const token = await createToken(newUser._id)
        
         res.cookie('jwt', token, { httpOnly: true, maxAge: 3* 24* 60* 60 * 1000 });
      
        
        if(newUser){

            sendVerifyMail(req.body.name,req.body.email,newUser._id);

           
            sendOTP(req.body.email);
            
            const message = `${newUser.name} is registered successfully`;
            res.render('customer/auth/send-otp', { message});

            }
        else{
            res.render('register',{message:"Your registration has been failed"})
        }
       
       
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in registration',
            error
        });
    }
};

export const loginController = async(req,res)=>{

    try {

        const{ email,password} = req.body;
         //validation

         if(!email||!password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password'
            })
         }

         //check the user

         const user = await users.findOne({email}).select('+password')

         if(!user){
            return res.status(404).send({
                success:false,
                message:'Email not registered'
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
         
     
         const token = await createToken( user._id)
         
         res.cookie('jwt', token, { httpOnly: true, maxAge: 3* 24 * 60 *60 * 1000 });

         res.status(200).send({
            success:true,
            message:'Login Successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                accessToken: token,
            }
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        });
        
    }
}

export const logout = (req,res)=>{
    res.cookie('jwt','', { maxAge: 1 });
    //res.clearCookie('jwt')
    res.render('customer/auth/login');
}



 
  

