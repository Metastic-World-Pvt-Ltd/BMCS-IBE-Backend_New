const logger = require('./logger');
const errorMessages = require('../../response/errorMessages');
const successMessages = require('../../response/successMessages');
const OTP = require('../../models/OTP');

module.exports.verifyOtp = async function(req, res){

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