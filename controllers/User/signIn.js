const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const OTP = require('../../models/OTP');
require('dotenv').config({path:'../../.env'});
var CryptoJS = require("crypto-js");
module.exports.signIn =  async function(req, res){
try {

    const {otp , contact , email} = req.body;
    
    if(contact){
        console.log("contact",contact);
       const result = await verifyMobileOtp(otp , contact);
        console.log("result",result);
        if(result == `OTP Verified Successfully`){
            const cleanedNumber = contact.replace(/\D/g, '');
            var number ;
            // If the number starts with the country code (e.g., +91), remove it
            if (cleanedNumber.startsWith('91')) {
                number =  cleanedNumber.slice(2);
                console.log(number);
              //return number
            }
            const userDoc = await User.findOne({contact:number});
            if(userDoc){
                
               //generate token for user
               logger.info(`User found in DB`)
               
               const secret = process.env.SECRET_KEY;
                jwt.sign({contact,id:userDoc._id } , secret , { algorithm: 'HS512' } , (err,token)=>{
                  if(err) throw new err;
                  logger.info(`UserDoc - ${userDoc}`)
                  logger.info(`End`);   
                  var newToken =  encToken(token);
                 
                  return res.status(200).json({newToken , userDoc})
                   })
               // res.status(200).json('user verified')
            }else{
                logger.error(errorMessages.USER_DOES_NOT_EXIST)
                return res.status(404).json(errorMessages.USER_DOES_NOT_EXIST)
            }
        }else if(result == `Invalid OTP`){
            return res.status(404).json(errorMessages.INVALID_OTP)
        }else if(result == `OTP has been expired`){
            return res.status(498).json(errorMessages.OTP_EXPIRED)
        }else{
            return res.json(errorMessages.SOMETHING_WENT_WRONG);
        }  


  

    }else if(email){
        console.log("email",email);
       const result = await verifyEmailOtp(otp ,email);
        console.log("result",result);
        if(result == `OTP Verified Successfully`){
            logger.info(`Input - ${email}`)
            const userDoc = await User.findOne({email});
            if(userDoc){

               //generate token for user
               logger.info(`User found in DB`)
               
               const secret = process.env.SECRET_KEY;
                jwt.sign({contact,id:userDoc._id } , secret , { algorithm: 'HS512', expiresIn: '90d' } , (err,token)=>{
                  if(err) throw new err;
                    logger.info(`UserDoc - ${userDoc}`)
                    logger.info(`End`);
                    var newToken =  encToken(token);
                   
                    return res.status(200).json({newToken , userDoc})
                   })
               // res.status(200).json('user verified')
            }else{
                logger.error(errorMessages.USER_DOES_NOT_EXIST)
                return res.status(404).json(errorMessages.USER_DOES_NOT_EXIST)
            }
        }else if(result == `Invalid OTP`){
            return res.status(404).json(errorMessages.INVALID_OTP)
        }else if(result == `OTP has been expired`){
            return res.status(498).json(errorMessages.OTP_EXPIRED)
        }else{
            return res.json(errorMessages.SOMETHING_WENT_WRONG);
        }      
    


    }else{
        return res.json(errorMessages.SOMETHING_WENT_WRONG)
    }


//Email OTP Function
    async function verifyEmailOtp(otp , email){
    
        //check for user input
        // const {otp , email} = req.body;
        logger.info(`Input OTP - ${otp} , ${email}`)

        const validateOtp = await OTP.findOne({email});
        
        if(validateOtp){
            if(validateOtp.otp == otp){
                if(validateOtp.expiration > Date.now() ){
                    logger.info(successMessages.OTP_VERIFIED_SUCCESSFULLY)
                    return (successMessages.OTP_VERIFIED_SUCCESSFULLY);
                }else{
                    logger.error(errorMessages.OTP_EXPIRED)
                    return (errorMessages.OTP_EXPIRED);
                }
            }else{
                logger.error(errorMessages.INVALID_OTP)
                return (errorMessages.INVALID_OTP)
            }
        }else{
            logger.error(errorMessages.INVALID_OTP)
            return (errorMessages.INVALID_OTP)
        }
    }
//Mobile OTP Function
    async function  verifyMobileOtp(otp ,contact){
      
        //check for user input
        // const {otp , contact} = req.body;
        logger.info(`Input OTP - ${otp} , ${contact}`)

        const validateOtp = await OTP.findOne({contact});
        console.log(validateOtp);
        if(validateOtp){
            if(validateOtp.otp == otp){
                if(validateOtp.expiration > Date.now() ){
                    logger.info(successMessages.OTP_VERIFIED_SUCCESSFULLY)
                    return (successMessages.OTP_VERIFIED_SUCCESSFULLY);
                }else{
                    logger.error(errorMessages.OTP_EXPIRED)
                    return (errorMessages.OTP_EXPIRED);
                }
            }else{
                logger.error(errorMessages.INVALID_OTP)
                return (errorMessages.INVALID_OTP)
            }
        }else{
            logger.error(errorMessages.INVALID_OTP)
            return (errorMessages.INVALID_OTP)
        }  
    }


} catch (error) {
    logger.error(errorMessages.USER_SIGN_IN_FAILED)
    return res.status(500).json(errorMessages.INTERNAL_ERROR)
}
}


 function encToken(token){
    const secret = process.env.SECRET_KEY;
    var token =  CryptoJS.AES.encrypt(token, secret).toString();
    return token;
}