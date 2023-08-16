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
const upload = multer({ dest: 'uploads/' })
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

app.listen(port, () => console.log(`Express Server is listening on port ${port}!`))