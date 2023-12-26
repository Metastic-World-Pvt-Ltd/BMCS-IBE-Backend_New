const express=require('express');
const multer = require('multer');
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
const { updateAdminPassword } = require('../controllers/Admin/updateAdminPassword');
const { generateSecretAPIKey } = require('../controllers/Admin/generateSecretAPIKey');
const { getSecretKey } = require('../controllers/Admin/getSecretKey');
const { bannerHome } = require('../controllers/Admin/bannerHome');
const { storageValue, fileFilterValue } = require('../controllers/User/storage');
const { hideHomeBanner } = require('../controllers/Admin/hideHomeBanner');
const { deleteBanner } = require('../controllers/Admin/deleteBanner');
const { addProductList } = require('../controllers/Admin/addProductList');
const { getProductList } = require('../controllers/Admin/getProdcutList');
const { getAllAdminUser } = require('../controllers/Admin/getAllAdminUser');
const { getAdminUserFilter } = require('../controllers/Admin/getAdminUserFilter');
const { getCategoryList } = require('../controllers/Admin/getCategoryList');
const { getAllProducts } = require('../controllers/Admin/getAllProducts');
const { getInpKyc } = require('../controllers/Admin/getInpKyc');
const { projectByContact } = require('../controllers/Admin/projectByContact');
const { acceptProject } = require('../controllers/Admin/acceptProject');
const { deleteProductList } = require('../controllers/Admin/deleteProductList');
const { getHomeBanner } = require('../controllers/Admin/getHomeBanner');
const { editCategory } = require('../controllers/Admin/editCategory.js');
const { editSubCategory } = require('../controllers/Admin/editSubCategory');
const { acceptKyc } = require('../controllers/Admin/acceptKyc.js');
const { verifyKyc } = require('../controllers/Admin/verifyKyc.js');
const { acceptFund } = require('../controllers/Ticket/acceptFund.js');
const { closeFund } = require('../controllers/Ticket/closeFund.js');
const { acceptAMC } = require('../controllers/Ticket/acceptAMC.js');
const { closeAMC } = require('../controllers/Ticket/closeAMC.js');
const { acceptTicket } = require('../controllers/Ticket/acceptTicket.js');
const { closeTicket } = require('../controllers/Support/closeTicket.js');
const { dashboard } = require('../controllers/Admin/dashboard.js');
const { myActivity } = require('../controllers/Admin/myActivty.js');
const { getKycById } = require('../controllers/User/getKycById.js');
const { getAllWithdraw } = require('../controllers/Admin/getAllWithdraw.js');
const { createDistributionList } = require('../controllers/Admin/createDistributionList.js');
const { getDistributionList } = require('../controllers/Admin/getDistributionList.js');
const { editDistributionList } = require('../controllers/Admin/editDistributionList.js');
const { getAll_IBE } = require('../controllers/Admin/getAll_IBE.js');
const { changeUserStatus } = require('../controllers/Admin/changeUserStatus.js');
const { closeLoan } = require('../controllers/Ticket/closeLoan.js');
const { getAdminBYId } = require('../controllers/Admin/getAdminById.js');
const { verifyAdminUser } = require('../middleware/verifyAdminUser.js');
const { updateProfile } = require('../controllers/Admin/updateProfile.js');
const { completedProject } = require('../controllers/Admin/My Activity/completedProject.js');
const { rejectedProject } = require('../controllers/Admin/My Activity/rejectedProject.js');
const { acceptedProject } = require('../controllers/Admin/My Activity/acceptedProject.js');
const { completedKyc } = require('../controllers/Admin/My Activity/completedKyc.js');
const { rejectedKyc } = require('../controllers/Admin/My Activity/rejectedKyc.js');
const { acceptedKyc } = require('../controllers/Admin/My Activity/acceptedKyc.js');




const router=express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:false}))
var upload = multer({
    dest: storageValue,
    fileFilter: fileFilterValue,
  });

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
//update admin password by user itself
router.post('/updatepassword',verifyUser, updateAdminPassword);
//reset admin password
router.post('/reset',verifyUser,resetPassword);
//Super Admin console view page
router.post('/superAdmin',superAdminConsole);
//admin console view page
router.post('/admin',adminConsole);
//Standard console view page
router.post('/standard',standardConsole);
//verify project
router.post('/verify',verifyUser, verifyProject);
//Update Project Status by Accept
router.post('/acceptproject',acceptProject)
//get logs provide start date (2023-08-23) and end date (2023-08-24)
router.get('/logs',verifyUser,getLogs);
//get user details by employee ID
router.get('/getuser/:empId',verifyUser,getUser);
//Register 2FA
router.post('/generate-2fa',verifyUser,register2FA);
//Verify 2FA
router.post('/verify-2fa',verifyUser,verify2FA);
//Reset 2FA 
router.post('/reset-2fa',reset2FA); ///completed till here
//create Product
// router.post('/createproduct', verifyUser,createProduct);
//edit product
router.patch('/editproduct/:id', verifyUser,editProduct);
//project appoval from Admin
router.post('/approval',verifyUser,projectApproval);
//mark project as complete
router.post('/complete',verifyUser,completeProject);
//update withdraw status as complete
router.post('/completewithdraw/:id',updateWithdrawStatus)
//get all projects
router.get('/allProjects',verifyUser, getAllProjects); 
//get all verified project for admin approval
router.get('/filterProjects',verifyUser,filter_Project);
//Get project by contact
router.get('/projectbycontact',projectByContact);
//create/add product
router.post('/createproduct' ,upload.fields([
  { name: 'imageURL' },
]), createProduct);
//delete Product
router.post('/deleteproduct/:id', verifyUser , deleteProduct);
//edit/update product
router.patch('/editproduct/:id',editProduct);
//Generate Seceret API Key for external or client access
router.post('/generatesecret',verifyUser , generateSecretAPIKey);
//Get Seceret API Key
router.get('/getapikey',verifyUser , getSecretKey);
//Add Banner
router.post('/banner1',upload.fields([
    { name: 'imageURL' },
  ]) , bannerHome);
//Hide Banner
router.patch('/hidebanner',hideHomeBanner);
//delete banner
router.post('/deletebanner/:id', deleteBanner)
//Get All Home Banner
router.get('/getbanner',getHomeBanner);
//Add products into list
router.post('/addproductlist',addProductList);

//Get product list
router.get('/getproductlist',getProductList);

//Get All Admin user List
router.get('/allusers',getAllAdminUser);
//Get Admin Users by 
router.get('/filterusers',getAdminUserFilter);
//Get Category of Product List
router.get('/getcategory',getCategoryList);
//Get All Product List
router.get('/allproducts',getAllProducts);
//Get Inprogress Kyc Data
router.get('/getkyc',getInpKyc)
//delete product List
router.post('/deleteproductlist',deleteProductList);
//Edit Category List
router.patch('/editcategory', editCategory);
//Edit Sub CAtegory List
router.patch('/editsubcategory', editSubCategory)
//Accept Kyc
router.patch('/acceptkyc',acceptKyc)
//Verify Kyc
router.patch('/verifykyc',verifyKyc);
//Accept Fund Ticket
router.patch('/acceptfund', acceptFund);
//close fund ticket
router.patch('/closefund',closeFund);
//Accept Fund Ticket
router.patch('/acceptamc', acceptAMC);
//close fund ticket
router.patch('/closeamc', closeAMC);
//Accept Ticket Ticket
router.patch('/acceptloan', acceptTicket);
//close Ticket ticket
router.patch('/closeloan', closeLoan);
//Dashboard
router.get('/dashboard', verifyAdminUser ,dashboard);
//My Activity
router.get('/myactivity',myActivity);
//Get kYc by EMP ID
router.get('/kycbyid',getKycById);
//Get All withdraw request for admin Panel
router.get('/allwithdraw', getAllWithdraw);
//Create DistributionList for IBE commission
router.post('/createdl',createDistributionList);
//Get DistributionList for IBE commission
router.get('/getdl',getDistributionList);
//Edit DistributionList for IBE commission
router.patch('/editdl',editDistributionList);
//Get All IBE
router.get('/allibe',getAll_IBE);
//Update IBE user Status 
router.post('/updateuserstaus',changeUserStatus);
//Get admin by admin ID
router.get('/getadmin', getAdminBYId);
//Updated Admin Profile Data
router.patch('/updateAdmin',updateProfile);
//Get closed Project with pagination
router.get('/completedProject',completedProject);
//Get closed Project with pagination
router.get('/rejectedProject',rejectedProject);
//Get closed Project with pagination
router.get('/acceptedProject',acceptedProject);

//Get closed Project with pagination
router.get('/completedKyc',completedKyc);
//Get closed Project with pagination
router.get('/rejectedKyc',rejectedKyc);
//Get closed Project with pagination
router.get('/acceptedKyc',acceptedKyc);

module.exports = router;