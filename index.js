const express = require('express')
const app = express()
const db = require('./mongoose/mongoose');
const { generateOtp } = require('./controllers/generateOtp');
const { verifyOtp } = require('./controllers/verifyOtp');
const { userSignup } = require('./controllers/userSignup');
const multer = require('multer');
const { userSignin } = require('./controllers/userSignin');
const { userUpdate } = require('./controllers/userUpdate');
const upload = multer({ dest: 'uploads/' })
require('dotenv').config();
const port = process.env.PORT
//json input in body
app.use(express.json());
app.use('/uploads', express.static('uploads'));
//Home Directory
app.get('/', (req, res) => res.send('Welcome to IBE Home'))
//Generate Otp
app.post('/generateOtp', generateOtp);
//verify otp
app.post('/verifyOtp', verifyOtp);
//user details from signup page
app.post('/signup',upload.single('avatar'),userSignup);
//sign in auth
app.post('/signin', userSignin);
//update user details
app.patch('/userUpdate/:id',userUpdate);

app.listen(port, () => console.log(`Express Server is listening on port ${port}!`))