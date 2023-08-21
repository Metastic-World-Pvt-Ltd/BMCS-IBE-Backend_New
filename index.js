const express = require('express')
const app = express()
const db = require('./mongoose/mongoose');
const { generateOtp } = require('./controllers/generateOtp');
const { verifyOtp } = require('./controllers/verifyOtp');
const { userSignup } = require('./controllers/userSignup');
const multer = require('multer');
const { userSignin } = require('./controllers/userSignin');
const { userUpdate } = require('./controllers/userUpdate');
const { generateEmailOtp } = require('./controllers/generateEmailOtp');
const { loginRateLimiter } = require('./middleware/loginRateLimiter');
const { verifyUser } = require('./middleware/verifyUser');
const { userReferral } = require('./controllers/userReferral');
const { userHistory } = require('./controllers/userHistory');
const { storageValue, fileFilterValue } = require('./controllers/storage');
const { agentProject } = require('./controllers/agentProject');
const { getProject } = require('./controllers/getProject');
const { editProject } = require('./controllers/editProject');
const { getAllProjects } = require('./controllers/admin/getAllProjects');
const { adminRegister } = require('./controllers/Admin/adminRegister');
const { adminLogin } = require('./controllers/Admin/adminLogin');
const { adminConsole } = require('./controllers/Admin/adminConsole');
const { superAdminConsole } = require('./controllers/Admin/superAdminConsole');
const { standardConsole } = require('./controllers/Admin/standardConsole');
const { verifyProject } = require('./controllers/Admin/verifyProject');


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
app.use('/uploads', express.static('uploads'));
//Home Directory
app.get('/', (req, res) => res.send('Welcome to IBE Home'))
//Generate Mobile Otp
app.post('/generateOtp', generateOtp);
//Generate Email Otp
app.post('/generateEmailOtp',generateEmailOtp);
//verify otp
//loginRateLimiter middleware to restrict number of retry limits
app.post('/verifyOtp',loginRateLimiter, verifyOtp);
//user details from signup page
app.post('/signup',upload.single('avatar'),userSignup);
//sign in auth
app.post('/signin', userSignin);
//update user details
app.patch('/userUpdate/:id',verifyUser, userUpdate);
//create referral and distribute earning
app.post('/referral',userReferral);
//fetch user transaction history
app.get('/transactionHist',userHistory);
//create project 
app.post('/createProject',upload.fields([
    { name: 'Adhar' },
    { name: 'Pan' },
    { name: 'cAdhar' },
    { name: 'cPan' },
  ]), agentProject)

//get project details
app.get('/getProject/:projectId',getProject); 
//edit/update project details
app.post('/editProject',upload.fields([
    { name: 'Adhar' },
    { name: 'Pan' },
    { name: 'cAdhar' },
    { name: 'cPan' },
  ]),editProject);

//admin register
app.post('/adminRegister',adminRegister);
//admin login
app.post('/adminLogin', adminLogin);
//Super Admin console view page
app.post('/superAdmin',superAdminConsole);
//admin console view page
app.post('/admin',adminConsole);
//Standard console view page
app.post('/standard',standardConsole);
 //fetch all the projects for admin
app.get('/allProjects', getAllProjects); 
//verify project
app.post('/verify/:id', verifyProject);


app.listen(port, () => console.log(`Express Server is listening on port ${port}!`))