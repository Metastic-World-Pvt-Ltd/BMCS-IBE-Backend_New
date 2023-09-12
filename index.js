// const cluster = require('cluster');
// const http = require('http');
// const numCPUs = require('os').cpus().length;
//cl
const express = require('express')
const helmet = require('helmet');
const cors = require('cors');
const app = express()
const db = require('./mongoose/mongoose');
const { generateOtp } = require('./controllers/User/generateOtp');
const { verifyOtp } = require('./controllers/User/verifyOtp');
const { userSignup } = require('./controllers/User/userSignup');
const multer = require('multer');
const { userSignin } = require('./controllers/User/userSignin');
const { userUpdate } = require('./controllers/User/userUpdate');
const { generateEmailOtp } = require('./controllers/User/generateEmailOtp');
const { loginRateLimiter } = require('./middleware/loginRateLimiter');
const { verifyUser } = require('./middleware/verifyUser');
const { userReferral } = require('./controllers/User/userReferral');
const { userHistory } = require('./controllers/User/userHistory');
const { storageValue, fileFilterValue } = require('./controllers/User/storage');
const { agentProject } = require('./controllers/User/agentProject');
const { getProject } = require('./controllers/User/getProject');
const { editProject } = require('./controllers/User/editProject');
const { getAllProjects } = require('./controllers/Admin/getAllProjects');
const { adminRegister } = require('./controllers/Admin/adminRegister');
const { adminLogin } = require('./controllers/Admin/adminLogin');
const { adminConsole } = require('./controllers/Admin/adminConsole');
const { superAdminConsole } = require('./controllers/Admin/superAdminConsole');
const { standardConsole } = require('./controllers/Admin/standardConsole');
const { verifyProject } = require('./controllers/Admin/verifyProject');
const { filter_Project } = require('./controllers/Admin/filter_Project');
const { projectApproval } = require('./controllers/Admin/projectApproval');
const { completeProject } = require('./controllers/Admin/completeProject');
const { resetPassword } = require('./controllers/Admin/resetPassword');
const { userKyc } = require('./controllers/User/userKyc');
const { editKyc } = require('./controllers/User/editKyc');
const { withdrawAmt } = require('./controllers/User/withdrawAmt');
const { allWithdrawRequest } = require('./controllers/User/allWithdrawRequest');
const { updateWithdrawStatus } = require('./controllers/User/updateWithdrawStatus');
const { totalEarning } = require('./controllers/User/totalEraning');
const { getHistory } = require('./controllers/User/getHistory');
const { getLogs } = require('./controllers/Admin/getLogs');
const { getUser } = require('./controllers/User/getUser');
const { register2FA } = require('./controllers/Admin/register2FA');
const { verify2FA } = require('./controllers/Admin/verify2FA');
const { reset2FA } = require('./controllers/Admin/reset2FA');
const { handleTimeout } = require('./middleware/handleTimeout');
const { deleteAdmin } = require('./controllers/Admin/deleteAdmin');
const { deleteUser } = require('./controllers/User/deleteUser');
const { createProduct } = require('./controllers/Products/createProduct');
const { editProduct } = require('./controllers/Products/editProduct');
const { deleteProject } = require('./controllers/Products/deleteProduct');

app.use(helmet());
app.use(cors())

app.use('/',require('./router/index'))
//Need to change for upload Avtar
//const upload = multer({ dest: 'uploads/' })
var upload = multer({
    dest: storageValue,
    fileFilter: fileFilterValue,
  });
require('dotenv').config();
const port = process.env.PORT
//json input in body
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use('/uploads', express.static('uploads'));
//Home Directory
app.get('/', (req, res) => res.send('Welcome to IBE Home'))
// //Generate Mobile Otp
// app.post('/generateOtp', generateOtp);
// //Generate Email Otp
// app.post('/generateEmailOtp',generateEmailOtp);
// //verify otp
// //loginRateLimiter middleware to restrict number of retry limits
// app.post('/verifyOtp',loginRateLimiter, verifyOtp);
// //user details from signup page
// app.post('/signup',upload.single('avatar'),userSignup);
// //sign in auth
// app.post('/signin', userSignin);
// //update user details
// app.patch('/userUpdate/:id',verifyUser, userUpdate);
// //create referral and distribute earning
// app.post('/referral',userReferral);
// //fetch user transaction history
// app.get('/transactionHist',verifyUser,userHistory);
// //create project 
// app.post('/createProject', verifyUser,upload.fields([
//     { name: 'Adhar' },
//     { name: 'Pan' },
//     { name: 'cAdhar' },
//     { name: 'cPan' },
//   ]), agentProject)

// //get project details
// app.get('/getProject/:projectId',verifyUser,getProject); 
// //edit/update project details
// app.post('/editProject', verifyUser,upload.fields([
//     { name: 'Adhar' },
//     { name: 'Pan' },
//     { name: 'cAdhar' },
//     { name: 'cPan' },
//   ]),editProject);

// //admin register
// app.post('/adminRegister',adminRegister);
// //admin login
// app.post('/adminLogin',loginRateLimiter, adminLogin);
// //Delete Admin User
// app.post('/deleteadmin',deleteAdmin);
// //Delete User
// app.post('/deleteuser',deleteUser);
// //reset admin password
// app.post('/reset',verifyUser,resetPassword);
// //Super Admin console view page
// app.post('/superAdmin',verifyUser,superAdminConsole);
// //admin console view page
// app.post('/admin',verifyUser,adminConsole);
// //Standard console view page
// app.post('/standard',verifyUser,standardConsole);
//  //fetch all the projects for admin
// app.get('/allProjects',verifyUser, getAllProjects); 
// //verify project
// app.post('/verify/:id',verifyUser, verifyProject);
// //get all verified project for admin approval
// app.get('/filterProjects',verifyUser,filter_Project);
// //project appoval from Admin
// app.post('/approval/:id',verifyUser,projectApproval);
// //mark project as complete
// app.post('/complete/:id',verifyUser,completeProject);
// //user Kyc
// app.post('/kyc',verifyUser,upload.fields([
//   { name: 'Adhar' },
//   { name: 'Pan' },
//   { name: 'Statement_Check' },
// ]),userKyc);
// //update Kyc details
// app.patch('/updateKyc/:id',verifyUser,editKyc);
// //withdraw amount
// app.post('/withdraw',verifyUser,withdrawAmt);
// //fetch all withdraw request
// app.get('/allwithdrawrequest',handleTimeout,allWithdrawRequest)
// //update withdraw status as complete
// app.post('/completewithdraw/:id',verifyUser,updateWithdrawStatus)
// //get History by ID
// app.get('/gethistory/:id',verifyUser, getHistory)
// //get total earning of all type transaction as per origin
// app.post('/totalEarning',verifyUser,totalEarning);
// //get logs provide start date (2023-08-23) and end date (2023-08-24)
// app.get('/logs',verifyUser,getLogs);
// //get user details by employee ID
// app.get('/getuser/:empId',verifyUser,getUser);
// //Register 2FA
// app.post('/generate-2fa',loginRateLimiter,register2FA);
// //Verify 2FA
// app.post('/verify-2fa', loginRateLimiter,verify2FA);
// //Reset 2FA 
// app.post('/reset-2fa',reset2FA);
// //create Product
// app.post('/createproduct',createProduct);
// //edit product
// app.patch('/editproduct/:id',editProduct);
// //delete project
// app.post('/deleteproject/:id', deleteProject);

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   // Fork workers for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//   });
// } else {
//   const server = http.createServer(app);
  
//   server.listen(port, () => {
//     console.log(`Worker ${process.pid} is listening`);
//   });
// }

app.listen(port, () => console.log(`Express Server is listening on port ${port}!`))