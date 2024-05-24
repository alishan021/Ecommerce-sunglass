import express from 'express';
const router= express.Router();



import { getRegister,getHome,getGuestUserHome,getLogin,resendOTP, getVerifyMail,getSendOTP,getLogout, getHomeProductDetails, getForgotPassword, getResetPassword,getReset, postForgotPassword, postResetPassword } from '../controllers/customerController.js';
import { loginController, user_registration, register_User} from '../controllers/authController.js';
import { registerValidator } from '../controllers/authController.js';
import { sendOTP, verifyMail , verify_Otp} from '../helpers/mailer.js';
import { requireAuth,checkUserLoggedIn, checkUserNotLoggedIn,checkBlockedUser} from '../middleware/auth.js';



import { otpValidator } from '../helpers/validation.js';
import userOtp from '../models/userOtp.js';


//rendering the first user guest home page
router.get('/',getGuestUserHome);
//home route

router.get('/home',checkUserLoggedIn,requireAuth,checkBlockedUser,getHome);




//getiing product details when clicked
router.get('/home-product-details/:id',requireAuth,checkBlockedUser,getHomeProductDetails);

//register route
//router.route('/register').get(requireAuth,getRegister).post( registerValidator,registerController);
router.route('/register').get(getRegister).post(register_User,verify_Otp,user_registration);
//login route
router.get('/login',checkUserNotLoggedIn,getLogin);


//post login route
router.post('/login',loginController);

//to get verify email
router.get('/email-verification',requireAuth,verifyMail,getVerifyMail)

//to send and get  otp
//router.route('/send-otp').get(requireAuth,getSendOTP).post(requireAuth,verifyOtp);
//router.route('/sent-otp').get(requireAuth,getSendOTP).post(verify_Otp,user_registration);
router.get('/send-otp',requireAuth,getSendOTP);
router.post('/send-otp',verify_Otp,user_registration);
//to resend otp
router.get('/resend-otp',requireAuth,resendOTP);
router.post('/resend-otp',verify_Otp,user_registration);

//forgot-password
router.get('/forgot-password',requireAuth,getForgotPassword);
router.post('/forgot-password',requireAuth,postForgotPassword);

//reset-password
router.get('/reset-password',requireAuth,getReset);
router.get('/reset-password/:resetToken',requireAuth,getResetPassword);
router.post('/reset-password/:resetToken',requireAuth,postResetPassword);

// to logout
router.get('/logout',getLogout);





export default router;
