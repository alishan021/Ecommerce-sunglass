import express from 'express';
const adminRouter = express.Router();
import users from '../models/userModel.js';
import { auth_isAdmin } from '../middleware/auth.js';
import category from '../models/category.js';
//import upload from '../middleware/auth.js';
import upload from '../middleware/auth.js';
import { requireAuth } from '../middleware/auth.js';
import {  getAdminDashboard,getAdminPdct, blockUser,unblockUser, getAdminAddPdct,
          getAdminCategory,postAdminCategory,getAdminAddCategory,postAdminAddProduct,
          editAdminCategory,getAdminUser,softDeleteCategory,unsoftDeleteCategory,
          editPostAdminCategory,editgetAdminCategory, editAdminPdct, editgetAdminPdct, editPostAdminPdct, blockProduct, unblockProduct, getAdminLogout} from "../controllers/adminController.js";


//admin-dashboard route
adminRouter.get('/admin-dashboard',requireAuth  ,getAdminDashboard);

//admin-user-management
 adminRouter.get('/admin_user_mgmnt',requireAuth,getAdminUser);

//blocking and unblocking of user

adminRouter.get('/block-user/:id',requireAuth,blockUser);

adminRouter.get('/unblock-user/:id',requireAuth,unblockUser);



//admin-product-management

adminRouter.get('/admin_pdct_mgmnt',requireAuth,getAdminPdct)

//admin-product-add
adminRouter.get('/admin_add_product',requireAuth,getAdminAddPdct);

adminRouter.post('/add_product',requireAuth,upload,postAdminAddProduct);

//admin-edit-product
adminRouter.get('/admin_edit_product',requireAuth,editAdminPdct);

adminRouter.get('/edit_product/:id',requireAuth,editgetAdminPdct);

adminRouter.post('/edit_product/:id',requireAuth,upload,editPostAdminPdct);

//blocking and unblocking product
adminRouter.get('/block-product/:id',requireAuth,blockProduct);

adminRouter.get('/unblock-product/:id',requireAuth,unblockProduct);



//admin-category
adminRouter.get('/admin_category',requireAuth,getAdminCategory);

//admin-add-category

adminRouter.get('/admin_add_category',requireAuth,getAdminAddCategory)

adminRouter.post('/add_category',requireAuth,postAdminCategory);

//adminRouter.get('/delete_category/:id',requireAuth,deleteAdminCategory);
adminRouter.get('/soft_delete_category/:id',requireAuth,softDeleteCategory);
adminRouter.get('/unsoft_delete_category/:id',requireAuth,unsoftDeleteCategory);

adminRouter.get('/admin_edit_category',requireAuth,editAdminCategory);

adminRouter.get('/edit_category/:id',requireAuth,editgetAdminCategory);

adminRouter.post('/edit_category/:id',requireAuth,editPostAdminCategory);

//admin-logout

adminRouter.get('/admin-logout',getAdminLogout);


export default adminRouter;
