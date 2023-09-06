const twoFA = require('../../models/2FA');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const nodemailer = require("nodemailer");
const logger = require('../logger');
require('dotenv').config({path:'../.env'});

module.exports.reset2FA = async function(req, res){
try {
    logger.info(`Activated Reset 2FA Endpoint`)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    
    //check for token provided or not
    if(!token){
        return res.status(401).json('Please Provide Token');
    }
    //secret ket to decode token
    const secret = process.env.SECRET_KEY;
    var userRole;
    try {
        const decode = jwt.verify(token , secret);
        
         userRole = decode.role;
    } catch (error) {
        return res.status(403).json(`Token Expired`)
    }
 
    
    //user role decoded from token signature
    
    logger.info(`User Role - ${userRole}`)
    //check for authorization
    if(userRole == "Super_Admin" || userRole == "super_admin"){
        //user input
    const email = req.body.email;
    logger.info(`Input - ${email}`)
    //check email provided or not
    if(!email){
        return res.status(400).json(`Email is required`)
    }
    //check email exist in DB or not
    const user = await twoFA.findOne({email})
    logger.info(`User in DB - ${user}`)
    if(!user){
        logger.error(`No Record Found`)
        return res.status(404).json(`No Record Found`)
    }
    const secretKey = speakeasy.generateSecret({ length: 20 }); // Generate a 20-character secret
    //update secret key in DB
    const userUpdate = await twoFA.findOneAndUpdate({email},{secret:secretKey.base32},{new:true});
    logger.info(`Updated data from DB - ${userUpdate}`)
    // Generate a QR code URL for Google Authenticator
    const otpAuthUrl = speakeasy.otpauthURL({
        secret: secretKey.ascii,
        label: `${email}`, //user email id
        issuer: 'BMCS INDIA', //issuer name 
      });
    
      qrcode.toDataURL(otpAuthUrl, (err, imageUrl) => {
        if (err) {
          logger.error(`Failed to generate QR code`)
          return res.status(500).json({ message: 'Failed to generate QR code' });
        }
       
        // console.log('Url inside fn',url);
         logger.info(`Output - Secret - ${secretKey.base32} ImageURL - ${imageUrl}`)
         sendMail(imageUrl)
        // return res.status(200).json({ secret: secret.base32, imageUrl });
      });
      //send email to client
     async function sendMail(url){
        let testAccount = await nodemailer.createTestAccount();

            //sender email
            var senderEmail = process.env.EMAIL;
            //sender email password
            var userPassword = process.env.EMAIL_PASSWORD;

            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: senderEmail,
                    pass: userPassword
                },
            })
      
        try {
            // console.log("URL outside fn",url);
            let info = await transporter.sendMail({
                from: `no-reply@bmcsindia.in <${senderEmail}>`, // sender address
                to: email, // list of receivers
                subject: "BMCS 2FA Authentication", // Subject line
                text: `Please copy the link to view QR code and scan it ${url} `, // plain text body
                html: `Scan the QR Code <br> <img src="${url}"> `, // html body
            });
            logger.info(`Email info - ${info.response , info.envelope , info.accepted , info.rejected, info.messageId}`)
            // console.log(info);
            // console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
            logger.info(`QR has been send to the email`)
            return res.status(200).json("QR has been send to the email")
        } catch (error) {
            logger.error(`Error - ${error}`)
            return res.status(550).json("No Such User Found");
        }

      }
    }else{
        logger.error(`Access Denied as user Role is ${userRole}`)
        return res.status(403).json(`Access Denied`)
    }
    
} catch (error) {
    logger.error(`Reset 2FA Endpoint Failed`);
    return res.status(500).json(`Something went wrong in reseting 2FA`)
}

}
