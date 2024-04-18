import jwt from 'jsonwebtoken';
import users from '../models/userModel.js';
import multer from 'multer';


export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
  
    // check json web token exists & is verified
    
    if (token) {
      jwt.verify(token, 'secret_key', (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.render('customer/auth/login');
        } else {
          console.log(decodedToken);
          res.render('home');
          //next();
        }
      });
    } else {
        console.log('Error occured')
      res.render('customer/auth/login');
    }
  };

  export const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token,'secret_key', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await users.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };
  
  export const auth_isAdmin = (role)=>{
     return (req,res,next)=>{
      if(req.user.role !==role){
       
        res.render('admin/admin_login')
      }
      next();
     }
  }

  const storageConfig = {
    destination: function (req, file, cb) {
        cb(null, './public/customer/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
};

// Initialize multer with the configured storage options
const upload = multer({ storage: multer.diskStorage(storageConfig) }).single("image");

export default upload;

  
  