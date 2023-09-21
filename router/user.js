const express = require('express');
const multer = require('multer');
const { verifyUser } = require('../middleware/verifyUser');
const { userKyc } = require('../controllers/User/userKyc');
const { editKyc } = require('../controllers/User/editKyc');
const { withdrawAmt } = require('../controllers/User/withdrawAmt');
const { allWithdrawRequest } = require('../controllers/User/allWithdrawRequest');
const { getHistory } = require('../controllers/User/getHistory');
const { totalEarning } = require('../controllers/User/totalEraning');
const { storageValue, fileFilterValue } = require('../controllers/User/storage');
const { generateOtp } = require('../controllers/User/generateOtp');
const { generateEmailOtp } = require('../controllers/User/generateEmailOtp');
const { verifyOtp } = require('../controllers/User/verifyOtp');
const { loginRateLimiter } = require('../middleware/loginRateLimiter');
const { userSignup } = require('../controllers/User/userSignup');
const { userSignin } = require('../controllers/User/userSignin');
const { userUpdate } = require('../controllers/User/userUpdate');
const { userReferral } = require('../controllers/User/userReferral');
const { userHistory } = require('../controllers/User/userHistory');
const { agentProject } = require('../controllers/User/agentProject');
const { getProject } = require('../controllers/User/getProject');
const { editProduct } = require('../controllers/Products/editProduct');
const { createClientProduct } = require('../controllers/Products/createClientProduct');
const { getRefChild } = require('../controllers/User/getRefChild');
var upload = multer({
    dest: storageValue,
    fileFilter: fileFilterValue,
  });
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:false}))

router.get('/',function(req, res){
    res.send('User Profile')
} );

//user Kyc
router.post('/kyc',verifyUser,upload.fields([
  { name: 'Adhar' },
  { name: 'Pan' },
  { name: 'Statement_Check' },
]),userKyc);
//update Kyc details
router.patch('/updateKyc/:id',verifyUser,editKyc);
//withdraw amount
router.post('/withdraw',verifyUser,withdrawAmt);
//fetch all withdraw request
router.get('/allwithdrawrequest',allWithdrawRequest)
//get History by ID
router.get('/gethistory/:id',verifyUser, getHistory)
//get total earning of all type transaction as per origin
router.post('/totalEarning',verifyUser,totalEarning);

//Generate Mobile Otp
router.post('/generateOtp', generateOtp);
//Generate Email Otp
router.post('/generateEmailOtp',generateEmailOtp);
//verify otp
//loginRateLimiter middleware to restrict number of retry limits
router.post('/verifyOtp',loginRateLimiter, verifyOtp);
//user details from signup page
router.post('/signup',upload.single('avatar'),userSignup);
//sign in auth
router.post('/signin', userSignin);
//update user details
router.patch('/userUpdate/:id',verifyUser, userUpdate);
//create referral and distribute earning
router.post('/referral',userReferral);
//fetch user transaction history
router.get('/transactionHist',verifyUser,userHistory);
//create project 
router.post('/createProject',upload.fields([
    { name: 'Adhar' },
    { name: 'Pan' },
    { name: 'cAdhar' },
    { name: 'cPan' },
  ]), agentProject)


//get project details
router.get('/getProject/:projectId',verifyUser,getProject); 
//edit/update project details
router.post('/editProject', verifyUser,upload.fields([
    { name: 'Adhar' },
    { name: 'Pan' },
    { name: 'cAdhar' },
    { name: 'cPan' },
  ]),editProduct);

router.post('/clientproduct',upload.array('files'),createClientProduct);  
//Get All Child Referral
router.get('/getrefchild',verifyUser,getRefChild);

module.exports = router;