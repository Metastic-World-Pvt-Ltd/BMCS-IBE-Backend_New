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
const { userUpdate } = require('../controllers/User/userUpdate');
const { userReferral } = require('../controllers/User/userReferral');
const { userHistory } = require('../controllers/User/userHistory');
const { agentProject } = require('../controllers/User/agentProject');
const { getProject } = require('../controllers/User/getProject');
const { editProduct } = require('../controllers/Products/editProduct');
const { createClientProduct } = require('../controllers/Products/createClientProduct');
const { getRefChild } = require('../controllers/User/getRefChild');
const { generatePin } = require('../controllers/User/generetPIN');
const { verifyPIN } = require('../controllers/User/verifyPIN');
const { updateUserPin } = require('../controllers/User/updateUserPin');
const { checkAPIKey } = require('../middleware/checkAPIKey');
const { verifyEmailOtp } = require('../controllers/User/verifyEmailOtp');
const { signUpCheck } = require('../controllers/User/signUpCheck');
const { signUpEmailCheck } = require('../controllers/User/signUpEmailCheck');
const { signIn } = require('../controllers/User/signIn');
const { totalRef } = require('../controllers/User/totalRef');
const { getUserEnquiery } = require('../controllers/User/getUserEnquiery');
const { getAllProjectByContact } = require('../controllers/User/getAllProjectByContact');
const { getRefAllChild } = require('../controllers/User/getRefAllChild');
const { getWallet } = require('../controllers/User/getWallet');
// const { getKycByempId } = require('../controllers/User/getKycByempId');
const { fundTicket } = require('../controllers/Ticket/fundTicket');
const { amcTicket } = require('../controllers/Ticket/amcTicket');
const { createTicket } = require('../controllers/Ticket/createTicket');
const { getAMC } = require('../controllers/Ticket/getAMC');
const { getLoan } = require('../controllers/Ticket/getLoan');
const { getFund } = require('../controllers/Ticket/getFund');
const { getTicketById } = require('../controllers/Support/getTicketById');
const { getLoanById } = require('../controllers/Ticket/getLoanById');
const { getFundById } = require('../controllers/Ticket/getFundById');
const { getAmcById } = require('../controllers/Ticket/getAmcById');

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
  { name: 'frontAdhar' },
  { name: 'backAdhar' },
  { name: 'Pan' },
  { name: 'Statement_Check' },
]),userKyc);
//update Kyc details
router.patch('/updateKyc',verifyUser,editKyc);
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
//Verify Email OTP
router.post('/verifyemailotp', loginRateLimiter ,verifyEmailOtp);
//Generate Mobile OTP for Sign Up
router.post('/checkusersignup',checkAPIKey , signUpCheck);
//Generate Email OTP for Sign Up
router.post('/checkemailsignup' , signUpEmailCheck);
//user details from signup page
router.post('/signup' , checkAPIKey ,userSignup);
//update user details
router.patch('/userUpdate',verifyUser, userUpdate);
//create referral and distribute earning
router.post('/referral',userReferral);
//fetch user transaction history
router.get('/transactionHist',verifyUser,userHistory);
//create project 
router.post('/createProject',upload.fields([
  { name: 'frontAdhar' },
  { name: 'backAdhar' },
  { name: 'Pan' },
  { name: 'GST' },
  { name: 'cPan' },
]), agentProject)


//get project details
router.get('/getProject',verifyUser,getProject); 
//edit/update project details
router.post('/createProject',upload.fields([
  { name: 'frontAdhar' },
  { name: 'backAdhar' },
  { name: 'Pan' },
  { name: 'GST' },
  { name: 'cPan' },
  ]),editProduct);
  
//client Product
router.post('/clientproduct',upload.array('files'),createClientProduct);  
//Get All Child Referral
router.get('/getrefchild',verifyUser,getRefChild);
//allWithdrawRequest
router.get('/allWithdrawRequest',allWithdrawRequest);
//Generate Pin for User Login
router.post('/generatepin',verifyUser , generatePin);
//Verfy Uer PIN
router.post('/verifypin' , verifyPIN);
//Update User PIN 
router.patch('/updatepin',verifyUser,updateUserPin);
//Sign in with Single API
router.post('/usersignin', signIn);
//Totle ref count
router.get('/totalref',verifyUser, totalRef);
//get all enqueiry by user
router.get('/userenquiry', getUserEnquiery );
//Get all project by contact
router.get('/myproject',getAllProjectByContact);
//get all ref chid
router.get('/getallrefchid', getRefAllChild)
//get wallet data
router.get('/getwallet',getWallet);
//Get User By Emp Id
// router.get('/getkycbyemp', getKycByempId);
//Loan Ticket
router.post('/loanticket', createTicket);
//Fund Ticket
router.post('/fundticket', fundTicket);
//AMC Ticket
router.post('/amcticket', amcTicket);
//Get ALL AMC Ticket
router.get('/getamc',getAMC);
//Get ALL Loan Ticket
router.get('/getloan',getLoan);
//Get ALL Fund Ticket
router.get('/getfund',getFund);
//Get Support Ticket By ID
router.get('/supportticketbyid',getTicketById)
//Get Loan by Id
router.get('/loanbyid',getLoanById);
//Get Fund by Id
router.get('/fundbyid',getFundById);
//Get AMC by Id
router.get('/amcbyid',getAmcById);

module.exports = router;