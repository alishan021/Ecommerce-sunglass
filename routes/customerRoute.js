import express from 'express';
const router= express.Router();



import { getRegister,getHome,getLogin, getVerifyMail,getSendOTP,getLogout, getHomeProductDetails } from '../controllers/customerController.js';
import { registerController,loginController ,logout    } from '../controllers/authController.js';
import { registerValidator } from '../controllers/authController.js';
import { verifyMail , verifyOtp} from '../helpers/mailer.js';
import { verifyToken ,checkUser} from '../middleware/auth.js';

import { otpValidator } from '../helpers/validation.js';



//home route
router.get('/',getHome);
//getiing product details when clicked
router.get('/home-product-details/:id',getHomeProductDetails);
//checking all routes
router.get('*',checkUser)
//register route
router.route('/register').get(getRegister).post( registerValidator,registerController);

//login route
router.get('/login',getLogin);

//post login route
router.post('/login',verifyToken,loginController);

//to get verify email
router.get('/email-verification',verifyMail,getVerifyMail)

//to send and get  otp
router.route('/send-otp').get(getSendOTP).post(otpValidator,verifyOtp);

// to logout
router.get('/logout',logout,getLogout);





export default router;
