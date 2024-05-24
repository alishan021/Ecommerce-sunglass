import jwt from 'jsonwebtoken';
import users from '../models/userModel.js';
import multer from 'multer';
import path from 'path';




 
export const requireAuth = (req,res,next)=>{
  const token = req.cookies.jwt;
 console.log(token);
 console.log(req.session.loggedIn);

 // Check if user is logged in based on session or JWT token
 //if (!req.session.loggedIn && !token) {
  // If not logged in, redirect to login page
  //return res.redirect('/login');
//}

  if(token){
       jwt.verify(token, process.env.JWT_SECRET,(err,decodedToken)=>{
        if(err){
          //console.log(err);
          //res.redirect('/login');
          //res.status(401).json({ error: 'Authentication failed' });
          // If JWT token verification fails, clear the cookie and redirect to login page
          res.clearCookie('jwt');
          return res.redirect('/login');

        }else{
          console.log(decodedToken);

          // Valid token, extract userId and role from decoded token
          const { userId, role } = decodedToken;
          
          req.user = decodedToken;
          req.userId= decodedToken.userId;

          //next();

          if (role === 'admin') {
            // User is admin, grant access to admin side
            //res.redirect('/admin-dashboard');
            req.isAdmin = true; 
            next();
        } else {
            // User is not admin, grant access to user side
            //res.redirect('/home'); // Assuming '/home' is the route for user side
            next();
        }
        }
       })
  }
  else{
    res.redirect('/login');
  }
}
  

  
  
  export const auth_isAdmin = (role)=>{
     return (req,res,next)=>{
      console.log(req.user.role);
      if(req.user.role !==role){
       
        res.render('admin/admin_login')
      }
      next();
     }
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/customer/images'); // Set the destination folder where files will be stored
    },
    filename: (req, file, cb) => {
        // Generate a unique filename for each uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

// Multer upload configuration
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (optional)
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) { // Accept only image files
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
}).array('image', 5);

 export default upload;
 



// //to check if user is registered and  logged in
// export const checkUserLoggedIn = (req, res, next) => {
//   // Check if user is logged in based on session
//   console.log(req.session.loggedIn);
//   console.log(req.session.userLoggedIn);
//   if (req.session.loggedIn||req.session.userLoggedIn) {
//       // User is logged in, proceed to next middleware
//       next();
     
//   } else {
//       // User is not logged in, redirect to login page
//       res.render('customer/auth/login');
//   }
// };




export const checkUserLoggedIn = async (req, res, next) => {
  console.log(req.session.loggedIn);
  try{
       if (!req.session.loggedIn) {
           return res.redirect('/login');
       }
       next();
  }
  catch(error){
       console.log(error);
  }
}




export const checkUserNotLoggedIn = async(req,res,next)=>{
  console.log(req.session.loggedIn);
   try{
       if(req.session.loggedIn){
           return res.redirect('/');
       }
       return next()
   }catch(error){
       console.error(error)
   }
}



// export const checkUserNotLoggedIn =(req,res,next) =>{
//   if(!req.session.loggedIn || !req.session.userLoggedIn){
//     //res.render('customer/auth/login')
//     next();
//   }
//   else{
    
//     const productList =  products.find({isBlocked:true});
//       res.render('home',{productList});

//   }
// }

// to check if user is blocked
export const checkBlockedUser = async (req, res, next) => {
    try {
       
        const userId = req.session.userId; // Assuming you have user ID in the session
        const user = await users.findById(userId); // Assuming you have a User model

        // If user is blocked, deny access
        if (user && user.isBlocked) {
            return res.status(403).send('Access Denied: Your account is blocked.');
        }

        // If user is not blocked, proceed to next middleware or route handler
        next();
    } catch (error) {
        console.error('Error checking user status:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const is_Admin = (req,res)=>{
  console.log(req.session.admin);
  if(req.session.admin){
    res.redirect('/admin/admin-dashboard');
  }
  else{
    res.redirect('/customer/auth/login');
  }
}