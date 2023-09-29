const express=require('express');
const { adminRegister } = require('../controllers/Admin/adminRegister');
const { loginRateLimiter } = require('../middleware/loginRateLimiter');
const { adminLogin } = require('../controllers/Admin/adminLogin');
const { deleteAdmin } = require('../controllers/Admin/deleteAdmin');
const { deleteUser } = require('../controllers/User/deleteUser');
const { verifyUser } = require('../middleware/verifyUser');
const { resetPassword } = require('../controllers/Admin/resetPassword');
const { superAdminConsole } = require('../controllers/Admin/superAdminConsole');
const { adminConsole } = require('../controllers/Admin/adminConsole');
const { standardConsole } = require('../controllers/Admin/standardConsole');
const { getLogs } = require('../controllers/Admin/getLogs');
const { getUser } = require('../controllers/User/getUser');
const { register2FA } = require('../controllers/Admin/register2FA');
const { verify2FA } = require('../controllers/Admin/verify2FA');
const { reset2FA } = require('../controllers/Admin/reset2FA');
const { createProduct } = require('../controllers/Products/createProduct');
const { deleteProduct } = require('../controllers/Products/deleteProduct');
const { editProduct } = require('../controllers/Products/editProduct');
const { projectApproval } = require('../controllers/Admin/projectApproval');
const { completeProject } = require('../controllers/Admin/completeProject');
const { updateWithdrawStatus } = require('../controllers/User/updateWithdrawStatus');
const { verifyProject } = require('../controllers/Admin/verifyProject');
const { getAllProjects } = require('../controllers/Admin/getAllProjects');
const { filter_Project } = require('../controllers/Admin/filter_Project');

const router=express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:false}))

router.get('/',function(req, res){
    res.send('Admin Home')
})

//admin register
router.post('/adminRegister',adminRegister);
//admin login
router.post('/adminLogin',loginRateLimiter, adminLogin);
//Delete Admin User
router.post('/deleteadmin',deleteAdmin);
//Delete User
router.post('/deleteuser',deleteUser);
//reset admin password
router.post('/reset',verifyUser,resetPassword);
//Super Admin console view page
router.post('/superAdmin',verifyUser,superAdminConsole);
//admin console view page
router.post('/admin',verifyUser,adminConsole);
//Standard console view page
router.post('/standard',verifyUser,standardConsole);
//verify project
router.post('/verify/:id',verifyUser, verifyProject);
//get logs provide start date (2023-08-23) and end date (2023-08-24)
router.get('/logs',verifyUser,getLogs);
//get user details by employee ID
router.get('/getuser/:empId',verifyUser,getUser);
//Register 2FA
router.post('/generate-2fa',loginRateLimiter,verifyUser,register2FA);
//Verify 2FA
router.post('/verify-2fa', loginRateLimiter,verifyUser,verify2FA);
//Reset 2FA 
router.post('/reset-2fa',reset2FA); ///completed till here
//create Product
router.post('/createproduct', verifyUser,createProduct);
//edit product
router.patch('/editproduct/:id', verifyUser,editProduct);
//project appoval from Admin
router.post('/approval/:id',verifyUser,projectApproval);
//mark project as complete
router.post('/complete/:id',verifyUser,completeProject);
//update withdraw status as complete
router.post('/completewithdraw/:id',verifyUser,updateWithdrawStatus)
//get all projects
router.get('/allProjects',verifyUser, getAllProjects); 
//get all verified project for admin approval
router.get('/filterProjects',verifyUser,filter_Project);
//create/add product
router.post('/createproduct', verifyUser , createProduct);
//delete Product
router.post('/deleteproject/:id', verifyUser , deleteProduct);
//edit/update product
router.patch('/editproduct/:id',editProduct);

module.exports = router;