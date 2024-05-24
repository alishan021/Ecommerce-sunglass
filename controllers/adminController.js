import users from '../models/userModel.js';
import bcrypt from 'bcrypt';
import Admin from '../models/admin_model.js';
import products from '../models/product.js'
import category from '../models/category.js';
import multer from 'multer';




export const  getadminLogin = (req,res) =>{
       res.render('admin/admin_login');
}

export const getAdminDashboard = (req,res)=>{
    
    res.render('admin/admin-dashboard');
}

export const  getAdminUser = async(req,res)=>{
    try {
        const userList = await users.find({role:{$ne:'admin'}}).exec();
       // console.log(userList);
        
        if(!userList){
            res.status(500).json({success:false});
        }
     
        res.render('admin/admin_user_mgmnt', { userList });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
        
    }
   

}

export const getAdminPdct= async(req,res) =>{
     try {
        const productList = await products.find({}).populate ('category').exec();
        //  console.log(productList);

        if(!productList){
            res.status(500).json({success:false});
        }
     
        res.render('admin/admin_pdct_mgmnt', { productList });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
        
    }
     

}

export const getAdminAddPdct = async(req,res)=>{
    
    const categories = await category.find({});

    res.render('admin/admin_add_product', { categories });
}

export const postAdminAddProduct = async(req,res)=>{
    try {
        
       //const images = [];
        const {productid,productname,description,category,price}=req.body;
         
        if (parseFloat(price) <= 200) {
            return res.status(400).json({
                success: false,
                message: 'Price must be above 200'
            });
        }

        
        const existingProductname = await products.findOne({productname});
        if(existingProductname){
            return res.status(200).json({
                success: false,
                message: 'Productname already exists,Please update new productname'
            });
        }
       
     console.log('req.files:', req.files); // Debugging: Check the uploaded files
        if (!req.files || req.files.length === 0) {
           console.log('No files uploaded');
        }
         
         const images = req.files.map(file => file.filename);

        const newProduct = new products({
            productid:req.body.productid,
            productname: req.body.productname,
            description: req.body.description,
            category:req.body.category,
            price: req.body.price,
            image: images
        });

        const result = await newProduct.save();
        console.log(result);
       
        res.redirect('/admin/admin_pdct_mgmnt');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

//to edit products

export const editAdminPdct = async(req,res)=>{
   
    res.render('admin/admin_edit_product');
}

export const editgetAdminPdct = async (req,res)=>{
    try {
        const categories = await category.find();

        const product_id= req.params.id;

        const product_List = await products.findById(product_id);


        res.render('admin/admin_edit_product',{ categories, product_List });
       
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

}

export const editPostAdminPdct = async (req,res)=>{
     
   try {
    
    const product_id = req.params.id;
   

    const { productid, productname ,description ,category ,price ,image } = req.body;

    
    console.log(productname);
    
   

    // If there are uploaded files, map the filenames
    const images = req.files?.map(file => file.filename) || [];

    const updatedProduct = await products.findByIdAndUpdate(product_id,{
        productid: req.body.productid,
        productname: req.body.productname,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        image: images,
    }).exec();
    console.log(updatedProduct);
    res.redirect('/admin/admin_pdct_mgmnt');
   
    
   } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
   }

}

export const blockProduct= async (req, res) => {
    try {
        const productId = req.params.id;

        const updatedProduct = await products.findByIdAndUpdate(productId, { isBlocked: true});
       
        res.redirect('/admin/admin_pdct_mgmnt');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const unblockProduct = async (req, res) => {
    try {
        const  productId = req.params.id;
        await products.findByIdAndUpdate(productId, { isBlocked: false });
        res.redirect('/admin/admin_pdct_mgmnt');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};




export const getAdminCategory = async(req,res)=>{
    try {
        const categoryList = await category.find({}).exec();
        console.log(categoryList)

        if(!categoryList){
            res.status(500).json({success:false});
        }
     
        res.render('admin/admin_category', { categoryList });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
        
    }
   

}  

export const getAdminAddCategory = async(req,res) =>{
    res.render('admin/admin_add_category');
}
//to post the categories

export const postAdminCategory = async(req,res)=>{
    try {
        const {id,title,desc} = req.body;
         
        const existingTitle = await category.findOne({title});
        if(existingTitle){
            return res.status(200).json({
                success: false,
                message: 'Category already exists,Please update new category'
            });
        }
         // Check if required fields are missing
       if (!id || !title || !desc) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }
         // Create a new category document
    const categoryList = new category({
      id:id,
      title:title,
      desc:desc
    });

    // Save the new category to the database
    await categoryList.save();
    
    //res.status(201).json({ message: 'Category added successfully' });
    res.redirect('/admin/admin_category');

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
   
//to delete category

//export const deleteAdminCategory = async (req, res) => {
  //  try{
    //const userId = req.params.id;

    //const updatedCategory = await category.findByIdAndUpdate(userId, { is_Soft_Delete: true });
   
   // res.redirect('/admin/admin_category');    
   // category.findByIdAndDelete(req.params.id)
       // .then(category => {
            //if (category) {
             //  res.redirect('/admin/admin_category')
            //} else {
                //return res.status(404).json({ success: false, message: 'Category not found' });
           // }
      //  })
   // }
       // catch(error){
           // console.error(error);
           // return res.status(500).json({ success: false, message: 'Internal Server Error' });
       // }
//};
//to softdelete the category
export const softDeleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const updatedCategory = await category.findByIdAndUpdate(categoryId, { is_Soft_Delete: true });
       
        res.redirect('/admin/admin_category');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

//to unsoft delete category
export const unsoftDeleteCategory= async (req, res) => {
    try {
        const categoryId = req.params.id;

        const updatedCategory = await category.findByIdAndUpdate(categoryId, { is_Soft_Delete: false });
       
        res.redirect('/admin/admin_category');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};



//to edit category

export const editAdminCategory = async(req,res)=>{
    res.redirect('/admin/admin_edit_category');
}

export const editgetAdminCategory = async(req,res)=>{
  try {
    let category_id= req.params.id;
    
    const categoryList = await category.findById(category_id);
    res.render('admin/admin_edit_category',{ categoryList    })
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

}

export const editPostAdminCategory = async (req,res) => {
    try {

       const category_id = req.params.id;
       const {title,desc} = req.body;

       const existingCategorytitle = await category.findOne({title: new RegExp(`^${title}$`,'i'),_id:{$ne:category_id}});

        
   if(existingCategorytitle){
    return res.redirect(`/admin/admin_edit_category/${category_id}?message=Category name already exists`);
    }
   
    const updatedCategory = await category.findByIdAndUpdate(category_id,{
    title:title,
    desc:desc
   }).exec();
   res.redirect('/admin/admin_category');
   
    } catch (error) {
        console.error(error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        
    }
   
}
    
   export const blockUser= async (req, res) => {
    try {
        const userId = req.params.id;
        req.session.userId = userId;
        console.log(req.session.userId);
        const updatedUser = await users.findByIdAndUpdate(userId, { isBlocked: true });
       
        res.redirect('/admin/admin_user_mgmnt');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const unblockUser = async (req, res) => {
    try {
        const  userId = req.params.id;
        await users.findByIdAndUpdate(userId, { isBlocked: false });
        res.redirect('/admin/admin_user_mgmnt');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const getAdminLogout = (req,res)=>{
    //clearing authentication token

    try {
        // Clear the JWT token cookie from the client's browser
        res.clearCookie('jwt');
       
        // Redirect the user to the login page
        res.render('customer/auth/login');
    } catch (error) {
        // If an error occurs, log the error and send a response
        console.error('Error during admin logout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}




