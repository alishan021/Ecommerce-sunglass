import express from 'express';
import { registerController } from '../controllers/authController.js';
import Users from '../models/userModel.js';
import customerRoute from '../routes/customerRoute.js';
import { verifyMail } from '../helpers/mailer.js';
import products from '../models/product.js';
import category from '../models/category.js';

export const getRegister = (req,res)=>{
    res.render('customer/auth/register');
}

export const getHome = async (req,res)=>{
    try {
        const productList = await products.find();
        res.render('home',{productList});
        
    } catch (error) {
        
    }
    
}

export const getHomeProductDetails = async(req,res)=>{
    try {
       
    const productId = req.params.id;
    const productList = await products.findById(productId);
    console.log(productList)

    if (!productList) {
     
      return res.status(404).send('Product not found');
   }
      res.render('home-product-details',{ productList })

    } catch (error) {
        
        res.status(500).send('Internal Server Error');
    }
}

export const getLogin =(req,res)=>{
    
     res.render('customer/auth/login');
}

export const getVerifyMail = (req,res)=>{
    res.render('customer/auth/email-verification');
}

export const getSendOTP = (req,res)=>{
    
    res.render('customer/auth/send-otp',{message})
}

export const  getLogout = (req,res)=>{
    res.render('customer/auth/login');
}


