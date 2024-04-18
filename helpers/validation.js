import {  body } from 'express-validator';

export const otpValidator = [
     body('otp').notEmpty().withMessage('Otp is required'),
];