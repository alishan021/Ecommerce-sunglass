import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import Connection from './database/db.js';
import customerRoute from './routes/customerRoute.js'
import adminRoute from './routes/adminRoute.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import path from 'path';
import session from 'express-session';
import nocache from 'nocache';


//configure env
dotenv.config();

//database connection
Connection();

const app= express();

//Middleware
app.use(nocache());
app.use(session({
    secret: 'sunglass-ecommerce', // Change this to a random secret key
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(session({
    secret: 'sunglass-ecommerce', // Change this to a random secret key
    resave: false,
    saveUninitialized: false
}));

//set the view engine

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(nocache());



app.use(express.urlencoded({ extended: true }));

app.use('/',customerRoute);
app.use('/admin',adminRoute);




const PORT= process.env.PORT||8080;

app.listen(PORT,()=>{
    console.log(`Server listening  on running ${process.env.DEV_MODE} on  to the PORT ${PORT}`);
})
