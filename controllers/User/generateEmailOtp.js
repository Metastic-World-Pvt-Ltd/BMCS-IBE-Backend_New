const nodemailer = require("nodemailer");
const logger = require("./logger");
require('dotenv').config({path:'../../.env'});
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');

module.exports.generateEmailOtp = async function(req, res){
    try {
        logger.info(successMessages.GENERATE_EMAIL_OTP_ACTIVATED)
            //user email address
            var useremail = req.body.email;
            logger.info(`Input - ${req.body}`)

            const data = Math.floor(Math.random() * 9000) + 1000;
            var otp = data.toString();
            //set otp expiry time
            const expiration= Date.now() + 120000;
            logger.info(`OTP - ${otp}`)    
            module.exports.expiration = expiration;
        // console.log(otp)
            module.exports.otp = otp;

            let testAccount = await nodemailer.createTestAccount();

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
                to: useremail, // list of receivers
                subject: "OTP Verification", // Subject line
                text: `Enter the ${otp} to verify you Please do not share the OTP `, // plain text body
                html: `Enter the <b>${otp}</b> to verify you Please do not share the OTP `, // html body
            });
            logger.info(`Email info - ${info.response , info.envelope , info.accepted , info.rejected, info.messageId}`)
            //console.log(info);
            // console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
            // Preview only available when sending through an Ethereal account
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            logger.info(successMessages.EMAIL_OTP_SENT_SUCCESSFULLY)
            res.send(successMessages.EMAIL_OTP_SENT_SUCCESSFULLY)
        } catch (error) {
            logger.error(`Error - ${error}`)
            res.json(error);
        }
    } catch (error) {
        logger.error(errorMessages.GENERATE_EMAIL_OTP_FAILED)
        res.status(500).json(errorMessages.INTERNAL_ERROR)
    }
}