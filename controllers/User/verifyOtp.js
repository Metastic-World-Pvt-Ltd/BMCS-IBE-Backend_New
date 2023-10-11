const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const OTP = require('../../models/OTP');

module.exports.verifyOtp = async function(req, res){
    // try {
    //     logger.info(`Start`);
    //     logger.info(successMessages.VERIFY_OTP_ACTIVATED)
    //     //check for user input
    //     const {otp} = req.body;
    //     logger.info(`Input OTP - ${otp}`)
    //     //console.log('email otp',emailOTP.otp);
    //     //check for OTP is same of not
    //    if(OTP.otp == otp || emailOTP.otp == otp){
    //     //check for OTP expire time
    //         if(OTP.expiration > Date.now() || emailOTP.expiration > Date.now()){
    //             logger.info(successMessages.OTP_VERIFIED_SUCCESSFULLY);
    //             logger.info(`End`);
    //             return res.status(200).json(successMessages.OTP_VERIFIED_SUCCESSFULLY);
    //         }else{
    //             logger.error(errorMessages.OTP_EXPIRED)
    //             return res.status(498).json(errorMessages.OTP_EXPIRED);
    //         }       
    //    }else{
    //         logger.error(errorMessages.INVALID_OTP)
    //         return res.status(404).json(errorMessages.INVALID_OTP)
    //    }
    // } catch (error) {
    //     logger.error(errorMessages.VERIFY_OTP_FAILED);
    //     return res.status(500).json(errorMessages.INTERNAL_ERROR)
    // }
    try {
        logger.info(`Start`);
        logger.info(successMessages.VERIFY_OTP_ACTIVATED)
        //check for user input
        const {otp , contact} = req.body;
        logger.info(`Input OTP - ${otp} , ${contact}`)

        const validateOtp = await OTP.findOne({contact});
        console.log(validateOtp);
        if(validateOtp){
            if(validateOtp.otp == otp){
                if(validateOtp.expiration > Date.now() ){
                    return res.status(200).json(successMessages.OTP_VERIFIED_SUCCESSFULLY);
                }else{
                    return res.status(498).json(errorMessages.OTP_EXPIRED);
                }
            }else{
                return res.status(404).json(errorMessages.INVALID_OTP)
            }
        }else{
            return res.status(404).json(errorMessages.INVALID_OTP)
        }
    } catch (error) {
        logger.error(errorMessages.VERIFY_OTP_FAILED);
        return res.status(500).json(errorMessages.INTERNAL_ERROR)
    }

}