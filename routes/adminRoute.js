import express from 'express';
const adminRouter = express.Router();
import users from '../models/userModel.js';
import { auth_isAdmin } from '../middleware/auth.js';
import category from '../models/category.js';
import upload from '../middleware/auth.js';
import {  getAdminDashboard,getAdminPdct, blockUser,unblockUser, getAdminAddPdct,getadminLogin,
          getAdminCategory,postAdminCategory,getAdminAddCategory,postAdminAddProduct,deleteAdminCategory,
          editAdminCategory,getAdminUser,
          editPostAdminCategory,editgetAdminCategory, editAdminPdct, editgetAdminPdct, editPostAdminPdct, blockProduct, unblockProduct} from "../controllers/adminController.js";


//admin-dashboard route
adminRouter.get('/admin-dashboard',getAdminDashboard);

//admin-user-management
adminRouter.get('/admin_user_mgmnt',getAdminUser);

//blocking and unblocking of user

adminRouter.get('/block-user/:id',blockUser);

adminRouter.get('/unblock-user/:id',unblockUser);

//admin-login

adminRouter.get('/admin_login',getadminLogin)

//admin-product-management

adminRouter.get('/admin_pdct_mgmnt',getAdminPdct)

//admin-product-add
adminRouter.get('/admin_add_product',getAdminAddPdct);

adminRouter.post('/add_product',upload,postAdminAddProduct);

//admin-edit-product
adminRouter.get('/admin_edit_product',editAdminPdct);

adminRouter.get('/edit_product/:id',editgetAdminPdct);

adminRouter.post('/edit_product/:id',upload,editPostAdminPdct);

//blocking and unblocking product
adminRouter.get('/block-product/:id',blockProduct);

adminRouter.get('/unblock-product/:id',unblockProduct);



//admin-category
adminRouter.get('/admin_category',getAdminCategory);

//admin-add-category

adminRouter.get('/admin_add_category',getAdminAddCategory)

adminRouter.post('/add_category',postAdminCategory);

adminRouter.get('/delete_category/:id',deleteAdminCategory);

adminRouter.get('/admin_edit_category',editAdminCategory);

adminRouter.get('/edit_category/:id',editgetAdminCategory);

adminRouter.post('/edit_category/:id',editPostAdminCategory);


export default adminRouter;
