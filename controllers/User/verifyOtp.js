const OTP = require('./generateOtp');
const emailOTP = require('./generateEmailOtp');
const logger = require('./logger');
const errorMessages = require('../errorMessages');
const successMessages = require('../successMessages');

module.exports.verifyOtp = async function(req, res){
    try {
        logger.info(successMessages.VERIFY_OTP_ACTIVATED)
        //check for user input
        const {otp} = req.body;
        logger.info(`Input OTP - ${otp}`)
        //console.log('email otp',emailOTP.otp);
        //check for OTP is same of not
       if(OTP.otp == otp || emailOTP.otp == otp){
        //check for OTP expire time
            if(OTP.expiration > Date.now() || emailOTP.expiration > Date.now()){
                logger.info(successMessages.OTP_VERIFIED_SUCCESSFULLY);
                res.status(200).json(successMessages.OTP_VERIFIED_SUCCESSFULLY);
            }else{
                logger.error(errorMessages.OTP_EXPIRED)
                res.status(498).json(errorMessages.OTP_EXPIRED);
            }       
       }else{
            logger.error(errorMessages.INVALID_OTP)
            res.status(404).json(errorMessages.INVALID_OTP)
       }
    } catch (error) {
        logger.error(errorMessages.VERIFY_OTP_FAILED);
        res.status(500).json(errorMessages.INTERNAL_ERROR)
    }

}