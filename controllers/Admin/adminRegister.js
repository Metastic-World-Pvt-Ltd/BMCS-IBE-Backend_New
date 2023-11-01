const AdminUser = require('../../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
require('dotenv').config({path:'../../.env'});
const logger = require('../User/logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
module.exports.adminRegister = async function(req, res){
// try {
    logger.info(`Start`);
    logger.info(successMessages.ADMIN_REGISTER_ACTIVATED)
    //input data
    if(!req.body){
        return res.status(400).json(errorMessages.INVALID_INPUT)
    }
    const {name , email , password, role}  = req.body;
    logger.info(`Input - ${name} , ${email} , ${password}, ${role}}`)
    var token = req.body.token || req.query.token || req.headers["x-access-token"];
    //check for token provided or not
    if(!token){
        return res.status(401).json(errorMessages.TOKEN_NOT_FOUND);
    }
    var userRole;
    // try {
        //decode token signature
        const secret = process.env.SECRET_KEY;
         // Decrypt
         var bytes  = CryptoJS.AES.decrypt(token, secret);
         token = bytes.toString(CryptoJS.enc.Utf8);
        const decode = jwt.verify(token , secret);
        
    //check for user role as per token
         userRole = decode.role;
         var createdBy = decode.email;
    // } catch (error) {
    //     return res.status(401).json(errorMessages.TOKEN_EXPIRED)
    // }
    logger.info(`User Role - ${userRole}`)
    //check condition user specific role
    
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        createUser(name , email, password , role , createdBy);
        sendEmail(name , role , email, password ,);
    }else if(userRole == "Admin" || userRole == "admin"){
        //admin can only create standard user
        if(role == "Standard" || role == "standard"){
            createUser(name , email, password , role , createdBy);
            sendEmail(name , role , email, password );
        }else{
            logger.error(errorMessages.ACCESS_DENIED)
            return res.status(403).json(errorMessages.ACCESS_DENIED)
        }
    }else{
        logger.error(errorMessages.ACCESS_DENIED)
        return res.status(403).json(errorMessages.ACCESS_DENIED)
    }
    //define fucntion to create user
    async function createUser(name , email, password , role){
        if(!name || !email || !password || !role){
            //console.log('All fields are Mandatory');
            logger.error(errorMessages.INVALID_INPUT)
            return res.status(400).json({error:errorMessages.INVALID_INPUT})
        }
        //check for email or user exist
        const isExist = await AdminUser.findOne({email:email})
        if(isExist){
            logger.error(errorMessages.EMAIL_EXIST)
            return res.status(422).json({error:errorMessages.EMAIL_EXIST})
        }
        try {
         
            //create user in DB
            const userData = new  AdminUser({
                name , email , password , role , createdBy , set2FA:false
            })
            await userData.save();
            //console.log(userData);
            logger.info(`Output - ${userData}`)
            logger.info(`End`);
            //response1
            res.status(200).json({name:userData.name , email:userData.email});
        } catch (error) {
            logger.error(error)
            return res.json(error);   
        }
    }
// } catch (error) {
//     logger.error(errorMessages.ADMIN_REGISTER_FAILED)
//     return res.status(500).json(errorMessages.INTERNAL_ERROR)
// }
}

async function sendEmail(username , role  , email , password){
    let testAccount = await nodemailer.createTestAccount();
            const url = 'http://localhost:4000/admin';
            //sender email
            var senderEmail = process.env.EMAIL;
            //sender email password
            var userPassword = process.env.EMAIL_PASSWORD;

            let transporter = nodemailer.createTransport({
                host:process.env.EMAIL_HOST,
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: senderEmail,
                    pass: userPassword
                },
            })
      
        try {
            let info = await transporter.sendMail({
                from: `no-reply@bmcsindia.in <${senderEmail}>`, // sender address
                to: email, // list of receivers
                subject: "User Creation BMCS India", // Subject line
                text: `Hi ${username} ,
                we have created your account with ${role} access 
                Please find the details below
                URL - ${url}
                Username - ${email}
                Password - ${password}
                
                Thanks
                Support Team`, // plain text body
                html: `Hi <b>${username}</b> ,<br><br> we have created your account with <b>${role}</b> access <br><br>
                Please find the details below <br><br>
                <b>URL</b> - ${url} <br>
                <b>Username</b > - ${email} <br>
                <b>Password</b> - ${password} <br>
                <br><br><br><br>
                Thanks <br> <b>Support Team</b>` // html body
            });
            logger.info(`Email info - ${info.response , info.envelope , info.accepted , info.rejected, info.messageId}`)
            //console.log(info);
            // console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
            // Preview only available when sending through an Ethereal account
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            logger.info(successMessages.EMAIL_OTP_SENT_SUCCESSFULLY)
            logger.info(`End`);
            //return res.status(200).json(successMessages.EMAIL_OTP_SENT_SUCCESSFULLY)
        } catch (error) {
            logger.error(`Error - ${error}`)
            //return res.json(error);
        }

}