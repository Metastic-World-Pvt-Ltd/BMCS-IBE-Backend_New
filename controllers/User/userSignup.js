const User = require('../../models/User');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require("nodemailer");
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
var CryptoJS = require("crypto-js");
module.exports.userSignup = async function(req, res){
    
    try {
        logger.info(`Start`);
        logger.info(successMessages.USER_SIGN_UP_ACTIVATED)
        //secret key
        const secret = process.env.SECRET_KEY;
        //generate employee ID
        const data = await User.countDocuments();
    
        const year = new Date().getFullYear();
        const lastTwoDigits = year % 100;
        
        const str = 'BMCS';
        let formattedNumber;
        counter = data + 1;
        if (counter < 10) {
            formattedNumber = counter.toString().padStart(4, '0');
        } else if (counter < 100) {
            formattedNumber = counter.toString().padStart(4, '0');
        }else if (counter < 1000) {
            formattedNumber = counter.toString().padStart(4, '0');
        }
         else {
            formattedNumber = counter.toString();
            
        }
        const empId = str+lastTwoDigits+formattedNumber
        //user input
        var {contact , firstName , lastName , gender , email , userRole , role , refId } = req.body;
        logger.info(`Input - ${contact} , ${firstName} , ${lastName} , ${gender} , ${email} , ${userRole} , ${role} , ${refId}`)
       // console.log(req.body);
        if(!contact ,!firstName ,!lastName ,!gender ,!email ,!userRole ,!role ,!refId){
            logger.error(errorMessages.ALL_FIELDS_REQUIRED)
            return res.status(400).json(errorMessages.ALL_FIELDS_REQUIRED)
        }
        //var newPath;
        const maxLevel = 15;

        const isContact = await User.findOne({contact});
        //check for email exist or not
        const isEmail = await User.findOne({email});

        //console.log(isContact);
        if(isContact || isEmail){
            logger.error(errorMessages.EMAIL_AND_CONTACT_EXIST)
            return res.status(422).json(errorMessages.EMAIL_AND_CONTACT_EXIST)
        }else{
            const cleanedNumber = contact.replace(/\D/g, '');
            // var number ;
            // If the number starts with the country code (e.g., +91), remove it
            if (cleanedNumber.startsWith('91')) {
                contact =  cleanedNumber.slice(2);
                // console.log(number);
              //return number
            }
                    //check userRole
        if(userRole == 'Admin'){
            const refId = contact;
            const refCount = 0;
            const level = 'Admin';
            const refBy = 'Admin';
            var isKyc = "false";
            var setPin = "false";
            var userStatus = 'Active';
            const userDoc = await User.create({
                contact ,empId, firstName , lastName,gender , email , userRole , role  , level , refId , refCount, refBy,userStatus,setPin , isKyc
            })
            logger.info(`Output - ${userDoc}`)
            sendEmail(userDoc.email , userDoc.firstName)
            //generate token for user
            jwt.sign({contact,firstName} , secret , { algorithm: 'HS512', expiresIn: '90d' } , (err,token)=>{
                if(err) throw new err;
                //logger.info(`Token - ${token}`)
                
                //function to encypt Token
                const newToken =  encToken(token);
                
                logger.info(`End`);
                return res.status(200).json({newToken , userDoc})
            })
           // res.status(200).json(userDoc);
        }else{
            //referral check
            logger.info(`Referral Id - ${refId}`)
            const refExist = await User.findOne({refId:refId});
            console.log(refExist);
            if(refExist){
                
                    var level ;
            console.log(refExist);
                    if(refExist.refBy == 'Admin'){
                        level = 1;
                        console.log("level",level);
                    }else{
                        
                        level = parseInt(refExist.level) + 1;
                        console.log("level2",level);
                    }
                    const refId = contact;
                    const refCount = 0;
                    //update ref count for user
                    const _id = refExist.id;
                    const refExitCount = parseInt(refExist.refCount) + 1;
                   const updateRef =  await User.findByIdAndUpdate(_id, {refCount:refExitCount})
                   //console.log("update ref",updateRef);
                   const refBy = refExist.refId;
                   console.log("refby",refBy);
                    //create user
                    var isKyc = "false";
                    var setPin = "false";
                    var userStatus =  'Active';
                    const userDoc = await User.create({
                    contact ,empId, firstName , lastName , gender, email , userRole , role  , level , refId , refCount, refBy, userStatus ,setPin,isKyc,
                })
                logger.info(`Output - ${userDoc}`)
                //generate token for user
                sendEmail(userDoc.email , userDoc.firstName)
                    jwt.sign({contact,firstName} , secret , { algorithm: 'HS512', expiresIn: '90d' } , (err,token)=>{
                        if(err) throw new err;
                        //function to encypt Token
                        
                        const newToken =  encToken(token);
                        
                        logger.info(`End`);
                        return res.status(200).json({newToken , userDoc})
                    })

            }else{
                logger.error(errorMessages.REFID_DOSE_NOT_EXIST)
                return res.status(404).json(errorMessages.REFID_DOSE_NOT_EXIST);
            }
        }
        }

    } catch (error) {
        logger.error(errorMessages.USER_SIGNUP_FAILED)
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }

}

 function encToken(token){
    const secret = process.env.SECRET_KEY;
    var token =  CryptoJS.AES.encrypt(token, secret).toString();
    return token;
}

async function sendEmail(useremail,name){
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

// try {
    console.log("useremail",useremail);
    let info = await transporter.sendMail({
        from: `no-reply@bmcsindia.in <${senderEmail}>`, // sender address
        to: useremail, // list of receivers
        subject: "Welcome to BMCS", // Subject line
        text: `Dear ${name},

        Welcome to BMCS
        We're delighted to have you on board.
        
        Thank you for choosing us, and we look forward to serving you.
        
        Best Regards,
        [Team BMCS]
        [https://bmcsindia.in/]
         `, // plain text body
        html: `  
        <div >

          
        <div style="text-align: center;">
            <img style="border: 2px solid #333;" src="https://bmcsfileserver.s3.amazonaws.com/BMCS+(1).png" alt="Logo">
            <br><br><br>
            Dear <b>${name}</b>,
            <br><br>
            <p>Welcome to <b>BMCS India</b></p> 
        </div>
        <div style="position: relative ;left: 100px;">
            <p> Congratulations on taking the first step toward financial empowerment. <br> We're excited to have you on board and to help you take control of your financial future.
                Here's what you can expect from <b>Bureauology Management Consultancy Pvt. Ltd.</b></p>
                <p><b>Manage your finances with ease:</b> Keep track of your income, expenses, and investments all in one place.</p>
                <p><b>Invest wisely:</b> Explore investment opportunities, get insights, and grow your wealth.</p>
                <p><b>Secure and private:</b> Your financial data is important to us. Rest assured, your information is safe and private.</p>
                <p><b>Stay informed:</b> Get the latest updates on financial news and trends to make informed decisions.</p>
                <p><b>Budget and plan:</b> Set financial goals, create budgets, and plan for your future with our easy-to-use tools.</p>
                <p>If you ever have questions, need assistance, or want to provide feedback, our support team is here to help. <br> We're committed to making your financial journey as smooth as possible.
                    Your financial success begins now with <b>BMCS</b>. Welcome to a world of financial possibilities!</p>
            </p>
                </div>
            <br><br>
            <div style="text-align: center;">

            
            <b>Best Regards,</b>
            <br>
            <b>Team <b>BMCS</b></b>

            <br> <br>
            Support :- <a href="mailto:support@bmcsindia.in">support@bmcsindia.in</a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            visit us :- <a href="https://bmcsindia.in">https://bmcsindia.in</a>
            <br> <br>
            Follow us on
            <br> <br>
            
            <div style="margin-bottom: 50px;">
            <a href="https://www.instagram.com/bmcs_india/"><img style="height: 40px; width: 40px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png" alt="Instagram"></a> &nbsp;&nbsp;
            <a href="https://www.linkedin.com/company/bmcsindia"><img style="height: 40px; width: 40px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/1200px-LinkedIn_icon.svg.png" alt="LinkedIn"><a> &nbsp;&nbsp;
            <a href="https://www.youtube.com/channel/UCA3pcjuK89SSV1sKIw1Bd6A"><img style="height: 40px; width: 40px;" src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052" alt="Youtube"></a> &nbsp;&nbsp;
            <a href="https://www.facebook.com/bmcsindiaofficial"><img style="height: 40px; width: 40px;" src="https://i.pinimg.com/originals/ce/d6/6e/ced66ecfc53814d71f8774789b55cc76.png" alt="Facebook"></a>
            </div>
        </div>
</div>
        `, // html body
    });
    logger.info(`Email info - ${info.response , info.envelope , info.accepted , info.rejected, info.messageId}`)
    //console.log(info);
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    logger.info(successMessages.EMAIL_OTP_SENT_SUCCESSFULLY)
    logger.info(`End`);
    return (successMessages.EMAIL_OTP_SENT_SUCCESSFULLY)
// } catch (error) {
//     logger.error(`Error - ${error}`)
//     return (error);
// }
}